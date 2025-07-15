// components/ProductModal.jsx
import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Tag,
  Spin,
  message,
  InputNumber,
  Form,
  Divider,
  Modal
} from "antd";
import { fetchItembyId } from "../services/ProductService";
import { useCart } from "../context/CartContext";
import UserSession from "../utils/UserSession"; // Adjust the import path as necessary

const { Title, Paragraph } = Typography;
const apiUrl = import.meta.env.VITE_INVENTORY_API_URL || "http://localhost:5000/api/products";

const ProductModal = ({ productId, visible, onClose }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { cart, addToCart } = useCart();
  const [form] = Form.useForm();

  useEffect(() => {
    if (productId && visible) {
      setQuantity(1);
      form.setFieldsValue({ quantity: 1 });
      setLoading(true);

      fetchItembyId(productId)
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch(() => {
          message.error("Product not found");
          onClose();
        });
    }
  }, [productId, visible]);

  const handleAddToCart = async () => {
    try {
      const values = await form.validateFields();
      if (!UserSession.isAuthenticated()) {
        message.error("Please log in to add items to your cart.");
        return;
      }
      const existingInCart = cart.find((i) => i.itemId === product.id)?.quantity || 0;

      // Desired total after this add
      const desiredTotal = existingInCart + values.quantity;

      if (desiredTotal > product.quantity) {
        message.error(
          `You already have ${existingInCart} in the cart. ` +
          `Only ${product.quantity - existingInCart} more can be added.`
        );
        return;
      }

      addToCart(
        {
          itemId: product.id,
          name: product.name,
          price: product.price,
        },
        values.quantity
      );
      message.success(`${values.quantity} x "${product.name}" added to cart`);
      onClose();
    } catch {
      // Validation errors are shown by the form
    }
  };

  return (
    <Modal
      open={visible}
      title=""
      onCancel={onClose}
      footer={null}
      width={800}
    >
      {loading || !product ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      ) : (
        <div style={{ display: "flex", gap: 24 }}>
          <div style={{ width: "50%" }}>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                height: '100%',
                objectFit: "contain",
                borderRadius: 8,
                backgroundColor: "#fff"
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://st4.depositphotos.com/17828278/24401/v/450/depositphotos_244011872-stock-illustration-image-vector-symbol-missing-available.jpg";
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <Title level={4}>{product.name}</Title>
            <Paragraph type="secondary">{product.description}</Paragraph>
            <Paragraph><strong>Product ID:</strong> {product._id}</Paragraph>
            <Paragraph><strong>Category:</strong> <Tag color="blue">{product.category}</Tag></Paragraph>
            <Paragraph><strong>Tags:</strong> {product.tags.map((tag, index) => <Tag key={index}>{tag}</Tag>)}</Paragraph>
            <Paragraph><strong>In Stock:</strong> {product.quantity}</Paragraph>
            <Paragraph><strong>Price:</strong> {product?.price != null ? `₱${product.price.toLocaleString()}` : "₱--"}</Paragraph>

            <Form form={form} layout="horizontal" onFinish={handleAddToCart}>
              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[
                  { required: true, message: "Please enter a quantity." },
                  {
                    type: "number",
                    min: 1,
                    max: product.quantity,
                    message: `Quantity must be between 1 and ${product.quantity}`,
                    transform: (value) => Number(value),
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  max={product.quantity}
                  value={quantity}
                  step={1}
                  stringMode
                  parser={(value) => value.replace(/[^\d]/g, "")} // strip non-digits
                  onKeyPress={(e) => {
                    if (!/^\d$/.test(e.key)) {
                      e.preventDefault(); // block letters/symbols
                    }
                  }}
                  onChange={(val) => {
                    let numberVal = Number(val);

                    if (!val || isNaN(numberVal)) {
                      numberVal = 1;
                    }

                    // Clamp to max if over
                    if (numberVal > product.quantity) {
                      numberVal = product.quantity;
                    }

                    setQuantity(numberVal);
                    form.setFieldsValue({ quantity: numberVal });
                  }}
                />
              </Form.Item>


              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Add to Cart
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ProductModal;
