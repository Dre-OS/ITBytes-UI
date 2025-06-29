import React from "react";
import { Row, Col, Typography } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import itbytesLogo from "../assets/logo_white.webp";
import blendedLogo from "../assets/blended_logo.png";
import nbsLogo from "../assets/nbs_logo.png";
import jollibeeLogo from "../assets/jollibee_logo.png";
import pnbLogo from "../assets/png_logo.png";
import logo from "../assets/logo_colored.png";

const { Title, Text } = Typography;

const businesses = [
    { name: "Blended", url: "http://192.168.9.7:5173", image: blendedLogo, bg: "#000000" },
    { name: "National Bookstore", url: "http://192.168.9.16:5173", image: nbsLogo, bg: "#F60002" },
    { name: "Tara Laba", url: "http://192.168.9.27:5173", image: "https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg" },
    { name: "Dental Clinic", url: "http://192.168.9.35:5173", image: "https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg" },
    { name: "Jollibee", url: "http://192.168.9.37:5173", image: jollibeeLogo, bg: "#E41130" },
    { name: "PNB", url: "http://192.168.9.23:5173", image: pnbLogo, bg: "#FFFFFF" },
    //   { name: "ITBYTES", url: "http://192.168.9.4:5173", image: itbytesLogo, bg: "#2E4960" },
];

const BusinessDirectory = () => {
    return (
        <div
            style={{
                background: "#f9f9f9",
                padding: "0 20px",
                fontFamily: "Poppins, sans-serif",
                borderTop: "1px solid #e8e8e8",
            }}
        >
            <Title level={4} style={{ textAlign: "center", marginBottom: "30px" }}>
                Business Directory
            </Title>
            <Row gutter={[16, 16]} justify="center" align="middle">
                {businesses.map((biz, index) => (
                    <Col key={index} xs={12} sm={8} md={3} style={{ textAlign: "center" }}>
                        <a
                            href={biz.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "inline-block",
                                padding: "8px",
                                backgroundColor: biz.bg || "#ffffff",
                                borderRadius: "8px",
                            }}
                        >
                            <img
                                src={biz.image}
                                alt={biz.name}
                                style={{
                                    height: "60px",
                                    maxWidth: "100%",
                                    objectFit: "contain",
                                }}
                                onError={(e) => {
                                    e.target.onerror = null; // Prevent infinite loop
                                    e.target.src = "https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg"; // Fallback image
                                }}
                            />

                        </a>
                        <div style={{ marginTop: 8 }}>
                            <Text style={{ fontSize: "13px" }}>{biz.name}</Text>
                        </div>
                    </Col>
                ))}
            </Row>
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <img src={logo} alt="" style={{ height: "60px"}} />
                <p style={{ fontSize: 13 }}>Ananayo | Bambalan | Sagabaen | Valeros</p>
            </div>
        </div>
    );
};

export default BusinessDirectory;
