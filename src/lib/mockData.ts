import type { TiendaResumen, EmpleadoResumen, EmpleadoPerformance } from '@/types/dashboard';

// Generate mock data based on real data patterns
export function generateTrendData(currentValue: number): {
  previousValue: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
} {
  // Random change between -15% and +15%
  const changePercent = (Math.random() * 30 - 15);
  const change = currentValue * (changePercent / 100);
  const previousValue = currentValue - change;

  return {
    previousValue,
    change,
    changePercent,
    trend: changePercent > 2 ? 'up' : changePercent < -2 ? 'down' : 'stable',
  };
}

export function generateSalesVelocity(tiendas: TiendaResumen[]) {
  // Mock daily sales data for the last 30 days
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));

    const totalSales = tiendas.reduce((sum, t) => sum + t.ventas, 0);
    const dailyAvg = totalSales / 30;
    const variance = dailyAvg * 0.3; // 30% variance

    return {
      date: date.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }),
      ventas: Math.floor(dailyAvg + (Math.random() * variance * 2 - variance)),
      meta: Math.floor(dailyAvg * 1.1), // 10% above average as target
    };
  });
}

export function generateCoverageDistribution(tiendas: TiendaResumen[]) {
  const ranges = [
    { name: '<14 días', min: 0, max: 14, count: 0, color: 'hsl(0 84% 60%)' },
    { name: '14-28 días', min: 14, max: 28, count: 0, color: 'hsl(25 95% 53%)' },
    { name: '28-60 días', min: 28, max: 60, count: 0, color: 'hsl(142 76% 36%)' },
    { name: '60-90 días', min: 60, max: 90, count: 0, color: 'hsl(142 76% 56%)' },
    { name: '>90 días', min: 90, max: Infinity, count: 0, color: 'hsl(48 96% 53%)' },
  ];

  tiendas.forEach(tienda => {
    const range = ranges.find(r => tienda.cobertura >= r.min && tienda.cobertura < r.max);
    if (range) range.count++;
  });

  return ranges;
}

export function generateBusinessUnitData(tiendas: TiendaResumen[]) {
  // Mock business unit distribution based on typical retail patterns
  const units = ['Dama', 'Caballero', 'Niño', 'Accesorios'];
  const totalInventario = tiendas.reduce((sum, t) => sum + t.inventario, 0);
  const totalVentas = tiendas.reduce((sum, t) => sum + t.ventas, 0);

  return units.map(unit => {
    // Generate realistic distribution percentages
    const inventarioPercent = Math.random() * 0.3 + 0.2; // 20-50%
    const ventasPercent = Math.random() * 0.3 + 0.2;

    const inventario = Math.floor(totalInventario * inventarioPercent);
    const ventas = Math.floor(totalVentas * ventasPercent);
    const cobertura = ventas > 0 ? (inventario / ventas) * 30 : 0;

    return {
      unidad: unit,
      inventario,
      ventas,
      cobertura: parseFloat(cobertura.toFixed(1)),
      inventarioPercent: parseFloat((inventarioPercent * 100).toFixed(1)),
      ventasPercent: parseFloat((ventasPercent * 100).toFixed(1)),
    };
  });
}

export function generateStockTransferSuggestions(tiendas: TiendaResumen[]) {
  const suggestions: Array<{
    fromStore: string;
    toStore: string;
    unidad: string;
    cantidad: number;
    priority: 'high' | 'medium' | 'low';
    reason: string;
  }> = [];

  const overstocked = tiendas.filter(t => t.cobertura > 90);
  const understocked = tiendas.filter(t => t.cobertura < 28);

  const units = ['Dama', 'Caballero', 'Niño'];

  // Generate 5-8 transfer suggestions
  const count = Math.min(5, Math.min(overstocked.length, understocked.length));

  for (let i = 0; i < count; i++) {
    if (overstocked[i] && understocked[i]) {
      const cantidad = Math.floor(Math.random() * 500 + 200);
      const unit = units[Math.floor(Math.random() * units.length)];

      suggestions.push({
        fromStore: overstocked[i].tienda,
        toStore: understocked[i].tienda,
        unidad: unit,
        cantidad,
        priority: understocked[i].cobertura < 14 ? 'high' : understocked[i].cobertura < 21 ? 'medium' : 'low',
        reason: `Optimizar cobertura: ${overstocked[i].cobertura.toFixed(0)} días → ${understocked[i].cobertura.toFixed(0)} días`,
      });
    }
  }

  return suggestions;
}

