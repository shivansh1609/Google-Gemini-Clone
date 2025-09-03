import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Read API key from environment
const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  console.error("❌ GOOGLE_API_KEY is missing. Please add it to your .env file.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

// ✅ Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).send({ error: "Prompt is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    // Debugging logs
    console.log("✅ Gemini result:", result);

    const response = await result.response;
    const text = response.text();

    res.send({ response: text });
  } catch (error) {
    console.error("❌ Error in /chat:", error); // <-- detailed log
    res.status(500).send({ error: error.message || "Failed to fetch response from Gemini" });
  }
});


// ✅ Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
