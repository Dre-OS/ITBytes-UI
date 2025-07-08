import axios from "axios";
import { message } from "antd";

const apiUrl = import.meta.env.VITE_INVENTORY_API_URL;

export const fetchItems = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}`);
    return data;
  } catch {
    message.error("Error fetching inventory");
    return [];
  }
};

export const submitItem = async (itemData, editingItem) => {
  try {
    const url = editingItem ? `${apiUrl}/${editingItem.id}` : `${apiUrl}`;
    const method = editingItem ? axios.put : axios.post;
    const { data } = await method(url, itemData);
    message.success(data.message || "Item saved successfully");
    return true;
  } catch (error) {
    message.error(error.response?.data?.error || "Error saving item");
    return false;
  }
};

export const fetchItembyId = async (id) => {
  try {
    const response = await axios.get(`${apiUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};

export const deleteItem = async (id) => {
  try {
    await axios.delete(`${apiUrl}/${id}`);
    message.success("Item deleted successfully");
    return true;
  } catch {
    message.error("Failed to delete item");
    return false;
  }
};

export const fetchFeaturedProducts = async (limit = 6) => {
  try {
    const res = await axios.get(apiUrl);
    // Ensure the result is always an array
    if (Array.isArray(res.data)) {
      return res.data.slice(0, limit);
    }
    return [];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
};

export const orderSupplies = async (orderData) => {
  try {
    const response = await axios.post(`${apiUrl}/in`, orderData);
    console.log(apiUrl);
    message.success("Order placed successfully");
    return response.data;
  } catch (error) {
    console.error("Error placing order:", error);
    message.error(error.response?.data?.error || "Failed to place order");
    return null;
  }
}
