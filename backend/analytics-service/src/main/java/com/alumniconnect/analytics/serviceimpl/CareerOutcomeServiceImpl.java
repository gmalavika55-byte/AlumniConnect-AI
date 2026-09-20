package com.alumniconnect.analytics.serviceimpl;

import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.alumniconnect.analytics.entity.CareerOutcome;
import com.alumniconnect.analytics.exception.ResourceNotFoundException;
import com.alumniconnect.analytics.repository.CareerOutcomeRepository;
import com.alumniconnect.analytics.service.CareerOutcomeService;

@Service
public class CareerOutcomeServiceImpl implements CareerOutcomeService {

    @Autowired
    private CareerOutcomeRepository repository;

    @Autowired
    private org.springframework.web.client.RestTemplate restTemplate;

    @org.springframework.beans.factory.annotation.Value("${auth-service.url:http://localhost:8101}")
    private String authServiceUrl;

    @Override
    public CareerOutcome createCareerOutcome(CareerOutcome outcome) {
        validateOutcome(outcome);
        CareerOutcome saved = repository.save(outcome);
        try {
            java.util.Map<String, Object> adminNotifPayload = new java.util.HashMap<>();
            adminNotifPayload.put("userId", saved.getOutcomeId().longValue());
            adminNotifPayload.put("userType", "ADMIN");
            adminNotifPayload.put("title", "Career Outcome Data Updated");
            adminNotifPayload.put("message", "New career outcome record created for department " + saved.getDepartment() + ".");
            adminNotifPayload.put("notificationDate", java.time.LocalDateTime.now().toString());
            adminNotifPayload.put("status", "UNREAD");

            restTemplate.postForObject(authServiceUrl + "/notification/add", adminNotifPayload, Object.class);
        } catch (Exception e) {}
        return saved;
    }

    @Override
    public List<CareerOutcome> getAllCareerOutcomes() {
        return repository.findAll();
    }

