import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Layout,
  Button,
  Table,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Divider,
  Tag
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined
} from "@ant-design/icons";
import "../styles/ManageUsers.css";

const { Content } = Layout;

const roleColors = {
  admin: "red",
  sales: "blue",
  inventory: "green",
  business: "purple",
  customer: "gold"
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/users");
      setUsers(data);
    } catch {
      message.error("Error fetching users");
    }
  };

  const handleSubmit = async (values) => {
    if (values.password !== values.confirm) {
      message.error("Oops! Password does not match.");
      return;
    }

    const userData = {
      firstname: values.firstname,
      user_ln: values.lastname,
      user_mn: values.middlename,
      username: values.username,
      password: values.password
    };

    try {
      const url = editingUser
        ? `http://localhost:5000/users/${editingUser.user_id}`
        : "http://localhost:5000/users";
      const method = editingUser ? axios.put : axios.post;
      const { data } = await method(url, userData);
      message.success(data.message || "User saved successfully");
      fetchUsers();
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.error || "Error saving user");
    }
  };

  const handleDelete = async (user_id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${user_id}`);
      message.success("User deleted successfully");
      fetchUsers();
    } catch {
      message.error("Failed to delete user");
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const lower = value.toLowerCase();
    setUsers((prev) =>
      prev.filter(
        (u) =>
          u.user_fn?.toLowerCase().includes(lower) ||
          u.user_ln?.toLowerCase().includes(lower) ||
          u.user_name?.toLowerCase().includes(lower)
      )
    );
  };

  const columns = [
    { title: "First Name", dataIndex: "firstname", key: "firstname", width: 120 },
    { title: "Last Name", dataIndex: "lastname", key: "lastname", width: 120 },
    { title: "Middle Name", dataIndex: "middlename", key: "middlename", width: 130 },
    { title: "E-mail", dataIndex: "email", key: "email", width: 150 },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
      render: (pwd) => "\u2022".repeat(pwd?.length || 0)
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={roleColors[role] || "gray"}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Tag>
      )
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const tags = [];

        // isActive tag
        tags.push(
          <Tag color={record.isActive ? "green" : "red"} key="active">
            {record.isActive ? "Active" : "Inactive"}
          </Tag>
        );

        // Authorization tag
        switch (record.isAuth) {
          case "authorized":
            tags.push(<Tag color="blue" key="auth">Authorized</Tag>);
            break;
          case "rejected":
            tags.push(<Tag color="red" key="auth">Rejected</Tag>);
            break;
          case "pending":
          default:
            tags.push(<Tag color="orange" key="auth">Pending</Tag>);
        }

        return <>{tags}</>;
      }
    },
    {
      title: "Authorization",
      key: "isAuth",
      render: (_, record) => {
        const { isAuth, user_id } = record;

        return (
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              icon={<CheckOutlined />}
              className="custom-disabled-button"
              style={{
                borderColor: "green",
                color: "green",
                width: 40
              }}
              onClick={() => handleAuthorize(user_id)}
              disabled={isAuth === "authorized"}
            />
            <Button
              icon={<CloseOutlined />}
              danger
              style={{ width: 40 }}
              onClick={() => handleReject(user_id)}
              disabled={isAuth === "rejected"}
            />
          </div>
        );
      }
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "right", gap: 8 }}>
          <Button
            icon={<EditOutlined />}
            style={{ width: 50 }}
            onClick={() => {
              setEditingUser(record);
              form.setFieldsValue({
                firstname: record.user_fn,
                lastname: record.user_ln,
                middlename: record.user_mn,
                username: record.user_name,
                password: record.user_password
              });
              setIsModalOpen(true);
            }}
          />
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.user_id)}
          >
            <Button icon={<DeleteOutlined />} danger style={{ width: 50 }} />
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: 35 }}>
        <h1>User Management</h1>
        <p>Handles user registration and access control.</p>
        <Divider />
        <div className="table-top-parent">
          <Input.Search
            placeholder="Search users..."
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setEditingUser(null);
              form.resetFields();
              setIsModalOpen(true);
            }}
          >
            Add User
          </Button>
        </div>
        <Table
          bordered
          columns={columns}
          dataSource={users}
          rowKey="user_id"
          pagination={{ pageSize: 5 }}
          style={{ marginTop: 20 }}
        />
        <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={500}>
          <h2 style={{ textAlign: "center" }}>{editingUser ? "Edit" : "Add"} User</h2>
          <p style={{ textAlign: "center" }}>Fill out the form below.</p>
          <Form
            form={form}
            layout="horizontal"
            onFinish={handleSubmit}
            labelCol={{ flex: "150px" }}
            wrapperCol={{ flex: 1 }}
            labelAlign="left"
          >
            {["firstname", "lastname", "middlename", "username"].map((field) => (
              <Form.Item
                key={field}
                name={field}
                label={field.charAt(0).toUpperCase() + field.slice(1).replace("name", " Name")}
                rules={field !== "middlename" ? [{ required: true }] : []}
                style={{ marginBottom: 12 }}
              >
                <Input
                  placeholder={`Enter ${field}`}
                  onChange={(e) => {
                    const val = field === "username"
                      ? e.target.value.replace(/[^a-zA-Z0-9]/g, "")
                      : e.target.value.replace(/[^a-zA-Z\s]/g, "");
                    form.setFieldsValue({ [field]: val });
                  }}
                />
              </Form.Item>
            ))}
            <Divider />
            {["password", "confirm"].map((field) => (
              <Form.Item
                key={field}
                name={field}
                label={field === "confirm" ? "Confirm Password" : "Password"}
                rules={[{ required: true }]}
                style={{ marginBottom: 12 }}
              >
                <Input.Password placeholder={field === "confirm" ? "Confirm password" : "Enter password"} />
              </Form.Item>
            ))}
            <Form.Item wrapperCol={{ span: 24 }}>
              <Button type="primary" htmlType="submit" block>
                {editingUser ? "Update" : "Add"} User
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default ManageUsers;
