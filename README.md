# 💼 InklusiJobs

**Track:** SDG 8 — Decent Work & Economic Growth

> An accessibility-first platform that helps Persons with Disabilities become verified, job-ready professionals through personalized learning paths, portfolio-based challenges, and AI-driven skill and identity verification.

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Key Features](#-key-features)
- [PWD Identity Verification System](#-pwd-identity-verification-system)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [User Flows](#-user-flows)
- [What Makes InklusiJobs Different](#-what-makes-inklusijobs-different)
- [Existing Alternatives and Gaps](#-existing-alternatives-and-gaps)
- [Team](#-team)

---

## 🔍 Problem Statement

Despite the Magna Carta for Persons with Disabilities (RA 7277), many PWDs in the Philippines remain unemployed — not due to lack of ability, but due to a persistent skills and experience gap. Employers require prior experience even for entry-level roles, creating a cycle where capable workers cannot gain experience because they are not hired, and cannot be hired because they lack experience.

Certificates from online courses do not equate to real-world competence. PWDs struggle to prove their skills without work history or credible portfolios, while employers lack reliable ways to verify whether applicants can actually perform the job.

There is also currently no scalable, centralized system for verifying PWD identity in the Philippines. Fake PWD IDs remain a known and widespread problem that undermines trust across employment, retail, healthcare, and government services — a critical infrastructure gap that InklusiJobs directly addresses.

### Current Pain Points

| Pain Point | Description |
|---|---|
| 🔀 Mismatched Opportunities | Job platforms are not designed to highlight the skills and adaptable working style of PWDs, leading to mismatches with employer needs |
| 📉 Skill Gap Anxiety | Many PWDs are eager to work but lack a clear, structured path to bridge the gap between their current abilities and job requirements |
| 📄 Proof-of-Skill Drawback | Without traditional work history, it is difficult to build a compelling resume or portfolio that demonstrates real capability |
| 🏢 Employer Hiring Challenges | Employers struggle to find and confidently hire skilled workers from the PWD community due to a lack of verified skills and portfolio evidence |
| 🪪 PWD Identity Verification Gap | No reliable, scalable system exists for verifying PWD identity in the Philippines, enabling fraud that undermines trust across sectors |

---

## 💡 Solution

InklusiJobs is an end-to-end ecosystem connecting three key stakeholders: job seekers (primarily PWDs), employers, and an AI-powered verification system that bridges the trust gap between them.

The platform integrates personalized AI-generated learning roadmaps, hands-on portfolio-building challenges with automated evaluation, inclusive job matching, and multi-layer PWD identity verification — all within a single, WCAG 2.1 AA-compliant interface that dynamically adapts to the user's specific accessibility needs.

---

## ✨ Key Features

### 👤 For Job Seekers (PWDs)
- **Guided Multi-Step Onboarding** — Structured profile creation that provides the AI with sufficient context for personalized recommendations, covering technical skills, soft skills, career goals, and optional disability disclosure
- **AI Skills Gap Analysis** — Powered by the Gemini API, identifies specific skill gaps with actionable, encouraging insights tailored to the user's target role
- **Interactive Visual Roadmap** — Personalized learning pathway displayed as an interactive visual timeline with phases from Beginner to Advanced, recommended resources, and estimated completion timeframes
- **Portfolio Challenge Library** — Curated practical tasks spanning multiple skill categories and difficulty levels, including both pre-written and AI-generated challenges that simulate real work scenarios
- **Rubric-Based AI Evaluation** — Automated quality assessment with detailed feedback; each challenge is evaluated against strict rubrics for quality, completeness, and technical accuracy before being added to the portfolio
- **Badge and Certification System** — Visual recognition of verified skills with milestone achievement ceremonies
- **Public Portfolio Pages** — Shareable profile URLs showcasing verified work, AI evaluation scores, and demonstrated skills — serving as a credential-free alternative to traditional resumes
- **PWD Identity Verification** — Multi-layer system granting a "PWD Verified" badge visible to all employers on the platform

### 🏢 For Employers
- **Advanced Candidate Search** — Filter the verified talent pool by specific skills, availability, work arrangement preference, and disability type
- **Work Request System** — Streamlined hiring communication with in-platform notifications between employers and candidates
- **Employer Dashboard** — Centralized interface for candidate management, job posting, portfolio review, and hiring workflow
- **Inclusive Employer Badge** — A verified inclusive employer badge issued upon hiring through the platform, suitable for use on websites, job postings, and LinkedIn — supporting CSR and employer branding initiatives

### 🌐 Platform-Wide
- **Dual Dashboards** — Fully separate, role-based interfaces for workers (progress tracking, portfolio, roadmap) and employers (candidate management, job listings, hiring pipeline)
- **Messaging System** — In-platform real-time chat between job seekers and employers, with conversation history and notification support
- **Accessibility Panel** — Dynamic UI adjustments based on the user's specific disability profile, with strict adherence to WCAG 2.1 Level AA standards including screen reader support, keyboard navigation, high contrast modes, and skip links

---

## 🛡️ PWD Identity Verification System

One of InklusiJobs' core differentiators is its multi-layer PWD identity verification system, which directly addresses the widespread problem of fake PWD IDs in the Philippines. This system is built as both an internal platform feature and a foundation for a licensable B2B product.

### ⚙️ How It Works

1. **Multi-Document Submission** — Users are required to submit two documents simultaneously: a photo of their PWD ID (front and back) issued by their Local Government Unit, and one supporting document such as a medical certificate, barangay certification, or PhilHealth records indicating disability status. Requiring multiple documents significantly raises the difficulty of fraudulent submissions.

2. **AI-Powered Document Analysis** — The Gemini Vision API automatically performs OCR to extract text from uploaded documents, validates that all required fields are present (name, ID number, disability category, issuing LGU, expiry date), checks the ID format against known LGU PWD ID templates, and flags inconsistencies such as mismatched fonts, missing seals, or suspicious formatting patterns.

3. **Liveness Check (Selfie Verification)** — Users are prompted to take a real-time selfie holding their PWD ID during registration, implemented directly in the browser using the device's native camera API. This approach — consistent with standard KYC (Know Your Customer) practices used by banks — is extremely difficult to fake without access to both the physical ID and the registered user's face, and requires no special hardware.

4. **Duplicate ID Detection** — The extracted PWD ID number is stored in the database and cross-checked against all existing records upon each new submission. This prevents a single physical PWD ID from being registered across multiple accounts, a common fraud vector.

5. **Human Review Queue** — After AI pre-screening, submissions flagged as suspicious or requiring additional review are routed to a dedicated human reviewer queue accessible through the admin dashboard. Only accounts that pass both AI and human review receive the "PWD Verified" badge on their public profile.

### 🗺️ Verification Roadmap

| Phase | Timeline | Target |
|---|---|---|
| ✅ Short Term | MVP | Multi-document upload with Gemini Vision AI analysis and human review queue |
| 🔄 Medium Term | Post-launch | Partnership with NCDA and select LGUs to cross-reference ID numbers against official PWD registries |
| 🔮 Long Term | Future | PhilSys (Philippine National ID) integration for fully digital, government-backed verification |

### 🏦 Verification-as-a-Service (VaaS)

Beyond the employment platform, InklusiJobs is designed to operate a licensable B2B verification product. Every business that offers PWD discounts or must comply with RA 7277 — including SM, Robinsons, Mercury Drug, Jollibee, airlines, and hospitals — currently has no reliable way to verify whether a PWD ID is legitimate. InklusiJobs addresses this gap by enabling businesses to verify PWD status instantly at point-of-sale, during online transactions, or at service counters through a simple API integration. This is not a future plan — it is a core component of the InklusiJobs business model from launch.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, React, JavaScript / TypeScript, Tailwind CSS |
| **UI Components** | shadcn/ui, React Hook Form, React Dropzone |
| **Authentication** | Firebase Authentication (email/password and Google OAuth) |
| **Database** | Firestore (Firebase) |
| **File Storage** | Firebase Storage |
| **AI — Text** | Google Gemini API (skill gap analysis, roadmap generation, challenge evaluation) |
| **AI — Vision** | Google Gemini Vision API (OCR, PWD document analysis, formatting validation) |
| **AI — Fallback** | OpenRouter API (alternative model routing for reliability) |
| **PWD Verification** | Gemini Vision API + Browser Camera API (liveness check) + Firestore (duplicate detection) |
| **Deployment** | Vercel |
| **Dev Tools** | VS Code, Git / GitHub, npm / pnpm, Figma, Canva |

> ⚠️ **Implementation Note:** The original proposal referenced Supabase for authentication and database. The final implemented system uses **Firebase Authentication** and **Firestore** instead.

---


## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or pnpm
- A Firebase project with **Authentication**, **Firestore**, and **Storage** enabled
- A Google Gemini API key (with Vision API access)
- An OpenRouter API key (optional, used as fallback)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/inklusijobs.git
   cd inklusijobs
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Download face detection models** (required for liveness check)
   ```bash
   node scripts/download-face-models.js
   ```

4. **Configure environment variables**

   Create a `.env.local` file in the root directory. See the [Environment Variables](#-environment-variables) section below.

5. **Test your connections** (optional but recommended)
   ```bash
   node scripts/test-connections.js
   ```

6. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root with the following variables:

> Never commit `.env.local` to version control. It is listed in `.gitignore` by default.

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Google Gemini API (text + Vision)
GEMINI_API_KEY=

# OpenRouter API (fallback AI routing)
OPENROUTER_API_KEY=
```

> All `NEXT_PUBLIC_` variables are exposed to the browser. Never commit your `.env.local` file to version control.

---

## 🔄 User Flows

### 👤 Job Seeker (PWD)
1. Sign up via email/password or Google OAuth through Firebase Authentication
2. Select role as **Worker** on the path choice screen
3. Complete the multi-step onboarding form covering personal details, skills, career goals, and disability profile
4. Complete an interactive skill assessment with multiple question types
5. Receive an AI-generated personalized learning roadmap via the Gemini API
6. Optionally submit PWD ID and supporting documents through the multi-layer verification system to receive the "PWD Verified" badge
7. Follow the roadmap and complete portfolio challenges; each submission is AI-evaluated against a rubric before being added to the portfolio
8. Browse job listings filtered by verified skill match percentage
9. Apply with one click, automatically sharing the verified portfolio with the employer
10. Communicate with employers through the in-platform messaging system

### 🏢 Employer
1. Sign up via email/password or Google OAuth
2. Select role as **Employer** on the path choice screen
3. Complete employer onboarding including company profile and inclusive hiring preferences
4. Post job listings with required skills, work arrangement, compensation, and accommodation details
5. Browse and search candidates from the verified talent pool, filtered by skills, availability, and match score
6. Review individual portfolio pages including challenge scores, AI evaluation ratings, and verified badges
7. Contact shortlisted candidates via in-platform messaging
8. Mark positions as filled and submit post-hire feedback to improve future matching

---

## 🏆 What Makes InklusiJobs Different

- **End-to-End Platform** — Learning roadmaps, AI-evaluated portfolio challenges, job matching, and PWD identity verification are all integrated into one platform. No switching between tools.
- **Evidence-Based Portfolio Building** — Skills are demonstrated through completed, AI-graded challenges rather than stated credentials, removing the traditional work history barrier entirely.
- **Multi-Layer PWD Verification** — The only platform in the Philippines combining Gemini Vision AI document analysis, browser-based liveness detection, duplicate ID checking, and human review for reliable PWD identity verification.
- **Skills-First Employer Presentation** — Employer-facing profiles lead with verified skill scores, challenge outcomes, and AI ratings before any disability context appears, framing PWD hiring as a talent decision rather than a charitable one.
- **Built-In Employer Value Proposition** — Reduces time-to-hire, surfaces pre-verified candidates, supports RA 7277 compliance, and helps employers maximize the 25% additional tax deduction available under the Magna Carta for PWDs.
- **Verification-as-a-Service Infrastructure** — The verification system is architected from day one to be licensable to retailers, hospitals, airlines, and other institutions across the Philippines — making InklusiJobs not just a job platform, but a PWD verification infrastructure provider.

---

## 📊 Existing Alternatives and Gaps

| Platform | Category | Gap |
|---|---|---|
| PWD-E Inclusive Job Matching | PWD Employment | No skill development, portfolio building, or AI verification |
| Workera / Glider AI | Skill Assessment | No inclusivity features; no end-to-end learning-to-employment support |
| LinkedIn / Jobstreet / Upwork | General Employment | Relies on traditional credentials and work history; creates barriers for PWDs without conventional backgrounds |
| LinkedIn Learning / roadmap.sh | Upskilling | No AI-verified portfolio challenges, job matching, or PWD-specific accessibility features |
| Any existing platform | PWD Verification | No scalable, AI-assisted PWD identity verification infrastructure currently exists in the Philippines |

---

## 👥 Team

Built by a team of five for a hackathon under **SDG 8 — Decent Work & Economic Growth**.

| Name |
|---|
| Mary Marghareth Bueno |
| Julianni Jade Cuartero |
| Stephanie Comendador |
| Irish Francisco |
| Methuselah Noreen Presbitero |

---

*InklusiJobs — Bridging the gap between capability and opportunity for Persons with Disabilities in the Philippines.*