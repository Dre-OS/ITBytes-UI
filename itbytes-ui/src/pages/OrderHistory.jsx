import React, { useEffect, useState } from "react";
import { Table, Typography, message } from "antd";
import OrderService from "../services/OrderService";
import moment from "moment";

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
            render: (date) => moment(date).format("MMMM D, YYYY - h:mm A")
        }
    ];

    return (
        <div style={{ padding: "20px 40px", background: "#FAFAFA", minHeight: "100vh" }}>
            <Title level={2}>Order History</Title>
            <Table
                dataSource={orders}
                columns={columns}
                rowKey="_id"
                bordered
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: "No orders have been placed yet." }}
            />
        </div>
    );
}

export default OrderHistory;
