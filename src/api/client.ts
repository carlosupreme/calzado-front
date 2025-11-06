import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { generateMockEmpleadosPerformance } from '@/lib/mockData';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Intercept empleados endpoint and return mock data
    if (config.url?.includes('/api/dashboard/empleados')) {
      // Cancel the request and handle it with mock data
      config.adapter = () => {
        return Promise.resolve({
          data: generateMockEmpleadosPerformance(),
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
      };
    }
    
    // Add any auth tokens here if needed in the future
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);
