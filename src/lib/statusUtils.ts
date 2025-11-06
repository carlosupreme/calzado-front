import type { TiendaStatus } from '@/types/dashboard';

export function getStatusColor(status: TiendaStatus): string {
  switch (status) {
    case 'CRÍTICO':
      return 'destructive';
    case 'ÓPTIMO':
      return 'default';
    case 'SOBREINVENTARIO':
      return 'secondary';
    case 'SIN VENTAS':
      return 'outline';
    default:
      return 'default';
  }
}

export function getStatusBgColor(status: TiendaStatus): string {
  switch (status) {
    case 'CRÍTICO':
      return 'bg-red-50 dark:bg-red-950';
    case 'ÓPTIMO':
      return 'bg-green-50 dark:bg-green-950';
    case 'SOBREINVENTARIO':
      return 'bg-yellow-50 dark:bg-yellow-950';
    case 'SIN VENTAS':
      return 'bg-gray-50 dark:bg-gray-950';
    default:
      return '';
  }
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-MX').format(num);
}

export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(num);
}
