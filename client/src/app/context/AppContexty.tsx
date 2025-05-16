"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type User = {
  username: string;
  coins: number;
} | null;

type AppContextType = {
  isShadowOpen: boolean;
  setIsShadowOpen: (value: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (value: boolean) => void;
  user: User;
  setUser: (u: User) => void;
  isLogin: boolean;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({
  children,
  user: initialUser,
}: {
  children: ReactNode;
  user: User;
}) {
  const [isShadowOpen, setIsShadowOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [user, setUser] = useState<User>(initialUser);
  console.log(user);
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
