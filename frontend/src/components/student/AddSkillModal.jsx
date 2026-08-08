import React, { useState } from 'react';
import { Modal, Form, Input, Select, Tag, Upload, Button, message } from 'antd';
import { FiUpload, FiPlus } from 'react-icons/fi';

const SUGGESTED_SKILLS = [
  'TypeScript', 'React.js', 'Node.js', 'Python', 'Machine Learning', 
  'System Design', 'Docker', 'Kubernetes', 'AWS', 'GraphQL', 'TailwindCSS'
];

export const AddSkillModal = ({ visible, onClose, onAddSkill }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [selectedProficiency, setSelectedProficiency] = useState('Intermediate');

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const newSkill = {
        name: values.skillName,
        proficiency: values.proficiency || selectedProficiency,
        certificate: fileList.length > 0 ? fileList[0].name : null,
      };
      onAddSkill(newSkill);
      message.success(`Skill "${values.skillName}" added successfully!`);
      form.resetFields();
      setFileList([]);
      onClose();
    } catch (err) {
      console.log('Validation failed:', err);
    }
  };

  const handleSuggestedClick = (skill) => {
    form.setFieldsValue({ skillName: skill });
  };

  return (
    <Modal
      title="Add New Skill"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" style={{ backgroundColor: '#1b62d4' }} onClick={handleSubmit}>
          Add Skill
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={{ proficiency: 'Intermediate' }}>
        <Form.Item
          name="skillName"
          label="Skill Name"
          rules={[{ required: true, message: 'Please enter or select a skill name' }]}
        >
          <Input placeholder="e.g. React.js, Python, Data Structures..." />
        </Form.Item>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, color: '#64748b', display: 'block', marginBottom: 8 }}>
            Suggested Skills (Click to select)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {SUGGESTED_SKILLS.map((skill) => (
              <Tag
                key={skill}
                style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 4 }}
                onClick={() => handleSuggestedClick(skill)}
              >
                + {skill}
              </Tag>
            ))}
          </div>
        </div>

        <Form.Item name="proficiency" label="Proficiency Level">
          <Select options={[
            { value: 'Beginner', label: 'Beginner (0-1 yrs)' },
            { value: 'Intermediate', label: 'Intermediate (1-2 yrs)' },
            { value: 'Advanced', label: 'Advanced (2-4 yrs)' },
            { value: 'Expert', label: 'Expert (4+ yrs)' },
          ]} />
        </Form.Item>

        <Form.Item label="Upload Supporting Certificate (Optional)">
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            maxCount={1}
          >
            <Button icon={<FiUpload />}>Select File (PDF, PNG, JPG)</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};
