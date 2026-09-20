package com.alumniconnect.mentorship.dto;

import java.util.List;

public class AIMatchingRequest {
    private StudentProfileDTO student;
    private List<AlumniProfileDTO> alumni;

    public AIMatchingRequest() {}

    public AIMatchingRequest(StudentProfileDTO student, List<AlumniProfileDTO> alumni) {
        this.student = student;
        this.alumni = alumni;
    }

    public StudentProfileDTO getStudent() { return student; }
    public void setStudent(StudentProfileDTO student) { this.student = student; }

    public List<AlumniProfileDTO> getAlumni() { return alumni; }
    public void setAlumni(List<AlumniProfileDTO> alumni) { this.alumni = alumni; }

    public static class StudentProfileDTO {
        private Integer id;
        private String careerGoal;
        private String course;
        private String department;
        private String skills;

        public StudentProfileDTO() {}

        public Integer getId() { return id; }
        public void setId(Integer id) { this.id = id; }

        public String getCareerGoal() { return careerGoal; }
        public void setCareerGoal(String careerGoal) { this.careerGoal = careerGoal; }

        public String getCourse() { return course; }
        public void setCourse(String course) { this.course = course; }

        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }

        public String getSkills() { return skills; }
        public void setSkills(String skills) { this.skills = skills; }
    }

    public static class AlumniProfileDTO {
        private Integer id;
        private String name;
        private String designation;
        private String department;
        private String skills;
        private Double experience;
        private String currentCompany;

        public AlumniProfileDTO() {}

        public Integer getId() { return id; }
        public void setId(Integer id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDesignation() { return designation; }
        public void setDesignation(String designation) { this.designation = designation; }

        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }

        public String getSkills() { return skills; }
        public void setSkills(String skills) { this.skills = skills; }

        public Double getExperience() { return experience; }
        public void setExperience(Double experience) { this.experience = experience; }

        public String getCurrentCompany() { return currentCompany; }
        public void setCurrentCompany(String currentCompany) { this.currentCompany = currentCompany; }
    }
}
