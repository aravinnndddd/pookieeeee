export type JournalEntry = {
  id: string;
  uid: string; // User ID from Firebase Auth
  text: string;
  dateTime: string; // ISO string
  peopleMentioned: string[];
  location: string | null;
  // `tags` and `media` are included for future enhancements
  tags: string[]; 
  media: { type: 'photo' | 'video' | 'voice'; url: string }[];
};
