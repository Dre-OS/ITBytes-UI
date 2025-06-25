import React, { useState, useEffect } from 'react';
import { Menu, Avatar, Input, Dropdown } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import '../styles/Navbar.css';
import logo from '../assets/logo_colored.png';

const { Search } = Input;

const Navbar = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [firstName, setFirstName] = useState("");

    useEffect(() => {
        const auth = sessionStorage.getItem("isAuthenticated") === "true";
        const fname = sessionStorage.getItem("firstname") || "User";
        setIsAuthenticated(auth);
        setFirstName(fname);
    }, []);

    const handleLogout = () => {
        sessionStorage.clear();
        setIsAuthenticated(false);
        navigate("/login");
    };

    const userMenu = (
        <Menu>
            <Menu.Item key="name" disabled>
                <strong>{firstName}</strong>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout" onClick={handleLogout}>
                Sign Out
            </Menu.Item>
        </Menu>
    );

    const handleAvatarClick = () => {
        navigate("/login");
    };

    const onSearch = (value) => {
        console.log('Search:', value);
    };

    return (
        <div className="navbar">
            {/* Left: Logo + Nav Links */}
            <div className="navbar-content">
                <img src={logo} alt="Logo" className="logo" style={{ height: '50px' }} />
                <div className="nav-links">
                    <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
                    <NavLink to="/products" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Products</NavLink>
                    <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Contact Us</NavLink>
                </div>
            </div>

            {/* Middle: Search Bar */}
            <div className="navbar-search">
                <Search
                    placeholder="Search products"
                    onSearch={onSearch}
                    enterButton
                    style={{ width: '100%' }}
                />
            </div>

            {/* Right: Cart + Avatar or Sign In */}
            <div className='navbar-content-right'>
                <div className='navbar-icon'>
                    <ShoppingCartOutlined style={{ fontSize: 24, color: '#2C485F' }} />
                    <p style={{ color: "#2C485F" }}>Cart</p>
                </div>
                <div style={{ width: '1px', height: '30px', backgroundColor: '#2C485F', opacity: 0.2 }} />
                {isAuthenticated ? (
                    <Dropdown overlay={userMenu} placement="bottomRight" arrow>
                        <div className='navbar-icon' style={{ cursor: "pointer" }}>
                            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#2C485F' }} />
                            <p style={{ color: "#2C485F" }}>{firstName}</p>
                        </div>
                    </Dropdown>
                ) : (
                    <div className='navbar-icon' onClick={handleAvatarClick}>
                        <UserOutlined style={{ fontSize: 24, color: '#2C485F' }} />
                        <p style={{ color: "#2C485F" }}>Sign In</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
