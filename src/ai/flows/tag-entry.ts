'use server';
/**
 * @fileOverview AI-powered tagging for journal entries, identifying people and locations.
 *
 * - tagEntry - A function that processes journal entries to identify and tag people and locations.
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
  peopleMentioned: z.array(z.string()).describe('List of people mentioned in the entry.'),
  location: z.string().describe('The location mentioned in the entry.'),
});
export type TagEntryOutput = z.infer<typeof TagEntryOutputSchema>;

export async function tagEntry(input: TagEntryInput): Promise<TagEntryOutput> {
  return tagEntryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tagEntryPrompt',
  input: {schema: TagEntryInputSchema},
  output: {schema: TagEntryOutputSchema},
  prompt: `You are an AI assistant designed to analyze journal entries and identify people and locations mentioned in them.

  Analyze the following journal entry and extract the people mentioned and the location.
  Return the people mentioned as a list of names. If no people are mentioned, return an empty list.
  Return the location mentioned in the 'location' field. If no location is mentioned, return an empty string.

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
