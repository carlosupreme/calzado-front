import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  MessageSquare,
  PackagePlus,
  PackageMinus,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Warehouse,
  Store,
  ArrowRight,
  MessagesSquare,
} from 'lucide-react';
import { formatNumber } from '@/lib/statusUtils';

interface EmployeeRequestPanelProps {
  tienda: string;
}

type RequestType = 'warehouse-to-store' | 'store-to-warehouse' | 'store-to-store';
type RequestStatus = 'pending' | 'approved' | 'in-progress' | 'completed' | 'rejected';
type RequestPriority = 'urgent' | 'high' | 'normal' | 'low';

interface Request {
  id: string;
  type: RequestType;
  from: string;
  to: string;
  product: string;
  sku: string;
  quantity: number;
  priority: RequestPriority;
  status: RequestStatus;
  requestedBy: string;
  requestDate: string;
  message: string;
  responses?: Array<{
    from: string;
    message: string;
    timestamp: string;
  }>;
}

// Mock data for recent requests
function generateMockRequests(tienda: string): Request[] {
  return [
    {
      id: 'REQ-001',
      type: 'warehouse-to-store',
      from: 'Almacén Central',
      to: tienda,
      product: 'Tenis Deportivo Dama',
      sku: 'CAL-DAM-0001',
      quantity: 50,
      priority: 'urgent',
      status: 'in-progress',
      requestedBy: 'María García',
      requestDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      message: 'Stock crítico, necesitamos urgente para el fin de semana',
      responses: [
        {
          from: 'Juan López (Almacén)',
          message: 'Preparando el pedido, listo para envío mañana',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        },
      ],
    },
    {
      id: 'REQ-002',
      type: 'store-to-warehouse',
      from: tienda,
      to: 'Almacén Central',
      product: 'Sandalia Confort Caballero',
      sku: 'CAL-CAB-0103',
      quantity: 30,
      priority: 'normal',
      status: 'approved',
      requestedBy: 'Carlos Mendoza',
      requestDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      message: 'Exceso de inventario, baja rotación en nuestra tienda',
      responses: [
        {
          from: 'Ana Torres (Almacén)',
          message: 'Aprobado, recogeremos el lunes',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        },
      ],
    },
    {
      id: 'REQ-003',
      type: 'warehouse-to-store',
      from: 'Almacén Central',
      to: tienda,
      product: 'Zapato Escolar Niño',
      sku: 'CAL-NIÑ-0206',
      quantity: 80,
      priority: 'high',
      status: 'completed',
      requestedBy: 'Laura Ramírez',
      requestDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      message: 'Temporada de regreso a clases',
    },
  ];
}

