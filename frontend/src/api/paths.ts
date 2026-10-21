const API_PATHS = {
  REGISTER: "/users/register",
  LOGIN: "/users/login",
  USERS_ME: "/users/me",
  ACCOUNTS: "/accounts",
  ME: "/users/me",
  TRANSFER: "/transactions/transfer",
  LOGOUT: "/users/logout",
  TRANSACTIONS_BY_ACCOUNT_ID: (id: string) => `/transactions/account/${id}`,
  DELETE_ACCOUNT_BY_ID: (id: string) => `/accounts/${id}`,
  ACCOUNT_BY_ID: (id: string) => `/accounts/${id}`,
  ACCOUNT_UPDATE_BY_ID: (id: string) => `/accounts/${id}`,
  ALERTS: "/alerts",
  ALERT_BY_ID: (id: string) => `/alerts/${id}`,
  ALERT_STATUS: (id: string) => `/alerts/${id}/status`
};

export default API_PATHS;
