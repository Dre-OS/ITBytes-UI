import axios from 'axios';
const apiUrl = import.meta.env.VITE_AUDIT_API_URL;

const AuditService = {
  getAuditLogs: async () => {
    const response = await axios.get(apiUrl);
    return response.data;
  },
};

export default AuditService;
