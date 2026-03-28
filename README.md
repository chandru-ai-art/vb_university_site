# ==============================================================
# Vidya Bharati University — Full Stack Web Application
# Complete Setup & Run Guide
# ==============================================================

## 📁 PROJECT STRUCTURE

```
university-app/
├── index.html                    ← Complete frontend (open directly in browser)
│
└── backend/
    ├── server.js                 ← Express app entry point
    ├── package.json              ← Node.js dependencies
    ├── seed.js                   ← Database seeder (sample data)
    ├── .env                      ← Environment variables (create this)
    ├── models/
    │   └── index.js              ← MongoDB schemas (Admission, Contact, Course, Faculty, User)
    └── routes/
        └── index.js              ← All RESTful API routes
```

---

## 🚀 QUICK START

### Option A: Frontend Only (No backend needed)
Just open `index.html` in your browser. The frontend works standalone with simulated API calls.

### Option B: Full Stack Setup

#### Prerequisites
- Node.js v18+ → https://nodejs.org
- MongoDB v6+ → https://mongodb.com/try/download/community
- npm (comes with Node.js)

---

## 🛠️ STEP-BY-STEP BACKEND SETUP

### Step 1 — Clone / Extract Project
```bash
cd university-app/backend
```

### Step 2 — Install Dependencies
```bash
npm install
```

### Step 3 — Create Environment File
Create a file named `.env` in the `backend/` folder:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vbu_db
JWT_SECRET=vbu_super_secret_jwt_key_2025
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### Step 4 — Start MongoDB
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Windows
net start MongoDB

# Linux
sudo systemctl start mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongo mongo:latest
```

### Step 5 — Seed the Database (Optional but Recommended)
```bash
npm run seed
# This inserts sample courses and faculty data
```

### Step 6 — Start the Server
```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

The server starts at: **http://localhost:5000**

### Step 7 — Access the Application
Copy `index.html` into `backend/public/index.html` and visit http://localhost:5000

---

## 📡 API ENDPOINTS

### Admissions
| Method | Endpoint                     | Description                    |
|--------|------------------------------|--------------------------------|
| POST   | /api/admissions              | Submit new application         |
| GET    | /api/admissions              | List all applications (admin)  |
| PATCH  | /api/admissions/:id/status   | Update application status      |

### Contact
| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| POST   | /api/contact     | Submit contact enquiry   |
| GET    | /api/contact     | List all enquiries       |

### Courses
| Method | Endpoint                         | Description              |
|--------|----------------------------------|--------------------------|
| GET    | /api/courses                     | Get all courses          |
| GET    | /api/courses?level=UG            | Filter by level          |
| GET    | /api/courses?department=Engineering | Filter by dept        |
| POST   | /api/courses                     | Add new course (admin)   |

### Faculty
| Method | Endpoint                     | Description              |
|--------|------------------------------|--------------------------|
| GET    | /api/faculty                 | Get all faculty          |
| GET    | /api/faculty?department=CSE  | Filter by department     |
| POST   | /api/faculty                 | Add faculty (admin)      |

### Auth
| Method | Endpoint           | Description              |
|--------|--------------------|--------------------------|
| POST   | /api/auth/login    | Admin login (returns JWT)|
| POST   | /api/auth/register | Create first admin user  |

### Health Check
| Method | Endpoint         | Description      |
|--------|------------------|------------------|
| GET    | /api/health      | Server status    |

---

## 📮 SAMPLE API REQUESTS

### Submit Admission Application
```bash
curl -X POST http://localhost:5000/api/admissions \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Arjun",
    "lastName": "Kumar",
    "email": "arjun@example.com",
    "phone": "9876543210",
    "level": "UG",
    "department": "Computer Science & Engineering",
    "marks12th": "92.5%"
  }'
```

### Get All Courses
```bash
curl http://localhost:5000/api/courses
curl http://localhost:5000/api/courses?level=UG
curl http://localhost:5000/api/courses?department=Engineering
```

### Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vbu.ac.in","password":"Admin@2025"}'
```

---

## 🗄️ DATABASE SCHEMA OVERVIEW

### Admissions Collection
```js
{
  _id, firstName, lastName, email, phone,
  level: 'UG' | 'PG' | 'PhD',
  department: String,
  marks12th: String,
  entranceScore: String,
  message: String,
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected',
  createdAt, updatedAt
}
```

### Contacts Collection
```js
{
  _id, name, email, phone, subject, message,
  isRead: Boolean, repliedAt: Date,
  createdAt, updatedAt
}
```

### Courses Collection
```js
{
  _id, title, department, level, duration,
  totalSeats, description, eligibility, fees,
  isActive, tags: [String], createdAt, updatedAt
}
```

### Faculty Collection
```js
{
  _id, name, designation, department, qualification,
  experience, specialization, researchInterests: [String],
  publications, email, photo, linkedin,
  isActive, createdAt, updatedAt
}
```

---

## 🎨 FRONTEND FEATURES
- ✅ 6 Pages: Home, About, Courses, Admissions, Faculty, Contact
- ✅ Fixed responsive navbar with dropdowns
- ✅ Animated hero with counters
- ✅ News ticker / marquee
- ✅ Scroll animations (custom AOS-like)
- ✅ Animated number counters
- ✅ Course filter tabs
- ✅ Testimonials carousel
- ✅ Photo gallery grid
- ✅ Working contact & admissions forms
- ✅ Google Maps embed (Contact page)
- ✅ Back to Top button
- ✅ Loading screen
- ✅ Mobile-first responsive design
- ✅ Professional Navy/Gold color scheme
- ✅ Playfair Display + DM Sans typography

---

## 🔒 SECURITY NOTES (Production Checklist)
- [ ] Set strong JWT_SECRET in .env
- [ ] Add rate limiting (`express-rate-limit`)
- [ ] Enable helmet.js for HTTP headers
- [ ] Add input sanitization (`express-mongo-sanitize`)
- [ ] Protect admin routes with JWT middleware
- [ ] Use HTTPS in production
- [ ] Set NODE_ENV=production

---

Built with ❤️ for Vidya Bharati University
