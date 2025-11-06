import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { dashboardService } from '@/api/services/dashboard';
import type {
  DashboardSummary,
  TiendaResumen,
  EmpleadoPerformance,
  TiendaDetalle,
  HistoricoResponse,
  PeriodParams,
  HistoricoParams,
} from '@/types/dashboard';

/**
 * Hook to fetch dashboard summary
 */
export function useDashboardSummary(params?: PeriodParams): UseQueryResult<DashboardSummary> {
  return useQuery({
    queryKey: ['dashboard', 'summary', params],
    queryFn: () => dashboardService.getSummary(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch all stores list
 */
export function useTiendas(params?: PeriodParams): UseQueryResult<TiendaResumen[]> {
  return useQuery({
    queryKey: ['dashboard', 'tiendas', params],
    queryFn: () => dashboardService.getTiendas(params),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch all employees list
 */
export function useEmpleados(params?: PeriodParams): UseQueryResult<EmpleadoPerformance[]> {
  return useQuery({
    queryKey: ['dashboard', 'empleados', params],
    queryFn: () => dashboardService.getEmpleados(params),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch specific store details
 */
export function useTiendaDetail(
  tienda: string,
  params?: PeriodParams
): UseQueryResult<TiendaDetalle> {
  return useQuery({
    queryKey: ['dashboard', 'tienda', tienda, params],
    queryFn: () => dashboardService.getTiendaDetail(tienda, params),
    enabled: !!tienda,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch historical data
 */
export function useHistorico(params?: HistoricoParams): UseQueryResult<HistoricoResponse> {
  return useQuery({
    queryKey: ['dashboard', 'historico', params],
    queryFn: () => dashboardService.getHistorico(params),
    staleTime: 10 * 60 * 1000, // 10 minutes for historical data
  });
}
