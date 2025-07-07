import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined, MailOutlined, CloseOutlined } from '@ant-design/icons';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import logo from '../assets/logo_white.webp';
import { loginUser } from '../services/AuthService'; // Adjust the import path as necessary

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isModalVisible, setModalVisible] = useState(false);

  const handleLogin = async (values) => {
  setLoading(true);

  const { user, error } = await loginUser(values.email, values.password);

  if (error) {
    message.error(error);
    setLoading(false);
    return;
  }

  sessionStorage.setItem('userId', user._id);
  sessionStorage.setItem('isAuthenticated', true);
  sessionStorage.setItem('firstname', user.firstname);
  sessionStorage.setItem('lastname', user.lastname);
  sessionStorage.setItem('role', user.role);

  message.success('Login successful!');
  navigate(user.role === 'customer' ? '/' : '/dashboard');
  setLoading(false);
};

  return (
    <div className="login-container">
      <div className="login-image">
        <img src={logo} alt="" className="login-image-logo" />
        <div style={{ textAlign: 'center', width: '60%', marginTop: '-30px' }}>
          <p style={{ fontSize: 13 }}>
            <p style={{ fontSize: 13 }}>A user-friendly online store for IT products and CCTV systems, offering seamless browsing, ordering, and secure checkout for customers.</p>
          </p>
        </div>

      </div>
      <div className="login-form">
        <div className='login-back'>
          <CloseOutlined
            style={{ fontSize: '24px', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          />
        </div>
        <Form
          layout="vertical"
          style={{ width: '100%', maxWidth: '500px' }}
          onFinish={handleLogin}
        >
          <h1 style={{ textAlign: "left" }}>Welcome Back</h1>
          <p style={{ textAlign: "left", marginBottom: '15px' }}>Please enter your email and password to continue.</p>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please enter your email!' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            className="password-field"
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button
              className="custom-button"
              type="primary"
              htmlType="submit"
              style={{ width: '100%', height: '40px', borderRadius: '10px', backgroundColor: '#2C485F' }}
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
        <div className="login-form-footer" style={{ justifyContent: 'space-between', width: '500px' }}>
          <p>No account? <a href="/register">Register Now</a></p>
          <p><a onClick={() => setModalVisible(true)} style={{ cursor: 'pointer'}}>Forgot Password?</a></p>
        </div>
      </div>
      <ForgotPasswordModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </div>
  );
}

export default Login;