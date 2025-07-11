import React, { useEffect, useState } from "react";
import {
    Row,
    Col,
    Typography,
    Spin,
    Button,
    Card,
    Badge,
    Avatar,
    Skeleton,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import itbytesLogo from "../assets/logo_white.webp";
import blendedLogo from "../assets/blended_logo.png";
import nbsLogo from "../assets/nbs_logo.png";
import jollibeeLogo from "../assets/jollibee_logo.png";
import pnbLogo from "../assets/png_logo.png";
import taralabalogo from "../assets/taralaba_logo.png";
import dentalLogo from "../assets/dental_logo.png";
import logo from "../assets/logo_colored.png";

const { Title, Text } = Typography;

const businesses = [
    {
        name: "Blended",
        url: "http://192.168.9.7:5173",
        image: blendedLogo,
        bg: "#000000",
        description: "A cozy café offering freshly brewed coffee and blended drinks."
    },
    {
        name: "National Bookstore",
        url: "http://192.168.9.16:5173",
        image: nbsLogo,
        bg: "#F60002",
        description: "Your go-to shop for school supplies, books, and stationery."
    },
    {
        name: "Tara Laba",
        url: "http://192.168.9.27:5173",
        image: taralabalogo,
        bg: "#ffffff",
        description: "Affordable laundry services with fast turnaround and care."
    },
    {
        name: "Dental Clinic",
        url: "http://192.168.9.35:5173",
        image: dentalLogo,
        bg: "#DDE4E4",
        description: "Quality dental care from cleanings to specialized treatments."
    },
    {
        name: "Jollibee",
        url: "http://192.168.9.37:5173",
        image: jollibeeLogo,
        bg: "#E41130",
        description: "Famous for Chickenjoy, burgers, and family-friendly meals."
    },
    {
        name: "PNB",
        url: "http://192.168.9.23:5173",
        image: pnbLogo,
        bg: "#FFFFFF",
        description: "Trusted banking partner for savings, loans, and remittances."
    },
];


const BusinessDirectory = () => {
    const [statusMap, setStatusMap] = useState({});
    const [loading, setLoading] = useState(false);

    const checkStatus = async () => {
        setStatusMap({}); // Clear current statuses to show Skeletons again
        setLoading(true);
        const newStatus = {};
        await Promise.all(
            businesses.map(async (biz) => {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 1500);
                    await fetch(biz.url, { mode: "no-cors", signal: controller.signal });
                    clearTimeout(timeoutId);
                    newStatus[biz.url] = true;
                } catch {
                    newStatus[biz.url] = false;
                }
            })
        );
        setStatusMap(newStatus);
        setLoading(false);
    };


    useEffect(() => {
        checkStatus();
    }, []);

    return (
        <div
            style={{
                background: "#f9f9f9",
                padding: "0 10%",
                fontFamily: "Poppins, sans-serif",
                borderTop: "1px solid #e8e8e8",
            }}
        >

            <div style={{ display: "flex", marginBottom: 0, alignItems: "center", gap: "5px", alignContent: "center", justifyContent: "space-between" }}>
                <Title level={4} style={{ textAlign: "left", marginBottom: "30px" }}>
                    Business Directory
                </Title>
                <Button onClick={checkStatus} disabled={loading} type="link">
                    {loading ? (
                        <Spin indicator={<ReloadOutlined style={{ fontSize: 20, color: "#2F4860" }} spin />} />
                    ) : (
                        <ReloadOutlined style={{ fontSize: 20, color: "#2F4860" }} />
                    )}
                </Button>

            </div>

            <Row gutter={[16, 16]} justify="center">
                {businesses.map((biz, index) => {
                    const isActive = statusMap[biz.url];

                    return (
                        <Col key={index} xs={24} sm={12} md={8} lg={4}>
                            <Card
                                bordered
                                style={{ borderRadius: "12px" }}
                                bodyStyle={{ padding: 20 }}
                            >
                                {isActive === undefined ? (
                                    <div>
                                        <Skeleton
                                            active
                                            avatar={{ size: 80, shape: "circle" }}
                                        />
                                        <Skeleton
                                            active
                                            title={false}
                                            paragraph={{ rows: 2, width: ['80%', '60%'] }}
                                        />
                                    </div>
                                ) : (
                                    <div style={{ textAlign: "left" }}>
                                        <Badge
                                            count={isActive ? "Online" : "Offline"}
                                            offset={[0, 80]}
                                            style={{
                                                backgroundColor: isActive ? "#52c41a" : "#f5222d",
                                                fontFamily: "Poppins, sans-serif",
                                            }}
                                        >
                                            <Avatar
                                                src={biz.image}
                                                size={80}
                                                shape="circle"
                                                style={{
                                                    marginBottom: 16,
                                                    backgroundColor: biz.bg,
                                                    border: "1px solid #ddd",
                                                    objectFit: "contain"
                                                }}
                                                alt={biz.name}
                                            />
                                        </Badge>

                                        <div
                                            style={{
                                                fontWeight: 600,
                                                fontSize: "16px",
                                                color: "#000",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 1,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                lineHeight: "1.4em",
                                                height: "1.4em",
                                                marginBottom: 6,
                                            }}
                                        >
                                            {biz.name}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "12px",
                                                color: "#8c8c8c",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                lineHeight: "1.4em",
                                                height: "2.8em",
                                                marginBottom: 12,
                                            }}
                                        >
                                            {biz.description}
                                        </div>
                                        <Button
                                            type="primary"
                                            href={biz.url}
                                            target="_blank"
                                            disabled={!isActive}
                                            style={{ color: "#fff", borderColor: "#ddd" }}
                                        >
                                            View Website
                                        </Button>
                                    </div>
                                )}
                            </Card>

                        </Col>
                    );
                })}
            </Row>

            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <img src={logo} alt="" style={{ height: "60px" }} />
                <p style={{ fontSize: 13 }}>Ananayo | Bambalan | Sagabaen | Valeros</p>
            </div>
        </div>
    );
};

export default BusinessDirectory;
