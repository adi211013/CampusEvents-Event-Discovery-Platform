import type { CategoryId } from "./categories";

export type MockEvent = {
  id: string;
  title: string;
  location: string;
  start_date: string;
  short_description: string;
  tags: CategoryId[];
  price: number | null;
  organizer: string;
};

export const mockEvents: MockEvent[] = [
  {
    id: "1",
    title: "Hackathon PRz 2026",
    location: "Budynek V, PRz",
    start_date: "2026-05-15",
    short_description: "48-godzinny maraton kodowania dla studentów wszystkich kierunków. Wygraj nagrody i poznaj przyszłych współpracowników z branży IT.",
    tags: ["tech"],
    price: null,
    organizer: "Koło Naukowe IT PRz",
  },
  {
    id: "2",
    title: "Juwenalia PRz 2026",
    location: "Miasteczko Studenckie",
    start_date: "2026-05-22",
    short_description: "Największe święto studentów Politechniki Rzeszowskiej. Koncerty, zabawy i niezapomniane wspomnienia.",
    tags: ["festiwal"],
    price: 29,
    organizer: "Samorząd Studencki PRz",
  },
  {
    id: "3",
    title: "Targi Pracy 2026",
    location: "Aula PRz, bud. A",
    start_date: "2026-05-25",
    short_description: "Spotkaj pracodawców z największych firm technologicznych regionu. Przynieś CV i zdobądź wymarzoną pracę lub staż.",
    tags: ["kariera"],
    price: null,
    organizer: "Biuro Karier PRz",
  },
  {
    id: "4",
    title: "Festiwal Nauki PRz",
    location: "Kampus PRz",
    start_date: "2026-05-20",
    short_description: "Odkryj fascynujący świat nauki przez eksperymenty, wykłady i pokazy. Dla studentów i mieszkańców Rzeszowa.",
    tags: ["nauka"],
    price: null,
    organizer: "Wydział Nauk Stosowanych",
  },
  {
    id: "5",
    title: "Warsztat UX/UI Design",
    location: "Sala 301, bud. L",
    start_date: "2026-05-18",
    short_description: "Intensywny warsztat projektowania interfejsów użytkownika. Nauczysz się Figmy i podstaw user research.",
    tags: ["warsztaty", "tech"],
    price: 15,
    organizer: "Design Lab PRz",
  },
  {
    id: "6",
    title: "Bieg Kampusowy 5km",
    location: "Kampus PRz",
    start_date: "2026-05-17",
    short_description: "Amatorski bieg po terenie kampusu. Zapisz się i ruszaj po zdrowie — wszystkie poziomy zaawansowania mile widziane.",
    tags: ["sport"],
    price: null,
    organizer: "AZS PRz",
  },
  {
    id: "7",
    title: "Noc Kultury Studenckiej",
    location: "Dom Studenta, ul. Akademicka",
    start_date: "2026-06-01",
    short_description: "Wernisaż, muzyka na żywo i slam poetycki w jednym miejscu. Noc pełna artystycznych wrażeń.",
    tags: ["kultura"],
    price: null,
    organizer: "Klub Kultury Studenckiej",
  },
  {
    id: "8",
    title: "AI w Praktyce — Wykład",
    location: "Aula Główna, bud. A",
    start_date: "2026-06-05",
    short_description: "Gościnny wykład o zastosowaniach sztucznej inteligencji w przemyśle. Prelegent z Google DeepMind.",
    tags: ["tech", "nauka"],
    price: null,
    organizer: "Wydział Informatyki PRz",
  },
];