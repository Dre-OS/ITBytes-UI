import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCartOutlined,
  LogoutOutlined,
  UserOutlined,
  DashboardOutlined,
  SettingOutlined,
  DollarOutlined,
  InboxOutlined,
  ShopOutlined
} from "@ant-design/icons";
import '../styles/Sidebar.css';
import logo from "../assets/logo_small_white.png";

const { Sider } = Layout;

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const selectedKey = location.pathname;
  const role = sessionStorage.getItem("role");

  const toggleSidebar = (value) => {
    setCollapsed(value);
    sessionStorage.setItem("sidebarCollapsed", JSON.stringify(value));
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
  };

  const baseMenu = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: <Link to="/dashboard">Dashboard</Link> },
  ];

  const adminMenu = [
    { key: "/dashboard/manage-users", icon: <UserOutlined />, label: <Link to="/dashboard/manage-users">Manage Users</Link> },
    { key: "/dashboard/manage-inventory", icon: <InboxOutlined />, label: <Link to="/dashboard/manage-inventory">Manage Inventory</Link> },
    { key: "/dashboard/manage-orders", icon: <ShoppingCartOutlined />, label: <Link to="/dashboard/manage-orders">Manage Orders</Link> },
    // { key: "/dashboard/manage-sales", icon: <DollarOutlined />, label: <Link to="/dashboard/manage-sales">Manage Sales</Link> },
    // { key: "/dashboard/other-businesses", icon: <ShopOutlined />, label: <Link to="/dashboard/other-businesses">Other Businesses</Link> },
  ];

  const salesMenu = [
    { key: "/dashboard/manage-orders", icon: <ShoppingCartOutlined />, label: <Link to="/dashboard/manage-orders">Manage Orders</Link> },
    // { key: "/dashboard/manage-sales", icon: <DollarOutlined />, label: <Link to="/dashboard/manage-sales">Manage Sales</Link> },
  ];

  const inventoryMenu = [
    { key: "/dashboard/manage-inventory", icon: <InboxOutlined />, label: <Link to="/dashboard/manage-inventory">Manage Inventory</Link> },
  ];

  let roleBasedItems = [];

  if (role === "admin") {
    roleBasedItems = adminMenu;
  } else if (role === "sales") {
    roleBasedItems = salesMenu;
  } else if (role === "inventory") {
    roleBasedItems = inventoryMenu;
  }

  const menuItems = [
    ...baseMenu,
    ...roleBasedItems,
    { key: "settings", icon: <SettingOutlined />, label: <Link to="/dashboard/settings">Settings</Link> },
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
        <img src={logo} alt="Logo" style={{ width: collapsed ? "60px" : "100px", transition: "width 0.3s ease", marginTop: '30px' }} />
      </div>
      <div style={{ height: 30 }} />
      <Menu theme="dark" mode="inline" items={menuItems} selectedKeys={[selectedKey]} />
    </Sider>
  );
}
