import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Statistic } from "antd";
import { Pie, Column } from "@ant-design/charts";

const orderUrl = import.meta.env.VITE_ORDER_API_URL;
const inventoryInUrl = import.meta.env.VITE_INVENTORY_IN_API_URL;

const PurchaseInsights = () => {
  const [pendingSupplies, setPendingSupplies] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [topPurchasedItems, setTopPurchasedItems] = useState([]);
  const [dailyPurchases, setDailyPurchases] = useState([]);
  const [totalSpend, setTotalSpend] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [inventoryRes, orderRes] = await Promise.all([
        axios.get(`${inventoryInUrl}`),
        axios.get(`${orderUrl}/in`),
      ]);

      const inventoryData = inventoryRes.data;
      const orderData = orderRes.data;

      console.log("Fetched Inventory Data:", inventoryData);
      console.log("Fetched Order Data:", orderData);

      setOrderHistory(orderData);
      setPendingSupplies(inventoryData);
      setPendingCount(inventoryData.length);

      // Calculate total spend
      const total = orderData.reduce((acc, order) => acc + order.totalPrice, 0);
      setTotalSpend(total);

      // Daily purchases
      const dailyMap = {};
      orderData.forEach(order => {
        const date = new Date(order.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        dailyMap[date] = (dailyMap[date] || 0) + order.totalPrice;
      });

      const dailyArr = Object.entries(dailyMap).map(([date, value]) => ({
        date,
        value,
      }));
      setDailyPurchases(dailyArr);

      // Top purchased items
      const itemMap = {};
      inventoryData.forEach(order => {
        if (!itemMap[order.name]) {
          itemMap[order.name] = 0;
        }
        itemMap[order.name] += order.quantity;
      });

      const topItems = Object.entries(itemMap)
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      setTopPurchasedItems(topItems);

    } catch (err) {
      console.error("Failed to fetch purchase data:", err);
    }
  };

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <Row gutter={24} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Items Purchased" value={orderHistory.length} style={{ fontFamily: 'Poppins, sans-serif' }} valueStyle={{ fontSize: "16px", color: "#cf1322", fontWeight: 600 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Pending Supplies" value={pendingCount} style={{ fontFamily: 'Poppins, sans-serif' }} valueStyle={{ fontSize: "16px", color: "#cf1322", fontWeight: 600 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Total Spent" prefix="₱" value={totalSpend.toFixed(2)} style={{ fontFamily: 'Poppins, sans-serif' }} valueStyle={{ fontSize: "16px", color: "#cf1322", fontWeight: 600 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={16}>
          <Card title="Purchases Over Time" style={{ height: 360 }}>
            <Column
              data={dailyPurchases}
              xField="date"
              yField="value"
              label={{ position: "middle" }}
              height={250}
              xAxis={{ label: { autoHide: true, autoRotate: false } }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Top 5 Purchased Items" style={{ height: 360 }}>
            <Column
              data={topPurchasedItems}
              xField="name"
              yField="quantity"
              label={{ position: "top" }}
              height={250}
              xAxis={{ label: { autoRotate: true, style: { fontSize: 12 } } }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PurchaseInsights;
