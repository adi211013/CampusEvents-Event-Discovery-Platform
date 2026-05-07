import { CATEGORIES } from "@/lib/categories";
import type { MockEvent } from "@/lib/mock-events";

export default function HeroBanner({ event }: { event: MockEvent }) {
  const cat = CATEGORIES.find((c) => c.id === event.tags[0]);

  return (
    <div className={`rounded-xl overflow-hidden relative bg-gradient-to-br ${cat?.gradient ?? "from-blue-600 to-violet-600"} min-h-[160px] md:min-h-[200px]`}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
      <div className="relative z-10 flex flex-col justify-end min-h-[160px] md:min-h-[200px] p-4 md:p-6">
        <span
          className="text-[11px] font-bold px-2 py-0.5 rounded-md w-fit mb-2 bg-white/20 text-white backdrop-blur-sm"
        >
          {cat?.label}
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
          {event.title}
        </h2>
        <p className="hidden md:block text-sm text-white/80 mt-1 mb-4 line-clamp-2">
          {event.short_description}
        </p>
        <div className="flex gap-2 mt-3">
          <button className="bg-accent text-white text-sm font-semibold px-4 rounded-lg min-h-[44px] hover:bg-accent/90 transition-colors">
            Dowiedz się więcej
          </button>
          <button className="bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 rounded-lg min-h-[44px] border border-white/30 hover:bg-white/30 transition-colors">
            Zapisz
          </button>
        </div>
      </div>
    </div>
  );
}