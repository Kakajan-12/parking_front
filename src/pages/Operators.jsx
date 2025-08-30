import { useState, useEffect } from "react";
import { TbReportAnalytics } from "react-icons/tb";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../components/AuthContext';
import { FormattedMessage, useIntl } from 'react-intl';


const Operators = () => {
  const [operators, setOperators] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOperators, setTotalOperators] = useState(0);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const limit = 10;
  const intl = useIntl();

  const formatDate = (dateStr) => {
    if (!dateStr) return intl.formatMessage({ id: "operators.noDate", defaultMessage: "No date" });
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

  const formatCurrentDate = () => {
    return new Date().toLocaleString(intl.locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).replace(/(\d{2})\.(\d{2})\.(\d{4}), (\d{2}:\d{2}:\d{2})/, "$3-$2-$1 $4");
  };

  useEffect(() => {
    if (auth.isLoading) return;

    if (!auth.isAuthenticated) {
      const message = intl.formatMessage({ id: "auth.sessionExpired", defaultMessage: "Session expired. Please log in again." });
      toast.error(message);
      navigate("/login");
      return;
    }

    if (auth.role !== 'admin') {
      const message = intl.formatMessage({ id: "auth.accessDenied", defaultMessage: "Access denied." });
      toast.error(message);
      navigate("/login");
      return;
    }

    const fetchOperators = async () => {
      setIsLoading(true);
      setError(null);
      const API_URL = import.meta.env.VITE_API_URL || "http://172.16.4.204:3000";

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        const url = `${API_URL}/api/v1/accountant/operators?${params.toString()}`;

        const response = await fetch(url, {
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
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || intl.formatMessage({ id: "error.api", defaultMessage: "API error: {status}", values: { status: response.status } }));
        }

        const data = await response.json();

        if (!data.data || data.data.length === 0) {
          toast.info(intl.formatMessage({ id: "operators.noData", defaultMessage: "No operator data found." }));
          setOperators([]);
          setTotalOperators(0);
          setTotalPages(1);
          return;
        }

        setOperators(
          data.data.map((op) => ({
            id: op.id,
            operator: op.operator,
            loginAt: formatDate(op.login_at),
            logoutAt: formatDate(op.logout_at),
            money: `${op.money || 0} TMT`,
            park: op.park,
            rawMoney: op.money || 0,
          }))
        );
        setTotalOperators(data.total || data.data.length);
        setTotalPages(data.totalPages || Math.ceil(data.total / limit) || 1);
      } catch (err) {
        const message = err.message || intl.formatMessage({ id: "login.error.network", defaultMessage: "Network error. Please try again later." });
       
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOperators();
  }, [page, auth, navigate, intl]);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(operators.map((op) => op.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleCheckbox = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
  
    const selectedOperators = operators.filter(op => selectedIds.includes(op.id));
    if (selectedOperators.length === 0) {
      toast.warn(intl.formatMessage({ id: "operators.noSelection", defaultMessage: "Please select at least one row." }));
      return;
    }
  
    // 1️⃣ Заголовки
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("TURKMENISTAN", 105, 20, { align: "center" });
  
    doc.setFontSize(14);
    doc.text("AIRLINES", 105, 28, { align: "center" });
  
    doc.setFontSize(12);
    doc.text("Parkowka Maglumatlary", 105, 36, { align: "center" });
  
    // Дата — справа сверху
    const dateStr = formatCurrentDate();
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${dateStr}`, 170, 10, { align: "right" });
  
    // 2️⃣ Таблица
    const tableColumn = ["Operator", "Park №", "Pul Mukdary", "Giren wagty", "Cykan wagty"];
  
    const tableRows = selectedOperators.map(op => [
      op.operator,
      op.park,
      op.money,
      op.loginAt,
      op.logoutAt,
    ]);
  
    autoTable(doc, {
      startY: 45,
      head: [tableColumn],
      body: tableRows,
      styles: {
        halign: "center",
        valign: "middle",
        fontSize: 10,
      },
      headStyles: {
        fillColor: [230, 230, 230],
        textColor: 0,
        fontStyle: "bold",
      },
      theme: "grid",
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.2,
    });
  
    // 3️⃣ Итоги
    const totalMoney = selectedOperators.reduce((sum, op) => sum + op.rawMoney, 0);
    const afterTableY = doc.lastAutoTable.finalY + 10;
  
    doc.setFontSize(12);
    doc.text(`Jemi: ${totalMoney.toFixed(2)} TMT`, 14, afterTableY);
  
    doc.text("Kassir: ________________", 14, afterTableY + 10);
  
    // 4️⃣ Сохранить
    doc.save("operators-report.pdf");
  };
  

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      setSelectedIds([]);
      setSelectAll(false);
    }
  };

  const pageNumbers = [];
  const maxPagesToShow = 5;
  const startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (auth.isLoading) {
    return (
      <div className="bg-white rounded-br-2xl rounded-bl-2xl p-4 h-[93%] text-center text-gray-600">
        <FormattedMessage id="dashboard.loading" defaultMessage="Loading..." />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-br-2xl rounded-bl-2xl p-4 h-[93%]">
      <div className="flex justify-end w-full">
        <button
          onClick={downloadPDF}
          className="flex items-center p-2 rounded-3xl main-color"
        >
          <TbReportAnalytics size={25} color="white" />
          <span className="text-white ml-2">
            <FormattedMessage id="operators.downloadPDF" defaultMessage="Download PDF Report" />
          </span>
        </button>
      </div>
      <div className="bg-white mt-2 flex flex-col h-[95%]">
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="text-center p-4 text-gray-600">
              <FormattedMessage id="dashboard.loading" defaultMessage="Loading..." />
            </div>
          ) : error ? (
            <div className="text-center p-4 text-red-600">{error}</div>
          ) : operators.length === 0 ? (
            <div className="text-center p-4 text-gray-600">
              <FormattedMessage id="operators.noData" defaultMessage="No operator data found." />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 sticky top-0">
                <tr className="text-black text-md">
                  <th className="p-3">
                    <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                  </th>
                  <th className="p-3">
                    <FormattedMessage id="operators.table.operator" defaultMessage="Operator" />
                  </th>
                  <th className="p-3">
                    <FormattedMessage id="operators.table.loginAt" defaultMessage="Login Time" />
                  </th>
                  <th className="p-3">
                    <FormattedMessage id="operators.table.logoutAt" defaultMessage="Logout Time" />
                  </th>
                  <th className="p-3">
                    <FormattedMessage id="operators.table.money" defaultMessage="Amount" />
                  </th>
                  <th className="p-3">
                    <FormattedMessage id="operators.table.park" defaultMessage="Parking" />
                  </th>
                </tr>
              </thead>
              <tbody className="text-black text-sm">
                {operators.map((op) => (
                  <tr key={op.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(op.id)}
                        onChange={() => toggleCheckbox(op.id)}
                      />
                    </td>
                    <td className="p-3">{op.operator}</td>
                    <td className="p-3">{op.loginAt}</td>
                    <td className="p-3">{op.logoutAt}</td>
                    <td className="p-3">{op.money}</td>
                    <td className="p-3">{op.park}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="text-sm text-gray-700 p-2 font-semibold border-t flex justify-between">
          <div>
            <FormattedMessage
              id="operators.totalLogs"
              defaultMessage="Total Logs: {count}"
              values={{ count: totalOperators }}
            />
          </div>
          <div className="space-x-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || totalPages === 1}
              className={`border border-gray-400 p-1 rounded-md ${
                page === 1 || totalPages === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FormattedMessage id="operators.prev" defaultMessage="Prev" />
            </button>
            {pageNumbers.map((num) => (
              <button
                key={num}
                onClick={() => handlePageChange(num)}
                className={`rounded-md p-1 w-8 ${
                  page === num ? "main-color text-white" : "border border-gray-400"
                }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages || totalPages === 1}
              className={`border border-gray-400 p-1 rounded-md ${
                page === totalPages || totalPages === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FormattedMessage id="operators.next" defaultMessage="Next" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Operators;