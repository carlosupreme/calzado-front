import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  AlertCircle,
  Package,
  Warehouse,
  ShoppingCart,
  Clock,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { formatNumber } from '@/lib/statusUtils';

interface ProductRestockAnalysisProps {
  tienda: string;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  warehouseStock: number;
  salesLast30Days: number;
  dailyAverageSales: number;
  daysUntilStockout: number;
  restockPriority: 'urgent' | 'high' | 'medium' | 'low';
  recommendedRestock: number;
  sellThroughRate: number; // percentage
}

// Generate mock product data for a store
function generateProductData(tienda: string): Product[] {
  console.log(tienda);
  const categories = ['Dama', 'Caballero', 'Niño', 'Accesorios'];
  const products: Product[] = [];

  const productTemplates = [
    { name: 'Tenis Deportivo', baseStock: 80, baseSales: 4.5 },
    { name: 'Zapatilla Casual', baseStock: 120, baseSales: 3.8 },
    { name: 'Bota Casual', baseStock: 60, baseSales: 2.2 },
    { name: 'Sandalia Confort', baseStock: 90, baseSales: 5.1 },
    { name: 'Zapato Formal', baseStock: 70, baseSales: 2.8 },
    { name: 'Tenis Casual', baseStock: 150, baseSales: 6.2 },
    { name: 'Botín Moda', baseStock: 55, baseSales: 3.4 },
    { name: 'Huarache Tradicional', baseStock: 40, baseSales: 1.8 },
    { name: 'Zapatilla Running', baseStock: 85, baseSales: 4.7 },
    { name: 'Chancla Playa', baseStock: 200, baseSales: 8.5 },
    { name: 'Zapato Escolar', baseStock: 110, baseSales: 5.5 },
    { name: 'Bota Trabajo', baseStock: 45, baseSales: 1.9 },
  ];

  productTemplates.forEach((template, idx) => {
    categories.forEach((category, catIdx) => {
      const variation = Math.random() * 0.4 + 0.8; // 0.8 to 1.2
      const dailySales = template.baseSales * variation;
      const currentStock = Math.floor(template.baseStock * variation);
      const warehouseStock = Math.floor(currentStock * (1.5 + Math.random() * 2));
      const salesLast30Days = Math.floor(dailySales * 30);
      const daysUntilStockout = currentStock / dailySales;
      const sellThroughRate = (salesLast30Days / (currentStock + salesLast30Days)) * 100;

      let restockPriority: 'urgent' | 'high' | 'medium' | 'low';
      if (daysUntilStockout < 5) restockPriority = 'urgent';
      else if (daysUntilStockout < 10) restockPriority = 'high';
      else if (daysUntilStockout < 20) restockPriority = 'medium';
      else restockPriority = 'low';

      const recommendedRestock = Math.ceil(dailySales * 30); // 30 days worth

      products.push({
        id: `${category.toLowerCase()}-${idx}-${catIdx}`,
        sku: `CAL-${category.substring(0, 3).toUpperCase()}-${String(idx * 100 + catIdx).padStart(4, '0')}`,
        name: `${template.name} ${category}`,
        category,
        currentStock,
        warehouseStock,
        salesLast30Days,
        dailyAverageSales: parseFloat(dailySales.toFixed(1)),
        daysUntilStockout: parseFloat(daysUntilStockout.toFixed(1)),
        restockPriority,
        recommendedRestock,
        sellThroughRate: parseFloat(sellThroughRate.toFixed(1)),
      });
    });
  });

  return products.sort((a, b) => a.daysUntilStockout - b.daysUntilStockout);
}

