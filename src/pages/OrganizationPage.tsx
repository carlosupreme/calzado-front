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

        {/* Main Content - Diagram Viewer */}
        <div className="space-y-4">
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
                  {/* Zoom Controls */}
                  <div className="flex items-center gap-1 border rounded-lg p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleZoomOut}
                      disabled={zoom <= 50}
                      className="h-8 w-8 p-0"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResetZoom}
                      className="h-8 px-3 text-xs font-medium"
                    >
                      {zoom}%
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleZoomIn}
                      disabled={zoom >= 200}
                      className="h-8 w-8 p-0"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Fullscreen Toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
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
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className={`${isFullscreen ? 'flex-1 overflow-auto' : ''} p-0`}>
              <div className={`${isFullscreen ? 'min-h-full' : 'h-[600px]'} bg-muted/30 overflow-auto flex items-center justify-center p-4`}>
                <div
                  className="transition-transform duration-200 ease-in-out"
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'center center',
                  }}
                >
                  <img
                    src={selectedDiagram.imagePath}
                    alt={selectedDiagram.title}
                    className="max-w-full h-auto rounded-lg shadow-lg bg-white"
                    draggable={false}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Consejos de Visualización</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Usa los controles de zoom para ajustar el tamaño del diagrama</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Activa el modo de pantalla completa para una mejor visualización</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Descarga el diagrama para uso offline o presentaciones</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>El scroll permite navegar por diagramas más grandes que la pantalla</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
