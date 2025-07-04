import React, { useState, useRef, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Register.css';
import { Form, Input, Button, Divider, message, Select, Row, Col, Segmented } from "antd";
import { CloseOutlined, LaptopOutlined, LockOutlined, CustomerServiceOutlined, UserOutlined, ShopOutlined } from '@ant-design/icons';

const apiUrl = import.meta.env.VITE_USER_API_URL;

function Register() {
    const [loading, setLoading] = useState(false);
    const [accountType, setAccountType] = useState(null);

    useEffect(() => {
        setAccountType('individual');
    }, []);

    const formRef = useRef(null);
    const navigate = useNavigate();
    const [form] = Form.useForm();

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
                role: accountType === 'business' ? 'business' : values.role,
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
                <div
                    style={{
                        marginTop: '40px',
                        width: '60%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '100px',
                    }}
                >
                    {/* Feature 1 */}
                    <Row align="middle" gutter={16} wrap={false}>
                        <Col flex="none">
                            <div
                                style={{
                                    border: '3px solid #d9d9d9',
                                    padding: 10,
                                    borderRadius: 8,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 48,
                                    height: 48,
                                }}
                            >
                                <LaptopOutlined style={{ fontSize: 24 }} />
                            </div>
                        </Col>
                        <Col flex="auto">
                            <div>
                                <h2 style={{ margin: 0, fontSize: 16 }}>Wide Product Selection</h2>
                                <p style={{ fontSize: 13, margin: '4px 0 0' }}>
                                    Browse through an extensive range of IT and CCTV products tailored for both home and business use.
                                </p>
                            </div>
                        </Col>
                    </Row>

                    {/* Feature 2 */}
                    <Row align="middle" gutter={16} wrap={false}>
                        <Col flex="none">
                            <div
                                style={{
                                    border: '3px solid #d9d9d9',
                                    padding: 10,
                                    borderRadius: 8,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 48,
                                    height: 48,
                                }}
                            >
                                <LockOutlined style={{ fontSize: 24 }} />
                            </div>
                        </Col>
                        <Col flex="auto">
                            <div>
                                <h2 style={{ margin: 0, fontSize: 16 }}>Secure & Fast Checkout</h2>
                                <p style={{ fontSize: 13, margin: '4px 0 0' }}>
                                    Enjoy a smooth and secure shopping experience with encrypted payment and swift processing.
                                </p>
                            </div>
                        </Col>
                    </Row>

                    {/* Feature 3 */}
                    <Row align="middle" gutter={16} wrap={false}>
                        <Col flex="none">
                            <div
                                style={{
                                    border: '3px solid #d9d9d9',
                                    padding: 10,
                                    borderRadius: 8,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 48,
                                    height: 48,
                                }}
                            >
                                <CustomerServiceOutlined style={{ fontSize: 24 }} />
                            </div>
                        </Col>
                        <Col flex="auto">
                            <div>
                                <h2 style={{ margin: 0, fontSize: 16 }}>24/7 Customer Support</h2>
                                <p style={{ fontSize: 13, margin: '4px 0 0' }}>
                                    Our support team is always available to help you with your inquiries and concerns.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <div className='register-form'>

                <div className='register-back'>
                    <CloseOutlined
                        style={{ fontSize: '24px', cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                    />
                </div>
                <Form
                    layout="vertical"
                    style={{ width: '100%', maxWidth: '500px' }}
                    form={form}
                    onFinish={onFinish}
                    labelAlign="left"
                    ref={formRef}
                >
                    <h1 style={{ textAlign: "left" }}>Create Your Account</h1>
                    <p style={{ textAlign: "left", marginBottom: '15px' }}>You'll use this to get access to exclusive features in ITBytes</p>

                    <Form.Item
                        label="Account Type"
                        name="accountType"
                        // rules={[{ required: true, message: 'Please select an account type!' }]}
                        style={{ marginBottom: '16px' }}
                    >
                        <Segmented
                            block
                            value={accountType}
                            onChange={(val) => {
                                setAccountType(val);
                                if (val === 'business') {
                                    form.setFieldsValue({
                                        role: 'business',
                                    });
                                } else {
                                    form.setFieldsValue({ role: undefined });
                                }
                            }}
                            options={[
                                {
                                    label: (
                                        <div style={{ padding: 4 }}>
                                            <UserOutlined /> Individual
                                        </div>
                                    ),
                                    value: 'individual',
                                },
                                {
                                    label: (
                                        <div style={{ padding: 4 }}>
                                            <ShopOutlined /> Business
                                        </div>
                                    ),
                                    value: 'business',
                                },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Please enter your Email!" },
                        { type: 'email', message: "Please enter a valid Email!" }]}
                        style={{ marginBottom: '12px' }}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>

                    {accountType === 'business' ? (
                        <Form.Item
                            label="Business Name"
                            name="firstName"
                            rules={[{ required: true, message: "Please enter your business name!" }]}
                            style={{ marginBottom: 12 }}
                        >
                            <Input placeholder="Business Name" />
                        </Form.Item>
                    ) : (
                        <>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item
                                        label="First Name"
                                        name="firstName"
                                        rules={[
                                            { required: true, message: "Please enter your first name!" },
                                            { pattern: /^[A-Za-z\s]+$/, message: 'Only letters and spaces are allowed' },
                                        ]}
                                        style={{ marginBottom: 8 }}
                                    >
                                        <Input placeholder="First Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Last Name"
                                        name="lastName"
                                        rules={
                                            accountType === 'individual'
                                                ? [
                                                    { required: true, message: "Please enter your last name!" },
                                                    { pattern: /^[A-Za-z\s]+$/, message: 'Only letters and spaces are allowed' },
                                                ]
                                                : []
                                        }
                                        style={{ marginBottom: 8 }}
                                    >
                                        <Input placeholder="Last Name" disabled={accountType !== 'individual'} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Middle Name"
                                        name="middleName"
                                        rules={[
                                            { pattern: /^[A-Za-z\s]+$/, message: 'Only letters and spaces are allowed' },
                                        ]}
                                        style={{ marginBottom: '12px' }}
                                    >
                                        <Input placeholder="Middle Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Role"
                                        name="role"
                                        rules={[{ required: true, message: 'Please select a role!' }]}
                                        style={{ marginBottom: '12px' }}
                                    >
                                        <Select placeholder="Select a role">
                                            <Select.Option value="customer">Customer</Select.Option>
                                            <Select.Option value="sales">Sales</Select.Option>
                                            <Select.Option value="inventory">Inventory</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </>
                    )}

                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item
                                label="Password"
                                className="password-field"
                                name="password"
                                rules={[{ required: true, message: "Please enter your password!" }]}
                                style={{ marginBottom: '12px' }}
                            >
                                <Input.Password placeholder="Password" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
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
                                style={{ marginBottom: '20px' }}
                            >
                                <Input.Password placeholder="Confirm Password" />
                            </Form.Item>
                        </Col>
                    </Row>
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