export function generateRestockRecommendations(tiendas: TiendaResumen[]) {
  const critical = tiendas.filter(t => t.cobertura < 28);
  const units = ['Dama', 'Caballero', 'Niño', 'Accesorios'];

  return critical.flatMap(tienda => {
    // Generate 1-3 restock recommendations per critical store
    const count = Math.floor(Math.random() * 3) + 1;

    return Array.from({ length: count }, () => {
      const unit = units[Math.floor(Math.random() * units.length)];
      const cantidad = Math.floor(Math.random() * 1000 + 500);
      const urgency = tienda.cobertura < 14 ? 'urgent' : 'high';

      return {
        tienda: tienda.tienda,
        unidad: unit,
        cantidadActual: Math.floor(tienda.inventario * (Math.random() * 0.3 + 0.2)),
        cantidadRecomendada: cantidad,
        cobertura: tienda.cobertura,
        urgency,
        estimatedStockoutDays: Math.floor(tienda.cobertura),
      };
    });
  }).slice(0, 10); // Limit to top 10
}

export function generateAlerts(tiendas: TiendaResumen[]) {
  const alerts: Array<{
    id: string;
    type: 'critical' | 'warning' | 'info';
    title: string;
    message: string;
    tienda?: string;
    timestamp: Date;
    action?: string;
  }> = [];

  // Critical inventory alerts
  tiendas.forEach(tienda => {
    if (tienda.cobertura < 14) {
      alerts.push({
        id: `critical-${tienda.tienda}`,
        type: 'critical',
        title: 'Inventario Crítico',
        message: `${tienda.tienda} tiene solo ${tienda.cobertura.toFixed(0)} días de cobertura`,
        tienda: tienda.tienda,
        timestamp: new Date(),
        action: 'Reabastecer urgente',
      });
    }

    if (tienda.cobertura > 120) {
      alerts.push({
        id: `overstock-${tienda.tienda}`,
        type: 'warning',
        title: 'Sobreinventario Alto',
        message: `${tienda.tienda} tiene ${tienda.cobertura.toFixed(0)} días de cobertura`,
        tienda: tienda.tienda,
        timestamp: new Date(),
        action: 'Considerar transferencia',
      });
    }
  });

  // Add some system alerts
  alerts.push({
    id: 'system-1',
    type: 'info',
    title: 'Actualización de Datos',
    message: 'Los datos fueron actualizados hace 2 horas',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  });

  return alerts.slice(0, 10).sort((a, b) => {
    const typeOrder = { critical: 0, warning: 1, info: 2 };
    return typeOrder[a.type] - typeOrder[b.type];
  });
}

export function generateInventoryTurnover(tiendas: TiendaResumen[]) {
  return tiendas.map(tienda => {
    // Turnover rate: Sales / Average Inventory (annualized)
    const turnoverRate = tienda.ventas > 0 ? (tienda.ventas * 12) / tienda.inventario : 0;

    return {
      tienda: tienda.tienda,
      turnoverRate: parseFloat(turnoverRate.toFixed(2)),
      daysToSell: tienda.cobertura,
      status: turnoverRate > 4 ? 'excellent' : turnoverRate > 2 ? 'good' : 'poor',
    };
  });
}

export function generateMonthOverMonthComparison() {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May'];

  return months.map((month) => {
    const baseInventario = 95000 + (Math.random() * 10000 - 5000);
    const baseVentas = 78000 + (Math.random() * 8000 - 4000);

    return {
      mes: month,
      inventario: Math.floor(baseInventario),
      ventas: Math.floor(baseVentas),
      crecimientoInventario: parseFloat(((Math.random() * 20 - 10)).toFixed(1)),
      crecimientoVentas: parseFloat(((Math.random() * 20 - 10)).toFixed(1)),
    };
  });
}

