import React, { useState, useEffect } from 'react';
import { Menu, Avatar, Input, Dropdown, Badge, Modal, Button } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserOutlined, ShoppingCartOutlined, HomeOutlined, ProductOutlined, ShoppingOutlined, DashboardOutlined, SearchOutlined } from '@ant-design/icons';
import '../styles/Navbar.css';
import logo from '../assets/logo_colored.png';
import { useCart } from "../context/CartContext"; // adjust path if needed
import UserSession from '../utils/UserSession'; // adjust path if needed

const { Search } = Input;

const Navbar = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [role, setRole] = useState("");
    const { cart, clearCart } = useCart();

    const uniqueItems = cart.length;

    useEffect(() => {
        const user = UserSession.get();
        if (user) {
            setIsAuthenticated(user.isAuthenticated);
            setFirstName(user.firstname);
            setRole(user.role);
        }
    }, []);

    const handleLogout = () => {
        if (cart.length > 0) {
            Modal.confirm({
                title: "Are you sure you want to logout?",
                content: "Your cart items will be cleared on logout.",
                okText: "Logout",
                okType: "danger",
                cancelText: "Cancel",
                onOk: () => {
                    sessionStorage.clear();
                    localStorage.clear();
                    clearCart();
                    setIsAuthenticated(false);
                    navigate("/login");
                }
            });
        } else {
            sessionStorage.clear();
            localStorage.clear();
            clearCart();
            setIsAuthenticated(false);
            navigate("/login");
        }
    };

    const userMenu = (
        <Menu>
            <Menu.Item key="name" disabled>
                <p>{role.charAt(0).toUpperCase() + role.slice(1)}</p>
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
                    <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}> <HomeOutlined /> &nbsp; Home</NavLink>
                    <NavLink to="/products" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}> <ProductOutlined /> &nbsp; Products</NavLink>
                    <NavLink to="/orders" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}> <ShoppingOutlined /> &nbsp; Orders</NavLink>
                    {(role !== "customer" && role !== "business") && (
                        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            <DashboardOutlined /> &nbsp; Dashboard
                        </NavLink>
                    )}
                </div>
            </div>

            {/* Middle: Search Bar */}
            <div className="navbar-search">
                <Search
                    placeholder="Search products"
                    onSearch={onSearch}
                    enterButton={
                        <Button
                            type="primary"
                            style={{ backgroundColor: "#2C485F", borderColor: "#2C485F" }}
                        >
                            <SearchOutlined style={{ color: 'white' }} />
                        </Button>
                    }
                    style={{ width: '100%' }}
                />
            </div>

            {/* Right: Cart + Avatar or Sign In */}
            <div className='navbar-content-right'>
                <div className="navbar-icon" onClick={() => navigate('/cart')}>
                    <Badge count={uniqueItems} size="default" offset={[4, -4]} color="#2C485F">
                        <ShoppingCartOutlined style={{ fontSize: 24, color: '#2C485F' }} />
                    </Badge>
                    <p style={{ color: "#2C485F", margin: 0 }}>Cart</p>
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
