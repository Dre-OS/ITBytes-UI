// services/OrderService.js
import axios from "axios";
import { orderSupplies } from "./ProductService";

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
    const response = await axios.put(`${apiUrl}/out/pay/${orderId}`, { paymentStatus: 'paid' });
    return response.data;
  },

  cancelOrder: async (orderId) => {
    const response = await axios.put(`${apiUrl}/out/${orderId}`, { status: "cancelled" });
    return response.data;
  },

  orderSupplies: async (orderData) => {
    try {
      const response = await axios.post(`${apiUrl}/in`, orderData);
      return response;
    } catch (error) {
      console.error("Error ordering supplies:", error);
      throw error;
    }
  },

  getOrderedSupplies: async () => {
    const response = await axios.get(`${apiUrl}/in`);
    return response.data;
  },
};

export default OrderService;
