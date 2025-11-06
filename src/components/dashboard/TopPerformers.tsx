import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { EmpleadoPerformance } from '@/types/dashboard';
import { formatNumber } from '@/lib/statusUtils';

interface TopPerformersProps {
  empleados: EmpleadoPerformance[];
}

export function TopPerformers({ empleados }: TopPerformersProps) {
  const topThree = empleados.slice(0, 3);

  const getMedalEmoji = (ranking: number) => {
    switch (ranking) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 3 Vendedores del Mes</CardTitle>
        <p className="text-sm text-muted-foreground">
          Mejores desempeños en ventas totales
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topThree.map((empleado) => (
            <div
              key={empleado.empleado}
              className="flex items-center justify-between p-4 rounded-lg border bg-linear-to-r from-background to-muted/20"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{getMedalEmoji(empleado.ranking)}</div>
                <div>
                  <div className="font-semibold text-lg">{empleado.empleado}</div>
                  <div className="text-sm text-muted-foreground">{empleado.tienda}</div>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {empleado.num_ventas} ventas
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      ⭐ {empleado.satisfaccion_cliente}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  ${formatNumber(empleado.ventas_totales)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Comisión: ${formatNumber(empleado.comision)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
