import React, { useEffect, useState } from "react";
import {
  Table, Button, Input, InputNumber, Space, message, Modal, Form, Select
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

function PendingSupplies() {
  const [supplies, setSupplies] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isExistingModalVisible, setIsExistingModalVisible] = useState(false);
  const [isNewItemModalVisible, setIsNewItemModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPendingSupplies();
  }, []);

  const fetchPendingSupplies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/pending");
      setSupplies(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch pending supplies");
    }
  };

  const checkIfProductExist = async (item) => {
    // Placeholder logic
    return Math.random() > 0.5; // randomly return true/false for demo
  };

  const handleApprove = async (item) => {
    if (!item.name || item.quantity == null) {
      return message.warning("Name and quantity must be filled before approving");
    }

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
    // PUT request logic here
    message.success(`Added stock for ${item.name}`);
    setSupplies(prev => prev.filter(s => s.id !== item.id));
    setIsExistingModalVisible(false);
  };

  const handleAddNewItem = async () => {
    try {
      const values = await form.validateFields();
      // POST request logic here
      message.success(`New item "${values.name}" added`);
      setSupplies(prev => prev.filter(s => s.id !== selectedItem.id));
      setIsNewItemModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = (item) => {
    message.error(`${item.name} rejected`);
    setSupplies(prev => prev.filter(s => s.id !== item.id));
  };

  const columns = [
    {
      title: "Supplier Product ID",
      dataIndex: "externalProductId",
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
              style={{ borderColor: "green", color: "green", width: 40 }}
              disabled={!canApprove}
              onClick={() => handleApprove(record)}
            />
            <Button
              icon={<CloseOutlined />}
              danger
              style={{ width: 40 }}
              className="custom-disabled-button"
              onClick={() => handleReject(record)}
            />
          </Space>
        );
      }
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Pending Supplies</h2>
      <Table
        dataSource={supplies}
        columns={columns}
        rowKey="id"
        bordered
        pagination={false}
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
          <Form.Item name="price" label="Price" rules={[{ required: true, message: "Please enter price!" }]}><Input type="number" min={1} step="0.01" placeholder="Enter price" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default PendingSupplies;
