# Project Reflect 
## 🌿A mindful journaling and meditation PWA built for personal growth, not engagement metrics.
### 📖 About
Project Reflect is a personal "refuge" app designed to replace aimless social media scrolling with structured, valuable reflection. It combines daily journaling, guided meditation, and a gentle gamification system to encourage consistent mindfulness practice.Unlike traditional apps that demand your attention with "streaks" and red badges, Project Reflect is designed to be a quiet, supportive tool that you want to open.
## ✨ Key Features
### 🌱 The Garden: 
A gentle gamification layer where your consistency nurtures a virtual plant from seed to flower. No streaks to break, just growth to nurture.
### 📝 Daily Reflections: 
A structured flow (Triage -> Meditation -> Journal) that adapts to your current mood.
## 🛠️ Tech Stack
- Frontend: React (Vite)
- Styling: Tailwind CSS (Theme: Peach, Mauve, Purple)
- Backend: Firebase (Firestore, Auth, Storage)
- Platform: PWA
## 🚀 Getting Started
### Prerequisites
- Node.js (v18+)
- A Firebase Project (Blaze plan required for Cloud Functions/Scheduler)
## Installation
### Clone the repo
```
git clone [https://github.com/jacksakers/projectreflect.git](https://github.com/jacksakers/projectreflect.git)
cd project-reflect
Install dependencies
npm install
```
## Environment Setup
Create a `.env` file in the root directory:
``` VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
## Run Locally
`npm run dev`
## 📄 License
Distributed under the MIT License.
