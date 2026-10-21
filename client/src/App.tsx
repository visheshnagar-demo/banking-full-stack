import { message } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import React, { useMemo, useState } from "react";
import { useRoutes } from "react-router-dom";
import "./App.scss";
import useAuth from "./hooks/useAuth";
import { routes } from "./routes";
import type { AuthContextValue, AuthInfo } from "./types/auth";

export const MessageContext = React.createContext<MessageInstance | undefined>(undefined);
export const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

function App() {
  const [authInfo, updateAuthInfo] = useState<AuthInfo>();

  const route = useRoutes(routes);

  const [messageApi, contextHolder] = message.useMessage();

  const { isLoadingAuth } = useAuth(updateAuthInfo);

  const authMemo = useMemo<AuthContextValue>(() => {
    return {
      authInfo,
      updateAuthInfo
    };
  }, [authInfo]);

  if (isLoadingAuth) return null;

  return (
    <MessageContext.Provider value={messageApi}>
      <AuthContext.Provider value={authMemo}>
        {contextHolder}
        {route}
      </AuthContext.Provider>
    </MessageContext.Provider>
  );
}

export default App;
