# AlgoMate Enhancement Notes

## Demo login

- Email: `demo.creator@algomate.com`
- Password: `AlgoMateDemo2026!`

## Implemented frontend features

1. **Dashboard initialization**
   - Dashboard now opens with a prominent `Recent Instagram Posts & Stories` section.
   - Recent posts and stories use realistic mock data that mirrors the SQL Server schema.

2. **Inductive recommendation engine**
   - The app analyses the top 5 posts by engagement rate.
   - It deduces the best format, content pillar, recurring tags, posting window, and recommendation confidence.
   - The recommendation appears on the dashboard and inside the `Content Ideas` screen.

3. **Engagement metrics per post**
   - Each post calculates:
     - `Attracted Interest: X people`
     - `Did Not Attract Interest: Y people`
   - Formula used in the prototype:
     - `AttractedInterest = min(Reach, Likes + Comments + Saves + Shares + Follows)`
     - `DidNotAttractInterest = Reach - AttractedInterest`

4. **Session management**
   - Added a functional `Logout` button in the top header.
   - Logout returns the user to the login screen and resets the active navigation screen to Dashboard.

5. **Responsive mood tracker**
   - Mood is no longer static.
   - It is calculated from the latest 3 posts compared with the previous 3 posts.
   - The dashboard summary and full `Mood Tracker` screen update from engagement-rate performance.

6. **Engagement Analysis screen**
   - Added a dedicated visual screen comparing attracted vs non-attracted audience per post.

7. **Filled navigation pages**
   - `Connect Instagram`: connected account status, sync health, permissions, recent import preview, and OAuth-style workflow.
   - `Caption & Hashtags`: generated caption variants, CTA suggestions, quality checklist, and hashtag clusters.
   - `Posting Time`: best next slot, weekly timing chart, and recommended posting schedule table.
   - `Audience Targeting`: primary audience segment, segment table, hook/CTA/creative guidance.
   - `Reports`: weekly report summary, export option cards, top metrics, and top post table.
   - `Settings`: profile fields, security status, sync/report/mood-alert toggles, and safe prototype danger-zone actions.

## SQL Server database file

The complete SQL Server setup script is here:

```text
database/AlgoMate_SQLServer_Setup.sql
```

It creates:

- `Users`
- `InstagramAccounts`
- `UserSessions`
- `Posts`
- `PostTags`
- `Stories`
- `Engagement`
- `ContentRecommendations`
- `MoodLogs`

It also creates:

- `vwDashboardPosts`
- `vwTopFiveBestPerformingPosts`
- `vwRecentStories`
- `spGenerateMoodLog`

The script inserts realistic mock data for posts, stories, engagement rows, mood logs, and AI recommendations.

## Run instructions

```bash
npm install
npm run dev
```

To build:

```bash
npm run build
```

## SSMS instructions

1. Open SQL Server Management Studio.
2. Open `database/AlgoMate_SQLServer_Setup.sql`.
3. Execute the full script.
4. The script creates a fresh `AlgoMateDB` database and runs test queries at the end.

## Build verification

The updated project was checked with:

```bash
npm run build
```

The build completes successfully. Vite shows a normal large-chunk warning because this prototype bundles dashboard UI and charting libraries in one frontend build.
