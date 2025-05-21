
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
  prompt: `Vous êtes un assistant amical pour un tailleur.
Un nouveau client nommé '{{clientName}}' est en cours d'ajout.
Rédigez une note de bienvenue courte, accueillante et légèrement personnalisée (1-2 phrases) que le tailleur pourra enregistrer pour ce client.
Exemples:
- "Bienvenue, {{clientName}} ! Au plaisir de créer quelque chose de magnifique pour vous."
- "Très heureux de vous accueillir, {{clientName}} ! Nous discuterons bientôt des besoins de votre projet."
- "Bonjour {{clientName}}, bienvenue dans notre service de couture ! Hâte de commencer à travailler avec vous."

Assurez-vous que la note soit chaleureuse et professionnelle.
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
      return { note: `Bienvenue, ${input.clientName} ! Nous sommes ravis de vous compter parmi nous.` };
    }
    return output;
  }
);
