package com.alumniconnect.auth.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.alumniconnect.auth.entity.Certificate;
import com.alumniconnect.auth.service.CertificateService;

@RestController
@RequestMapping("/certificate")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    @PostMapping("/add")
    public Certificate addCertificate(@RequestBody Certificate certificate) {
        return certificateService.addCertificate(certificate);
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
