import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { generateBusinessUnitData } from '@/lib/mockData';
import type { TiendaResumen } from '@/types/dashboard';
import { formatNumber } from '@/lib/statusUtils';

interface BusinessUnitBreakdownProps {
  tiendas: TiendaResumen[];
}

export function BusinessUnitBreakdown({ tiendas }: BusinessUnitBreakdownProps) {
  const data = generateBusinessUnitData(tiendas);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Rendimiento por Unidad de Negocio</CardTitle>
        <p className="text-xs text-muted-foreground">
          Comparación de inventario y ventas por categoría
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="unidad"
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'currentColor' }}
              label={{
                value: 'Piezas',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
              formatter={(value: number) => formatNumber(value)}
            />
            <Legend />
            <Bar dataKey="inventario" fill="hsl(221 83% 53%)" name="Inventario" radius={[4, 4, 0, 0]} />
            <Bar dataKey="ventas" fill="hsl(142 76% 36%)" name="Ventas" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {data.map((unit) => (
            <div key={unit.unidad} className="space-y-1 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">{unit.unidad}</h4>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  unit.cobertura < 28
                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    : unit.cobertura > 90
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                }`}>
                  {unit.cobertura} días
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>
                  <span className="block">Inventario</span>
                  <span className="font-medium text-foreground">{unit.inventarioPercent}%</span>
                </div>
                <div>
                  <span className="block">Ventas</span>
                  <span className="font-medium text-foreground">{unit.ventasPercent}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
