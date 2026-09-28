package com.alumniconnect.auth.service;

import java.util.List;
import com.alumniconnect.auth.entity.Alumni;
import com.alumniconnect.auth.entity.AlumniPagedDTO;
import com.alumniconnect.auth.entity.PageResponse;

public interface AlumniService {
    Alumni addAlumni(Alumni alumni);
    Alumni updateAlumni(Alumni alumni);
    void deleteAlumni(Integer alumniId);
    Alumni getAlumniById(Integer alumniId);
    List<Alumni> getAllAlumni();
    Alumni getAlumniByEmail(String email);
    Alumni login(String email, String password);
    PageResponse<AlumniPagedDTO> getAlumniPaged(int page, int size, String search, String department, String company, String skill, String availableForMentorship);
}
