import { GoogleGenAI } from "@google/genai";
import { GeneratorType } from "../types";

// Initialize Gemini client
// We force the type to string here because we know it will be injected by Vite during build
// and we want to satisfy TypeScript's strict null checks.
const apiKey = process.env.API_KEY as string;

const ai = new GoogleGenAI({ apiKey: apiKey });

const MODEL_NAME = 'gemini-2.5-flash';

export const generatePRContent = async (type: GeneratorType, context: string, currentText?: string): Promise<string> => {
  let prompt = "";

  switch (type) {
    case GeneratorType.HEADLINE:
      prompt = `Erstelle 3 knackige, professionelle Schlagzeilen für eine Pressemitteilung über folgendes Thema: "${context}". Gib nur die Schlagzeilen zurück, getrennt durch einen Zeilenumbruch, ohne Aufzählungszeichen.`;
      break;
    case GeneratorType.BODY:
      prompt = `Schreibe den Haupttext einer professionellen Pressemitteilung über folgendes Thema: "${context}". Der Stil soll sachlich, journalistisch und informativ sein. Schreibe ca. 200-300 Wörter. Verwende Absätze.`;
      break;
    case GeneratorType.ABOUT:
      prompt = `Schreibe einen kurzen "Über uns" (Boilerplate) Text für ein Unternehmen basierend auf diesen Stichworten: "${context}".`;
      break;
    case GeneratorType.IMPROVE:
      prompt = `Verbessere den folgenden Text für eine Pressemitteilung. Mach ihn professioneller, korrigiere Grammatik und Ausdruck, aber behalte die Kernaussage bei:\n\n"${currentText}"`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: "Du bist ein erfahrener PR-Berater und Journalist. Du schreibst perfektes Deutsch.",
        temperature: 0.7,
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Fehler bei der KI-Generierung. Bitte versuchen Sie es später erneut.");
  }
};