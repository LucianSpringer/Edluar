import { GoogleGenAI } from "@google/genai";

// Initialize the client. 
// Note: In a real production app, ensure this is handled securely.
// For this demo, we assume the environment has the key.
const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateJobDescription = async (role: string, skills: string): Promise<string> => {
  if (!ai) {
    // Fallback if no API key is present for the demo UI to still look functional
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`(Demo Mode - No API Key)\n\nPosition: ${role}\n\nWe are looking for a talented ${role} to join our growing team. You should be proficient in ${skills}.\n\nResponsibilities:\n- Collaborate with cross-functional teams.\n- Design and implement scalable solutions.\n- Maintain high code quality.\n\nApply now to join the Edluar family!`);
      }, 1500);
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a concise, professional, and inviting job description for a "${role}". Key required skills: "${skills}". Keep it under 150 words. Tone: Professional yet organic and welcoming.`,
    });
    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI service. Please try again later.";
  }
};