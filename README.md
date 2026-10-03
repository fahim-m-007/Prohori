# 🛡️ Prohori (প্রহরী) — Crowdsourced Citizen Safety Platform for Dhaka

<div align="center">

![Prohori Platform](public/prohori_white.png)

**Real-Time Crowdsourced Citizen Safety & Incident Intelligence Across Dhaka City**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media_CDN-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-GIS_Maps-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

</div>

---

## 📖 Overview

**Prohori (প্রহরী)** is a modern, crowdsourced community safety platform designed specifically for the citizens and daily commuters of **Dhaka, Bangladesh**.

Dhaka's rapid urban pace frequently faces hyper-local disruptions — ranging from waterlogging and road accidents to muggings, traffic bottlenecks, protests, and fire hazards. **Prohori** bridges the critical information gap by empowering citizens to report incidents in real time, upload geo-tagged photo evidence, confirm hazards live on the ground, and view verified danger zones across all **50+ Thanas** on an interactive safety map.

---

## ⚡ Key Features

### 🗺️ 1. Interactive Live Safety Map (GIS)

- **Dhaka-Wide Spatial Coverage**: Leaflet & OpenStreetMap powered GIS map centered on Dhaka with polygon and centroid coordinates for all 50+ Thana regions.
- **Severity-Color Coded Markers**: Dynamic pins for **High Risk** (Theft, Mugging, Violence, Fire), **Caution** (Waterlogging, Traffic disruption, Accidents), and **Resolved** hazards.
- **Quick Landmark Navigation**: Instant 1-click jump to major transit hubs (Shahbag, Dhanmondi, Gulshan, Uttara, Mirpur, Motijheel, Banani, etc.).
- **Geo-Location Centering & Radius Filters**: Center directly on your current GPS location and filter incidents within a 1km to 10km radius.

### 📢 2. Real-Time Incident Reporting & Feed

- **Multi-Criteria Filter Bar**: Instantly filter community alerts by **Category**, **Thana Area**, and **Sort By** (_Most Recent_ vs _Most Confirmed_).
- **Database-Level Sorting & Indexing**: Powered by MongoDB Atlas compound indexes (`{ createdAt: -1 }` and `{ upvotes: -1, createdAt: -1 }`) for ultra-low latency queries.
- **Integrated Photo Galleries & Lightbox**: Attached evidence photos render as compact thumbnail strips on cards and open in an expansive broad-view modal lightbox.
- **Symmetrical Responsive Layout**: Balanced card grid with elegant fallback states for reports with short or omitted written descriptions.

### 🛡️ 3. Citizen Verification & On-Ground Updates

- **Crowdsourced Verification System**: 1-click incident confirmation (`Confirm` / upvote) to validate live hazards and prevent rumors or false alarms.
- **Live Community Notes & Comments**: Citizens on the ground can post real-time situation updates (e.g., _"Water receding"_, _"Road cleared"_).
- **Author Lifecycle & Deletion Controls**: Authors can permanently delete their reports or specific comments/updates directly from the UI with safe confirmation modal dialogs.
- **Automated Cloudinary Storage Cleanup**: Deleting an incident report automatically triggers backend garbage collection to destroy orphaned image files on Cloudinary (`prohori_incidents`).

### 🏆 4. Sentinel Profile & Gamified Reputation System

- **5-Tier Sentinel Badges**: Milestone-based achievement badges awarded for community contributions (_First Alert_, _Monsoon Watcher_, _Road Watcher_, _Area Guardian_, etc.).
- **Incident History Timeline**: Personal archive of all reports submitted by the logged-in citizen with live confirmation counters.
- **Customizable Sentinel Bio & Home Thana**: Set default primary commuting zones and update personal details securely.

---

## 🛠️ Technology Stack

| Layer              | Technologies                                                                           |
| :----------------- | :------------------------------------------------------------------------------------- |
| **Frontend**       | React 19, Vite, React Router DOM v7, React-Leaflet, Leaflet, Lucide React icons, Axios |
| **Styling & UI**   | Pure Modern CSS3 Design System (Glassmorphism, CSS Variables, Responsive Grid/Flexbox) |
| **Backend**        | Node.js, Express.js 5, Helmet, CORS, Express Rate Limit, Cookie Parser                 |
| **Database**       | MongoDB Atlas with Mongoose ODM (Compound Indexing & Schemas)                          |
| **Media & CDN**    | Cloudinary REST API & SDK (Folder: `prohori_incidents`)                                |
| **Authentication** | JWT (JSON Web Tokens) with Bcrypt password encryption                                  |

---

## 📂 Project Architecture

