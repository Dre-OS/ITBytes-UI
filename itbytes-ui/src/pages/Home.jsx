import React from 'react'
import { Button, Card, Col, Layout, Row, Typography } from "antd";
const { Title, Paragraph } = Typography;
const { Content, Footer } = Layout;

function Home() {
    return (
        <Layout style={{ background: "#fff" }}>
            {/* Hero Section */}
            <Content style={{
                backgroundImage: 'url("https://images.pexels.com/photos/207589/pexels-photo-207589.jpeg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "400px",
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backgroundBlendMode: "darken",
                padding: "80px 20px", textAlign: "center", color: "#fff"
            }}>
                <Title style={{ color: "#fff" }} level={1}>Discover Your Style</Title>
                <Paragraph style={{ fontSize: "18px", maxWidth: 600, margin: "auto", color: '#fff' }}>
                    Shop the latest trends in fashion, electronics, and more!
                </Paragraph>
                <Button size="large" style={{ marginTop: 20, backgroundColor: "#fff", color: "#2C485F", border: "none" }}>
                    Shop Now
                </Button>
            </Content>

            {/* Categories */}
            <Content style={{ padding: "60px 40px", maxWidth: 1200, margin: "auto" }}>
                <Title level={2} style={{ textAlign: "center" }}>Shop by Category</Title>
                <Row gutter={[24, 24]} justify="center" style={{ marginTop: 30 }}>
                    <Col xs={24} sm={12} md={8}>
                        <Card hoverable title="Men's Clothing" bordered={false}>
                            <p>Stylish & comfortable</p>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card hoverable title="Electronics" bordered={false}>
                            <p>Latest gadgets & tech</p>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card hoverable title="Home Essentials" bordered={false}>
                            <p>Upgrade your living space</p>
                        </Card>
                    </Col>
                </Row>
            </Content>

            {/* Featured Products */}
            <Content style={{ background: "#fff", padding: "60px 40px", maxWidth: 1200, margin: "auto" }}>
                <Title level={2} style={{ textAlign: "center" }}>Featured Products</Title>
                <Row gutter={[24, 24]} justify="center" style={{ marginTop: 30 }}>
                    {[1, 2, 3, 4].map((id) => (
                        <Col xs={24} sm={12} md={6} key={id}>
                            <Card
                                hoverable
                                cover={<div style={{ height: 200, background: "#d9d9d9" }} />}
                            >
                                <Card.Meta title={`Product ${id}`} description="$99.99" />
                                <Button type="primary" block style={{ marginTop: 16, backgroundColor: "#2C485F" }}>
                                    Add to Cart
                                </Button>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Content>

            {/* Footer */}
            <Footer style={{ textAlign: "center", backgroundColor: "#2C485F", color: "#fff" }}>
                © {new Date().getFullYear()} ItBytes. All rights reserved.
            </Footer>
        </Layout>
    )
}

export default Home
