# Calzando a México - Dashboard Frontend

React + TypeScript frontend application for the Calzando a México inventory management system.

## Features

### 📊 Dashboard
- **Summary Cards**: Overview of total stores, critical stores, alerts, and optimal inventory
- **Real-time Metrics**: Inventory totals, sales, and average coverage
- **Visual Status Indicators**: Color-coded status badges for quick assessment

### 🏪 Store Management
- **Store List**: Complete list of all stores with key metrics
- **Store Details**: Detailed breakdown by business unit
- **Coverage Analysis**: Days of inventory coverage calculation
- **Status Classification**:
  - **CRÍTICO**: < 28 days coverage (red)
  - **ÓPTIMO**: 28-90 days coverage (green)
  - **SOBREINVENTARIO**: > 90 days coverage (yellow)
  - **SIN VENTAS**: No sales data (gray)

### 📈 Historical Data
- **Time Series Charts**: Monthly trends for inventory, sales, and coverage
- **Year Selector**: View data for 2023, 2024, or 2025
- **Store-specific Analysis**: Filter historical data by store
- **Responsive Charts**: Built with Recharts for interactive visualization

### 💬 Chat Assistant
- **AI-Powered Q&A**: Ask questions about inventory, sales, and coverage
- **Natural Language Interface**: Conversational queries in Spanish
- **Session Persistence**: Chat history saved in localStorage
- **Suggested Questions**: Quick-start prompts for common queries
- **Intent Recognition**: Displays detected query intent
- **Real-time Responses**: Streaming responses from backend API

## Tech Stack

- **React 19.1.1** - UI framework
- **TypeScript** - Type safety
- **Vite 7.1.7** - Build tool and dev server
- **TailwindCSS 4.1.16** - Styling
- **shadcn/ui** - Component library (New York style)
- **React Router 7.9.5** - Client-side routing
- **TanStack Query 5.90.7** - Server state management
- **Axios 1.13.2** - HTTP client
- **Recharts 3.3.0** - Data visualization
- **Zod 4.1.12** - Schema validation

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Or for production:

```env
VITE_API_BASE_URL=https://calzando-backend-711611195053.northamerica-south1.run.app
```

### Development

```bash
# Start dev server (http://localhost:5173)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## API Integration

### Dashboard Endpoints

- `GET /api/dashboard/summary` - Dashboard summary metrics
- `GET /api/dashboard/tiendas` - List all stores
- `GET /api/dashboard/tiendas/:nombre` - Store detail
- `GET /api/dashboard/historico` - Historical data

### Chat Endpoint

- `POST /api/chat` - Send chat message

```json
{
  "message": "¿Cuál es el inventario total?",
  "session_id": "optional-session-id"
}
```

## Features

### Dashboard Components

- **DashboardSummary**: 8 summary cards with key metrics
- **TiendasList**: Interactive table with all stores
- **TiendaDetail**: Detailed view with business unit breakdown
- **HistoricoChart**: Line charts for trends

### Chat Features

- **Session Management**: Persistent chat history
- **Suggested Questions**: Pre-configured prompts
- **Intent Recognition**: Displays query intent
- **Auto-scroll**: Latest messages always visible
- **Clear Chat**: Reset conversation anytime

## Project Structure

```
src/
├── api/                    # API clients and services
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── dashboard/         # Dashboard components
│   └── chat/              # Chat components
├── hooks/                 # Custom React hooks
├── layouts/               # Layout components
├── pages/                 # Page components
├── types/                 # TypeScript types
└── lib/                   # Utility functions
```

## License

Proprietary - Calzando a México
