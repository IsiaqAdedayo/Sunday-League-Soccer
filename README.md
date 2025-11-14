# SLS Tournament - Sunday League Soccer Management System

A complete football tournament management system built with Next.js, Firebase, Ant Design, and Framer Motion.

## 🚀 Features

- **Public Pages:**
  - Home: Tournament overview with live stats
  - Fixtures: All matches with scores and schedules
  - Standings: Live league table
  - Stats: Top scorers, assists, clean sheets, discipline
  - Rules: Tournament rules and regulations

- **Admin Panel:**
  - Secure password-protected access at `/admin`
  - Manage teams, fixtures, players
  - Update scores and match results
  - Automatic standings calculation
  - Track bookings and discipline

- **Beautiful Design:**
  - Dark theme with green accents
  - Smooth animations with Framer Motion
  - Football-themed visuals
  - Responsive mobile design

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- Firebase account (free tier works great)

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages:
- Next.js 14
- React 18
- Firebase 10
- Ant Design 5
- Framer Motion 11
- React Icons
- date-fns

### Step 2: Firebase Setup

1. **Create Firebase Project:**
   - Go to https://console.firebase.google.com/
   - Click "Add project"
   - Enter project name (e.g., "sls-tournament")
   - Disable Google Analytics (optional)
   - Click "Create project"

2. **Enable Firestore Database:**
   - In Firebase Console, go to "Build" > "Firestore Database"
   - Click "Create database"
   - Select "Start in test mode" (we'll secure it later)
   - Choose a location close to you (e.g., "eur3" for Europe)
   - Click "Enable"

3. **Get Firebase Config:**
   - In Firebase Console, click the gear icon > "Project settings"
   - Scroll down to "Your apps"
   - Click the web icon (</>) to register a web app
   - Enter app nickname (e.g., "SLS Web")
   - Click "Register app"
   - Copy the firebaseConfig object

4. **Update Firebase Config:**
   - Open `lib/firebase.ts`
   - Replace the placeholder config with your actual config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### Step 3: Initialize Database

You'll need to create the initial collections in Firestore:

1. **Create Settings Collection:**
   - In Firestore Console, click "Start collection"
   - Collection ID: `settings`
   - Document ID: `tournament`
   - Add field: `adminPassword` (string) = `"admin123"` (change this!)
   - Add field: `tournamentName` (string) = `"Sunday League Soccer"`
   - Add field: `seasonYear` (string) = `"2024/2025"`
   - Add field: `currentMatchday` (number) = `1`

2. **Create Empty Collections:**
   - Create collection: `teams`
   - Create collection: `fixtures`
   - Create collection: `players`
   - Create collection: `bookings`

3. **Add Initial Teams:**
   Go to `teams` collection and add documents with this structure:
   ```
   Document ID: auto
   name: "Trailblazers FC"
   shortName: "TBL"
   played: 0
   won: 0
   drawn: 0
   lost: 0
   goalsFor: 0
   goalsAgainst: 0
   goalDifference: 0
   points: 0
   ```

   Repeat for:
   - "BB CF" (shortName: "BBC")
   - "Inazuma FC" (shortName: "INZ")
   - "Galacticos FC" (shortName: "GAL")

### Step 4: Secure Firestore (Important!)

Update your Firestore Security Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to everyone
    match /{document=**} {
      allow read: if true;
    }
    
    // Only allow write access from authenticated admin
    // In production, implement proper authentication
    match /{document=**} {
      allow write: if false;  // Temporarily block all writes
    }
  }
}
```

**Note:** For production, implement proper Firebase Authentication.

## 🎮 Running the Application

### Development Mode

```bash
npm run dev
```

Open http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

## 🔐 Admin Access

1. Navigate to `/admin`
2. Enter the admin password (default: `admin123`)
3. Manage all tournament data

**IMPORTANT:** Change the admin password in Firestore settings before deployment!

## 📱 Usage Guide

### For Administrators

1. **Adding Teams:**
   - Go to Admin Dashboard > Teams
   - Click "Add Team"
   - Enter team name and short name
   - Save

2. **Creating Fixtures:**
   - Go to Admin Dashboard > Fixtures
   - Click "Add Fixture"
   - Select home/away teams, date, time, matchday
   - Status: scheduled/live/finished
   - If finished, enter scores
   - Save

3. **Updating Scores:**
   - Find the fixture in the Fixtures tab
   - Click edit icon
   - Update status to "finished"
   - Enter home and away scores
   - Save
   - Click "Recalculate Standings" to update league table

4. **Managing Players:**
   - Go to Admin Dashboard > Players
   - Click "Add Player"
   - Enter name, team, position, stats
   - Update goals, assists, clean sheets as matches are played
   - Track yellow/red cards

### For Public Users

- Visit the home page to see tournament overview
- Check fixtures for match schedules and results
- View standings for current league table
- See stats for top scorers and player performance
- Read rules for tournament regulations

## 🎨 Customization

### Changing Colors

Edit `styles/globals.css`:

```css
:root {
  --primary-green: #00FF87;  /* Main accent color */
  --dark-bg: #0A0E27;        /* Background */
  --card-bg: #141B2D;        /* Cards background */
}
```

### Adding Teams

Maximum 12 teams supported. Add via Admin Dashboard or directly in Firestore.

### Tournament Rules

Edit the rules in `app/rules/page.tsx` to match your tournament's specific rules.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Vercel will auto-detect Next.js
5. Add environment variables if needed
6. Deploy!

### Other Platforms

Works on any platform that supports Next.js:
- Netlify
- Railway
- Render
- Your own server

## 📊 Features Roadmap

- [ ] Real-time score updates
- [ ] Match commentary
- [ ] Photo gallery
- [ ] Player profiles
- [ ] Email notifications
- [ ] Mobile app

## 🐛 Troubleshooting

**Firebase connection error:**
- Check that your Firebase config in `lib/firebase.ts` is correct
- Ensure Firestore is enabled in Firebase Console

**Admin login not working:**
- Verify the settings document exists in Firestore
- Check browser console for errors
- Clear browser cache and sessionStorage

**Standings not updating:**
- Click "Recalculate Standings" in Admin Dashboard
- Ensure fixture status is set to "finished"
- Check that team names match exactly in fixtures and teams

## 📄 License

MIT License - Feel free to use for your tournament!

## 🙏 Support

For issues or questions:
- Check Firebase Console for errors
- Review browser console logs
- Ensure all collections are properly created

---

Built with ⚽ for Sunday League Soccer
