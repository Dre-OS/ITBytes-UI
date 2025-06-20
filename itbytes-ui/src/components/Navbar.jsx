import React from 'react';
import { Menu, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import '../styles/Navbar.css'; // Assuming you have a CSS file for styling

const Navbar = () => {
    const handleAvatarClick = () => {
        window.location.href = "/login";
    };

    return (
        <div className="navbar">
            <Menu mode="horizontal" theme="dark" style={{ width: '40%' }}>
                <Menu.Item key="home">
                    Home
                </Menu.Item>
                <Menu.Item key="dashboard">
                    Dashboard
                </Menu.Item>
                <Menu.Item key="profile">
                    Profile
                </Menu.Item>
            </Menu>
            <Avatar
                icon={<UserOutlined />}
                onClick={handleAvatarClick}
                style={{ cursor: "pointer", fontSize: 24 }}
            />
        </div>
    );
}
export default Navbar;