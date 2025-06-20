import { useState, useEffect } from "react";
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
  Spin,
  Grid,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import "../styles/ManageUsers.css";

const { Content } = Layout;
const { useBreakpoint } = Grid;
const apiUrl = import.meta.env.VITE_USER_API_URL || "http://localhost:1337/users";

function ManageUsers() {
  const screens = useBreakpoint();

  const [userList, setUserList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}`);
      setUserList(response.data);
      setFilteredList(response.data);
      setLoading(false);
    } catch (error) {
      message.error("Error fetching users");
    }
  };

  const updateUser = async (values) => {
    try {
      const isUnique = await validateEmail(values.email);

      if (!isUnique) {
        message.error("Email already registered!");
        return;
      }
      if (!currentUser) return;

      if (values.password !== values.confirm) {
        message.error("Passwords do not match");
        return;
      }

      const updatedData = {
        firstName: values.firstName,
        lastName: values.lastName,
        middleName: values.middleName,
        email: values.email,
        password: values.password,
      };

      const response = await axios.put(`${apiUrl}/${currentUser._id}`, updatedData);
      message.success(response.data.message || "User updated successfully");
      await fetchUsers();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error updating user:", error);
      message.error(error.response?.data?.error || "Error updating user");
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      message.error("Error deleting user");
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = userList.filter(
      (user) =>
        user.firstName.toLowerCase().includes(value.toLowerCase()) ||
        user.lastName.toLowerCase().includes(value.toLowerCase()) ||
        user.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredList(filtered);
  };

  const validateEmail = async (email) => {
    try {
      const response = await axios.get(`${apiUrl}`);
      const exists = response.data.some(
        (user) => user.email === email && user._id !== currentUser?._id
      );
      return !exists;
    } catch (error) {
      console.error("Error validating email:", error);
      return false;
    }
  };

  const columns = [
    { title: "ID", dataIndex: "_id", key: "_id" },
    { title: "First Name", dataIndex: "firstName", key: "firstName", width: 190 },
    { title: "Last Name", dataIndex: "lastName", key: "lastName", width: 190 },
    { title: "Middle Name", dataIndex: "middleName", key: "middleName", width: 190 },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
      render: (password) => "•".repeat(password?.length),
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "right" }}>
          <Button
            icon={<EditOutlined />}
            style={{ marginRight: 8, width: 60 }}
            onClick={() => {
              setCurrentUser(record);
              form.setFieldsValue({
                firstName: record.firstName,
                lastName: record.lastName,
                middleName: record.middleName,
                email: record.email,
                password: record.password,
                confirm: record.password,
              });
              setIsModalVisible(true);
            }}
          />
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => deleteUser(record._id)}
            okText="Yes"
            cancelText="No"
            placement="topRight"
          >
            <Button icon={<DeleteOutlined />} danger style={{ width: 60 }} />
          </Popconfirm>
        </div>
      ),
    },
  ];

    if (loading) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spin className="custom-spinner" tip="Loading users..." size="large" />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }} className="manage-users-layout">
      <Layout style={{ background: "#f5f5f5" }}>
        <Content style={{ overflow: "hidden", padding: screens.xs ? 16 : 35 }}>
          <h1 className="h1-user">User Management</h1>
          <p>Handles user details and access control.</p>
          <Divider className="table-divider" style={{ borderColor: "#ddd" }} />
          <Layout style={{ backgroundColor: "#f5f5f5" }}>
            <div
              className="table-top-parent"
              style={{
                flexDirection: screens.xs ? "column" : "row",
                gap: screens.xs ? 12 : 0,
                alignItems: screens.xs ? "stretch" : "center",
                marginTop: 0
              }}
            >
              <Input.Search
                placeholder="Search users..."
                onChange={(e) => handleSearch(e.target.value)}
                value={searchTerm}
                allowClear
                style={{ width: screens.xs ? "100%" : 300, marginBottom: screens.xs ? 8 : 0 }}
              />

              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{
                  backgroundColor: "#001529",
                  borderColor: "#001529",
                  width: screens.xs ? "100%" : "auto",
                }}
                onClick={() => {
                  setCurrentUser(null);
                  form.resetFields();
                  setIsModalVisible(true);
                }}
              >
                Add User
              </Button>
            </div>

            <Table
              bordered
              columns={columns}
              dataSource={filteredList}
              rowKey="_id"
              style={{ overflow: "hidden", width: "100%" }}
              pagination={{ pageSize: 5 }}
              scroll={{ x: "max-content" }}
              rowClassName={(_, index) =>
                index % 2 === 0 ? "table-row-light" : "table-row-dark"
              }
            />
          </Layout>
        </Content>

        <Modal
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={screens.xs ? "90%" : 500}
          centered
          destroyOnHidden
        >
          <h2
            style={{
              margin: 0,
              marginBottom: 8,
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            {currentUser ? "Edit User" : "Add User"}
          </h2>
          <p
            style={{
              marginBottom: 20,
              textAlign: "center",
              color: "gray",
              fontSize: 14,
            }}
          >
            {currentUser
              ? "Update user details here."
              : "Fill out the form to add a new user."}
          </p>

          <Form
            form={form}
            layout="horizontal"
            onFinish={async (values) => {
              if (currentUser) {
                await updateUser(values);
              } else {
                try {
                  const isUnique = await validateEmail(values.email);
                  if (!isUnique) {
                    message.error("Email already registered!");
                    return;
                  }
                  if (values.password !== values.confirm) {
                    message.error("Passwords do not match");
                    return;
                  }
                  const newUser = {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    middleName: values.middleName,
                    email: values.email,
                    password: values.password,
                  };
                  const response = await axios.post(`${apiUrl}`, newUser);
                  message.success(response.data.message || "User added successfully");
                  await fetchUsers();
                  setIsModalVisible(false);
                  form.resetFields();
                } catch (error) {
                  message.error(error.response?.data?.error || "Error adding user");
                }
              }
            }}
            labelCol={{ xs: { span: 24 }, sm: { flex: "140px" } }}
            wrapperCol={{ xs: { span: 24 }, sm: { flex: 1 } }}
            labelAlign="left"
            colon={false}
          >
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[
                { required: true, message: "Please enter your first name!" },
                {
                  pattern: /^[A-Za-z\s]+$/,
                  message: "Only letters and spaces are allowed",
                },
              ]}
              style={{ marginBottom: 12 }}
            >
              <Input placeholder="Enter first name" />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[
                { required: true, message: "Please enter your last name!" },
                {
                  pattern: /^[A-Za-z\s]+$/,
                  message: "Only letters and spaces are allowed",
                },
              ]}
              style={{ marginBottom: 12 }}
            >
              <Input placeholder="Enter last name" />
            </Form.Item>
            <Form.Item
              name="middleName"
              label="Middle Name"
              rules={[
                {
                  pattern: /^[A-Za-z\s]+$/,
                  message: "Only letters and spaces are allowed",
                },
              ]}
              style={{ marginBottom: 12 }}
            >
              <Input placeholder="Enter middle name (optional)" />
            </Form.Item>
            <Divider style={{ marginBottom: 16 }} />
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, type: "email", message: "Please enter a valid email!" },
              ]}
              style={{ marginBottom: 12 }}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true }]}
              style={{ marginBottom: 12 }}
            >
              <Input.Password placeholder="Create a secure password" />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm password" />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }} style={{ marginTop: 20, marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ backgroundColor: "#001529", borderColor: "#001529" }}
              >
                {currentUser ? "Update User" : "Add User"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </Layout>
  );
}

export default ManageUsers;