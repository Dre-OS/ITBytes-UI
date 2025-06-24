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
  Tag,
  Select,
  Upload
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
// ...existing code...
const ManageInventory = () => {
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data } = await axios.get("http://192.168.9.3:3000/api/admin/inventory/products");
      console.log("Fetched Items:", data);
      setItems(data);
    } catch {
      message.error("Error fetching inventory");
    }
  };

  const handleSubmit = async (values) => {
    if (values.quantity < 0) {
      message.error("Quantity cannot be negative.");
      return;
    }

    const itemData = {
      name: values.name,
      description: values.description,
      tags: values.tags,
      quantity: values.quantity,
      price: values.price,
      image: values.image?.[0]?.base64 || ""
    };

    try {
      const url = editingItem
        ? `http://192.168.9.5:3000/api/inventory/${editingItem._id}`
        : "http://192.168.9.3:3000/api/admin/inventory/products";
      const method = editingItem ? axios.put : axios.post;
      const { data } = await method(url, itemData);
      message.success(data.message || "Item saved successfully");
      fetchItems();
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.error || "Error saving item");
    }
  };

  const handleDelete = async (_id) => {
    try {
      await axios.delete(`http://192.168.9.5:3000/api/inventory/${_id}`);
      message.success("Item deleted successfully");
      fetchItems();
    } catch {
      message.error("Failed to delete item");
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const lower = value.toLowerCase();
    setItems((prev) =>
      prev.filter(
        (i) =>
          i.name?.toLowerCase().includes(lower) ||
          i.description?.toLowerCase().includes(lower) ||
          i.tags?.toLowerCase().includes(lower)
      )
    );
  };

  const columns = [
    { title: "Item ID", dataIndex: "_id", key: "_id", hidden: true },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (img) => (
        <img
          src={img}
          alt="product"
          style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
        />
      )
    },
    { title: "Name", dataIndex: "name", key: "name", width: 120 },
    { title: "Description", dataIndex: "description", key: "description", width: 180 },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      width: 120,
      render: (tags) =>
        Array.isArray(tags)
          ? tags.map((tag) => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))
          : tags
    },
    { title: "Quantity", dataIndex: "quantity", key: "quantity", width: 100 },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 100,
      render: (price) => `$${price.toFixed(2)}`
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
              setEditingItem(record);
              form.setFieldsValue({
                name: record.name,
                description: record.description,
                tags: Array.isArray(record.tags)
                  ? record.tags
                  : record.tags?.split(",").map((t) => t.trim()),
                quantity: record.quantity,
                price: record.price,
                image: record.image
                  ? [
                    {
                      uid: "-1",
                      name: "image.png",
                      status: "done",
                      url: record.image,
                      base64: record.image,
                    },
                  ]
                  : [],
              });
              setIsModalOpen(true);
            }}
          />
          <Popconfirm
            title="Are you sure you want to delete this item?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button icon={<DeleteOutlined />} danger style={{ width: 50 }} />
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: 35, background: "#fff" }}>
        <h1>Inventory Management</h1>
        <p>Manages stock levels, item tracking, and managing products</p>
        <Divider />
        <div className="table-top-parent">
          <Input.Search
            placeholder="Search inventory..."
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setEditingItem(null);
              form.resetFields();
              setIsModalOpen(true);
            }}
          >
            Add Item
          </Button>
        </div>
        <Table
          bordered
          columns={columns}
          dataSource={items}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          style={{ marginTop: 20 }}
        />
        <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={500}>
          <h2 style={{ textAlign: "center" }}>{editingItem ? "Edit" : "Add"} Item</h2>
          <p style={{ textAlign: "center" }}>Fill out the form below.</p>
          <Form
            form={form}
            layout="horizontal"
            onFinish={handleSubmit}
            labelCol={{ flex: "150px" }}
            wrapperCol={{ flex: 1 }}
            labelAlign="left"
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter item name!" }]}
        
            >
              <Input placeholder="Enter item name" />
            </Form.Item>
            <Form.Item
              name="image"
              label="Product Image"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) return e;
                return e?.fileList;
              }}
              rules={[{ required: true, message: "Please upload an image!" }]}
            >
              <Upload
                listType="picture-card"
                showUploadList={{ showRemoveIcon: true }}
                accept="image/*"
                beforeUpload={async (file) => {
                  const base64 = await getBase64(file);
                  form.setFieldsValue({ image: [{ ...file, base64 }] });
                  return false; // Prevent upload
                }}
              >
                {form.getFieldValue("image")?.length >= 1 ? null : "+ Upload"}
              </Upload>
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Please enter description!" }]}
              style={{ marginBottom: 12 }}
            >
              <Input.TextArea
                placeholder="Enter description"
                rows={3}
                showCount
                maxLength={200}
              />
            </Form.Item>
            <Form.Item
              name="tags"
              label="Category"
              rules={[{ required: true, message: "Please select category!" }]}
              style={{ marginBottom: 12 }}
            >
              <Select
                mode="multiple"
                placeholder="Select categories"
                options={[
                  { label: "CCTV", value: "CCTV" },
                  { label: "Printer", value: "Printer" },
                  { label: "Smartphones", value: "Smartphones" },
                  { label: "Computer", value: "Computer" },
                  { label: "Electronics", value: "Electronics" },
                  { label: "Monitors", value: "Monitors" }
                ]}
              />
            </Form.Item>
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[{ required: true, message: "Please enter quantity!" }]}
              style={{ marginBottom: 12 }}
            >
              <Input type="number" placeholder="Enter quantity" min={0} />
            </Form.Item>
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: "Please enter price!" }]}
              style={{ marginBottom: 12 }}
            >
              <Input type="number" placeholder="Enter price" min={0} step="0.01" />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }}>
              <Button type="primary" htmlType="submit" block>
                {editingItem ? "Update" : "Add"} Item
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default ManageInventory;
// ...existing code...