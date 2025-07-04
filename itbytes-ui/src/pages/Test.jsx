import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Steps } from 'antd';
import axios from 'axios';

const { Step } = Steps;

const Test = ({ visible, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');
  const [form] = Form.useForm();

  const API_BASE = 'http://localhost:4000/api';
  const apiUrl = import.meta.env.VITE_USER_API_URL;

  const handleSendOTP = async () => {
    try {
      await axios.post(`${API_BASE}/send-otp`, { email });
      message.success("OTP sent to your email.");
      setCurrentStep(1);
    } catch {
      message.error("Failed to send OTP.");
    }
  };

  const [otp, setOtp] = useState(Array(6).fill(''));

  const handleOTPChange = (value, index) => {
    if (!/^\d*$/.test(value)) return; // Only digits
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOTPKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    try {
      await axios.post(`${API_BASE}/verify-otp`, { email, otp: otpString });
      message.success("OTP verified.");
      setCurrentStep(2);
    } catch {
      message.error("Invalid OTP.");
    }
  };


  const handleResetPassword = async ({ password }) => {
    try {
      await axios.post(`${apiUrl}/password-reset`, { email, password });
      message.success("Password reset successfully!");
      form.resetFields();
      setCurrentStep(0);
      onClose();
    } catch {
      message.error("Failed to reset password.");
    }
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form
            onFinish={handleSendOTP}
            layout="vertical"
            style={{ padding: '0 8px' }}
          >
            <Form.Item>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                marginBottom: 4,
                textAlign: 'center'
              }}>
                Forgot your password?
              </h3>
              <p style={{
                textAlign: 'center',
                fontSize: '14px',
                color: '#666',
                marginBottom: 0,
                lineHeight: '1.6'
              }}>
                Please enter the email address associated with your account.
                We'll send a one-time password (OTP) to help you reset it securely.
              </p>
            </Form.Item>

            <Form.Item
              name="email"
              label={
                <span style={{ fontWeight: 500, fontSize: 14 }}>Email Address</span>
              }
              rules={[{ required: true, type: 'email', message: 'Enter a valid email address' }]}
            >
              <Input
                placeholder="example@gmail.com"
                size="middle"
                onChange={(e) => setEmail(e.target.value)}
                style={{ borderRadius: 6 }}
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size='middle'
              style={{ borderRadius: 6, fontWeight: 500, marginTop: '0px' }}
            >
              Send OTP
            </Button>
          </Form>

        );
      case 1:
        return (
          <Form onFinish={handleVerifyOTP} layout="vertical">
            <Form.Item>
              <p style={{
                textAlign: 'center',
                fontWeight: '500',
                fontSize: '16px',
                marginBottom: '12px',
                color: '#555'
              }}>
                OTP Verication
              </p>
              <p style={{
                textAlign: 'center',
                fontSize: '14px',
                color: '#666',
                marginBottom: '20px',
                lineHeight: '1.6'
              }}>
                We’ve sent a 6-digit verification code to the email address you provided.
                Please check your inbox and enter the code below to verify your identity.
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '24px'
              }}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    maxLength={1}
                    value={otp[index] || ''}
                    onChange={(e) => handleOTPChange(e.target.value, index)}
                    onKeyDown={(e) => handleOTPKeyDown(e, index)}
                    style={{
                      width: 48,
                      height: 48,
                      textAlign: 'center',
                      fontSize: 20,
                      borderRadius: 8,
                      border: '1px solid #d9d9d9',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      transition: 'border 0.3s',
                    }}
                  />
                ))}
              </div>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ borderRadius: 6 }}
            >
              Verify OTP
            </Button>
          </Form>

        );

      case 2:
        return (
          <Form
            form={form}
            onFinish={handleResetPassword}
            layout="vertical"
            style={{ padding: '0 8px' }}
          >
            <Form.Item>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                marginBottom: 4,
                textAlign: 'center'
              }}>
                Reset Your Password
              </h3>
              <p style={{
                textAlign: 'center',
                fontSize: '14px',
                color: '#666',
                marginBottom: 0,
                lineHeight: '1.6'
              }}>
                Create a new strong password. Make sure it’s something you can remember but hard for others to guess.
              </p>
            </Form.Item>

            <Form.Item
              name="password"
              label={<span style={{ fontWeight: 500 }}>New Password</span>}
              rules={[
                { required: true, message: 'Please enter a new password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
              hasFeedback
            >
              <Input.Password
                placeholder="Enter new password"
                size="large"
                style={{ borderRadius: 6 }}
              />
            </Form.Item>

            <Form.Item
              name="confirm"
              label={<span style={{ fontWeight: 500 }}>Confirm Password</span>}
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    return value === getFieldValue('password')
                      ? Promise.resolve()
                      : Promise.reject("Passwords don't match");
                  }
                })
              ]}
            >
              <Input.Password
                placeholder="Re-enter password"
                size="large"
                style={{ borderRadius: 6 }}
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{ borderRadius: 6, fontWeight: 500 }}
            >
              Reset Password
            </Button>
          </Form>

        );
      default:
        return null;
    }
  };

  return (
    <Modal
      title="Forgot Password"
      visible={visible}
      onCancel={() => {
        setCurrentStep(0);
        onClose();
      }}
      footer={null}
      destroyOnClose
    >
      <Steps size="default" current={currentStep} style={{ marginBottom: 24, fontFamily: 'Poppins' }}>
        <Step title="Email" />
        <Step title="OTP" />
        <Step title="Reset" />
      </Steps>
      {renderStepContent()}
    </Modal>
  );
};

export default Test;
