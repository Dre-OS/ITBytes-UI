import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined, MailOutlined, CloseCircleOutlined } from '@ant-design/icons';
import logo from '../assets/logo_white.webp';

const apiUrl = import.meta.env.VITE_USER_API_URL;

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      setLoading(true);

      const response = await fetch(`${apiUrl}`);
      const users = await response.json();

      const user = users.find((user) => user.email === values.email && user.password === values.password);

      if (user) {

        if (user.isDeleted || user.isAuth === 'rejected' || user.isAuth === 'pending') {
          message.error('Your account has not yet been approved. Please contact support.');
          return;
        }

        sessionStorage.setItem('userId', user._id);
        sessionStorage.setItem('isAuthenticated', true);
        sessionStorage.setItem('firstname', user.firstname);
        sessionStorage.setItem('role', user.role);
        if (user.role == 'customer') {
          navigate('/'); // Redirect customers to home page
          return;
        }

        message.success('Login successful!');
        navigate('/dashboard');
      } else {
        message.error('Invalid email or password!');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      message.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <CloseCircleOutlined
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
          <p style={{ textAlign: "left" }}>Please enter your email and password to continue.</p>
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
              style={{ width: '60%', height: '40px', borderRadius: '10px', backgroundColor: '#2C485F' }}
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
        <div className="login-form-footer">
          <p>No account? <a href="/register">Register Now</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;