# Prohori (প্রহরী) - Crowdsourced Citizen Safety Platform for Dhaka

<div align="center">

![Prohori Platform](public/prohori_white.png)

**Real-Time Crowdsourced Citizen Safety and Incident Intelligence Across Dhaka City**

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

## Overview

**Prohori (প্রহরী)** is a modern, crowdsourced community safety platform designed specifically for the citizens and daily commuters of **Dhaka, Bangladesh**.

Dhaka's dense urban environment frequently experiences hyper-local disruptions, including waterlogging, road accidents, muggings, traffic bottlenecks, protest blockades, and fire hazards. **Prohori** bridges the real-time communication gap by enabling citizens to report incidents with geo-tagged photo evidence, confirm hazards live on the ground, monitor saved commute zones, and inspect danger zones across all **50+ Thanas** on an interactive safety map.

---

## Key Features

### 1. Interactive Live Safety Map (GIS)
- **Dhaka-Wide Spatial Coverage**: Leaflet and OpenStreetMap GIS map centered on Dhaka with centroid coordinates and geographic boundaries for all 50+ Thana areas.
- **Severity-Color Coded Markers**: Color-coded pins for High Risk (Theft, Mugging, Violence, Fire), Caution (Waterlogging, Traffic disruption, Accidents), and Resolved hazards.
- **Quick Landmark Navigation**: Instant 1-click jump to major transit hubs (Shahbag, Dhanmondi, Gulshan, Uttara, Mirpur, Motijheel, Banani, etc.).
- **GPS Location Centering**: Center directly on current device coordinates and view nearby incidents.

### 2. Real-Time Incident Reporting and Filtered Feed
- **Multi-Criteria Filtering**: Filter alerts by Category, Thana Area, and Sort Order (Most Recent vs Most Confirmed).
- **Database-Level Indexed Sorting**: Powered by MongoDB Atlas compound indexes (`{ createdAt: -1 }` and `{ upvotes: -1, createdAt: -1 }`) for low-latency queries.
- **Integrated Photo Uploads and Lightbox**: Incident evidence photos render as compact thumbnail strips on cards and open in an expansive broad-view modal lightbox.
- **Responsive Layout**: Balanced card grid with fallback states for reports with short or omitted written descriptions.

### 3. Community Verification and Discussion Updates
- **Anti-Spam Verification**: 1-click incident confirmation (upvote/unvote toggle) tracked via unique user ID arrays in MongoDB to prevent duplicate voting.
- **Live Community Notes**: Citizens on the ground can post real-time situation updates (e.g., "Water receding", "Road cleared").
- **Author Lifecycle and Deletion Controls**: Authors and administrators can permanently delete incident reports or individual comments directly from the UI with safe confirmation dialogs.
- **Automated Cloudinary CDN Cleanup**: Deleting an incident report automatically triggers backend deletion of attached image assets from Cloudinary storage (`prohori_incidents`).

### 4. Monitored Saved Areas
- **Custom Commute Monitoring**: Save and manage frequented Thana areas (Home, Workplace, University).
- **Localized Dashboard Feed**: Dashboard automatically prioritizes incidents occurring within the user's primary or saved monitoring zones.

### 5. Sentinel Profile and Gamification
- **5-Tier Sentinel Badges**: Milestone-based achievement badges awarded for contributions (Frontline Scout, Monsoon Navigator, Gridlock Breaker, Trusted Vanguard, Dhaka Guardian).
- **Contribution Archive**: Personal record of all submitted reports and discussion updates with live confirmation counters.
- **Account Management**: Update name, bio, phone number, primary Thana, and change password securely.

### 6. Digital Carbon Footprint Measurement
- **Backend Sustainable Web Design (SWD) Middleware**: Intercepts HTTP request and response byte streams and computes estimated carbon emissions (grams of CO2 equivalent) using the `@tgwf/co2` Sustainable Web Design model.
- **Frontend Real-Time Carbon Widget**: Uses the `react-carbon-footprint` hook to display live network byte transfer and session CO2 estimates in a floating indicator.

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router DOM v7, React-Leaflet, Leaflet, Lucide React icons, Axios, react-carbon-footprint |
| **Styling and UI** | Pure Modern CSS3 Design System (Glassmorphism, CSS Custom Properties, Responsive Grid and Flexbox) |
| **Backend** | Node.js, Express.js 5, Helmet, CORS, Express Rate Limit, Cookie Parser, @tgwf/co2 |
| **Database** | MongoDB Atlas with Mongoose ODM (Compound B-Tree Indexing and Schemas) |
| **Media and CDN** | Cloudinary REST API and SDK (Folder: `prohori_incidents`) |
| **Authentication** | Stateless JWT (JSON Web Tokens) with Bcrypt password hashing (12 salt rounds) |

---

## Project Architecture

