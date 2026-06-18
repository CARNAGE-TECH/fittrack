# FitTrack

> A mobile-first fitness tracking web application built with React. It helps you log structured workouts, track macros, and review training progress over time.

**Live Demo:** [fittrack-nine-gamma.vercel.app](https://fittrack-nine-gamma.vercel.app)  
**GitHub:** [github.com/CARNAGE-TECH/fittrack](https://github.com/CARNAGE-TECH/fittrack)

---

## Overview

FitTrack is a personal fitness companion built for athletes and gym-goers who follow structured workout splits. It gives you one clean place to log workouts, track daily nutrition, and review progress without needing a backend account.

The app uses browser localStorage for demo-friendly persistence. Data is stored on the current device and is separated by email address. This is convenient for a portfolio project, but it is not a substitute for production authentication or cloud sync.

---

## Features

### Demo Authentication

- Email and password signup and login for local demo use
- Current user remembered between refreshes
- Data separated per email address in localStorage
- Sign out support

### Workout Logging

- Four structured workout splits: Upper A, Upper B, Lower A, Lower B
- Log sets, reps, and weight per exercise per session
- Last-used exercise values prefill your next session
- Add workout notes after each session
- Smart next-split suggestion based on your most recent logged split
- Personal record flags when a logged exercise beats previous weight
- Edit or delete saved workout sessions

### Macro Tracking

- Search foods using the USDA FoodData Central API
- Manual food entry for Nigerian and local foods not in the database
- Log portion sizes in grams for macro calculation
- Automatic calculation of calories, protein, carbs, and fat
- Progress bars showing daily consumption vs personal goals
- Set and save custom daily macro targets
- Today's food log with remove functionality
- Export and import local FitTrack data as JSON

### Dashboard

- Personalized greeting based on time of day
- Today's calorie progress bar with percentage
- Total workout count, calorie stats, and active day streak
- Recent workout history with split badges

### Progress Tab

- Total sessions logged
- Upper body vs lower body session breakdown
- Full reverse-chronological session history
- Exercise weights and rep ranges shown per session
- Edit and delete controls for saved sessions

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend framework |
| localStorage | Demo data persistence |
| USDA FoodData Central API | Nutrition search |
| CSS and inline styles | Responsive styling |
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

App runs at `http://localhost:3000`.

### Environment Variables

The USDA API key can be configured with:

```bash
REACT_APP_USDA_API_KEY=your_key_here
```

If no environment variable is set, the app falls back to the included demo key.

---

## Project Structure

```text
src/
  components/
    Auth.jsx       # Local demo login and signup screens
    Dashboard.jsx  # Home with stats, streak, and calorie progress
    Workout.jsx    # Workout split selector and exercise logger
    Macros.jsx     # USDA food search, manual entry, and data tools
    Progress.jsx   # Session history, stats, editing, and deletion
    Footer.jsx     # Branded footer
  App.js           # Root component with session and tab navigation
  App.css          # Global styles
```

---

## Roadmap

- [ ] Cloud sync with Firebase or Supabase
- [ ] Passwordless auth or OAuth for production use
- [ ] Progress charts and strength graphs
- [ ] Barcode scanner for instant food logging
- [ ] Export session history as PDF
- [ ] Built-in rest timer presets and notifications
- [ ] Vite migration from Create React App

---

## Author

**Joseph Omokwale**  
Freelance Web Developer & Designer  
OMTECH INNOVATORS - *The Future of Tech...*  
Edo State, Nigeria  
[omtech-portfolio.vercel.app](https://omtech-portfolio.vercel.app)  
[github.com/CARNAGE-TECH](https://github.com/CARNAGE-TECH)  
WhatsApp: [+234 807 638 4453](https://wa.me/2348076384453)

---

## License

MIT License
