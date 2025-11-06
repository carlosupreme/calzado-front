import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { EmpleadoPerformance } from '@/types/dashboard';
import { formatNumber } from '@/lib/statusUtils';

interface EmployeeRankingTableProps {
  empleados: EmpleadoPerformance[];
}

export function EmployeeRankingTable({ empleados }: EmployeeRankingTableProps) {
  const getPerformanceBadge = (satisfaccion: number) => {
    if (satisfaccion >= 4.5) return { variant: 'default' as const, label: 'Excelente' };
    if (satisfaccion >= 4.0) return { variant: 'secondary' as const, label: 'Bueno' };
    if (satisfaccion >= 3.5) return { variant: 'outline' as const, label: 'Regular' };
    return { variant: 'destructive' as const, label: 'Bajo' };
  };

  const getConversionColor = (conversion: number) => {
    if (conversion >= 35) return 'text-green-600 dark:text-green-400';
    if (conversion >= 25) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ranking Completo de Empleados</CardTitle>
        <p className="text-sm text-muted-foreground">
          {empleados.length} empleados registrados
        </p>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Empleado</TableHead>
                <TableHead>Tienda</TableHead>
                <TableHead className="text-right">Ventas</TableHead>
                <TableHead className="text-right">Núm. Ventas</TableHead>
                <TableHead className="text-right">Ticket Prom.</TableHead>
                <TableHead className="text-right">Comisión</TableHead>
                <TableHead className="text-center">Conversión</TableHead>
                <TableHead className="text-center">Satisfacción</TableHead>
                <TableHead className="text-center">Desempeño</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {empleados.map((empleado) => {
                const badge = getPerformanceBadge(empleado.satisfaccion_cliente);
                return (
                  <TableRow key={empleado.empleado} className="hover:bg-muted/50">
                    <TableCell className="font-bold text-muted-foreground">
                      {empleado.ranking}
                    </TableCell>
                    <TableCell className="font-medium">
                      {empleado.empleado}
                      {empleado.ranking <= 3 && (
                        <span className="ml-2">
                          {empleado.ranking === 1 ? '🥇' : empleado.ranking === 2 ? '🥈' : '🥉'}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {empleado.tienda}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ${formatNumber(empleado.ventas_totales)}
                    </TableCell>
                    <TableCell className="text-right">
                      {empleado.num_ventas}
                    </TableCell>
                    <TableCell className="text-right">
                      ${formatNumber(empleado.ticket_promedio)}
                    </TableCell>
                    <TableCell className="text-right text-green-600 dark:text-green-400">
                      ${formatNumber(empleado.comision)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`font-semibold ${getConversionColor(empleado.tasa_conversion)}`}>
                        {empleado.tasa_conversion}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span>⭐</span>
                        <span className="font-semibold">{empleado.satisfaccion_cliente}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={badge.variant}>
                        {badge.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
