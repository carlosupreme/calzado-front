export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  DASHBOARD: {
    SUMMARY: '/api/dashboard/summary',
    TIENDAS: '/api/dashboard/tiendas',
    EMPLEADOS: '/api/dashboard/empleados',
    TIENDA_DETAIL: (tienda: string) => `/api/dashboard/tiendas/${encodeURIComponent(tienda)}`,
    HISTORICO: '/api/dashboard/historico',
  },
  HEALTH: '/health',
  CHAT: '/api/chat',
} as const;
