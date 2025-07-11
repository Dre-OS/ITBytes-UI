import React, { useEffect, useState } from "react";
import { Card, Typography, Tag, List, Descriptions, Row, Col, message, Button, Modal, Divider, Form, Input } from "antd";
import OrderService from "../services/OrderService";
import "../styles/Order.css"; // Assuming you have some styles for the order page
import { FileTextOutlined, PrinterOutlined } from "@ant-design/icons";
import UserSession from "../utils/UserSession";
import axios from "axios";

const { Title, Text } = Typography;

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // "cancel" or "pay"
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [receiptOrder, setReceiptOrder] = useState(null);
  const [isReceiptVisible, setIsReceiptVisible] = useState(false);
  const toBusinessAccount = '666-3251-855-1642'; // Replace with actual customer account number
  const [customerAccountNumber, setcustomerAccountNumber] = useState("");
  const [accountParts, setAccountParts] = useState(['', '', '', '']);

  const customerId = UserSession.get()?.userId;

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

  const handleChange = (value, index) => {
    const newParts = [...accountParts];
    newParts[index] = value.replace(/\D/g, '').slice(0, 4); // Allow digits only, max 4
    setAccountParts(newParts);
    const fullAccountNumber = newParts.join('-');
    setcustomerAccountNumber(fullAccountNumber);
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
    <div style={{ padding: "0 10%" }}>
      <Title level={3}>My Orders</Title>

      {orders.length === 0 ? (
        <Text>No orders found.</Text>
      ) : (
        [...orders].reverse().map((order) => (
          <Card
            key={order._id}
            style={{
              marginBottom: 24,
              opacity: order.status === "cancelled" ? 0.5 : 1,
              pointerEvents: order.status === "cancelled" ? "none" : "auto",
            }}
            variant="bordered"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h3 style={{ margin: 0 }}>Order ID: {order._id} </h3>
              {order.status !== "cancelled" && (
                order.paymentStatus === 'paid' ? (
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
              )}
            </div>
            <div style={{ marginBottom: 20, marginTop: -16 }}>
              <p style={{ fontSize: 12, color: "gray", marginTop: 4, marginBottom: 0 }}>{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <Tag color={
              order.status === "Completed" ? "green" :
                order.status === "cancelled" ? "gray" : "orange"
            }>
              {order.status}
            </Tag>
            <Tag color={order.paymentStatus === 'paid' ? "green" : "red"}>
              {order.paymentStatus === 'paid' ? "Paid" : "Unpaid"}
            </Tag>

            <List
              header={<strong>Ordered Items</strong>}
              dataSource={order.orders}
              style={{ marginTop: 20, fontFamily: "Poppins" }}
              bordered
              renderItem={(item) => (
                <List.Item
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start", // Align items at the top
                  }}
                >
                  {/* Left side (name + price) */}
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0 }}>
                      <strong>{item.name}</strong>
                    </p>
                    <p style={{ fontSize: 12, color: "gray", marginTop: 4, marginBottom: 0 }}>
                      ₱{item.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Right side (subtotal + qty) */}
                  <div style={{ textAlign: "right", minWidth: 140 }}>
                    <p style={{ margin: 0 }}>
                      ₱{item.subtotal.toLocaleString()}
                    </p>
                    <p style={{ fontSize: 12, color: "gray", marginTop: 4, marginBottom: 0, textAlign: "right" }}>
                      Qty: {item.quantity}
                    </p>
                  </div>
                </List.Item>
              )}
            />
            <h4 style={{ textAlign: 'right', marginBottom: 0 }}>Total: ₱{order.totalPrice.toLocaleString()} &nbsp;</h4>
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
                  <Text>Payment: {receiptOrder.paymentStatus === 'paid' ? "Received" : "Unpaid"}</Text><br />
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
                </div>
              )}
            </Modal>

          </Card>
        ))
      )}
      {modalType === "cancel" && (
        <Modal
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            setModalType(null);
            setSelectedOrder(null);
          }}
          onOk={() => {
            handleCancelOrder(selectedOrder._id);
            setIsModalOpen(false);
            setModalType(null);
            setSelectedOrder(null);
          }}
          title="Cancel Order"
        >
          <p>Are you sure you want to cancel this order?</p>
        </Modal>
      )}

      <Modal
        open={isModalOpen && modalType === "pay"}
        title="Proceed to Payment"
        onCancel={() => {
          setIsModalOpen(false);
          setModalType(null);
          setSelectedOrder(null);
          setcustomerAccountNumber("");
        }}
        onOk={async () => {
          if (!customerAccountNumber) {
            message.warning("Please input the recipient's account number.");
            return;
          }
          const paymentDetails = {
            toBusinessAccount,
            customerAccountNumber,
            amount: selectedOrder.totalPrice,
            details: selectedOrder.orders.map(item => `${item.name} x${item.quantity}`).join(', '),
          };

          console.log("Payment Details:", paymentDetails);

          try {
            await axios.post("http://192.168.9.23:4000/api/Philippine-National-Bank/business-integration/customer/pay-business", paymentDetails);
            message.success("Payment submitted to bank API.");
            await handlePayment(selectedOrder._id);

          } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.error || "Something went wrong!";
            message.error(errorMsg);
          } finally {
            setIsModalOpen(false);
            setModalType(null);
            setSelectedOrder(null);
            setcustomerAccountNumber("");
          }
        }}
      >
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="To ITBytes Business Account">
            {toBusinessAccount}
          </Descriptions.Item>
          <Descriptions.Item label="Amount">
            ₱{selectedOrder?.totalPrice?.toLocaleString()}
          </Descriptions.Item>
        </Descriptions>

        <Form layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="Account Number" required>
            <Row gutter={8}>
              {accountParts.map((part, index) => (
                <React.Fragment key={index}>
                  <Col span={5}>
                    <Input
                      maxLength={4}
                      value={part}
                      onChange={(e) => handleChange(e.target.value, index)}
                      style={{ textAlign: 'center' }}
                    />
                  </Col>
                  {/* Add "-" after every input except the last one */}
                  {index < accountParts.length - 1 && (
                    <Col
                      span={1}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      -
                    </Col>
                  )}
                </React.Fragment>
              ))}
            </Row>
          </Form.Item>
        </Form>

        <Divider />

        <List
          header={<strong>Order Details</strong>}
          dataSource={selectedOrder?.orders || []}
          bordered
          renderItem={(item) => (
            <List.Item>
              <div style={{ flex: 1 }}>{item.name} x {item.quantity}</div>
              <div>₱{item.subtotal.toLocaleString()}</div>
            </List.Item>
          )}
        />
      </Modal>


    </div >
  );
};

export default Order;
