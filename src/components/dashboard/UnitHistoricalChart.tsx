import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UnitHistoricalChartProps {
  tienda?: string;
  selectedUnits: string[];
  years?: number[];
}
 
 

export function UnitHistoricalChart({ selectedUnits }: UnitHistoricalChartProps) {
 
  if (selectedUnits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico por Unidad de Negocio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p className="text-sm">Selecciona al menos una unidad de negocio para ver el histórico</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
     
    </div>
  );
}
