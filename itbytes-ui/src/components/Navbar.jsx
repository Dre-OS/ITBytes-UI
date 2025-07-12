import React, { useState, useEffect } from 'react';
import { Menu, Avatar, Input, Dropdown, Badge, Modal, Button } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserOutlined, ShoppingCartOutlined, HomeOutlined, ProductOutlined, ShoppingOutlined, DashboardOutlined, SearchOutlined, AppstoreOutlined } from '@ant-design/icons';
import '../styles/Navbar.css';
import logo from '../assets/logo_colored1.png';
import { useCart } from "../context/CartContext"; // adjust path if needed
import UserSession from '../utils/UserSession'; // adjust path if needed
import { motion } from 'framer-motion';

const { Search } = Input;
let hasAnimated = false;

const Navbar = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [role, setRole] = useState("");
    const { cart, clearCart } = useCart();
    const [shouldAnimate, setShouldAnimate] = useState(!hasAnimated);

    useEffect(() => {
        hasAnimated = true; // mark as animated
    }, []);


    const uniqueItems = cart.length;

    useEffect(() => {
        const user = UserSession.get();
        if (user) {
            setIsAuthenticated(user.isAuthenticated);
            setFirstName(user.firstname);
            setLastName(user.lastname);
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

    const categories = [
        "Monitor",
        "CCTV",
        "Computers",
        "Smartphones",
        "Tablets",
        "Components",
        "Peripherals",
    ];

    const categoryMenu = (
        <Menu>
            {categories.map((category) => (
                <Menu.Item
                    key={category}
                    onClick={() =>
                        navigate(`/products?category=${encodeURIComponent(category)}`)
                    }
                >
                    {category}
                </Menu.Item>
            ))}
        </Menu>
    );

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

    const avatarText = lastName
        ? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
        : firstName;

    return (
        <motion.nav
            initial={shouldAnimate ? { y: -60, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="navbar">
                {/* Left: Logo + Nav Links */}
                <div className="navbar-content">
                    <img src={logo} alt="Logo" className="logo" style={{ height: '60px' }} />
                </div>

                {/* Middle: Search Bar */}
                <div className="navbar-search" >
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
                        style={{ width: '80%' }}
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
                                <Avatar style={{ backgroundColor: '#2C485F', fontWeight: '' }}>
                                    {avatarText}
                                </Avatar>

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
            <div className='navbar-bottom'>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'center', width: '100%' }}>
                    <div style={{ marginRight: 50 }}>
                        <Dropdown overlay={categoryMenu} trigger={['click']}>
                            <span className="nav-link" style={{ cursor: 'pointer' }}>
                                <AppstoreOutlined /> &nbsp; Shop by Category
                            </span>
                        </Dropdown>
                    </div>
                    <div style={{ width: '1px', height: '30px', backgroundColor: '#2C485F', opacity: 0.2 }} />
                    <div className="nav-links">
                        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}> <HomeOutlined /> &nbsp; Home</NavLink>
                        <NavLink to="/products" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}> <ProductOutlined /> &nbsp; Products</NavLink>
                        <NavLink to="/orders" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}> <ShoppingOutlined /> &nbsp; Orders</NavLink>
                        {(role && role !== "customer" && role !== "business") && (
                            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                <DashboardOutlined /> &nbsp; Dashboard
                            </NavLink>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
