import { z } from 'zod';

// Zod schemas for runtime validation
export const DashboardSummarySchema = z.object({
  total_tiendas: z.number(),
  tiendas_criticas: z.number(),
  tiendas_alerta: z.number(),
  tiendas_optimas: z.number(),
  inventario_total: z.number(),
  ventas_totales: z.number(),
  cobertura_promedio: z.number(),
  periodo: z.string(),
});

export const TiendaResumenSchema = z.object({
  tienda: z.string(),
  inventario: z.number(),
  ventas: z.number(),
  cobertura: z.number(),
  status: z.enum(['CRÍTICO', 'ÓPTIMO', 'SOBREINVENTARIO', 'SIN VENTAS']),
});

export const UnidadDetalleSchema = z.object({
  unidad: z.string(),
  inventario: z.number(),
  ventas: z.number(),
  cobertura: z.number(),
});

export const TiendaDetalleSchema = z.object({
  tienda: z.string(),
  periodo: z.string(),
  total_inventario: z.number(),
  total_ventas: z.number(),
  cobertura: z.number(),
  detalle_unidades: z.array(UnidadDetalleSchema),
});

export const DatoHistoricoSchema = z.object({
  mes: z.number(),
  inventario: z.number(),
  ventas: z.number(),
  cobertura: z.number(),
});

export const HistoricoResponseSchema = z.object({
  tienda: z.string().nullable(),
  year: z.number(),
  datos: z.array(DatoHistoricoSchema),
});

// TypeScript types inferred from schemas
export type DashboardSummary = z.infer<typeof DashboardSummarySchema>;
export type TiendaResumen = z.infer<typeof TiendaResumenSchema>;
export type UnidadDetalle = z.infer<typeof UnidadDetalleSchema>;
export type TiendaDetalle = z.infer<typeof TiendaDetalleSchema>;
export type DatoHistorico = z.infer<typeof DatoHistoricoSchema>;
export type HistoricoResponse = z.infer<typeof HistoricoResponseSchema>;

// Status type for easier reuse
export type TiendaStatus = 'CRÍTICO' | 'ÓPTIMO' | 'SOBREINVENTARIO' | 'SIN VENTAS';

// Query parameters types
export interface PeriodParams {
  year?: number;
  month?: number;
}

export interface HistoricoParams {
  year?: number;
  tienda?: string;
}

// API error response type
export interface ApiError {
  detail: string;
}
