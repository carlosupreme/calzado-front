import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { generateAlerts } from '@/lib/mockData';
import type { TiendaResumen } from '@/types/dashboard';
import { Link } from 'react-router-dom';

interface AlertsDashboardProps {
  tiendas: TiendaResumen[];
}

export function AlertsDashboard({ tiendas }: AlertsDashboardProps) {
  const alerts = generateAlerts(tiendas);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-red-600 dark:text-red-300">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-yellow-600 dark:text-yellow-300">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-blue-600 dark:text-blue-300">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
        );
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Hace un momento';
    if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} hrs`;
    return `Hace ${Math.floor(seconds / 86400)} días`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium">Alertas y Notificaciones</CardTitle>
            <p className="text-xs text-muted-foreground">
              {alerts.filter(a => a.type === 'critical').length} críticas, {alerts.filter(a => a.type === 'warning').length} advertencias
            </p>
          </div>
          <Badge variant="outline">{alerts.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-12 w-12 mx-auto mb-2 text-green-500">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <p className="text-sm">No hay alertas pendientes</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex gap-3 rounded-lg border p-3 transition-colors ${
                  alert.type === 'critical'
                    ? 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20'
                    : alert.type === 'warning'
                    ? 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20'
                    : 'border-border bg-muted/30'
                }`}
              >
                {getAlertIcon(alert.type)}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium">{alert.title}</h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {getTimeAgo(alert.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.message}</p>
                  {alert.action && alert.tienda && (
                    <div className="flex gap-2 pt-1">
                      <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                        <Link to={`/tiendas/${encodeURIComponent(alert.tienda)}`}>
                          Ver detalles
                        </Link>
                      </Button>
                      <Badge variant="secondary" className="text-xs">
                        {alert.action}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