```plaintext
Prohori/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── cloudinary.js         # Cloudinary SDK credentials & config
│   │   │   └── db.js                 # MongoDB Atlas Mongoose connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js    # Register, Login, Me, Profile update
│   │   │   └── report.controller.js  # Incident CRUD, voting, comments, Cloudinary cleanup
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js    # JWT protect & optionalAuth
│   │   │   └── error.middleware.js   # Global REST error handler
│   │   ├── models/
│   │   │   ├── Report.js             # Incident model with compound indexes
│   │   │   └── User.js               # Citizen Sentinel user model
│   │   ├── routes/
│   │   │   ├── auth.routes.js        # Auth API endpoints
│   │   │   └── report.routes.js      # Reports, Voting & Comments endpoints
│   │   └── utils/
│   │       └── generateTokens.js     # JWT token generation
│   ├── .env                          # Backend environment variables
│   ├── index.js                      # Express application entry point
│   └── package.json
│
├── public/
│   ├── favicon.png                   # Prohori shield favicon
│   ├── prohori.png                   # Primary color logo
│   └── prohori_white.png             # White monochrome brand logo
│
├── src/
│   ├── api/
│   │   └── client.js                 # Axios client with JWT interceptor
│   ├── components/
│   │   ├── Navbar.jsx / .css         # Top navigation bar
│   │   ├── Sidebar.jsx / .css        # Collapsible navigation drawer
│   │   └── ReportDetailModal.jsx     # Detail view, comments & photo lightbox
│   ├── context/
│   │   ├── AuthContext.jsx           # Global user authentication state
│   │   └── ReportsContext.jsx        # Global reports, comments & voting state
│   ├── pages/
│   │   ├── Dashboard.jsx / .css      # City metrics & quick hazard summary
│   │   ├── Landing.jsx / .css        # Public homepage & mission overview
│   │   ├── Login.jsx / .css          # Citizen authentication
│   │   ├── MapPage.jsx / .css        # Interactive Leaflet live map
│   │   ├── Profile.jsx / .css        # Sentinel badges & report history
│   │   ├── ReportIncident.jsx / .css # Report submission form with image uploads
│   │   ├── Reports.jsx / .css        # Community reports feed & filters
│   │   └── Signup.jsx / .css         # Account registration
│   ├── App.jsx                       # Routing & layout configuration
│   ├── index.css                     # Design tokens & global CSS variables
│   └── main.jsx                      # React 19 application root
│
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher recommended)
- **MongoDB Atlas** cluster URI or local MongoDB instance
- **Cloudinary** account (Cloud Name, API Key, API Secret)

---

### 1. Installation

Clone the repository and install dependencies for both the frontend and backend:

```bash
# Clone the repository
git clone https://github.com/your-username/Prohori.git
cd Prohori

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

---

### 2. Environment Configuration

Create a `.env` file inside the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection String
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/prohori?retryWrites=true&w=majority

# JWT Authentication Secret
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d

# Cloudinary Media Storage Credentials
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

---

### 3. Running the Application

Open two terminal windows:

#### Terminal 1 — Start Backend Server:

```bash
cd backend
npm run dev
# Server running on http://localhost:5000
```

#### Terminal 2 — Start Frontend Application:

```bash
npm run dev
# Frontend running on http://localhost:5173
```

Navigate to `http://localhost:5173` in your browser to start using Prohori!

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint             | Access    | Description                                |
| :----- | :------------------- | :-------- | :----------------------------------------- |
| `POST` | `/api/auth/register` | Public    | Register a new Citizen Sentinel account    |
| `POST` | `/api/auth/login`    | Public    | Authenticate user & return JWT token       |
| `GET`  | `/api/auth/me`       | Protected | Fetch currently authenticated user profile |
| `PUT`  | `/api/auth/profile`  | Protected | Update profile bio, phone, and home Thana  |
| `PUT`  | `/api/auth/password` | Protected | Change account password                    |
| `POST` | `/api/auth/logout`   | Public    | Clear session credentials                  |

### 🚨 Incident Reports (`/api/reports`)

| Method   | Endpoint                               | Access                   | Description                                                                                            |
| :------- | :------------------------------------- | :----------------------- | :----------------------------------------------------------------------------------------------------- |
| `GET`    | `/api/reports`                         | Optional Auth            | Fetch feed with filtering (`category`, `thana`, `search`) & indexed sorting (`sortBy=recent\|upvotes`) |
| `POST`   | `/api/reports`                         | Protected                | Submit a new incident report (with Cloudinary image streaming)                                         |
| `GET`    | `/api/reports/:id`                     | Optional Auth            | Fetch single incident detail by ID                                                                     |
| `POST`   | `/api/reports/:id/vote`                | Protected                | Toggle live incident confirmation (upvote / unvote)                                                    |
| `POST`   | `/api/reports/:id/comments`            | Protected                | Post a live on-ground update/comment to an incident                                                    |
| `DELETE` | `/api/reports/:id/comments/:commentId` | Protected (Author/Admin) | Delete a specific update from MongoDB Atlas                                                            |
| `DELETE` | `/api/reports/:id`                     | Protected (Author/Admin) | Delete incident report from MongoDB + cleanup Cloudinary CDN assets                                    |

---

## 🛡️ Security & Quality Standards

- **Role-Based & Ownership Verification**: Strict server-side verification ensures users can only delete their own reports and comments.
- **Input Sanitization & Data Validation**: String trimming, coordinate boundary checks, and Mongoose schema constraints.
- **Secure Image Storage**: Direct Base64 to Cloudinary transformation with auto quality optimization and safe deletion handling.
- **0 Lint Errors**: Strictly adhering to modern React & ESLint standards.

---

## 🤝 Contributing

Contributions to improve Dhaka's community safety infrastructure are warmly welcomed!

1. Fork the Project repository
2. Create your Feature Branch (`git checkout -b feature/SafetyAlerts`)
3. Commit your Changes (`git commit -m "Add new safety alert feature"`)
4. Push to the Branch (`git push origin feature/SafetyAlerts`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **ISC License**. See `LICENSE` for more information.

<div align="center">

**Built with dedication for the citizens of Dhaka 🇧🇩**  
_Stay Alert. Stay Safe. Prohori._

</div>
