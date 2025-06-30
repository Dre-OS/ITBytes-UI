import React from "react";
import { useCart } from "../contexts/CartContext";
import { List, Button, Typography, message, InputNumber, Modal } from "antd";
import axios from "axios";

const { Title } = Typography;
const apiUrl = import.meta.env.VITE_ORDER_API_URL;

const Cart = () => {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";

    if (!isAuthenticated) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Poppins", height: "20vh" }}>
        <Title level={4}>Sign in to add items to your cart</Title>
        <Button type="primary" href="/login">Sign In</Button>
      </div>
    );
  }

  const handleOrder = async () => {
    try {
      const order = {
        customerId: sessionStorage.getItem("userId"),
        orders: cart,
      };
      console.log("Placing order:", order);
      await axios.post(`${apiUrl}/out`, order);
      message.success("Order placed successfully!");
      clearCart();
    } catch {
      message.error("Error placing order. Please try again.");
    }
  };

  const handleCheckout = async () => {
    const grandTotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    Modal.confirm({
      title: "Confirm Checkout",
      content: `Proceed to checkout? Total: ₱${grandTotal.toLocaleString()}`,
      okText: "Checkout",
      okType: "primary",
      cancelText: "Cancel",
      onOk: () => {
        handleOrder();
      }
    });
  };

  return (
    <div style={{ maxWidth: "90%", margin: "auto" }}>
      <Title level={3}>Your Cart</Title>
      <List
        bordered
        dataSource={cart}
        renderItem={(item) => (
          <List.Item
            actions={[
              <InputNumber
                min={1}
                max={item.maxQuantity || 100}
                value={item.quantity}
                onChange={(val) => updateQuantity(item.itemId, val)}
              />,
              <Button danger onClick={() => removeFromCart(item.itemId)}>Remove</Button>
            ]}
          >
            <List.Item.Meta
              title={item.name}
              description={`₱${item.price.toLocaleString()} x ${item.quantity}`}
            />
            <div><strong>Total: </strong>₱{(item.price * item.quantity).toLocaleString()}</div>
          </List.Item>
        )}
      />
      {cart.length > 0 && (
        <div>
          <Button type="primary" onClick={clearCart} style={{ marginTop: 16 }}>
            Clear Cart
          </Button>
          <Button type="primary" style={{ marginLeft: 8 }} onClick={handleCheckout}>
            Checkout
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
