import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { formatNumber } from '@/lib/statusUtils';
import type { UnidadDetalle } from '@/types/dashboard';

interface UnitComparisonProps {
  units: UnidadDetalle[];
  selectedUnits: string[];
}

const UNIT_COLORS: Record<string, string> = {
  'Dama': 'hsl(340 82% 52%)',
  'Caballero': 'hsl(221 83% 53%)',
  'Niño': 'hsl(142 76% 36%)',
  'Accesorios': 'hsl(280 65% 60%)',
};

export function UnitComparison({ units, selectedUnits }: UnitComparisonProps) {
  const filteredUnits = units.filter(u => selectedUnits.includes(u.unidad));

  if (filteredUnits.length === 0) {
    return null;
  }

  // Calculate performance scores for radar chart
  const radarData = filteredUnits.map(unit => {
    const turnoverScore = Math.min((unit.ventas / unit.inventario) * 100, 100);
    const coverageScore = unit.cobertura >= 28 && unit.cobertura <= 90 ? 100 :
                         unit.cobertura < 28 ? (unit.cobertura / 28) * 100 :
                         Math.max(0, 100 - ((unit.cobertura - 90) / 30) * 100);
    const salesScore = (unit.ventas / Math.max(...filteredUnits.map(u => u.ventas))) * 100;
    const inventoryEfficiency = Math.min((unit.ventas / unit.inventario) * 200, 100);

    return {
      unidad: unit.unidad,
      'Rotación': parseFloat(turnoverScore.toFixed(1)),
      'Cobertura Óptima': parseFloat(coverageScore.toFixed(1)),
      'Ventas': parseFloat(salesScore.toFixed(1)),
      'Eficiencia': parseFloat(inventoryEfficiency.toFixed(1)),
    };
  });

  // Side by side comparison data
  const comparisonData = filteredUnits.map(unit => ({
    unidad: unit.unidad,
    inventario: unit.inventario,
    ventas: unit.ventas,
    cobertura: unit.cobertura,
    rotacion: parseFloat((unit.ventas / unit.inventario).toFixed(2)),
  }));

  // Calculate winners
  const topSales = [...filteredUnits].sort((a, b) => b.ventas - a.ventas)[0];
  const topTurnover = [...filteredUnits].sort((a, b) =>
    (b.ventas / b.inventario) - (a.ventas / a.inventario)
  )[0];
  const bestCoverage = [...filteredUnits].sort((a, b) => {
    const scoreA = Math.abs(a.cobertura - 59); // 59 is middle of 28-90 range
    const scoreB = Math.abs(b.cobertura - 59);
    return scoreA - scoreB;
  })[0];

  return (
    <div className="space-y-6">
      {/* Key Insights Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>🏆 Mejores Ventas</span>
              <Badge variant="default">{topSales.unidad}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatNumber(topSales.ventas)}</p>
            <p className="text-xs text-muted-foreground">piezas vendidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>⚡ Mayor Rotación</span>
              <Badge variant="default">{topTurnover.unidad}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {((topTurnover.ventas / topTurnover.inventario) * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground">índice de rotación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>✓ Cobertura Óptima</span>
              <Badge variant="default">{bestCoverage.unidad}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{bestCoverage.cobertura.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">días de cobertura</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Rendimiento Multidimensional</CardTitle>
          <p className="text-xs text-muted-foreground">
            Comparación de KPIs clave entre unidades seleccionadas
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData.length === 1 ?
              [radarData[0], { unidad: '', Rotación: 0, 'Cobertura Óptima': 0, Ventas: 0, Eficiencia: 0 }] :
              radarData
            }>
              <PolarGrid />
              <PolarAngleAxis dataKey="unidad" className="text-xs" tick={{ fill: 'currentColor' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" />
              {Object.keys(radarData[0] || {}).filter(k => k !== 'unidad').map((key, idx) => (
                <Radar
                  key={key}
                  name={key}
                  dataKey={key}
                  stroke={Object.values(UNIT_COLORS)[idx % 4]}
                  fill={Object.values(UNIT_COLORS)[idx % 4]}
                  fillOpacity={0.3}
                />
              ))}
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
                formatter={(value: number) => `${value.toFixed(1)}%`}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Side by Side Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Comparación Lado a Lado</CardTitle>
          <p className="text-xs text-muted-foreground">
            Métricas clave de cada unidad de negocio
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="unidad" className="text-xs" tick={{ fill: 'currentColor' }} />
              <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
                formatter={(value: number) => formatNumber(value)}
              />
              <Legend />
              <Bar dataKey="inventario" fill="hsl(221 83% 53%)" name="Inventario" />
              <Bar dataKey="ventas" fill="hsl(142 76% 36%)" name="Ventas" />
            </BarChart>
          </ResponsiveContainer>

          {/* Detailed Metrics Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="pb-2 font-medium">Unidad</th>
                  <th className="pb-2 font-medium text-right">Inventario</th>
                  <th className="pb-2 font-medium text-right">Ventas</th>
                  <th className="pb-2 font-medium text-right">Cobertura</th>
                  <th className="pb-2 font-medium text-right">Rotación</th>
                  <th className="pb-2 font-medium text-right">% Stock</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((unit, idx) => {
                  const totalInv = comparisonData.reduce((sum, u) => sum + u.inventario, 0);
                  const stockPercent = (unit.inventario / totalInv) * 100;

                  return (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="py-3 font-medium">{unit.unidad}</td>
                      <td className="py-3 text-right">{formatNumber(unit.inventario)}</td>
                      <td className="py-3 text-right">{formatNumber(unit.ventas)}</td>
                      <td className="py-3 text-right">
                        <span className={
                          unit.cobertura < 28 ? 'text-red-600 dark:text-red-400' :
                          unit.cobertura > 90 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-green-600 dark:text-green-400'
                        }>
                          {unit.cobertura.toFixed(1)} días
                        </span>
                      </td>
                      <td className="py-3 text-right">{(unit.rotacion * 100).toFixed(1)}%</td>
                      <td className="py-3 text-right">{stockPercent.toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
