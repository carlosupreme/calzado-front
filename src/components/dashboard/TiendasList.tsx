import { useTiendas } from '@/hooks/useDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getStatusColor, formatNumber } from '@/lib/statusUtils';
import type { PeriodParams } from '@/types/dashboard';
import { Link } from 'react-router-dom';

interface TiendasListProps {
  period?: PeriodParams;
}

export function TiendasList({ period }: TiendasListProps) {
  const { data, isLoading, error } = useTiendas(period);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
        Error al cargar las tiendas: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lista de Tiendas</CardTitle>
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
          <CardTitle>Lista de Tiendas</CardTitle>
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
        <CardTitle>Lista de Tiendas</CardTitle>
        <p className="text-sm text-muted-foreground">
          {data.length} tiendas encontradas
        </p>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tienda</TableHead>
                <TableHead className="text-right">Inventario</TableHead>
                <TableHead className="text-right">Ventas</TableHead>
                <TableHead className="text-right">Cobertura</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((tienda) => (
                <TableRow key={tienda.tienda} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Link
                      to={`/tiendas/${encodeURIComponent(tienda.tienda)}`}
                      className="text-primary hover:underline"
                    >
                      {tienda.tienda}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(tienda.inventario)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(tienda.ventas)}
                  </TableCell>
                  <TableCell className="text-right">
                    {tienda.cobertura.toFixed(1)} días
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(tienda.status) as any}>
                      {tienda.status}
                    </Badge>
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
