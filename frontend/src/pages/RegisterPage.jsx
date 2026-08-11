import React, { useState } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';
import { authService } from '../services/authService';
import styles from './RegisterPage.module.css';

const { Option } = Select;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [roleSelection, setRoleSelection] = useState(null);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log('Registration Values:', values);
      // Call authService to trigger secure API register + login flow
      const result = await authService.register({
        ...values,
        role: values.role || 'student'
      });
      if (result.success) {
        message.success('Registration successful! Redirecting to dashboard...');
        const userRole = result.role.toLowerCase();
        if (userRole === 'admin') navigate('/admin/dashboard');
        else if (userRole === 'alumni') navigate('/alumni/dashboard');
        else navigate('/student/dashboard');
      }
    } catch (error) {
      message.error(error.response?.data || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    message.info('Form cleared');
  };

  return (
    <div className={styles.pageContainer}>
      {/* LEFT COLUMN - Branding Hero Section (50% Width) */}
      <div className={styles.leftBrandingColumn}>
        <div className={styles.heroCard}>
          <div className={styles.badgePill}>NETWORKING EXCELLENCE</div>

          <h2 className={styles.heroCardTitle}>
            Empowering Global <br />
            Alumni Success
          </h2>

          <p className={styles.heroCardDescription}>
            Unlock a world of professional mentorship, lifelong learning, and exclusive institutional opportunities. Join over 50,000 graduates worldwide.
          </p>

          <div className={styles.avatarsRow}>
            <div className={styles.avatarStack}>
              <div className={`${styles.avatarCircle} ${styles.avatar1}`}>JD</div>
              <div className={`${styles.avatarCircle} ${styles.avatar2}`}>AS</div>
              <div className={`${styles.avatarCircle} ${styles.avatar3}`}>RT</div>
              <div className={`${styles.avatarCircle} ${styles.avatarCount}`}>+50k</div>
            </div>
            <span className={styles.avatarsText}>Trusted by leaders globally</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - Registration Form (50% Width) */}
      <div className={styles.rightFormColumn}>
        <div className={styles.formContentWrapper}>
          {/* Logo Row */}
          <div className={styles.logoRow} onClick={() => navigate('/')}>
            <FaGraduationCap className={styles.logoIcon} />
            <span className={styles.logoText}>AlumniConnect</span>
          </div>

          {/* Form Header */}
          <div className={styles.formHeader}>
            <h1 className={styles.pageTitle}>Create Your Account</h1>
            <p className={styles.pageSubtitle}>Join the AlumniConnect community.</p>
          </div>

          {/* Ant Design Registration Form - Starts directly with Full Name */}
          <Form
            form={form}
            name="register_form"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
            initialValues={{
              fullName: 'John Doe',
              email: 'john@example.edu',
              mobile: '+91',
              batch: '2024',
            }}
          >
            <div className={styles.formGrid}>
              {/* 0. Register As */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label className={styles.fieldLabel}>Register As</label>
                <Form.Item
                  name="role"
                  rules={[{ required: true, message: 'Please select a role' }]}
                >
                  <Select
                    placeholder="Select Role"
                    className={styles.customSelect}
                    style={{ width: '100%', height: '44px' }}
                    onChange={(val) => setRoleSelection(val)}
                  >
                    <Option value="student">Student</Option>
                    <Option value="alumni">Alumni</Option>
                  </Select>
                </Form.Item>
              </div>

              {/* 1. Full Name */}
              <div>
                <label className={styles.fieldLabel}>Full Name</label>
                <Form.Item
                  name="fullName"
                  rules={[{ required: true, message: 'Please enter your full name' }]}
                >
                  <Input placeholder="John Doe" className={styles.customInput} />
                </Form.Item>
              </div>

              {/* 2. Register Number / Alumni ID */}
              <div>
                <label className={styles.fieldLabel}>Register Number / Alumni ID</label>
                <Form.Item
                  name="regNumber"
                  rules={[{ required: true, message: 'Please enter Register Number / Alumni ID' }]}
                >
                  <Input placeholder="e.g. REG12345" className={styles.customInput} />
                </Form.Item>
              </div>

              {/* 3. Email Address */}
              <div>
                <label className={styles.fieldLabel}>Email Address</label>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter your email address' },
                    { type: 'email', message: 'Please enter a valid email' },
                  ]}
                >
                  <Input placeholder="john@example.edu" className={styles.customInput} />
                </Form.Item>
              </div>

              {/* 4. Mobile Number */}
              <div>
                <label className={styles.fieldLabel}>Mobile Number</label>
                <Form.Item
                  name="mobile"
                  rules={[{ required: true, message: 'Please enter mobile number' }]}
                >
                  <Input placeholder="+91" className={styles.customInput} />
                </Form.Item>
              </div>

              {/* 5. Department */}
              <div>
                <label className={styles.fieldLabel}>Department</label>
                <Form.Item
                  name="department"
                  rules={[{ required: true, message: 'Please select department' }]}
                >
                  <Select
                    placeholder="Select Department"
                    className={styles.customSelect}
                    style={{ width: '100%', height: '44px' }}
                  >
                    <Option value="Computer Science">Computer Science</Option>
                    <Option value="Software Engineering">Software Engineering</Option>
                    <Option value="Information Technology">Information Tech</Option>
                    <Option value="Electrical Engineering">Electrical Engineering</Option>
                    <Option value="Mechanical Engineering">Mechanical Engineering</Option>
                    <Option value="Business Administration">Business Admin</Option>
                  </Select>
                </Form.Item>
              </div>

              {/* 6. Batch / Year of Passing */}
              <div>
                <label className={styles.fieldLabel}>Batch / Year of Passing</label>
                <Form.Item
                  name="batch"
                  rules={[{ required: true, message: 'Please enter batch or year of passing' }]}
                >
                  <Input placeholder="e.g. 2024" className={styles.customInput} />
                </Form.Item>
              </div>

              {/* Conditional Fields for Student: Course & Year of Study */}
              {roleSelection === 'student' && (
                <>
                  <div>
                    <label className={styles.fieldLabel}>Course</label>
                    <Form.Item
                      name="course"
                      rules={[{ required: true, message: 'Please select course' }]}
                    >
                      <Select
                        placeholder="Select Course"
                        className={styles.customSelect}
                        style={{ width: '100%', height: '44px' }}
                      >
                        <Option value="B.E.">B.E. (Bachelor of Engineering)</Option>
                        <Option value="B.Tech">B.Tech (Bachelor of Technology)</Option>
                        <Option value="M.E.">M.E. (Master of Engineering)</Option>
                        <Option value="M.Tech">M.Tech (Master of Technology)</Option>
                        <Option value="MCA">MCA (Master of Computer Applications)</Option>
                        <Option value="MBA">MBA (Master of Business Administration)</Option>
                      </Select>
                    </Form.Item>
                  </div>

                  <div>
                    <label className={styles.fieldLabel}>Year of Study</label>
                    <Form.Item
                      name="yearOfStudy"
                      rules={[{ required: true, message: 'Please select year of study' }]}
                    >
                      <Select
                        placeholder="Select Year"
                        className={styles.customSelect}
                        style={{ width: '100%', height: '44px' }}
                      >
                        <Option value={1}>1st Year</Option>
                        <Option value={2}>2nd Year</Option>
                        <Option value={3}>3rd Year</Option>
                        <Option value={4}>4th Year</Option>
                      </Select>
                    </Form.Item>
                  </div>
                </>
              )}

              {/* 7. Password */}
              <div>
                <label className={styles.fieldLabel}>Password</label>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: 'Please enter password' },
                    { min: 6, message: 'Password must be at least 6 characters' },
                  ]}
                >
                  <Input.Password placeholder="••••••••" className={styles.customInput} />
                </Form.Item>
              </div>

              {/* 8. Confirm Password */}
              <div>
                <label className={styles.fieldLabel}>Confirm Password</label>
                <Form.Item
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Please confirm your password' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Passwords do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="••••••••" className={styles.customInput} />
                </Form.Item>
              </div>
            </div>

            {/* Buttons Row (Register & Reset) */}
            <div className={styles.actionsRow}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className={styles.registerBtn}
              >
                Register
              </Button>
              <Button
                type="default"
                onClick={handleReset}
                className={styles.resetBtn}
              >
                Reset
              </Button>
            </div>
          </Form>

          {/* Already have an account? Login */}
          <div className={styles.loginPrompt}>
            Already have an account?
            <Link to="/login" className={styles.loginLink}>
              Login
            </Link>
          </div>
        </div>

        {/* Right Column Footer */}
        <footer className={styles.rightFooter}>
          <span>© 2024 AlumniConnect. Bridging Generations.</span>
          <div className={styles.footerLinks}>
            <a href="#privacy" className={styles.footerLink}>
              Privacy Policy
            </a>
            <a href="#terms" className={styles.footerLink}>
              Terms of Service
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};
