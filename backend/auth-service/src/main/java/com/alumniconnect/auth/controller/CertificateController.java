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

import com.alumniconnect.auth.entity.Certificate;
import com.alumniconnect.auth.entity.Student;
import com.alumniconnect.auth.service.CertificateService;
import com.alumniconnect.auth.service.StudentService;

@RestController
@RequestMapping("/certificate")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    @Autowired
    private StudentService studentService;

    private static File getUploadDir() {
        File dir = new File(System.getProperty("user.dir"), "uploads/certificates");
        if (!dir.exists()) {
            dir.mkdirs();
        }
        return dir;
    }

    @PostMapping("/add")
    public Certificate addCertificate(@RequestBody Certificate certificate) {
        return certificateService.addCertificate(certificate);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadCertificate(
            @RequestParam("studentId") Integer studentId,
            @RequestParam("certificateName") String certificateName,
            @RequestParam("organization") String organization,
            @RequestParam(value = "issueDate", required = false) String issueDate,
            @RequestParam(value = "url", required = false) String url,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        try {
            Student student = studentService.getStudentById(studentId);
            if (student == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found with ID: " + studentId);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found with ID: " + studentId);
        }

        if (certificateName == null || certificateName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Certificate name is required.");
        }

        Certificate cert = new Certificate();
        cert.setStudentId(studentId);
        cert.setCertificateName(certificateName);
        cert.setOrganization(organization);
        cert.setIssueDate(issueDate != null ? issueDate : "Recent");

        if (file != null && !file.isEmpty()) {
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body("Certificate file size exceeds maximum limit of 5 MB.");
            }
            String originalFilename = file.getOriginalFilename();
            String ext = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase()
                    : "";
            if (!ext.equals(".pdf") && !ext.equals(".jpg") && !ext.equals(".jpeg") && !ext.equals(".png")) {
                return ResponseEntity.badRequest().body("Invalid file format. Only PDF, JPG, JPEG, and PNG files are allowed.");
            }

            try {
                File dir = getUploadDir();
                String savedFileName = "cert_" + studentId + "_" + System.currentTimeMillis() + ext;
                File dest = new File(dir, savedFileName);
                Files.write(dest.toPath(), file.getBytes());

                Certificate saved = certificateService.addCertificate(cert);
                saved.setCertificateUrl("/certificate/download/" + saved.getCertificateId() + "?file=" + savedFileName);
                Certificate updated = certificateService.updateCertificate(saved);
                return ResponseEntity.ok(updated);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Failed to upload certificate file: " + e.getMessage());
            }
        } else {
            cert.setCertificateUrl(url != null ? url : "#");
            Certificate saved = certificateService.addCertificate(cert);
            return ResponseEntity.ok(saved);
        }
    }

    @GetMapping({"/download/{certificateId}", "/{certificateId}"})
    public ResponseEntity<?> downloadCertificate(@PathVariable Long certificateId, @RequestParam(value = "file", required = false) String fileName) {
        File dir = getUploadDir();
        String targetFileName = fileName;
        File fileToServe = null;

        if (targetFileName != null && !targetFileName.trim().isEmpty()) {
            fileToServe = new File(dir, targetFileName);
        }

        if (fileToServe == null || !fileToServe.exists()) {
            if (dir.exists() && dir.isDirectory()) {
                File[] matches = dir.listFiles((d, name) -> name.contains("_" + certificateId + "_") || name.startsWith("cert_"));
                if (matches != null && matches.length > 0) {
                    fileToServe = matches[matches.length - 1];
                }
            }
        }

        if (fileToServe == null || !fileToServe.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Certificate file not found on disk.");
        }

        try {
            InputStreamResource resource = new InputStreamResource(new FileInputStream(fileToServe));
            String fname = fileToServe.getName().toLowerCase();
            String mimeType = Files.probeContentType(fileToServe.toPath());
            String disposition = "inline";

            if (fname.endsWith(".pdf")) {
                mimeType = "application/pdf";
                disposition = "inline";
            } else if (fname.endsWith(".jpg") || fname.endsWith(".jpeg")) {
                mimeType = "image/jpeg";
                disposition = "inline";
            } else if (fname.endsWith(".png")) {
                mimeType = "image/png";
                disposition = "inline";
            } else if (mimeType == null) {
                mimeType = "application/octet-stream";
                disposition = "attachment";
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, disposition + "; filename=\"" + fileToServe.getName() + "\"")
                    .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "Content-Disposition, Content-Type")
                    .contentType(MediaType.parseMediaType(mimeType))
                    .contentLength(fileToServe.length())
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to read certificate file.");
        }
    }

    @GetMapping("/student/{studentId}")
    public List<Certificate> getCertificatesByStudentId(@PathVariable Integer studentId) {
        return certificateService.getCertificatesByStudentId(studentId);
    }

    @PutMapping("/update")
    public Certificate updateCertificate(@RequestBody Certificate certificate) {
        return certificateService.updateCertificate(certificate);
    }

    @DeleteMapping("/delete/{certificateId}")
    public String deleteCertificate(@PathVariable Long certificateId) {
        certificateService.deleteCertificate(certificateId);
        return "Certificate deleted successfully";
    }
}
