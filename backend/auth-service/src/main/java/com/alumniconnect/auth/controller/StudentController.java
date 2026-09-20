package com.alumniconnect.auth.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.alumniconnect.auth.entity.LoginRequest;
import com.alumniconnect.auth.entity.Student;
import com.alumniconnect.auth.exception.ResourceNotFoundException;
import com.alumniconnect.auth.service.StudentService;

@RestController
@RequestMapping("/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    private static File getUploadDir() {
        File dir = new File(System.getProperty("user.dir"), "uploads/resumes");
        if (!dir.exists()) {
            dir.mkdirs();
        }
        return dir;
    }

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

    @PostMapping(value = "/{id}/resume/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadResume(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file) {

        Student student;
        try {
            student = studentService.getStudentById(id);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found with ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found with ID: " + id);
        }

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file to upload.");
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body("File size exceeds maximum limit of 5 MB.");
        }

        String originalFilename = file.getOriginalFilename();
        String ext = (originalFilename != null && originalFilename.contains("."))
                ? originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase()
                : "";
        String contentType = file.getContentType() != null ? file.getContentType().toLowerCase() : "";

        boolean isPdf = ext.equals(".pdf") || contentType.contains("pdf");
        boolean isDoc = ext.equals(".doc") || contentType.contains("msword");
        boolean isDocx = ext.equals(".docx") || contentType.contains("wordprocessingml") || contentType.contains("officedocument");

        if (!isPdf && !isDoc && !isDocx) {
            return ResponseEntity.badRequest().body("Invalid file format. Only PDF, DOC, and DOCX files are allowed.");
        }

        if (ext.isEmpty()) {
            if (isPdf) ext = ".pdf";
            else if (isDoc) ext = ".doc";
            else if (isDocx) ext = ".docx";
        }

        try {
            File dir = getUploadDir();
            String savedFileName = "student_" + id + "_" + System.currentTimeMillis() + ext;
            File dest = new File(dir, savedFileName);
            Files.write(dest.toPath(), file.getBytes());

            String safeName = (originalFilename != null && !originalFilename.trim().isEmpty() && !originalFilename.equalsIgnoreCase("blob"))
                    ? originalFilename
                    : ("Student_Resume" + ext);

            student.setResumeName(safeName);
            student.setResumeUrl("/student/resume/download/" + id + "?file=" + savedFileName);
            Student updated = studentService.updateStudent(student);

            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload resume file: " + e.getMessage());
        }
    }

    @GetMapping({"/resume/download/{id}", "/{id}/resume"})
    public ResponseEntity<?> downloadResume(@PathVariable Integer id, @RequestParam(value = "file", required = false) String fileName) {
        Student student;
        try {
            student = studentService.getStudentById(id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found with ID: " + id);
        }

        String resumeUrl = student.getResumeUrl();
        if (resumeUrl == null || resumeUrl.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No resume recorded for student.");
        }

        if (resumeUrl.startsWith("http://") || resumeUrl.startsWith("https://")) {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .header(HttpHeaders.LOCATION, resumeUrl)
                    .build();
        }

        String targetFileName = fileName;
        if (targetFileName == null && resumeUrl.contains("file=")) {
            targetFileName = resumeUrl.substring(resumeUrl.indexOf("file=") + 5);
        }

        File dir = getUploadDir();
        File fileToServe = null;
        if (targetFileName != null && !targetFileName.trim().isEmpty()) {
            fileToServe = new File(dir, targetFileName);
        }

        if (fileToServe == null || !fileToServe.exists()) {
            if (dir.exists() && dir.isDirectory()) {
                File[] matches = dir.listFiles((d, name) -> name.startsWith("student_" + id + "_"));
                if (matches != null && matches.length > 0) {
                    fileToServe = matches[matches.length - 1];
                }
            }
        }

        if (fileToServe == null || !fileToServe.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Resume file not found on disk.");
        }

        try {
            InputStreamResource resource = new InputStreamResource(new FileInputStream(fileToServe));
            String fname = fileToServe.getName().toLowerCase();
            String mimeType = Files.probeContentType(fileToServe.toPath());
            String disposition = "inline";

            if (fname.endsWith(".pdf")) {
                mimeType = "application/pdf";
                disposition = "inline";
            } else if (fname.endsWith(".doc")) {
                mimeType = "application/msword";
                disposition = "attachment";
            } else if (fname.endsWith(".docx")) {
                mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                disposition = "attachment";
            } else if (mimeType == null) {
                mimeType = "application/octet-stream";
                disposition = "attachment";
            }

            String displayFilename = student.getResumeName() != null && !student.getResumeName().trim().isEmpty()
                    ? student.getResumeName()
                    : fileToServe.getName();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, disposition + "; filename=\"" + displayFilename + "\"")
                    .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "Content-Disposition, Content-Type")
                    .contentType(MediaType.parseMediaType(mimeType))
                    .contentLength(fileToServe.length())
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to read file.");
        }
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
