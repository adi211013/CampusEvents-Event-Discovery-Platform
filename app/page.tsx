import { createClient } from "@/lib/supabase/server";
import { mockEvents } from "@/lib/mock-events";
import type { Event } from "@/lib/types";
import RightSide from "@/components/RightSide";
import PanelDrawer from "@/components/PanelDrawer";
import HomeContent from "@/components/HomeContent";

const EVENT_SELECT = "id, title, location, start_date, short_description, tags, url";

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let gridEvents: Event[] = [];

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("interests")
      .eq("id", user.id)
      .single();

    const interests: string[] = profile?.interests ?? [];

    if (interests.length > 0) {
      const { data } = await supabase
        .from("events")
        .select(EVENT_SELECT)
        .eq("status", "approved")
        .overlaps("tags", interests)
        .order("start_date", { ascending: true })
        .limit(6);
      gridEvents = (data as Event[]) ?? [];
    }
  }

  if (gridEvents.length === 0) {
    const { data } = await supabase
      .from("events")
      .select(EVENT_SELECT)
      .eq("status", "approved")
      .order("start_date", { ascending: true })
      .limit(6);
    gridEvents = (data as Event[]) ?? [];
  }

  if (gridEvents.length === 0) {
    gridEvents = mockEvents as Event[];
  }

  const gridIds = gridEvents.map((e) => e.id).filter((id) => typeof id === "number") as number[];
  let browseQuery = supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("status", "approved")
    .gte("start_date", new Date().toISOString())
    .order("start_date", { ascending: true })
    .limit(5);
  if (gridIds.length > 0) {
    browseQuery = browseQuery.not("id", "in", `(${gridIds.join(",")})`);
  }
  const { data: browseData } = await browseQuery;
  const browseEvents: Event[] = (browseData as Event[]) ?? [];

  const { data: calendarData } = await supabase
    .from("events")
    .select("id, title, start_date, tags")
    .eq("status", "approved")
    .not("start_date", "is", null);
  const calendarEvents: Event[] = (calendarData as Event[]) ?? [];

  return (
    <div className="flex flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto">
        <HomeContent gridEvents={gridEvents} browseEvents={browseEvents} />
      </div>
      <RightSide events={calendarEvents} filterEvents={[...gridEvents, ...browseEvents]} />
      <PanelDrawer events={calendarEvents} filterEvents={[...gridEvents, ...browseEvents]} />
    </div>
  );
}
