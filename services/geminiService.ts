// Remove SDK import to reduce bundle size and avoid browser issues
// import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

export const generateJobDescription = async (role: string, skills: string): Promise<string> => {
  if (!apiKey) {
    // Fallback if no API key is present
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`(Demo Mode - No API Key)\n\nPosition: ${role}\n\nWe are looking for a talented ${role} to join our growing team. You should be proficient in ${skills}.\n\nResponsibilities:\n- Collaborate with cross-functional teams.\n- Design and implement scalable solutions.\n- Maintain high code quality.\n\nApply now to join the Edluar family!`);
      }, 1500);
    });
  }

  try {
    const model = 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Write a concise, professional, and inviting job description for a "${role}". Key required skills: "${skills}". Keep it under 150 words. Tone: Professional yet organic and welcoming.`
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Gemini API Error:", errorData);
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate description.";

  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    return `Error: ${error.message || "Connection failed"}`;
  }
};