'use server';
import { tagEntry, type TagEntryInput } from '@/ai/flows/tag-entry';

export async function getTagsForEntry(text: string): Promise<{
  people: string[];
  location: string | null;
}> {
  try {
    const input: TagEntryInput = { text };
    const result = await tagEntry(input);
    return {
      people: result.peopleMentioned || [],
      location: result.location || null,
    };
  } catch (error) {
    console.error('AI tagging failed:', error);
    // Return a default value in case of an error to ensure the app doesn't crash
    return {
      people: [],
      location: null,
    };
  }
}
