import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    // const isAuth = localStorage.getItem("token");
    // return isAuth ? <Outlet /> : <Navigate to="/login" />;
    const isAuth = true
    return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
