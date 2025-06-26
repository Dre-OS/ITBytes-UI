import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Statistic } from "antd";
import { Pie, Column, Bar } from "@ant-design/charts";

const apiUrl = import.meta.env.VITE_INVENTORY_API_URL;

const ProductInsights = () => {
  const [products, setProducts] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [tagCounts, setTagCounts] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(apiUrl);
      setProducts(data);

      // Category counts
      const categories = data.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {});
      const categoryData = Object.keys(categories).map((key) => ({
        type: key,
        value: categories[key],
      }));
      setCategoryCounts(categoryData);

      // Tag usage counts
      const tagMap = {};
      data.forEach((product) => {
        product.tags.forEach((tag) => {
          tagMap[tag] = (tagMap[tag] || 0) + 1;
        });
      });
      const tagData = Object.keys(tagMap).map((tag) => ({
        type: tag,
        value: tagMap[tag],
      }));
      setTagCounts(tagData);

      // Inventory per product
      const inventory = data.map((product) => ({
        name: product.name,
        quantity: product.quantity,
      }));
      setInventoryData(inventory);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <Row gutter={24} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={products.length}
              valueStyle={{ fontSize: "20px", fontFamily: "Poppins", fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={8}>
          <Card title="Product Distribution by Category" style={{ height: 360 }}>
            <Pie
              height={250}
              data={categoryCounts}
              angleField="value"
              colorField="type"
              label={{ type: "spider" }}
              interactions={[{ type: "element-active" }]}
            />
          </Card>
        </Col>

        <Col span={16}>
          <Card title="Tag Frequency Across Products" style={{ height: 360 }}>
            <Bar
              height={250}
              data={tagCounts}
              xField="value"
              yField="type"
              seriesField="type"
              legend={false}
              label={{ position: "right" }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={24} style={{ marginTop: 20 }}>
                <Col span={12}>
          <Card title="Inventory Per Product" style={{ height: 360 }}>
            <Column
              height={250}
              data={inventoryData}
              xField="name"
              yField="quantity"
              label={{ position: "middle" }}
              xAxis={{ label: { autoHide: true, autoRotate: false } }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductInsights;