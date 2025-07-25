import React, { useEffect, useState, useRef } from "react";
import { Card, Typography, Tag, List, Descriptions, Row, Col, message, Button, Modal, Divider, Form, Input, Steps, Skeleton } from "antd";
import OrderService from "../services/OrderService";
import "../styles/Order.css"; // Assuming you have some styles for the order page
import { FileTextOutlined, PrinterOutlined } from "@ant-design/icons";
import UserSession from "../utils/UserSession";
import html2pdf from "html2pdf.js";
import axios from "axios";

const { Title, Text } = Typography;
const bankUrl = import.meta.env.VITE_BANK_API_URL;

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
  const [payLoading, setPayLoading] = useState(false);
  const [accountParts, setAccountParts] = useState(['', '', '', '']);
  const pdfRef = useRef();

  const customerId = UserSession.get()?.userId;

  const stepItems = [
    { title: "Ordered" },
    { title: "Paid" },
    { title: "Delivered" },
  ];

  const getStepIndex = (order) => {
    if (order.status === "cancelled") return 0; // stays at Ordered
    if (order.paymentStatus !== "paid") return 0;
    if (order.paymentStatus === "paid" && order.status !== "Completed") return 1;
    if (order.status === "Completed") return 2;
    return 0;
  };

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

    if (!customerAccountNumber) {
      message.warning("Please input the recipient's account number.");
      return;
    }

    setPayLoading(true);
    const paymentDetails = {
      toBusinessAccount,
      customerAccountNumber,
      amount: selectedOrder.totalPrice,
      details: selectedOrder.orders.map(item => `${item.name} x${item.quantity}`).join(', '),
    };

    console.log("Payment Details:", paymentDetails);

    try {
      await axios.post(`${bankUrl}`, paymentDetails);
      message.success("Payment submitted to bank API.");
      await OrderService.markAsPaid(orderId);
      message.success("Payment successful.");
      setLoading(true);
      setTimeout(fetchOrders, 500);

    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error || "Something went wrong!";
      message.error(errorMsg);
    } finally {
      setPayLoading(false);
      setIsModalOpen(false);
      setModalType(null);
      setSelectedOrder(null);
      setcustomerAccountNumber("");
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

      {loading ? (
        Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} style={{ marginBottom: 24 }}>
            <Skeleton active paragraph={{ rows: 7 }} />
          </Card>
        ))
      ) : orders.length === 0 ? (
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
            <Steps
              className="custom-steps"
              size="small"
              current={getStepIndex(order)}
              items={stepItems}
              style={{ marginBottom: 16, marginTop: 16, fontFamily: "Poppins" }}
            />
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
          </Card>
        ))
      )}

      <Modal
        title="Receipt"
        // maskStyle={{ background: "rgba(0, 0, 0, 0.14)" }} // Transparent mask
        // style={{ boxShadow: 'none' }} // softer shadow
        open={isReceiptVisible}
        footer={[
          <Button
            key="download"
            type="primary"
            onClick={() => {
              html2pdf()
                .from(pdfRef.current)
                .set({
                  margin: 10,
                  filename: `Receipt-${receiptOrder._id}.pdf`,
                  html2canvas: { scale: 2 },
                  jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
                })
                .save();
            }}
          >
            Download PDF
          </Button>,
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

      {modalType === "cancel" && (
        <Modal
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            setModalType(null);
            setSelectedOrder(null);
            setcustomerAccountNumber("");
            setAccountParts(['', '', '', '']); // reset inputs
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

      { /* Payment Modal */}
      <Modal
        open={isModalOpen && modalType === "pay"}
        title="Proceed to Payment"
        onCancel={() => {
          setIsModalOpen(false);
          setModalType(null);
          setSelectedOrder(null);
          setcustomerAccountNumber("");
          setAccountParts(['', '', '', '']); // 💡 Reset account inputs
        }}
        onOk={() => {
          handlePayment(selectedOrder._id);
        }}
        okButtonProps={{ loading: payLoading }}
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
                      onPaste={index === 0 ? (e) => {
                        const pasted = e.clipboardData.getData('Text');
                        const cleaned = pasted.replace(/\s/g, '').replace(/[^\d-]/g, '');
                        const parts = cleaned.includes('-') ? cleaned.split('-') : cleaned.match(/.{1,4}/g);
                        if (parts && parts.length === 4) {
                          setAccountParts(parts);
                          setcustomerAccountNumber(parts.join('-'));
                          e.preventDefault();
                        }
                      } : undefined}
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

      {receiptOrder && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            opacity: 0,
            pointerEvents: "none",
            zIndex: -9999,
          }}
        >
          <div ref={pdfRef}>
            <h2>ITBytes Receipt</h2>
            <p>Order ID: {receiptOrder._id}</p>
            <p>Date: {new Date(receiptOrder.createdAt).toLocaleString()}</p>
            <p>Payment: {receiptOrder.paymentStatus}</p>
            <hr />
            {receiptOrder.orders.map((item, index) => (
              <div key={index}>
                {item.name} x {item.quantity} — ₱{item.subtotal.toLocaleString()}
              </div>
            ))}
            <hr />
            <h3>Total: ₱{receiptOrder.totalPrice.toLocaleString()}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
