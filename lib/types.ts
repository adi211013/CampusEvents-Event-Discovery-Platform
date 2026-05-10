export type Event = {
  id: number | string;
  title: string;
  location: string | null;
  start_date: string | null;
  short_description: string | null;
  tags: string[];
  url?: string | null;
};