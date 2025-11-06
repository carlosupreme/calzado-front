import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateStockTransferSuggestions } from '@/lib/mockData';
import type { TiendaResumen } from '@/types/dashboard';
import { formatNumber } from '@/lib/statusUtils';
import { Link } from 'react-router-dom';

interface StockTransferSuggestionsProps {
  tiendas: TiendaResumen[];
}

export function StockTransferSuggestions({ tiendas }: StockTransferSuggestionsProps) {
  const suggestions = generateStockTransferSuggestions(tiendas);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      default:
        return 'Baja';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium">Sugerencias de Transferencia</CardTitle>
            <p className="text-xs text-muted-foreground">
              Optimización de inventario entre tiendas
            </p>
          </div>
          <Badge variant="outline">{suggestions.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-12 w-12 mx-auto mb-2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <p className="text-sm">No hay transferencias sugeridas</p>
            </div>
          ) : (
            suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={getPriorityColor(suggestion.priority) as any}>
                        {getPriorityLabel(suggestion.priority)}
                      </Badge>
                      <span className="text-xs font-medium text-muted-foreground">
                        {suggestion.unidad}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Link
                        to={`/tiendas/${encodeURIComponent(suggestion.fromStore)}`}
                        className="font-medium hover:underline"
                      >
                        {suggestion.fromStore}
                      </Link>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                      <Link
                        to={`/tiendas/${encodeURIComponent(suggestion.toStore)}`}
                        className="font-medium hover:underline"
                      >
                        {suggestion.toStore}
                      </Link>
                    </div>
                    <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-bold">{formatNumber(suggestion.cantidad)}</p>
                    <p className="text-xs text-muted-foreground">piezas</p>
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
