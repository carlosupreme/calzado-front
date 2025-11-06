import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { generateSalesVelocity } from '@/lib/mockData';
import type { TiendaResumen } from '@/types/dashboard';
import { formatNumber } from '@/lib/statusUtils';

interface SalesVelocityProps {
  tiendas: TiendaResumen[];
}

export function SalesVelocity({ tiendas }: SalesVelocityProps) {
  const data = generateSalesVelocity(tiendas);

  const avgSales = data.reduce((sum, d) => sum + d.ventas, 0) / data.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium">Velocidad de Ventas (Últimos 30 días)</CardTitle>
            <p className="text-xs text-muted-foreground">
              Promedio diario: {formatNumber(Math.floor(avgSales))} pzs
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">Ventas</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-xs text-muted-foreground">Meta</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142 76% 36%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'currentColor', fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'currentColor' }}
              label={{
                value: 'Ventas (pzs)',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: 11 }
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
              formatter={(value: number, name: string) => [
                formatNumber(value),
                name === 'ventas' ? 'Ventas' : 'Meta'
              ]}
            />
            <Area
              type="monotone"
              dataKey="ventas"
              stroke="hsl(142 76% 36%)"
              strokeWidth={2}
              fill="url(#salesGradient)"
              name="Ventas"
            />
            <Line
              type="monotone"
              dataKey="meta"
              stroke="hsl(221 83% 53%)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Meta"
            />
          </ComposedChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-3 gap-4 rounded-lg border p-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Mínimo</p>
            <p className="text-sm font-medium">{formatNumber(Math.min(...data.map(d => d.ventas)))} pzs</p>
          </div>
          <div className="text-center border-x">
            <p className="text-xs text-muted-foreground">Promedio</p>
            <p className="text-sm font-medium">{formatNumber(Math.floor(avgSales))} pzs</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Máximo</p>
            <p className="text-sm font-medium">{formatNumber(Math.max(...data.map(d => d.ventas)))} pzs</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
