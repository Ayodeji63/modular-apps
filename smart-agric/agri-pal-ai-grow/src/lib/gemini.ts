import { GoogleGenAI } from "@google/genai";

export const gemini_ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_PUBLIC_GEMINI_API,
});
