import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  return token?.length !== 0 ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
