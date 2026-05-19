import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Ensure Gemini Client is initialized safely
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } else {
    console.warn("GEMINI_API_KEY environment variable is not defined. AI Chat features will fall back gracefully.");
  }
} catch (err) {
  console.error("Error initializing GoogleGenAI client:", err);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Get Prayer Times by City and Country
  // Open API from Aladhan doesn't require keys, but running it server-side provides robust error handling & prevents CORS
  app.get("/api/prayer-times", async (req: Request, res: Response) => {
    try {
      const city = (req.query.city as string) || "Dhaka";
      const country = (req.query.country as string) || "Bangladesh";
      const method = (req.query.method as string) || "1"; // University of Islamic Sciences, Karachi as standard default for South Asia

      const url = `http://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch timings from Aladhan API: ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("Error in /api/prayer-times:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to retrieve prayer times. Please try again.", 
        error: error.message 
      });
    }
  });

  // API Route: AI Islamic Q&A Chatbot / Salah Assistant
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { messages, language } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Missing or invalid 'messages' field in request body." });
      }

      if (!ai) {
        return res.status(503).json({ 
          error: "Gemini AI client is not configured.", 
          fallbackMessage: language === "bn" 
            ? "দুঃখিত, এআই সহকারী এই মুহূর্তে উপলব্ধ নয়। অনুগ্রহ করে পরে আবার চেষ্টা করুন।" 
            : "Sorry, the AI Salah Assistant is currently unavailable as the API Key is not set." 
        });
      }

      // Convert messages to Gemini's format or query standard generateContent
      // Let's grab the latest message
      const lastMessage = messages[messages.length - 1];
      const prompt = lastMessage.content;

      // Construct a conversation helper containing the recent context
      const chatContext = messages.slice(-5, -1).map((m: any) => {
        return `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`;
      }).join("\n");

      const systemInstruction = 
        `You are 'Nour Al-Salah Assistant', an incredibly gentle, compassionate, and highly knowledgeable Islamic companion and prayer tutor. 
        Your goal is to assist users in learning Namaz (Salah), Wudu (ablution), understanding small Surahs, and finding spiritual peace in prayer (Khushu). 
        You answer questions accurately based on authentic, established Islamic teachings from the Quran and Sunnah (Hadith). 
        
        Rules:
        1. Keep your answers concise, clear, comforting, and beautifully styled with markdown. Do not write extremely long text; make it easy to scan.
        2. ALWAYS match the user's language. If they ask questions in Bangla, answer in comforting, beautifully polite Bangla (বাংলা). If in English, answer in English. If they use a mix, answer with whatever feels most natural.
        3. Keep your tone peaceful, encouraging, spiritual, and humble. Avoid sectarian disputes; provide general consensus or standard schools of thoughts (Hanafi, Shafi'i, etc.) with respect.
        4. If the question is NOT related to Islam, Salah, Wudu, Quran, Hadith, or spiritual growth, gently guide the user back, e.g., "I am here specifically to help you on your journey of prayer and learning. How can I assist you with Namaz or Surahs today?"
        
        Recent Chat History for Context:
        ${chatContext}`;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const responseText = aiResponse.text || (language === "bn" ? "আমি কোনো উত্তর তৈরি করতে পারিনি। অনুগ্রহ করে আপনার প্রশ্নটি পুনরায় বলুন।" : "I could not generate an answer. Please rephrase your question.");

      res.json({
        success: true,
        message: responseText
      });
    } catch (error: any) {
      console.error("Error in AI /api/chat:", error);
      res.status(500).json({ 
        success: false, 
        message: "An error occurred while generating the assistant response.",
        error: error.message 
      });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in PRODUCTION mode serving static bundle...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}/`);
  });
}

startServer().catch((err) => {
  console.error("Fatal error starting Express server:", err);
});
