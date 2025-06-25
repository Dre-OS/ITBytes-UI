import React from "react";
import { useCart } from "../contexts/CartContext";
import { List, Button, Typography } from "antd";

const { Title } = Typography;

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  return (
    <div style={{ maxWidth: "90%", margin: "auto" }}>
      <Title level={3}>Your Cart</Title>
      <List
        bordered
        dataSource={cart}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button danger onClick={() => removeFromCart(item._id)}>Remove</Button>
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
        <Button type="primary" danger style={{ marginTop: 20 }} onClick={clearCart}>
          Clear Cart
        </Button>
      )}
    </div>
  );
};

export default Cart;
