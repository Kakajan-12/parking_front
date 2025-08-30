import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FormattedMessage } from 'react-intl';
import { useEffect } from 'react';

const Layout = ({ locale, setLocale }) => {
  const location = useLocation();

  // Динамический заголовок в зависимости от маршрута
  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return { id: 'dashboard.title', defaultMessage: 'Dashboard' };
      case '/users':
        return { id: 'users.title', defaultMessage: 'Users' };
      case '/report':
        return { id: 'report.title', defaultMessage: 'Report' };
      case '/video':
        return { id: 'sidebar.video', defaultMessage: 'Video Surveillance' };
      case '/settings':
        return { id: 'sidebar.settings', defaultMessage: 'Settings' };
      case '/operator':
        return { id: 'sidebar.operator', defaultMessage: 'Operators' };
      default:
        return { id: 'dashboard.title', defaultMessage: 'Dashboard' };
    }
  };

  // Логи для отладки
  useEffect(() => {
    console.log('Layout rendered, path:', location.pathname);
    console.log('Sidebar should be visible');
  }, [location.pathname]);

  return (
    <div className="main-color bg-black flex h-screen w-screen">
      <Sidebar />
      <main className="w-full text-color pb-4 pt-8 pr-4 flex flex-col">
        <div className="flex justify-between items-center bg-white py-3 px-5 rounded-tl-2xl rounded-tr-2xl shadow-md">
          <div className="text-color-2 text-lg font-semibold">
            <FormattedMessage {...getPageTitle()} />
          </div>
          <div className="flex rounded-3xl p-2 space-x-3 " style={{ backgroundColor: '#EFF0F4' }}>
            <button
              onClick={() => setLocale('ru')}
              className={`flex justify-center items-center rounded-2xl p-1 ${locale === 'ru' ? 'main-color text-white' : 'text-gray-600'}`}
            >
              <img
                src="/russian.svg"
                alt="russian"
                className="mr-1"
                style={{ width: '24px', height: '24px' }}
              />
              <div className="text-md pr-1">Русский</div>
            </button>
            <button
              onClick={() => setLocale('tk')}
              className={`flex justify-center items-center rounded-2xl p-1 ${locale === 'tk' ? 'main-color text-white' : 'text-gray-600'}`}
            >
              <img
                src="/turkmen.svg"
                alt="turkmen"
                className="mr-1"
                style={{ width: '24px', height: '24px' }}
              />
              <div className="text-md pr-1">Türkmen</div>
            </button>
          </div>
        </div>
        <div className="h-full grow">
          
          <Outlet className="h-full grow"/>
        </div>
      </main>
    </div>
  );
};

export default Layout;