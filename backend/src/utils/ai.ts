import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function analyzeResume(resume: string, jd: string) {
  const systemInstruction = `You are an expert technical recruiter and AI resume analyzer. 
Compare the provided Resume and Job Description (JD). 
Respond ONLY with a JSON object containing the following structure:
{
  "match_score": number (0-100),
  "strengths": string[],
  "weaknesses": string[],
  "keywords": {
    "matched": string[],
    "missing": string[]
  },
  "recommendations": [
    {
      "original": string (the original bullet point from resume),
      "improved": string (rewritten bullet point),
      "reasoning": string (why this change helps match the JD better)
    }
  ]
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: `Resume:\n${resume}\n\nJob Description:\n${jd}`,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  });

  const content = response.text;
  if (!content) {
    throw new Error('No content returned from Gemini');
  }

  return JSON.parse(content);
}
