# 🧠 Product Advisor — AI-Powered Recommendation App

An intelligent product recommendation web app built using **React**, **Node.js**, **Express**, **Supabase**, and **OpenAI/Gemini LLMs**. Users can input product queries, receive tailored AI advice, manage history, and install the app as a PWA.

---

## 📦 Tech Stack

| Tech              | Description                          |
| ----------------- | ------------------------------------ |
| React + Vite      | Frontend UI                          |
| Supabase          | Auth + Database                      |
| OpenAI API        | AI text generation                   |
| Gemini API        | Google AI fallback/alternative model |
| Node.js + Express | Backend API for advice & auth logic  |
| Zustand           | Lightweight state management         |
| Tailwind CSS      | Utility-first styling                |
| react-hot-toast   | UX feedback (toasts)                 |
| Vercel + Render   | Deployment platforms                 |

---

## 🧠 Features

### ✅ Phase 1: Authentication

- Register / Login / Logout
- Supabase email-based auth

### ✅ Phase 2: Protected Routes & Navbar

- Dashboard, Profile, History pages
- Private routing using context

### ✅ Phase 3: AI Advisor (LLM Integration)

- Generate advice from:
  - 🔹 OpenAI (ChatGPT)
  - 🔹 Gemini (Google AI)
  - 🔁 Auto fallback if one fails
- Store prompt + result + model used in Supabase

### ✅ Phase 4: Advice History

- View all past queries
- Rename / delete advice
- Model tag for each response

### ✅ Phase 5: Profile Management

- Update name
- Reset password via email
- Delete history
- Delete account (via secure backend)

### ✅ Phase 6: PWA Enhancement

- Installable on mobile/desktop
- Custom install prompt
- Offline-capable with service worker

---
