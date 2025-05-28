"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { UserType } from "../types/userTypes";

type AppContextType = {
  isShadowOpen: boolean;
  setIsShadowOpen: (value: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (value: boolean) => void;
  user: UserType;
  setUser: (u: UserType) => void;
  isLogin: boolean;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({
  children,
  user: initialUser,
}: {
  children: ReactNode;
  user: UserType;
}) {
  const [isShadowOpen, setIsShadowOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [user, setUser] = useState<UserType>(initialUser);

  return (
    <AppContext.Provider
      value={{
        isShadowOpen,
        setIsShadowOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        user,
        setUser,
        isLogin: user === null ? false : true,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be inside AppProvider");
  return context;
}
