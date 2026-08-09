package com.alumniconnect.auth.service;

import java.util.List;
import com.alumniconnect.auth.entity.Student;

public interface StudentService {
    Student addStudent(Student student);
    Student updateStudent(Student student);
    void deleteStudent(Integer studentId);
    Student getStudentById(Integer studentId);
    List<Student> getAllStudents();
    Student getStudentByEmail(String email);
    Student login(String email, String password);
}
