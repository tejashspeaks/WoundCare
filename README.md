# WoundCare-VLM 🩺🩹

**AI Vision-Language Model for Rural Wound Classification, Severity Grading, and Multilingual First-Aid Triage**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38bdf8.svg)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-orange.svg)](https://ai.google.dev/)

---

## 📌 Overview

**WoundCare-VLM** is an edge-ready, multimodal healthcare application designed to bridge the critical first-aid gap in rural, industrial, and resource-constrained environments. Powered by Google's Gemini Vision-Language Models alongside deterministic offline clinical heuristic engines, WoundCare-VLM delivers rapid wound classification, severity triage, step-by-step treatment guidance, and emergency routing in multiple regional languages (**English, Hindi, Tamil**).

---

## ✨ Key Features

### 👁️ Multimodal Wound Classification & Triage
- **Vision-Language Analysis**: Identifies wound morphology (lacerations, abrasions, puncture wounds, incised wounds, burns, contusions, animal bites, chronic ulcers).
- **Severity Grading**: Real-time classification into **Mild**, **Moderate**, and **Severe** categories with clinical confidence scores.
- **Infection Risk Detection**: Scans for erythema, purulent exudate, localized edema, and necrotic tissue.
- **Tetanus & Pathogen Alert**: Assesses contamination risk (rust, soil, animal saliva) and recommends Tetanus Toxoid (TT) vaccination schedules.

### 🌐 Multilingual Guidance & Voice Assistance
- **Trilingual First-Aid Protocols**: Provides step-by-step cleaning, dressing, and elevation guidance in **English**, **हिंदी (Hindi)**, and **தமிழ் (Tamil)**.
- **Voice Playback (TTS)**: Hands-free auditory instructions via Web Speech Synthesis for high-stress emergency scenarios.

### ⏱️ Critical Emergency & Trauma Intelligence
- **Golden Hour Countdown**: Dynamic countdown timer for severe trauma cases with direct triggers for 108 ambulance dispatch and SMS caretaker alerts.
- **Blood Loss Estimator**: Estimates fluid loss (mL) and classifies hemorrhage stage (Class I–IV) with urgent direct-pressure and tourniquet directives.
- **Foreign Object Detection**: Detects embedded glass, metal, or wood fragments with critical warnings against unsafe extraction.
- **Snake & Animal Bite Identifier**: Identifies puncture patterns (elapid/viper fangs vs. mammalian bites) and routes patients to hospitals with anti-venom stocks.

### 🌿 Holistic & Clinical Personalization
- **Patient Profile & Allergy Safety**: Enforces safety cross-checks against patient allergies (Iodine/Betadine, Latex, Penicillin, Adhesives) and warns of diabetic microvascular delay risks.
- **Ayurvedic Complementary Care**: Safe, non-invasive home remedies (Turmeric paste, Neem wash, Honey, Aloe Vera) categorized alongside standard clinical care.
- **Wound Age & Scar Risk Estimator**: Predicts tissue healing phase (Hemostasis, Inflammatory, Proliferative, Maturation) and hypertrophic scar probabilities.
- **Weather-Aware Healing Banner**: Adapts dressing and moisture recommendations based on real-time ambient temperature and humidity conditions.

### 🏥 Offline-First & Clinical Documentation
- **Dual-Engine Architecture**: Seamless fallback to pre-compiled clinical rule trees during low-bandwidth or offline conditions.
- **Hospital & Trauma Locator**: Maps nearest PHCs, CHCs, and tertiary trauma facilities with distance, contact numbers, and bed availability indicators.
- **PDF Clinical Dossier**: Exports comprehensive medical dossiers with ICD-10 codes, photographic evidence, GPS coordinates, and timestamped triage summaries.

---

## 🛠️ Architecture & Tech Stack

```text
┌─────────────────────────────────────────────────────────────┐
│                    WoundCare-VLM Client                     │
│  React 19 • TypeScript • Tailwind CSS v4 • Lucide • Motion  │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│   Full-Stack Express Proxy   │ │    Offline Rule Engine     │
│       (Node.js / tsx)        │ │  (Deterministic Fallback)  │
└──────────────┬───────────────┘ └────────────────────────────┘
               │
               ▼
┌──────────────────────────────┐
│  Google Gemini 2.5 Flash API │
│  (Multimodal Vision & NLP)   │
└──────────────────────────────┘
```

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide React, jsPDF
- **Backend**: Express.js server (`server.ts`) proxying Gemini VLM requests
- **AI / VLM SDK**: `@google/genai` (Google Gen AI SDK)
- **Speech & Geolocation**: Web Speech Synthesis API, Web Geolocation API

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ or v20+ recommended
- **npm** or **pnpm**
- **Google Gemini API Key** (available from [Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd woundcare-vlm
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Running in Development

Start the full-stack development server:
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### Production Build

Compile the React frontend and bundle the backend server:
```bash
npm run build
npm start
```

---

## 📂 Project Structure

```text
├── server.ts                    # Express backend & Gemini VLM API integration
├── src/
│   ├── main.tsx                 # Client entry point
│   ├── App.tsx                  # Root application component & global navigation
│   ├── index.css                # Global Tailwind CSS styling
│   ├── types.ts                 # TypeScript interfaces, enums, and data types
│   ├── components/              # Modular UI components
│   │   ├── WoundScanner.tsx     # Primary camera & photo analysis engine
│   │   ├── MultiWoundScanner.tsx# Multi-site batch wound inspection
│   │   ├── CaseHistory.tsx      # Chronological case logs & audit trail
│   │   ├── WoundProgressTracker.tsx # Time-series healing progression comparison
│   │   ├── HospitalLocator.tsx  # Nearest PHC / Trauma facility locator
│   │   ├── PatientProfileTab.tsx# Allergy profiles & diabetic safety toggles
│   │   ├── GoldenHourCountdown.tsx # Emergency countdown timer
│   │   ├── BloodLossEstimator.tsx  # Hemorrhage assessment & pressure guide
│   │   ├── ForeignObjectDetector.tsx # Foreign body warning & protocols
│   │   ├── SnakeAndAnimalBiteIdentifier.tsx # Venomous bite identification
│   │   ├── AyurvedicAdvisor.tsx # Complementary natural remedy guidance
│   │   └── ...
│   └── utils/                   # Helper functions (speech, PDF generation)
│       ├── speech.ts            # Multilingual Text-To-Speech engine
│       └── pdfGenerator.ts      # Clinical triage PDF report builder
├── metadata.json                # AI Studio application metadata & permissions
└── package.json                 # Project dependencies and npm scripts
```

---

## 🛡️ Medical Disclaimer

> **IMPORTANT**: WoundCare-VLM is designed as an assistive triage aid and educational tool for emergency first-aid situations. It does **not** replace professional medical diagnosis, surgery, or clinical judgment by licensed physicians. For life-threatening injuries, immediately call local emergency services (**108** / **112** in India, **911** in the US) or proceed to the nearest emergency trauma department.

---

## 📄 License

This project is licensed under the MIT License.
