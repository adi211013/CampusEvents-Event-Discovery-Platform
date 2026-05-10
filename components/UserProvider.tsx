"use client";

import React, { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";

const UserContext = createContext<User | null>(null);
const DisplayNameContext = createContext<string>("");
const IsAdminContext = createContext<boolean>(false);

export function useUser() {
  return useContext(UserContext);
}

export function useDisplayName() {
  return useContext(DisplayNameContext);
}

export function useIsAdmin() {
  return useContext(IsAdminContext);
}

export default function UserProvider({
  user,
  displayName,
  isAdmin,
  children,
}: {
  user: User | null;
  displayName: string;
  isAdmin: boolean;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={user}>
      <DisplayNameContext.Provider value={displayName}>
        <IsAdminContext.Provider value={isAdmin}>
          {children}
        </IsAdminContext.Provider>
      </DisplayNameContext.Provider>
    </UserContext.Provider>
  );
}