export function generateMockEmpleados(): EmpleadoResumen[] {
  const nombres = [
    'Juan Pérez',
    'María García',
    'Carlos López',
    'Ana Martínez',
    'Luis Rodríguez',
    'Carmen Hernández',
    'José González',
    'Laura Sánchez',
    'Miguel Ramírez',
    'Isabel Torres',
    'Francisco Flores',
    'Patricia Morales',
    'Antonio Jiménez',
    'Rosa Ruiz',
    'Manuel Castro',
  ];

  return nombres.map((nombre) => {
    const ventas = Math.floor(Math.random() * 8000 + 2000);
    const inventario = Math.floor(Math.random() * 12000 + 3000);
    const cobertura = ventas > 0 ? (inventario / ventas) * 30 : 0;

    // Determine status based on coverage
    let status: 'CRÍTICO' | 'ÓPTIMO' | 'SOBREINVENTARIO' | 'SIN VENTAS';
    if (ventas === 0) {
      status = 'SIN VENTAS';
    } else if (cobertura < 28) {
      status = 'CRÍTICO';
    } else if (cobertura > 90) {
      status = 'SOBREINVENTARIO';
    } else {
      status = 'ÓPTIMO';
    }

    return {
      empleado: nombre,
      inventario,
      ventas,
      cobertura: parseFloat(cobertura.toFixed(1)),
      status,
    };
  });
}

export function generateMockEmpleadosPerformance(): EmpleadoPerformance[] {
  const nombres = [
    'Juan Pérez',
    'María García',
    'Carlos López',
    'Ana Martínez',
    'Luis Rodríguez',
    'Carmen Hernández',
    'José González',
    'Laura Sánchez',
    'Miguel Ramírez',
    'Isabel Torres',
    'Francisco Flores',
    'Patricia Morales',
    'Antonio Jiménez',
    'Rosa Ruiz',
    'Manuel Castro',
    'Diego Moreno',
    'Sofia Vargas',
    'Roberto Mendoza',
    'Claudia Reyes',
    'Fernando Silva',
  ];

  const tiendas = ['Tienda 1', 'Tienda 10', 'Tienda 12', 'Tienda 5', 'Tienda 2'];

  const empleados = nombres.map((nombre, index) => {
    const num_ventas = Math.floor(Math.random() * 80 + 20); // 20-100 sales
    const ticket_promedio = Math.floor(Math.random() * 800 + 400); // $400-$1200
    const ventas_totales = num_ventas * ticket_promedio;
    const comision = ventas_totales * 0.03; // 3% commission
    const satisfaccion_cliente = parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)); // 3.5-5.0
    const tasa_conversion = parseFloat((Math.random() * 30 + 15).toFixed(1)); // 15-45%
    const unidades_vendidas = Math.floor(num_ventas * (Math.random() * 1.5 + 1)); // 1-2.5 units per sale
    const devoluciones = Math.floor(num_ventas * (Math.random() * 0.1)); // 0-10% returns

    return {
      empleado: nombre,
      tienda: tiendas[index % tiendas.length],
      ventas_totales,
      num_ventas,
      ticket_promedio,
      comision: Math.floor(comision),
      satisfaccion_cliente,
      tasa_conversion,
      unidades_vendidas,
      devoluciones,
      ranking: 0, // Will be calculated after sorting
    };
  });

  // Sort by sales and assign ranking
  empleados.sort((a, b) => b.ventas_totales - a.ventas_totales);
  empleados.forEach((emp, index) => {
    emp.ranking = index + 1;
  });

  return empleados;
}

export function generateEmpleadosSalesOverTime() {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
  const topEmpleados = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 'Luis Rodríguez'];

  return months.map((mes) => {
    const dataPoint: Record<string, string | number> = { mes };
    
    topEmpleados.forEach((emp) => {
      dataPoint[emp] = Math.floor(Math.random() * 30000 + 40000); // $40k-$70k
    });

    return dataPoint;
  });
}

export function generateEmpleadosMetrics() {
  const empleados = generateMockEmpleadosPerformance();
  
  const totalVentas = empleados.reduce((sum, emp) => sum + emp.ventas_totales, 0);
  const totalComisiones = empleados.reduce((sum, emp) => sum + emp.comision, 0);
  const avgTicket = empleados.reduce((sum, emp) => sum + emp.ticket_promedio, 0) / empleados.length;
  const avgConversion = empleados.reduce((sum, emp) => sum + emp.tasa_conversion, 0) / empleados.length;
  const avgSatisfaccion = empleados.reduce((sum, emp) => sum + emp.satisfaccion_cliente, 0) / empleados.length;
  const totalUnidades = empleados.reduce((sum, emp) => sum + emp.unidades_vendidas, 0);

  return {
    total_empleados: empleados.length,
    ventas_totales: totalVentas,
    comisiones_totales: Math.floor(totalComisiones),
    ticket_promedio: Math.floor(avgTicket),
    tasa_conversion_promedio: parseFloat(avgConversion.toFixed(1)),
    satisfaccion_promedio: parseFloat(avgSatisfaccion.toFixed(1)),
    unidades_vendidas: totalUnidades,
  };
}
