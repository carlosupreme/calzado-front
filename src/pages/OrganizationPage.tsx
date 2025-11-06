import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Download,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Building2,
  Users,
  GitBranch,
  Maximize,
  Target,
} from 'lucide-react';

interface Diagram {
  id: string;
  title: string;
  description: string;
  imagePath: string;
  category: string;
  lastUpdated: string;
}

const diagrams: Diagram[] = [
  {
    id: 'org-structure',
    title: 'Estructura Organizacional',
    description: 'Diagrama completo de la estructura organizacional de Calzando a México, mostrando jerarquías, departamentos y líneas de reporte.',
    imagePath: '/d.png',
    category: 'Organización',
    lastUpdated: '2025-11-06',
  },
  // Add more diagrams as needed
];

export function OrganizationPage() {
  const [selectedDiagram, setSelectedDiagram] = useState<Diagram>(diagrams[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);

  const handleDownload = (diagram: Diagram) => {
    const link = document.createElement('a');
    link.href = diagram.imagePath;
    link.download = `${diagram.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  const handleFitToScreen = () => {
    setZoom(70);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Organización':
        return <Building2 className="h-4 w-4" />;
      case 'Procesos':
        return <GitBranch className="h-4 w-4" />;
      case 'Equipos':
        return <Users className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organización</h1>
          <p className="text-muted-foreground mt-2">
            Visualización de diagramas organizacionales y estructuras empresariales
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {diagrams.length} {diagrams.length === 1 ? 'diagrama' : 'diagramas'}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Sidebar - Diagram List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Diagramas Disponibles</CardTitle>
              <CardDescription>Selecciona un diagrama para visualizar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {diagrams.map((diagram) => (
                <button
                  key={diagram.id}
                  onClick={() => {
                    setSelectedDiagram(diagram);
                    setZoom(100);
                    setIsFullscreen(false);
                  }}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedDiagram.id === diagram.id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/50 hover:bg-accent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`rounded-lg p-2 ${
                      selectedDiagram.id === diagram.id
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {getCategoryIcon(diagram.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                        {diagram.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {diagram.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {diagram.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleDownload(selectedDiagram)}
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar Diagrama
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="h-4 w-4 mr-2" />
                    Salir de Pantalla Completa
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-4 w-4 mr-2" />
                    Pantalla Completa
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Organizational Info */}
        <div className="space-y-4">
          {/* Mission, Vision, Values */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Mission */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-2">
                    <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-base">Misión</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ofrecer a las familias mexicanas acceso a calzado de calidad a precios competitivos,
                  brindando una experiencia de compra excepcional y contribuyendo al bienestar de
                  nuestras comunidades a través de más de 15 tiendas en todo el país.
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-2">
                    <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-base">Visión</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ser la cadena de zapaterías líder en México, reconocida por nuestra excelencia operativa,
                  innovación en procesos y compromiso con la satisfacción del cliente, expandiendo nuestra
                  presencia nacional con una estructura organizacional sólida y eficiente.
                </p>
              </CardContent>
            </Card>

            {/* Values */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-2">
                    <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-base">Valores</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span><strong>Calidad:</strong> Compromiso con productos de alto estándar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span><strong>Accesibilidad:</strong> Precios justos para todas las familias</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span><strong>Servicio:</strong> Atención al cliente excepcional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span><strong>Integridad:</strong> Honestidad en todas nuestras operaciones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span><strong>Innovación:</strong> Mejora continua de procesos</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Company Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Acerca de Calzando a México</CardTitle>
              <CardDescription>35 años transformando la industria del calzado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Calzando a México</strong> es una de las cadenas de zapaterías
                  más grandes del país, con más de 15 tiendas a nivel nacional. Fundada hace 35 años, la empresa
                  experimentó un crecimiento acelerado gracias a su modelo de negocio de ofrecer una amplia variedad
                  de calzado a precios competitivos.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Sin embargo, este rápido crecimiento no fue acompañado por una evolución de sus procesos internos
                  ni de su estructura organizacional. Hoy nos encontramos en un proceso de transformación y modernización
                  para consolidar nuestra operación y prepararnos para el futuro.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">35+</p>
                    <p className="text-xs text-muted-foreground">Años de experiencia</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">15+</p>
                    <p className="text-xs text-muted-foreground">Tiendas nacionales</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">500+</p>
                    <p className="text-xs text-muted-foreground">Colaboradores</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">1M+</p>
                    <p className="text-xs text-muted-foreground">Clientes atendidos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Diagram Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle>{selectedDiagram.title}</CardTitle>
                    <Badge variant="outline">{selectedDiagram.category}</Badge>
                  </div>
                  <CardDescription>{selectedDiagram.description}</CardDescription>
                  <p className="text-xs text-muted-foreground mt-2">
                    Última actualización: {new Date(selectedDiagram.lastUpdated).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Diagram Viewer */}
          <Card className={isFullscreen ? 'fixed inset-4 z-50 flex flex-col' : ''}>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Vista de Diagrama</CardTitle>
                <div className="flex items-center gap-2">
                  {/* Fit to Screen */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFitToScreen}
                    className="hidden sm:flex"
                  >
                    <Maximize className="h-4 w-4 mr-1" />
                    <span className="text-xs">Ajustar</span>
                  </Button>

                  {/* Zoom Controls */}
                  <div className="flex items-center gap-1 border rounded-lg p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleZoomOut}
                      disabled={zoom <= 50}
                      className="h-8 w-8 p-0"
                      title="Reducir zoom"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResetZoom}
                      className="h-8 px-3 text-xs font-medium"
                      title="Restablecer zoom"
                    >
                      {zoom}%
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleZoomIn}
                      disabled={zoom >= 200}
                      className="h-8 w-8 p-0"
                      title="Aumentar zoom"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Fullscreen Toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>

                  {/* Download Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(selectedDiagram)}
                    title="Descargar diagrama"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className={`${isFullscreen ? 'flex-1' : ''} p-0`}>
              <div
                className={`${isFullscreen ? 'h-[calc(100vh-12rem)]' : 'h-[70vh] min-h-[500px]'} bg-muted/30 overflow-auto`}
              >
                <div className="w-full h-full flex items-start justify-center p-6">
                  <div
                    className="transition-transform duration-200 ease-in-out"
                    style={{
                      transform: `scale(${zoom / 100})`,
                      transformOrigin: 'top center',
                    }}
                  >
                    <img
                      src={selectedDiagram.imagePath}
                      alt={selectedDiagram.title}
                      className="rounded-lg shadow-2xl bg-white border"
                      draggable={false}
                      style={{
                        maxWidth: '1400px',
                        width: '100%',
                        height: 'auto',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
