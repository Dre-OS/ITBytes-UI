import React from 'react';
import { Menu, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import '../styles/Navbar.css'; // Assuming you have a CSS file for styling
import logo from '../assets/logo_small_white.png'; // Adjust the path as necessary

const Navbar = () => {
    const handleAvatarClick = () => {
        window.location.href = "/login";
    };

    return (
        <div className="navbar">
            <div className="navbar-content">
                <img src={logo} alt="Logo" className="logo" style={{ height: '50px' }} />
                <Menu
                    mode="horizontal"
                    theme="dark"
                    style={{ width: '40%' }}
                    selectedKeys={[location.pathname === '/' ? '/' : location.pathname]}
                >
                    <Menu.Item key="/">
                        Home
                    </Menu.Item>
                    <Menu.Item key="/dashboard">
                        Products
                    </Menu.Item>
                    <Menu.Item key="/profile">
                        Profile
                    </Menu.Item>
                </Menu>
            </div>
            <Avatar
                icon={<UserOutlined />}
                onClick={handleAvatarClick}
                style={{ cursor: "pointer", fontSize: 24, backgroundColor: "#2C485F" }}
            />
        </div>
    );
}
export default Navbar;