import React from "react";
import { useCart } from "../context/CartContext";
import { List, Button, Typography, message, InputNumber, Modal } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserSession from "../utils/UserSession";

const { Title } = Typography;
const apiUrl = import.meta.env.VITE_ORDER_API_URL;
const productApiUrl = import.meta.env.VITE_INVENTORY_API_URL;

const Cart = () => {
  const [quantity, setQuantity] = React.useState(1);
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const isAuthenticated = UserSession.isAuthenticated();
  const navigate = useNavigate();

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
        customerId: UserSession.get()?.userId,
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
    for (const item of cart) {
      try {
        const res = await axios.get(`${productApiUrl}/${item.itemId}`);
        const stock = res.data.quantity;
        if (item.quantity > stock) {
          message.error(`Not enough stock for "${item.name}". Only ${stock} available.`);
          updateQuantity(item.itemId, stock);
          return; // Prevent checkout
        }
      } catch {
        message.error(`Could not verify stock for "${item.name}".`);
        return;
      }
    }

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
        setTimeout(() => {
          navigate("/orders");
        }, 3000);
      }
    });
  };

  return (
    <div style={{ maxWidth: "80%", margin: "auto" }}>
      <Title level={3}>Your Cart</Title>
      <List
        bordered
        dataSource={cart}
        renderItem={(item) => (
          <List.Item
            actions={[
              <InputNumber
                min={1}
                value={item.quantity}
                step={1}
                stringMode
                parser={(value) => value.replace(/[^\d]/g, "")} // only allow digits
                onKeyPress={(e) => {
                  if (!/^\d$/.test(e.key)) {
                    e.preventDefault(); // block letters/symbols
                  }
                }}
                onChange={(val) => {
                  const numeric = Number(val);
                  updateQuantity(item.itemId, isNaN(numeric) || numeric < 1 ? 1 : numeric);
                }}
                onBlur={async () => {
                  const res = await axios.get(`${productApiUrl}/${item.itemId}`);
                  const stock = res.data.quantity;

                  if (item.quantity > stock) {
                    message.warning(`Only ${stock} available`);
                    updateQuantity(item.itemId, stock);
                  }
                }}
              />

              ,
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
