import React from "react";
import UserInsights from "./business_intelligence/UserInsights";
import ProductInsights from "./business_intelligence/ProductInsights";
import OrderInsights from "./business_intelligence/OrderInsights";
import { Layout } from "antd";

const { Content } = Layout;

const Dashboard = () => {
  const role = sessionStorage.getItem("role"); // or use context/state

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "30px" }}>
        <h1>Dashboard</h1>

        {/* ADMIN SEES EVERYTHING */}
        {role === "admin" && (
          <>
            <UserInsights />
            <ProductInsights />
            <OrderInsights />
          </>
        )}

        {/* SALES: Only Orders */}
        {role === "sales" && <OrderInsights />}

        {/* INVENTORY: Only Product */}
        {role === "inventory" && <ProductInsights />}

        {/* BUSINESS: Only Charts that make sense (e.g., Users + Orders) */}
        {role === "business" && (
          <>
            <UserInsights />
            <OrderInsights />
          </>
        )}

        {/* CUSTOMER: Minimal or empty dashboard */}
        {role === "customer" && <p>Welcome! You have no administrative insights.</p>}
      </Content>
    </Layout>
  );
};

export default Dashboard;
