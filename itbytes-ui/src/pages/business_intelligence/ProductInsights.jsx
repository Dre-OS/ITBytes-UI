import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Statistic } from "antd";
import { Pie, Column, Bar } from "@ant-design/charts";

const apiUrl = import.meta.env.VITE_INVENTORY_API_URL;

const ProductInsights = () => {
  const [products, setProducts] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [tagCounts, setTagCounts] = useState([]);
  const [topInventory, setTopInventory] = useState([]);
  const [lowInventory, setLowInventory] = useState([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [mostStocked, setMostStocked] = useState(null);
  const [priceHistogram, setPriceHistogram] = useState([]);
  const mostUsedTag = tagCounts.reduce((max, tag) => tag.value > max.value ? tag : max, { type: "", value: 0 });



  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(apiUrl);
      setProducts(data);

      const lowStock = data.filter(p => p.quantity < 5).length;
      setLowStockCount(lowStock);

      const buckets = {
        "₱0 - ₱999": 0,
        "₱1,000 - ₱2,999": 0,
        "₱3,000 - ₱4,999": 0,
        "₱5,000 - ₱9,999": 0,
        "₱10,000+": 0,
      };

      data.forEach((product) => {
        const price = product.price;
        if (price < 1000) buckets["₱0 - ₱999"]++;
        else if (price < 3000) buckets["₱1,000 - ₱2,999"]++;
        else if (price < 5000) buckets["₱3,000 - ₱4,999"]++;
        else if (price < 10000) buckets["₱5,000 - ₱9,999"]++;
        else buckets["₱10,000+"]++;
      });

      const histogramData = Object.entries(buckets).map(([range, count]) => ({
        range,
        count,
      }));

      setPriceHistogram(histogramData);


      const maxProduct = data.reduce((max, p) => p.quantity > max.quantity ? p : max, data[0]);
      setMostStocked(maxProduct);

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

      // Tag frequency (Top 10 only)
      const tagMap = {};
      data.forEach((product) => {
        product.tags.forEach((tag) => {
          tagMap[tag] = (tagMap[tag] || 0) + 1;
        });
      });
      const tagData = Object.entries(tagMap)
        .map(([type, value]) => ({ type, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
      setTagCounts(tagData);

      // Inventory: Top 10 Most and Least Stocked
      const sortedInventory = [...data].sort((a, b) => b.quantity - a.quantity);
      setTopInventory(
        sortedInventory.slice(0, 10).map(p => ({ name: p.name, quantity: p.quantity }))
      );
      setLowInventory(
        sortedInventory.slice(-10).map(p => ({ name: p.name, quantity: p.quantity }))
      );
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
              style={{ fontFamily: 'Poppins' }}
              value={products.length}
              valueStyle={{ fontSize: "16px", fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Low Stock Products"
              style={{ fontFamily: 'Poppins' }}
              value={lowStockCount}
              valueStyle={{ fontSize: "16px", color: "#cf1322", fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              style={{ fontFamily: 'Poppins' }}
              title="Most Stocked Product"
              value={mostStocked?.name}
              suffix={`(${mostStocked?.quantity})`}
              valueStyle={{ fontSize: "16px", fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              style={{ fontFamily: 'Poppins' }}
              title="Most Used Tag"
              value={mostUsedTag?.type || "N/A"}
              suffix={`(${mostUsedTag?.value || 0})`}
              valueStyle={{ fontSize: "16px", fontWeight: 600 }}
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
          <Card title="Most Used Tags (Top 10)" style={{ height: 360 }}>
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
          <Card title="Top 10 Most Stocked Products" style={{ height: 360 }}>
            <Column
              height={250}
              data={topInventory}
              xField="name"
              yField="quantity"
              label={{ position: "top" }}
              xAxis={{ label: { autoHide: true, autoRotate: false } }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Top 10 Least Stocked Products" style={{ height: 360 }}>
            <Column
              height={250}
              data={lowInventory}
              xField="name"
              yField="quantity"
              label={{ position: "top" }}
              xAxis={{ label: { autoHide: true, autoRotate: false } }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={24} style={{ marginTop: 20 }}>
        <Col span={16}>
          <Card title="Price Distribution (Histogram)" style={{ height: 360 }}>
            <Column
              data={priceHistogram}
              xField="range"
              yField="count"
              label={{ position: "middle" }}
              height={250}
              color="#1890ff"
              xAxis={{
                label: {
                  autoHide: false,
                  autoRotate: false,
                },
                title: {
                  text: "Price Ranges",
                },
              }}
              yAxis={{
                title: {
                  text: "Number of Products",
                },
              }}
            />
          </Card>
        </Col>
      </Row>

    </div>
  );
};

export default ProductInsights;
