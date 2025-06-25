import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  message,
  Spin,
  Input,
  Checkbox,
  InputNumber
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;
const apiUrl = import.meta.env.VITE_INVENTORY_API_URL || "http://localhost:5000/api/products";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${apiUrl}`)
      .then((res) => {
        setProducts(res.data);
        setFiltered(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        message.error("Error fetching products");
      });
  }, []);

  const uniqueCategories = [...new Set(products.map(p => p.category))];

  const applyFilters = () => {
    let filtered = [...products];

    if (searchText) {
      const lower = searchText.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
      );
    }

    if (selectedCategories.length) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    if (minPrice !== null) {
      filtered = filtered.filter(p => p.price >= minPrice);
    }

    if (maxPrice !== null) {
      filtered = filtered.filter(p => p.price <= maxPrice);
    }

    setFiltered(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchText, selectedCategories, minPrice, maxPrice]);

  return (
    <div style={{ padding: "0 5%" }}>
      <Title level={3} style={{ marginBottom: "30px" }}>All Products</Title>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[24, 24]}>
          {/* Sidebar filters */}
          <Col xs={24} md={6}>
            <div style={{ padding: 16, background: "#fff", borderRadius: 8, paddingTop: 0, paddingLeft: 0, marginTop: '-30px' }}>
              <Title level={5}>Search</Title>
              <Input
                placeholder="Search products"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ marginBottom: 0 }}
              />

              <Title level={5}>Category</Title>
              <Checkbox.Group
                value={selectedCategories}
                onChange={setSelectedCategories}
                style={{ display: "flex", flexDirection: "column", marginBottom: 16 }}
              >
                {uniqueCategories.map((cat) => (
                  <Checkbox key={cat} value={cat}>
                    {cat}
                  </Checkbox>
                ))}
              </Checkbox.Group>

              <Title level={5}>Price Range</Title>
              <div style={{ display: "flex", gap: 8 }}>
                <InputNumber
                  min={0}
                  placeholder="Min"
                  value={minPrice}
                  onChange={setMinPrice}
                  style={{ width: "50%" }}
                />
                <InputNumber
                  min={0}
                  placeholder="Max"
                  value={maxPrice}
                  onChange={setMaxPrice}
                  style={{ width: "50%" }}
                />
              </div>
            </div>
          </Col>

          {/* Product list */}
          <Col xs={24} md={18}>
            <Row gutter={[24, 24]}>
              {filtered.map((product) => (
                <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={product.name}
                        src={product.image}
                        style={{ height: 200, objectFit: "cover" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://www.svgrepo.com/show/508699/landscape-placeholder.svg";
                        }}
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
                      onClick={() => navigate(`/products/${product._id}`)}
                    >
                      View Product
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Products;
