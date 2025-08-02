
"use client";

import { createContext, useContext, type PropsWithChildren } from "react";
import type { User } from "@/lib/types";

const CurrentUserContext = createContext<User | null>(null);

export const CurrentUserProvider = ({ user, children }: PropsWithChildren<{ user: User | null }>) => {
  return (
    <CurrentUserContext.Provider value={user}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);
  return context;
};
