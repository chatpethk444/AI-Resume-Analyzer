# Step-by-Step Implementation Plan

## Phase 1: Environment Setup & Infrastructure
- [ ] Initialize monorepo or dual-directory workspace (`frontend/` with Next.js, `backend/` with Express).
- [ ] Install styling dependencies (`tailwindcss`, `lucide-react`, `shadcn/ui` primitives).
- [ ] Provision a Supabase project and execute table migrations (`resumes`, `analyses`, RLS policies).
- [ ] Create a dedicated Supabase Storage bucket for PDF uploads (`resumes-bucket`).

## Phase 2: Backend API & AI Integration
- [ ] Implement file upload middleware using `multer` with a 2MB size cap.
- [ ] Integrate `pdf-parse` to convert incoming PDF streams into sanitized text strings.
- [ ] Set up the OpenAI SDK client (`gpt-4o-mini`).
- [ ] Construct the system prompt enforcing structured JSON output (Score, Strengths, Weaknesses, Keywords, Recommendations with Reasoning).
- [ ] Implement `POST /api/analyze` handling both guest requests and authenticated requests.
- [ ] Implement `express-rate-limit` for guest endpoints.

## Phase 3: Frontend Construction & Guest Mode
- [ ] Build the Split-Screen input layout (File dropzone + JD textarea).
- [ ] Build the interactive results dashboard:
  - Match Score component (gauge or radial display).
  - Keywords tag container (matched vs. missing).
  - Strengths and Weaknesses display cards.
  - Before/After rewrite comparison with expandable AI Reasoning cards.
- [ ] Implement loading skeleton with progressive status messages.
- [ ] Connect frontend form to `POST /api/analyze` to ensure complete end-to-end guest flow.

## Phase 4: Authentication & Persistence
- [ ] Configure Supabase Auth in Next.js (Email Magic Link / Password / OAuth).
- [ ] Implement Guest-to-User conversion logic: update `user_id` on existing guest records when an account is registered.
- [ ] Build `/dashboard/history` allowing logged-in users to list, search, and view previous reports.

## Phase 5: Hardening, Polish & Deployment
- [ ] Add client-side and server-side input validation.
- [ ] Test edge cases (unparseable PDFs, empty JDs, malformed AI responses).
- [ ] Deploy frontend to Vercel and backend to Railway/Render.
- [ ] Configure production environment secrets and test the end-to-end flow.