export type JournalEntry = {
  id: string;
  uid: string; // User ID from Firebase Auth
  text: string;
  dateTime: string; // ISO string
  people: string[];
  locations: string[];
  organizations: string[];
  dates: string[];
  topics: string[];
  media: { type: 'photo' | 'video' | 'voice'; url: string }[];
};
