# Application Flow (User Journey)

## 1. Complete Workflow Diagram

```
[ Visitor Lands on Site ]
           │
           ├─── Choice A: [ Sign Up / Log In ] ───► [ Authenticated Dashboard ]
           │                                                │
           └─── Choice B: [ Guest Mode (Direct Use) ]       │
                                    │                       │
                                    ▼                       ▼
                         [ Input Screen: Upload Resume & Paste JD ]
                                    │
                                    ▼
                         [ Trigger: Click "Analyze Resume" ]
                                    │
                                    ▼
                         [ Backend: Parse PDF + Check Limits ]
                                    │
                                    ▼
                         [ OpenAI API: Structured JSON Generation ]
                                    │
                                    ▼
                         [ Results Screen Displayed ]
                           - Score Gauge
                           - Matched & Missing Keywords
                           - Before/After Improvements
                           - AI Reasoning Tooltips
                                    │
                 ┌──────────────────┴──────────────────┐
                 ▼                                     ▼
        [ Guest User ]                         [ Logged-in User ]
                 │                                     │
      [ Prompted to Sign Up ]                [ Auto-Saved to DB ]
      to save analysis history                         │
                 │                           [ Viewable in History Tab ]
                 ▼
      [ Account Created ] ──► [ Link Session Analysis to New User ]
```

## 2. Step-by-Step Flow Details

1. **Step 1: Intake**
   * User drops a PDF into the drop zone.
   * User pastes target role description.
   * System performs local validation (file format, file size $\le$ 2MB, JD minimum length $\ge$ 50 words).

2. **Step 2: Processing & Guardrails**
   * Client sends payload to `POST /api/analyze`.
   * Server checks IP rate limit for guest sessions.
   * Server extracts raw text via `pdf-parse`.

3. **Step 3: AI Inference**
   * Server formats the system prompt and injects sanitized Resume and JD content.
   * OpenAI processes the request and returns structured JSON.

4. **Step 4: Interactive Review**
   * Client receives analysis payload and renders the Results Dashboard.
   * User inspects keywords, score, and inspects AI reasoning on rewritten bullet points.

5. **Step 5: Retention & Conversion**
   * If Guest: Banner prompts signup to preserve the scan. On successful signup, frontend passes the temporary `analysisId` to link with the newly authenticated profile.
   * If Logged-in: Analysis auto-persists to the user's database records.