export function ProductRestockAnalysis({ tienda }: ProductRestockAnalysisProps) {
  const products = generateProductData(tienda);

  const urgentProducts = products.filter(p => p.restockPriority === 'urgent');
  const highPriorityProducts = products.filter(p => p.restockPriority === 'high');
  const bestSellers = [...products].sort((a, b) => b.salesLast30Days - a.salesLast30Days).slice(0, 10);
  const slowMovers = [...products].sort((a, b) => a.sellThroughRate - b.sellThroughRate).slice(0, 5);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gestión de Inventario por Producto</h2>
        <p className="text-muted-foreground">
          Análisis de productos, reabastecimiento prioritario y detección de best sellers
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Productos Críticos</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{urgentProducts.length}</p>
                <p className="text-xs text-muted-foreground">Requieren acción inmediata</p>
              </div>
              <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Alta Prioridad</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{highPriorityProducts.length}</p>
                <p className="text-xs text-muted-foreground">Reabastecer pronto</p>
              </div>
              <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-3">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Total Productos</p>
                <p className="text-2xl font-bold">{products.length}</p>
                <p className="text-xs text-muted-foreground">En catálogo activo</p>
              </div>
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3">
                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Disponible en Almacén</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatNumber(products.reduce((sum, p) => sum + p.warehouseStock, 0))}
                </p>
                <p className="text-xs text-muted-foreground">Piezas totales</p>
              </div>
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
                <Warehouse className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Restocking Needs */}
      {urgentProducts.length > 0 && (
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="bg-red-50 dark:bg-red-900/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <CardTitle className="text-red-900 dark:text-red-100">
                  Reabastecimiento Urgente
                </CardTitle>
              </div>
              <Badge variant="destructive">{urgentProducts.length} productos</Badge>
            </div>
            <CardDescription>Productos con menos de 5 días de inventario disponible</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {urgentProducts.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{product.name}</p>
                      <Badge variant="outline" className="text-xs">{product.sku}</Badge>
                      <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-muted-foreground">
                      <div>
                        <span className="font-medium">Stock actual:</span> {formatNumber(product.currentStock)} pzs
                      </div>
                      <div>
                        <span className="font-medium">En almacén:</span> {formatNumber(product.warehouseStock)} pzs
                      </div>
                      <div>
                        <span className="font-medium">Días restantes:</span>{' '}
                        <span className="text-red-600 dark:text-red-400 font-semibold">
                          {product.daysUntilStockout.toFixed(1)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Venta diaria:</span> {product.dailyAverageSales} pzs/día
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Reabastecer</p>
                      <p className="text-lg font-bold text-primary">{formatNumber(product.recommendedRestock)}</p>
                      <p className="text-xs text-muted-foreground">piezas</p>
                    </div>
                    <Button size="sm" className="shrink-0">
                      <Package className="h-4 w-4 mr-1" />
                      Solicitar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Best Sellers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Top 10 Best Sellers
              </CardTitle>
              <CardDescription>Productos con mayor volumen de ventas (últimos 30 días)</CardDescription>
            </div>
            <Badge variant="outline">Últimos 30 días</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {bestSellers.map((product, idx) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                  #{idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm truncate">{product.name}</p>
                    <Badge variant="secondary" className="text-xs shrink-0">{product.category}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ShoppingCart className="h-3 w-3" />
                      {formatNumber(product.salesLast30Days)} ventas
                    </span>
                    <span>SKU: {product.sku}</span>
                    <span className={`font-semibold ${
                      product.daysUntilStockout < 10 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {product.daysUntilStockout.toFixed(0)} días de stock
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Sell-through</p>
                    <p className="text-sm font-bold">{product.sellThroughRate}%</p>
                  </div>
                  <Badge className={getPriorityColor(product.restockPriority)}>
                    {product.restockPriority === 'urgent' ? 'Urgente' :
                     product.restockPriority === 'high' ? 'Alta' :
                     product.restockPriority === 'medium' ? 'Media' : 'Baja'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Products - Prioritized Restocking List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista Completa de Reabastecimiento Prioritario</CardTitle>
              <CardDescription>
                Todos los productos ordenados por prioridad de reabastecimiento
              </CardDescription>
            </div>
            <Button variant="outline">
              Exportar Lista
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="pb-3 font-medium">Prioridad</th>
                  <th className="pb-3 font-medium">Producto</th>
                  <th className="pb-3 font-medium">SKU</th>
                  <th className="pb-3 font-medium">Categoría</th>
                  <th className="pb-3 font-medium text-right">Stock Actual</th>
                  <th className="pb-3 font-medium text-right">En Almacén</th>
                  <th className="pb-3 font-medium text-right">Días Restantes</th>
                  <th className="pb-3 font-medium text-right">Ventas (30d)</th>
                  <th className="pb-3 font-medium text-right">Reabastecer</th>
                  <th className="pb-3 font-medium">Acción</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 20).map((product) => (
                  <tr key={product.id} className="border-b last:border-0 hover:bg-accent">
                    <td className="py-3">
                      <Badge
                        variant={getPriorityBadgeVariant(product.restockPriority)}
                        className="text-xs"
                      >
                        {product.restockPriority === 'urgent' ? 'Urgente' :
                         product.restockPriority === 'high' ? 'Alta' :
                         product.restockPriority === 'medium' ? 'Media' : 'Baja'}
                      </Badge>
                    </td>
                    <td className="py-3 font-medium">{product.name}</td>
                    <td className="py-3 text-muted-foreground">{product.sku}</td>
                    <td className="py-3">
                      <Badge variant="outline" className="text-xs">{product.category}</Badge>
                    </td>
                    <td className="py-3 text-right">{formatNumber(product.currentStock)}</td>
                    <td className="py-3 text-right text-muted-foreground">{formatNumber(product.warehouseStock)}</td>
                    <td className={`py-3 text-right font-semibold ${
                      product.daysUntilStockout < 5 ? 'text-red-600' :
                      product.daysUntilStockout < 10 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {product.daysUntilStockout.toFixed(1)}
                    </td>
                    <td className="py-3 text-right">{formatNumber(product.salesLast30Days)}</td>
                    <td className="py-3 text-right font-semibold text-primary">
                      {formatNumber(product.recommendedRestock)}
                    </td>
                    <td className="py-3">
                      <Button size="sm" variant="ghost" className="h-8">
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length > 20 && (
              <div className="mt-4 text-center">
                <Button variant="outline">
                  Ver todos los {products.length} productos
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Slow Movers Alert */}
      {slowMovers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-yellow-600" />
              Productos de Baja Rotación
            </CardTitle>
            <CardDescription>
              Productos con bajo índice de venta que podrían requerir estrategias especiales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {slowMovers.map((product) => (
                <div key={product.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">{product.name}</p>
                    <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Sell-through:</span>{' '}
                      <span className="font-semibold text-yellow-600">{product.sellThroughRate}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Stock:</span>{' '}
                      <span className="font-medium">{formatNumber(product.currentStock)} pzs</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ventas 30d:</span>{' '}
                      <span className="font-medium">{formatNumber(product.salesLast30Days)} pzs</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cobertura:</span>{' '}
                      <span className="font-medium">{product.daysUntilStockout.toFixed(0)} días</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    💡 Considerar promociones o transferencia a otras tiendas
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
