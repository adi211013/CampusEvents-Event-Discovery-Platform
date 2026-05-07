import RightSide from "@/components/RightSide";
import PanelDrawer from "@/components/PanelDrawer";
import HomeContent from "@/components/HomeContent";
import { mockEvents } from "@/lib/mock-events";

export default function Page() {
  return (
    <div className="flex flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto">
        <HomeContent events={mockEvents} />
      </div>
      <RightSide />
      <PanelDrawer />
    </div>
  );
}