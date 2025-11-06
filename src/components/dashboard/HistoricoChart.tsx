import { useHistorico } from '@/hooks/useDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { HistoricoParams } from '@/types/dashboard';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';

interface HistoricoChartProps {
  params?: HistoricoParams;
}

const monthNames = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

export function HistoricoChart({ params }: HistoricoChartProps) {
  const { data, isLoading, error } = useHistorico(params);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Datos Históricos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            Error al cargar datos históricos: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Datos Históricos</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.datos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Datos Históricos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No hay datos históricos disponibles
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.datos.map((dato) => ({
    mes: monthNames[dato.mes - 1],
    Inventario: dato.inventario,
    Ventas: dato.ventas,
    Cobertura: dato.cobertura,
  }));

  // Calculate min/max for proper scaling
  const inventarioValues = data.datos.map(d => d.inventario);
  const ventasValues = data.datos.map(d => d.ventas);
  const minInventario = Math.min(...inventarioValues);
  const maxInventario = Math.max(...inventarioValues);
  const minVentas = Math.min(...ventasValues);
  const maxVentas = Math.max(...ventasValues);

  // Add padding to domains for better visualization
  const inventarioDomain = [
    Math.floor(minInventario * 0.9),
    Math.ceil(maxInventario * 1.1)
  ];
  const ventasDomain = [
    Math.floor(minVentas * 0.9),
    Math.ceil(maxVentas * 1.1)
  ];

  const title = data.tienda
    ? `Histórico ${data.tienda} - ${data.year}`
    : `Histórico Consolidado - ${data.year}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Tendencias de inventario, ventas y cobertura a lo largo del año
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Inventario y Ventas with dual Y-axes */}
          <div>
            <h3 className="mb-4 text-sm font-medium">Inventario vs Ventas</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="mes"
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis
                  yAxisId="left"
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                  domain={inventarioDomain}
                  label={{
                    value: 'Inventario',
                    angle: -90,
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                  domain={ventasDomain}
                  label={{
                    value: 'Ventas',
                    angle: 90,
                    position: 'insideRight',
                    style: { textAnchor: 'middle' }
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                  formatter={(value: number) => value.toLocaleString('es-MX')}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="Inventario"
                  stroke="hsl(221 83% 53%)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'hsl(221 83% 53%)' }}
                  activeDot={{ r: 6 }}
                  name="Inventario (pzs)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="Ventas"
                  stroke="hsl(142 76% 36%)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'hsl(142 76% 36%)' }}
                  activeDot={{ r: 6 }}
                  name="Ventas (pzs)"
                />
              </ComposedChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              * Nota: Cada línea usa su propia escala en el eje Y para mejor visualización
            </p>
          </div>

          {/* Cobertura */}
          <div>
            <h3 className="mb-4 text-sm font-medium">Cobertura (días)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="mes"
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Cobertura"
                  stroke="hsl(221 83% 53%)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                {/* Reference lines for optimal coverage */}
                <Line
                  type="monotone"
                  dataKey={() => 28}
                  stroke="hsl(0 84% 60%)"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Mínimo (28 días)"
                />
                <Line
                  type="monotone"
                  dataKey={() => 90}
                  stroke="hsl(48 96% 53%)"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Máximo (90 días)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
