import React, { useEffect, useState } from "react";
import { Card, Typography, Tag, List, Descriptions, Spin, message, Button } from "antd";
import axios from "axios";

const { Title, Text } = Typography;
const apiUrl = import.meta.env.VITE_ORDER_API_URL;

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const customerId = sessionStorage.getItem("userID");

  useEffect(() => {
    axios.get(`${apiUrl}/customer/${customerId}`)
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to fetch orders.");
        setLoading(false);
      });
  }, []);

  const handlePayment = async (orderId) => {
    try {
      await axios.patch(`${apiUrl}/pay/${orderId}`);
      message.success("Payment successful!");

      // Refresh orders
      const { data } = await axios.get(`${apiUrl}/customer/${customerId}`);
      setOrders(data);
    } catch (err) {
      console.error(err);
      message.error("Payment failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "0 5%" }}>
      <Title level={3}>My Orders</Title>

      {orders.length === 0 ? (
        <Text>No orders found.</Text>
      ) : (
        orders.map((order) => (
          <Card
            key={order._id}
            title={`Order ID: ${order._id}`}
            style={{ marginBottom: 24 }}
            bordered
            extra={
              !order.isPaid && (
                <Button type="primary" onClick={() => handlePayment(order._id)}>
                  Pay for Order
                </Button>
              )
            }
          >
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Total Price">
                ₱{order.totalPrice.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={order.status === "Completed" ? "green" : "orange"}>
                  {order.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Payment">
                <Tag color={order.isPaid ? "green" : "red"}>
                  {order.isPaid ? "Paid" : "Unpaid"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Date Ordered">
                {new Date(order.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            <List
              header={<strong>Ordered Items</strong>}
              dataSource={order.orders}
              style={{ marginTop: 20 }}
              bordered
              renderItem={(item) => (
                <List.Item>
                  <div style={{ flex: 1 }}>
                    <strong>{item.name}</strong> (₱{item.price.toLocaleString()} x {item.quantity})
                  </div>
                  <div><strong>Subtotal:</strong> ₱{item.subtotal.toLocaleString()}</div>
                </List.Item>
              )}
            />
          </Card>
        ))
      )}
    </div>
  );
};

export default Order;
