"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import type { CategoryId } from "@/lib/categories";

type UpdateData = {
  title: string;
  url: string;
  start_date: string;
  location: string;
  short_description: string;
  tags: CategoryId[];
};

export async function reviewEvent(
  id: number,
  status: "approved" | "ignored",
  data: UpdateData
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) throw new Error("Forbidden");

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await admin.from("events").update({
    status,
    title: data.title,
    url: data.url || null,
    start_date: data.start_date || null,
    location: data.location || null,
    short_description: data.short_description || null,
    tags: data.tags,
  }).eq("id", id);

  if (error) throw error;
}