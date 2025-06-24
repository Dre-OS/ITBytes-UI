import React from 'react';
import { Menu, Avatar, } from 'antd';
import { NavLink } from 'react-router-dom';
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import '../styles/Navbar.css'; // Assuming you have a CSS file for styling
import logo from '../assets/logo_colored.png'; // Adjust the path as necessary

const Navbar = () => {
    const handleAvatarClick = () => {
        window.location.href = "/login";
    };

    return (
        <div className="navbar">
            <div className="navbar-content">
                <img src={logo} alt="Logo" className="logo" style={{ height: '50px' }} />
                <div className="nav-links">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/products"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        Products
                    </NavLink>
                    <NavLink
                        to="/contact"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        Contact Us
                    </NavLink>
                </div>
            </div>
            <div className='navbar-content-right'>
                <div className='navbar-icon'>
                    <ShoppingCartOutlined style={{ fontSize: 24, color: '#2C485F' }} />
                    <p style={{ color: "#2C485F" }}>Cart</p>
                </div>
                <div style={{ width: '2px', height: '30px', backgroundColor: '#2C485F', opacity: 0.2 }} />
                <div className='navbar-icon' onClick={handleAvatarClick} style={{
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                }}>
                    <UserOutlined style={{ fontSize: 24, color: '#2C485F' }} />
                    <p style={{ color: "#2C485F" }}>Sign In</p>
                </div>
            </div>
        </div>
    );
}
export default Navbar;