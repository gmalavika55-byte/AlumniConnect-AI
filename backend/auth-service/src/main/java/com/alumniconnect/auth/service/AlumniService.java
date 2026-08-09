package com.alumniconnect.auth.service;

import java.util.List;
import com.alumniconnect.auth.entity.Alumni;

public interface AlumniService {
    Alumni addAlumni(Alumni alumni);
    Alumni updateAlumni(Alumni alumni);
    void deleteAlumni(Integer alumniId);
    Alumni getAlumniById(Integer alumniId);
    List<Alumni> getAllAlumni();
    Alumni getAlumniByEmail(String email);
    Alumni login(String email, String password);
}
