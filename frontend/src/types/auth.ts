import type React from "react";

export interface AuthInfo {
  username: string;
}

export interface AuthContextValue {
  authInfo: AuthInfo | undefined;
  updateAuthInfo: React.Dispatch<React.SetStateAction<AuthInfo | undefined>>;
}
