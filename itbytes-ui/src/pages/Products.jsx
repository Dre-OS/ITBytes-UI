import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Typography, message, Spin } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
useEffect(() => {
  axios.get("http://localhost:5000/api/products")
    .then((res) => {
      console.log("Raw response:", res);    
      console.log("res.data:", res.data);      
      setProducts(res.data);              
    })
    .catch((err) => {
      console.error("Fetch error:", err);
    });
}, []);


  return (
    <div style={{ padding: "0 5%" }}>
      <Title level={3} style={{ marginBottom: "30px" }}>All Products</Title>

      {!loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[24, 24]}>
          {products.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <img
                    alt={product.name}
                    src={product.image}
                    style={{ height: 200, objectFit: "cover" }}
                  />
                }
              >
                <Title level={5}>{product.name}</Title>
                <Paragraph style={{ marginBottom: 4, color: "#888" }}>
                  Category: {product.category}
                </Paragraph>
                <Paragraph strong style={{ fontSize: 16 }}>
                  ₱{product.price.toLocaleString()}
                </Paragraph>
                <Button
                  type="primary"
                  block
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  View Product
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Products;
