// services/OrderService.js
import axios from "axios";

const apiUrl = import.meta.env.VITE_ORDER_API_URL;

const OrderService = {
  getCustomerOrders: async (customerId) => {
    const response = await axios.get(`${apiUrl}/out/customer/${customerId}`);
    return response.data;
  },

  getAllOrders: async () => {
    const response = await axios.get(`${apiUrl}/out`);
    return response.data;
  },

  markAsPaid: async (orderId) => {
    const response = await axios.put(`${apiUrl}/out/${orderId}`, { isPaid: true });
    return response.data;
  },

  cancelOrder: async (orderId) => {
    const response = await axios.put(`${apiUrl}/out/${orderId}`, { status: "cancelled" });
    return response.data;
  }
};

export default OrderService;
