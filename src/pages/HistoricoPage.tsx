import { useState } from 'react';
import { HistoricoChart } from '@/components/dashboard/HistoricoChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function HistoricoPage() {
  const [year, setYear] = useState(2024);
  const years = [2023, 2024, 2025];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Datos Históricos</h1>
          <p className="text-muted-foreground">
            Análisis de tendencias históricas consolidadas
          </p>
        </div>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Seleccionar Año</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            {years.map((y) => (
              <Button
                key={y}
                variant={y === year ? 'default' : 'outline'}
                size="sm"
                onClick={() => setYear(y)}
              >
                {y}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      <HistoricoChart params={{ year }} />
    </div>
  );
}
