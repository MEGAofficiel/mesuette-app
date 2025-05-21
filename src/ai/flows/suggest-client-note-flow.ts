
'use server';
/**
 * @fileOverview A Genkit flow to suggest a welcome note for a client.
 *
 * - suggestClientNote - A function that generates a personalized welcome note for a client.
 * - SuggestClientNoteInput - The input type for the suggestClientNote function.
 * - SuggestClientNoteOutput - The return type for the suggestClientNote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestClientNoteInputSchema = z.object({
  clientName: z.string().describe('The name of the client for whom to generate the note.'),
});
export type SuggestClientNoteInput = z.infer<typeof SuggestClientNoteInputSchema>;

const SuggestClientNoteOutputSchema = z.object({
  note: z.string().describe('The suggested welcome note.'),
});
export type SuggestClientNoteOutput = z.infer<typeof SuggestClientNoteOutputSchema>;

export async function suggestClientNote(input: SuggestClientNoteInput): Promise<SuggestClientNoteOutput> {
  return suggestClientNoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestClientNotePrompt',
  input: {schema: SuggestClientNoteInputSchema},
  output: {schema: SuggestClientNoteOutputSchema},
  prompt: `You are a friendly assistant for a tailor.
A new client named '{{clientName}}' is being added.
Write a short, welcoming, and slightly personalized note (1-2 sentences) that the tailor can save for this client.
Examples:
- "Welcome, {{clientName}}! Looking forward to creating something great for you."
- "So happy to have you, {{clientName}}! We'll discuss your project needs soon."
- "Hello {{clientName}}, welcome to our tailoring service! Excited to start working with you."

Ensure the note is warm and professional.
`,
});

const suggestClientNoteFlow = ai.defineFlow(
  {
    name: 'suggestClientNoteFlow',
    inputSchema: SuggestClientNoteInputSchema,
    outputSchema: SuggestClientNoteOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      // Fallback or error handling if output is undefined
      return { note: `Welcome, ${input.clientName}! We're glad to have you.` };
    }
    return output;
  }
);
