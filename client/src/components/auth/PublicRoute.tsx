import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../App";

const PublicRoute = () => {
  const authValue = useContext(AuthContext);

  return authValue?.authInfo ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicRoute;
