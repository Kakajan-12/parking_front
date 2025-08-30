import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css'
import App from './App.jsx'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Количество попыток повтора при ошибке
      staleTime: 1000 * 60 * 5, // Время, через которое данные считаются устаревшими (5 минут)
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
