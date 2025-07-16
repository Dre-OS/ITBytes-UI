import React, { useEffect, useState } from "react";
import { Table, Typography, message, Button } from "antd";
import OrderService from "../services/OrderService";
import moment from "moment";
import { ReloadOutlined } from "@ant-design/icons";

const { Title } = Typography;

function OrderHistory() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await OrderService.getOrderedSupplies();
            setOrders(res);
            console.log("Fetched orders:", res);
        } catch (error) {
            console.error("Failed to fetch order history:", error);
            message.error("Unable to fetch order history.");
        }
    };

    const columns = [
        {
            title: "Product ID",
            dataIndex: "productId",
            key: "productId",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Total Price",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (price) => `₱${price.toFixed(2)}`
        },
        {
            title: "Order Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => moment(date).format("MMMM D, YYYY h:mm A")
        }
    ];

    return (
        <div style={{ padding: "10px 35px", background: "#f9f9f9", minHeight: "100vh" }}>
            <h1 style={{ marginBottom: -5, }}>Order History</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 30 }}>
                <p>View a record of all items ordered from suppliers, including order details, status, and dates for easy tracking and inventory management.</p>
                <Button icon={<ReloadOutlined />} onClick={fetchOrders}>Refresh</Button>
            </div>
            <Table
                dataSource={orders}
                columns={columns}
                rowKey="_id"
                bordered
                pagination={{ pageSize: 5, showSizeChanger: false }}
                locale={{ emptyText: "No orders have been placed yet." }}
            />
        </div>
    );
}

export default OrderHistory;
