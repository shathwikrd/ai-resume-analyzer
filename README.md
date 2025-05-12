# AI Resume Analyzer

AI Resume Analyzer is a web application that allows users to upload their resume (PDF format) and receive instant, AI-powered feedback. The backend uses Google Gemini to analyze the resume and returns structured feedback including strengths, weaknesses, suggestions, and a readiness score.

## Features

- Upload your resume in PDF format.
- Get a summary, score, strengths, weaknesses, suggestions, and job readiness level.
- Fast, simple, and privacy-friendly (no resumes are stored).

## Tech Stack

- **Frontend:** React, Material UI, Vite
- **Backend:** Node.js, Express, Google Gemini API, pdf-parse

---

## API Documentation

### POST `/analyze`

Analyze a resume PDF and receive structured feedback.

#### Request

- **Content-Type:** `multipart/form-data`
- **Body:**  
  - `resume`: PDF file (required)

#### Example using `curl`:

```bash
curl -X POST http://localhost:2000/analyze \
  -F "resume=@/path/to/your/resume.pdf"
```

#### Response

- **Success (200):**  
  JSON object with the following structure:
  ```json
  {
    "summary": "A short overview of the resume",
    "score": 0-100,
    "suggestions": ["Quick improvements to make"],
    "strengths": ["What the resume does well"],
    "weaknesses": ["Areas to work on"],
    "issues": ["Formatting, grammar, or structure problems"],
    "jobReadiness": "Entry-level | Mid-level | Senior"
  }
  ```

- **Error (4xx/5xx):**
  ```json
  { "error": "Error message" }
  ```

#### Notes

- The API expects a valid PDF file.
- The backend uses the Google Gemini API for analysis (requires a valid API key in `.env`).

---

## Setup & Development

1. **Clone the repository**
2. **Install dependencies**  
   - In `/server`: `npm install`
   - In `/client`: `npm install`
3. **Configure environment variables**  
   - `/server/.env`: Set `GOOGLE_API_KEY` and `PORT`
   - `/client/.env`: Set `VITE_BACKEND_API`
4. **Run the backend**  
   ```
   cd server
   npm run serve
   ```
5. **Run the frontend**  
   ```
   cd client
   npm run dev
   ```
6. **Open the app**  
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

---

## License

MIT
