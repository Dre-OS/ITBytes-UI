import { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Table,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Tag,
  Select,
  Upload,
  Image,
  Space,
  Tooltip
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import "../styles/ManageUsers.css";
import {
  fetchItems,
  submitItem,
  deleteItem
} from "../services/ProductService";

const { Content } = Layout;

const ManageInventory = () => {
  const [items, setItems] = useState([]);
  const [base64Image, setBase64Image] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const data = await fetchItems();
    setItems(data);
    setFilteredItems(data);
  };

  const handleSubmit = async (values) => {
    if (values.quantity < 0) {
      message.error("Quantity cannot be negative.");
      return;
    }

    const imageField = form.getFieldValue("image");
    const imageToUse =
      base64Image ||
      (imageField && imageField[0] && imageField[0].url) ||
      "";

    const itemData = {
      name: values.name,
      description: values.description,
      category: values.category,
      tags: values.tags,
      quantity: Number(values.quantity),
      price: Number(values.price),
      image: imageToUse,
    };

    const success = await submitItem(itemData, editingItem);
    if (success) {
      loadItems();
      setIsModalOpen(false);
      setBase64Image("");
      form.resetFields();
    }
  };

  const handleDelete = async (_id) => {
    const success = await deleteItem(_id);
    if (success) loadItems();
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
          preview
        />
      )
    },
    { title: "Name", dataIndex: "name", key: "name", width: 120 },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (desc) =>
        desc && desc.length > 80 ? (
          <Tooltip title={desc} style={{ fontFamily: "Poppins" }}>
            {desc.slice(0, 80)}...
          </Tooltip>
        ) : (
          desc
        ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 120,
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
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (qty) =>
        qty <= 10 ? (
          <span style={{ color: "red", fontWeight: 600 }}>
            <ExclamationCircleOutlined style={{ marginRight: 4 }} />
            {qty} <span style={{ fontSize: 12, fontWeight: 400 }}>(Low stock)</span>
          </span>
        ) : (
          qty
        ),
    },
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
        <Space>
          <Button
            icon={<EditOutlined />}
            style={{ width: 50 }}
            onClick={() => {
              setEditingItem(record);
              setIsModalOpen(true);
              setBase64Image(""); // Only set this to "" on edit
              setFileList(
                record.image
                  ? [{
                    uid: "-1",
                    name: "image.png",
                    status: "done",
                    url: record.image
                  }]
                  : []
              );
              form.setFieldsValue({
                name: record.name,
                description: record.description,
                category: record.category,
                tags: Array.isArray(record.tags) ? record.tags : record.tags?.split(",").map(t => t.trim()),
                quantity: record.quantity,
                price: record.price,
                image: record.image
                  ? [{
                    uid: "-1",
                    name: "image.png",
                    status: "done",
                    url: record.image
                  }]
                  : []
              });
              console.log("Editing item:", record.name);
              setIsModalOpen(true);
            }}
          />
          <Popconfirm
            title="Are you sure you want to delete this item?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger style={{ width: 50 }} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "10px 35px", background: "#F5F5F5" }}>
        <h1 style={{ marginBottom: -5 }}>Inventory Management</h1>
        <p>Manages stock levels, item tracking, and managing products</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20, marginTop: 30, className: "table-top-parent" }}>
          <div className="table-top-left">
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
              {['CCTV', 'Printer', 'Smartphones', 'Computer', 'Electronics', 'Monitors', 'Peripherals', 'Tablets'].map(cat => (
                <Select.Option key={cat} value={cat}>{cat}</Select.Option>
              ))}
            </Select>
          </div>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setEditingItem(null);
              form.resetFields();
              setBase64Image("");
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
          scroll={{ x: "max-content" }}
          pagination={{ pageSize: 5 }}
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
              <Input
                placeholder="Enter item name"
              />
            </Form.Item>
            <Form.Item label="Product Image">
              <Upload
                listType="picture-card"
                accept="image/*"
                fileList={fileList}
                beforeUpload={async (file) => {
                  const base64 = await getBase64(file);
                  setBase64Image(base64);
                  setFileList([{
                    uid: file.uid,
                    name: file.name,
                    status: "done",
                    url: base64
                  }]);
                  form.setFieldsValue({
                    image: [{
                      uid: file.uid,
                      name: file.name,
                      status: "done",
                      url: base64
                    }]
                  });
                  return false;
                }}
                onRemove={() => {
                  setBase64Image("");
                  setFileList([]);
                  form.setFieldsValue({ image: [] });
                  return true;
                }}
                showUploadList={{ showRemoveIcon: true }}
              >
                {fileList.length >= 1 ? null : "+ Upload"}
              </Upload>
            </Form.Item>
            <Form.Item name="description" label="Description"><Input.TextArea placeholder="Enter description" rows={3} showCount maxLength={200} /></Form.Item>
            <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please select a category!" }]}><Select placeholder="Select category">{['CCTV', 'Printer', 'Smartphones', 'Computer', 'Electronics', 'Monitors'].map(cat => (<Select.Option key={cat} value={cat}>{cat}</Select.Option>))}</Select></Form.Item>
            <Form.Item
              name="tags"
              label="Tags"
              rules={[
                {
                  validator: (_, value) =>
                    !value || value.length <= 5
                      ? Promise.resolve()
                      : Promise.reject(new Error("You can select up to 5 tags only!")),
                },
              ]}
            >
              <Select
                mode="tags"
                placeholder="Enter or select tags"
                tokenSeparators={[',']}
                maxTagCount="responsive"
                options={[
                  "New Arrival",
                  "Best Seller",
                  "Gaming PC",
                  "Office Use",
                  "Refurbished",
                  "Wireless",
                  "Fast Charging",
                  "Night Vision",
                  "HD Camera",
                  "Monitor",
                ].map((t) => ({ label: t, value: t }))}
              />
            </Form.Item>
            <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: "Please enter quantity!" }]}><Input type="number" min={0} placeholder="Enter quantity" /></Form.Item>
            <Form.Item name="price" label="Price" rules={[{ required: true, message: "Please enter price!" }]}><Input type="number" min={1} step="0.01" placeholder="Enter price" /></Form.Item>
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
