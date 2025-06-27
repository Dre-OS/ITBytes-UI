import React from "react";
import { Card, Row, Col, Button } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import itbytesLogo from "../assets/logo_white.webp";
import blendedLogo from "../assets/blended_logo.png";
import nbsLogo from "../assets/nbs_logo.png";
import jollibeeLogo from "../assets/jollibee_logo.png";
import pnbLogo from "../assets/png_logo.png";

const businesses = [
    { name: "Blended", url: "http://192.168.9.7:5173", image: blendedLogo, bg: "#000000" },
    { name: "National Bookstore", url: "http://192.168.9.16:5173", image: nbsLogo, bg: "#F60002" },
    { name: "Tara Laba", url: "http://192.168.9.27:5173" },
    { name: "Dental Clinic", url: "http://192.168.9.35:5173" },
    { name: "Jollibee", url: "http://192.168.9.37:5173", image: jollibeeLogo, bg: "#E41130" },
    { name: "PNB", url: "http://192.168.9.23:5173", image: pnbLogo, bg: "#FFFFFF" },
    { name: "ITBYTES", url: "http://192.168.9.4:5173", image: itbytesLogo, bg: "#2E4960" },
];

const Businesses = () => {
    return (
        <div style={{ padding: "30px", fontFamily: "Poppins, sans-serif" }}>
            <h2 style={{ marginBottom: "20px" }}>Business Directory</h2>
            <Row gutter={[24, 24]}>
                {businesses.map((biz, index) => (
                    <Col key={index} xs={24} sm={12} md={6}>
                        <Card
                            hoverable
                            style={{ textAlign: "center", minHeight: "250px" }}
                            cover={
                                <div
                                    style={{
                                        height: 120,
                                        backgroundColor: biz.bg || "#f0f0f0",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {biz.image ? (
                                        <img
                                            src={biz.image}
                                            alt={biz.name}
                                            style={{
                                                maxHeight: "100%",
                                                maxWidth: "100%",
                                                objectFit: "contain",
                                            }}
                                        />
                                    ) : (
                                        <span style={{ color: "#999" }}>No Image</span>
                                    )}
                                </div>
                            }
                        >
                            <h3 style={{ marginBottom: "10px" }}>{biz.name}</h3>
                            <Button
                                type="primary"
                                icon={<LinkOutlined />}
                                href={biz.url}
                                target="_blank"
                            >
                                Visit Site
                            </Button>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Businesses;
