# UI/UX Design Specification

## 1. Design Principles & System
* **Aesthetic:** Clean, high-trust, developer/recruiter-friendly (Slate, Deep Navy, Emerald Green, Soft Red).
* **Typography:** `Inter` or system sans-serif for high legibility.
* **Feedback-First:** Immediate micro-interactions and explicit progress cues during AI inference.

## 2. Page & Screen Layouts

### 2.1 Landing / Input View (Split-Screen)
* **Hero Banner:** Headline explaining the 30-second trial value proposition with a primary CTA "Try Free without Login".
* **Left Column (Resume Input):**
  * Drag-and-drop file target (PDF only, max 2MB).
  * Alternative tab: "Paste Text".
* **Right Column (Job Description):**
  * Text area with placeholder guiding the user to paste the target JD.
* **Bottom Action:** Prominent "Analyze Resume" button.

### 2.2 Processing / Loading State
* Skeleton shimmer UI over the dashboard area.
* Dynamic status stepper:
  1. *Extracting resume text...*
  2. *Scanning ATS keywords against JD...*
  3. *Generating tailored recommendations...*

### 2.3 Results Dashboard
* **Top Metric Bar:** Radial Gauge displaying Match Score ($0 - 100\%$) alongside high-level badges (e.g., "Good Match", "Needs Optimization").
* **Keyword Breakdown Grid:**
  * Pill tags in green for Matched Keywords.
  * Pill tags in red/gray with a "+" icon for Missing Keywords.
* **Strengths & Weaknesses Panel:** Two equal-height cards summarizing key takeaways.
* **Before / After Diff Cards:**
  * Side-by-side or stacked diff view.
  * Collapsible "AI Reasoning" badge showing why the rewrite improves ATS ranking and recruiter clarity.
* **Sticky Conversion Banner (For Guests):** "Save these results to your history — Create your free account."

### 2.4 User Dashboard (Authenticated)
* Table/cards list of previous analyses with date, role title, and score.
* Ability to re-open previous Before/After reports or export to Markdown/PDF.