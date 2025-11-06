import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/config/api';
import type {
  DashboardSummary,
  TiendaResumen,
  EmpleadoPerformance,
  TiendaDetalle,
  HistoricoResponse,
  PeriodParams,
  HistoricoParams,
} from '@/types/dashboard';

export const dashboardService = {
  /**
   * Get dashboard summary with aggregated metrics
   */
  async getSummary(params?: PeriodParams): Promise<DashboardSummary> {
    const response = await apiClient.get<DashboardSummary>(
      API_ENDPOINTS.DASHBOARD.SUMMARY,
      { params }
    );
    return response.data;
  },

  /**
   * Get list of all stores with summary data
   */
  async getTiendas(params?: PeriodParams): Promise<TiendaResumen[]> {
    const response = await apiClient.get<TiendaResumen[]>(
      API_ENDPOINTS.DASHBOARD.TIENDAS,
      { params }
    );
    return response.data;
  },

  /**
   * Get list of all employees with summary data
   */
  async getEmpleados(params?: PeriodParams): Promise<EmpleadoPerformance[]> {
    const response = await apiClient.get<EmpleadoPerformance[]>(
      API_ENDPOINTS.DASHBOARD.EMPLEADOS,
      { params }
    );
    return response.data;
  },

  /**
   * Get detailed data for a specific store
   */
  async getTiendaDetail(
    tienda: string,
    params?: PeriodParams
  ): Promise<TiendaDetalle> {
    const response = await apiClient.get<TiendaDetalle>(
      API_ENDPOINTS.DASHBOARD.TIENDA_DETAIL(tienda),
      { params }
    );
    return response.data;
  },

  /**
   * Get historical data for charts
   * @param params.year - Year for historical data
   * @param params.tienda - Optional store name for specific store data
   */
  async getHistorico(params?: HistoricoParams): Promise<HistoricoResponse> {
    const response = await apiClient.get<HistoricoResponse>(
      API_ENDPOINTS.DASHBOARD.HISTORICO,
      { params }
    );
    return response.data;
  },
};
