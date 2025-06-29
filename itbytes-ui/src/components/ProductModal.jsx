// components/ProductModal.jsx
import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Tag,
  Spin,
  message,
  InputNumber,
  Form,
  Divider,
  Modal
} from "antd";
import axios from "axios";
import { useCart } from "../contexts/CartContext";

const { Title, Paragraph } = Typography;
const apiUrl = import.meta.env.VITE_INVENTORY_API_URL || "http://localhost:5000/api/products";

const ProductModal = ({ productId, visible, onClose }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (productId) {
      setLoading(true);
      axios.get(`${apiUrl}/${productId}`)
        .then((res) => {
          setProduct(res.data);
          setLoading(false);
        })
        .catch(() => {
          message.error("Product not found");
          onClose();
        });
    }
  }, [productId]);

  const handleAddToCart = () => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated");
    if (isAuthenticated !== "true") {
      message.error("Please log in to add items to your cart.");
      return;
    }

    if (quantity < 1) {
      message.warning("Please enter a valid quantity.");
      return;
    }

    addToCart({
      itemId: product.id,
      name: product.name,
      price: product.price,
    }, quantity);

    message.success(`${quantity} x "${product.name}" added to cart`);
    onClose();
  };

  return (
    <Modal
      open={visible}
      title=""
      onCancel={onClose}
      footer={null}
      width={800}
    >
      {loading || !product ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      ) : (
        <div style={{ display: "flex", gap: 24 }}>
          <div style={{ width: "50%" }}>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                height: '100%',
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

          <div style={{ flex: 1 }}>
            <Title level={4}>{product.name}</Title>
            <Paragraph type="secondary">{product.description}</Paragraph>
            <Paragraph><strong>Product ID:</strong> {product._id}</Paragraph>
            <Paragraph><strong>Category:</strong> <Tag color="blue">{product.category}</Tag></Paragraph>
            <Paragraph><strong>Tags:</strong> {product.tags.map((tag, index) => <Tag key={index}>{tag}</Tag>)}</Paragraph>
            <Paragraph><strong>In Stock:</strong> {product.quantity}</Paragraph>
            <Paragraph><strong>Price:</strong> ₱{product.price.toLocaleString()}</Paragraph>

            <Form layout="hprizontal" onFinish={handleAddToCart}>
              <Form.Item name="quantity" label="Quantity">
                <InputNumber
                  min={1}
                  max={product.quantity}
                  value={quantity}
                  onChange={setQuantity}
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
      )}
    </Modal>
  );
};

export default ProductModal;
