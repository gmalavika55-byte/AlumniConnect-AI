package com.alumniconnect.auth.serviceimpl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alumniconnect.auth.entity.Certificate;
import com.alumniconnect.auth.repository.CertificateRepository;
import com.alumniconnect.auth.service.CertificateService;

import com.alumniconnect.auth.exception.ResourceNotFoundException;

@Service
public class CertificateServiceImpl implements CertificateService {

    @Autowired
    private CertificateRepository certificateRepository;

    @Override
    public Certificate addCertificate(Certificate certificate) {
        return certificateRepository.save(certificate);
    }

    @Override
    public List<Certificate> getCertificatesByStudentId(Integer studentId) {
        return certificateRepository.findByStudentId(studentId);
    }

    @Override
    public Certificate updateCertificate(Certificate certificate) {
        Certificate existing = certificateRepository.findById(certificate.getCertificateId())
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));
        existing.setCertificateName(certificate.getCertificateName());
        existing.setOrganization(certificate.getOrganization());
        existing.setIssueDate(certificate.getIssueDate());
        existing.setCertificateUrl(certificate.getCertificateUrl());
        return certificateRepository.save(existing);
    }

    @Override
    public void deleteCertificate(Long certificateId) {
        Certificate existing = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));
        certificateRepository.delete(existing);
    }
}
