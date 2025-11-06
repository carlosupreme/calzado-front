import { useState } from 'react';
import { useTiendas } from '@/hooks/useDashboard';
import { DashboardSummary } from '@/components/dashboard/DashboardSummary';
import { StoreRanking } from '@/components/dashboard/StoreRanking';
import { CoverageDistribution } from '@/components/dashboard/CoverageDistribution';
import { BusinessUnitBreakdown } from '@/components/dashboard/BusinessUnitBreakdown';
import { AlertsDashboard } from '@/components/dashboard/AlertsDashboard';
import { SalesVelocity } from '@/components/dashboard/SalesVelocity';
import { StockTransferSuggestions } from '@/components/dashboard/StockTransferSuggestions';
import { RestockRecommendations } from '@/components/dashboard/RestockRecommendations';
import { Button } from '@/components/ui/button';
import type { PeriodParams } from '@/types/dashboard';

export function DashboardPage() {
  const [period] = useState<PeriodParams>({
    year: 2025,
    month: 5,
  });

  const { data: tiendas, isLoading } = useTiendas(period);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!tiendas || tiendas.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Ejecutivo</h1>
          <p className="text-muted-foreground">
            Análisis completo de inventario y cobertura de tiendas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 mr-2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 mr-2"
            >
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            Actualizar
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <DashboardSummary period={period} />

      {/* Alerts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AlertsDashboard tiendas={tiendas} />
        </div>
        <CoverageDistribution tiendas={tiendas} />
      </div>

      {/* Rankings Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StoreRanking tiendas={tiendas} type="top" metric="ventas" />
        <StoreRanking tiendas={tiendas} type="bottom" metric="ventas" />
        <StoreRanking tiendas={tiendas} type="top" metric="cobertura" />
      </div>

      {/* Performance Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SalesVelocity tiendas={tiendas} />
        <BusinessUnitBreakdown tiendas={tiendas} />
      </div>

      {/* Action Items */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RestockRecommendations tiendas={tiendas} />
        <StockTransferSuggestions tiendas={tiendas} />
      </div>
    </div>
  );
}
