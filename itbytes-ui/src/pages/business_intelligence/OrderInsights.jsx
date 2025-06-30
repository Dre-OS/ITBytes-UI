import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Statistic } from "antd";
import { Pie, Column, Bar } from "@ant-design/charts";

const apiUrl = import.meta.env.VITE_ORDER_API_URL || "http://localhost:5000/api/orders";

const OrderInsights = () => {
  const [orders, setOrders] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [paidCount, setPaidCount] = useState(0);
  const [unpaidCount, setUnpaidCount] = useState(0);
  const [paidData, setPaidData] = useState([]);
  const [averageOrderValue, setAverageOrderValue] = useState(0);


  useEffect(() => {
    fetchOrders();

  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/out`);
      setOrders(data);
      console.log("Fetched Orders:", data);

      // Total Sales
      const total = data
        .filter(order => order.isPaid)
        .reduce((acc, order) => acc + order.totalPrice, 0);
      setTotalSales(total);

      // Order Status Breakdown
      const statusMap = {};
      data.forEach((order) => {
        statusMap[order.status] = (statusMap[order.status] || 0) + 1;
      });
      const statusArr = Object.keys(statusMap).map((status) => ({
        type: status,
        value: statusMap[status],
      }));
      setStatusData(statusArr);

      // Sales per Day
      const salesMap = {};
      data.forEach((order) => {
        if (order.isPaid) {  // ✅ Include only paid orders
          const date = new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          salesMap[date] = (salesMap[date] || 0) + order.totalPrice;
        }
      });

      const salesArr = Object.entries(salesMap).map(([date, value]) => ({
        date,
        value,
      }));

      setSalesData(salesArr);

      // Top Ordered Items
      const itemMap = {};
      data.forEach((order) => {
        order.orders.forEach((item) => {
          if (!itemMap[item.name]) {
            itemMap[item.name] = 0;
          }
          itemMap[item.name] += item.quantity;
        });
      });
      const itemArr = Object.entries(itemMap)
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5); // Top 5
      setTopItems(itemArr);
      console.log("Top Items Data:", itemMap);

      console.log("Top Items:", itemArr);

      // Paid/Unpaid breakdown
      let paid = 0;
      let unpaid = 0;

      data.forEach((order) => {
        if (order.isPaid) {
          paid += 1;
        } else {
          unpaid += 1;
        }
      });

      setPaidCount(paid);
      setUnpaidCount(unpaid);

      // Pie chart data
      setPaidData([
        { type: "Paid", value: paid },
        { type: "Unpaid", value: unpaid },
      ]);

      if (data.length > 0) {
        setAverageOrderValue(totalSales / data.length);
      } s

    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <Row gutter={24} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card>
            <Statistic
              style={{ fontFamily: 'Poppins' }}
              title="Total Orders"
              value={orders.length}
              valueStyle={{ fontSize: "16px", fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Sales"
              prefix="₱"
              style={{ fontFamily: 'Poppins' }}
              value={totalSales.toFixed(2)}
              valueStyle={{ fontSize: "16px", fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Most Ordered Item"
              style={{ fontFamily: 'Poppins' }}
              value={
                topItems.length > 0
                  ? `${topItems[0].name} (${topItems[0].quantity})`
                  : "N/A"
              }
              valueStyle={{ fontSize: "16px", fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Average Order Value"
              style={{ fontFamily: 'Poppins' }}
              prefix="₱"
              value={averageOrderValue.toFixed(2)}
              valueStyle={{ fontSize: "16px", fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={8}>
          <Card title="Order Status Breakdown" style={{ height: 360 }}>
            <Pie
              data={statusData}
              angleField="value"
              colorField="type"
              label={{ type: "spider" }}
              height={250}
              interactions={[{ type: "element-active" }]}
            />
          </Card>
        </Col>
        <Col span={16}>
          <Card title="Sales Over Time" style={{ height: 360 }}>
            <Column
              data={salesData}
              xField="date"
              yField="value"
              label={{ position: "middle" }}
              xAxis={{ label: { autoHide: true, autoRotate: false } }}
              height={250}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginTop: 20 }}>
        <Col span={16}>
          <Card title="Top Ordered Items" style={{ height: 360 }}>
            <Column
              data={topItems}
              xField="name"        // Product name at the bottom (x-axis)
              yField="quantity"    // Quantity on the vertical (y-axis)
              label={{ position: "top" }}
              height={250} s
              xAxis={{
                label: {
                  autoRotate: true,
                  style: { fontSize: 12 },
                },
              }}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Payment Status" style={{ height: 360 }}>
            <Pie
              height={250}
              data={paidData}
              angleField="value"
              colorField="type"
              label={{ type: "inner" }}
              interactions={[{ type: "element-active" }]}
            />
          </Card>
        </Col>

      </Row>
    </div>
  );
};

export default OrderInsights;
