import React, { useState, useEffect } from 'react';
import { Menu, Avatar, Input, Dropdown, Badge, Modal } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserOutlined, ShoppingCartOutlined, HomeOutlined, ProductOutlined, ShoppingOutlined, DashboardOutlined } from '@ant-design/icons';
import '../styles/Navbar.css';
import logo from '../assets/logo_colored.png';
import { useCart } from "../contexts/CartContext"; // adjust path if needed

const { Search } = Input;

const Test = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [role, setRole] = useState("");
    const { cart, clearCart } = useCart();

    const uniqueItems = cart.length;

    useEffect(() => {
        const auth = sessionStorage.getItem("isAuthenticated") === "true";
        const fname = sessionStorage.getItem("firstname") || "User";
        const userRole = sessionStorage.getItem("role") || "customer";
        setIsAuthenticated(auth);
        setFirstName(fname);
        setRole(userRole);
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
  <div className="navbar" style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: '70px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #f0f0f0',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  }}>
    {/* Left: Navigation Links */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        <HomeOutlined /> Home
      </NavLink>
      <NavLink to="/products" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        <ProductOutlined /> Products
      </NavLink>
      <NavLink to="/orders" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        <ShoppingOutlined /> Orders
      </NavLink>
      {(role !== "customer" && role !== "business") && (
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <DashboardOutlined /> Dashboard
        </NavLink>
      )}
    </div>

    {/* Center: Logo */}
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
      <img src={logo} alt="Logo" style={{ height: '45px' }} />
    </div>

    {/* Right: Search + Cart + Profile */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Search
        placeholder="Search products"
        onSearch={onSearch}
        style={{ width: 200 }}
      />

      <div className="navbar-icon" onClick={() => navigate('/cart')} style={{ cursor: 'pointer' }}>
        <Badge count={uniqueItems} offset={[4, -4]} color="#2C485F">
          <ShoppingCartOutlined style={{ fontSize: 20, color: '#2C485F' }} />
        </Badge>
      </div>

      {isAuthenticated ? (
        <Dropdown overlay={userMenu} placement="bottomRight" arrow>
          <div className='navbar-icon' style={{ cursor: "pointer" }}>
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#2C485F' }} />
            <span style={{ marginLeft: 8 }}>{firstName}</span>
          </div>
        </Dropdown>
      ) : (
        <div className='navbar-icon' onClick={handleAvatarClick} style={{ cursor: "pointer" }}>
          <UserOutlined style={{ fontSize: 20, color: '#2C485F' }} />
          <span style={{ marginLeft: 8 }}>Sign In</span>
        </div>
      )}
    </div>
  </div>
);
}

export default Test;