import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { UnidadDetalle } from '@/types/dashboard';
import { formatNumber } from '@/lib/statusUtils';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Info,
  Package,
  DollarSign,
  Target,
  Zap,
} from 'lucide-react';

interface ExecutiveInsightsProps {
  tienda: string;
  units: UnidadDetalle[];
  totalInventario: number;
  totalVentas: number;
  cobertura: number;
}

type InsightType = 'success' | 'warning' | 'danger' | 'info';

interface Insight {
  type: InsightType;
  title: string;
  message: string;
  action?: string;
  priority: number;
  icon: React.ReactNode;
}

export function ExecutiveInsights({
  tienda,
  units,
  totalInventario,
  totalVentas,
  cobertura,
}: ExecutiveInsightsProps) {
  // Calculate insights
  const insights: Insight[] = [];

  // Overall coverage analysis
  if (cobertura < 21) {
    insights.push({
      type: 'danger',
      title: 'Riesgo Crítico de Desabasto',
      message: `${tienda} tiene solo ${cobertura.toFixed(0)} días de cobertura. Se requiere reabastecimiento urgente en las próximas 48-72 horas para evitar ruptura de stock.`,
      action: 'Activar protocolo de emergencia de reabastecimiento',
      priority: 1,
      icon: <AlertTriangle className="h-4 w-4" />,
    });
  } else if (cobertura < 28) {
    insights.push({
      type: 'warning',
      title: 'Cobertura Bajo el Mínimo',
      message: `La cobertura de ${cobertura.toFixed(0)} días está por debajo del estándar óptimo. Planificar reabastecimiento en los próximos 7-10 días.`,
      action: 'Programar orden de compra',
      priority: 2,
      icon: <TrendingDown className="h-4 w-4" />,
    });
  } else if (cobertura > 120) {
    insights.push({
      type: 'warning',
      title: 'Sobreinventario Significativo',
      message: `Con ${cobertura.toFixed(0)} días de cobertura, hay un exceso considerable de inventario. Esto representa costos de almacenamiento innecesarios y capital inmovilizado.`,
      action: 'Considerar promociones o transferencias',
      priority: 2,
      icon: <Package className="h-4 w-4" />,
    });
  }

  // Unit-specific analysis
  units.forEach(unit => {
    if (unit.cobertura < 14) {
      insights.push({
        type: 'danger',
        title: `${unit.unidad}: Stock Crítico`,
        message: `Solo ${unit.cobertura.toFixed(0)} días de cobertura. Riesgo inmediato de agotamiento.`,
        action: `Reabastecimiento urgente de ${unit.unidad}`,
        priority: 1,
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    }

    if (unit.cobertura > 150) {
      insights.push({
        type: 'warning',
        title: `${unit.unidad}: Exceso de Inventario`,
        message: `${unit.cobertura.toFixed(0)} días de cobertura indica sobreinventario. Considerar transferencia a otras tiendas.`,
        action: `Evaluar transferencia de ${formatNumber(Math.floor(unit.inventario * 0.3))} pzs`,
        priority: 3,
        icon: <Package className="h-4 w-4" />,
      });
    }

    // Performance analysis
    const turnoverRate = unit.ventas / unit.inventario;
    if (turnoverRate > 0.5) {
      insights.push({
        type: 'success',
        title: `${unit.unidad}: Alto Rendimiento`,
        message: `Excelente rotación de inventario (${(turnoverRate * 100).toFixed(0)}%). Mantener niveles actuales.`,
        priority: 4,
        icon: <CheckCircle2 className="h-4 w-4" />,
      });
    } else if (turnoverRate < 0.2) {
      insights.push({
        type: 'info',
        title: `${unit.unidad}: Baja Rotación`,
        message: `Rotación de ${(turnoverRate * 100).toFixed(0)}% indica inventario de lenta rotación. Evaluar estrategia de ventas.`,
        action: 'Análisis de precio y promociones',
        priority: 3,
        icon: <Info className="h-4 w-4" />,
      });
    }
  });

  // Revenue opportunity
  const avgCoverage = units.reduce((sum, u) => sum + u.cobertura, 0) / units.length;
  if (avgCoverage > 60) {
    const excessInventory = totalInventario - (totalVentas * 2);
    if (excessInventory > 0) {
      insights.push({
        type: 'info',
        title: 'Oportunidad de Optimización de Capital',
        message: `Aproximadamente ${formatNumber(excessInventory)} piezas de exceso. Optimizar podría liberar capital para inversiones más rentables.`,
        action: 'Revisar estrategia de inventario',
        priority: 3,
        icon: <DollarSign className="h-4 w-4" />,
      });
    }
  }

  // Sort by priority
  insights.sort((a, b) => a.priority - b.priority);

  // Calculate key metrics
  const rotationIndex = (totalVentas / totalInventario) * 100;
  const inventoryEfficiency = (totalVentas / (totalInventario + totalVentas)) * 100;
  const highPerformanceUnits = units.filter(u => u.ventas / u.inventario > 0.4).length;
  const criticalUnits = units.filter(u => u.cobertura < 28).length;
  const bestPerformer = [...units].sort((a, b) => (b.ventas / b.inventario) - (a.ventas / a.inventario))[0];
  const worstPerformer = [...units].sort((a, b) => (a.ventas / a.inventario) - (b.ventas / b.inventario))[0];

  const getAlertVariant = (type: InsightType) => {
    switch (type) {
      case 'danger': return 'destructive';
      case 'warning': return 'default';
      default: return 'default';
    }
  };

  const getInsightColor = (type: InsightType) => {
    switch (type) {
      case 'danger': return 'text-red-600 dark:text-red-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'info': return 'text-blue-600 dark:text-blue-400';
    }
  };

  // Group insights by priority
  const criticalInsights = insights.filter(i => i.priority <= 2);
  const normalInsights = insights.filter(i => i.priority > 2);

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Índice de Rotación</p>
                <p className="text-2xl font-bold">{rotationIndex.toFixed(1)}%</p>
                <div className="flex items-center gap-1 text-xs">
                  {rotationIndex > 40 ? (
                    <>
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">Excelente</span>
                    </>
                  ) : rotationIndex > 25 ? (
                    <>
                      <Target className="h-3 w-3 text-blue-600" />
                      <span className="text-blue-600">Bueno</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3 text-yellow-600" />
                      <span className="text-yellow-600">Mejorable</span>
                    </>
                  )}
                </div>
              </div>
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Eficiencia de Inventario</p>
                <p className="text-2xl font-bold">{inventoryEfficiency.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Ratio venta/stock</p>
              </div>
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
                <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Alto Rendimiento</p>
                <p className="text-2xl font-bold">{highPerformanceUnits}/{units.length}</p>
                <p className="text-xs text-muted-foreground">Unidades con rotación {'>'}40%</p>
              </div>
              <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-3">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Unidades en Riesgo</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{criticalUnits}</p>
                <p className="text-xs text-muted-foreground">Cobertura {'<'} 28 días</p>
              </div>
              <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts Section */}
      {criticalInsights.length > 0 && (
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="bg-red-50 dark:bg-red-900/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <CardTitle className="text-red-900 dark:text-red-100">Alertas Críticas</CardTitle>
              </div>
              <Badge variant="destructive">{criticalInsights.length}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Requieren acción inmediata
            </p>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            {criticalInsights.map((insight, idx) => (
              <Alert key={idx} variant={getAlertVariant(insight.type)} className="border-l-4">
                <div className={getInsightColor(insight.type)}>{insight.icon}</div>
                <AlertTitle className="mb-1">{insight.title}</AlertTitle>
                <AlertDescription>
                  <p className="text-sm mb-2">{insight.message}</p>
                  {insight.action && (
                    <div className="mt-3 pt-3 border-t flex items-start gap-2">
                      <Target className="h-4 w-4 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold">Acción Recomendada</p>
                        <p className="text-xs">{insight.action}</p>
                      </div>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* General Insights & Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Insights y Recomendaciones</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Análisis de rendimiento y oportunidades de mejora
              </p>
            </div>
            {normalInsights.length > 0 && (
              <Badge variant="outline">{normalInsights.length} insights</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {normalInsights.length === 0 && criticalInsights.length === 0 ? (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Todo en Orden</AlertTitle>
              <AlertDescription>
                Todos los indicadores están dentro de los rangos óptimos. Continuar monitoreando el rendimiento.
              </AlertDescription>
            </Alert>
          ) : normalInsights.length === 0 ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Atención a Alertas Críticas</AlertTitle>
              <AlertDescription>
                Enfocarse en resolver las alertas críticas antes de continuar con otras optimizaciones.
              </AlertDescription>
            </Alert>
          ) : (
            normalInsights.map((insight, idx) => (
              <Alert key={idx} variant={getAlertVariant(insight.type)}>
                <div className={getInsightColor(insight.type)}>{insight.icon}</div>

                <AlertTitle className='ml-5'>{insight.title}</AlertTitle>
                <AlertDescription>
                  <p className="text-sm mb-2">{insight.message}</p>
                  {insight.action && (
                    <div className="mt-2 pt-2 border-t flex items-start gap-2 text-xs">
                      <span className="font-medium">💡 Acción:</span>
                      <span>{insight.action}</span>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ))
          )}
        </CardContent>
      </Card>

      {/* Performance Benchmarks */}
      <Card>
        <CardHeader>
          <CardTitle>Benchmarks de Rendimiento</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Comparativa de unidades de negocio
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Best Performer */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-2">
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-sm">Mejor Rendimiento</h3>
              </div>
              <div className="pl-10 space-y-2">
                <p className="text-2xl font-bold">{bestPerformer.unidad}</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rotación:</span>
                    <span className="font-semibold text-green-600">
                      {((bestPerformer.ventas / bestPerformer.inventario) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ventas:</span>
                    <span className="font-medium">{formatNumber(bestPerformer.ventas)} pzs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cobertura:</span>
                    <span className="font-medium">{bestPerformer.cobertura.toFixed(0)} días</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Worst Performer */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-2">
                  <TrendingDown className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-sm">Requiere Atención</h3>
              </div>
              <div className="pl-10 space-y-2">
                <p className="text-2xl font-bold">{worstPerformer.unidad}</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rotación:</span>
                    <span className="font-semibold text-orange-600">
                      {((worstPerformer.ventas / worstPerformer.inventario) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ventas:</span>
                    <span className="font-medium">{formatNumber(worstPerformer.ventas)} pzs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cobertura:</span>
                    <span className="font-medium">{worstPerformer.cobertura.toFixed(0)} días</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
