package com.alumniconnect.auth.service;

import java.util.List;
import com.alumniconnect.auth.entity.Certificate;

public interface CertificateService {
    Certificate addCertificate(Certificate certificate);
    List<Certificate> getCertificatesByStudentId(Integer studentId);
    Certificate updateCertificate(Certificate certificate);
    void deleteCertificate(Long certificateId);
}
