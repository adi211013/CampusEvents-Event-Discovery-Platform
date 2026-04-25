"use client";

import React, { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";

const UserContext = createContext<User | null>(null);
const DisplayNameContext = createContext<string>("");

export function useUser() {
  return useContext(UserContext);
}

export function useDisplayName() {
  return useContext(DisplayNameContext);
}

export default function UserProvider({
  user,
  displayName,
  children,
}: {
  user: User | null;
  displayName: string;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={user}>
      <DisplayNameContext.Provider value={displayName}>
        {children}
      </DisplayNameContext.Provider>
    </UserContext.Provider>
  );
}