export function EmployeeRequestPanel({ tienda }: EmployeeRequestPanelProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState<RequestType | null>(null);
  const [requests] = useState<Request[]>(generateMockRequests(tienda));

  const [formData, setFormData] = useState({
    product: '',
    sku: '',
    quantity: '',
    priority: 'normal' as RequestPriority,
    message: '',
    destination: '',
  });

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'approved':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'in-progress':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
    }
  };

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: RequestPriority) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'default';
      case 'normal':
        return 'secondary';
      case 'low':
        return 'outline';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  };

  const handleOpenDialog = (type: RequestType) => {
    setSelectedRequestType(type);
    setFormData({
      product: '',
      sku: '',
      quantity: '',
      priority: 'normal',
      message: '',
      destination: type === 'warehouse-to-store' ? 'Almacén Central' : '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmitRequest = () => {
    // In real app, would submit to API
    console.log('Submitting request:', { type: selectedRequestType, ...formData });
    setIsDialogOpen(false);
  };

  const getDialogTitle = () => {
    switch (selectedRequestType) {
      case 'warehouse-to-store':
        return 'Solicitar Productos del Almacén';
      case 'store-to-warehouse':
        return 'Enviar Productos al Almacén';
      case 'store-to-store':
        return 'Transferir a Otra Tienda';
      default:
        return 'Nueva Solicitud';
    }
  };

  const getDialogDescription = () => {
    switch (selectedRequestType) {
      case 'warehouse-to-store':
        return 'Solicita productos del almacén central para reabastecer tu tienda';
      case 'store-to-warehouse':
        return 'Envía productos de baja rotación o exceso de inventario al almacén';
      case 'store-to-store':
        return 'Transfiere productos a otra tienda que los necesite';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <MessagesSquare className="h-7 w-7 text-primary" />
          Centro de Comunicación de Empleados
        </h2>
        <p className="text-muted-foreground mt-1">
          Solicita y gestiona transferencias de productos de forma rápida y eficiente
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          className="cursor-pointer hover:shadow-lg transition-all hover:border-primary group"
          onClick={() => handleOpenDialog('warehouse-to-store')}
        >
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4 group-hover:bg-green-200 dark:group-hover:bg-green-900/30 transition-colors">
                <PackagePlus className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Solicitar del Almacén</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Pide productos para reabastecer tu tienda
                </p>
              </div>
              <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                <Warehouse className="h-4 w-4 mr-2" />
                Solicitar Ahora
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all hover:border-primary group"
          onClick={() => handleOpenDialog('store-to-warehouse')}
        >
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-4 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/30 transition-colors">
                <PackageMinus className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Enviar al Almacén</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Devuelve exceso o productos de baja rotación
                </p>
              </div>
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
                <Store className="h-4 w-4 mr-2" />
                Enviar Ahora
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all hover:border-primary group"
          onClick={() => handleOpenDialog('store-to-store')}
        >
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30 transition-colors">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Transferir a Tienda</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Comparte inventario con otras sucursales
                </p>
              </div>
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
                <ArrowRight className="h-4 w-4 mr-2" />
                Transferir Ahora
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Solicitudes Recientes
              </CardTitle>
              <CardDescription>Historial de tus últimas solicitudes y su estado</CardDescription>
            </div>
            <Badge variant="outline">{requests.length} activas</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="p-4 border rounded-lg hover:bg-accent transition-colors space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getPriorityColor(request.priority)} className="text-xs">
                        {request.priority === 'urgent' ? 'Urgente' :
                         request.priority === 'high' ? 'Alta' :
                         request.priority === 'normal' ? 'Normal' : 'Baja'}
                      </Badge>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1">
                          {request.status === 'pending' ? 'Pendiente' :
                           request.status === 'approved' ? 'Aprobada' :
                           request.status === 'in-progress' ? 'En Proceso' :
                           request.status === 'completed' ? 'Completada' : 'Rechazada'}
                        </span>
                      </Badge>
                      <span className="text-xs text-muted-foreground">#{request.id}</span>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{request.product}</h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>SKU: {request.sku}</span>
                      <span>•</span>
                      <span className="font-medium">{formatNumber(request.quantity)} piezas</span>
                      <span>•</span>
                      <span>{getTimeAgo(request.requestDate)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="font-medium">{request.from}</span>
                      <ArrowRight className="h-3 w-3" />
                      <span className="font-medium">{request.to}</span>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="pl-4 border-l-2 border-muted">
                  <p className="text-sm text-muted-foreground italic">"{request.message}"</p>
                  <p className="text-xs text-muted-foreground mt-1">— {request.requestedBy}</p>
                </div>

                {/* Responses */}
                {request.responses && request.responses.length > 0 && (
                  <div className="space-y-2">
                    {request.responses.map((response, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="rounded-full bg-primary/10 p-2 shrink-0">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="text-xs font-semibold">{response.from}</p>
                            <span className="text-xs text-muted-foreground">
                              {getTimeAgo(response.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm">{response.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Responder
                  </Button>
                  {request.status === 'pending' && (
                    <Button size="sm" variant="ghost" className="text-xs text-red-600 hover:text-red-700">
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>{getDialogDescription()}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Product Selection */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Producto</label>
                <input
                  type="text"
                  placeholder="Nombre del producto"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">SKU</label>
                <input
                  type="text"
                  placeholder="CAL-XXX-0000"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </div>
            </div>

            {/* Quantity and Priority */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cantidad</label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Prioridad</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as RequestPriority })}
                >
                  <option value="low">Baja</option>
                  <option value="normal">Normal</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
            </div>

            {/* Destination (for store-to-store) */}
            {selectedRequestType === 'store-to-store' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Tienda Destino</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                >
                  <option value="">Selecciona una tienda</option>
                  <option value="Centro">Centro</option>
                  <option value="Norte">Norte</option>
                  <option value="Sur">Sur</option>
                  <option value="Plaza Comercial">Plaza Comercial</option>
                </select>
              </div>
            )}

            {/* Message */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Mensaje o Nota</label>
              <textarea
                placeholder="Describe el motivo de tu solicitud o cualquier detalle importante..."
                rows={4}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900">
              <div className="flex gap-3">
                <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    Tu solicitud será enviada inmediatamente
                  </p>
                  <p className="text-blue-700 dark:text-blue-300">
                    El equipo correspondiente recibirá una notificación y responderá a la brevedad.
                    Recibirás actualizaciones del estado de tu solicitud en tiempo real.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitRequest} disabled={!formData.product || !formData.quantity}>
              <Send className="h-4 w-4 mr-2" />
              Enviar Solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
