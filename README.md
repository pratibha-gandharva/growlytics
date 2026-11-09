# 🌱 Growlytics

> **"Grow your skills. Build your proof. Track your progress."**

**Growlytics** is a personal learning journal, portfolio readiness tracker, and internship preparation platform designed specifically for college students preparing for technical interviews. It bridges the gap between learning to code and building verifiable, interview-ready engineering proof.

---

## 🌟 Key Features

### 1. 🪴 Project Garden (Showcase & Milestone Pipelines)
- **Verifiable Proof**: Showcase real projects with live demo URLs, GitHub repository links, and tech stack tags.
- **Milestone Pipelines**: Break complex projects into demonstrable engineering milestones (e.g., *Database indexing*, *WebSocket connection pools*, *Zod validation*).
- **Interactive Checklists**: Checking off completed milestones dynamically increases your demonstrated skill proficiencies and portfolio readiness.
- **Full CRUD Management**: Add new projects, edit existing entries, filter by category (*Full-Stack, Frontend, Backend, AI/ML, Cloud/DevOps*), or delete with safe confirmation modals.

### 2. 🧭 Skill Gap Explorer (Role Benchmarking)
- **Target Role Benchmarks**: Benchmark against industry expectations for:
  - *Full-Stack Developer Intern*
  - *Frontend Engineer Intern*
  - *Backend Engineer Intern*
  - *AI / Machine Learning Engineer Intern*
- **Visual Radar Chart**: Spider/Radar comparison (powered by Recharts) comparing your verified level against the industry benchmark.
- **Three-Tier Status**: Clearly distinguishes **Demonstrated** (fully met), **Developing** (partially demonstrated), and **Missing** skills.
- **Interviewer Context**: Explains *why* companies evaluate each skill and provides actionable steps to close the gap.

### 3. 🎯 My Growth Path (Customizable Learning Roadmap)
- **Deterministic Curriculum Templates**: Seeded role-based roadmaps with free high-quality documentation links (MDN, React.dev, Redis.io, Docker Curriculum, Playwright, System Design Primer).
- **Custom Tasks**: Add personal coursework or milestones alongside suggested tracks.
- **Actionable Portfolio Challenges**: Concrete suggestions on what feature or test suite to build to prove mastery.
- **Progress Velocity**: Check off roadmap tracks to immediately increase your readiness score.

### 4. ⏱️ Study Session & Practice Tracker
- **Deep Work Sessions**: Log independent study time with topic, duration in minutes, notes, and roadmap task links.
- **Practice Tracking**: Record LeetCode / DSA problem sets, concept quizzes, and system design drills with questions attempted vs. correct.
- **Real Metrics**: No fabricated numbers; dashboard stats compute genuine study time and accuracy.

### 5. 🤖 Growlytics AI Learning Companion
- **Contextual Preparation**: Tailored to your active target role, identified skill gaps, and learning velocity.
- **Secure Architecture**: Server-side proxy / Firebase Cloud Function architecture prevents exposing secret keys in frontend bundles.
- **Concept Explanations & Quizzes**: Explains tricky topics (e.g. SQL indexing, async event loops, React memoization) and generates practice questions.

---

## 🔒 Multi-User Security & Firestore Data Model

All private student data is strictly isolated within the authenticated user's unique Firestore namespace:

```
users/{uid}
├── projects/{projectId}
│   └── milestones/{milestoneId}
├── roadmapTasks/{taskId}
├── studySessions/{sessionId}
├── practiceRecords/{recordId}
├── skills/{skillId}
└── preferences/settings
```

### Firestore Security Rules (`firestore.rules`)

Security is enforced at the database level using Firebase Authentication verified user tokens:
- **Authentication Required**: All reads, writes, updates, and deletes require a valid `request.auth.uid`.
- **Ownership Verification**: `request.auth.uid == userId` must be true for any access to `users/{userId}/*`.
- **Client Isolation**: Client B cannot read, query, edit, or delete any record belonging to Client A.
- **Integrity Validation**: Practice records validate that questions attempted $\ge 0$, questions correct $\ge 0$, and correct $\le$ attempted. Study session durations must be $\ge 0$.
- **Default Deny**: All other collections and paths default to `allow read, write: if false`.

---

## ⚙️ Firebase Setup & Configuration

Growlytics is pre-configured to use the existing Firebase project:

