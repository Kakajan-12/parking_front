import { TbReportAnalytics } from "react-icons/tb";
import { GoTrash } from "react-icons/go";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { FormattedMessage, useIntl } from "react-intl";

const Report = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [allTariffs, setAllTariffs] = useState([]); // Все загруженные тарифы
  const [filteredTariffs, setFilteredTariffs] = useState([]); // Отфильтрованные тарифы
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalTariffs, setTotalTariffs] = useState(0);
  const [filterPeriod, setFilterPeriod] = useState("all"); // 'all', 'week', 'month'
  const { auth } = useAuth();
  const navigate = useNavigate();
  const intl = useIntl();
  const limit = 10;

  const initialFormData = {
    carNumber: "",
    firstName: "",
    lastName: "",
    startTime: null,
    endTime: null,
    price: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  const formatDate = (dateStr) => {
    if (!dateStr) return intl.formatMessage({ id: "report.noDate", defaultMessage: "No date" });
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleString(intl.locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (field, date) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: date,
    }));
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        intl.formatMessage({ id: "report.deleteConfirm", defaultMessage: "Are you sure you want to delete this tariff?" })
      )
    )
      return;
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://172.16.4.204:3000";
      const response = await fetch(`${API_URL}/api/v1/accountant/tarif/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include",
      });

      if (response.status === 401) {
        const message = intl.formatMessage({ id: "auth.sessionExpired", defaultMessage: "Session expired. Please log in again." });
        toast.error(message);
        navigate("/login");
        return;
      }

      if (response.ok) {
        // Обновляем списки после удаления
        setAllTariffs((prev) => prev.filter((tariff) => tariff.id !== id));
        setFilteredTariffs((prev) => prev.filter((tariff) => tariff.id !== id));
        setTotalTariffs((prev) => prev - 1);
        toast.success(intl.formatMessage({ id: "report.success.deleted", defaultMessage: "Tariff deleted successfully." }));
        setPage(1);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
          intl.formatMessage({ id: "error.api", defaultMessage: "API error: {status}", values: { status: response.status } })
        );
      }
    } catch (err) {
      const message = err.message || intl.formatMessage({ id: "login.error.network", defaultMessage: "Network error. Please try again later." });
      
      toast.error(message);
    }
  };

  // Загрузка всех данных
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const API_URL = import.meta.env.VITE_API_URL || "http://172.16.4.204:3000";
      let allData = [];

      try {
        if (auth.role === "admin") {
          const parks = ["P3", "P4"];
          for (const park_no of parks) {
            let currentPage = 1;
            let hasMore = true;

            while (hasMore) {
              const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: limit.toString(),
                park_no,
              });

              const response = await fetch(`${API_URL}/api/v1/accountant/tarif?${params.toString()}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json",
                },
                credentials: "include",
              });

              if (response.status === 401) {
                const message = intl.formatMessage({ id: "auth.sessionExpired", defaultMessage: "Session expired. Please log in again." });
                setError(message);
                toast.error(message);
                navigate("/login");
                return;
              }

              if (!response.ok) {
                const text = await response.text();
                const errorData = JSON.parse(text).catch(() => ({}));
                throw new Error(
                  errorData.message ||
                  intl.formatMessage({ id: "error.api", defaultMessage: "API error: {status}", values: { status: response.status } })
                );
              }

              const data = await response.json();

              if (data.data && data.data.length > 0) {
                const formatted = data.data.map((item) => ({
                  id: item.id,
                  name: item.name,
                  number: item.plate,
                  startTime: item.start_time,
                  endTime: item.end_time,
                  price: `${item.price} TMT`,
                  rawPrice: item.price || 0,
                }));

                allData = [...allData, ...formatted];
                currentPage++;
                if (currentPage > (data.totalPages || 1)) hasMore = false;
              } else {
                hasMore = false;
              }
            }
          }
        } else {
          let currentPage = 1;
          let hasMore = true;

          while (hasMore) {
            const params = new URLSearchParams({
              page: currentPage.toString(),
              limit: limit.toString(),
              park_no: auth.parkno,
            });

            const response = await fetch(`${API_URL}/api/v1/accountant/tarif?${params.toString()}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
              },
              credentials: "include",
            });

            if (response.status === 401) {
              const message = intl.formatMessage({ id: "auth.sessionExpired", defaultMessage: "Session expired. Please log in again." });
              setError(message);
              toast.error(message);
              navigate("/login");
              return;
            }

            if (!response.ok) {
              const text = await response.text();
              const errorData = JSON.parse(text).catch(() => ({}));
              throw new Error(
                errorData.message ||
                intl.formatMessage({ id: "error.api", defaultMessage: "API error: {status}", values: { status: response.status } })
              );
            }

            const data = await response.json();

            if (data.data && data.data.length > 0) {
              const formatted = data.data.map((item) => ({
                id: item.id,
                name: item.name,
                number: item.plate,
                startTime: item.start_time,
                endTime: item.end_time,
                price: `${item.price} TMT`,
                rawPrice: item.price || 0,
              }));

              allData = [...allData, ...formatted];
              currentPage++;
              if (currentPage > (data.totalPages || 1)) hasMore = false;
            } else {
              hasMore = false;
            }
          }
        }

        if (isMounted) {
          const unique = Array.from(new Map(allData.map((item) => [item.id, item])).values());
          setAllTariffs(unique);
          setFilteredTariffs(unique);
          setTotalTariffs(unique.length);
        }
      } catch (err) {
        const message = err.message || intl.formatMessage({ id: "login.error.network", defaultMessage: "Network error. Please try again later." });
       
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [auth, navigate, intl]);

  // Фильтрация при изменении периода
  useEffect(() => {
    let filtered = allTariffs;

    if (filterPeriod === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = allTariffs.filter((t) => new Date(t.startTime) >= weekAgo);
    } else if (filterPeriod === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = allTariffs.filter((t) => new Date(t.startTime) >= monthAgo);
    }

    setFilteredTariffs(filtered);
    setPage(1);
  }, [filterPeriod, allTariffs]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(filteredTariffs.length / limit)) {
      setPage(newPage);
    }
  };

  const totalPagesCount = Math.ceil(filteredTariffs.length / limit);
  const pageNumbers = [];
  const maxPagesToShow = 5;
  const startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPagesCount, startPage + maxPagesToShow - 1);
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.carNumber.trim()) {
      toast.warn(intl.formatMessage({ id: "report.validation.carNumberRequired", defaultMessage: "Car number is required." }));
      return;
    }
    const name = `${formData.firstName} ${formData.lastName}`.trim();
    if (!name) {
      toast.warn(intl.formatMessage({ id: "report.validation.nameRequired", defaultMessage: "Name is required." }));
      return;
    }
    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    if (formData.startTime && formData.endTime && start >= end) {
      toast.warn(intl.formatMessage({ id: "report.validation.invalidDate", defaultMessage: "Start time must be before end time." }));
      return;
    }
    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      toast.warn(intl.formatMessage({ id: "report.validation.invalidPrice", defaultMessage: "Price must be a positive number." }));
      return;
    }

    function convertToServerFormat(date) {
      if (!date) return null;
      const d = new Date(date);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const hh = String(d.getHours()).padStart(2, "0");
      const min = String(d.getMinutes()).padStart(2, "0");
      const ss = String(d.getSeconds()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    }

    const body = {
      plate: formData.carNumber.trim(),
      name: name,
      start_time: convertToServerFormat(formData.startTime),
      end_time: convertToServerFormat(formData.endTime),
      price: parseFloat(formData.price),
      ...(auth.role === "accountant" && auth.parkno && { park_no: auth.parkno }),
    };

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://172.16.4.204:3000";
      const response = await fetch(`${API_URL}/api/v1/accountant/tarif`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (response.status === 401) {
        const message = intl.formatMessage({ id: "auth.sessionExpired", defaultMessage: "Session expired. Please log in again." });
        toast.error(message);
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const text = await response.text();
        const errorData = JSON.parse(text).catch(() => ({}));
        throw new Error(
          errorData.message ||
          intl.formatMessage({ id: "error.api", defaultMessage: "API error: {status}", values: { status: response.status } })
        );
      }

      const newTariff = await response.json();
      const formattedTariff = {
        id: newTariff.data?.id || newTariff.id, // Поддержка разных структур ответа API
        name: newTariff.data?.name || newTariff.name,
        number: newTariff.data?.plate || newTariff.plate,
        startTime: newTariff.data?.start_time || newTariff.start_time,
        endTime: newTariff.data?.end_time || newTariff.end_time,
        price: `${newTariff.data?.price || newTariff.price} TMT`,
        rawPrice: newTariff.data?.price || newTariff.price || 0,
      };

      // Обновляем состояния
      setAllTariffs((prev) => [formattedTariff, ...prev]);
      setFilteredTariffs((prev) => {
        let updated = [formattedTariff, ...prev];
        if (filterPeriod === "week") {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          updated = updated.filter((t) => new Date(t.startTime) >= weekAgo);
        } else if (filterPeriod === "month") {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          updated = updated.filter((t) => new Date(t.startTime) >= monthAgo);
        }
        return updated;
      });
      setTotalTariffs((prev) => prev + 1);

      toast.success(intl.formatMessage({ id: "report.success.added", defaultMessage: "Tariff added successfully." }));
      setModalOpen(false); // Закрываем модальное окно
      resetForm();
      setPage(1);
    } catch (err) {
      const message = err.message || intl.formatMessage({ id: "login.error.network", defaultMessage: "Network error. Please try again later." });
      
      toast.error(message);
    }
  };

  if (auth.isLoading) {
    return (
      <div className="bg-white rounded-br-2xl rounded-bl-2xl p-4 h-[93%] text-center text-gray-600">
        <FormattedMessage id="dashboard.loading" defaultMessage="Loading..." />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-br-2xl rounded-bl-2xl p-4 h-[93%]">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-5">
          <div className="font-bold text-2xl text-black">
            <FormattedMessage
              id="report.totalAmount"
              defaultMessage="Total Amount: {amount} TMT"
              values={{
                amount: filteredTariffs.reduce((acc, t) => acc + t.rawPrice, 0).toFixed(2),
              }}
            />
          </div>

          {/* Выпадающий список с фильтрами */}
          <div className="flex items-center space-x-4">
            <select
              value={filterPeriod}
              onChange={(e) => {
                setFilterPeriod(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 rounded-md p-2 mr-4"
            >
              <option value="all">Все записи</option>
              <option value="week">Последняя неделя</option>
              <option value="month">Последний месяц</option>
            </select>

            <button
              className="px-4 py-2 main-color rounded-3xl flex space-x-2"
              onClick={() => setModalOpen(true)}
            >
              <TbReportAnalytics size={25} color="white" />
              <span className="text-white">
                <FormattedMessage id="report.add" defaultMessage="Add Tariff" />
              </span>
            </button>
          </div>
        </div>

        {/* Таблица с данными */}
        <div className="bg-white mt-2 flex flex-col h-[100%]">
          <div className="flex-1 overflow-auto">
            {isLoading ? (
              <div className="text-center p-4 text-black">
                <FormattedMessage id="dashboard.loading" defaultMessage="Loading..." />
              </div>
            ) : error ? (
              <div className="text-center p-4 text-red-600">{error}</div>
            ) : filteredTariffs.length === 0 ? (
              <div className="text-center p-4 text-black">
                <FormattedMessage id="report.noTariffs" defaultMessage="No tariffs found." />
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 sticky top-0">
                  <tr className="text-black text-md">
                    <th className="p-3">
                      <FormattedMessage id="report.table.id" defaultMessage="№" />
                    </th>
                    <th className="p-3">
                      <FormattedMessage id="report.firstName" defaultMessage="Name" />
                    </th>
                    <th className="p-3">
                      <FormattedMessage id="report.carNumber" defaultMessage="Car Number" />
                    </th>
                    <th className="p-3">
                      <FormattedMessage id="report.startTime" defaultMessage="Start Time" />
                    </th>
                    <th className="p-3">
                      <FormattedMessage id="report.endTime" defaultMessage="End Time" />
                    </th>
                    <th className="p-3">
                      <FormattedMessage id="report.price" defaultMessage="Price" />
                    </th>
                    <th className="p-3 text-center">
                      <FormattedMessage id="report.actions" defaultMessage="Actions" />
                    </th>
                  </tr>
                </thead>
                <tbody className="text-black text-sm">
                  {filteredTariffs.slice((page - 1) * limit, page * limit).map((tariff, index) => (
                    <tr key={tariff.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{(page - 1) * limit + index + 1}</td>
                      <td className="p-3">{tariff.name}</td>
                      <td className="p-3">{tariff.number}</td>
                      <td className="p-3">{formatDate(tariff.startTime)}</td>
                      <td className="p-3">{formatDate(tariff.endTime)}</td>
                      <td className="p-3">{tariff.price}</td>
                      <td className="p-3 flex items-center justify-center w-full">
                        <button className="w-fit" onClick={() => handleDelete(tariff.id)}>
                          <GoTrash size={25} color="red" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Пагинация и общее количество записей */}
          <div className="text-sm text-gray-700 p-2 font-semibold border-t flex justify-between">
            <div>
              <FormattedMessage
                id="report.totalLogs"
                defaultMessage="Total Logs: {count}"
                values={{ count: totalTariffs }}
              />
            </div>
            <div className="space-x-2 flex items-center">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || totalPagesCount === 0}
                className={`border border-gray-400 p-1 rounded-md ${
                  page === 1 || totalPagesCount === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FormattedMessage id="report.prev" defaultMessage="Prev" />
              </button>
              {pageNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => handlePageChange(num)}
                  className={`rounded-md p-1 w-8 ${page === num ? "main-color text-white" : "border border-gray-400"}`}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPagesCount || totalPagesCount === 0}
                className={`border border-gray-400 p-1 rounded-md ${
                  page === totalPagesCount || totalPagesCount === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FormattedMessage id="report.next" defaultMessage="Next" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 border-2 border-black">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-black">
              <FormattedMessage id="report.addTariff" defaultMessage="Add New Tariff" />
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Поле для номера машины */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-black">
                  <FormattedMessage id="report.carNumber" defaultMessage="Car Number" />
                </label>
                <input
                  type="text"
                  name="carNumber"
                  value={formData.carNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-black rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder={intl.formatMessage({ id: "report.carNumberPlaceholder", defaultMessage: "Enter car number" })}
                />
              </div>

              {/* Поле для имени */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-black">
                  <FormattedMessage id="report.firstName" defaultMessage="First Name" />
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-black rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder={intl.formatMessage({ id: "report.firstNamePlaceholder", defaultMessage: "Enter first name" })}
                />
              </div>

              {/* Поле для фамилии */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-black">
                  <FormattedMessage id="report.lastName" defaultMessage="Last Name" />
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-black rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder={intl.formatMessage({ id: "report.lastNamePlaceholder", defaultMessage: "Enter last name" })}
                />
              </div>

              {/* Поле для времени начала */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-black">
                  <FormattedMessage id="report.startTime" defaultMessage="Start Time" />
                </label>
                <DatePicker
                  selected={formData.startTime}
                  onChange={(date) => handleDateChange("startTime", date)}
                  showTimeSelect
                  dateFormat="dd.MM.yyyy HH:mm"
                  className="mt-1 block w-full border border-black rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholderText={intl.formatMessage({ id: "report.startTimePlaceholder", defaultMessage: "Select start time" })}
                />
              </div>

              {/* Поле для времени окончания */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-black">
                  <FormattedMessage id="report.endTime" defaultMessage="End Time" />
                </label>
                <DatePicker
                  selected={formData.endTime}
                  onChange={(date) => handleDateChange("endTime", date)}
                  showTimeSelect
                  dateFormat="dd.MM.yyyy HH:mm"
                  className="mt-1 block w-full border border-black rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholderText={intl.formatMessage({ id: "report.endTimePlaceholder", defaultMessage: "Select end time" })}
                />
              </div>

              {/* Поле для цены */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-black">
                  <FormattedMessage id="report.price" defaultMessage="Price" />
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-black rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder={intl.formatMessage({ id: "report.pricePlaceholder", defaultMessage: "Enter price (TMT)" })}
                  step="0.01"
                />
              </div>

              {/* Кнопки */}
              <div className="flex justify-between space-x-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  style={{ color: "red" }}
                >
                  <FormattedMessage id="report.cancel" defaultMessage="Cancel" />
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 main-color text-white rounded-md hover:bg-blue-600"
                >
                  <FormattedMessage id="report.submit" defaultMessage="Add Tariff" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;