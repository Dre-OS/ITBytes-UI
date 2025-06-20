import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import ArrowUpOutlined from "@ant-design/icons/ArrowUpOutlined";
import "../../styles/MainLayout.css";
import { FloatButton } from "antd";

const { Content } = Layout;

export default function MainLayout() {
    return (
        <Layout style={{ minHeight: "100vh", background: "#fff", }}>
            <Navbar />
            <div style={{ width: "100%", margin: "0" }}>
                <Content>
                    <Outlet />
                </Content>
            </div>
        </Layout>
    );
}