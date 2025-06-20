import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { MenuOutlined, LogoutOutlined, UserOutlined, DashboardOutlined } from "@ant-design/icons";
import '../styles/Sidebar.css';
//import logo from "../assets/noodlehouselogo_white.png";

const { Sider } = Layout;

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const selectedKey = location.pathname;

  const toggleSidebar = (value) => {
    setCollapsed(value);
    sessionStorage.setItem("sidebarCollapsed", JSON.stringify(value));
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("email");
  };

  const menuItems = [
    { key: "/admin", icon: <DashboardOutlined />, label: <Link to="/admin">Dashboard</Link> },
    { key: "/admin/manage-users", icon: <UserOutlined />, label: <Link to="/admin/manage-users">Manage Users</Link> },
    { key: "/admin/manage-orders", icon: <MenuOutlined />, label: <Link to="/admin/manage-orders">Manage Orders</Link> },
    { key: "/admin/manage-sales", icon: <MenuOutlined />, label: <Link to="/admin/manage-sales">Manage Sales</Link> },
    { key: "/admin/settings", icon: <MenuOutlined />, label: <Link to="/admin/settings">Settings</Link> },
    { type: "divider" },
    { key: "logout", icon: <LogoutOutlined />, label: <Link to="/login" onClick={handleLogout}>Logout</Link> },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={toggleSidebar}
      width={300}
      collapsedWidth={80}
      style={{
        height: "100vh",
        position: "fixed",
        left: 0,
      }}
    >
      <div className="logo" style={{ height: "100px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {/* <img src={logo} alt="Logo" style={{ width: collapsed ? "60px" : "100px", transition: "width 0.3s ease", marginTop: '30px' }} />
        {!collapsed} */}
      </div>
      <div style={{ height: 30 }}>
      </div>
      <Menu theme="dark" mode="inline" items={menuItems} selectedKeys={[selectedKey]} />
    </Sider>
  );
}