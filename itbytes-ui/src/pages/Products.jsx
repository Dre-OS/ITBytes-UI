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
  InputNumber,
  Tag
} from "antd";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import ProductModal from "../components/ProductModal"; // Adjust path if needed



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
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromQuery = queryParams.get("category");


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
      try {
        const res = await axios.get(apiUrl);
        const allProducts = res.data;
        setProducts(allProducts);

        const queryParams = new URLSearchParams(location.search);
        const categoryFromUrl = queryParams.get("category");

        // Update selectedCategories (if from URL)
        if (categoryFromUrl) {
          setSelectedCategories([categoryFromUrl]);
        } else {
          setSelectedCategories([]);
        }


        // ✅ Apply filters manually after setting all necessary data
        const lowerSearch = searchText.toLowerCase();
        let filtered = [...allProducts];

        if (categoryFromUrl) {
          filtered = filtered.filter(p => p.category === categoryFromUrl);
        }

        if (searchText) {
          filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(lowerSearch) ||
            p.description.toLowerCase().includes(lowerSearch)
          );
        }

        setFiltered(filtered);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        message.error("Error fetching products");
      }
    };

    fetchProducts();
  }, [location.search]); // Re-run when query changes (like category)

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
    <div style={{ padding: "0 5%" }}>
      <Title level={3} style={{ marginBottom: "30px" }}>All Products</Title>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "50px", height: "50vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spin size="large" />
        </div>
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
                <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
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
                            e.target.src = "https://st4.depositphotos.com/17828278/24401/v/450/depositphotos_244011872-stock-illustration-image-vector-symbol-missing-available.jpg";
                          }}
                        />
                      </div>
                    }
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 16,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        height: 24,
                      }}
                      title={product.name} // Tooltip shows full name on hover
                    >
                      {product.name}
                    </div>
                    <Paragraph style={{ marginBottom: 4, color: "#888" }}>
                      Category: <Tag color="default">{product.category}</Tag>
                    </Paragraph>
                    <Typography.Text strong style={{ fontSize: 16 }}>
                      ₱{product.price.toLocaleString()}
                    </Typography.Text>
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
          </Col>
        </Row>
      )}
      <ProductModal
        productId={selectedProductId}
        visible={modalVisible}
        onClose={closeProductModal}
      />
    </div>
  );
};

export default Products;
