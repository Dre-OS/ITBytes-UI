import React, { useState, useEffect } from 'react'
import { Button, Card, Col, Layout, Row, Typography, Carousel } from "antd";
import axios from 'axios';
import '../styles/Home.css';
import ProductModal from '../components/ProductModal';
import { useNavigate } from 'react-router-dom';
const { Title, Paragraph } = Typography;
const { Content, Footer } = Layout;
import {
    ArrowRightOutlined,
    LockOutlined,
    ThunderboltOutlined,
    CheckCircleOutlined,
    CloudOutlined,
} from '@ant-design/icons';
import hero1 from '../assets/hero1.png';
import hero2 from '../assets/hero2.png';
import hero3 from '../assets/hero3.png';
import hero4 from '../assets/hero4.png';
import hero5 from '../assets/hero5.png';


function Home() {
    const [featured, setFeatured] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();

    const openProductModal = (id) => {
        console.log("Opening modal for product ID:", id);
        setSelectedProductId(id);
        setModalVisible(true);
    };

    const closeProductModal = () => {
        setModalVisible(false);
        setSelectedProductId(null);
    };

    const features = [
        {
            icon: <LockOutlined style={{ fontSize: 24, color: '#2C485F' }} />,
            title: 'Secure Checkout',
            description: 'All payments are protected with end-to-end encryption.',
        },
        {
            icon: <ThunderboltOutlined style={{ fontSize: 24, color: '#2C485F' }} />,
            title: 'Fast Delivery',
            description: 'Get your gadgets delivered within 1-3 business days.',
        },
        {
            icon: <CheckCircleOutlined style={{ fontSize: 24, color: '#2C485F' }} />,
            title: 'Quality Assured',
            description: 'We only sell authentic, high-quality electronics.',
        },
        {
            icon: <CloudOutlined style={{ fontSize: 24, color: '#2C485F' }} />,
            title: 'Easy Returns',
            description: 'Hassle-free returns within 7 days of purchase.',
        }

    ];

    const categories = [
        {
            title: "Printer",
            image: "https://www.brother.com.ph/-/media/ap2/products/printer/dcp-t520w/t520-frontview.jpg?rev=9b21357df1894fe39fd94bb007faf4da",
        },
        {
            title: "Monitors",
            image: "https://www.cheapid.com.ph/cdn/shop/files/MONITOR_Nvision_N2510_Black_25_Inches_FHD_100Hz_VA_Flat_A.jpg?v=1728051924",
        },
        {
            title: "CCTV",
            image: "https://amimarine.com/wp-content/uploads/2020/09/X-MDR-System-Camera-2.jpg",
        },
        {
            title: "Computers",
            image: "https://image.made-in-china.com/202f0j00GkSgcQyKhEuj/15-6-Inch-Innovative-Product-Dual-Core-Laptop-for-Home-and-Student.webp",
        },
        {
            title: "Smartphones",
            image: "https://cherryshop.com.ph/cdn/shop/files/s10.jpg?v=1697530588&width=533",
        },
        {
            title: "Components",
            image: "https://images.teamgroupinc.com/products/ssd/m2/ga-pro/01_s.jpg",
        },
        {
            title: "Peripherals",
            image: "https://fantechworld.com/cdn/shop/files/ProductImage_HeliosIIProSXD3V34K8KBlack.png?v=1717055541",
        },
        {
            title: "Tablets",
            image: "https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/plp-x/tablets-v5/product-shelf-and-pop-up/view-all/all-matepad-11-5-s.jpg",
        },
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_INVENTORY_API_URL}`);
                setFeatured(res.data.slice(0, 6)); // Only keep the first 6 products
            } catch (err) {
                console.error("Failed to fetch featured products:", err);
            }
        };
        fetchProducts();
    }, []);


    return (
        <Layout style={{ background: "#fff", width: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto' }}>
            {/* Hero Section */}
            <Content style={{ width: '100%', marginTop: 20 }}>
                <Carousel autoplay dots arrows>
                    {[
                        hero1,
                        hero2,
                        hero3,
                        hero4,
                        hero5
                    ].map((url, index) => (
                        <div key={index}>
                            <img
                                src={url}
                                alt={`Slide ${index + 1}`}
                                style={{
                                    width: '100%',
                                    height: '300px',
                                    objectFit: 'cover',
                                    borderRadius: '10px'
                                }}
                            />
                        </div>
                    ))}
                </Carousel>
            </Content>

            {/* Features Section */}
            <div style={{ padding: '40px 5%', width: '100%' }}>
                <Row gutter={[30, 30]} justify="space-between" align="middle">
                    {features.map((feature, index) => (
                        <Col xs={24} sm={12} md={6} key={index}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    minHeight: '80px',
                                }}
                            >
                                {feature.icon}
                                <div>
                                    <Title level={5} style={{ margin: 0, fontSize: '14px' }}>{feature.title}</Title>
                                    <Paragraph style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                                        {feature.description}
                                    </Paragraph>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>

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
                        <Col xs={24} sm={12} md={3} key={index}>
                            <Card
                                hoverable
                                variant="borderless"
                                className="category-card"
                                onClick={() => navigate(`/products?category=${encodeURIComponent(category.title)}`)}
                            >
                                <img src={category.image} alt={category.title} className="category-image" />
                                <h3 style={{ fontWeight: 500, textAlign: "center", marginTop: 10, width: "100%" }}>{category.title}</h3>
                            </Card>
                        </Col>
                    ))}

                </Row>
            </Content>

            {/* Featured Products */}
            <Content style={{ background: "#fff", padding: "30px 0", width: "100%", margin: "auto" }}>
                <div className='home-header'>
                    <h2 className='home-title'>Featured Products</h2>
                    <a onClick={() => navigate('/products')} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className='home-see-more'>
                            <p>See more</p>
                            <ArrowRightOutlined />
                        </div>
                    </a>
                </div>
                <Row gutter={[24, 24]} justify="center" style={{ marginTop: 30 }}>
                    {featured.map((product) => (
                        <Col xs={24} sm={12} md={4} key={product._id}>
                            <Card
                                hoverable
                                cover={
                                    <div
                                        style={{
                                            background: "#fff",
                                            padding: 10,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: 180,
                                            border: "1px solid #f0f0f0", // ✅ Border added here
                                            borderBottom: "none",        // Optional: if you want the card border to continue smoothly
                                            borderRadius: "8px 8px 0 0"  // Match card border radius if needed
                                        }}
                                    >
                                        <img
                                            src={product.image || "https://st4.depositphotos.com/17828278/24401/v/450/depositphotos_244011872-stock-illustration-image-vector-symbol-missing-available.jpg"}
                                            alt={product.name}
                                            style={{
                                                maxHeight: "100%",
                                                maxWidth: "100%",
                                                objectFit: "contain",
                                            }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://st4.depositphotos.com/17828278/24401/v/450/depositphotos_244011872-stock-illustration-image-vector-symbol-missing-available.jpg";
                                            }}
                                        />
                                    </div>
                                }
                                style={{
                                    background: "#fafafa",      // Content background
                                    // border: "1px solid #d9d9d9", // Light border
                                    // borderRadius: 8,
                                }}
                            >
                                <Card.Meta
                                    title={product.name}
                                    description={`₱${product.price?.toLocaleString()}`}
                                />
                                <Button
                                    type="primary"
                                    block
                                    style={{ marginTop: 16 }}
                                    onClick={() => openProductModal(product.id)}
                                >
                                    View Product
                                </Button>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Content>
            <ProductModal
                productId={selectedProductId}
                visible={modalVisible}
                onClose={closeProductModal}
            />

        </Layout >
    )
}

export default Home
