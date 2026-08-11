package com.alumniconnect.auth.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.alumniconnect.auth.entity.LoginRequest;
import com.alumniconnect.auth.entity.Student;
import com.alumniconnect.auth.service.StudentService;

@RestController
@RequestMapping("/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping("/add")
    public Student addStudent(@RequestBody Student student) {
        return studentService.addStudent(student);
    }

    @PutMapping("/update")
    public Student updateStudent(
            @RequestBody Student student,
            @RequestHeader(value = "X-User-Id", required = false) String authenticatedUserId,
            @RequestHeader(value = "X-User-Role", required = false) String authenticatedUserRole) {
        if (authenticatedUserId != null && "STUDENT".equalsIgnoreCase(authenticatedUserRole)) {
            Integer authId = Integer.parseInt(authenticatedUserId);
            if (!authId.equals(student.getStudentId())) {
                throw new RuntimeException("Unauthorized: Cannot modify other student's profile.");
            }
        }
        return studentService.updateStudent(student);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteStudent(@PathVariable Integer id) {
        studentService.deleteStudent(id);
        return "Student deleted successfully";
    }

    @GetMapping("/get/{id}")
    public Student getStudentById(
            @PathVariable Integer id,
            @RequestHeader(value = "X-User-Id", required = false) String authenticatedUserId,
            @RequestHeader(value = "X-User-Role", required = false) String authenticatedUserRole) {
        if (authenticatedUserId != null && "STUDENT".equalsIgnoreCase(authenticatedUserRole)) {
            Integer authId = Integer.parseInt(authenticatedUserId);
            if (!authId.equals(id)) {
                throw new RuntimeException("Unauthorized: Cannot access other student's profile.");
            }
        }
        return studentService.getStudentById(id);
    }

    @GetMapping("/getall")
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @PostMapping("/login")
    public Student login(@RequestBody LoginRequest loginRequest) {
        return studentService.login(
                loginRequest.getEmail(),
                loginRequest.getPassword());
    }
}
