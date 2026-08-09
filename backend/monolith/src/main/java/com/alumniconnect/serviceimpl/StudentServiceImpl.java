package com.alumniconnect.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alumniconnect.entity.Student;
import com.alumniconnect.exception.ResourceNotFoundException;
import com.alumniconnect.repository.StudentRepository;
import com.alumniconnect.service.StudentService;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Override
    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }

    @Override
    public Student updateStudent(Student student) {
        return studentRepository.save(student);
    }

    @Override
    public void deleteStudent(Integer studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        studentRepository.delete(student);
    }

    @Override
    public Student getStudentById(Integer studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
    @Override
    public Student getStudentByEmail(String email) {
        return studentRepository.findByEmail(email);
    }
    @Override
    public Student login(String email, String password) {

        Student student = studentRepository.findByEmail(email);

        if(student == null) { 
            throw new RuntimeException("Invalid Email");
        }

        if(!student.getPassword().equals(password)) {
            throw new RuntimeException("Invalid Password");
        }

        return student;
    }
}