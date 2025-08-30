import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../components/AuthContext';
import { FormattedMessage, useIntl } from 'react-intl'; // Добавляем react-intl
import backgroundImage from '../assets/backgroundImage.svg';
import './login.css';

const ROLES = {
  ADMIN: 'admin',
  OPERATOR: 'operator',
  ACCOUNTANT: 'accountant',
};

const ROUTES_BY_ROLE = {
  [ROLES.ADMIN]: '/dashboard',
  [ROLES.OPERATOR]: '/video',
  [ROLES.ACCOUNTANT]: '/report',
};

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    parkno: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { auth, login } = useAuth();
  const navigate = useNavigate();
  const intl = useIntl(); // Для доступа к переводам

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError('');
      setIsLoading(true);

      try {
        const { role } = await login(formData.username, formData.password, formData.parkno);
        toast.success(intl.formatMessage({ id: 'login.success', defaultMessage: 'Login successful' }));
        console.log(`Перенаправление на ${ROUTES_BY_ROLE[role]}`);
        navigate(ROUTES_BY_ROLE[role], { replace: true });
      } catch (err) {
        const message = err.message || intl.formatMessage({ id: 'login.error.network', defaultMessage: 'Network error. Try again later.' });
        setError(message);
        toast.error(message);
        console.error('Ошибка авторизации:', { message });
      } finally {
        setIsLoading(false);
      }
    },
    [formData, login, navigate, intl]
  );

  if (auth.isLoading) {
    return null;
  }

  return (
    <div
      className="main-color w-screen h-screen flex justify-center items-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'bottom',
      }}
    >
      <div className="bg-white rounded-xl p-12 w-full max-w-[550px] shadow-md">
        <div className="mb-4 flex justify-center">
          <img src="/Logo.svg" alt={intl.formatMessage({ id: 'login.logo.alt', defaultMessage: 'Logo' })} />
        </div>
        <form onSubmit={handleSubmit}>
          <p className="py-10 text-left text-2xl font-semibold text-gray-800 leading-6">
            <FormattedMessage id="login.title" defaultMessage="Login to the system" />
          </p>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <div className="mb-8 space-y-4">
            <div className="flex flex-col">
              <label className="mb-2 text-lg font-medium text-gray-700">
                <FormattedMessage id="login.username" defaultMessage="Username" />
              </label>
              <input
                type="text"
                name="username"
                placeholder={intl.formatMessage({ id: 'login.username.placeholder', defaultMessage: 'Username' })}
                value={formData.username}
                onChange={handleChange}
                className={`border-2 border-gray-300 px-5 py-4 rounded-lg ${formData.username ? 'bg-green-100' : 'bg-white'}`}
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-lg font-medium text-gray-700">
                <FormattedMessage id="login.password" defaultMessage="Password" />
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder={intl.formatMessage({ id: 'login.password.placeholder', defaultMessage: 'Password' })}
                  value={formData.password}
                  onChange={handleChange}
                  className={`border-2 border-gray-300 px-5 py-4 w-full rounded-lg ${formData.password ? 'bg-green-100' : 'bg-white'}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-lg font-medium text-gray-700">
                <FormattedMessage id="login.parkno" defaultMessage="Select park" />
              </label>
              <select
                name="parkno"
                value={formData.parkno}
                onChange={handleChange}
                className={`border-2 border-gray-300 px-5 py-4 rounded-lg ${formData.parkno ? 'bg-green-100' : 'bg-white'}`}
                disabled={isLoading}
              >
                <option value="">
                  {intl.formatMessage({ id: 'login.parkno.none', defaultMessage: 'None (for admin/accountant)' })}
                </option>
                <option value="P3">{intl.formatMessage({ id: 'login.parkno.p3', defaultMessage: 'P3' })}</option>
                <option value="P4">{intl.formatMessage({ id: 'login.parkno.p4', defaultMessage: 'P4' })}</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full main-color rounded-lg py-4 text-white font-semibold text-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            <FormattedMessage id="login.submit" defaultMessage={isLoading ? 'Logging in...' : 'Login'} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;