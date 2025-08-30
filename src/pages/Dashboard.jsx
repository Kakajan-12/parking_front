import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CgFileDocument } from 'react-icons/cg';
import { CiMenuKebab } from 'react-icons/ci';
import { FormattedMessage, useIntl } from 'react-intl';

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [operatorCount, setOperatorCount] = useState(0);
  const [cameraCount, setCameraCount] = useState(0);
  const [totalCars, setTotalCars] = useState(0);
  const [moneyP3, setMoneyP3] = useState(0);
  const [moneyP4, setMoneyP4] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const intl = useIntl();

  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoading(true);
      setError(null);
      const API_URL = import.meta.env.VITE_API_URL || 'http://172.16.4.204:3000';

      try {
        const countResponse = await fetch(`${API_URL}/api/v1/userCount`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
        });


        if (countResponse.status === 401) {
          setError(intl.formatMessage({ id: 'auth.sessionExpired', defaultMessage: 'Session expired. Please log in again.' }));
          toast.error(intl.formatMessage({ id: 'auth.sessionExpired', defaultMessage: 'Session expired. Please log in again.' }));
          return;
        }

        if (!countResponse.ok) {
          const errorData = await countResponse.json().catch(() => ({}));
          throw new Error(errorData.message || `Ошибка ${countResponse.status}`);
        }

        const countData = await countResponse.json();
        setUserCount(countData.totalUsers || 0);
        setOperatorCount(countData.operator || 0);
        setCameraCount(countData.camera || 0);
        setTotalCars(countData.totalCars || 0);

        const operatorResponse = await fetch(`${API_URL}/api/v1/accountant/operators`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
        });


        if (operatorResponse.status === 401) {
          setError(intl.formatMessage({ id: 'auth.sessionExpired', defaultMessage: 'Session expired. Please log in again.' }));
          toast.error(intl.formatMessage({ id: 'auth.sessionExpired', defaultMessage: 'Session expired. Please log in again.' }));
          return;
        }

        if (!operatorResponse.ok) {
          const errorData = await operatorResponse.json().catch(() => ({}));
          throw new Error(errorData.message || `Ошибка ${countResponse.status}`);
        }

        const operatorData = await operatorResponse.json();

        const moneyP3Total = operatorData.data
          .filter((item) => item.park === 'P3')
          .reduce((sum, item) => sum + (item.money || 0), 0);
        const moneyP4Total = operatorData.data
          .filter((item) => item.park === 'P4')
          .reduce((sum, item) => sum + (item.money || 0), 0);

        setMoneyP3(moneyP3Total);
        setMoneyP4(moneyP4Total);
      } catch (err) {
        const message = err.message || intl.formatMessage({ id: 'login.error.network', defaultMessage: 'Network error. Please try again later.' });
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, [intl]);

  return (
    <div className="bg-white rounded-br-2xl rounded-bl-2xl p-4 h-[93%]">
      {isLoading ? (
        <div className="text-center text-gray-600">
          <FormattedMessage id="dashboard.loading" defaultMessage="Loading..." />
        </div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <div className="flex flex-col">
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <CgFileDocument size={48} color="white" className='main-color p-1 rounded-md'/>
                <CiMenuKebab size={18} color='black' />
              </div>
              <h2 className="text-lg font-semibold text-black mt-2">
                <FormattedMessage id="dashboard.users" defaultMessage="Users"/>
              </h2>
              <p className="text-3xl font-bold text-black">{userCount}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
                <CgFileDocument size={48} color="white" className='main-color p-1 rounded-md'/>
                <CiMenuKebab size={18} color='black' />
              </div>
              <h2 className="text-lg font-semibold text-black mt-2">
                <FormattedMessage id="dashboard.operators" defaultMessage="Operators" />
              </h2>
              <p className="text-3xl font-bold text-black">{operatorCount}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
                <CgFileDocument size={48} color="white" className='main-color p-1 rounded-md'/>
                <CiMenuKebab size={18} color='black' />
              </div>
              <h2 className="text-lg font-semibold text-black mt-2">
                <FormattedMessage id="dashboard.cameras" defaultMessage="Cameras" />
              </h2>
              <p className="text-3xl font-bold text-black">{cameraCount}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
                <CgFileDocument size={48} color="white" className='main-color p-1 rounded-md'/>
                <CiMenuKebab size={18} color='black' />
              </div>
              <h2 className="text-lg font-semibold text-black mt-2">
                <FormattedMessage id="dashboard.totalCars" defaultMessage="Total Cars" />
              </h2>
              <p className="text-3xl font-bold text-black">{totalCars}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
                <CgFileDocument size={48} color="white" className='main-color p-1 rounded-md'/>
                <CiMenuKebab size={18} color='black' />
              </div>
              <h2 className="text-lg font-semibold text-black mt-2">
                <FormattedMessage id="dashboard.incomeP3" defaultMessage="Income P3" />
              </h2>
              <p className="text-3xl font-bold text-black">{moneyP3} TMT</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
                <CgFileDocument size={48} color="white" className='main-color p-1 rounded-md'/>
                <CiMenuKebab size={18} color='black' />
              </div>
              <h2 className="text-lg font-semibold text-black mt-2">
                <FormattedMessage id="dashboard.incomeP4" defaultMessage="Income P4" />
              </h2>
              <p className="text-3xl font-bold text-black">{moneyP4} TMT</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;