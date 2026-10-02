# AI-Powered Resume Analyzer 🚀

A modern, full-stack web application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS). By leveraging **Google Gemini AI**, the system compares your resume against a target Job Description (JD) to provide a comprehensive match score, keyword analysis, and actionable AI-driven rewrite recommendations.

![AI Resume Analyzer Mockup](https://raw.githubusercontent.com/chatpethk444/AI-Resume-Analyzer/main/frontend/public/window.svg) <!-- Replace with actual screenshot later -->

## ✨ Key Features
- **Intelligent ATS Scoring:** Calculates an overall match percentage based on the alignment between your resume and the target JD.
- **Keyword Gap Analysis:** Automatically extracts and compares critical skills and keywords, highlighting what's matched and what's missing.
- **Strengths & Weaknesses:** Identifies your core strengths and critical weaknesses to help you understand your competitive edge.
- **AI-Powered Rewrites:** Suggests highly optimized, drop-in replacements for your weak bullet points, complete with AI reasoning for the changes.
- **PDF Resume Parsing:** Seamlessly extracts text from standard PDF resumes.
- **Guest & Authenticated Modes:** Try it out instantly as a guest, or log in via Supabase to save your scan history.

## 🛠️ Technology Stack
**Frontend (Client)**
- [Next.js 15](https://nextjs.org/) (React Framework)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) (Styling & Components)
- [Supabase Auth](https://supabase.com/) (User Authentication)

**Backend (Server)**
- [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- [Google GenAI API](https://aistudio.google.com/) (`gemini-3.8-flash` model)
- `pdf-parse` & `multer` (File handling and text extraction)
- [Supabase PostgreSQL](https://supabase.com/) (Database & RLS)

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- A **Supabase** account (for database & auth)
- A **Google Gemini API Key**

### 2. Clone the Repository
```bash
git clone https://github.com/chatpethk444/AI-Resume-Analyzer.git
cd AI-Resume-Analyzer
```

### 3. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=3001
GEMINI_API_KEY=your_google_gemini_api_key_here
```
Start the backend server:
```bash
npm run dev
```

### 4. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```
Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3001
```
Start the frontend development server:
```bash
npm run dev -- -p 3002
```

### 5. Access the Application
Open your browser and navigate to `http://localhost:3002`.

---

## 🗄️ Database Schema (Supabase)
If you wish to utilize the history feature, execute the following SQL in your Supabase SQL Editor:
```sql
CREATE TABLE resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  parsed_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  job_description TEXT NOT NULL,
  match_score INTEGER NOT NULL,
  ai_feedback JSONB NOT NULL,
  is_guest BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own resumes" ON resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own resumes" ON resumes FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view their own analyses" ON analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own analyses" ON analyses FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
```

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
