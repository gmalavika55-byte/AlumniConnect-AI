import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Steps } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { FaGraduationCap, FaCheckCircle, FaLock, FaKey, FaEnvelope } from 'react-icons/fa';
import { authService } from '../services/authService';
import styles from './LoginPage.module.css';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: Email, 1: OTP, 2: New Password, 3: Success
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpExpirySeconds, setOtpExpirySeconds] = useState(300); // 5 minutes (300s)

  const [emailForm] = Form.useForm();
  const [otpForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // Resend cooldown timer (30s)
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // OTP 5-minute expiry countdown timer
  useEffect(() => {
    let timer;
    if (step === 1 && otpExpirySeconds > 0) {
      timer = setInterval(() => {
        setOtpExpirySeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, otpExpirySeconds]);

  // Format seconds to MM:SS
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Step 1: Send OTP
  const handleSendOtp = async (values) => {
    setLoading(true);
    try {
      const userEmail = values.email.trim().toLowerCase();
      setEmail(userEmail);
      const res = await authService.forgotPassword(userEmail);
      if (res?.success === false) {
        message.error(res?.message || 'Unable to send OTP. Please try again later.');
        return;
      }
      message.success(res?.message || 'If the email is registered, an OTP has been sent. Please check your inbox.');
      setStep(1);
      setOtpExpirySeconds(300); // Reset 5-minute timer
      setResendCooldown(30);
    } catch (error) {
      console.error('Send OTP error:', error);
      const errMsg = typeof error.response?.data === 'string'
        ? error.response.data
        : (error.response?.data?.message || 'Unable to send OTP. Please try again later.');
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !email) return;
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      if (res?.success === false) {
        message.error(res?.message || 'Unable to send OTP. Please try again later.');
        return;
      }
      message.success(res?.message || 'A new OTP has been sent. Please check your inbox.');
      setOtpExpirySeconds(300); // Reset 5-minute timer
      setResendCooldown(30);
    } catch (error) {
      console.error('Resend OTP error:', error);
      const errMsg = typeof error.response?.data === 'string'
        ? error.response.data
        : (error.response?.data?.message || 'Unable to resend OTP. Please try again later.');
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (values) => {
    if (otpExpirySeconds <= 0) {
      message.error('OTP expired. Please request a new OTP.');
      return;
    }
    setLoading(true);
    try {
      const enteredOtp = values.otp.trim();
      const res = await authService.verifyOtp(email, enteredOtp);
      if (res?.success && res?.resetToken) {
        setResetToken(res.resetToken);
        message.success(res?.message || 'OTP verified successfully.');
        setStep(2);
      } else {
        message.error(res?.message || 'Invalid OTP.');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      const errMsg = typeof error.response?.data === 'string'
        ? error.response.data
        : (error.response?.data?.message || 'Invalid or expired OTP.');
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      const res = await authService.resetPassword(email, resetToken, values.newPassword);
      if (res?.success === false) {
        message.error(res?.message || 'Failed to reset password.');
        return;
      }
      message.success(res?.message || 'Password reset successfully.');
      setStep(3);
    } catch (error) {
      console.error('Reset password error:', error);
      const errMsg = typeof error.response?.data === 'string'
        ? error.response.data
        : (error.response?.data?.message || 'Failed to reset password.');
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* LEFT COLUMN - Branding Hero Section */}
      <div className={styles.leftBrandingColumn}>
        <div className={styles.heroCard}>
          <div className={styles.badgePill}>ACCOUNT RECOVERY</div>

          <h2 className={styles.heroCardTitle}>
            Secure Account <br />
            Password Reset
          </h2>

          <p className={styles.heroCardDescription}>
            Follow the quick 3-step verification to safely reset your password and restore full access to your AlumniConnect account.
          </p>

          <div className={styles.avatarsRow}>
            <div className={styles.avatarStack}>
              <div className={`${styles.avatarCircle} ${styles.avatar1}`}>JD</div>
              <div className={`${styles.avatarCircle} ${styles.avatar2}`}>AS</div>
              <div className={`${styles.avatarCircle} ${styles.avatar3}`}>RT</div>
              <div className={`${styles.avatarCircle} ${styles.avatarCount}`}>+50k</div>
            </div>
            <span className={styles.avatarsText}>Protected by end-to-end security</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - Form Section */}
      <div className={styles.rightFormColumn}>
        <div className={styles.formContentWrapper}>
          {/* Logo Row */}
          <div className={styles.logoRow} onClick={() => navigate('/')}>
            <FaGraduationCap className={styles.logoIcon} />
            <span className={styles.logoText}>AlumniConnect</span>
          </div>

          {/* Form Header */}
          <div className={styles.formHeader}>
            <h1 className={styles.pageTitle}>Forgot Password?</h1>
            <p className={styles.pageSubtitle}>
              {step === 0 && "Enter your registered email address to receive a 6-digit OTP code."}
              {step === 1 && `Enter the 6-digit OTP sent to ${email}`}
              {step === 2 && "Create a strong new password for your account."}
              {step === 3 && "Your password has been reset successfully."}
            </p>
          </div>

          {/* Steps Progress Indicator */}
          <div style={{ marginBottom: 32 }}>
            <Steps
              current={step}
              size="small"
              items={[
                { title: 'Email', icon: <FaEnvelope /> },
                { title: 'OTP', icon: <FaKey /> },
                { title: 'New Password', icon: <FaLock /> },
              ]}
            />
          </div>

          {/* STEP 0: EMAIL INPUT */}
          {step === 0 && (
            <Form form={emailForm} onFinish={handleSendOtp} layout="vertical" requiredMark={false}>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please enter a valid email address' },
                  { type: 'email', message: 'Please enter a valid email address' },
                ]}
              >
                <div>
                  <label className={styles.fieldLabel}>Registered Email Address</label>
                  <Input
                    placeholder="e.g. john@example.edu"
                    className={styles.customInput}
                    autoFocus
                  />
                </div>
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className={styles.loginBtn}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </Form>
          )}

          {/* STEP 1: OTP VERIFICATION */}
          {step === 1 && (
            <Form form={otpForm} onFinish={handleVerifyOtp} layout="vertical" requiredMark={false}>
              <Form.Item
                name="otp"
                rules={[
                  { required: true, message: 'Please enter 6-digit OTP' },
                  { len: 6, message: 'OTP must be exactly 6 digits' },
                ]}
              >
                <div>
                  <label className={styles.fieldLabel}>6-Digit OTP Code</label>
                  <Input
                    placeholder="123456"
                    maxLength={6}
                    className={styles.customInput}
                    style={{ letterSpacing: '4px', fontSize: '18px', fontWeight: 'bold' }}
                    autoFocus
                    disabled={otpExpirySeconds <= 0}
                  />
                </div>
              </Form.Item>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: 13, color: otpExpirySeconds <= 0 ? '#ef4444' : '#64748b', fontWeight: 600 }}>
                  {otpExpirySeconds > 0
                    ? `OTP expires in ${formatTimer(otpExpirySeconds)}`
                    : 'OTP expired. Please request a new OTP.'}
                </span>
                <Button
                  type="link"
                  disabled={resendCooldown > 0 || loading}
                  onClick={handleResendOtp}
                  style={{ padding: 0, fontWeight: 600 }}
                >
                  {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                </Button>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <Button
                  type="default"
                  onClick={() => setStep(0)}
                  style={{ height: 48, borderRadius: 8, fontWeight: 600 }}
                >
                  Back
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  disabled={otpExpirySeconds <= 0}
                  className={styles.loginBtn}
                  style={{ flex: 1, marginBottom: 0 }}
                >
                  Verify OTP
                </Button>
              </div>
            </Form>
          )}

          {/* STEP 2: NEW PASSWORD */}
          {step === 2 && (
            <Form form={passwordForm} onFinish={handleResetPassword} layout="vertical" requiredMark={false}>
              <Form.Item
                name="newPassword"
                rules={[
                  { required: true, message: 'Please enter a new password' },
                  { min: 6, message: 'Password must be at least 6 characters' },
                ]}
              >
                <div>
                  <label className={styles.fieldLabel}>New Password</label>
                  <Input.Password placeholder="••••••••" className={styles.customInput} autoFocus />
                </div>
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm your new password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
                ]}
              >
                <div>
                  <label className={styles.fieldLabel}>Confirm New Password</label>
                  <Input.Password placeholder="••••••••" className={styles.customInput} />
                </div>
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className={styles.loginBtn}
              >
                Reset Password
              </Button>
            </Form>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <FaCheckCircle style={{ fontSize: 64, color: '#16a34a', marginBottom: 16 }} />
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0b1a30', marginBottom: 8 }}>
                Password Reset Successfully!
              </h3>
              <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>
                Your account password has been updated. You can now log in using your new password.
              </p>
              <Button
                type="primary"
                onClick={() => navigate('/login')}
                className={styles.loginBtn}
              >
                Back to Login
              </Button>
            </div>
          )}

          {/* Remembered password? Login link */}
          {step !== 3 && (
            <div className={styles.registerPrompt} style={{ marginTop: 24 }}>
              Remembered your password?
              <Link to="/login" className={styles.registerLink}>
                Back to Login
              </Link>
            </div>
          )}
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
