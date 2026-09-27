package com.alumniconnect.auth.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.alumniconnect.auth.entity.Admin;
import com.alumniconnect.auth.entity.Alumni;
import com.alumniconnect.auth.entity.Student;
import com.alumniconnect.auth.repository.AdminRepository;
import com.alumniconnect.auth.repository.AlumniRepository;
import com.alumniconnect.auth.repository.StudentRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AlumniRepository alumniRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        try {
            seedAdmins();
            seedStudents();
            seedAlumni();
        } catch (Exception e) {
            log.warn("Database initialization check encountered an issue (tables may already exist): {}", e.getMessage());
        }
    }

    private void seedAdmins() {
        if (adminRepository.count() == 0) {
            log.info("Seeding default Administrator accounts...");

            Admin admin1 = new Admin();
            admin1.setEmployeeId("EMP001");
            admin1.setName("Administrator");
            admin1.setEmail("admin@alumni.edu");
            admin1.setMobile("9876543210");
            admin1.setDesignation("Chief Administrator");
            admin1.setDepartment("Administration");
            admin1.setRole("Admin");
            admin1.setPassword(passwordEncoder.encode("password123"));
            adminRepository.save(admin1);

            Admin admin2 = new Admin();
            admin2.setEmployeeId("EMP002");
            admin2.setName("System Admin");
            admin2.setEmail("admin@alumniconnect.com");
            admin2.setMobile("9876543211");
            admin2.setDesignation("System Administrator");
            admin2.setDepartment("Administration");
            admin2.setRole("Admin");
            admin2.setPassword(passwordEncoder.encode("Admin@123"));
            adminRepository.save(admin2);

            log.info("Default Administrator accounts seeded successfully.");
        }
    }

    private void seedStudents() {
        if (studentRepository.count() == 0) {
            log.info("Seeding default Student accounts...");

            Student student1 = new Student();
            student1.setRegisterNo("720721104001");
            student1.setName("Demo Student");
            student1.setEmail("student@student.edu");
            student1.setMobile("9876543212");
            student1.setDepartment("Computer Science and Engineering");
            student1.setCourse("B.E.");
            student1.setYearOfStudy(4);
            student1.setBatch("2020-2024");
            student1.setSkills("React, Java, Spring Boot, Python, SQL");
            student1.setCareerGoal("Full Stack Software Engineer");
            student1.setPassword(passwordEncoder.encode("password123"));
            studentRepository.save(student1);

            Student student2 = new Student();
            student2.setRegisterNo("720721104002");
            student2.setName("Alex Johnson");
            student2.setEmail("student@alumni.edu");
            student2.setMobile("9876543213");
            student2.setDepartment("Information Technology");
            student2.setCourse("B.Tech");
            student2.setYearOfStudy(3);
            student2.setBatch("2021-2025");
            student2.setSkills("Java, Spring Boot, Microservices, React");
            student2.setCareerGoal("Backend Engineer");
            student2.setPassword(passwordEncoder.encode("Student@123"));
            studentRepository.save(student2);

            log.info("Default Student accounts seeded successfully.");
        }
    }

    private void seedAlumni() {
        if (alumniRepository.count() == 0) {
            log.info("Seeding default Alumni accounts...");

            Alumni alumni1 = new Alumni();
            alumni1.setRegisterNo("720717104001");
            alumni1.setName("Priya Sankar");
            alumni1.setEmail("alumni@alumni.edu");
            alumni1.setMobile("9876543214");
            alumni1.setDepartment("Computer Science and Engineering");
            alumni1.setBatch("2015-2019");
            alumni1.setCurrentCompany("Google");
            alumni1.setDesignation("Senior Software Engineer");
            alumni1.setExperience(5);
            alumni1.setLocation("Bangalore, India");
            alumni1.setSkills("Java, Spring Boot, Microservices, Cloud Architecture");
            alumni1.setLinkedin("https://linkedin.com");
            alumni1.setPassword(passwordEncoder.encode("password123"));
            alumni1.setAvailableForMentorship("YES");
            alumniRepository.save(alumni1);

            Alumni alumni2 = new Alumni();
            alumni2.setRegisterNo("720717104002");
            alumni2.setName("Arun Kumar");
            alumni2.setEmail("alumni@student.edu");
            alumni2.setMobile("9876543215");
            alumni2.setDepartment("Computer Science and Engineering");
            alumni2.setBatch("2016-2020");
            alumni2.setCurrentCompany("Amazon AWS");
            alumni2.setDesignation("Staff ML Scientist");
            alumni2.setExperience(4);
            alumni2.setLocation("Chennai, India");
            alumni2.setSkills("Python, Deep Learning, NLP, AWS");
            alumni2.setLinkedin("https://linkedin.com");
            alumni2.setPassword(passwordEncoder.encode("Alumni@123"));
            alumni2.setAvailableForMentorship("YES");
            alumniRepository.save(alumni2);

            log.info("Default Alumni accounts seeded successfully.");
        }
    }
}
