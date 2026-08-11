import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, Button, message } from 'antd';
import dayjs from 'dayjs';

export const EditCertificateModal = ({ visible, onClose, certificate, onUpdateCertificate }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && certificate) {
      form.setFieldsValue({
        name: certificate.certificateName,
        organization: certificate.organization,
        issueDate: certificate.issueDate ? dayjs(certificate.issueDate, 'MMM YYYY') : null,
        url: certificate.certificateUrl === '#' ? '' : certificate.certificateUrl
      });
    }
  }, [visible, certificate, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedCert = {
        ...certificate,
        certificateName: values.name,
        organization: values.organization,
        issueDate: values.issueDate ? values.issueDate.format('MMM YYYY') : 'Recent',
        certificateUrl: values.url || '#'
      };
      await onUpdateCertificate(updatedCert);
      onClose();
    } catch (err) {
      console.log('Validation failed:', err);
    }
  };

  return (
    <Modal
      title="Edit Certificate"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" style={{ backgroundColor: '#1b62d4' }} onClick={handleSubmit}>
          Save Changes
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Certificate Name"
          rules={[{ required: true, message: 'Please enter certificate title' }]}
        >
          <Input placeholder="e.g. AWS Certified Cloud Practitioner" />
        </Form.Item>

        <Form.Item
          name="organization"
          label="Issuing Organization"
          rules={[{ required: true, message: 'Please enter organization name' }]}
        >
          <Input placeholder="e.g. Amazon Web Services, Meta, Coursera" />
        </Form.Item>

        <Form.Item name="issueDate" label="Issue Date">
          <DatePicker picker="month" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="url" label="Certificate URL / Verification Link">
          <Input placeholder="https://coursera.org/verify/..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};
