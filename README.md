# Agentic MedPass

> **A lightweight, offline-ready progressive web app replacing illegible paper prescriptions with verified, structured digital passes for partner pharmacy dispensing.**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-336791?style=flat&logo=postgresql)](https://github.com/pgvector/pgvector)
[![PWA](https://img.shields.io/badge/PWA-Offline--First-orange?style=flat)](https://web.dev/progressive-web-apps/)
[![Clinical Safety](https://img.shields.io/badge/Gate%20Bypass-0%25%20Tolerance-success)](#clinical-safety--guardrails)

---

## 1. Overview

In resource-constrained and peri-urban medical environments (initial rollout: Nigeria), informal paper prescriptions and rushed handwriting frequently lead to misread dosages, clinical poisoning, transit waste, and counter dispensing disputes. Patients often travel long distances only to find their paper slips illegible, torn, or rejected.

**Agentic MedPass** bridges the clinic and the retail counter:
1. **Clinic Staff** paste raw consultation notes into the system.
2. An **Artificial Intelligence Extraction Engine** parses structured clinical facts (medication, dose units, frequency, duration, refills) and detects omissions deterministically at `temperature: 0.0`.
3. The **Licensed Clinic Owner** compares a visual side-by-side text diff, confirms verification, and cryptographically signs issuance using a 4-digit PIN (**guaranteeing a 0% gate bypass rate**).
4. The system dispatches an interactive web pass link via the **WhatsApp Cloud API**, falling back to plain-text SMS via **Termii** if data connectivity fails.
5. The **Patient** views dosage instructions, storage guidelines, power outage rules, and presents a pure-white padded QR canvas code at an accredited partner pharmacy counter.
6. The **Dispenser** authenticates via WhatsApp magic link, challenges the patient verbally for their birth year, and records dispensing through an online-only atomic transaction.

---

## 2. Key Features

### Patient Digital Web Pass
* **Pure-White High-Contrast Canvas QR**: 2D client-rendered QR code inside a `#FFFFFF` container with a 6-character alphanumeric fallback (`MED-742`) and a "Turn screen brightness up" guidance notice.
* **Everyday Dosage Language**: Translates medical shorthand into clear, everyday phrasing without clinical acronyms (e.g. *"Inject 1 dose every Friday morning under the skin with or without food"*).
* **Storage & Power Outage Excursions**: Explicit temperature limits and emergency power failure guidance (e.g. *"Keep in fridge. If power fails, this medicine stays safe at room temperature up to 30°C for 21 days"*).
* **Refill & Balance Tracking**: Live balance tracking (*"Box 1 of 3 collected. 2 refills remaining"*) with programmatic expiration.
* **Grounded Safety Assistant**: RAG assistant answering strictly from verified pharmacological monograph chunks; acute symptom detection triggers immediate input lockdown and native `tel:` dialer buttons.
* **100% Offline Caching**: Full pass data cached locally in IndexedDB; application shell and styles cached via Cache-First Service Worker (`public/sw.js`).

### Clinic Staff & Owner Portal
* **Intake Screen**: Single-textarea ingestion for raw doctor consultation notes with missing-field alerts and formulary matching.
* **Owner Approval & Diff Screen**: Side-by-side comparative visual diff between source notes and structured fields, diff verification checkbox, and 4-digit PIN authorization.

### Partner Pharmacy Dispenser Screen
* **Passwordless WhatsApp Magic Link**: One-tap secure session generation sent to the dispensary's verified WhatsApp business line.
* **Counter Identity Challenge**: Verbal patient birth year challenge matching `Patient.birthYear` to prevent unauthorized pickups on shared devices.
* **Online-Only Atomic Dispense**: Atomic database transaction (`prisma.$transaction`) enforcing `Prescription.status == 'ISSUED'` and decrementing refills to prevent double-redemptions.

---

## 3. Tech Stack & Architecture

```
  [ Clinic Staff / Owner ]                [ Patient Device ]               [ Pharmacy Counter ]
             |                                    |                                 |
             v                                    v                                 v
  +-----------------------+              +------------------+             +--------------------+
  | Next.js Admin Console |              | Next.js PWA Pass |             |  Dispenser Portal  |
  |  (App Router + SSR)   |              | (Cache-First SW) |             | (Magic Link Auth)  |
  +-----------------------+              +------------------+             +--------------------+
             |                                    |                                 |
             +------------------+                 |                                 |
                                |                 |                                 |
                                v                 v                                 v
                     +-------------------------------------------------------------------+
                     |                   Next.js Server Actions & APIs                   |
                     +-------------------------------------------------------------------+
                                |                         |                 |
                                v                         v                 v
                     +---------------------+    +-------------------+   +--------------------+
                     | Groq LLM (Primary)  |    | WhatsApp API      |   | Termii SMS         |
                     | Cerebras (Failover) |    | (Utility Passes)  |   | (Fallback Gateway) |
                     +---------------------+    +-------------------+   +--------------------+
                                |
                                v
                     +---------------------------------------+
                     |          PostgreSQL Database          |
                     |  - Prisma ORM (Relational Data)       |
                     |  - pgvector (384-dim Embeddings)      |
                     |  - Atomic Transactions & Audit Logs   |
                     +---------------------------------------+
```

* **Framework**: Next.js 14 (App Router)
* **Language**: TypeScript 5.6
* **Database & ORM**: PostgreSQL with `pgvector` extension and Prisma ORM
* **Vector Model**: `all-MiniLM-L6-v2` producing 384-dimensional embeddings (HNSW cosine distance index, `< 0.28` threshold)
* **AI Extraction**: Llama-3-70B on Groq Cloud (`temperature: 0.0`) with Cerebras / Mistral automatic failover
* **Messaging Gateways**: Meta WhatsApp Cloud API (Primary) + Termii SMS Gateway (Fallback)
* **Payments**: Paystack (Clinic subscription billing: ₦20,000/month/branch; 100% free for patients)
* **Design System**: Semantic Token Architecture (`src/styles/tokens.css` from `design-tokens.tokens.json`)
* **Iconography**: [Lucide Icons](https://lucide.dev/icons/) (Locked Source of Truth)

---

## 4. Performance & Clinical Budgets

| Metric | Target Budget | Enforcement Mechanism |
| :--- | :--- | :--- |
| **Patient Pass Bundle Size** | $< 150\text{ KB}$ gzipped | Strict code splitting; no server modules in patient route. |
| **Cold Load Latency** | $< 2.0\text{ s}$ | Tested on simulated Slow 3G / Android Go specifications. |
| **Dispenser Verification** | $< 5.0\text{ s}$ | Lightweight counter screen over active internet. |
| **Animation Frame Rate** | Constant 60 FPS | Flat visual hierarchy; zero 3D matrix transforms or blur filters. |
| **Gate Bypass Rate** | Exactly 0% | Block token release without verified owner PIN and diff acknowledgment. |
| **Doctor Edit Rate** | $< 15\%$ | Log field modifications between AI extraction and owner approval. |
| **Clinical Mismatch Rate**| $< 0.1\%$ | Log counter presentation rejections (`REASON_CLINICAL_MISMATCH`). |

---

## 5. Design System & Token Hierarchy

The project strictly follows a two-tier token hierarchy to guarantee UI consistency and accessibility:

1. **Primitives Tier (`--primitive-*`) [PRIVATE - DO NOT USE IN UI]**:
   - Palette swatches and key colors generated from `design-tokens.tokens.json`.
   - Used solely as internal variables.
2. **Color Roles Tier (`--color-*`) [SEMANTIC - USE DIRECTLY IN UI]**:
   - All components, surfaces, texts, borders, and badges consume semantic roles:
     - Actions: `--color-primary`, `--color-on-primary`, `--color-primary-container`
     - Surfaces: `--color-surface`, `--color-surface-container`, `--color-background`
     - Outlines & States: `--color-outline-color`, `--color-outline-variant`, `--color-error`
3. **Typography**:
   - Base font: `'DM Sans'`, sans-serif.
   - 15 standard scales across `display`, `headline`, `title`, `body`, and `label`.
4. **Touch Targets**:
   - All interactive controls enforce a minimum touch target of $\ge 44\text{px}$ (`min-height: 48px`).

---

## 6. Directory Layout

```
agentic-medpass/
├── prisma/
│   ├── schema.prisma              # Relational models and pgvector extension
│   └── seed.ts                    # Clinical monographs and demo facility seed
├── public/
│   ├── icons/                     # Web manifest and application icons
│   ├── manifest.json              # PWA manifest
│   └── sw.js                      # Cache-First offline service worker
├── src/
│   ├── actions/                   # Next.js Server Actions ('use server')
│   │   ├── auth.ts                # PIN verification & WhatsApp magic links
│   │   ├── dispense.ts            # Atomic counter dispensing
│   │   ├── extraction.ts          # AI clinical note parsing
│   │   └── prescriptions.ts       # Prescription state changes
│   ├── app/                       # App Router routes
│   │   ├── (dispenser)/verify/    # Pharmacy scanner and verification
│   │   ├── (patient)/pass/[token]/# Minimalist offline PWA pass view
│   │   ├── (staff)/approve/       # Owner diff review & PIN authorization
│   │   ├── (staff)/draft/         # Staff raw text intake
│   │   ├── api/assistant/         # Grounded patient safety chat
│   │   ├── api/webhooks/          # WhatsApp & Paystack listeners
│   │   ├── globals.css            # Global styles consuming design tokens
│   │   ├── layout.tsx             # Root layout with DM Sans & PWA meta
│   │   └── page.tsx               # Minimalist 100dvh landing portal
│   ├── components/                # Reusable React components
│   │   ├── dispenser/             # Counter challenge UI
│   │   ├── patient/               # High-contrast white canvas QR card
│   │   ├── staff/                 # Extraction diff review components
│   │   └── ui/                    # Base primitives (Button, Card, Badge)
│   ├── lib/                       # Singletons and pure utilities
│   │   ├── ai/                    # LLM clients & failover queue
│   │   ├── db/                    # Prisma singleton instance
│   │   ├── messaging/             # WhatsApp & Termii clients
│   │   ├── vector/                # Local embedding pipeline & pgvector
│   │   └── env.ts                 # Startup Zod environment validation
│   ├── styles/
│   │   └── tokens.css             # CSS variables generated from tokens.json
│   └── types/                     # Shared TypeScript schemas
│       ├── clinical.ts            # Zod schemas & clinical types
│       └── messaging.ts           # Webhook payload interfaces
├── scripts/
│   └── build-tokens.js            # Automated design tokens to CSS compiler
├── design-tokens.tokens.json      # Figma design tokens source of truth
└── package.json
```

---

## 7. Getting Started

### Prerequisites
* **Node.js**: `v18.17.0` or higher
* **PostgreSQL**: `v15+` with `pgvector` extension enabled
* **npm** or **pnpm**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Cannon-Leo/Agentic-Medpass.git
   cd Agentic-Medpass
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/medpass?schema=public"
   DIRECT_URL="postgresql://user:password@localhost:5432/medpass?schema=public"
   GROQ_API_KEY="gsk_..."
   CEREBRAS_API_KEY="csk-..."
   WHATSAPP_API_TOKEN="EAAB..."
   WHATSAPP_PHONE_NUMBER_ID="10987654321"
   WHATSAPP_WEBHOOK_VERIFY_TOKEN="medpass_verify_secret"
   TERMII_API_KEY="termii_key_..."
   PAYSTACK_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Compile Design Tokens**:
   ```bash
   npm run tokens
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 8. Clinical Safety & Guardrails

* **Zero Speculation Policy**: If a patient query does not match approved drug monographs with a cosine distance $< 0.28$, the system strictly outputs: *"This information is not in your approved record. Call your clinic directly"* and presents a native `tel:` call button.
* **Deterministic Emergency Triage**: Every patient input is tested against acute medical symptom regular expressions (`chest pain`, `shortness of breath`, `anaphylaxis`) with full negation detection (`no chest pain`, `never had shortness of breath`). Detection of emergency triggers immediately locks the chat interface and renders an emergency clinical banner.
* **Online Dispensing Guarantee**: Offline dispensing is blocked on the pharmacy portal. Redemptions require active connectivity to perform atomic updates on the database ledger, preventing double-redemption of duplicated tokens.

---

## 9. License

This project is proprietary and confidential. Unauthorized copying, modification, distribution, or deployment is strictly prohibited.

