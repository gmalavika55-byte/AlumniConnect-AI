package com.alumniconnect.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.alumniconnect.entity.Admin;
import com.alumniconnect.entity.Alumni;
import com.alumniconnect.entity.LoginRequest;
import com.alumniconnect.entity.Student;
import com.alumniconnect.service.AdminService;
import com.alumniconnect.service.AlumniService;
import com.alumniconnect.service.StudentService;

@RestController
@RequestMapping("/auth")

public class AuthController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private AlumniService alumniService;

    @Autowired
    private AdminService adminService;

    @PostMapping("/student/register")
    public Student registerStudent(@RequestBody Student student) {
        return studentService.addStudent(student);
    }

	/*
	 * @PostMapping("/alumni/register") public Alumni registerAlumni(@RequestBody
	 * Alumni alumni) { return alumniService.addAlumni(alumni); }
	 */
    @PostMapping("/alumni/register")
    public Alumni registerAlumni(@RequestBody Alumni alumni) {

        System.out.println(alumni.getName());
        System.out.println(alumni.getEmail());

        return alumniService.addAlumni(alumni);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest loginRequest) {

        Student student = studentService.getStudentByEmail(loginRequest.getEmail());

        if (student != null && student.getPassword().equals(loginRequest.getPassword())) {
            return "STUDENT";
        }

        Alumni alumni = alumniService.getAlumniByEmail(loginRequest.getEmail());

        if (alumni != null && alumni.getPassword().equals(loginRequest.getPassword())) {
            return "ALUMNI";
        }

        Admin admin = adminService.getAdminByEmail(loginRequest.getEmail());

        if (admin != null && admin.getPassword().equals(loginRequest.getPassword())) {
            return "ADMIN";
        }

        return "INVALID EMAIL OR PASSWORD";
    }

}