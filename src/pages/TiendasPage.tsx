import { useState } from 'react';
import { TiendasList } from '@/components/dashboard/TiendasList';
import type { PeriodParams } from '@/types/dashboard';

export function TiendasPage() {
  const [period] = useState<PeriodParams>({
    year: 2025,
    month: 5,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tiendas</h1>
        <p className="text-muted-foreground">
          Lista completa de tiendas con métricas de inventario
        </p>
      </div>

      <TiendasList period={period} />
    </div>
  );
}
