import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useEmpleados } from '@/hooks/useDashboard';
import type { PeriodParams } from '@/types/dashboard';

interface EmpleadosListProps {
  period?: PeriodParams;
}

export function EmpleadosList({ period }: EmpleadosListProps) {
  const { data, isLoading, error } = useEmpleados(period);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
        Error al cargar los empleados: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lista de Empleados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lista de Empleados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No hay datos disponibles</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Empleados</CardTitle>
        <p className="text-sm text-muted-foreground">
          {data.length} empleados encontrados
        </p>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead className="text-right">Inventario</TableHead>
                <TableHead className="text-right">Ventas</TableHead>
                <TableHead className="text-right">Cobertura</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((empleado) => (
                <TableRow key={empleado.empleado} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {empleado.empleado}
                  </TableCell>
                </TableRow> 
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
