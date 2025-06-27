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
  Upload,
  Image
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
const apiUrl = import.meta.env.VITE_INVENTORY_API_URL;

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
  const [base64Image, setBase64Image] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
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
      const { data } = await axios.get(`${apiUrl}`);
      console.log("Fetched Items:", data);
      setItems(data);
      setFilteredItems(data);
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
      category: values.category,
      tags: values.tags,
      quantity: values.quantity,
      price: values.price,
      image: base64Image || (form.getFieldValue("image")?.[0]?.url ?? editingItem?.image ?? "")
    };

    console.log("Item Data:", itemData);
    try {
      const url = editingItem
        ? `${apiUrl}/${editingItem.id}`
        : `${apiUrl}`;
      const method = editingItem ? axios.put : axios.post;
      const { data } = await method(url, itemData);
      message.success(data.message || "Item saved successfully");
      fetchItems();
      setIsModalOpen(false);
      setBase64Image("");
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.error || "Error saving item");
    }
  };

  const handleDelete = async (_id) => {
    try {
      await axios.delete(`${apiUrl}/${_id}`);
      console.log("Deleted Item ID:", _id);
      message.success("Item deleted successfully");
      fetchItems();
    } catch {
      message.error("Failed to delete item");
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    applyFilters(value, selectedCategory);
  };

  const applyFilters = (search, category) => {
    const lower = search.toLowerCase();

    const filtered = items.filter((item) => {
      const matchesSearch =
        !search ||
        item.name?.toLowerCase().includes(lower) ||
        item.description?.toLowerCase().includes(lower) ||
        (Array.isArray(item.tags)
          ? item.tags.some((tag) => tag.toLowerCase().includes(lower))
          : item.tags?.toLowerCase().includes(lower));

      const matchesCategory = !category || item.category === category;

      return matchesSearch && matchesCategory;
    });

    setFilteredItems(filtered);
  };


  const columns = [
    { title: "Item ID", dataIndex: "_id", key: "_id", hidden: true },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (img) => (
        <Image
          src={img}
          alt="product"
          width={60}
          height={60}
          style={{ objectFit: "contain", borderRadius: 4 }}
          fallback="https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
          preview={true}
        />
      )
    },
    { title: "Name", dataIndex: "name", key: "name", width: 120 },
    { title: "Description", dataIndex: "description", key: "description", width: 500 },
    {
      title: "Category", dataIndex: "category", key: "category", width: 120,
      render: (category) => <Tag color="default">{category}</Tag>
    },
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
      render: (price) => `₱${price.toFixed(2)}`
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
                category: record.category,
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
            onConfirm={() => handleDelete(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger style={{ width: 50 }} />
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "10px 35px", background: "#F5F5F5" }}>
        <h1 style={{ marginBottom: -5 }}>Inventory Management</h1>
        <p>Manages stock levels, item tracking, and managing products</p>
        <div className="table-top-parent" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
          <div class name="table-top-left" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Input.Search
              placeholder="Search inventory..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
            <Select
              placeholder="Filter by Category"
              style={{ width: 200 }}
              allowClear
              value={selectedCategory}
              onChange={(value) => {
                setSelectedCategory(value);
                applyFilters(searchText, value);
              }}
            >
              <Select.Option value="CCTV">CCTV</Select.Option>
              <Select.Option value="Printer">Printer</Select.Option>
              <Select.Option value="Smartphones">Smartphones</Select.Option>
              <Select.Option value="Computer">Computer</Select.Option>
              <Select.Option value="Electronics">Components</Select.Option>
              <Select.Option value="Monitors">Monitors</Select.Option>
              <Select.Option value="Peripherals">Peripherals</Select.Option>
            </Select>
          </div>
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
          dataSource={filteredItems}
          rowKey="_id"
          scroll={{ x: 'max-content' }}
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
              rules={[{ required: false }]}
            >
              <Upload
                listType="picture-card"
                showUploadList={{ showRemoveIcon: true }}
                accept="image/*"
                beforeUpload={async (file) => {
                  const base64 = await getBase64(file);
                  setBase64Image(base64);
                  form.setFieldsValue({ image: [file] });
                  return false; // Prevent automatic upload
                }}
                onRemove={() => {
                  setBase64Image("");
                  form.setFieldsValue({ image: [] }); // Reset form value
                }}
              >
                {form.getFieldValue("image")?.length >= 1 ? null : "+ Upload"}
              </Upload>
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: false }]}
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
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select a category!" }]}
              style={{ marginBottom: 12 }}
            >
              <Select placeholder="Select category">
                <Select.Option value="CCTV">CCTV</Select.Option>
                <Select.Option value="Printer">Printer</Select.Option>
                <Select.Option value="Smartphones">Smartphones</Select.Option>
                <Select.Option value="Computer">Computer</Select.Option>
                <Select.Option value="Electronics">Electronics</Select.Option>
                <Select.Option value="Monitors">Monitors</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="tags"
              label="Tags"
              rules={[{ required: false }]}
              style={{ marginBottom: 12 }}
            >
              <Select
                mode="tags"
                placeholder="Enter or select tags"
                tokenSeparators={[',']}
                options={[
                  { label: "New Arrival", value: "New Arrival" },
                  { label: "Best Seller", value: "Best Seller" },
                  { label: "Gaming PC", value: "Gaming PC" },
                  { label: "Office Use", value: "Office Use" },
                  { label: "Refurbished", value: "Refurbished" },
                  { label: "Wireless", value: "Wireless" },
                  { label: "Fast Charging", value: "Fast Charging" },
                  { label: "Night Vision", value: "Night Vision" },
                  { label: "HD Camera", value: "HD Camera" },
                  { label: "Monitor", value: "Monitor" }
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
              <Input type="number" placeholder="Enter price" min={1} step="0.01" />
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