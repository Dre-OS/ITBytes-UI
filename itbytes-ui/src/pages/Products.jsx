import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Spin,
  Input,
  Checkbox,
  InputNumber,
  Tag,
  Skeleton
} from "antd";
import { useLocation } from "react-router-dom";
import ProductModal from "../components/ProductModal";
import { fetchItems } from "../services/ProductService";

const { Title, Paragraph } = Typography;
const digitsOnly = (val = '') => val.replace(/[^\d]/g, '');   // strip everything but 0‑9
const toNumber = (val) => (val === '' || val === null ? null : Number(val));

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const location = useLocation();

  const openProductModal = (id) => {
    setSelectedProductId(id);
    setModalVisible(true);
  };

  const closeProductModal = () => {
    setModalVisible(false);
    setSelectedProductId(null);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = await fetchItems();
      setProducts(allProducts);

      const queryParams = new URLSearchParams(location.search);
      const categoryFromUrl = queryParams.get("category");

      if (categoryFromUrl) {
        setSelectedCategories([categoryFromUrl]);
      } else {
        setSelectedCategories([]);
      }

      const lowerSearch = searchText.toLowerCase();
      let filtered = [...allProducts];

      if (categoryFromUrl) {
        filtered = filtered.filter((p) => p.category === categoryFromUrl);
      }

      if (searchText) {
        filtered = filtered.filter((p) =>
          p.name.toLowerCase().includes(lowerSearch) ||
          p.description.toLowerCase().includes(lowerSearch)
        );
      }

      setFiltered(filtered);
      setLoading(false);
    };

    fetchProducts();
  }, [location.search]);

  useEffect(() => {
    applyFilters();
  }, [searchText, selectedCategories, minPrice, maxPrice, products]);

  const uniqueCategories = [
    "CCTV",
    "Printer",
    "Smartphones",
    "Computer",
    "Components",
    "Monitors",
    "Peripherals",
    "Tablets"
  ];

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

  return (
    <div style={{ padding: "0 10%" }}>
      <Title level={3} style={{ marginBottom: "30px" }}>All Products</Title>
      <Row gutter={[24, 24]}>
        {/* Sidebar filters */}
        <Col xs={24} md={6}>
          <div style={{ padding: 16, background: "#f9f9f9", borderRadius: 8, paddingTop: 0, paddingLeft: 0, marginTop: '-30px' }}>
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
                <Checkbox key={cat} value={cat} style={{ fontFamily: 'Poppins' }}>
                  {cat}
                </Checkbox>
              ))}
            </Checkbox.Group>


            <Title level={5}>Price Range</Title>
            <div style={{ display: "flex", gap: 8 }}>
              <InputNumber
                placeholder="Min"
                value={minPrice}
                min={0}
                parser={digitsOnly}                // ⭠ keeps only digits while typing
                onKeyPress={(e) => {               // ⭠ stops any non‑digit key immediately
                  if (!/^\d$/.test(e.key)) e.preventDefault();
                }}
                onChange={(raw) => {
                  const num = toNumber(raw);
                  // block anything that would violate the rule
                  if (num !== null && maxPrice !== null && num > maxPrice) return;
                  setMinPrice(num);
                }}
                style={{ width: '50%' }}
              />

              <InputNumber
                placeholder="Max"
                value={maxPrice}
                min={0}
                parser={digitsOnly}
                onKeyPress={(e) => {
                  if (!/^\d$/.test(e.key)) e.preventDefault();
                }}
                onChange={(raw) => {
                  const num = toNumber(raw);
                  if (num !== null && minPrice !== null && num < minPrice) return;
                  setMaxPrice(num);
                }}
                style={{ width: '50%' }}
              />
            </div>
          </div>
        </Col>

        {/* Product list */}
        <Col xs={24} md={18}>
          {loading ? (
            <Row gutter={[24, 24]}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Col key={index} xs={24} sm={12} md={8} lg={6}>
                  <Card>
                    <div
                      style={{
                        width: '100%',
                        height: 160,
                        borderRadius: 8,
                        overflow: 'hidden',
                        marginBottom: 16,
                        background: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Skeleton.Image
                        active
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                    <Skeleton
                      active
                      title={false}
                      paragraph={{ rows: 3, width: ['80%', '60%', '100%'] }}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Row gutter={[24, 24]}>
              {filtered.map((product) => {
                const isOutOfStock = product.quantity === 0;

                return (
                  <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable={!isOutOfStock}
                      style={{
                        opacity: isOutOfStock ? 0.5 : 1,
                        pointerEvents: isOutOfStock ? "none" : "auto"
                      }}
                      cover={
                        <div
                          style={{
                            background: "#fff",
                            padding: 10,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: 180,
                            border: "1px solid #f0f0f0",
                            borderBottom: "none",
                            borderRadius: "8px 8px 0 0"
                          }}
                        >
                          <img
                            alt={product.name}
                            src={product.image}
                            style={{
                              maxHeight: "160px",
                              maxWidth: "100%",
                              width: "auto",
                              objectFit: "contain"
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://st4.depositphotos.com/17828278/24401/v/450/depositphotos_244011872-stock-illustration-image-vector-symbol-missing-available.jpg";
                            }}
                          />
                        </div>
                      }
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 16,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          height: 24
                        }}
                        title={product.name}
                      >
                        {product.name}
                      </div>
                      <Paragraph style={{ marginBottom: 4, color: "#888", fontSize: 12 }}>
                        Category: <Tag color="default">{product.category}</Tag>
                      </Paragraph>
                      <Typography.Text strong style={{ fontSize: 14 }}>
                        {product?.price != null ? `₱${product.price.toLocaleString()}` : "₱--"}
                      </Typography.Text>

                      <Paragraph
                        style={{
                          margin: "8px 0",
                          fontSize: 12,
                          color: isOutOfStock ? "red" : "#888"
                        }}
                      >
                        {isOutOfStock ? "Out of Stock" : `In Stock: ${product.quantity}`}
                      </Paragraph>

                      <Button
                        type="default"
                        block
                        disabled={isOutOfStock}
                        style={{
                          marginTop: 8,
                          borderWidth: 2,
                          borderColor: "#2F4860",
                          color: "#2F4860",
                          fontSize: 13,
                          fontWeight: 500,
                          padding: "6px 12px",
                          backgroundColor: "#fff",
                          cursor: isOutOfStock ? "not-allowed" : "pointer"
                        }}
                        onClick={() => openProductModal(product.id)}
                      >
                        View Product
                      </Button>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </Col>
      </Row>
      <ProductModal
        productId={selectedProductId}
        visible={modalVisible}
        onClose={closeProductModal}
      />
    </div>
  );
};

export default Products;
