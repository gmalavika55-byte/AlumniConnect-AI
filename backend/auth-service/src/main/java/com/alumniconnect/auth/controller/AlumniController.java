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

import com.alumniconnect.auth.entity.Alumni;
import com.alumniconnect.auth.entity.LoginRequest;
import com.alumniconnect.auth.exception.ResourceNotFoundException;
import com.alumniconnect.auth.service.AlumniService;

@RestController
@RequestMapping("/alumni")
public class AlumniController {

    @Autowired
    private AlumniService alumniService;

    private static File getUploadDir() {
        File dir = new File(System.getProperty("user.dir"), "uploads/resumes");
        if (!dir.exists()) {
            dir.mkdirs();
        }
        return dir;
    }

    @PostMapping("/add")
    public Alumni addAlumni(@RequestBody Alumni alumni) {
        return alumniService.addAlumni(alumni);
    }

    @PutMapping("/update")
    public Alumni updateAlumni(@RequestBody Alumni alumni) {
        return alumniService.updateAlumni(alumni);
    }

    @PostMapping(value = "/{id}/resume/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadResume(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file) {

        Alumni alumni;
        try {
            alumni = alumniService.getAlumniById(id);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Alumni not found with ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Alumni not found with ID: " + id);
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
            String savedFileName = "alumni_" + id + "_" + System.currentTimeMillis() + ext;
            File dest = new File(dir, savedFileName);
            Files.write(dest.toPath(), file.getBytes());

            String safeName = (originalFilename != null && !originalFilename.trim().isEmpty() && !originalFilename.equalsIgnoreCase("blob"))
                    ? originalFilename
                    : ("Alumni_Resume" + ext);

            alumni.setResumeName(safeName);
            alumni.setResumeUrl("/alumni/resume/download/" + id + "?file=" + savedFileName);
            Alumni updated = alumniService.updateAlumni(alumni);

            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload resume file: " + e.getMessage());
        }
    }

    @GetMapping({"/resume/download/{id}", "/{id}/resume"})
    public ResponseEntity<?> downloadResume(@PathVariable Integer id, @RequestParam(value = "file", required = false) String fileName) {
        Alumni alumni;
        try {
            alumni = alumniService.getAlumniById(id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Alumni not found with ID: " + id);
        }

        String resumeUrl = alumni.getResumeUrl();
        if (resumeUrl == null || resumeUrl.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No resume recorded for alumni.");
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
                File[] matches = dir.listFiles((d, name) -> name.startsWith("alumni_" + id + "_"));
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

            String displayFilename = alumni.getResumeName() != null && !alumni.getResumeName().trim().isEmpty()
                    ? alumni.getResumeName()
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
    public String deleteAlumni(@PathVariable Integer id) {
        alumniService.deleteAlumni(id);
        return "Alumni deleted successfully";
    }

    @GetMapping("/get/{id}")
    public Alumni getAlumniById(@PathVariable Integer id) {
        return alumniService.getAlumniById(id);
    }

    @GetMapping("/getall")
    public List<Alumni> getAllAlumni() {
        return alumniService.getAllAlumni();
    }

    @GetMapping("/paged")
    public ResponseEntity<com.alumniconnect.auth.entity.PageResponse<com.alumniconnect.auth.entity.AlumniPagedDTO>> getAlumniPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String availableForMentorship) {
        com.alumniconnect.auth.entity.PageResponse<com.alumniconnect.auth.entity.AlumniPagedDTO> pagedResult = alumniService.getAlumniPaged(
                page, size, search, department, company, skill, availableForMentorship);
        return ResponseEntity.ok(pagedResult);
    }

    @PostMapping("/login")
    public Alumni login(@RequestBody LoginRequest loginRequest) {
        return alumniService.login(
                loginRequest.getEmail(),
                loginRequest.getPassword());
    }
}
