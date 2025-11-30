const apiKey = process.env.GEMINI_API_KEY || '';

// Generic helper for calling Gemini
async function askGemini(prompt: string): Promise<string> {
  if (!apiKey) return "⚠️ API Key missing. Check .env.local";

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
  } catch (e) {
    console.error("Gemini Error:", e);
    return "Error connecting to AI service.";
  }
}

// Feature 4: Job Post Polisher
export const refineContent = async (text: string, type: 'professional' | 'exciting' = 'professional') => {
  const prompt = `Rewrite the following job post content to be more ${type}, engaging, and error-free. Keep the same meaning but improve flow and vocabulary:\n\n"${text}"`;
  return await askGemini(prompt);
};

export const generateJobDescription = async (role: string, skills: string) => {
  const prompt = `Write a compelling job description for a ${role}.
  Key Skills Required: ${skills}.
  Keep it concise (under 200 words), engaging, and professional.`;
  return await askGemini(prompt);
};

// Feature 3: Intelligent Inbox (Magic Reply)
export const generateEmailDraft = async (
  intent: 'reject' | 'invite' | 'offer',
  candidateName: string,
  jobTitle: string,
  senderName: string
) => {
  const tone = intent === 'reject' ? "empathetic and professional" : "excited and clear";
  const prompt = `Write a ${tone} email for ${candidateName} regarding their application for ${jobTitle}.
  Intent: ${intent.toUpperCase()}.
  Sender: ${senderName}.
  Format: HTML (use <p>, <ul>, <b> only). No subject line, just body.`;
  return await askGemini(prompt);
};

// Feature 2: Dynamic Interview Questions
export const generateInterviewQuestions = async (jobDescription: string, candidateResume: string) => {
  const prompt = `Compare this Job Description and Candidate Resume/Profile.
  Identify 3 key gaps or areas to probe.
  Generate 3 tough, specific technical interview questions to test those areas.
  Return ONLY the questions as a JSON array of strings.
  
  Job: ${jobDescription.substring(0, 1000)}...
  Candidate: ${candidateResume.substring(0, 1000)}...`;

  const result = await askGemini(prompt);
  // Clean markdown if Gemini adds it
  const cleanJson = result.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(cleanJson);
  } catch (e) {
    return ["Could not parse questions. Try again."];
  }
};

// Feature 1: Smart Candidate Screening
export const analyzeCandidateProfile = async (resumeText: string, jobTitle: string) => {
  const prompt = `Analyze this candidate for the role of ${jobTitle}.
  Return a JSON object with:
  {
    "summary": "2 sentence executive summary",
    "strengths": ["Strength 1", "Strength 2", "Strength 3"],
    "matchScore": 85 (integer 0-100 based on fit),
    "weaknesses": ["Gap 1", "Gap 2"]
  }
  
  Resume: ${resumeText.substring(0, 2000)}`;

  const result = await askGemini(prompt);
  const cleanJson = result.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("Failed to parse AI analysis", e);
    return {
      summary: "Analysis failed to parse.",
      strengths: [],
      matchScore: 0,
      weaknesses: []
    };
  }
};

export const draftResponse = async (context: string, tone: string = "professional") => {
  const prompt = `Draft a short, ${tone} email response to the following context:
    "${context}"
    
    Format: HTML (use <p>, <br> only). No subject line.`;
  return await askGemini(prompt);
};