```plaintext
Prohori/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── cloudinary.js         # Cloudinary SDK credentials and config
│   │   │   └── db.js                 # MongoDB Atlas Mongoose connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js    # Register, Login, Me, Profile update
│   │   │   └── report.controller.js  # Incident CRUD, voting, comments, Cloudinary cleanup
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js    # JWT protect and optionalAuth
│   │   │   ├── carbon.middleware.js  # SWD model CO2 calculation middleware
│   │   │   └── error.middleware.js   # Global REST error handler
│   │   ├── models/
│   │   │   ├── Report.js             # Incident model with compound indexes
│   │   │   └── User.js               # Citizen user model with bcrypt pre-save hook
│   │   ├── routes/
│   │   │   ├── auth.routes.js        # Auth API endpoints
│   │   │   └── report.routes.js      # Reports, Voting and Comments endpoints
│   │   ├── app.js                    # Express application and middleware pipeline
│   │   └── server.js                 # Server listener entry point
│   ├── .env                          # Backend environment variables
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
│   ├── assets/                       # Image and brand assets
│   ├── components/
│   │   ├── CarbonFootprintDisplay.jsx # Live carbon footprint badge
│   │   ├── InteractiveMap.jsx        # Leaflet interactive GIS safety map
│   │   ├── Navbar.jsx / .css         # Top navigation bar
│   │   ├── ReportDetailModal.jsx     # Detail view, comments and photo lightbox
│   │   └── Sidebar.jsx / .css        # Collapsible navigation drawer
│   ├── context/
│   │   ├── AuthContext.jsx           # Global user authentication state
│   │   ├── ReportsContext.jsx        # Global reports, comments and voting state
│   │   └── SavedAreasContext.jsx     # Monitored locations state
│   ├── pages/
│   │   ├── Dashboard.jsx / .css      # City metrics and quick hazard summary
│   │   ├── Landing.jsx / .css        # Public homepage and mission overview
│   │   ├── Login.jsx / .css          # Citizen authentication
│   │   ├── MapPage.jsx / .css        # Interactive Leaflet live map
│   │   ├── Profile.jsx / .css        # Sentinel badges and report history
│   │   ├── ReportIncident.jsx / .css # Report submission form with image uploads
│   │   ├── Reports.jsx / .css        # Community reports feed and filters
│   │   ├── SavedAreas.jsx / .css     # Monitored areas management
│   │   └── Signup.jsx / .css         # Account registration
│   ├── App.jsx                       # Routing and layout configuration
│   ├── index.css                     # Design tokens and global CSS variables
│   └── main.jsx                      # React 19 application root
│
├── package.json
├── vite.config.js
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher recommended)
- **MongoDB Atlas** connection string or local MongoDB instance
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

#### Terminal 1 - Start Backend Server:

```bash
cd backend
npm run dev
# Server running on http://localhost:5000
```

#### Terminal 2 - Start Frontend Application:

```bash
npm run dev
# Frontend running on http://localhost:5173
```

Navigate to `http://localhost:5173` in your browser.

---

## REST API Reference

### Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new Citizen Sentinel account |
| `POST` | `/api/auth/login` | Public | Authenticate user and return JWT token |
| `GET` | `/api/auth/me` | Protected | Fetch currently authenticated user profile |
| `PUT` | `/api/auth/profile` | Protected | Update profile bio, phone, and primary Thana |
| `PUT` | `/api/auth/password` | Protected | Change account password |
| `POST` | `/api/auth/logout` | Public | Clear session credentials |

### Incident Reports (`/api/reports`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reports` | Optional Auth | Fetch feed with filtering (`category`, `thana`, `search`) and indexed sorting (`sortBy=recent\|upvotes\|oldest`) |
| `POST` | `/api/reports` | Protected | Submit a new incident report with Cloudinary image uploads |
| `GET` | `/api/reports/:id` | Optional Auth | Fetch single incident detail by ID |
| `POST` | `/api/reports/:id/vote` | Protected | Toggle live incident confirmation (upvote/unvote) |
| `POST` | `/api/reports/:id/comments` | Protected | Post a live on-ground situation update to an incident |
| `DELETE` | `/api/reports/:id/comments/:commentId` | Protected (Author/Admin) | Delete a specific update |
| `DELETE` | `/api/reports/:id` | Protected (Author/Admin) | Delete incident report and remove attached Cloudinary CDN assets |

---

## Security and Quality Standards

- **Role-Based and Ownership Authorization**: Server-side verification ensures users can only delete or modify their own reports and comments.
- **Input Sanitization and Validation**: String trimming, coordinate boundary checks, and Mongoose schema constraints.
- **Secure Image Pipeline**: Base64 data streaming to Cloudinary with automatic WebP conversion, dimension limits, and orphan file destruction on deletion.
- **Zero Lint Errors**: Adherence to modern React and ESLint standards.
- **Digital Sustainability**: Continuous monitoring of data transfer volume and carbon footprint estimation.

---

## Contributing

Contributions to improve Dhaka's community safety infrastructure are welcome.

1. Fork the Project repository
2. Create your Feature Branch (`git checkout -b feature/SafetyAlerts`)
3. Commit your Changes (`git commit -m "Add new safety alert feature"`)
4. Push to the Branch (`git push origin feature/SafetyAlerts`)
5. Open a Pull Request

---

## License

Distributed under the **ISC License**. See `LICENSE` for more information.

<div align="center">

**Built for the citizens of Dhaka**  
*Stay Alert. Stay Safe. Prohori.*

</div>
