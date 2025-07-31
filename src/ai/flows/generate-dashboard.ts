'use server';
/**
 * @fileOverview An AI agent for generating a summary dashboard of UMKM statistics.
 *
 * - generateDashboard - A function that generates the UMKM statistics dashboard.
 * - GenerateDashboardInput - The input type for the generateDashboard function.
 * - GenerateDashboardOutput - The return type for the generateDashboard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDashboardInputSchema = z.object({
  totalUmkm: z.number().describe('The total number of UMKM in the village.'),
  umkmPerRtRw: z
    .record(z.string(), z.number())
    .describe(
      'A record (object) where keys are RT/RW identifiers and values are the number of UMKM in that RT/RW.
      Example: { \'001/005\': 10, \'002/006\': 5 }'
    ),
  umkmPerType: z
    .record(z.string(), z.number())
    .describe(
      'A record (object) where keys are UMKM types (e.g., Kuliner, Fashion) and values are the number of UMKM of that type.
      Example: { \'Kuliner\': 15, \'Fashion\': 8 }'
    ),
});
export type GenerateDashboardInput = z.infer<typeof GenerateDashboardInputSchema>;

const GenerateDashboardOutputSchema = z.object({
  summary: z.string().describe('A textual summary of the UMKM statistics.'),
  visualizations: z.string().describe('Description of visualized data (graphs/charts).'),
});
export type GenerateDashboardOutput = z.infer<typeof GenerateDashboardOutputSchema>;

export async function generateDashboard(input: GenerateDashboardInput): Promise<GenerateDashboardOutput> {
  return generateDashboardFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDashboardPrompt',
  input: {schema: GenerateDashboardInputSchema},
  output: {schema: GenerateDashboardOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing UMKM statistics for Desa X.

  You are provided with the following data:
  - Total UMKM: {{{totalUmkm}}}
  - UMKM per RT/RW: {{{umkmPerRtRw}}}
  - UMKM per Type: {{{umkmPerType}}}

  Based on this data, generate a concise summary of the UMKM landscape in Desa X.  Highlight key trends and insights.

  Also, suggest what visualizations (graphs, charts) would be most effective for presenting this data to a non-technical audience.
  What kind of chart should be used for each data?
  Which axis should the data be plotted on for each chart?
  Be specific about the type of graph or chart recommended.
  The summary and visualizations must be string, do not return as JSON object.
  `,
});

const generateDashboardFlow = ai.defineFlow(
  {
    name: 'generateDashboardFlow',
    inputSchema: GenerateDashboardInputSchema,
    outputSchema: GenerateDashboardOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
