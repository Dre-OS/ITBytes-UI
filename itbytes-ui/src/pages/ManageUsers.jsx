import { useState, useEffect } from "react";
import UserService from "../services/UserService";
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
  Tag,
  Select,
  Switch
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  ReloadOutlined
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
  const [allUsers, setAllUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await UserService.getAll();
      setAllUsers(data);
      const visibleUsers = showDeleted ? data : data.filter(user => !user.isDeleted);
      setUsers(visibleUsers);
    } catch {
      message.error("Error fetching users");
    }
  };

  const handleSubmit = async (values) => {
    const userData = {
      firstname: values.firstname,
      lastname: values.lastname,
      middlename: values.middlename,
      email: values.email,
      role: values.role,
      password: values.password
    };

    try {
      const data = editingUser
        ? await UserService.update(editingUser._id, userData)
        : await UserService.create(userData);

      message.success(data.message || "User saved successfully");
      fetchUsers();
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.error || "Error saving user");
    }
  };

  const handleDelete = async (id) => {
    try {
      await UserService.delete(id);
      message.success("User deleted successfully");
      fetchUsers();
    } catch {
      message.error("Failed to delete user");
    }
  };

  const handleAuthorize = async (id, status) => {
    try {
      await UserService.authorize(id, status);
      fetchUsers();
    } catch {
      message.error("Failed to update authorization");
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    applyFilters(value, selectedRole, selectedStatus);
  };

  const applyFilters = (search, role, status, showDeletedFlag = showDeleted) => {
    const lower = search.toLowerCase();

    const filtered = allUsers.filter((user) => {
      const matchesSearch =
        !search ||
        user.firstname?.toLowerCase().includes(lower) ||
        user.lastname?.toLowerCase().includes(lower) ||
        user.email?.toLowerCase().includes(lower) ||
        user.middlename?.toLowerCase().includes(lower) ||
        user.role?.toLowerCase().includes(lower);

      const matchesRole = !role || user.role === role;
      const matchesStatus = !status || user.isAuth === status;
      const matchesDeleted = showDeletedFlag || !user.isDeleted;

      return matchesSearch && matchesRole && matchesStatus && matchesDeleted;
    });

    setUsers(filtered);
  };

  const columns = [
    { title: "User ID", dataIndex: "_id", key: "_id", hidden: true },
    { title: "First Name", dataIndex: "firstname", key: "firstname", width: 120 },
    { title: "Last Name", dataIndex: "lastname", key: "lastname", width: 120 },
    { title: "Middle Name", dataIndex: "middlename", key: "middlename", width: 130 },
    { title: "E-mail", dataIndex: "email", key: "email", width: 200, ellipsis: true },
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
      width: 100,
      render: (_, record) => {
        const tags = [
          <Tag color={record.isDeleted ? "red" : "green"} key="active">
            {record.isDeleted ? "Inactive" : "Active"}
          </Tag>
        ];

        switch (record.isAuth) {
          case "approved":
            tags.push(<Tag color="blue" key="auth">Approved</Tag>);
            break;
          case "rejected":
            tags.push(<Tag color="red" key="auth">Rejected</Tag>);
            break;
          default:
            tags.push(<Tag color="orange" key="auth">Pending</Tag>);
        }

        return <>{tags}</>;
      }
    },
    {
      title: "Authorization",
      key: "isAuth",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Popconfirm title="Approve this user?" onConfirm={() => handleAuthorize(record._id, "approved")}>
            <Button
              icon={<CheckOutlined />}
              className="custom-disabled-button"
              style={{ borderColor: "green", color: "green", width: 40 }}
              disabled={record.isAuth === "approved"}
            />
          </Popconfirm>
          <Popconfirm title="Reject this user?" onConfirm={() => handleAuthorize(record._id, "rejected")}>
            <Button
              icon={<CloseOutlined />}
              danger
              style={{ width: 40 }}
              disabled={record.isAuth === "rejected"}
            />
          </Popconfirm>
        </div>
      )
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
                firstname: record.firstname,
                lastname: record.lastname,
                middlename: record.middlename,
                email: record.email,
                role: record.role,
                password: record.password
              });
              setIsModalOpen(true);
            }}
          />
          <Popconfirm title="Are you sure you want to delete this user?" onConfirm={() => handleDelete(record._id)}>
            <Button icon={<DeleteOutlined />} danger style={{ width: 50 }} />
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "10px 35px", background: "#F5F5F5" }}>
        <h1 style={{ marginBottom: -5 }}>User Management</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <p>Handles user registration and access control.</p>
          <Button icon={<ReloadOutlined />} onClick={fetchUsers}>Refresh</Button>
        </div>
        <div className="table-top-parent">
          <div className="table-top-left" style={{ alignItems: "center" }}>
            <Input.Search
              placeholder="Search users..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              className="table-search"
              allowClear
            />
            <Select
              placeholder="Filter by Role"
              style={{ width: 150 }}
              allowClear
              value={selectedRole}
              onChange={(value) => {
                setSelectedRole(value);
                applyFilters(searchText, value, selectedStatus, showDeleted);
              }}
            >
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="sales">Sales</Select.Option>
              <Select.Option value="inventory">Inventory</Select.Option>
              <Select.Option value="business">Business</Select.Option>
              <Select.Option value="customer">Customer</Select.Option>
            </Select>
            <Select
              placeholder="Filter by Status"
              style={{ width: 160 }}
              allowClear
              value={selectedStatus}
              onChange={(value) => {
                setSelectedStatus(value);
                applyFilters(searchText, selectedRole, value, showDeleted);
              }}
            >
              <Select.Option value="approved">Approved</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="rejected">Rejected</Select.Option>
            </Select>
            <div style={{ display: "flex", alignItems: "center", marginLeft: 8, gap: 8 }}>
              <p style={{ color: "lightgray", fontSize: 12 }}>Show Deleted Users</p>
              <Switch
                checked={showDeleted}
                onChange={(checked) => {
                  setShowDeleted(checked);
                  applyFilters(searchText, selectedRole, selectedStatus, checked);
                }}
              />
            </div>
          </div>
          <div className="table-top-right" style={{ display: "flex", gap: 8 }}>
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
        </div>
        <Table
          bordered
          columns={columns}
          dataSource={users}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 'max-content' }}
          style={{ marginTop: 20 }}
        />
        <Modal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          width="100%"
          style={{ maxWidth: 500 }}
        >
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
            {["firstname", "lastname", "middlename"].map((field) => (
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
                    const val = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                    form.setFieldsValue({ [field]: val });
                  }}
                />
              </Form.Item>
            ))}
            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: "Please select a role!" }]}
              style={{ marginBottom: 12 }}
            >
              <Select placeholder="Select a role">
                <Select.Option value="customer">Customer</Select.Option>
                <Select.Option value="sales">Sales</Select.Option>
                <Select.Option value="inventory">Inventory</Select.Option>
                <Select.Option value="business">Business</Select.Option>
                <Select.Option value="admin">Admin</Select.Option>
              </Select>
            </Form.Item>
            <Divider className="full-width-divider" />
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your Email!" },
                { type: "email", message: "Please enter a valid Email!" }
              ]}
              style={{ marginBottom: 12 }}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true }]}
              style={{ marginBottom: 12 }}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
            <Form.Item>
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
