import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/lib/statusUtils';
import {
  Award,
  Crown,
  Medal,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  position: string;
  store: string;
  avatar?: string;
  salesThisMonth: number;
  salesGrowth: number;
  customerRating: number;
  tasksCompleted: number;
  achievements: string[];
  monthlyGoalPercentage: number;
}

// Generate mock employee data
function generateEmployeesData(): Employee[] {
  return [
    {
      id: 'EMP-001',
      name: 'María García López',
      position: 'Gerente de Tienda',
      store: 'Centro',
      salesThisMonth: 450000,
      salesGrowth: 35,
      customerRating: 4.9,
      tasksCompleted: 48,
      achievements: ['Mejor Atención al Cliente', 'Meta Superada 3 meses', 'Cero Quejas'],
      monthlyGoalPercentage: 145,
    },
    {
      id: 'EMP-002',
      name: 'Carlos Mendoza Silva',
      position: 'Vendedor Senior',
      store: 'Plaza Comercial',
      salesThisMonth: 380000,
      salesGrowth: 28,
      customerRating: 4.8,
      tasksCompleted: 42,
      achievements: ['Top Vendedor', 'Experto en Productos'],
      monthlyGoalPercentage: 132,
    },
    {
      id: 'EMP-003',
      name: 'Laura Ramírez Torres',
      position: 'Coordinadora de Ventas',
      store: 'Norte',
      salesThisMonth: 365000,
      salesGrowth: 22,
      customerRating: 4.7,
      tasksCompleted: 45,
      achievements: ['Liderazgo Efectivo', 'Mejor Equipo'],
      monthlyGoalPercentage: 128,
    },
    {
      id: 'EMP-004',
      name: 'Juan López Martínez',
      position: 'Vendedor',
      store: 'Sur',
      salesThisMonth: 320000,
      salesGrowth: 18,
      customerRating: 4.6,
      tasksCompleted: 38,
      achievements: ['Puntualidad Perfecta'],
      monthlyGoalPercentage: 115,
    },
    {
      id: 'EMP-005',
      name: 'Ana Torres González',
      position: 'Asistente de Ventas',
      store: 'Centro',
      salesThisMonth: 280000,
      salesGrowth: 15,
      customerRating: 4.5,
      tasksCompleted: 35,
      achievements: ['Rookie del Mes'],
      monthlyGoalPercentage: 108,
    },
  ];
}

