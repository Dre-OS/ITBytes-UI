import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Typography,
    Button,
    Tag,
    Spin,
    message,
    InputNumber,
    Form,
    Divider
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
import axios from "axios";
import { useCart } from "../contexts/CartContext"; // Assuming you have a CartContext for managing cart state

const { Title, Paragraph } = Typography;
const apiUrl = import.meta.env.VITE_INVENTORY_API_URL || "http://localhost:5000/api/products";

const Product = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    const { addToCart } = useCart(); // Using CartContext to manage cart

    useEffect(() => {
        axios.get(`${apiUrl}/${id}`)
            .then((res) => {
                setProduct(res.data);
                setLoading(false);
            })
            .catch(() => {
                message.error("Product not found");
                navigate("/");
            });
    }, [id]);

    const handleAddToCart = () => {
        const isAuthenticated = sessionStorage.getItem("isAuthenticated");
        console.log("isAuthenticated:", isAuthenticated);
        if (isAuthenticated !== "true") {
            message.error("Please log in to add items to your cart.");
            return;
        }

        if (quantity < 1) {
            message.warning("Please enter a valid quantity.");
            return;
        }

        const productToAdd = {
            itemId: product.id,
            name: product.name,
            price: product.price,
        };
        console.log("Adding to cart:", productToAdd, "Quantity:", quantity);

        addToCart(productToAdd, quantity);
        message.success(`${quantity} x "${product.name}" added to cart`);
    };

    if (loading) {
        return <Spin size="large" style={{ display: "block", margin: "100px auto" }} />;
    }

    if (!product) return null;

    return (
        <div style={{ maxWidth: "90%", margin: "0 auto" }}>
            <Button onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>
                <LeftOutlined /> Back to Products
            </Button>

            <div
                style={{
                    display: "flex",
                    gap: 32,
                    background: "#fff",
                    //   padding: 24,
                    //   borderRadius: 8,
                    //   boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                }}
            >
                {/* Product Image */}
                <div style={{ width: "30%", height: "30%" }}>
                    <img
                        src={product.image}
                        alt={product.name}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 8,
                            backgroundColor: "#f5f5f5"
                        }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://www.svgrepo.com/show/508699/landscape-placeholder.svg";
                        }}
                    />
                </div>

                {/* Product Details */}
                <div style={{ flex: 1 }}>
                    <Title level={3}>{product.name}</Title>
                    <Divider />
                    <Paragraph style={{ fontSize: 16 }}>
                        Price: ₱{product.price.toLocaleString()}
                    </Paragraph>
                    <Divider />
                    <Paragraph type="secondary">{product.description}</Paragraph>
                    <Paragraph><strong>Product ID:</strong> {product._id}</Paragraph>

                    <Paragraph>
                        <strong>Category:</strong>{" "}
                        <Tag color="blue">{product.category}</Tag>
                    </Paragraph>

                    <Paragraph>
                        <strong>Tags:</strong>{" "}
                        {product.tags.map((tag, index) => (
                            <Tag key={index}>{tag}</Tag>
                        ))}
                    </Paragraph>

                    <Paragraph>
                        <strong>In Stock:</strong> {product.quantity}
                    </Paragraph>

                    <Form layout="horizontal" onFinish={handleAddToCart}>
                        <Form.Item
                            label="Quantity"
                            name="quantity"
                            rules={[{ required: true, message: "Enter quantity" }]}
                        >
                            <InputNumber
                                min={1}
                                max={product.quantity}
                                value={quantity}
                                onChange={(val) => setQuantity(val)}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Add to Cart
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Product;
