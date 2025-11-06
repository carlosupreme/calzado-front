import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatNumber } from '@/lib/statusUtils';
import type { TiendaResumen } from '@/types/dashboard';
import { Link } from 'react-router-dom';

interface StoreRankingProps {
  tiendas: TiendaResumen[];
  type: 'top' | 'bottom';
  metric: 'ventas' | 'inventario' | 'cobertura';
}

export function StoreRanking({ tiendas, type, metric }: StoreRankingProps) {
  const sorted = [...tiendas].sort((a, b) => {
    const aValue = a[metric];
    const bValue = b[metric];
    return type === 'top' ? bValue - aValue : aValue - bValue;
  }).slice(0, 5);

  const titles = {
    ventas: type === 'top' ? 'Top 5 - Mayores Ventas' : 'Bottom 5 - Menores Ventas',
    inventario: type === 'top' ? 'Top 5 - Mayor Inventario' : 'Bottom 5 - Menor Inventario',
    cobertura: type === 'top' ? 'Top 5 - Mayor Cobertura' : 'Bottom 5 - Menor Cobertura',
  };

  const icons = {
    ventas: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    inventario: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      </svg>
    ),
    cobertura: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-sm font-medium">{titles[metric]}</CardTitle>
        {icons[metric]}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sorted.map((tienda, index) => (
            <Link
              key={tienda.tienda}
              to={`/tiendas/${encodeURIComponent(tienda.tienda)}`}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors"
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                type === 'top'
                  ? index === 0
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    : 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{tienda.tienda}</p>
                <p className="text-xs text-muted-foreground">
                  {metric === 'cobertura'
                    ? `${tienda.cobertura.toFixed(1)} días`
                    : `${formatNumber(tienda[metric])} pzs`
                  }
                </p>
              </div>
              <Badge variant={tienda.status === 'ÓPTIMO' ? 'default' : tienda.status === 'CRÍTICO' ? 'destructive' : 'secondary'} className="text-xs">
                {tienda.status}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
