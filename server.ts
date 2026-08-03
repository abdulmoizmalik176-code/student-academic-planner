import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Healthcheck
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Quiz & Flashcard Generator
app.post("/api/ai/quiz", async (req, res) => {
  try {
    const { topic, subject, difficulty = "medium" } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback mock questions if API key is not configured yet
      return res.json({
        questions: [
          {
            id: "q1",
            question: `What is a fundamental concept in ${topic}?`,
            options: ["Core Principle A", "Option B", "Option C", "Option D"],
            correctAnswer: 0,
            explanation: `Core Principle A is foundational to understanding ${topic}.`
          },
          {
            id: "q2",
            question: `Which of the following best describes an application of ${topic}?`,
            options: ["Practical Application", "Incorrect Theory", "Irrelevant Term", "Outdated View"],
            correctAnswer: 0,
            explanation: `Practical applications demonstrate key mechanisms of ${topic}.`
          }
        ]
      });
    }

    const prompt = `Generate a 3-question multiple-choice practice quiz for a student studying ${subject ? `${subject}: ` : ''}${topic} at ${difficulty} difficulty level.
Return valid JSON with an array named "questions". Each item must have:
- "id": string (e.g. "q1")
- "question": string
- "options": array of 4 strings
- "correctAnswer": number index (0, 1, 2, or 3)
- "explanation": string explaining why the correct answer is right.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    return res.json(data);
  } catch (error: any) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ error: error.message || "Failed to generate quiz" });
  }
});

// AI Task & Study Breakdown
app.post("/api/ai/breakdown", async (req, res) => {
  try {
    const { goal, deadline, subject } = req.body;
    if (!goal) {
      return res.status(400).json({ error: "Goal is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        steps: [
          { step: 1, title: "Review Syllabus & Core Concepts", durationMinutes: 30, tip: "Skim chapter summaries first" },
          { step: 2, title: "Practice Problem Solving", durationMinutes: 45, tip: "Focus on textbook examples" },
          { step: 3, title: "Self-Testing & Quiz Review", durationMinutes: 20, tip: "Teach concepts to yourself out loud" }
        ]
      });
    }

    const prompt = `Act as an expert academic productivity coach. Break down this student study goal/assignment into 3 to 5 clear, actionable sub-steps with estimated duration in minutes and a quick study tip:
Goal: "${goal}"
${subject ? `Subject: ${subject}` : ''}
${deadline ? `Target Deadline: ${deadline}` : ''}

Return JSON with a "steps" array. Each item has:
- "step": number
- "title": string
- "durationMinutes": number
- "tip": string`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    return res.json(data);
  } catch (error: any) {
    console.error("Error breaking down goal:", error);
    res.status(500).json({ error: error.message || "Failed to breakdown goal" });
  }
});

// AI Topic Explainer / Study Summarizer
app.post("/api/ai/explain", async (req, res) => {
  try {
    const { text, subject } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        summary: `Key concept summary for ${subject || 'your topic'}: Focus on foundational principles, practice sample problems, and memorize key formulas or terminology.`,
        keyTakeaways: [
          "Understand core definitions and relationships.",
          "Identify common exam question patterns.",
          "Apply concepts to real-world examples."
        ],
        mnemonic: "P.R.A.C.T.I.C.E (Plan, Read, Apply, Clarify, Test, Iterate, Consolidate, Excel)"
      });
    }

    const prompt = `Analyze and simplify the following study material or question for a student in simple, clear terms:
Material: "${text}"
${subject ? `Subject: ${subject}` : ''}

Return JSON with:
- "summary": string (2-3 concise sentences)
- "keyTakeaways": array of 3-4 bullet strings
- "mnemonic": string (a quick memory aid or analogy if applicable, or empty string)`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error explaining topic:", error);
    res.status(500).json({ error: error.message || "Failed to explain topic" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
