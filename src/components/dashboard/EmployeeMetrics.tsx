import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateEmpleadosMetrics } from '@/lib/mockData';
import { formatNumber } from '@/lib/statusUtils';

export function EmployeeMetrics() {
  const metrics = generateEmpleadosMetrics();

  const metricCards = [
    {
      title: 'Ventas Totales',
      value: `$${formatNumber(metrics.ventas_totales)}`,
      trend: { value: 12.5, isPositive: true },
      icon: '💰',
    },
    {
      title: 'Comisiones Totales',
      value: `$${formatNumber(metrics.comisiones_totales)}`,
      trend: { value: 8.3, isPositive: true },
      icon: '💵',
    },
    {
      title: 'Ticket Promedio',
      value: `$${formatNumber(metrics.ticket_promedio)}`,
      trend: { value: 5.2, isPositive: true },
      icon: '🎫',
    },
    {
      title: 'Tasa de Conversión',
      value: `${metrics.tasa_conversion_promedio}%`,
      trend: { value: 2.1, isPositive: true },
      icon: '📈',
    },
    {
      title: 'Satisfacción Cliente',
      value: `${metrics.satisfaccion_promedio}/5.0`,
      trend: { value: 0.3, isPositive: true },
      icon: '⭐',
    },
    {
      title: 'Unidades Vendidas',
      value: formatNumber(metrics.unidades_vendidas),
      trend: { value: 15.7, isPositive: true },
      icon: '👟',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metricCards.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <span className="text-2xl">{metric.icon}</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-medium ${metric.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {metric.trend.isPositive ? '↑' : '↓'} {metric.trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">vs mes anterior</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
