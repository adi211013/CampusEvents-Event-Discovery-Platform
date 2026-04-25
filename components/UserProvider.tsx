"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

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
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.full_name ?? ""
  );

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("display_name")
      .single()
      .then(({ data }) => {
        if (data?.display_name) setDisplayName(data.display_name);
      });
  }, [user]);

  return (
    <UserContext.Provider value={user}>
      <DisplayNameContext.Provider value={displayName}>
        {children}
      </DisplayNameContext.Provider>
    </UserContext.Provider>
  );
}