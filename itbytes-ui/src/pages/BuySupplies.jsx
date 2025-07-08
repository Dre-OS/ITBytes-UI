import React, { useEffect, useState } from "react";
import { Table, InputNumber, Button, Typography, message, Divider, Space, Badge, Image } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import axios from "axios";
import { orderSupplies } from "../services/ProductService";

const { Title } = Typography;

const supplierIP = "localhost"; // Replace with your actual supplier IP
const supplierURL = `http://${supplierIP}:3001/supplies`;

function BuySupplies() {
    const [supplierItems, setSupplierItems] = useState([]);
    const [orderQuantities, setOrderQuantities] = useState({});
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        fetchSupplierInventory();
    }, []);

    const fetchSupplierInventory = async () => {
        try {
            const res = await axios.get(supplierURL);
            
            if (Array.isArray(res.data)) {
                setSupplierItems(res.data);
            } else if (Array.isArray(res.data.supplies)) {
                setSupplierItems(res.data.supplies); // 👈 FIX: use res.data.supplies here
            }

            setIsConnected(true);
        } catch (err) {
            console.error("Fetch failed", err);
            setIsConnected(false);
            message.error("Failed to connect to supplier.");
            setSupplierItems([]);
        }
    };


    const handleQuantityChange = (id, value) => {
        setOrderQuantities(prev => ({ ...prev, [id]: value }));
    };

    const handleOrder = (item) => {
        const quantity = orderQuantities[item.id] || 0;
        if (quantity <= 0) {
            return message.warning("Please enter a valid quantity.");
        }

        const orderData = {
            name: item.name,
            quantity
        };

        orderSupplies(orderData)
            .then(() => {
                message.success(`Ordered ${quantity} of ${item.name}`);
                // Optionally, you can refresh the inventory after ordering
                fetchSupplierInventory();
            })
            .catch(err => {
                console.error("Order failed", err);
                message.error("Failed to place order. Please try again.");
            }
            );

        // Optional: clear ordered quantity
        setOrderQuantities(prev => ({ ...prev, [item.id]: 0 }));
    };

    const columns = [
        {
            title: "Image",
            dataIndex: "image",
            render: (_, record) => (
                <Image width={50} src={record.image || "https://via.placeholder.com/50"} />
            )
        },
        {
            title: "Item",
            dataIndex: "name"
        },
        {
            title: "Available Stock",
            dataIndex: "stock"
        },
        {
            title: "Quantity to Order",
            render: (_, record) => (
                <InputNumber
                    min={1}
                    max={record.stock}
                    value={orderQuantities[record.id] || 0}
                    onChange={(value) => handleQuantityChange(record.id, value)}
                />
            )
        },
        {
            title: "Action",
            render: (_, record) => (
                <Button type="primary" onClick={() => handleOrder(record)}>
                    Order
                </Button>
            )
        }
    ];

    return (
        <div style={{ padding: "10px 35px", background: "#F5F5F5", height: "100vh" }}>
            <h1 style={{ marginBottom: -5 }}>Buy Supplies</h1>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 16, gap: 10 }}>
                <p>Supplier IP: {supplierIP}</p>
                <Badge
                    style={{ fontFamily: 'Poppins' }}
                    status={isConnected ? "success" : "error"}
                    text={isConnected ? "Connected" : "Disconnected"}
                />
                <Button onClick={fetchSupplierInventory} icon={<ReloadOutlined />}> Refresh</Button>
            </div>
            <Table
                dataSource={supplierItems}
                columns={columns}
                rowKey="id"
                bordered
                pagination={false}
                locale={{
                    emptyText: isConnected ? "No items available from supplier." : "Not connected to supplier."
                }}
            />
        </div>
    );
}

export default BuySupplies;
