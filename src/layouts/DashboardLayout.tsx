import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: 'home' },
  { name: 'Tiendas', href: '/tiendas', icon: 'store' },
  { name: 'Histórico', href: '/historico', icon: 'chart' },
  { name: 'Chat', href: '/chat', icon: 'chat' },
];

export function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center px-4 container mx-auto">
          <div className="flex items-center gap-2 font-bold text-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-6 w-6"
            >
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
              <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
              <path d="M12 3v6" />
            </svg>
            Calzando a México
          </div>
          <nav className="ml-8 flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  location.pathname === item.href
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <main className="container mx-auto p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
