# Porto-Web: Advanced AI-Powered Portfolio Platform

An advanced, feature-rich portfolio website built with modern web technologies. This project is designed to be highly customizable, interactive, and intelligent, featuring a dynamic theme system (including a Spotify-inspired UI), 3D effects, and an AI-powered GitHub project summarizer.

---

## 🌟 Key Features

### 1. Dual-Theme Architecture
- **Default Theme:** A sleek, modern "glow" aesthetic with smooth Framer Motion animations and 3D dither effects (React Three Fiber).
- **Spotify Theme:** A pixel-perfect recreation of the Spotify desktop UI, complete with working category tabs, sidebars, and interactive project cards.
- **Dynamic Switching:** Themes can be dynamically switched from the Admin Dashboard and are persisted instantly.

### 2. AI-Powered Project Generator
- **Smart Summarization:** Integrated with **Hugging Face (`facebook/bart-large-cnn`)** to automatically generate professional portfolio descriptions by analyzing your GitHub Repository README.
- **Custom DNS Proxy Backend:** Utilizes a custom Node.js/Express backend that forces Google DNS resolution (`8.8.8.8`) to bypass ISP-level API throttling and timeouts.

### 3. Dynamic Multi-Category System
- **Tag-Based Architecture:** Projects and experiences support multiple dynamic categories (comma-separated).
- **Smart Filtering:** The frontend automatically extracts, flattens, and generates filter tabs based on the unique categories present in your database.

### 4. Full Admin Dashboard & Supabase Integration
- **Content Management:** Create, Read, Update, and Delete (CRUD) operations for Projects, Experiences, Skills, and Profile Data.
- **Image Uploading:** Direct integration with Supabase Storage for fast avatar and project image hosting.
- **Authentication:** Secured by Supabase Auth (including password reset functionality).

### 5. Interactive Engagement
- **Analytics Tracking:** Built-in view counters for individual projects and the total portfolio.
- **Bookmark/Like System:** Users can save or "like" projects which are dynamically tracked via Supabase.
- **Direct Messaging:** Contact form powered by **EmailJS** for instant email delivery.

---

## 🛠️ Technology Stack

### Frontend Core
- **Framework:** [React 18](https://reactjs.org/)
- **Routing:** [React Router DOM v6](https://reactrouter.com/)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/) & PostCSS
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

### 3D & Visual Effects
- **Core 3D Engine:** [Three.js](https://threejs.org/)
- **React Bindings:** `@react-three/fiber` & `@react-three/drei`
- **Post-Processing:** `postprocessing` & `@react-three/postprocessing` (Used for custom dither and visual distortion effects).

### Icons & Typography
- **Icons:** `lucide-react` & `react-icons` (Fi, Fa suites)
- **Fonts:** Custom imported fonts (Sora, Inter).

### Backend & Database (BaaS)
- **Database Engine:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication:** Supabase Auth (JWT-based)
- **Storage:** Supabase Storage buckets

### Custom AI Backend Proxy (`server.js`)
- **Runtime:** Node.js v24+
- **Framework:** Express.js
- **AI Integration:** Hugging Face Inference API
- **Networking:** Custom HTTP/HTTPS agents with patched DNS resolution to bypass local ISP blocks.

---

## 📂 Architecture Overview

```text
📦 porto-web
 ┣ 📂 src
 ┃ ┣ 📂 admin             # Protected Admin Dashboard & CRUD forms
 ┃ ┣ 📂 components        # Reusable UI components (Cards, Navbar, Loaders)
 ┃ ┃ ┣ 📂 layouts         # Theme layouts (SpotifyPortfolio.jsx)
 ┃ ┃ ┣ 📂 projects        # Project-specific card variants
 ┃ ┃ ┣ 📂 sections        # Page sections (About, Contact, Skills)
 ┃ ┃ ┗ 📂 shared          # Shared utilities (SpotifyIcons, Tabs)
 ┃ ┣ 📂 context           # React Context providers (ThemeContext)
 ┃ ┣ 📂 pages             # Route views (Home, Projects, Auth)
 ┃ ┣ 📂 supabase          # Supabase client config and API helper functions
 ┃ ┣ 📜 App.jsx           # Main App routing and provider injection
 ┃ ┗ 📜 index.css         # Global Tailwind directives and custom CSS vars
 ┣ 📜 server.js           # Express proxy server for AI generation
 ┣ 📜 .env                # Environment variables (Supabase Keys)
 ┗ 📜 package.json        # Project dependencies
```

---

## 🚀 Getting Started

### Prerequisites
1. **Node.js** (v18 or higher recommended).
2. A **Supabase** project setup with tables: `projects`, `experiences`, `skills`, `profiles`, `views`, and `likes`.
3. An **Hugging Face API Token** for the AI backend.

### Environment Setup
Create a `.env` file in the root directory:
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
PUBLIC_BUILDER_KEY=your_builder_key
```

Create a `.env` or set system environment variables for the Node Backend:
```env
HF_API_KEY=your_hugging_face_token
```

### Running the Application

**1. Start the React Frontend:**
```bash
npm install
npm start
```
*The app will run on `http://localhost:3000`.*

**2. Start the AI Proxy Server:**
Open a separate terminal and run:
```bash
node server.js
```
*The proxy runs on `http://localhost:5000` and handles all AI description generation requests safely.*

---

## 💡 System Design Highlights

- **Error Boundaries & Fallbacks:** The AI backend implements a retry-mechanism (10s delay) to handle Hugging Face `503 Model Loading` statuses gracefully.
- **Optimistic UI:** Like buttons and category filters update instantly without waiting for a database round-trip.
- **Cache-Busting & Asset Management:** Employs strategies to ensure updated images and themes bypass aggressive browser caching.
