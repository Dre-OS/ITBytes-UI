import { Layout, Divider, Dropdown, Menu, Button, Select } from "antd";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import ArrowUpOutlined from "@ant-design/icons/ArrowUpOutlined";
import { DownOutlined } from "@ant-design/icons";
import "../../styles/MainLayout.css";
import { FloatButton } from "antd";

const { Content } = Layout;
const { Option } = Select;

const categoryMenu = (
    <Menu
        onClick={(e) => console.log("Selected:", e.key)}
        items={[
            { key: 'printers', label: 'Printers' },
            { key: 'monitors', label: 'Monitors' },
            { key: 'cctvs', label: 'CCTVs' },
            { key: 'tablets', label: 'Tablets' },
            { key: 'smartphones', label: 'Smartphones' },
        ]}
    />
);

export default function MainLayout() {
    return (
        <Layout style={{ minHeight: "100vh", background: "#fff", }}>
            <Navbar />
            <div style={{ display: "flex", justifyContent: "left", width: "90%", marginLeft: "5.5%", marginBottom: "20px" }}>
                <Dropdown overlay={categoryMenu} arrow>
                    <a onClick={(e) => e.preventDefault()} style={{ color: '#2C485F', fontWeight: 500 }}>
                        Categories <DownOutlined style={{ marginLeft: "5px" }} />
                    </a>
                </Dropdown>
            </div>
            <Divider style={{ margin: "0" }} />
            <div style={{ width: "100%", marginTop: "30px", marginBottom: "30px" }}>
                <Content>
                    <Outlet />
                </Content>
            </div>
        </Layout>
    );
}