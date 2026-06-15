# FitTrack 💪

> A full-featured fitness tracking web application built with React — designed to help you log workouts, track macros accurately, and monitor your progress over time.

**Live Demo:** [fittrack-nine-gamma.vercel.app](https://fittrack-nine-gamma.vercel.app)
**GitHub:** [github.com/CARNAGE-TECH/fittrack](https://github.com/CARNAGE-TECH/fittrack)

---

## Overview

FitTrack is a personal fitness companion built for athletes and gym-goers who follow structured workout splits. It was designed to solve a real problem — having a single, clean place to log every workout, track daily nutrition accurately using real food data, and see progress over time.

The app features a full authentication system, persistent data storage per user, USDA FoodData Central API-powered macro tracking with manual entry for local/Nigerian foods, and a clean responsive UI optimized for mobile use at the gym.

---

## Features

### Authentication
- Email and password signup and login
- Data persisted per account via localStorage
- Secure sign out

### Workout Logging
- Four structured workout splits: Upper A, Upper B, Lower A, Lower B
- Log sets, reps, and weight per exercise per session
- Add workout notes after each session
- Smart split suggestion on dashboard based on last logged session
- Full session history with split badges, exercise details, and weights

### Macro Tracking
- Search foods using the **USDA FoodData Central API** (380,000+ foods in database)
- Manual food entry for Nigerian and local foods not in the database
- Log portion sizes in grams for accurate macro calculation
- Automatic calculation of calories, protein, carbs, and fat
- Progress bars showing daily consumption vs personal goals
- Set and save custom daily macro targets
- Today's food log with remove functionality

### Dashboard
- Personalized greeting based on time of day
- Today's calorie progress bar with percentage
- Total workout count and active day streak
- Recent workout history with split badges

### Progress Tab
- Total sessions logged
- Upper body vs lower body session breakdown
- Full reverse-chronological session history
- Exercise weights and rep ranges shown per session

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend framework |
| localStorage | Per-user data persistence |
| USDA FoodData Central API | Real nutrition data |
| CSS (inline styles) | Responsive styling |
| Vercel | Deployment |

---

## Getting Started

### Prerequisites
- Node.js v16+
- npm

### Installation

```bash
git clone https://github.com/CARNAGE-TECH/fittrack.git
cd fittrack
npm install
npm start
```

App runs at `http://localhost:3000`

### Notes
No environment variables required. The USDA API key is included on the free public tier.

---

## Project Structure

src/

├── components/

│   ├── Auth.jsx          # Login and signup screens

│   ├── Dashboard.jsx     # Home with stats and calorie progress

│   ├── Workout.jsx       # Workout split selector and exercise logger

│   ├── Macros.jsx        # USDA food search and manual entry

│   ├── Progress.jsx      # Session history and stats

│   └── Footer.jsx        # Branded footer

├── App.js                # Root component with tab navigation

└── App.css               # Global styles

---

## Roadmap

- [ ] Cloud sync with Firebase or Supabase
- [ ] Personal record detection and notifications
- [ ] Progress charts and strength graphs
- [ ] Barcode scanner for instant food logging
- [ ] Export session history as PDF
- [ ] Rest timer between sets

---

## Author

**Joseph Omokwale**
Freelance Web Developer & Designer
OMTECH INNOVATORS — *The Future of Tech...*
📍 Edo State, Nigeria
🌐 [omtech-portfolio.vercel.app](https://omtech-portfolio.vercel.app)
💼 [github.com/CARNAGE-TECH](https://github.com/CARNAGE-TECH)
📱 WhatsApp: [+234 807 638 4453](https://wa.me/2348076384453)

---

## License
MIT License