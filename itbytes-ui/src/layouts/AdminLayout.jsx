import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // assuming it's a custom component

const { Sider, Content } = Layout;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(() => {
    const stored = sessionStorage.getItem("sidebarCollapsed");
    return stored === "true"; // ✅ restore immediately
  });

  useEffect(() => {
  sessionStorage.setItem("sidebarCollapsed", collapsed);
}, [collapsed]);

  const siderWidth = collapsed ? 80 : 300;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout
        style={{
          marginLeft: siderWidth,
          transition: "margin-left 0.3s ease",
        }}
      >
        <Content style={{ background: "#fefefe", minHeight: "100vh" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}