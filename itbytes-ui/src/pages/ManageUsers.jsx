import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Button, Table, Modal, Form, Input, message, Popconfirm, Divider, Spin, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, CheckOutlined, CloseOutlined  } from "@ant-design/icons";
import "../styles/ManageUsers.css";

const { Content } = Layout;

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);
      console.log("Fetched Users:", response.data);
      setFilteredUsers(response.data);
      setLoading(false);
    } catch (error) {
      message.error("Error fetching users");
    }
  };

  // if (loading) {
  //   return (
  //     <Layout style={{ minHeight: "100vh" }}>
  //       <Content
  //         style={{
  //           display: "flex",
  //           justifyContent: "center",
  //           alignItems: "center",
  //           height: "100vh",
  //         }}
  //       >
  //         <Spin size="large" />
  //       </Content>
  //     </Layout>
  //   );
  // }


  const handleSubmit = async (values) => {
    try {
      const userData = {
        firstname: values.firstname,
        user_ln: values.lastname,
        user_mn: values.middlename,
        username: values.username,
        password: values.password
      };

      let response;

      if (values.password !== values.confirm) {
        message.error("Oops! Password does not match.");
        return;
      }

      if (editingUser) {
        response = await axios.put(
          `http://localhost:5000/users/${editingUser.user_id}`,
          userData
        );
      } else {
        response = await axios.post(
          "http://localhost:5000/users",
          userData
        );
      }

      console.log("Server Response:", response.data);
      message.success(response.data.message || "User saved successfully");

      await fetchUsers();
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Error saving user:", error);
      message.error(error.response?.data?.error || "Error saving user");
    }
  };

  const handleDelete = async (user_id) => {
    if (!user_id) {
      console.error("Error: user_id is undefined");
      message.error("Cannot delete user: Missing user ID");
      return;
    }

    console.log(`Attempting to delete user with ID: ${user_id}`);
    await axios.delete(`http://localhost:5000/users/${user_id}`);
    message.success("User deleted successfully");
    fetchUsers();
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = users.filter(
      (user) =>
        user.user_fn.toLowerCase().includes(value.toLowerCase()) ||
        user.user_ln.toLowerCase().includes(value.toLowerCase()) ||
        user.user_name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const columns = [
    { title: "ID", dataIndex: "_id", key: "_id" },
    { title: "First Name", dataIndex: "firstname", key: "firstname", width: 120 },
    { title: "Last Name", dataIndex: "lastname", key: "lastname", width: 120 },
    { title: "Middle Name", dataIndex: "middlename", key: "middlename", width: 130 },
    { title: "E-mail", dataIndex: "email", key: "email", width: 150 },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
      render: (user_password) => "•".repeat(user_password?.length)
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        let color;
        switch (role) {
          case 'admin':
            color = 'red';
            break;
          case 'sales':
            color = 'blue';
            break;
          case 'inventory':
            color = 'green';
            break;
          case 'business':
            color = 'purple';
            break;
          case 'customer':
            color = 'gold';
            break;
          default:
            color = 'gray';
        }

        return <Tag color={color}>{role.charAt(0).toUpperCase() + role.slice(1)}</Tag>;
      }
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      )
    },
    {
      title: "Authorization",
      dataIndex: "isAuth",
      key: "isAuth",
      render: (isAuth, record) => {
        if (isAuth) {
          return <Tag color="blue">Authorized</Tag>;
        }

        return (
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              type="default"
              ghosts
               style={{ borderColor: 'green', color: 'green' }}
              onClick={() => handleAuthorize(record.user_id)}
            >
              <CheckOutlined />
            </Button>
            <Button
              danger
              onClick={() => handleReject(record.user_id)}
            >
              <CloseOutlined />
            </Button>
          </div>
        );
      }
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", width: "100%", justifyContent: "right" }}>
          <Button
            icon={<EditOutlined />}
            style={{ marginRight: 8, width: 60 }}
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
            okText="Yes"
            cancelText="No"
            placement="topRight"
          >
            <Button icon={<DeleteOutlined />} danger style={{ width: 60 }} />
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout style={{ background: "#fefefe" }}>
        <Content style={{ overflow: "hidden", padding: 35 }}>
          <h1 className="h1-user">User Management</h1>
          <p>Handles user registration, and access control within the system.</p>
          <Divider className="table-divider" style={{ borderColor: "#ddd" }} />
          <Layout style={{ backgroundColor: "#fefefe" }}>
            <div className="table-top-parent">
              <div className="header-user">
                <Input.Search
                  placeholder="Search users..."
                  onChange={(e) => handleSearch(e.target.value)}
                  value={searchText}
                  style={{ width: 300 }}
                  allowClear
                />
              </div>
              <div className="table-top-search">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  style={{
                    height: "35px",
                    backgroundColor: "#001529",
                    borderColor: "#001529"
                  }}
                  onClick={() => {
                    setEditingUser(null);
                    form.resetFields();
                    setIsModalOpen(true);
                  }}
                >
                  Add User
                </Button>
              </div>
            </div>
            <Table
              bordered
              columns={columns}
              dataSource={filteredUsers}
              rowKey="user_id"
              style={{ marginTop: 20, overflow: "hidden", width: "100%" }}
              pagination={{ pageSize: 5 }}
              rowClassName={(index) =>
                index % 2 === 0 ? "table-row-light" : "table-row-dark"
              }
            />
          </Layout>
        </Content>

        <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={500}>
          <h2 style={{ marginBottom: "16px", textAlign: 'center' }}>
            {editingUser ? "Edit User" : "Add User"}
          </h2>
          <p style={{ textAlign: 'center' }}>A pop-up form to quickly add new user details.</p>

          <Form
            form={form}
            layout="horizontal"
            onFinish={handleSubmit}
            labelCol={{ flex: '150px' }}
            wrapperCol={{ flex: 1 }}
            labelAlign="left"
          >
            <Form.Item
              name="firstname"
              label="First Name"
              rules={[{ required: true }]}
              style={{ marginBottom: "12px" }}
            >
              <Input placeholder="Enter first name"
                onChange={(e) => {
                  const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                  form.setFieldsValue({ firstname: lettersOnly });
                }}
              />
            </Form.Item>
            <Form.Item
              name="lastname"
              label="Last Name"
              rules={[{ required: true }]}
              style={{ marginBottom: "12px" }}
            >
              <Input placeholder="Enter last name"
                onChange={(e) => {
                  const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                  form.setFieldsValue({ lastname: lettersOnly });
                }}
              />
            </Form.Item>
            <Form.Item
              name="middlename"
              label="Middle Name"
              style={{ marginBottom: "12px" }}
            >
              <Input placeholder="Enter middle name(optional)"
                onChange={(e) => {
                  const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                  form.setFieldsValue({ middlename: lettersOnly });
                }}
              />
            </Form.Item>
            <Divider></Divider>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true }]}
              style={{ marginBottom: "12px" }}
            >
              <Input placeholder="Create a unique username"
                onChange={(e) => {
                  const alphanumericOnly = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                  form.setFieldsValue({ username: alphanumericOnly });
                }}
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true }]}
              style={{ marginBottom: "12px" }} // slightly more space before the button
            >
              <Input.Password placeholder="Create a secure password" />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="Confirm Password"
              rules={[{ required: false }]}
              style={{ marginBottom: "24px" }} // slightly more space before the button
            >
              <Input.Password placeholder="Confirm password" />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }} style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ backgroundColor: "#001529", borderColor: "#001529" }}
              >
                {editingUser ? "Update" : "Add"} User
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </Layout>
  );
}

export default ManageUsers;