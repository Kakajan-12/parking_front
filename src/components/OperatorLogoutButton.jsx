import React, { useState } from 'react';
import { useIntl } from 'react-intl';

const OperatorLogoutButton = ({ shiftProfit, auth, navigate }) => {
  const intl = useIntl();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const saveOperatorSession = async (operatorData) => {
    const API_URL = import.meta.env.VITE_API_URL || "http://172.16.4.204:3000";
    
    const sessionData = {
      login_at: localStorage.getItem("operatorLoginTime") || new Date().toISOString(),
      logout_at: new Date().toISOString(),
      money: operatorData.totalEarnings || 0,
      operator: operatorData.operatorName || auth.user?.username || "unknown",
      park: operatorData.parkNumber || auth.parkno || "unknown"
    };

    try {
      const response = await fetch(`${API_URL}/api/v1/accountant/operators`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(sessionData)
      });
      
      return response.json();
    } catch (error) {
      console.error("Error saving operator session:", error);
      throw error;
    }
  };

  const handleLogout = async () => {
    const shouldLogout = window.confirm(
      intl.formatMessage({ id: "video.logout.confirm", defaultMessage: "Save earnings and exit?" })
    );
    
    if (!shouldLogout) return;

    setIsLoggingOut(true);
    
    try {
      await saveOperatorSession({
        operatorName: auth.user?.username || auth.user?.email,
        parkNumber: auth.parkno,
        totalEarnings: shiftProfit
      });
      
      localStorage.removeItem("shiftProfit");
      localStorage.removeItem("operatorLoginTime");
      
      navigate("/login");
      
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`
        px-4 py-2 rounded-lg font-medium transition-all
        ${isLoggingOut 
          ? 'bg-gray-400 cursor-not-allowed text-white' 
          : 'bg-red-500 hover:bg-red-600 text-white shadow-md'}
      `}
    >
      {isLoggingOut ? "Saving..." : "💾 Exit & Save"}
    </button>
  );
};

export default OperatorLogoutButton;