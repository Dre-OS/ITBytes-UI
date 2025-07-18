import { Layout, Divider, Dropdown, Menu, Button, Select, Alert } from "antd";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import ArrowUpOutlined from "@ant-design/icons/ArrowUpOutlined";
import "../styles/MainLayout.css";
import { FloatButton } from "antd";
import { useEffect, useState } from "react";
import BusinessDirectory from "../components/BusinessDirectory";

const { Content } = Layout;

export default function MainLayout() {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <Layout style={{ minHeight: "100vh", background: "#F9F9F9", transition: "background 0.3s ease" }}>
            <Navbar />
            {/* <Alert
                message="Site is undergoing maintenance"
                type="warning"
                banner
                style={{ marginBottom: 16, fontFamily: "Poppins", padding: "10px 10%" }}
            /> */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "left",
                    width: "90%",
                    marginLeft: "5.5%",
                    marginBottom: "20px",
                    transition: "all 0.3s ease"
                }}
            >
            </div>
            <div
                style={{
                    width: "100%",
                    marginBottom: "30px",
                    transition: "all 0.3s ease"
                }}
            >
                <Content>
                    <Outlet />
                </Content>
            </div>
            {showButton && (
                <FloatButton
                    icon={<ArrowUpOutlined />}
                    type='default'
                    style={{ right: 24, bottom: 24, transition: "all 0.3s ease" }}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    tooltip="Back to Top"
                />
            )}
            <BusinessDirectory />
        </Layout>
    );
}