import React, { useEffect, useState } from "react";
import { Card, Typography, Tag, List, Descriptions, Spin, message, Button, Modal, Divider } from "antd";
import OrderService from "../services/OrderService";
import "../styles/Order.css"; // Assuming you have some styles for the order page
import { FileTextOutlined, PrinterOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // "cancel" or "pay"
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [receiptOrder, setReceiptOrder] = useState(null);
  const [isReceiptVisible, setIsReceiptVisible] = useState(false);

  const customerId = sessionStorage.getItem("userId");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await OrderService.getCustomerOrders(customerId);
      setOrders(data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (orderId) => {
    try {
      await OrderService.markAsPaid(orderId);
      fetchOrders();
      message.success("Payment successful.");
    } catch (err) {
      console.error(err);
      message.error("Payment failed.");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await OrderService.cancelOrder(orderId);
      fetchOrders();
      message.success("Order cancelled.");
    } catch (err) {
      console.error(err);
      message.error("Cancellation failed.");
    }
  };

  return (
    <div style={{ padding: "0 5%" }}>
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
            variant="bordered"
            extra={
              order.status !== "cancelled" ? (
                order.isPaid ? (
                  <Button
                    type="primary"
                    onClick={() => {
                      setReceiptOrder(order);
                      setIsReceiptVisible(true);
                    }}
                    icon={<FileTextOutlined />}
                  >
                    View Receipt
                  </Button>
                ) : (
                  <div style={{ display: "flex", gap: 8 }}>
                    <Button
                      type="default"
                      onClick={() => {
                        setSelectedOrder(order);
                        setModalType("cancel");
                        setIsModalOpen(true);
                      }}
                    >
                      Cancel Order
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => {
                        setSelectedOrder(order);
                        setModalType("pay");
                        setIsModalOpen(true);
                      }}
                    >
                      Pay for Order
                    </Button>
                  </div>
                )
              ) : null
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
              title="Receipt"
              open={isReceiptVisible}
              footer={[
                <Button key="print" icon={<PrinterOutlined />} onClick={() => window.print()} type="primary">Print</Button>,
                <Button key="close" onClick={() => setIsReceiptVisible(false)}>Close</Button>,
              ]}
              onCancel={() => setIsReceiptVisible(false)}
            >
              {receiptOrder && (
                <div className="receipt-content">
                  <Title level={4}>ITBytes Order Receipt</Title>
                  <Text>Order ID: {receiptOrder._id}</Text><br />
                  <Text>Date: {new Date(receiptOrder.createdAt).toLocaleString()}</Text><br />
                  {/* <Text>Status: {receiptOrder.status}</Text><br /> */}
                  <Text>Payment: {receiptOrder.isPaid ? "Received" : "Unpaid"}</Text><br />
                  <Divider />
                  <List
                    header="Items"
                    style={{ fontFamily: "Poppins" }}
                    dataSource={receiptOrder.orders}
                    renderItem={(item) => (
                      <List.Item>
                        <div style={{ flex: 1 }}>{item.name} x {item.quantity}</div>
                        <div>₱{item.subtotal.toLocaleString()}</div>
                      </List.Item>
                    )}
                  />
                  <Divider />
                  <Title level={5}>Total: ₱{receiptOrder.totalPrice.toLocaleString()}</Title>

                  <style>

                  </style>
                </div>
              )}
            </Modal>
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
