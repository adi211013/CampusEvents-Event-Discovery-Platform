"use client";

import { useEffect } from "react";
import { useUser } from "@/components/UserProvider";
import { createClient } from "@/lib/supabase/client";
import { useStore } from "@/lib/store";

export default function SavedEventsLoader() {
  const user = useUser();
  const initSaved = useStore((s) => s.initSaved);

  useEffect(() => {
    if (!user) { initSaved([]); return; }
    const supabase = createClient();
    supabase
      .from("saved_events")
      .select("event_id")
      .then(({ data }) => {
        initSaved((data ?? []).map((r) => r.event_id as number));
      });
  }, [user]);

  return null;
}
