import React from "react";
import UserInsights from "./business_intelligence/UserInsights";
import ProductInsights from "./business_intelligence/ProductInsights";
import OrderInsights from "./business_intelligence/OrderInsights";
import { Layout, Tag, Tabs } from "antd";
import "../styles/Dashboard.css"; // Assuming you have a CSS file for styling

const { Content } = Layout;
const { TabPane } = Tabs;

const Dashboard = () => {
  const role = sessionStorage.getItem("role");
  const name = sessionStorage.getItem("firstname") || "User";

  const capitalizedRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : "User";

  const renderTabs = () => {
    switch (role) {
      case "admin":
        return (
          <Tabs defaultActiveKey="1">
            <TabPane tab="User Insights" key="1">
              <UserInsights />
            </TabPane>
            <TabPane tab="Product Insights" key="2">
              <ProductInsights />
            </TabPane>
            <TabPane tab="Order Insights" key="3">
              <OrderInsights />
            </TabPane>
          </Tabs>
        );
      case "sales":
        return (
          <Tabs defaultActiveKey="1">
            <TabPane tab="Order Insights" key="1">
              <OrderInsights />
            </TabPane>
          </Tabs>
        );
      case "inventory":
        return (
          <Tabs defaultActiveKey="1">
            <TabPane tab="Product Insights" key="1">
              <ProductInsights />
            </TabPane>
          </Tabs>
        );
      case "business":
        return (
          <Tabs defaultActiveKey="1">
            <TabPane tab="User Insights" key="1">
              <UserInsights />
            </TabPane>
            <TabPane tab="Order Insights" key="2">
              <OrderInsights />
            </TabPane>
          </Tabs>
        );
      case "customer":
        return <p>Welcome! You have no administrative insights.</p>;
      default:
        return <p>Role not recognized.</p>;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "30px", paddingTop: "10px", background: "#F5F5F5" }}>
        <h1 style={{ fontWeight: 600, marginBottom: "-10px" }}>
          Welcome back, {name}!
        </h1>
        <p>Here are your insights based on your role:</p>
        <p>
          <Tag color="blue">{capitalizedRole}</Tag>
        </p>

        {renderTabs()}
      </Content>
    </Layout>
  );
};

export default Dashboard;
