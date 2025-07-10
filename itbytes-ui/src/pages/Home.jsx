import React, { useState, useEffect } from 'react'
import { Button, Card, Col, Layout, Row, Typography, Carousel } from "antd";
import { fetchFeaturedProducts } from '../services/ProductService';
import '../styles/Home.css';
import ProductModal from '../components/ProductModal';
import { useNavigate } from 'react-router-dom';
const { Paragraph } = Typography;
const { Content } = Layout;
import {
    ArrowRightOutlined,
    LockOutlined,
    ThunderboltOutlined,
    CheckCircleOutlined,
    CloudOutlined,
    LaptopOutlined,
    MobileOutlined,
    PrinterOutlined,
    AppstoreOutlined,
    DesktopOutlined,
    VideoCameraOutlined,
    TabletOutlined,
    UsbOutlined
} from '@ant-design/icons';
import hero1 from '../assets/hero1.png';
import hero2 from '../assets/hero2.png';
import hero3 from '../assets/hero3.png';
import hero4 from '../assets/hero4.png';
import hero5 from '../assets/hero5.png';
import vertical1 from '../assets/vertical_poster.jpg';
import vertical3 from '../assets/vertical_poster3.jpg';
import horizontal1 from '../assets/horizontal1.jpg';
import horizontal2 from '../assets/horizontal2.jpg';
import horizontal3 from '../assets/horizontal3.jpg';

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

    const { Title } = Typography;

    const features = [
        {
            icon: <LockOutlined style={{ fontSize: 24, color: '#000' }} />,
            title: 'Secure Checkout',
            description: 'All payments are protected with end-to-end encryption.',
        },
        {
            icon: <ThunderboltOutlined style={{ fontSize: 24, color: '#000' }} />,
            title: 'Fast Delivery',
            description: 'Get your gadgets delivered within 1-3 business days.',
        },
        {
            icon: <CheckCircleOutlined style={{ fontSize: 24, color: '#000' }} />,
            title: 'Quality Assured',
            description: 'We only sell authentic, high-quality electronics.',
        },
        {
            icon: <CloudOutlined style={{ fontSize: 24, color: '#000' }} />,
            title: 'Easy Returns',
            description: 'Hassle-free returns within 7 days of purchase.',
        }

    ];

    const categories = [
        {
            title: "Printer",
            icon: <PrinterOutlined style={{ fontSize: 36 }} />,
        },
        {
            title: "Monitors",
            icon: <DesktopOutlined style={{ fontSize: 36 }} />,
        },
        {
            title: "CCTV",
            icon: <VideoCameraOutlined style={{ fontSize: 36 }} />,
        },
        {
            title: "Computers",
            icon: <LaptopOutlined style={{ fontSize: 36 }} />,
        },
        {
            title: "Smartphones",
            icon: <MobileOutlined style={{ fontSize: 36 }} />,
        },
        {
            title: "Components",
            icon: <AppstoreOutlined style={{ fontSize: 36 }} />,
        },
        {
            title: "Peripherals",
            icon: <UsbOutlined style={{ fontSize: 36 }} />,
        },
        {
            title: "Tablets",
            icon: <TabletOutlined style={{ fontSize: 36 }} />,
        },
    ];

    useEffect(() => {
        const loadFeatured = async () => {
            try {
                const data = await fetchFeaturedProducts();
                setFeatured(data);
            } catch (err) {
                console.error("Failed to fetch featured products:", err);
            }
        };
        loadFeatured();
    }, []);

    return (
        <Layout style={{ background: "#F9F9F9", width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto' }}>
            <Row gutter={16} style={{ width: '100%', marginTop: 20 }}>
                {/* Hero Section (span 16) */}
                <Col xs={24} md={19}>
                    <Carousel autoplay dots arrows>
                        {[hero1, hero2, hero3, hero4, hero5].map((url, index) => (
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
                </Col>

                {/* Vertical Poster (span 8) */}
                <Col xs={24} md={5}>
                    <Carousel autoplay dots>
                        {[vertical1, vertical3].map((url, index) => (
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
                </Col>
            </Row>

            {/* <Row gutter={16} style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                {[horizontal1, horizontal2, horizontal3].map((url, index) => (
                    <Col xs={24} md={8} key={index}>   
                    <img
                        src={url}
                        alt={`Horizontal Banner ${index + 1}`}
                        style={{
                            width: '100%',
                            height: '250px',
                            objectFit: 'cover',
                            borderRadius: '10px',
                        }}
                    />
                </Col>
            ))}
        </Row> */}

            {/* Features Section */}
            <div style={{ padding: '30px 5%', width: '99%', background: '#FAD86D', borderRadius: '10px', marginTop: 10, }}>
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
                                    <Paragraph style={{ margin: 0, fontSize: '13px', color: '#000' }}>
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
                                onClick={() => navigate(`/products?category=${encodeURIComponent(category.title)}`)}
                                style={{
                                    textAlign: 'center',
                                    borderRadius: 10,
                                    border: '2px solid #d9d9d9',
                                    backgroundColor: '#f9f9f9',
                                    height: 120,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {category.icon || <AppstoreOutlined style={{ fontSize: 36 }} />}
                                <div style={{ marginTop: 8, fontWeight: 500, fontSize: 14 }}>
                                    {category.title}
                                </div>
                            </Card>
                        </Col>
                    ))}

                </Row>
            </Content>

            {/* Featured Products */}
            <Content style={{ background: "#F9F9F9", padding: "30px 0", width: "100%", margin: "auto" }}>
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
                                    background: "#fff",      // Content background
                                    // border: "1px solid #d9d9d9", // Light border
                                    // borderRadius: 8,
                                }}
                            >
                                <p style={{ fontSize: 12, color: '#2D4756', marginTop: -10 }}>In stock {product.quantity} items</p>
                                <Card.Meta
                                    title={product.name}
                                    description={`₱${product.price?.toLocaleString()}`}
                                />
                                <Button
                                    type="default"
                                    block
                                    onClick={() => openProductModal(product.id)}
                                    style={{
                                        marginTop: 16,
                                        borderWidth: 2,
                                        borderColor: '#2F4860',
                                        color: '#2F4860',
                                        fontSize: 13,
                                        fontWeight: 500,
                                        padding: "6px 12px",
                                        backgroundColor: '#fff',
                                    }}
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
