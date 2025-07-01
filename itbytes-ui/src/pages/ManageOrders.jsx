import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Select,
  Input,
  message,
  Layout,
  Divider,
} from "antd";
import axios from "axios";
import { EditOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Option } = Select;

const apiUrl = import.meta.env.VITE_ORDER_API_URL;
const userApiUrl = import.meta.env.VITE_USER_API_URL; // Adjust this to your actual user API URL

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data: ordersData } = await axios.get(`${apiUrl}/out`);
      const { data: usersData } = await axios.get(`${userApiUrl}`);

      const userMap = {};
      usersData.forEach(user => {
        userMap[user._id] = user.firstname + " " + user.lastname;
      });

      const enrichedOrders = ordersData.map(order => ({
        ...order,
        customerName: userMap[order.customerId] || order.customerId // fallback
      }));

      setOrders(enrichedOrders);
      setFilteredOrders(enrichedOrders);
      setLoading(false);
    } catch (err) {
      message.error("Failed to fetch orders or users");
    }
  };


  const applyFilters = (search, status, payment) => {
    const lower = search.toLowerCase();
    const filtered = orders.filter((order) => {
      const matchesSearch =
        order._id.toLowerCase().includes(lower) ||
        order.customerName?.toLowerCase().includes(lower); // ✅ use name

      const matchesStatus = !status || order.status === status;
      const matchesPayment = payment === null || order.isPaid === (payment === "Paid");

      return matchesSearch && matchesStatus && matchesPayment;
    });


    setFilteredOrders(filtered);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    applyFilters(value, statusFilter, paymentFilter);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    applyFilters(searchText, value, paymentFilter);
  };

  const handlePaymentChange = (value) => {
    setPaymentFilter(value);
    applyFilters(searchText, statusFilter, value);
  };



  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (values) => {
    try {
      await axios.put(`${apiUrl}/${editingOrder._id}`, {
        status: values.status,
      });
      message.success("Order status updated successfully");
      setIsModalOpen(false);
      fetchOrders();
    } catch {
      message.error("Failed to update order status");
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Items",
      dataIndex: "orders",
      key: "orders",
      render: (items) => (
        <div>
          {items.map((item, index) => (
            <div key={index}>
              <strong>{item.name}</strong> × {item.quantity} {/* —   ₱{item.subtotal.toFixed(2)} */}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Total",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (total) => `₱${total.toLocaleString()}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Completed" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Paid",
      dataIndex: "isPaid",
      key: "isPaid",
      render: (paid) => <Tag color={paid ? "green" : "red"}>{paid ? "Paid" : "Unpaid"}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            setEditingOrder(record);
            form.setFieldsValue({ status: record.status });
            setIsModalOpen(true);
          }}
        >
          Edit Status
        </Button>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "10px 35px", background: "#F5F5F5" }}>
        <h1 style={{ marginBottom: -5 }}>Manage Orders</h1>
        <p>View and update the status of customer orders</p>
        <div style={{ display: "flex", gap: 10, marginBottom: 20, marginTop: 30, flexWrap: "wrap" }}>
          <Input.Search
            placeholder="Search by Order ID or Customer ID"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
            style={{ width: 250 }}
          />
          <Select
            placeholder="Filter by Status"
            allowClear
            value={statusFilter}
            onChange={handleStatusChange}
            style={{ width: 180 }}
          >
            <Option value="Pending">Pending</Option>
            <Option value="Processing">Processing</Option>
            <Option value="Completed">Completed</Option>
            <Option value="Cancelled">Cancelled</Option>
          </Select>
          <Select
            placeholder="Filter by Payment"
            allowClear
            value={paymentFilter}
            onChange={handlePaymentChange}
            style={{ width: 180 }}
          >
            <Option value="Paid">Paid</Option>
            <Option value="Unpaid">Unpaid</Option>
          </Select>
        </div>
        <Table
          bordered
          loading={loading}
          columns={columns}
          dataSource={filteredOrders}
          rowKey="_id"
          pagination={{ pageSize: 6 }}
          scroll={{ x: "max-content" }}
        />

        <Modal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          title="Update Order Status"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleStatusUpdate}
          >
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Please select a status" }]}
            >
              <Select placeholder="Select status">
                <Option value="Pending">Pending</Option>
                <Option value="Processing">Processing</Option>
                <Option value="Completed">Completed</Option>
                <Option value="Cancelled">Cancelled</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Update Status
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default ManageOrders;
