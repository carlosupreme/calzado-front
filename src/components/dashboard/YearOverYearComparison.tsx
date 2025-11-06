import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/lib/statusUtils';

interface YearOverYearComparisonProps {
  tienda?: string;
  years: number[];
  selectedUnits: string[];
}

// Generate YoY comparison data
function generateYoYData(years: number[], units: string[]) {
  return years.map((year, idx) => {
    const dataPoint: any = {
      year: year.toString(),
    };

    units.forEach(unit => {
      // Simulate growth over years
      const baseValue = 50000 * (1 + idx * 0.15);
      dataPoint[`${unit}_inv`] = Math.floor(baseValue * (0.9 + Math.random() * 0.2));
      dataPoint[`${unit}_vta`] = Math.floor(baseValue * 0.8 * (0.9 + Math.random() * 0.2));
    });

    return dataPoint;
  });
}


export function YearOverYearComparison({  years, selectedUnits }: YearOverYearComparisonProps) {
  if (years.length < 2) {
    return null;
  }

  const data = generateYoYData(years, selectedUnits);

  // Calculate growth rates
  const growthRates = selectedUnits.map(unit => {
    const firstYearVentas = data[0][`${unit}_vta`];
    const lastYearVentas = data[data.length - 1][`${unit}_vta`];
    const growth = ((lastYearVentas - firstYearVentas) / firstYearVentas) * 100;

    return {
      unit,
      growth: parseFloat(growth.toFixed(1)),
      firstYear: firstYearVentas,
      lastYear: lastYearVentas,
    };
  });

  const bestPerformer = [...growthRates].sort((a, b) => b.growth - a.growth)[0];
  const avgGrowth = growthRates.reduce((sum, r) => sum + r.growth, 0) / growthRates.length;

  return (
    <div className="space-y-6">
      {/* Growth Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Crecimiento Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <p className={`text-2xl font-bold ${avgGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {avgGrowth >= 0 ? '+' : ''}{avgGrowth.toFixed(1)}%
              </p>
              <span className="text-xs text-muted-foreground">
                {years[0]} a {years[years.length - 1]}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Mejor Crecimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="default" className="mb-2">{bestPerformer.unit}</Badge>
            <p className={`text-2xl font-bold ${bestPerformer.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {bestPerformer.growth >= 0 ? '+' : ''}{bestPerformer.growth}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Período Analizado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{years.length}</p>
            <p className="text-xs text-muted-foreground">años comparados</p>
          </CardContent>
        </Card>
      </div>

    
      {/* Growth Rates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tasas de Crecimiento por Unidad</CardTitle>
          <p className="text-xs text-muted-foreground">
            Análisis detallado del crecimiento de ventas
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="pb-2 font-medium">Unidad</th>
                  <th className="pb-2 font-medium text-right">{years[0]}</th>
                  <th className="pb-2 font-medium text-right">{years[years.length - 1]}</th>
                  <th className="pb-2 font-medium text-right">Crecimiento</th>
                  <th className="pb-2 font-medium text-right">CAGR</th>
                </tr>
              </thead>
              <tbody>
                {growthRates.map((rate) => {
                  const cagr = Math.pow(rate.lastYear / rate.firstYear, 1 / (years.length - 1)) - 1;
                  const cagrPercent = cagr * 100;

                  return (
                    <tr key={rate.unit} className="border-b last:border-0">
                      <td className="py-3 font-medium">{rate.unit}</td>
                      <td className="py-3 text-right">{formatNumber(rate.firstYear)}</td>
                      <td className="py-3 text-right">{formatNumber(rate.lastYear)}</td>
                      <td className={`py-3 text-right font-medium ${rate.growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                        {rate.growth >= 0 ? '+' : ''}{rate.growth}%
                      </td>
                      <td className="py-3 text-right text-muted-foreground">
                        {cagr >= 0 ? '+' : ''}{cagrPercent.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="mt-4 text-xs text-muted-foreground">
              * CAGR = Tasa de Crecimiento Anual Compuesta
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
