'use server';
import { tagEntry, type TagEntryInput, type TagEntryOutput } from '@/ai/flows/tag-entry';

export async function getTagsForEntry(text: string): Promise<Partial<TagEntryOutput>> {
  try {
    const input: TagEntryInput = { text };
    const result = await tagEntry(input);
    return result;
  } catch (error) {
    console.error('AI tagging failed:', error);
    // Return a default value in case of an error to ensure the app doesn't crash
    return {
      people: [],
      locations: [],
      organizations: [],
      dates: [],
      topics: [],
    };
  }
}
