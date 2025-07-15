import { Layout, Menu, Avatar, Dropdown, Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCartOutlined,
  LogoutOutlined,
  UserOutlined,
  DashboardOutlined,
  SettingOutlined,
  HomeOutlined,
  InboxOutlined,
  ShopOutlined,
  PlusCircleOutlined,
  HistoryOutlined,
  EditOutlined,
  MoreOutlined,
  AuditOutlined

} from "@ant-design/icons";
import '../styles/Sidebar.css';
import logo from "../assets/logo_small_white.png";
import UserSession from "../utils/UserSession";
import { useState, useEffect } from "react";

const { Sider } = Layout;

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const selectedKey = location.pathname;
  const role = UserSession.getRole();
  const name = UserSession.get()?.firstname + " " + UserSession.get()?.lastname;

  const [openKeys, setOpenKeys] = useState(() => {
    const stored = sessionStorage.getItem("openKeys");
    if (stored) return JSON.parse(stored);

    const paths = location.pathname.split("/").filter(Boolean);
    if (paths.length >= 3) return [`/${paths[0]}/${paths[1]}/${paths[2]}`];
    if (paths.length >= 2) return [`/${paths[0]}/${paths[1]}`];
    return [];
  });

  useEffect(() => {
    sessionStorage.setItem("openKeys", JSON.stringify(openKeys));
  }, [openKeys]);


  const toggleSidebar = () => {
    setCollapsed(prev => !prev);          // Parent useEffect persists it
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
    {
      key: "/dashboard/manage-purchases",
      icon: <ShopOutlined />,
      label: "Manage Purchases",
      children: [
        {
          key: "/dashboard/supplies",
          icon: <PlusCircleOutlined />,
          label: <Link to="/dashboard/supplies">Buy Supplies</Link>
        },
        {
          key: "/dashboard/manage-purchases/order-history",
          icon: <HistoryOutlined />,
          label: <Link to="/dashboard/manage-purchases/order-history">Order History</Link>
        },
        {
          key: "/dashboard/manage-purchases/pending-supplies",
          icon: <EditOutlined />,
          label: <Link to="/dashboard/manage-purchases/pending-supplies">Pending Supplies</Link>
        },
      ]
    },
    { key: "audit", icon: <AuditOutlined />, label: <Link to="/dashboard/audit-log">Audit Log</Link> },
  ];

  const salesMenu = [
    { key: "/dashboard/manage-orders", icon: <ShoppingCartOutlined />, label: <Link to="/dashboard/manage-orders">Manage Orders</Link> },
    // { key: "/dashboard/manage-sales", icon: <DollarOutlined />, label: <Link to="/dashboard/manage-sales">Manage Sales</Link> },
  ];

  const inventoryMenu = [
    { key: "/dashboard/manage-inventory", icon: <InboxOutlined />, label: <Link to="/dashboard/manage-inventory">Manage Inventory</Link> },
    {
      key: "/dashboard/manage-purchases",
      icon: <ShopOutlined />,
      label: "Manage Purchases",
      children: [
        {
          key: "/dashboard/supplies",
          icon: <PlusCircleOutlined />,
          label: <Link to="/dashboard/supplies">Buy Supplies</Link>
        },
        {
          key: "/dashboard/manage-purchases/order-history",
          icon: <HistoryOutlined />,
          label: <Link to="/dashboard/manage-purchases/order-history">Order History</Link>
        },
        {
          key: "/dashboard/manage-purchases/pending-supplies",
          icon: <EditOutlined />,
          label: <Link to="/dashboard/manage-purchases/pending-supplies">Pending Supplies</Link>
        },
      ]
    }
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
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* TOP: Logo */}
      <div className="logo" style={{ height: 100, display: "flex", justifyContent: collapsed ? "center" : "left", alignItems: "center", marginLeft: collapsed ? 0 : 20, marginBottom: -10 }}>
        <img src={logo} alt="Logo" style={{ width: collapsed ? "60px" : "100px", transition: "width 0.3s ease" }} />
      </div>

      {/* MIDDLE: Menu */}
      <Menu
        theme="dark"
        mode="inline"
        items={menuItems}
        selectedKeys={[selectedKey]}
        openKeys={openKeys}
        onOpenChange={(keys) => setOpenKeys(keys)}
      />


      {/* BOTTOM: Profile + Logout */}
      <div style={{ padding: collapsed ? "10px" : "15px", borderTop: "1px solid #3A5F7A", color: "#fff" }}>
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#fff', color: '#3A5F7A' }} shape="square" size="large" />
              <div>
                <div style={{ fontWeight: "bold", lineHeight: "16px", fontFamily: 'Poppins' }}>{name || "User"}</div>
                <div style={{ fontSize: 12, color: "#aaa", fontFamily: 'Poppins' }}>{role || "Unknown Role"}</div>
              </div>
            </div>
            <Dropdown
              placement="topRight"
              menu={{
                items: [
                  {
                    key: "logout",
                    icon: <LogoutOutlined />,
                    label: <Link to="/login" onClick={handleLogout}>Logout</Link>,
                  },
                  {
                    key: "home",
                    icon: <HomeOutlined />,
                    label: <Link to="/">Home</Link>,
                  }
                ],
              }}
            >
              <Button type="text" icon={<MoreOutlined />} style={{ color: "#fff" }} />
            </Dropdown>
          </div>
        )}

        {/* Icon only if collapsed */}
        {collapsed && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Dropdown
              placement="topRight"
              menu={{
                items: [
                  {
                    key: "logout",
                    icon: <LogoutOutlined />,
                    label: <Link to="/login" onClick={handleLogout}>Logout</Link>,
                  },
                  {
                    key: "home",
                    icon: <HomeOutlined />,
                    label: <Link to="/">Home</Link>,
                  }
                ],
              }}
            >
              <Button type="text" icon={<MoreOutlined />} style={{ color: "#fff" }} />
            </Dropdown>
          </div>
        )}
      </div>
    </Sider>

  );
}
