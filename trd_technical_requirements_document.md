# Technical Requirements Document (TRD)

## 1. System Architecture
A decoupled full-stack architecture comprising a Next.js frontend, an Express/Node.js backend for file processing and AI orchestration, and Supabase for managed PostgreSQL, Auth, and Storage.

## 2. Technology Stack

| Layer | Technology | Purpose & Rationale |
| :--- | :--- | :--- |
| **Frontend** | Next.js (App Router), Tailwind CSS, Lucide Icons | Responsive UI, fast SSR/client transitions, clean design primitives |
| **Backend** | Node.js, Express.js | Dedicated API service, PDF parsing isolation, OpenAI API proxy |
| **Database** | PostgreSQL (Supabase) | Relational persistence, JSONB support for flexible AI payloads |
| **Auth** | Supabase Auth | Handles guest-to-registered user migrations, JWT token verification |
| **Storage** | Supabase Storage | Encrypted bucket for storing uploaded PDF files |
| **AI Integration**| OpenAI API (`gpt-4o-mini`) | Context parsing, keyword matching, structured JSON output |

## 3. API Contract & Data Exchange
* **Structured Output:** OpenAI requests must enforce JSON Schema / response format mode to guarantee consistent parsing:
```json
{
  "match_score": 82,
  "strengths": ["Strong TypeScript background", "Demonstrated CI/CD experience"],
  "weaknesses": ["Lacks mention of Kubernetes/Docker clustering"],
  "keywords": {
    "matched": ["React", "Node.js", "REST"],
    "missing": ["Kubernetes", "GraphQL", "AWS Lambda"]
  },
  "recommendations": [
    {
      "original": "Built server APIs.",
      "improved": "Engineered RESTful Node.js microservices handling 10k+ RPM.",
      "reasoning": "Quantifies impact and highlights backend scalability keywords from the JD."
    }
  ]
}
```

## 4. Technical Constraints & Security
* **PDF File Constraint:** Maximum file size capped at 2MB via backend middleware (`multer`).
* **Rate Limiting:** Express rate limiting (`express-rate-limit`) keyed on client IP for guest endpoints to curb OpenAI token abuse.
* **Input Sanitization:** Guardrails against prompt injection in raw resume and JD inputs.
* **CORS & Environment Isolation:** Frontend and backend communicate with strict CORS whitelisting and credentials.