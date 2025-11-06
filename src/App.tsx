import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { TiendasPage } from '@/pages/TiendasPage';
import { TiendaDetailPage } from '@/pages/TiendaDetailPage';
import { HistoricoPage } from '@/pages/HistoricoPage';
import { ChatPage } from '@/pages/ChatPage';
import { EmpleadosPage } from '@/pages/EmpleadosPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tiendas" element={<TiendasPage />} />
            <Route path="/tiendas/:tienda" element={<TiendaDetailPage />} />
            <Route path="/historico" element={<HistoricoPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/empleados" element={<EmpleadosPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
