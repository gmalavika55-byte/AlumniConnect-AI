import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Upload, Button, message } from 'antd';
import { FiUpload } from 'react-icons/fi';

export const AddCertificateModal = ({ visible, onClose, onAddCertificate }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const newCert = {
        name: values.name,
        organization: values.organization,
        issueDate: values.issueDate ? values.issueDate.format('MMM YYYY') : 'Recent',
        url: values.url || '#',
        fileName: fileList.length > 0 ? fileList[0].name : null
      };
      onAddCertificate(newCert);
      message.success(`Certificate "${values.name}" added successfully!`);
      form.resetFields();
      setFileList([]);
      onClose();
    } catch (err) {
      console.log('Validation failed:', err);
    }
  };

  return (
    <Modal
      title="Add New Certificate"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" style={{ backgroundColor: '#1b62d4' }} onClick={handleSubmit}>
          Add Certificate
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

        <Form.Item label="Upload Certificate File">
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            maxCount={1}
          >
            <Button icon={<FiUpload />}>Upload PDF / Image</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};
