import { BusinessUnitFilter } from '@/components/dashboard/BusinessUnitFilter';
import { ExecutiveInsights } from '@/components/dashboard/ExecutiveInsights';
import { TiendaDetail } from '@/components/dashboard/TiendaDetail';
import { UnitComparison } from '@/components/dashboard/UnitComparison';
import { YearOverYearComparison } from '@/components/dashboard/YearOverYearComparison';
import { YearSelector } from '@/components/dashboard/YearSelector';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTiendaDetail } from '@/hooks/useDashboard';
import type { PeriodParams } from '@/types/dashboard';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export function TiendaDetailPage() {
  const { tienda } = useParams<{ tienda: string }>();
  const [period] = useState<PeriodParams>({
    year: 2025,
    month: 5,
  });

  // Available years for analysis
  const availableYears = [2023, 2024, 2025];
  const [selectedYears, setSelectedYears] = useState<number[]>([2024]);

  if (!tienda) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        Tienda no especificada
      </div>
    );
  }

  const decodedTienda = decodeURIComponent(tienda);
  const { data: tiendaData, isLoading } = useTiendaDetail(decodedTienda, period);

  // Get unique business units
  const availableUnits = tiendaData?.detalle_unidades.map(u => u.unidad) || [];
  const [selectedUnits, setSelectedUnits] = useState<string[]>(availableUnits);

  // Update selected units when data loads
  if (availableUnits.length > 0 && selectedUnits.length === 0) {
    setSelectedUnits(availableUnits);
  }

  const handleToggleUnit = (unit: string) => {
    setSelectedUnits(prev =>
      prev.includes(unit)
        ? prev.filter(u => u !== unit)
        : [...prev, unit]
    );
  };

  const handleSelectAll = () => {
    setSelectedUnits(availableUnits);
  };

  const handleClearAll = () => {
    setSelectedUnits([]);
  };

  const handleToggleYear = (year: number) => {
    setSelectedYears(prev =>
      prev.includes(year)
        ? prev.filter(y => y !== year)
        : [...prev, year].sort()
    );
  };

  const handleSelectAllYears = () => {
    setSelectedYears(availableYears);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!tiendaData) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        No se encontraron datos para esta tienda
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Store Overview */}
      <TiendaDetail tienda={decodedTienda} period={period} />

      {/* Executive Insights */}
      <ExecutiveInsights
        tienda={decodedTienda}
        units={tiendaData.detalle_unidades}
        totalInventario={tiendaData.total_inventario}
        totalVentas={tiendaData.total_ventas}
        cobertura={tiendaData.cobertura}
      />

      {/* Business Unit Analysis Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Análisis por Unidad de Negocio</h2>
          <p className="text-muted-foreground">
            Comparación detallada y tendencias históricas por categoría
          </p>
        </div>

        {/* Filters Section */}
        <Card>
          <CardContent className="pt-6 space-y-6">
            {/* Business Unit Filter */}
            <div>
              <h3 className="text-sm font-medium mb-3">Filtrar por Unidad de Negocio</h3>
              <BusinessUnitFilter
                units={availableUnits}
                selectedUnits={selectedUnits}
                onToggleUnit={handleToggleUnit}
                onSelectAll={handleSelectAll}
                onClearAll={handleClearAll}
              />
            </div>

            {/* Year Filter */}
            <div>
              <h3 className="text-sm font-medium mb-3">Filtrar por Año</h3>
              <YearSelector
                availableYears={availableYears}
                selectedYears={selectedYears}
                onToggleYear={handleToggleYear}
                onSelectAll={handleSelectAllYears}
              />
            </div>
          </CardContent>
        </Card>

        {/* Unit Comparison */}
        {selectedUnits.length > 0 && (
          <UnitComparison
            units={tiendaData.detalle_unidades}
            selectedUnits={selectedUnits}
          />
        )}

        {/* Year over Year Comparison */}
        {selectedYears.length >= 2 && selectedUnits.length > 0 && (
          <YearOverYearComparison
            tienda={decodedTienda}
            years={selectedYears}
            selectedUnits={selectedUnits}
          />
        )}
      </div>
    </div>
  );
}
