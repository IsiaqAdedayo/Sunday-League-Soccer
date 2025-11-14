# Firebase Firestore Setup Guide

## Quick Start Collections

After creating your Firebase project and enabling Firestore, create these collections:

### 1. Settings Collection

Collection: `settings`
Document ID: `tournament`

```json
{
  "adminPassword": "your-secure-password",
  "tournamentName": "Sunday League Soccer",
  "seasonYear": "2024/2025",
  "currentMatchday": 1
}
```

### 2. Teams Collection

Collection: `teams`

Add 4 documents (use auto-generated IDs):

**Document 1:**
```json
{
  "name": "Trailblazers FC",
  "shortName": "TBL",
  "played": 0,
  "won": 0,
  "drawn": 0,
  "lost": 0,
  "goalsFor": 0,
  "goalsAgainst": 0,
  "goalDifference": 0,
  "points": 0
}
```

**Document 2:**
```json
{
  "name": "BB CF",
  "shortName": "BBC",
  "played": 0,
  "won": 0,
  "drawn": 0,
  "lost": 0,
  "goalsFor": 0,
  "goalsAgainst": 0,
  "goalDifference": 0,
  "points": 0
}
```

**Document 3:**
```json
{
  "name": "Inazuma FC",
  "shortName": "INZ",
  "played": 0,
  "won": 0,
  "drawn": 0,
  "lost": 0,
  "goalsFor": 0,
  "goalsAgainst": 0,
  "goalDifference": 0,
  "points": 0
}
```

**Document 4:**
```json
{
  "name": "Galacticos FC",
  "shortName": "GAL",
  "played": 0,
  "won": 0,
  "drawn": 0,
  "lost": 0,
  "goalsFor": 0,
  "goalsAgainst": 0,
  "goalDifference": 0,
  "points": 0
}
```

### 3. Empty Collections

Create these empty collections (they'll be populated via Admin Dashboard):

- `fixtures`
- `players`
- `bookings`

## Firestore Security Rules

Go to Firestore > Rules and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow everyone to read all documents
    match /{document=**} {
      allow read: if true;
    }
    
    // For production: Restrict writes
    // You'll need to implement proper authentication
    match /{document=**} {
      allow write: if request.auth != null;
    }
  }
}
```

**For Development (Temporary):**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **WARNING:** The development rules allow anyone to read AND write. Only use during initial setup and testing!

## Adding Sample Fixtures

Via Admin Dashboard, add fixtures with this structure:

```json
{
  "homeTeam": "Trailblazers FC",
  "awayTeam": "BB CF",
  "homeScore": null,
  "awayScore": null,
  "date": "Nov 24, 2024",
  "time": "4:30 PM",
  "matchday": 1,
  "status": "scheduled"
}
```

## Adding Sample Players

Via Admin Dashboard, add players:

```json
{
  "name": "Player Name",
  "team": "Trailblazers FC",
  "goals": 0,
  "assists": 0,
  "cleanSheets": 0,
  "yellowCards": 0,
  "redCards": 0,
  "position": "FWD"
}
```

Position options: "GK", "DEF", "MID", "FWD"

## Testing Checklist

After setup:

1. ✅ Visit homepage - should load without errors
2. ✅ Check fixtures page - should show empty or scheduled matches
3. ✅ Check standings - should show 4 teams with 0 points
4. ✅ Go to `/admin` - should show login page
5. ✅ Login with your password - should access admin dashboard
6. ✅ Add a fixture - should save successfully
7. ✅ Add a player - should save successfully
8. ✅ Update a fixture with scores - standings should update after recalculation

## Production Deployment

Before deploying to production:

1. Change the admin password in Firestore
2. Update security rules to restrict writes
3. Consider implementing Firebase Authentication
4. Set up Firebase Hosting or use Vercel
5. Add SSL certificate (automatic with Vercel/Firebase Hosting)

## Backup Your Data

To export your Firestore data:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Export data
firebase firestore:export gs://your-bucket-name/backups/$(date +%Y%m%d)
```

## Support

If you encounter issues:
1. Check Firebase Console for quota limits
2. Review browser console for JavaScript errors
3. Verify all collections are created
4. Ensure Firebase config in lib/firebase.ts is correct
