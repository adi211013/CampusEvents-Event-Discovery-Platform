export const CATEGORIES = [
  { id: "festiwal",  label: "Festiwal",  color: "#F59E0B", bg: "#FEF3C7", gradient: "from-amber-500 to-orange-500" },
  { id: "tech",      label: "Tech & IT", color: "#1D5EF3", bg: "#EEF3FE", gradient: "from-blue-600 to-violet-600" },
  { id: "nauka",     label: "Nauka",     color: "#10B981", bg: "#D1FAE5", gradient: "from-emerald-500 to-teal-600" },
  { id: "sport",     label: "Sport",     color: "#F97316", bg: "#FED7AA", gradient: "from-orange-500 to-red-500" },
  { id: "kultura",   label: "Kultura",   color: "#8B5CF6", bg: "#EDE9FE", gradient: "from-violet-600 to-purple-700" },
  { id: "kariera",   label: "Kariera",   color: "#0891B2", bg: "#CFFAFE", gradient: "from-cyan-600 to-blue-600" },
  { id: "warsztaty", label: "Warsztaty", color: "#059669", bg: "#A7F3D0", gradient: "from-green-600 to-emerald-600" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];