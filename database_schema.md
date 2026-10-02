# Backend Database Schema (PostgreSQL / Supabase)

## 1. Entity Relationship Overview
* `auth.users` (Managed by Supabase) $\rightarrow$ `public.resumes` ($1 : N$)
* `auth.users` (Managed by Supabase) $\rightarrow$ `public.analyses` ($1 : N$)
* `public.resumes` $\rightarrow$ `public.analyses` ($1 : N$)

## 2. Table Definitions

### Table: `public.resumes`
Stores uploaded resume files and extracted text. `user_id` is nullable to accommodate guest uploads.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique record ID |
| `user_id` | `UUID` | `NULLABLE`, `REFERENCES auth.users(id) ON DELETE CASCADE` | Owner ID (null for guests) |
| `file_name` | `TEXT` | `NOT NULL` | Original filename |
| `file_url` | `TEXT` | `NULLABLE` | Path in Supabase Storage bucket |
| `parsed_text` | `TEXT` | `NOT NULL` | Extracted raw text from document |
| `created_at` | `TIMESTAMPTZ`| `DEFAULT now()` | Timestamp of upload |

### Table: `public.analyses`
Stores analysis output, job descriptions, match scores, and structured AI response payloads.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique analysis ID |
| `user_id` | `UUID` | `NULLABLE`, `REFERENCES auth.users(id) ON DELETE CASCADE` | Associated user |
| `resume_id` | `UUID` | `NOT NULL`, `REFERENCES public.resumes(id) ON DELETE CASCADE`| Source resume |
| `job_title` | `TEXT` | `NULLABLE` | Detected or user-provided role title |
| `job_description`| `TEXT` | `NOT NULL` | Full JD content used for matching |
| `match_score` | `INT` | `NOT NULL` | Percentage score ($0 - 100$) |
| `ai_feedback` | `JSONB` | `NOT NULL` | Parsed JSON (strengths, gaps, keywords, diffs) |
| `is_guest` | `BOOLEAN` | `DEFAULT false` | Flag indicating guest-generated report |
| `created_at` | `TIMESTAMPTZ`| `DEFAULT now()` | Timestamp of run |

## 3. Indexes & Row-Level Security (RLS)

```sql
-- Indexes for performance
CREATE INDEX idx_analyses_user_id ON public.analyses(user_id);
CREATE INDEX idx_analyses_created_at ON public.analyses(created_at DESC);
CREATE INDEX idx_resumes_user_id ON public.resumes(user_id);

-- Enable RLS
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- Resumes Policies
CREATE POLICY "Users can view their own resumes"
ON public.resumes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert resumes"
ON public.resumes FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Analyses Policies
CREATE POLICY "Users can view their own analyses"
ON public.analyses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert analyses"
ON public.analyses FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
```