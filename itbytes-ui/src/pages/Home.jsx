import React from 'react'
import { Button, Card, Col, Layout, Row, Typography } from "antd";
import '../styles/Home.css';
const { Title, Paragraph } = Typography;
const { Content, Footer } = Layout;
import { ArrowRightOutlined } from '@ant-design/icons';

function Home() {

    const categories = [
        {
            title: "Printers",
            image: "https://www.brother.com.ph/-/media/ap2/products/printer/dcp-t520w/t520-frontview.jpg?rev=9b21357df1894fe39fd94bb007faf4da",
        },
        {
            title: "Monitors",
            image: "https://www.cheapid.com.ph/cdn/shop/files/MONITOR_Nvision_N2510_Black_25_Inches_FHD_100Hz_VA_Flat_A.jpg?v=1728051924",
        },
        {
            title: "Tablets",
            image: "https://cherryshop.com.ph/cdn/shop/products/SUPERION-S2_BLACK.jpg?v=1602234418&width=533",
        },
        {
            title: "CCTVs",
            image: "https://amimarine.com/wp-content/uploads/2020/09/X-MDR-System-Camera-2.jpg",
        },
        {
            title: "Laptops",
            image: "https://image.made-in-china.com/202f0j00GkSgcQyKhEuj/15-6-Inch-Innovative-Product-Dual-Core-Laptop-for-Home-and-Student.webp",
        },
        {
            title: "Smartphones",
            image: "https://cherryshop.com.ph/cdn/shop/files/s10.jpg?v=1697530588&width=533",
        },
    ];


    return (
        <Layout style={{ background: "#fff", width: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto' }}>
            {/* Hero Section */}
            <Content style={{
                backgroundImage: 'url("https://images.pexels.com/photos/207589/pexels-photo-207589.jpeg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "300px",
                width: "100%",
                borderRadius: "10px",
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
            <Content style={{ padding: "30px 0px", width: '100%', margin: "auto" }}>
                <div className='home-header'>
                    <h2 className='home-title'>Shop by Category</h2>
                    <div className='home-see-more'>
                        <p>See more</p>
                        <ArrowRightOutlined />
                    </div>
                </div>
                <Row gutter={[24, 24]} justify="center" style={{ marginTop: 30 }}>
                    {categories.map((category, index) => (
                        <Col xs={24} sm={12} md={4} key={index}>
                            <Card hoverable variant="borderless" className="category-card">
                                <img src={category.image} alt={category.title} className="category-image" />
                                <h3 style={{ fontWeight: 500 }}>{category.title}</h3>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Content>

            {/* Featured Products */}
            <Content style={{ background: "#fff", padding: "30px 0", width: "100%", margin: "auto" }}>
                <div className='home-header'>
                    <h2 className='home-title'>Featured Products</h2>
                    <div className='home-see-more'>
                        <p>See more</p>
                        <ArrowRightOutlined />
                    </div>
                </div>
                <Row gutter={[24, 24]} justify="center" style={{ marginTop: 30 }}>
                    {[1, 2, 3, 4, 5, 6].map((id) => (
                        <Col xs={24} sm={12} md={4} key={id}>
                            <Card
                                hoverable
                                cover={<div style={{ height: 150, background: "#d9d9d9" }} />}
                            >
                                <Card.Meta title={`Product ${id}`} description="$99.99" />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Content>
        </Layout>
    )
}

export default Home
