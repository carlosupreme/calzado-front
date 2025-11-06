import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { TiendaDetail } from '@/components/dashboard/TiendaDetail';
import { HistoricoChart } from '@/components/dashboard/HistoricoChart';
import type { PeriodParams } from '@/types/dashboard';

export function TiendaDetailPage() {
  const { tienda } = useParams<{ tienda: string }>();
  const [period] = useState<PeriodParams>({
    year: 2025,
    month: 5,
  });

  if (!tienda) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        Tienda no especificada
      </div>
    );
  }

  const decodedTienda = decodeURIComponent(tienda);

  return (
    <div className="space-y-6">
      <TiendaDetail tienda={decodedTienda} period={period} />
      <HistoricoChart params={{ year: 2024, tienda: decodedTienda }} />
    </div>
  );
}
