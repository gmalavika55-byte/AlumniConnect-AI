import React, { useState, useEffect } from 'react';
import { Table, Tag, Input, Select, Button, Modal, Form, message, Space, Drawer } from 'antd';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiBookOpen, FiFileText, FiDownload } from 'react-icons/fi';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AddStudentModal } from '../components/admin/AddStudentModal';
import api from '../services/api';

export const AdminStudentsPage = () => {
  const [searchText, setSearchText] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [editForm] = Form.useForm();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/student/getall');
      const data = res.data || [];
      const mapped = data.map(s => ({
        id: s.studentId,
        registerNumber: s.registerNo || 'N/A',
        fullName: s.name,
        email: s.email,
        department: s.department || 'N/A',
        batchYear: s.batch || '2026',
        cgpa: s.cgpa ? String(s.cgpa) : '0.0',
        phone: s.mobile || 'N/A',
        status: 'Active',
        rawStudent: s
      }));
      setStudents(mapped);
    } catch (err) {
      console.error("Error loading students", err);
      message.error("Failed to load students list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (editStudent) {
      editForm.setFieldsValue({
        fullName: editStudent.fullName,
        registerNumber: editStudent.registerNumber,
        email: editStudent.email,
        department: editStudent.department,
        cgpa: editStudent.cgpa
      });
    }
  }, [editStudent, editForm]);

  const handleAddStudent = (newStudent) => {
    fetchStudents();
  };

  const handleSaveEdit = async () => {
    try {
      const values = await editForm.validateFields();
      if (!editStudent) return;

      const payload = {
        ...editStudent.rawStudent,
        name: values.fullName,
        registerNo: values.registerNumber,
        department: values.department,
        batch: values.batchYear,
        cgpa: parseFloat(values.cgpa || '0')
      };

      await api.put('/student/update', payload);
      message.success(`Student "${values.fullName}" updated!`);
      setEditStudent(null);
      fetchStudents();
    } catch (err) {
      console.error("Error updating student:", err);
      message.error("Failed to update student.");
    }
  };

  const handleDelete = (student) => {
    Modal.confirm({
      title: `Delete Student "${student.fullName}"?`,
      content: `Register Number: ${student.registerNumber}. All record data will be permanently removed.`,
      okText: 'Delete Permanently',
      okType: 'danger',
      async onOk() {
        try {
          await api.delete(`/student/delete/${student.id}`);
          message.success('Student record removed');
          fetchStudents();
        } catch (err) {
          console.error("Error deleting student:", err);
          message.error("Failed to delete student.");
        }
      }
    });
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
                          s.registerNumber.toLowerCase().includes(searchText.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesDept = deptFilter === 'All' || s.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const columns = [
    {
      title: 'Reg Number',
      dataIndex: 'registerNumber',
      key: 'registerNumber',
      render: (text) => <span style={{ fontWeight: 700, color: 'var(--ac-brand)' }}>{text}</span>
    },
    {
      title: 'Student Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--ac-text-primary)' }}>{name}</div>
          <div style={{ fontSize: 12, color: 'var(--ac-text-secondary)' }}>{record.email}</div>
        </div>
      )
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department'
    },
    {
      title: 'Year / Batch',
      dataIndex: 'batchYear',
      key: 'batchYear'
    },
    {
      title: 'CGPA',
      dataIndex: 'cgpa',
      key: 'cgpa',
      render: (val) => <span style={{ fontWeight: 700, color: '#059669' }}>{val} / 10.0</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (st) => <Tag color={st === 'Active' ? 'success' : 'default'} style={{ fontWeight: 600 }}>{st}</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<FiEye />}
            style={{ color: '#0284c7' }}
            onClick={() => setViewStudent(record)}
          >
            View
          </Button>
          <Button
            type="text"
            icon={<FiEdit2 />}
            style={{ color: 'var(--ac-brand)' }}
            onClick={() => {
              setEditStudent(record);
              editForm.setFieldsValue(record);
            }}
          >
            Edit
          </Button>
          <Button
            type="text"
            danger
            icon={<FiTrash2 />}
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </Space>
      )
    }
  ];

  return (
    <AdminLayout onSearch={setSearchText}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 4px 0' }}>Student Management</h1>
          <p style={{ fontSize: 13.5, color: 'var(--ac-text-secondary)', margin: 0 }}>
            Manage student enrollments, academic records, department allocation, and profiles.
          </p>
        </div>

        <Button
          type="primary"
          icon={<FiPlus />}
          style={{ backgroundColor: 'var(--ac-brand)', border: 'none', height: 42, borderRadius: 8, fontWeight: 600 }}
          onClick={() => setIsAddOpen(true)}
        >
          Add New Student
        </Button>
      </div>

      {/* Filter Row */}
      <div style={{
        backgroundColor: 'var(--ac-bg-card)',
        borderRadius: 14,
        padding: '18px 24px',
        border: '1px solid var(--ac-border)',
        marginBottom: 24,
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <Input
            prefix={<FiSearch style={{ color: 'var(--ac-text-secondary)', marginRight: 6 }} />}
            placeholder="Search by student name, register number, or email..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ borderRadius: 8 }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ac-text-secondary)' }}>Department:</span>
          <Select
            value={deptFilter}
            onChange={setDeptFilter}
            style={{ width: 240 }}
            options={[
              { value: 'All', label: 'All Departments' },
              { value: 'Computer Science & Engineering', label: 'Computer Science' },
              { value: 'Information Technology', label: 'Information Technology' },
              { value: 'Electronics & Communication', label: 'Electronics & Comm.' },
              { value: 'Electrical & Electronics', label: 'Electrical & Electronics' },
              { value: 'Mechanical Engineering', label: 'Mechanical' },
              { value: 'Civil Engineering', label: 'Civil' }
            ]}
          />
        </div>
      </div>

      {/* Student Table */}
      <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 14, border: '1px solid var(--ac-border)', overflow: 'hidden' }}>
        <Table
          columns={columns}
          dataSource={filteredStudents}
          rowKey="id"
          pagination={{ pageSize: 6 }}
        />
      </div>

      {/* View Student Drawer */}
      <Drawer
        title="Student Academic Profile"
        placement="right"
        width={460}
        onClose={() => setViewStudent(null)}
        open={!!viewStudent}
      >
        {viewStudent && (
          <div>
            <div style={{ textAlign: 'center', paddingBottom: 20, borderBottom: '1px solid var(--ac-border)' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#071330', color: 'white', fontSize: 24, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                {viewStudent.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px 0', color: 'var(--ac-text-primary)' }}>{viewStudent.fullName}</h2>
              <span style={{ color: 'var(--ac-brand)', fontWeight: 700 }}>{viewStudent.registerNumber}</span>
            </div>

            <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Department</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewStudent.department}</p>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Academic Batch</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewStudent.batchYear}</p>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Current CGPA</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 700, color: '#059669' }}>{viewStudent.cgpa} / 10.0</p>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Email Address</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewStudent.email}</p>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Mobile Number</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewStudent.phone}</p>
              </div>
            </div>

            <div style={{ paddingTop: 16, borderTop: '1px solid var(--ac-border)' }}>
              <Button type="primary" icon={<FiDownload />} style={{ width: '100%', backgroundColor: 'var(--ac-brand)', border: 'none' }} onClick={() => message.success('Downloading student academic transcript PDF...')}>
                Download Academic Transcript
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Edit Student Modal */}
      <Modal
        title={`Edit Student "${editStudent?.fullName}"`}
        open={!!editStudent}
        onCancel={() => setEditStudent(null)}
        onOk={handleSaveEdit}
        okText="Save Changes"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="registerNumber" label="Register Number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="department" label="Department" rules={[{ required: true }]}>
            <Select options={[
              { value: 'Computer Science & Engineering', label: 'Computer Science' },
              { value: 'Information Technology', label: 'Information Technology' },
              { value: 'Electronics & Communication', label: 'Electronics & Comm.' },
              { value: 'Mechanical Engineering', label: 'Mechanical' }
            ]} />
          </Form.Item>
          <Form.Item name="cgpa" label="CGPA">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Student Modal */}
      <AddStudentModal
        visible={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddStudent={handleAddStudent}
      />
    </AdminLayout>
  );
};
