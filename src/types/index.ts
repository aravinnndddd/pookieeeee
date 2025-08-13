export type JournalEntry = {
  id: string;
  text: string;
  dateTime: string; // ISO string
  people: string[];
  locations: string[];
  organizations: string[];
  dates: string[];
  topics: string[];
  media: { type: 'photo' | 'video' | 'voice'; url: string }[];
};
