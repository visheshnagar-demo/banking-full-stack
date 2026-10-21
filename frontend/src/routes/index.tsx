import { Navigate, type RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoutes";
import PublicRoute from "../components/auth/PublicRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import Accounts from "../pages/dashboard/Accounts/Accounts";
import FraudAlertsPage from "../pages/dashboard/FraudAlerts/FraudAlertsPage";

export const routes: RouteObject[] = [
  {
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> }
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { element: <Navigate to="accounts" />, index: true },
          { path: "accounts", element: <Accounts /> },
          { path: "alerts", element: <FraudAlertsPage /> },
          { path: "profile", element: <>Profile</> }
        ]
      }
    ]
  },
  { path: "*", element: <Navigate to="/login" /> }
];

export default routes;
