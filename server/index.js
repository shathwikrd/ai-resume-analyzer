const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const PdfParse = require("pdf-parse");
const axios = require("axios");

dotenv.config();

const upload = multer({ storage: multer.memoryStorage() });
const app = express();

app.use(cors());

app.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const data = await PdfParse(req.file.buffer);
    const resumeText = data.text;

    const prompt = `You are a professional resume reviewer AI. Analyze this resume and return feedback in JSON format only. DO NOT include markdown, do not use triple backticks. Return raw JSON only.

Use this structure exactly:
{
  "summary": "A short overview of the resume",
  "score": 0-100,
  "suggestions": ["Quick improvements to make"],
  "strengths": ["What the resume does well"],
  "weaknesses": ["Areas to work on"],
  "issues": ["Formatting, grammar, or structure problems"],
  "jobReadiness": "Entry-level | Mid-level | Senior"
}


Here is the resume text extracted from a pdf:
${resumeText}`;

    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    let rawText = geminiResponse.data.candidates[0].content.parts[0].text;

    if (rawText.startsWith("```json")) {
      rawText = rawText
        .replace(/```json\n?/, "")
        .replace(/```$/, "")
        .trim();
    }

    const feedbackJson = JSON.parse(rawText);

    res.json(feedbackJson);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Something went wrong while analyzing." });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
