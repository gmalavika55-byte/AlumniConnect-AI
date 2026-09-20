package com.alumniconnect.mentorship.serviceimpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.alumniconnect.mentorship.client.AIMatchingClient;
import com.alumniconnect.mentorship.dto.AIMatchingRequest;
import com.alumniconnect.mentorship.dto.AIMatchingRequest.AlumniProfileDTO;
import com.alumniconnect.mentorship.dto.AIMatchingRequest.StudentProfileDTO;
import com.alumniconnect.mentorship.dto.AIMatchingResponse;
import com.alumniconnect.mentorship.service.AIMatchingService;

@Service
public class AIMatchingServiceImpl implements AIMatchingService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private AIMatchingClient aiMatchingClient;

    @Value("${auth-service.url}")
    private String authServiceUrl;

    @Override
    public AIMatchingResponse getRecommendationsForStudent(Integer studentId) {
        if (studentId == null) {
            return new AIMatchingResponse(new ArrayList<>());
        }

        // 1. Fetch Student from auth-service
        Map<?, ?> studentMap = null;
        try {
            studentMap = restTemplate.getForObject(authServiceUrl + "/student/get/" + studentId, Map.class);
        } catch (Exception e) {
            System.err.println("Error fetching student ID " + studentId + " from auth-service: " + e.getMessage());
            return new AIMatchingResponse(new ArrayList<>());
        }

        if (studentMap == null) {
            return new AIMatchingResponse(new ArrayList<>());
        }

        StudentProfileDTO studentDTO = new StudentProfileDTO();
        studentDTO.setId(studentId);
        studentDTO.setCareerGoal(getSafeString(studentMap.get("careerGoal")));
        studentDTO.setCourse(getSafeString(studentMap.get("course")));
        studentDTO.setDepartment(getSafeString(studentMap.get("department")));
        studentDTO.setSkills(getSafeString(studentMap.get("skills")));

        // 2. Fetch all Alumni from auth-service
        List<?> alumniList = null;
        try {
            alumniList = restTemplate.getForObject(authServiceUrl + "/alumni/getall", List.class);
        } catch (Exception e) {
            System.err.println("Error fetching alumni list from auth-service: " + e.getMessage());
            alumniList = new ArrayList<>();
        }

        if (alumniList == null) alumniList = new ArrayList<>();

        // 3. Filter Alumni where AVAILABLE_FOR_MENTORSHIP = "YES" or "Yes"
        List<AlumniProfileDTO> availableAlumni = new ArrayList<>();
        for (Object obj : alumniList) {
            if (!(obj instanceof Map)) continue;
            Map<?, ?> aMap = (Map<?, ?>) obj;

            String avail = getSafeString(aMap.get("availableForMentorship"));
            if ("YES".equalsIgnoreCase(avail) || "TRUE".equalsIgnoreCase(avail)) {
                AlumniProfileDTO aDTO = new AlumniProfileDTO();
                Object idObj = aMap.get("alumniId") != null ? aMap.get("alumniId") : aMap.get("id");
                if (idObj instanceof Number) {
                    aDTO.setId(((Number) idObj).intValue());
                } else if (idObj != null) {
                    try {
                        aDTO.setId(Integer.parseInt(idObj.toString()));
                    } catch (Exception ignored) {}
                }

                aDTO.setName(getSafeString(aMap.get("name")));
                aDTO.setDesignation(getSafeString(aMap.get("designation")));
                aDTO.setDepartment(getSafeString(aMap.get("department")));
                aDTO.setSkills(getSafeString(aMap.get("skills")));
                aDTO.setCurrentCompany(getSafeString(aMap.get("currentCompany")));

                Object expObj = aMap.get("experience");
                if (expObj instanceof Number) {
                    aDTO.setExperience(((Number) expObj).doubleValue());
                } else if (expObj != null) {
                    try {
                        aDTO.setExperience(Double.parseDouble(expObj.toString()));
                    } catch (Exception ignored) {
                        aDTO.setExperience(0.0);
                    }
                } else {
                    aDTO.setExperience(0.0);
                }

                availableAlumni.add(aDTO);
            }
        }

        if (availableAlumni.isEmpty()) {
            return new AIMatchingResponse(new ArrayList<>());
        }

        // 4. Build AI request and call Python AI service
        AIMatchingRequest request = new AIMatchingRequest(studentDTO, availableAlumni);
        return aiMatchingClient.getRecommendations(request);
    }

    private String getSafeString(Object obj) {
        if (obj == null) return "";
        return obj.toString().trim();
    }
}
