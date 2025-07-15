import React, { useEffect, useState } from "react";
import { Table, InputNumber, Button, Typography, message, Modal, Badge, Image, Descriptions, Input } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import axios from "axios";
import { orderSupplies } from "../services/ProductService";
import OrderService from "../services/OrderService";

const { Title } = Typography;

const supplierURL = import.meta.env.VITE_SUPPLIER_API_URL;
const supplierIP = supplierURL; // Replace with your actual supplier IP
function BuySupplies() {
    const [supplierItems, setSupplierItems] = useState([]);
    const [orderQuantities, setOrderQuantities] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const toBusinessAccount = "316-5404-901-7045"; // Replace with actual business account number
    const customerAccountNumber = "666-3251-855-1642"; // This should be set by the user in the modal


    useEffect(() => {
        fetchSupplierInventory();
    }, []);

    const filteredItems = supplierItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    const handlePayment = async () => {
        const paymentDetails = {
            toBusinessAccount,
            customerAccountNumber,
            amount: selectedItem.price * orderQuantities[selectedItem.id],
            details: `${selectedItem.name} - ${orderQuantities[selectedItem.id]} units`
        };

        console.log("Payment Details:", paymentDetails);

        try {
            await axios.post("http://192.168.9.23:4000/api/Philippine-National-Bank/business-integration/customer/pay-business", paymentDetails);
            message.success("Payment submitted to bank API.");
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.error || "Something went wrong!";
            message.error(errorMsg);
        } finally {
            setModalVisible(false);
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

        setSelectedItem(item);
        setModalVisible(true);
    };

    const confirmOrder = async () => {
        setConfirmLoading(true); // Start loading

        try {
            await handlePayment();

            const quantity = orderQuantities[selectedItem.id];
            setTotalPrice(selectedItem.price * quantity);

            const orderData = {
                quantity,
                totalPrice: selectedItem.price * quantity,
                product: selectedItem
            };

            const inventoryData = {
                productId: selectedItem.id,
                quantity,
                name: selectedItem.name
            };

            await Promise.all([
                OrderService.orderSupplies(orderData),
                orderSupplies(inventoryData)
            ]);

            message.success(`Ordered ${quantity} of ${selectedItem.name}`);
            fetchSupplierInventory();
            setOrderQuantities(prev => ({ ...prev, [selectedItem.id]: 0 }));
            setModalVisible(false);
            setSelectedItem(null);
        } catch (err) {
            console.error("Order failed", err);
            message.error("Failed to place order. Please try again.");
        } finally {
            setConfirmLoading(false); // End loading
        }
    };


    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            render: (text) => <span style={{ fontFamily: 'Poppins' }}>{text}</span>
        },
        {
            title: "Image",
            dataIndex: "image",
            render: (_, record) => (
                <Image width={50} src={record.image || "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"} style={{ borderRadius: 5 }} />
            )
        },
        {
            title: "Item",
            dataIndex: "name"
        },
        {
            title: "Price",
            dataIndex: "price",
            render: (text) => <span style={{ fontFamily: 'Poppins' }}>₱{text.toFixed(2)}</span>
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
                <p>Supplier IP: <code style={{ color: 'blue' }}>192.168.8.4</code></p>
                <Badge
                    style={{ fontFamily: 'Poppins' }}
                    status={isConnected ? "success" : "error"}
                    text={isConnected ? "Connected" : "Disconnected"}
                />
                <Button onClick={fetchSupplierInventory} icon={<ReloadOutlined />}> Refresh</Button>
            </div>
            <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: 300, marginBottom: 16 }}
            />
            <Table
                dataSource={filteredItems}
                columns={columns}
                pagination={{ pageSize: 5, showSizeChanger: false }}
                rowKey="id"
                bordered
                locale={{
                    emptyText: isConnected ? "No items available from supplier." : "Not connected to supplier."
                }}
            />
            <Modal
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={confirmOrder}
                okText="Confirm Order"
                cancelText="Cancel"
                confirmLoading={confirmLoading} // 👈 this is the key line
            >
                <div style={{ paddingTop: 0 }}> {/* 👈 Add padding here */}
                    {selectedItem && (
                        <>
                            <p>You're about to order <strong>{orderQuantities[selectedItem.id]}</strong> unit(s) of <strong>{selectedItem.name}</strong>.</p>
                            <Descriptions bordered column={1} size="small" style={{ fontFamily: 'Poppins' }}>
                                <Descriptions.Item label="To Mock Supplier Business Account">
                                    {toBusinessAccount}
                                </Descriptions.Item>
                                <Descriptions.Item label="ITBytes Account Number">
                                    {customerAccountNumber}
                                </Descriptions.Item>
                            </Descriptions>
                            <p>Total Price: <strong>₱{(selectedItem.price * orderQuantities[selectedItem.id]).toFixed(2)}</strong></p>
                        </>
                    )}
                </div>
            </Modal>

        </div>
    );
}

export default BuySupplies;
