// components/ProtectedRoute.tsx
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../App";

const ProtectedRoute = () => {
  const authValue = useContext(AuthContext);

  return authValue?.authInfo ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
