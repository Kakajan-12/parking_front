import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://172.16.4.204:3000';
const REQUEST_TIMEOUT = 5000;

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: null,
    username: null,
    parkno: null,
    isLoading: true,
  });

  const clearAuth = useCallback(() => {
    setAuth({
      isAuthenticated: false,
      role: null,
      username: null,
      parkno: null,
      isLoading: false,
    });
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('parkno');
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await fetch(`${API_URL}/api/v1/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('Ответ /api/v1/auth/me:', { status: response.status });

      if (response.ok) {
        const { role, username, parkno } = await response.json();
        setAuth({
          isAuthenticated: true,
          role,
          username,
          parkno,
          isLoading: false,
        });
      } else {
        clearAuth();
      }
    } catch (err) {
      clearAuth();
    }
  }, [clearAuth]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(
    async (username, password, parkno) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

        const payload = {
          username,
          password,
          ...(parkno && { parkno }),
        };

        const response = await fetch(`${API_URL}/api/v1/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        console.log('Ответ /api/v1/auth/login:', { status: response.status });

        const data = await response.json();
        console.log('Данные ответа:', data);

        if (!response.ok) {
          throw new Error(data.message || 'Ошибка авторизации');
        }

        if (!data.role) {
          throw new Error('Недопустимая роль пользователя');
        }

        if (data.role === 'operator' && !parkno) {
          throw new Error('Пожалуйста, выберите парк');
        }

        setAuth({
          isAuthenticated: true,
          role: data.role,
          username,
          parkno: parkno || null,
          isLoading: false,
        });

        localStorage.setItem('username', username);
        localStorage.setItem('role', data.role);
        if (parkno) {
          localStorage.setItem('parkno', parkno);
        }

        return { role: data.role };
      } catch (err) {
        clearAuth();
        throw err;
      }
    },
    [clearAuth]
  );

  const logout = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  
      const response = await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include', // важно для передачи сессионных cookie
        signal: controller.signal,
      });
  
      clearTimeout(timeoutId);
      console.log('Ответ /api/v1/auth/logout:', { status: response.status });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка logout');
      }
  
      // После успешного logout API — очищаем auth локально
      clearAuth();
    } catch (err) {
      console.error('Ошибка logout:', err.message);
      clearAuth(); // даже при ошибке всё равно очищаем локально
    }
  }, [clearAuth]);
  


  return (
    <AuthContext.Provider value={{ auth, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}