import axios from 'axios';

// FlexiPay backend defaults to 5000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// We need a way to dynamically pass the tenantId.
// We'll expose a function to update defaults.
export const setTenantId = (tenantId: string | null) => {
  if (tenantId) {
    apiClient.defaults.headers.common['x-tenant-id'] = tenantId;
  } else {
    delete apiClient.defaults.headers.common['x-tenant-id'];
  }
};
