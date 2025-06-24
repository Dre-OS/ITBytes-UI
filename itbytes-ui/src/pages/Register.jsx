import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Register.css';
import { Form, Input, Button, Divider, message, Select } from "antd";
import { CloseCircleOutlined } from '@ant-design/icons';
import logo from '../assets/logo_white.webp';

// const apiUrl = import.meta.env.VITE_USER_API_URL || 'http://localhost:1337/users';
const apiUrl = 'http://192.168.9.5:3000/api/users';

function Register() {
    const [loading, setLoading] = useState(false);
    const formRef = useRef(null);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const layout = {
        labelCol: { span: 9 },
        wrapperCol: { span: 15 },
    };

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const isUnique = await validateEmail(values.email);

            if (!isUnique) {
                message.error("Email already registered!");
                setLoading(false);
                return;
            }


            console.log("Form Values:", values);
            const payload = {
                firstname: values.firstName,
                lastname: values.lastName,
                middlename: values.middleName,
                role: values.role,
                email: values.email,
                password: values.password,
                isAuth: "pending",
                isDeleted: false,
            };
            const response = await axios.post(`${apiUrl}`, payload);
            console.log("Success:", response.data);
            setTimeout(() => {
                navigate('/login', {
                    state: { registered: true },
                });
            }, 1500);
            message.success("Registration successful! Please log in.");
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const validateEmail = async (email) => {
        try {
            const response = await axios.get(`${apiUrl}`);
            const exists = response.data.some(user => user.email === email);
            return !exists;
        } catch (error) {
            console.error("Error validating email:", error);
            return false;
        }
    };

    return (
        <div className="register-container" style={{ fontFamily: 'Poppins' }}>
            <div className='register-image'>
                <img src={logo} alt="" className='register-image-logo' />
            </div>
            <div className='register-form'>

                <div className='register-back'>
                    <CloseCircleOutlined
                        style={{ fontSize: '24px', cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                    />
                </div>
                <Form
                    {...layout}
                    layout="horizontal"
                    style={{ width: '100%', maxWidth: '400px' }}
                    form={form}
                    onFinish={onFinish}
                    labelAlign="left"
                    ref={formRef}
                >
                    <h1>Create Your Account</h1>
                    <p>Join us and get access to exclusive features</p>

                    <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[{ required: true, message: "Please enter your first name!" },
                        {
                            pattern: /^[A-Za-z\s]+$/,
                            message: 'Only letters and spaces are allowed',
                        },
                        ]}
                    >
                        <Input placeholder="First Name" />
                    </Form.Item>
                    <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[{ required: true, message: "Please enter your last name!" }, {
                            pattern: /^[A-Za-z\s]+$/,
                            message: 'Only letters and spaces are allowed',
                        },]}
                    >
                        <Input placeholder="Last Name"
                            rules={[
                                { required: true, message: 'Last Name is required' },
                                {
                                    pattern: /^[A-Za-z\s]+$/,
                                    message: 'Only letters and spaces are allowed',
                                },
                            ]} />
                    </Form.Item>
                    <Form.Item
                        label="Middle Name"
                        name="middleName"
                        rules={[{ required: false, message: "Please enter your middle name!" }, {
                            pattern: /^[A-Za-z\s]+$/,
                            message: 'Only letters and spaces are allowed',
                        },]}
                    >
                        <Input placeholder="Middle Name" />
                    </Form.Item>
                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: 'Please select a role!' }]}
                    >
                        <Select placeholder="Select a role">
                            <Select.Option value="customer">Customer</Select.Option>
                            <Select.Option value="sales">Sales</Select.Option>
                            <Select.Option value="inventory">Inventory</Select.Option>
                            <Select.Option value="business">Business</Select.Option>
                        </Select>
                    </Form.Item>

                    <Divider />

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Please enter your Email!" },
                        { type: 'email', message: "Please enter a valid Email!" }]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        className="password-field"
                        name="password"
                        rules={[{ required: true, message: "Please enter your password!" }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>
                    <Form.Item
                        label="Confirm Password"
                        className="confirm-field"
                        name="confirm"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: "Please confirm your password!" },
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
                        <Input.Password placeholder="Confirm Password" />
                    </Form.Item>

                    <Button
                        className="custom-button"
                        type="primary"
                        htmlType="submit"
                        style={{ width: "100%", height: "40px", borderRadius: "10px", backgroundColor: '#2C485F' }}
                        loading={loading}
                    >
                        Register
                    </Button>
                </Form>
                <div className='register-form-footer'>
                    <p>Already have an account? <a href="/login">Log in</a></p>
                </div>
            </div>
        </div>
    );
}

export default Register;