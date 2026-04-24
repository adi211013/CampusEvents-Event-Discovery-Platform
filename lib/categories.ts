export const CATEGORIES = [
  { id: "festiwal",  label: "Festiwal",  color: "#F59E0B", bg: "#FEF3C7" },
  { id: "tech",      label: "Tech & IT", color: "#1D5EF3", bg: "#EEF3FE" },
  { id: "nauka",     label: "Nauka",     color: "#10B981", bg: "#D1FAE5" },
  { id: "sport",     label: "Sport",     color: "#F97316", bg: "#FED7AA" },
  { id: "kultura",   label: "Kultura",   color: "#8B5CF6", bg: "#EDE9FE" },
  { id: "kariera",   label: "Kariera",   color: "#0891B2", bg: "#CFFAFE" },
  { id: "warsztaty", label: "Warsztaty", color: "#059669", bg: "#A7F3D0" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];