    @Override
    public CareerOutcome getCareerOutcomeById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CareerOutcome not found with ID: " + id));
    }

    @Override
    public CareerOutcome updateCareerOutcome(Integer id, CareerOutcome outcome) {
        CareerOutcome existing = getCareerOutcomeById(id);
        validateOutcome(outcome);

        existing.setStudentId(outcome.getStudentId());
        existing.setGraduationYear(outcome.getGraduationYear());
        existing.setDepartment(outcome.getDepartment());
        existing.setCgpa(outcome.getCgpa());
        existing.setSkills(outcome.getSkills());
        existing.setCareerGoal(outcome.getCareerGoal());
        existing.setPlacementStatus(outcome.getPlacementStatus());
        existing.setCompany(outcome.getCompany());
        existing.setJobRole(outcome.getJobRole());
        existing.setPackageLpa(outcome.getPackageLpa());
        existing.setPlacementYear(outcome.getPlacementYear());

        CareerOutcome saved = repository.save(existing);
        try {
            java.util.Map<String, Object> adminNotifPayload = new java.util.HashMap<>();
            adminNotifPayload.put("userId", saved.getOutcomeId().longValue());
            adminNotifPayload.put("userType", "ADMIN");
            adminNotifPayload.put("title", "Career Outcome Data Updated");
            adminNotifPayload.put("message", "Career outcome record #" + saved.getOutcomeId() + " updated.");
            adminNotifPayload.put("notificationDate", java.time.LocalDateTime.now().toString());
            adminNotifPayload.put("status", "UNREAD");

            restTemplate.postForObject(authServiceUrl + "/notification/add", adminNotifPayload, Object.class);
        } catch (Exception e) {}
        return saved;
    }

    @Override
    public CareerOutcome updateCareerOutcome(CareerOutcome outcome) {
        if (outcome == null || outcome.getOutcomeId() == null) {
            throw new IllegalArgumentException("Outcome ID must be provided for update.");
        }
        return updateCareerOutcome(outcome.getOutcomeId(), outcome);
    }

    @Override
    public void deleteCareerOutcome(Integer id) {
        CareerOutcome existing = getCareerOutcomeById(id);
        repository.delete(existing);
    }

    @Override
    public List<CareerOutcome> findByDepartment(String department) {
        return repository.findByDepartment(department);
    }

    @Override
    public List<CareerOutcome> findByPlacementStatus(String placementStatus) {
        return repository.findByPlacementStatus(placementStatus);
    }

    private void validateOutcome(CareerOutcome outcome) {
        if (outcome == null) {
            throw new IllegalArgumentException("CareerOutcome object cannot be null.");
        }
        if (outcome.getDepartment() == null || outcome.getDepartment().trim().isEmpty()) {
            throw new IllegalArgumentException("Department cannot be blank.");
        }
        if (outcome.getPlacementStatus() == null || outcome.getPlacementStatus().trim().isEmpty()) {
            throw new IllegalArgumentException("Placement status cannot be blank.");
        }

        String statusUpper = outcome.getPlacementStatus().trim().toUpperCase();
        if (!statusUpper.equals("PLACED") && !statusUpper.equals("NOT_PLACED")) {
            throw new IllegalArgumentException("Placement status must be 'PLACED' or 'NOT_PLACED'.");
        }
        outcome.setPlacementStatus(statusUpper);

        if (outcome.getGraduationYear() != null && (outcome.getGraduationYear() < 1900 || outcome.getGraduationYear() > 2100)) {
            throw new IllegalArgumentException("Graduation year must be a valid 4-digit year.");
        }
        if (outcome.getPlacementYear() != null && (outcome.getPlacementYear() < 1900 || outcome.getPlacementYear() > 2100)) {
            throw new IllegalArgumentException("Placement year must be a valid 4-digit year.");
        }
        if (outcome.getCgpa() != null && (outcome.getCgpa() < 0.0 || outcome.getCgpa() > 10.0)) {
            throw new IllegalArgumentException("CGPA must be between 0.0 and 10.0.");
        }
        if (outcome.getPackageLpa() != null && outcome.getPackageLpa() < 0.0) {
            throw new IllegalArgumentException("Package LPA cannot be negative.");
        }

        // If NOT_PLACED, ensure default empty strings and 0.0 package
        if (statusUpper.equals("NOT_PLACED")) {
            if (outcome.getCompany() == null) outcome.setCompany("");
            if (outcome.getJobRole() == null) outcome.setJobRole("");
            if (outcome.getPackageLpa() == null) outcome.setPackageLpa(0.0);
        }
    }

    @Override
    public void seedInitialDemoData() {
        if (repository.count() > 0) {
            return;
        }

        List<CareerOutcome> demoList = Arrays.asList(
            new CareerOutcome(null, null, 2024, "CSE", 8.9, "Java, Spring Boot, SQL, React", "Software Developer", "PLACED", "TCS", "Systems Engineer", 7.2, 2024),
            new CareerOutcome(null, null, 2024, "CSE", 9.2, "Python, Machine Learning, Data Structures", "Data Scientist", "PLACED", "Zoho", "Data Engineer", 12.5, 2024),
            new CareerOutcome(null, null, 2024, "CSE", 7.8, "JavaScript, React, Node.js, HTML/CSS", "Frontend Developer", "PLACED", "Wipro", "Project Engineer", 6.5, 2024),
            new CareerOutcome(null, null, 2024, "CSE", 6.2, "Java, C++", "Software Developer", "NOT_PLACED", "", "", 0.0, 2024),
            new CareerOutcome(null, null, 2024, "CSE", 8.4, "AWS, Docker, Linux, Java", "Cloud Engineer", "PLACED", "Accenture", "Cloud Associate", 8.4, 2024),
            new CareerOutcome(null, null, 2024, "IT", 8.7, "Java, Spring Boot, Microservices", "Backend Developer", "PLACED", "Infosys", "Specialist Programmer", 9.5, 2024),
            new CareerOutcome(null, null, 2024, "IT", 8.1, "Python, SQL, Tableau, Power BI", "Data Analyst", "PLACED", "Cognizant", "Data Analyst Trainee", 6.8, 2024),
            new CareerOutcome(null, null, 2024, "IT", 7.5, "JavaScript, Angular, SQL", "Web Developer", "PLACED", "Capgemini", "Software Analyst", 5.5, 2024),
            new CareerOutcome(null, null, 2024, "IT", 5.8, "HTML, CSS, Basics Java", "Software Engineer", "NOT_PLACED", "", "", 0.0, 2024),
            new CareerOutcome(null, null, 2024, "IT", 9.4, "Java, Kubernetes, React, Python", "Full Stack Developer", "PLACED", "Amazon", "Software Development Engineer", 18.0, 2024),
            new CareerOutcome(null, null, 2024, "ECE", 8.2, "Embedded C, Microcontrollers, IoT", "Embedded Engineer", "PLACED", "Bosch", "Embedded Software Engineer", 7.8, 2024),
            new CareerOutcome(null, null, 2024, "ECE", 8.5, "VLSI, Verilog, Digital Electronics", "VLSI Engineer", "PLACED", "Qualcomm", "Associate Hardware Engineer", 14.2, 2024),
            new CareerOutcome(null, null, 2024, "ECE", 7.2, "Python, Networking, Linux", "Network Engineer", "PLACED", "Cisco", "Network Analyst", 9.0, 2024),
            new CareerOutcome(null, null, 2024, "ECE", 6.4, "C, Basic Circuits", "Hardware Engineer", "NOT_PLACED", "", "", 0.0, 2024),
            new CareerOutcome(null, null, 2024, "ECE", 7.9, "C++, Signal Processing, MATLAB", "Systems Engineer", "PLACED", "TCS", "Assistant Systems Engineer", 4.5, 2024),
            new CareerOutcome(null, null, 2024, "EEE", 8.3, "Power Systems, MATLAB, PLC", "Electrical Engineer", "PLACED", "Schneider Electric", "Graduate Engineer Trainee", 6.5, 2024),
            new CareerOutcome(null, null, 2024, "EEE", 7.6, "SCADA, AutoCAD Electrical, C", "Control Systems Engineer", "PLACED", "L&T", "Project Engineer", 6.0, 2024),
            new CareerOutcome(null, null, 2024, "EEE", 6.0, "Electrical Basics", "Maintenance Engineer", "NOT_PLACED", "", "", 0.0, 2024),
            new CareerOutcome(null, null, 2024, "EEE", 8.8, "Python, IoT, Automation, SQL", "Automation Engineer", "PLACED", "Siemens", "Systems Trainee", 8.0, 2024),
            new CareerOutcome(null, null, 2024, "Mechanical", 8.4, "AutoCAD, SolidWorks, ANSYS", "Design Engineer", "PLACED", "Mahindra & Mahindra", "Graduate Engineer Trainee", 6.8, 2024),
            new CareerOutcome(null, null, 2024, "Mechanical", 7.7, "CATIA, Manufacturing, Lean", "Production Engineer", "PLACED", "Tata Motors", "Quality Engineer", 6.2, 2024),
            new CareerOutcome(null, null, 2024, "Mechanical", 6.1, "CAD Basics", "Mechanical Engineer", "NOT_PLACED", "", "", 0.0, 2024),
            new CareerOutcome(null, null, 2024, "Mechanical", 8.0, "Robotics, Python, PLC", "Robotics Engineer", "PLACED", "Fanuc", "Automation Engineer", 7.5, 2024),
            new CareerOutcome(null, null, 2024, "Civil", 8.1, "STAAD Pro, AutoCAD, Revit", "Structural Engineer", "PLACED", "L&T Construction", "Junior Structural Engineer", 5.8, 2024),
            new CareerOutcome(null, null, 2024, "Civil", 7.5, "Site Management, Surveying", "Site Engineer", "PLACED", "Sobha Developers", "Site Supervisor", 4.8, 2024),
            new CareerOutcome(null, null, 2024, "Civil", 5.9, "Civil Basics", "Civil Engineer", "NOT_PLACED", "", "", 0.0, 2024),
            new CareerOutcome(null, null, 2023, "CSE", 8.6, "Java, Spring Boot, Microservices, SQL", "Software Developer", "PLACED", "TCS", "Systems Engineer", 7.0, 2023),
            new CareerOutcome(null, null, 2023, "CSE", 9.1, "Python, TensorFlow, Deep Learning", "AI Engineer", "PLACED", "Zoho", "AI Scientist", 11.8, 2023),
            new CareerOutcome(null, null, 2023, "IT", 8.8, "Node.js, Express, MongoDB, React", "Full Stack Developer", "PLACED", "Cognizant", "Programmer Analyst", 6.5, 2023),
            new CareerOutcome(null, null, 2023, "IT", 6.3, "Java, HTML", "Software Trainee", "NOT_PLACED", "", "", 0.0, 2023),
            new CareerOutcome(null, null, 2023, "ECE", 8.0, "Embedded Systems, C, RTOS", "Embedded Software Engineer", "PLACED", "Intel", "Associate Engineer", 10.5, 2023),
            new CareerOutcome(null, null, 2023, "EEE", 7.9, "MATLAB, Power Electronics", "Electrical Engineer", "PLACED", "ABB", "Trainee Engineer", 6.2, 2023),
            new CareerOutcome(null, null, 2023, "Mechanical", 8.2, "SolidWorks, CFD, Thermal Analysis", "Thermal Engineer", "PLACED", "Thermax", "Project Engineer", 6.5, 2023),
            new CareerOutcome(null, null, 2023, "Civil", 7.8, "AutoCAD, Quantity Estimation", "Estimation Engineer", "PLACED", "Shapoorji Pallonji", "Quantity Surveyor", 5.2, 2023),
            new CareerOutcome(null, null, 2025, "CSE", 8.9, "Java, Spring Boot, Docker, React", "Backend Developer", "PLACED", "Oracle", "Associate Software Engineer", 10.8, 2025),
            new CareerOutcome(null, null, 2025, "IT", 8.5, "Python, SQL, PowerBI, Scikit-Learn", "Data Analyst", "PLACED", "Deloitte", "Analyst", 8.5, 2025),
            new CareerOutcome(null, null, 2025, "ECE", 8.3, "Python, Computer Vision, Raspberry Pi", "IoT Engineer", "PLACED", "Samsung", "Software Engineer", 12.0, 2025),
            new CareerOutcome(null, null, 2025, "CSE", 6.5, "C, Python Basics", "Software Engineer", "NOT_PLACED", "", "", 0.0, 2025),
            new CareerOutcome(null, null, 2025, "Mechanical", 8.5, "AutoCAD, Mechatronics, Python", "Mechatronics Engineer", "PLACED", "TVS Motors", "R&D Engineer", 7.2, 2025),
            new CareerOutcome(null, null, 2025, "Civil", 8.0, "GIS, Remote Sensing, AutoCAD", "GIS Specialist", "PLACED", "ESRI", "GIS Analyst", 6.0, 2025)
        );

        repository.saveAll(demoList);
    }
}
