import React, { useEffect, useState } from "react";
import { Table, Button, Input, InputNumber, Space, message } from "antd";
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";

function PendingSupplies() {
  const [supplies, setSupplies] = useState([]);

  useEffect(() => {
    fetchPendingSupplies();
  }, []);

  const fetchPendingSupplies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/pending"); // Update this URL as needed
      setSupplies(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch pending supplies");
    }
  };

  const handleFieldChange = (id, field, value) => {
    setSupplies(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleApprove = (item) => {
    const { name, quantity } = item;
    if (!name || quantity == null) {
      return message.warning("Name and quantity must be filled before approving");
    }

    message.success(`${item.name} approved!`);
    setSupplies(prev => prev.filter(s => s.id !== item.id));
  };

  const handleReject = (item) => {
    message.error(`${item.name} rejected`);
    setSupplies(prev => prev.filter(s => s.id !== item.id));
  };

  const handleEdit = (item) => {
    message.info(`Edit ${item.name} (implement modal/form if needed)`);
  };

  const columns = [
    {
      title: "Supplier Product ID",
      dataIndex: "externalProductId",
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <Input
          value={record.name}
          onChange={(e) => handleFieldChange(record.id, "name", e.target.value)}
        />
      )
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (val) => (
        <InputNumber value={val} disabled />
      )
    },
    {
      title: "Edit",
      render: (_, record) => (
        <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
      )
    },
    {
      title: "Approve?",
      render: (_, record) => {
        const canApprove = record.name && record.quantity != null;
        return (
          <Space>
            <Button
              icon={<CheckOutlined />}
              type="primary"
              disabled={!canApprove}
              onClick={() => handleApprove(record)}
            />
            <Button
              icon={<CloseOutlined />}
              danger
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
    </div>
  );
}

export default PendingSupplies;
