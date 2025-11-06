import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateRestockRecommendations } from '@/lib/mockData';
import type { TiendaResumen } from '@/types/dashboard';
import { formatNumber } from '@/lib/statusUtils';
import { Link } from 'react-router-dom';

interface RestockRecommendationsProps {
  tiendas: TiendaResumen[];
}

export function RestockRecommendations({ tiendas }: RestockRecommendationsProps) {
  const recommendations = generateRestockRecommendations(tiendas);

  const getUrgencyColor = (urgency: string) => {
    return urgency === 'urgent' ? 'destructive' : 'default';
  };

  const getUrgencyLabel = (urgency: string) => {
    return urgency === 'urgent' ? 'Urgente' : 'Alta';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium">Recomendaciones de Reabastecimiento</CardTitle>
            <p className="text-xs text-muted-foreground">
              Tiendas que requieren reposición de inventario
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {recommendations.filter(r => r.urgency === 'urgent').length} urgentes
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-12 w-12 mx-auto mb-2 text-green-500">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <p className="text-sm">Todas las tiendas tienen stock suficiente</p>
            </div>
          ) : (
            recommendations.map((rec, index) => (
              <div
                key={index}
                className={`flex gap-3 rounded-lg border p-3 transition-colors ${
                  rec.urgency === 'urgent'
                    ? 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20'
                    : 'border-border'
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  rec.urgency === 'urgent'
                    ? 'bg-red-100 dark:bg-red-900'
                    : 'bg-orange-100 dark:bg-orange-900'
                }`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className={`h-5 w-5 ${
                      rec.urgency === 'urgent'
                        ? 'text-red-600 dark:text-red-300'
                        : 'text-orange-600 dark:text-orange-300'
                    }`}
                  >
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                    <path d="m3.3 7 8.7 5 8.7-5" />
                    <path d="M12 22V12" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        to={`/tiendas/${encodeURIComponent(rec.tienda)}`}
                        className="text-sm font-medium hover:underline"
                      >
                        {rec.tienda}
                      </Link>
                      <Badge variant={getUrgencyColor(rec.urgency) as any} className="text-xs">
                        {getUrgencyLabel(rec.urgency)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{rec.unidad}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <div>
                      <span className="text-muted-foreground">Stock actual:</span>
                      <span className="ml-1 font-medium">{formatNumber(rec.cantidadActual)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Recomendado:</span>
                      <span className="ml-1 font-medium text-green-600 dark:text-green-400">
                        +{formatNumber(rec.cantidadRecomendada)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cobertura:</span>
                      <span className="ml-1 font-medium">{rec.cobertura.toFixed(1)} días</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Agotamiento en:</span>
                      <span className={`ml-1 font-medium ${
                        rec.estimatedStockoutDays < 14 ? 'text-red-600 dark:text-red-400' : ''
                      }`}>
                        ~{rec.estimatedStockoutDays} días
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
