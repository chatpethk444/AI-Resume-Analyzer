# Product Requirements Document (PRD)

## Project Name
**AI-Powered Resume Analyzer**

## 1. Executive Summary
AI-Powered Resume Analyzer is a targeted web tool designed for job seekers to match and optimize their resumes against specific Job Descriptions (JDs). It identifies strengths, gaps, and missing keywords, offering actionable sentence-level rewrites with transparent AI reasoning. It includes a frictionless 30-second Guest Mode to showcase immediate value without requiring prior registration.

## 2. Problem Statement
* Job applicants struggle to bypass ATS (Applicant Tracking Systems) due to missing domain-specific keywords.
* Existing tools produce generic feedback without showing *why* a particular phrase or keyword is necessary.
* High onboarding friction (mandatory signups, credit cards) deters potential users before they can experience product value.

## 3. Target Audience
* **Job Seekers:** Professionals and new grads actively tailoring resumes for specific roles.
* **Recruiters & Hiring Managers:** Evaluators interested in seeing an end-to-end applied AI product demonstration.

## 4. Core Features & Scope

### 4.1 Guest Mode (Zero-Friction Tryout)
* Users can upload a resume and paste a JD without logging in.
* Fast analysis completed within 30 seconds.
* Rate-limited per IP/Session (e.g., 1 scan per session) with a clear CTA to sign up for saving history and accessing unlimited scans.

### 4.2 Document Intake & Extraction
* Support for PDF uploads ($\le$ 2MB) and direct raw text copy-paste.
* Parsing engine extracts clean text for AI evaluation.

### 4.3 JD Matching & Scoring Engine
* Text comparison between resume content and JD requirements.
* Overall Match Score percentage ($0 - 100\%$).
* Categorized breakdown: Strengths, Critical Weaknesses, and Missing vs. Matched Keywords.

### 4.4 Actionable Recommendations & AI Reasoning
* Before/After comparison for underperforming resume bullet points.
* Transparent tooltips/cards showing "Why AI recommends this change" (AI Reasoning).

### 4.5 User Dashboard & History (Authenticated Users)
* Email/OAuth authentication.
* Saved scan histories and previous Before/After reports.