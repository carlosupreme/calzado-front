import { useState } from 'react';
import { useEmpleados } from '@/hooks/useDashboard';
import type { PeriodParams } from '@/types/dashboard';
import { EmployeeMetrics } from '@/components/dashboard/EmployeeMetrics';
import { EmployeeRecognition } from '@/components/dashboard/EmployeeRecognition';
import { TopPerformers } from '@/components/dashboard/TopPerformers';
import { EmployeePerformanceChart } from '@/components/dashboard/EmployeePerformanceChart';
import { EmployeeRankingTable } from '@/components/dashboard/EmployeeRankingTable';
import { Skeleton } from '@/components/ui/skeleton';

export function EmpleadosPage() {
  const [period] = useState<PeriodParams>({
    year: 2025,
    month: 5,
  });

  const { data, isLoading, error } = useEmpleados(period);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
        Error al cargar los datos de empleados: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Empleados</h1>
        <p className="text-muted-foreground">
          Panel de control para monitorear el desempeño del equipo de ventas
        </p>
      </div>

      {/* Employee Recognition Section */}
      <EmployeeRecognition />

      {/* KPI Metrics */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : (
        <EmployeeMetrics />
      )}

      {/* Top Performers and Chart */}
      <div className="grid gap-6 lg:grid-cols-2">
        {isLoading ? (
          <>
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[400px] w-full" />
          </>
        ) : data ? (
          <>
            <TopPerformers empleados={data} />
            <EmployeePerformanceChart />
          </>
        ) : null}
      </div>

      {/* Complete Ranking Table */}
      {isLoading ? (
        <Skeleton className="h-[600px] w-full" />
      ) : data ? (
        <EmployeeRankingTable empleados={data} />
      ) : (
        <div className="text-center text-muted-foreground py-8">
          No hay datos de empleados disponibles
        </div>
      )}
    </div>
  );
}