export function EmployeeRecognition() {
  const employees = generateEmployeesData();
  const employeeOfTheMonth = employees[0];
  const top3 = employees.slice(0, 3);
  const otherTopPerformers = employees.slice(3, 5);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <Star className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/50';
      case 2:
        return 'from-gray-400/20 to-gray-500/20 border-gray-400/50';
      case 3:
        return 'from-amber-600/20 to-amber-700/20 border-amber-600/50';
      default:
        return 'from-muted to-muted border-border';
    }
  };

  const getAvatarInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="h-7 w-7 text-yellow-500" />
            Reconocimiento de Empleados
          </h2>
          <p className="text-muted-foreground mt-1">
            Celebrando la excelencia y el desempeño sobresaliente
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {new Date().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Employee of the Month - Large Card */}
        <Card className="border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500/10 rounded-full -ml-12 -mb-12" />

          <CardHeader className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-full bg-yellow-500/20">
                <Crown className="h-6 w-6 text-yellow-600" />
              </div>
              <CardTitle className="text-2xl">Empleado del Mes</CardTitle>
              <Sparkles className="h-5 w-5 text-yellow-500 ml-auto" />
            </div>
            <CardDescription className="text-base">
              Reconocimiento al desempeño excepcional y dedicación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 relative">
            {/* Employee Info */}
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="shrink-0">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {getAvatarInitials(employeeOfTheMonth.name)}
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-bold mb-1">{employeeOfTheMonth.name}</h3>
                <p className="text-muted-foreground mb-2">{employeeOfTheMonth.position}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{employeeOfTheMonth.store}</Badge>
                  <Badge variant="outline" className="bg-yellow-50 border-yellow-500 text-yellow-700">
                    <Trophy className="h-3 w-3 mr-1" />
                    {employeeOfTheMonth.monthlyGoalPercentage}% de meta
                  </Badge>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1 text-center p-3 bg-background/50 rounded-lg border">
                <div className="flex items-center justify-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-2xl font-bold">+{employeeOfTheMonth.salesGrowth}%</span>
                </div>
                <p className="text-xs text-muted-foreground">Crecimiento</p>
              </div>

              <div className="space-y-1 text-center p-3 bg-background/50 rounded-lg border">
                <div className="flex items-center justify-center gap-1 text-yellow-600">
                  <Star className="h-4 w-4" />
                  <span className="text-2xl font-bold">{employeeOfTheMonth.customerRating}</span>
                </div>
                <p className="text-xs text-muted-foreground">Calificación</p>
              </div>

              <div className="space-y-1 text-center p-3 bg-background/50 rounded-lg border">
                <div className="flex items-center justify-center gap-1 text-blue-600">
                  <Target className="h-4 w-4" />
                  <span className="text-2xl font-bold">{employeeOfTheMonth.tasksCompleted}</span>
                </div>
                <p className="text-xs text-muted-foreground">Tareas</p>
              </div>

              <div className="space-y-1 text-center p-3 bg-background/50 rounded-lg border">
                <div className="flex items-center justify-center gap-1 text-purple-600">
                  <Award className="h-4 w-4" />
                  <span className="text-2xl font-bold">{formatNumber(employeeOfTheMonth.salesThisMonth)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Ventas</p>
              </div>
            </div>

            {/* Achievements */}
            <div className="space-y-2">
              <p className="text-sm font-semibold flex items-center gap-2">
                <Award className="h-4 w-4 text-yellow-600" />
                Logros Destacados
              </p>
              <div className="flex flex-wrap gap-2">
                {employeeOfTheMonth.achievements.map((achievement, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                    ⭐ {achievement}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Quote */}
            <div className="p-4 bg-background/70 rounded-lg border-l-4 border-yellow-500">
              <p className="text-sm italic text-muted-foreground">
                "La excelencia no es un acto, sino un hábito. {employeeOfTheMonth.name} demuestra día a día su compromiso con nuestros clientes y el equipo."
              </p>
              <p className="text-xs text-muted-foreground mt-2 text-right">— Dirección General</p>
            </div>
          </CardContent>
        </Card>

        {/* Top 3 Leaderboard */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Top 3 del Mes
              </CardTitle>
              <CardDescription>Los mejores desempeños de este período</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {top3.map((employee, idx) => (
                <div
                  key={employee.id}
                  className={`p-4 rounded-lg border-2 bg-gradient-to-r ${getRankColor(idx + 1)} transition-all hover:shadow-lg`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank */}
                    <div className="flex items-center justify-center shrink-0">
                      {getRankIcon(idx + 1)}
                    </div>

                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      idx === 0 ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                      idx === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                      'bg-gradient-to-br from-amber-600 to-amber-800'
                    }`}>
                      {getAvatarInitials(employee.name)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">{employee.position}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{employee.store}</Badge>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-green-600">+{employee.salesGrowth}%</p>
                      <p className="text-xs text-muted-foreground">{employee.monthlyGoalPercentage}% meta</p>
                    </div>
                  </div>

                  {/* Mini Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Ventas</p>
                      <p className="text-sm font-semibold">${(employee.salesThisMonth / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Rating</p>
                      <p className="text-sm font-semibold flex items-center justify-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        {employee.customerRating}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Tareas</p>
                      <p className="text-sm font-semibold">{employee.tasksCompleted}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Honorable Mentions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Star className="h-4 w-4 text-purple-600" />
                Menciones Honoríficas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {otherTopPerformers.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-xs">
                    {getAvatarInitials(employee.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{employee.name}</p>
                    <p className="text-xs text-muted-foreground">{employee.store}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-green-600">+{employee.salesGrowth}%</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Métricas del Equipo</CardTitle>
          <CardDescription>Rendimiento general del equipo este mes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Promedio de Ventas</p>
              <p className="text-2xl font-bold">
                ${formatNumber(employees.reduce((sum, e) => sum + e.salesThisMonth, 0) / employees.length)}
              </p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +{(employees.reduce((sum, e) => sum + e.salesGrowth, 0) / employees.length).toFixed(1)}% vs mes anterior
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Rating Promedio</p>
              <p className="text-2xl font-bold flex items-center gap-1">
                <Star className="h-6 w-6 fill-yellow-500 text-yellow-500" />
                {(employees.reduce((sum, e) => sum + e.customerRating, 0) / employees.length).toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">Satisfacción del cliente</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Tareas Completadas</p>
              <p className="text-2xl font-bold">
                {employees.reduce((sum, e) => sum + e.tasksCompleted, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Total del equipo</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Logro de Metas</p>
              <p className="text-2xl font-bold text-green-600">
                {(employees.reduce((sum, e) => sum + e.monthlyGoalPercentage, 0) / employees.length).toFixed(0)}%
              </p>
              <p className="text-xs text-green-600">Por encima del objetivo</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
