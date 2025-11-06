import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { generateCoverageDistribution } from '@/lib/mockData';
import type { TiendaResumen } from '@/types/dashboard';

interface CoverageDistributionProps {
  tiendas: TiendaResumen[];
}

export function CoverageDistribution({ tiendas }: CoverageDistributionProps) {
  const data = generateCoverageDistribution(tiendas);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Distribución de Cobertura</CardTitle>
        <p className="text-xs text-muted-foreground">
          Número de tiendas por rango de días de cobertura
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              className="text-xs"
              tick={{ fill: 'currentColor', fontSize: 11 }}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'currentColor' }}
              label={{
                value: 'Número de tiendas',
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
              formatter={(value: number) => [`${value} tiendas`, 'Cantidad']}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          {data.map((range, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: range.color }}
              />
              <span className="text-muted-foreground">
                {range.name}: <span className="font-medium text-foreground">{range.count}</span>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
