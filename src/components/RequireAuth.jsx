import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ROUTES_BY_ROLE = {
  admin: '/dashboard',
  operator: '/video',
  accountant: '/report',
};

const ALLOWED_ROUTES = {
  admin: ['/dashboard', '/video', '/operator', '/report', '/users', '/settings'],
  operator: ['/video'],
  accountant: ['/report'],
};

function RequireAuth({ children }) {
  const { auth } = useAuth();
  const location = useLocation();

  console.log('RequireAuth:', {
    isAuthenticated: auth.isAuthenticated,
    role: auth.role,
    parkno: auth.parkno,
    pathname: location.pathname,
  });

  if (auth.isLoading) {
    return null; // Ждём завершения проверки сессии
  }

  if (!auth.isAuthenticated) {
    console.log('Пользователь не авторизован, перенаправление на /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (auth.role === 'operator' && location.pathname === '/video' && !auth.parkno) {
    console.warn('Для роли operator требуется parkno на /video, перенаправление на /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (auth.role === 'operator' && location.pathname !== '/video') {
    console.warn(`Оператор не имеет доступа к ${location.pathname}, перенаправление на /video`);
    return <Navigate to="/video" replace />;
  }

  if (!ALLOWED_ROUTES[auth.role]?.includes(location.pathname)) {
    console.warn(`Роль ${auth.role} не имеет доступа к ${location.pathname}`);
    return <Navigate to={ROUTES_BY_ROLE[auth.role] || '/login'} replace />;
  }

  return children;
}

export default RequireAuth;