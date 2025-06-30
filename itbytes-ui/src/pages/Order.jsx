import React, { useEffect, useState } from "react";
import { Card, Typography, Tag, List, Descriptions, Spin, message, Button, Modal } from "antd";
import axios from "axios";

const { Title, Text } = Typography;
const apiUrl = import.meta.env.VITE_ORDER_API_URL;

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // "cancel" or "pay"
  const [selectedOrder, setSelectedOrder] = useState(null);

  const customerId = sessionStorage.getItem("userId");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    axios.get(`${apiUrl}/out/customer/${customerId}`)
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to fetch orders.");
        setLoading(false);
      });
  };

  const handlePayment = async (orderId) => {
    try {
      const payment = { isPaid: true };
      await axios.put(`${apiUrl}/out/${orderId}`, payment);
      fetchOrders();
      message.success("Payment Succesful.");
    } catch (err) {
      console.error(err);
      message.error("Payment Failed.");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );
  }
  const handleCancelOrder = async (orderId) => {
    try {
      const cancel = { status: "cancelled" };
      await axios.put(`${apiUrl}/out/${orderId}`, cancel);
      fetchOrders(); // Refresh orders after cancellation
      message.success("Order cancelled.");
    } catch (err) {
      console.error(err);
      message.error("Cancellation failed.");
    }
  };


  return (
    <div style={{ padding: "0 5%"}}>
      <Title level={3}>My Orders</Title>

      {orders.length === 0 ? (
        <Text>No orders found.</Text>
      ) : (
        [...orders].reverse().map((order) => (
          <Card
            key={order._id}
            title={`Order ID: ${order._id}`}
            style={{
              marginBottom: 24,
              opacity: order.status === "cancelled" ? 0.5 : 1,        // Grays it out
              pointerEvents: order.status === "cancelled" ? "none" : "auto", // Optional: disable interaction
            }}
            bordered
            extra={
              (order.status !== "cancelled" && !order.isPaid) && (
                <div style={{ display: "flex", gap: 8 }}>
                  <Button type="default" onClick={() => {
                    setSelectedOrder(order);
                    setModalType("cancel");
                    setIsModalOpen(true);
                  }}>
                    Cancel Order
                  </Button>

                  <Button type="primary" onClick={() => {
                    setSelectedOrder(order);
                    setModalType("pay");
                    setIsModalOpen(true);
                  }}>
                    Pay for Order
                  </Button>
                </div>
              )
            }
          >

            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Total Price">
                ₱{order.totalPrice.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={
                  order.status === "Completed" ? "green" :
                    order.status === "cancelled" ? "gray" : "orange"
                }>
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
            <Modal
              open={isModalOpen}
              onCancel={() => {
                setIsModalOpen(false);
                setModalType(null);
                setSelectedOrder(null);
              }}
              onOk={() => {
                if (modalType === "pay") {
                  handlePayment(selectedOrder._id);
                } else if (modalType === "cancel") {
                  handleCancelOrder(selectedOrder._id);
                }
                setIsModalOpen(false);
                setModalType(null);
                setSelectedOrder(null);
              }}
              title={modalType === "pay" ? "Proceed to Payment" : "Cancel Order"}
            >
              <p>
                {modalType === "pay"
                  ? "Are you sure you want to pay for this order?"
                  : "Are you sure you want to cancel this order?"}
              </p>
            </Modal>

          </Card>
        ))
      )}
    </div>
  );
};

export default Order;
