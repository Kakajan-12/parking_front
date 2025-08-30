import { TbReportAnalytics } from "react-icons/tb";
import { GoTrash } from "react-icons/go";
import { MdAccountCircle } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../components/AuthContext';
import { FormattedMessage, useIntl } from 'react-intl';

const Users = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const intl = useIntl();
  const limit = 10;

  const initialFormData = {
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    status: 'active',
    role: '',
    park_no: '',
  };
  const [formData, setFormData] = useState(initialFormData);

  const resetForm = () => {
    setFormData(initialFormData);
    setEditUserId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      toast.warn(intl.formatMessage({ id: 'users.validation.usernameRequired', defaultMessage: 'Username is required.' }));
      return false;
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      toast.warn(intl.formatMessage({ id: 'users.validation.usernameFormat', defaultMessage: 'Username must be 3-20 characters long and contain only letters, numbers, or underscores.' }));
      return false;
    }
    if (!formData.role.trim()) {
      toast.warn(intl.formatMessage({ id: 'users.validation.roleRequired', defaultMessage: 'Role is required.' }));
      return false;
    }
    if (!['admin', 'accountant', 'operator'].includes(formData.role)) {
      toast.warn(intl.formatMessage({ id: 'users.validation.invalidRole', defaultMessage: 'Invalid role selected.' }));
      return false;
    }
    if (formData.role === 'operator' && !formData.park_no.trim()) {
      toast.warn(intl.formatMessage({ id: 'users.validation.parkNoRequired', defaultMessage: 'Parking number is required for operator role.' }));
      return false;
    }
    if (formData.park_no && !['P3', 'P4'].includes(formData.park_no)) {
      toast.warn(intl.formatMessage({ id: 'users.validation.invalidParkNo', defaultMessage: 'Invalid parking number.' }));
      return false;
    }
    if (!editUserId && !formData.password.trim()) {
      toast.warn(intl.formatMessage({ id: 'users.validation.passwordRequired', defaultMessage: 'Password is required for new users.' }));
      return false;
    }
    if (formData.password && formData.password.length < 8) {
      toast.warn(intl.formatMessage({ id: 'users.validation.passwordLength', defaultMessage: 'Password must be at least 8 characters long.' }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const API_URL = import.meta.env.VITE_API_URL || "http://172.16.4.204:3000";
    const url = editUserId ? `${API_URL}/api/v1/users/${editUserId}` : `${API_URL}/api/v1/users`;
    const method = editUserId ? "PUT" : "POST";

    try {
      const body = {
        firstname: formData.firstName.trim() || undefined,
        lastname: formData.lastName.trim() || undefined,
        username: formData.username.trim(),
        isActive: formData.status === "active",
        role: formData.role,
        ...(formData.park_no && { park_no: formData.park_no }),
      };
      if (!editUserId || formData.password) {
        body.password = formData.password;
      }


      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (response.status === 401) {
        toast.error(intl.formatMessage({ id: 'auth.sessionExpired', defaultMessage: 'Session expired. Please log in again.' }));
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const text = await response.text();
        const errorData = JSON.parse(text).catch(() => ({}));
        throw new Error(errorData.message || intl.formatMessage({ id: 'users.error', defaultMessage: 'Error: {status}' }, { status: response.status }));
      }

      const updatedUser = await response.json();
      const formattedUser = {
        id: updatedUser.data?.id || updatedUser.id,
        firstname: updatedUser.data?.firstname || updatedUser.firstname || '',
        lastname: updatedUser.data?.lastname || updatedUser.lastname || '',
        username: updatedUser.data?.username || updatedUser.username,
        isActive: updatedUser.data?.isActive ?? updatedUser.isActive,
        role: updatedUser.data?.role || updatedUser.role,
        park_no: updatedUser.data?.park_no || updatedUser.park_no || '',
      };

      setUsers((prev) => {
        if (editUserId) {
          return prev.map((user) => (user.id === editUserId ? formattedUser : user));
        } else {
          return [formattedUser, ...prev.slice(0, limit - 1)];
        }
      });

      if (!editUserId) {
        setTotalUsers((prev) => prev + 1);
        setTotalPages((prev) => Math.ceil((prev * limit + 1) / limit));
      }

      toast.success(intl.formatMessage({ id: editUserId ? 'users.success.updated' : 'users.success.added', defaultMessage: editUserId ? 'User updated successfully.' : 'User added successfully.' }));
      setModalOpen(false);
      resetForm();
      setSelectedIds([]);
      setSelectAll(false);
      setPage(1);
    } catch (err) {
     
      toast.error(intl.formatMessage({ id: 'users.error', defaultMessage: 'An error occurred.' }));
    }
  };

  const handleEdit = (user) => {
    setFormData({
      firstName: user.firstname || '',
      lastName: user.lastname || '',
      username: user.username || '',
      password: '',
      status: user.isActive ? 'active' : 'inactive',
      role: user.role || '',
      park_no: user.park_no || '',
    });
    setEditUserId(user.id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(intl.formatMessage({ id: 'users.deleteConfirm', defaultMessage: 'Are you sure you want to delete this user?' }))) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://172.16.4.204:3000";
      const response = await fetch(`${API_URL}/api/v1/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include",
      });

      if (response.status === 401) {
        toast.error(intl.formatMessage({ id: 'auth.sessionExpired', defaultMessage: 'Session expired. Please log in again.' }));
        navigate("/login");
        return;
      }

      if (response.ok) {
        setUsers((prev) => prev.filter((user) => user.id !== id));
        setTotalUsers((prev) => prev - 1);
        setTotalPages((prev) => Math.ceil((prev * limit - 1) / limit) || 1);
        setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
        setSelectAll(false);
        toast.success(intl.formatMessage({ id: 'users.success.deleted', defaultMessage: 'User deleted successfully.' }));
        if (users.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        }
      } else {
        const text = await response.text();
        const errorData = JSON.parse(text).catch(() => ({}));
        throw new Error(errorData.message || intl.formatMessage({ id: 'users.error', defaultMessage: 'Error: {status}' }, { status: response.status }));
      }
    } catch (err) {
     
      toast.error(intl.formatMessage({ id: 'users.error', defaultMessage: 'An error occurred.' }));
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map((user) => user.id));
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

  useEffect(() => {
    if (auth.isLoading) return;

    if (!auth.isAuthenticated) {
      toast.error(intl.formatMessage({ id: 'auth.sessionExpired', defaultMessage: 'Session expired. Please log in again.' }));
      navigate("/login");
      return;
    }

    if (auth.role !== 'admin') {
      toast.error(intl.formatMessage({ id: 'auth.accessDenied', defaultMessage: 'Access denied.' }));
      navigate("/report");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const API_URL = import.meta.env.VITE_API_URL || "http://172.16.4.204:3000";

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        const url = `${API_URL}/api/v1/users?${params.toString()}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          credentials: "include",
        });

        if (response.status === 401) {
          setError(intl.formatMessage({ id: 'auth.sessionExpired', defaultMessage: 'Session expired. Please log in again.' }));
          toast.error(intl.formatMessage({ id: 'auth.sessionExpired', defaultMessage: 'Session expired. Please log in again.' }));
          navigate("/login");
          return;
        }

        if (!response.ok) {
          const text = await response.text();
          const errorData = JSON.parse(text).catch(() => ({}));
          throw new Error(errorData.message || intl.formatMessage({ id: 'users.error', defaultMessage: 'Error: {status}' }, { status: response.status }));
        }

        const data = await response.json();

        if (!data.users || data.users.length === 0) {
          toast.info(intl.formatMessage({ id: 'users.noUsers', defaultMessage: 'No users found.' }));
          setUsers([]);
          setTotalUsers(0);
          setTotalPages(1);
          return;
        }

        setUsers(data.users);
        setTotalUsers(data.total || data.users.length);
        setTotalPages(data.totalPages || Math.ceil(data.total / limit) || 1);
      } catch (err) {
        
        setError(intl.formatMessage({ id: 'users.error', defaultMessage: 'An error occurred.' }));
        toast.error(intl.formatMessage({ id: 'users.error', defaultMessage: 'An error occurred.' }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, auth, navigate, intl]);

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
    return null;
  }

  return (
    <div className="bg-white rounded-br-2xl rounded-bl-2xl p-4" style={{ height: "93%" }}>
      <div className="flex flex-col h-full">
        <div className="flex justify-end items-center mb-5">
          <button
            className="px-4 py-2 main-color rounded-3xl flex space-x-2"
            onClick={() => setModalOpen(true)}
          >
            <TbReportAnalytics size={25} color="white" />
            <div className="text-white">
              <FormattedMessage id="users.create" defaultMessage="Create User" />
            </div>
          </button>
        </div>
        <div className="bg-white mt-2 flex flex-col" style={{ height: "100%" }}>
          <div className="flex-1 overflow-auto">
            {isLoading ? (
              <div className="text-center p-4">
                <FormattedMessage id="users.loading" defaultMessage="Loading..." />
              </div>
            ) : error ? (
              <div className="text-center p-4 text-red-500">{error}</div>
            ) : users.length === 0 ? (
              <div className="text-center p-4">
                <FormattedMessage id="users.noUsers" defaultMessage="No users found." />
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 sticky top-0">
                  <tr className="text-black text-sm">
                    <th className="p-3">
                      <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                    </th>
                    <th className="p-3"><FormattedMessage id="users.photo" defaultMessage="Photo" /></th>
                    <th className="p-3"><FormattedMessage id="users.firstName" defaultMessage="First Name" /></th>
                    <th className="p-3"><FormattedMessage id="users.lastName" defaultMessage="Last Name" /></th>
                    <th className="p-3"><FormattedMessage id="users.username" defaultMessage="Username" /></th>
                    <th className="p-3"><FormattedMessage id="users.status" defaultMessage="Status" /></th>
                    <th className="p-3"><FormattedMessage id="users.role" defaultMessage="Role" /></th>
                    <th className="p-3"><FormattedMessage id="users.park_no" defaultMessage="Parking No" /></th>
                    <th className="p-3 text-center"><FormattedMessage id="users.actions" defaultMessage="Actions" /></th>
                  </tr>
                </thead>
                <tbody className="text-black text-sm">
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(user.id)}
                          onChange={() => toggleCheckbox(user.id)}
                        />
                      </td>
                      <td className="p-3"><MdAccountCircle size={25} /></td>
                      <td className="p-3">{user.firstname}</td>
                      <td className="p-3">{user.lastname}</td>
                      <td className="p-3">{user.username}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          <FormattedMessage id={user.isActive ? 'users.active' : 'users.inactive'} defaultMessage={user.isActive ? 'Active' : 'Inactive'} />
                        </span>
                      </td>
                      <td className="p-3">{user.role}</td>
                      <td className="p-3">{user.park_no || '-'}</td>
                      <td className="p-3 flex items-center justify-around w-full">
                        <button className="w-fit" onClick={() => handleEdit(user)}>
                          <BiSolidEdit size={25} className="text-blue-400" />
                        </button>
                        <button className="w-fit" onClick={() => handleDelete(user.id)}>
                          <GoTrash size={25} color="red" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="text-sm text-gray-700 p-2 font-semibold border-t flex justify-between">
            <div>
              <FormattedMessage id="users.totalUsers" defaultMessage="Total Users: {count}" values={{ count: totalUsers }} />
            </div>
            <div className="space-x-2 flex items-center">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || totalPages === 1}
                className={`border border-gray-400 p-1 rounded-md ${
                  page === 1 || totalPages === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FormattedMessage id="users.prev" defaultMessage="Prev" />
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
                <FormattedMessage id="users.next" defaultMessage="Next" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white rounded-lg shadow p-6 w-[500px]">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-black hover:text-gray-900 text-sm p-1.5"
              onClick={handleCloseModal}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <h3 className="text-lg font-medium mb-4 text-black">
              <FormattedMessage id={editUserId ? 'users.editUser' : 'users.addUser'} defaultMessage={editUserId ? 'Edit User' : 'Add User'} />
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <MdAccountCircle size={80} className="text-black" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <input
                  type="text"
                  name="firstName"
                  placeholder={intl.formatMessage({ id: 'users.firstName', defaultMessage: 'First Name' })}
                  className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder={intl.formatMessage({ id: 'users.lastName', defaultMessage: 'Last Name' })}
                  className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <input
                  type="text"
                  name="username"
                  placeholder={intl.formatMessage({ id: 'users.username', defaultMessage: 'Username' })}
                  className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={formData.username}
                  onChange={handleChange}
                />
                <select
                  name="status"
                  className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active"><FormattedMessage id="users.active" defaultMessage="Active" /></option>
                  <option value="inactive"><FormattedMessage id="users.inactive" defaultMessage="Inactive" /></option>
                </select>
              </div>

              <select
                name="role"
                className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-5"
                value={formData.role}
                onChange={handleChange}
              >
                <option value=""><FormattedMessage id="users.selectRole" defaultMessage="Select Role" /></option>
                <option value="admin">Admin</option>
                <option value="accountant">Accountant</option>
                <option value="operator">Operator</option>
              </select>

              <select
                name="park_no"
                className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-5"
                value={formData.park_no}
                onChange={handleChange}
                disabled={formData.role !== 'operator'}
              >
                <option value=""><FormattedMessage id="users.selectParking" defaultMessage="Select Parking" /></option>
                <option value="P3">P3</option>
                <option value="P4">P4</option>
              </select>

              <input
                type="password"
                name="password"
                placeholder={intl.formatMessage({ id: editUserId ? 'users.newPassword' : 'users.password', defaultMessage: editUserId ? 'New Password (if needed)' : 'Password' })}
                className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-5"
                value={formData.password}
                onChange={handleChange}
              />

              <button
                type="submit"
                className="w-full border border-gray-300 py-2 rounded-lg"
              >
                <FormattedMessage id={editUserId ? 'users.update' : 'users.save'} defaultMessage={editUserId ? 'Update' : 'Save'} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;