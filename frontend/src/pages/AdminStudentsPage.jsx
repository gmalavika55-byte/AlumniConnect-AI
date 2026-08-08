import React, { useState } from 'react';
import { Table, Tag, Input, Select, Button, Modal, Form, message, Space, Drawer } from 'antd';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiBookOpen, FiFileText, FiDownload } from 'react-icons/fi';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AddStudentModal } from '../components/admin/AddStudentModal';

export const AdminStudentsPage = () => {
  const [searchText, setSearchText] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [editForm] = Form.useForm();

  // Student directory state
  const [students, setStudents] = useState([
    { id: 101, registerNumber: '21CS085', fullName: 'John Mathew', email: 'john.mathew@student.kce.ac.in', department: 'Computer Science & Engineering', batchYear: '2026 (3rd Year)', cgpa: '8.85', phone: '+91 98765 43210', status: 'Active' },
    { id: 102, registerNumber: '21CS099', fullName: 'Ananya Sharma', email: 'ananya.s@student.kce.ac.in', department: 'Information Technology', batchYear: '2026 (3rd Year)', cgpa: '9.12', phone: '+91 98123 45678', status: 'Active' },
    { id: 103, registerNumber: '22EC042', fullName: 'Karthik Raja', email: 'karthik.r@student.kce.ac.in', department: 'Electronics & Communication', batchYear: '2026 (2nd Year)', cgpa: '8.40', phone: '+91 97890 12345', status: 'Active' },
    { id: 104, registerNumber: '23ME015', fullName: 'Devendra Patel', email: 'devendra.p@student.kce.ac.in', department: 'Mechanical Engineering', batchYear: '2027 (1st Year)', cgpa: '7.85', phone: '+91 96543 21098', status: 'Inactive' },
    { id: 105, registerNumber: '20EE088', fullName: 'Sneha Venkatesh', email: 'sneha.v@student.kce.ac.in', department: 'Electrical & Electronics', batchYear: '2024 (4th Year)', cgpa: '8.95', phone: '+91 95432 10987', status: 'Active' },
    { id: 106, registerNumber: '21CE031', fullName: 'Rahul Menon', email: 'rahul.m@student.kce.ac.in', department: 'Civil Engineering', batchYear: '2025 (3rd Year)', cgpa: '8.10', phone: '+91 94321 09876', status: 'Active' }
  ]);

  const handleAddStudent = (newStudent) => {
    setStudents([newStudent, ...students]);
  };

  const handleSaveEdit = async () => {
    try {
      const values = await editForm.validateFields();
      setStudents(students.map(s => s.id === editStudent.id ? { ...s, ...values } : s));
      message.success(`Student "${values.fullName}" updated!`);
      setEditStudent(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = (student) => {
    Modal.confirm({
      title: `Delete Student "${student.fullName}"?`,
      content: `Register Number: ${student.registerNumber}. All record data will be permanently removed.`,
      okText: 'Delete Permanently',
      okType: 'danger',
      onOk() {
        setStudents(students.filter(s => s.id !== student.id));
        message.success('Student record removed');
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
      render: (text) => <span style={{ fontWeight: 700, color: '#1b62d4' }}>{text}</span>
    },
    {
      title: 'Student Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0f1e36' }}>{name}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{record.email}</div>
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
            style={{ color: '#1b62d4' }}
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
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f1e36', margin: '0 0 4px 0' }}>Student Management</h1>
          <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>
            Manage student enrollments, academic records, department allocation, and profiles.
          </p>
        </div>

        <Button
          type="primary"
          icon={<FiPlus />}
          style={{ backgroundColor: '#1b62d4', height: 42, borderRadius: 8, fontWeight: 600 }}
          onClick={() => setIsAddOpen(true)}
        >
          Add New Student
        </Button>
      </div>

      {/* Filter Row */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 14,
        padding: '18px 24px',
        border: '1px solid #e2e8f0',
        marginBottom: 24,
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <Input
            prefix={<FiSearch style={{ color: '#94a3b8', marginRight: 6 }} />}
            placeholder="Search by student name, register number, or email..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ borderRadius: 8 }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Department:</span>
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
      <div style={{ backgroundColor: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
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
            <div style={{ textAlign: 'center', paddingBottom: 20, borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#071330', color: 'white', fontSize: 24, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                {viewStudent.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px 0', color: '#0f1e36' }}>{viewStudent.fullName}</h2>
              <span style={{ color: '#1b62d4', fontWeight: 700 }}>{viewStudent.registerNumber}</span>
            </div>

            <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Department</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: '#0f1e36' }}>{viewStudent.department}</p>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Academic Batch</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: '#0f1e36' }}>{viewStudent.batchYear}</p>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Current CGPA</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 700, color: '#059669' }}>{viewStudent.cgpa} / 10.0</p>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Email Address</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: '#0f1e36' }}>{viewStudent.email}</p>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Mobile Number</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: '#0f1e36' }}>{viewStudent.phone}</p>
              </div>
            </div>

            <div style={{ paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
              <Button type="primary" icon={<FiDownload />} style={{ width: '100%', backgroundColor: '#1b62d4' }} onClick={() => message.success('Downloading student academic transcript PDF...')}>
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
