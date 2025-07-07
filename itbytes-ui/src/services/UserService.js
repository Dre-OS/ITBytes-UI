import axios from 'axios';

const apiUrl = import.meta.env.VITE_USER_API_URL;

const UserService = {
  getAll: async () => {
    const response = await axios.get(`${apiUrl}/all`);
    return response.data;
  },

  create: async (userData) => {
    const response = await axios.post(apiUrl, userData);
    return response.data;
  },

  update: async (id, userData) => {
    const response = await axios.put(`${apiUrl}/${id}`, userData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${apiUrl}/${id}`);
    return response.data;
  },

  authorize: async (id, status) => {
    const response = await axios.put(`${apiUrl}/auth/${id}`, { isAuth: status });
    return response.data;
  }
};

export default UserService;