- **Firebase Project Name**: `Growlytics`
- **Firebase Project ID**: `growlytics-6b528`
- **Cloud Firestore Location**: `asia-south1 (Mumbai)`
- **Cloud Firestore Database ID**: `(default)`
- **Authentication Providers**: Google Sign-In & Email/Password

### 1. Local Environment Variables Setup

1. Copy `.env.example` to create your local `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open the [Firebase Console](https://console.firebase.google.com/project/growlytics-6b528/settings/general) and navigate to:
   **Project Settings** $\rightarrow$ **General** $\rightarrow$ **Your apps** $\rightarrow$ **Web app**.

3. Paste the configuration values into `.env`:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=growlytics-6b528.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=growlytics-6b528
   VITE_FIREBASE_STORAGE_BUCKET=growlytics-6b528.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=1:...:web:...

   # Optional: Set when Firebase Cloud Function or AI Proxy is deployed
   VITE_AI_ENDPOINT_URL=
   ```

> **Note**: `.env` is ignored by Git in `.gitignore`. Never commit API keys or credentials.

### 2. Firebase Console Checklist

- [x] **Email/Password Provider**: Enabled in Firebase Console $\rightarrow$ Authentication $\rightarrow$ Sign-in method.
- [x] **Google Provider**: Enabled in Firebase Console $\rightarrow$ Authentication $\rightarrow$ Sign-in method.
- [x] **Authorized Domains**: Add `localhost` under Authentication $\rightarrow$ Settings $\rightarrow$ Authorized domains.
- [x] **Deploy Firestore Rules**: Deploy the included `firestore.rules` file to your project:
  ```bash
  firebase deploy --only firestore:rules --project growlytics-6b528
  ```
  *(Or copy the contents of `firestore.rules` and publish them in the Firebase Console Firestore Rules editor).*

---

## 🧪 Multi-User Isolation Test Plan

To verify genuine data isolation between two independent student accounts:

1. **Client A Registration**:
   - Open browser, navigate to `http://localhost:5173`.
   - Click "Get Started Free", register as `studentA@test.com`.
   - Complete onboarding, select target role "Frontend Engineer Intern".
   - In "Project Garden", create a project: *"Client A Portfolio"*.
   - In "Overview", log a study session: *"CSS Grid & Flexbox"* (45 mins).
2. **Client A Sign Out**:
   - Click student avatar $\rightarrow$ **Sign Out**. Verify return to public landing page.
3. **Client B Registration**:
   - Click "Get Started Free", register as `studentB@test.com`.
   - Complete onboarding, select target role "Backend Engineer Intern".
   - Inspect "Project Garden": verify list is empty (Client A's project is not visible).
   - Inspect "Study Sessions": verify list is empty.
   - In "Project Garden", create a project: *"Client B Microservice"*.
4. **Client B Sign Out & Client A Sign In**:
   - Sign out Client B, then sign back in as `studentA@test.com`.
   - Verify Client A sees *"Client A Portfolio"* and CSS study session, with zero trace of Client B's data.

---

## 🚀 Development & Build

### Install Dependencies
```bash
npm install
```

### Launch Development Server
```bash
npm run dev
```

### Production Build & Typecheck
```bash
npm run build
```

---

## 🤖 AI Learning Companion Server Setup

The Growlytics frontend connects to server-side AI endpoints via `VITE_AI_ENDPOINT_URL`.

To connect Google Gemini API or OpenAI securely:
1. Initialize Firebase Cloud Functions in the project:
   ```bash
   firebase init functions
   ```
2. Create an authenticated HTTP function that verifies the Firebase ID token:
   ```ts
   // functions/src/index.ts
   import * as functions from 'firebase-functions'
   import * as admin from 'firebase-admin'

   admin.initializeApp()

   export const aiCompanion = functions.https.onRequest(async (req, res) => {
     const authHeader = req.headers.authorization
     if (!authHeader?.startsWith('Bearer ')) {
       res.status(401).json({ error: 'Unauthorized' })
       return
     }
     const idToken = authHeader.split('Bearer ')[1]
     const decoded = await admin.auth().verifyIdToken(idToken)
     // Call Gemini API with user-scoped context and server secret
     // ...
   })
   ```
3. Set `VITE_AI_ENDPOINT_URL=https://<region>-growlytics-6b528.cloudfunctions.net/aiCompanion` in `.env`.

> **Important**: Do not upgrade to the Blaze plan or deploy paid Cloud Functions without explicit team approval. When unconfigured, Growlytics displays a friendly setup card while keeping all core tracking features fully operational.
