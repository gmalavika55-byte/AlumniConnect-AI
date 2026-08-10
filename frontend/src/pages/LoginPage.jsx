import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';
import { authService } from '../services/authService';
import { useAppContext } from '../context/AppContext';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { refreshData } = useAppContext();

  const rememberEmail = localStorage.getItem('alumni_remember_email') || '';

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await authService.login({
        email: values.email,
        password: values.password,
        remember: values.remember,
      });

      if (response.success) {
        message.success(`Logged in successfully!`);
        await refreshData();
        const role = response.role ? response.role.toLowerCase() : '';
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else if (role === 'alumni') {
          navigate('/alumni/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }
    } catch (error) {
      message.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
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

      {/* RIGHT COLUMN - Login Form Section (50% Width) */}
      <div className={styles.rightFormColumn}>
        <div className={styles.formContentWrapper}>
          {/* Logo Row */}
          <div className={styles.logoRow} onClick={() => navigate('/')}>
            <FaGraduationCap className={styles.logoIcon} />
            <span className={styles.logoText}>AlumniConnect</span>
          </div>

          {/* Form Header */}
          <div className={styles.formHeader}>
            <h1 className={styles.pageTitle}>Welcome Back</h1>
            <p className={styles.pageSubtitle}>Enter your credentials to access your account.</p>
          </div>

          {/* Ant Design Login Form - Role selector removed completely */}
          <Form
            form={form}
            name="login_form"
            initialValues={{
              email: rememberEmail || 'student@student.edu',
              password: 'password123',
              remember: !!rememberEmail,
            }}
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
          >
            {/* Email / User ID */}
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please enter your Email or User ID' }]}
            >
              <div>
                <label className={styles.fieldLabel}>Email / User ID</label>
                <Input
                  placeholder="john@example.edu or User ID"
                  className={styles.customInput}
                />
              </div>
            </Form.Item>

            {/* Password */}
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
              style={{ marginBottom: '12px' }}
            >
              <div>
                <label className={styles.fieldLabel}>Password</label>
                <Input.Password
                  placeholder="••••••••"
                  className={styles.customInput}
                />
              </div>
            </Form.Item>

            {/* Remember Me & Forgot Password */}
            <div className={styles.optionsRow}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember Me</Checkbox>
              </Form.Item>

              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  message.info('Password reset instructions sent to your email.');
                }}
                className={styles.forgotLink}
              >
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className={styles.loginBtn}
            >
              Login
            </Button>

            {/* Don't have an account? Register Link */}
            <div className={styles.registerPrompt}>
              Don't have an account?
              <Link to="/register" className={styles.registerLink}>
                Register
              </Link>
            </div>
          </Form>
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
