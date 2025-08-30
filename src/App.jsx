import { useState, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import tkMessages from './lang/tk.json';
import ruMessages from './lang/ru.json';
import Users from './pages/Users';
import Report from './pages/Report';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VideoPage from './pages/Video';
import Settings from './pages/Settings';
import Operators from './pages/Operators';
import { AuthProvider, useAuth } from './components/AuthContext';
import RequireAuth from './components/RequireAuth';
import Layout from './components/Layout';
import './index.css';
import { ToastContainer } from 'react-toastify';

const messages = {
  tk: tkMessages,
  ru: ruMessages,
};

const AuthWrapper = ({ children }) => {
  const { auth } = useAuth();

  if (auth.isLoading) {
    return <div className="text-center p-10 text-gray-700">Загрузка сессии...</div>;
  }

  return children;
};

const App = () => {
  const defaultLocale = 'ru';
  const [locale, setLocale] = useState(() => {
    const savedLocale = localStorage.getItem('locale');
    return savedLocale && messages[savedLocale] ? savedLocale : defaultLocale;
  });

  useEffect(() => {
    localStorage.setItem('locale', locale);
    console.log('Locale updated:', locale);
  }, [locale]);

  return (
    <IntlProvider locale={locale} messages={messages[locale] || messages[defaultLocale]}>
      <AuthProvider>
        <AuthWrapper>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<Layout locale={locale} setLocale={setLocale} />}>
                <Route
                  path="/dashboard"
                  element={<RequireAuth><Dashboard /></RequireAuth>}
                />
                <Route
                  path="/users"
                  element={<RequireAuth><Users /></RequireAuth>}
                />
                <Route
                  path="/report"
                  element={<RequireAuth><Report /></RequireAuth>}
                />
                <Route
                  path="/video"
                  element={<RequireAuth><VideoPage /></RequireAuth>}
                />
                <Route
                  path="/settings"
                  element={<RequireAuth><Settings /></RequireAuth>}
                />
                <Route
                  path="/operator"
                  element={<RequireAuth><Operators /></RequireAuth>}
                />
              </Route>
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </BrowserRouter>
        </AuthWrapper>
      </AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </IntlProvider>
  );
};

export default App;
