import { useTiendaDetail } from '@/hooks/useDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatNumber } from '@/lib/statusUtils';
import type { PeriodParams } from '@/types/dashboard';
import { Link } from 'react-router-dom';

interface TiendaDetailProps {
  tienda: string;
  period?: PeriodParams;
}

export function TiendaDetail({ tienda, period }: TiendaDetailProps) {
  const { data, isLoading, error } = useTiendaDetail(tienda, period);

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/tiendas">← Volver</Link>
          </Button>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          Error al cargar los detalles: {error.message}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-32" />
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/tiendas">← Volver</Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">{data.tienda}</h1>
          </div>
          <p className="text-sm text-muted-foreground">{data.periodo}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventario Total</CardTitle>
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
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.total_inventario)}</div>
            <p className="text-xs text-muted-foreground">piezas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
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
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.total_ventas)}</div>
            <p className="text-xs text-muted-foreground">piezas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cobertura</CardTitle>
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
              <path d="M12 2v20M2 12h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.cobertura.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">días</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalle por Unidad de Negocio</CardTitle>
          <p className="text-sm text-muted-foreground">
            Desglose de inventario, ventas y cobertura por unidad
          </p>
        </CardHeader>
        <CardContent>
          {data.detalle_unidades.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay datos de unidades disponibles
            </p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unidad de Negocio</TableHead>
                    <TableHead className="text-right">Inventario</TableHead>
                    <TableHead className="text-right">Ventas</TableHead>
                    <TableHead className="text-right">Cobertura</TableHead>
                    <TableHead className="text-right">% Inventario</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.detalle_unidades.map((unidad) => {
                    const porcentajeInventario =
                      (unidad.inventario / data.total_inventario) * 100;
                    const coberturaStatus =
                      unidad.cobertura < 28
                        ? 'text-red-600'
                        : unidad.cobertura > 90
                        ? 'text-yellow-600'
                        : 'text-green-600';

                    return (
                      <TableRow key={unidad.unidad}>
                        <TableCell className="font-medium">{unidad.unidad}</TableCell>
                        <TableCell className="text-right">
                          {formatNumber(unidad.inventario)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(unidad.ventas)}
                        </TableCell>
                        <TableCell className={`text-right font-medium ${coberturaStatus}`}>
                          {unidad.cobertura.toFixed(1)} días
                        </TableCell>
                        <TableCell className="text-right">
                          {porcentajeInventario.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
