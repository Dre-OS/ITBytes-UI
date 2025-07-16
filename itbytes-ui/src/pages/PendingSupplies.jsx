import React, { useEffect, useState } from "react";
import {
  Table, Button, Input, Space, message, Modal, Form, Select
} from "antd";
import { CheckOutlined, ReloadOutlined } from "@ant-design/icons";
import axios from "axios";
import { addtoInventory } from "../services/ProductService";

const { Option } = Select;

function PendingSupplies() {
  const [supplies, setSupplies] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isExistingModalVisible, setIsExistingModalVisible] = useState(false);
  const [isNewItemModalVisible, setIsNewItemModalVisible] = useState(false);
  const [form] = Form.useForm();

  const apiURl = import.meta.env.VITE_INVENTORY_IN_API_URL || "http://localhost:5000";
  const productApiUrl = import.meta.env.VITE_INVENTORY_API_URL || "http://localhost:5000/api/inventory/product-in";

  useEffect(() => {
    fetchPendingSupplies();
  }, []);

  const fetchPendingSupplies = async () => {
    try {
      const res = await axios.get(`${apiURl}`);
      setSupplies(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch pending supplies");
    }
  };

  const checkIfProductExist = async (item) => {
    const payload = { productId: item.productId };
    const response = await axios.post(`${productApiUrl}/exists`, payload);
    const exist = response.data;
    console.log(exist);
    return exist.exists;
  };

  const handleApprove = async (item) => {
    const exists = await checkIfProductExist(item);
    setSelectedItem(item);

    if (exists) {
      setIsExistingModalVisible(true);
    } else {
      form.setFieldsValue({
        name: item.name,
        description: "",
        category: "",
        price: null,
      });
      setIsNewItemModalVisible(true);
    }
  };

  const handleAddInventory = async (item) => {
    const payload = {
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
    };
    await addtoInventory(payload);
    console.log("Adding to inventory:", item.productId + " with quantity:", item.quantity);
    message.success(`Added stock for ${item.name}`);
    setIsExistingModalVisible(false);
    fetchPendingSupplies(); // Refresh the supplies list
  };

  const handleAddNewItem = async () => {
    try {
      const formValues = await form.validateFields();

      const newItem = {
        productId: selectedItem.productId,
        name: formValues.name,
        description: formValues.description || "",
        category: formValues.category || "Uncategorized",
        price: formValues.price || 0,
        tags: formValues.tags || [],
        quantity: selectedItem.quantity,
      }
      console.log("New item to add:", newItem);
      await addtoInventory(newItem);
      // console.log("Adding new item:", newItem);
      message.success(`New item "${formValues.name}" added`);
      setIsNewItemModalVisible(false);
      fetchPendingSupplies(); // Refresh the supplies list
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      hidden: true,
    },
    {
      title: "Supplier Product ID",
      dataIndex: "productId",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Approve?",
      render: (_, record) => {
        const canApprove = record.name && record.quantity != null;
        return (
          <Space>
            <Button
              icon={<CheckOutlined />}
              className="custom-disabled-button"
              style={{ borderColor: "green", color: "green", width: 80 }}
              disabled={!canApprove}
              onClick={() => handleApprove(record)}
            />
          </Space>
        );
      }
    }
  ];

  return (
    <div style={{ padding: "10px 35px", background: "#f9f9f9", }}>
      <h1 style={{ marginBottom: -5, }}>Pending Supplies</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 30 }}>
        <p>Review and approve ordered items from suppliers. Add missing product details before confirming and adding them to the inventory.</p>
        <Button icon={<ReloadOutlined />} onClick={fetchPendingSupplies}>Refresh</Button>
      </div>
      <Table
        dataSource={supplies}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 5, showSizeChanger: false }}
      />

      {/* Modal: Add to existing stock */}
      <Modal
        open={isExistingModalVisible}
        onCancel={() => setIsExistingModalVisible(false)}
        onOk={() => handleAddInventory(selectedItem)}
        okText="Add to Stock"
        title="Add to Existing Stock"
      >
        <p>Confirm adding <strong>{selectedItem?.quantity}</strong> to <strong>{selectedItem?.name}</strong>?</p>
      </Modal>

      {/* Modal: Add New Item */}
      <Modal
        open={isNewItemModalVisible}
        onCancel={() => setIsNewItemModalVisible(false)}
        onOk={handleAddNewItem}
        okText="Add New Item"
        title="Add New Item"
      >
        <Form
          form={form}
          layout="horizontal"
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
          <Form.Item name="description" label="Description"><Input.TextArea placeholder="Enter description" rows={3} showCount maxLength={200} /></Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please select a category!" }]}><Select placeholder="Select category">{['CCTV', 'Printer', 'Smartphones', 'Computer', 'Electronics', 'Monitors', 'Peripherals'].map(cat => (<Select.Option key={cat} value={cat}>{cat}</Select.Option>))}</Select></Form.Item>
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
          <Form.Item name="price" label="Price" rules={[{ required: true, message: "Please enter price!" }]}><Input type="number" min={1} step="0.01" placeholder="Enter price" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default PendingSupplies;
