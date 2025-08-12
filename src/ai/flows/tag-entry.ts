'use server';
/**
 * @fileOverview AI-powered tagging for journal entries, identifying people, locations, and more.
 *
 * - tagEntry - A function that processes journal entries to identify and tag structured data.
 * - TagEntryInput - The input type for the tagEntry function.
 * - TagEntryOutput - The return type for the tagEntry function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TagEntryInputSchema = z.object({
  text: z.string().describe('The text content of the journal entry.'),
});
export type TagEntryInput = z.infer<typeof TagEntryInputSchema>;

const TagEntryOutputSchema = z.object({
  people: z.array(z.string()).describe('List of people mentioned in the entry.'),
  locations: z.array(z.string()).describe('List of locations mentioned in the entry.'),
  organizations: z.array(z.string()).describe('List of organizations or companies mentioned.'),
  dates: z.array(z.string()).describe('List of specific dates mentioned.'),
  topics: z.array(z.string()).describe('List of key topics or activities discussed.'),
});
export type TagEntryOutput = z.infer<typeof TagEntryOutputSchema>;

export async function tagEntry(input: TagEntryInput): Promise<TagEntryOutput> {
  return tagEntryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tagEntryPrompt',
  input: {schema: TagEntryInputSchema},
  output: {schema: TagEntryOutputSchema},
  prompt: `You are an AI assistant designed to analyze journal entries and identify structured data within them.

  Analyze the following journal entry and extract the following information:
  - People mentioned: Full names if possible.
  - Locations: Places, cities, or specific venues.
  - Organizations: Companies, startups, or groups.
  - Dates: Any specific dates mentioned.
  - Topics: Key themes, projects, or activities.

  Return empty arrays for any categories not found.

  Journal Entry: {{{text}}}`,
});

const tagEntryFlow = ai.defineFlow(
  {
    name: 'tagEntryFlow',
    inputSchema: TagEntryInputSchema,
    outputSchema: TagEntryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
