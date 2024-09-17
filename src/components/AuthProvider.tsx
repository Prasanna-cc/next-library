"use client";

import { SessionProvider } from "next-auth/react";

interface AuthProviderProps extends React.PropsWithChildren {}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};
