import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ImExit } from 'react-icons/im';
import { TbLayoutDashboardFilled, TbReportAnalytics } from 'react-icons/tb';
import { MdCameraAlt } from 'react-icons/md';
import { FaUserShield, FaRegUser } from 'react-icons/fa';
import { LuSettings2 } from 'react-icons/lu';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';
import { FormattedMessage } from 'react-intl';

const links = [
  { to: '/dashboard', icon: <TbLayoutDashboardFilled size={25} />, labelId: 'sidebar.dashboard', defaultMessage: 'Administrator', roles: ['admin'] },
  { to: '/video', icon: <MdCameraAlt size={25} />, labelId: 'sidebar.video', defaultMessage: 'Video Surveillance', roles: ['admin', 'operator'] },
  { to: '/operator', icon: <FaUserShield size={25} />, labelId: 'sidebar.operator', defaultMessage: 'Operators', roles: ['admin'] },
  { to: '/report', icon: <TbReportAnalytics size={25} />, labelId: 'sidebar.report', defaultMessage: 'Monthly Reports', roles: ['admin', 'accountant'] },
  { to: '/users', icon: <FaRegUser size={25} />, labelId: 'sidebar.users', defaultMessage: 'Users', roles: ['admin'] },
  { to: '/settings', icon: <LuSettings2 size={25} />, labelId: 'sidebar.settings', defaultMessage: 'Settings', roles: ['admin'] },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      toast.error(<FormattedMessage id="auth.sessionExpired" defaultMessage="Session expired. Please log in again." />);
      navigate('/login', { replace: true });
    }
  }, [auth.isAuthenticated, navigate]);

  const handleLogout = async () => {
    const API_URL = import.meta.env.VITE_API_URL || "http://172.16.4.204:3000";
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Ошибка при выходе');

      const data = await response.json();

      // Показываем модальное окно с сообщением сервера
      setModalMessage(data.totalPayment || 'Вы вышли из системы');
      setIsModalOpen(true);
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Не удалось выйти. Попробуйте ещё раз.');
    }
  };

  const handleConfirmLogin = async () => {
    try {
      await logout();        // сброс auth через контекст
      localStorage.clear();  // очистка локальных данных
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Ошибка при выходе:', err);
      toast.error('Не удалось перейти на страницу логина.');
    }
  };

  // Фильтруем пункты меню по роли
  const filteredLinks = links.filter((link) => link.roles.includes(auth.role || 'unknown'));

  // Форматируем роль для отображения
  const roleDisplay = {
    admin: <FormattedMessage id="role.admin" defaultMessage="Administrator" />,
    operator: <FormattedMessage id="role.operator" defaultMessage="Operator" />,
    accountant: <FormattedMessage id="role.accountant" defaultMessage="Accountant" />,
    unknown: <FormattedMessage id="role.unknown" defaultMessage="Unknown" />,
  }[auth.role || 'unknown'];

  return (
    <div className="h-screen flex flex-col justify-between p-4 w-1/5 text-color">
      <div className="pt-8">
        <div className="mb-4">
          <img src="/logo-white.svg" alt="logo" className="w-full" />
        </div>
        <nav className="flex-1 p-2 space-y-2">
          {filteredLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative flex items-center space-x-2 p-3 pr-6 rounded-l-full transition font-semibold text-lg text-white ${
                  isActive ? 'bg-white !text-green-700' : ''
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="mr-2">{link.icon}</div>
                  <FormattedMessage id={link.labelId} defaultMessage={link.defaultMessage} />
                  {isActive && (
                    <img
                      src="/sidebar.svg"
                      alt="sidebar"
                      style={{ position: 'absolute', right: -25, width: 38 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="border-2 border-[#DFE0EB] p-1 w-12 h-12 rounded-full">
            <img src="/avatar/avatar.png" alt="avatar" className="w-full h-full rounded-full" />
          </div>
          <div className="leading-5 flex flex-col items-start justify-center pl-4 text-white">
            <p className="font-semibold text-md">{auth.username || 'Пользователь'}</p>
            <p className="text-sm text-gray-300">{roleDisplay}</p>
          </div>
        </div>
        <div className="flex items-center">
          <button onClick={handleLogout}>
            <ImExit size={26} color="#ffffff" />
          </button>
        </div>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <p className="mb-4">{modalMessage}</p>
            <button
              onClick={handleConfirmLogin}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Войти в систему
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
