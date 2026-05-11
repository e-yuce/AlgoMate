Create a complete high-fidelity interactive web app prototype for a project called “AlgoMate”.

PROJECT CONTEXT:
AlgoMate is an AI-powered assistant for Instagram content creators. The system helps beginner creators, influencers, students, and casual users improve Instagram engagement while reducing content creation stress and burnout. The app connects to the user’s Instagram account, analyses previous posts, engagement metrics, audience behaviour, mood data, and trends. Based on this data, AlgoMate recommends content ideas, captions, hashtags, best posting times, audience targets, analytics insights, burnout alerts, and downloadable reports.

The website should feel like a modern SaaS dashboard, not a simple landing page. It should look professional enough for a university Software Design Document prototype. The design should be clean, elegant, modern, and easy to understand. Use a premium dashboard style with rounded cards, soft shadows, clear spacing, and a calm but creative colour palette.

IMPORTANT:
Do not build a real Instagram integration. Use realistic mock data.
Do not use the official Instagram logo. Use Instagram-inspired gradient accents only.
Make the prototype interactive with clickable navigation between pages.
Design all pages as if this is a real product ready for presentation.
Use realistic content, metrics, charts, button labels, empty states, and user feedback messages.

TECH / STYLE:
Create a responsive web app layout.
Use a desktop dashboard-first design.
Also make it look acceptable on tablet and mobile.
Use a left sidebar navigation on desktop.
Use a top bar with user profile, notification icon, and connected account status.
Use modern typography.
Use rounded cards.
Use dashboard-style charts and tables.
Use clean icons.
Use soft gradient accents inspired by social media platforms.
Use light mode as the default.
Use a professional colour palette:
- Background: very light grey or off-white
- Main cards: white
- Primary accent: purple/indigo
- Secondary accent: pink/orange gradient
- Success: green
- Warning: amber
- Error: red
- Text: dark slate/charcoal

GLOBAL LAYOUT:
The app should include:
1. Left sidebar navigation
2. Top header bar
3. Main content area
4. Cards for summaries
5. Graph/chart sections
6. Tables/lists where needed
7. Buttons with clear call-to-action text
8. Toast or success messages after actions
9. Clear page titles and subtitles

SIDEBAR NAVIGATION ITEMS:
- Dashboard
- Connect Instagram
- Content Ideas
- Caption & Hashtags
- Posting Time
- Engagement Analysis
- Mood Tracker
- Audience Targeting
- Reports
- Settings

TOP BAR:
Include:
- Search box with placeholder “Search insights, posts, ideas…”
- Notification bell
- Connected Instagram account badge: “@ege.creator connected”
- User avatar with name “Ege Yüce”
- Small status chip: “AI Ready”

CREATE THESE SCREENS:

SCREEN 1 — LOGIN / REGISTER PAGE:
Design a split-screen authentication page.
Left side:
- AlgoMate logo/name
- Tagline: “Create smarter. Post calmer. Grow faster.”
- Short description: “AI-powered Instagram content planning, engagement analysis, and burnout-aware recommendations.”
- Decorative abstract gradient illustration

Right side:
- Login card with tabs: Login and Register
- Email input
- Password input
- Confirm password field on Register tab
- “Remember me” checkbox
- “Forgot password?” link
- Primary button: “Login to AlgoMate”
- Secondary button: “Create Account”
- Small note: “By continuing, you agree to the privacy and data usage policy.”
- OAuth style button: “Continue with Instagram” but mark it as mock/prototype

Interactions:
- Login button goes to Dashboard
- Register tab switches form
- “Continue with Instagram” goes to Connect Instagram screen

SCREEN 2 — CONNECT INSTAGRAM ACCOUNT:
Purpose: User connects Instagram account using OAuth-style flow.
Layout:
- Page title: “Connect Instagram Account”
- Subtitle: “Allow AlgoMate to analyse your posts, engagement, and audience trends.”
- Large connection status card
- Status before connection: “Not Connected”
- Button: “Connect Instagram”
- Permission explanation cards:
  1. Read post performance
  2. Analyse captions and hashtags
  3. Retrieve engagement metrics
  4. Generate personalised recommendations
- Security note card: “Your access token is encrypted and can be revoked anytime.”
- Mock OAuth modal:
  - Title: “Instagram Permission Request”
  - Text: “AlgoMate wants permission to access post insights and engagement data.”
  - Buttons: “Approve Access” and “Cancel”
- After approval, show:
  - Status: “Connected”
  - Account: “@ege.creator”
  - Connected date
  - Button: “Sync Instagram Data”
  - Button: “Disconnect”

Interactions:
- “Connect Instagram” opens permission modal
- “Approve Access” changes status to connected
- “Sync Instagram Data” shows success message: “Instagram data synced successfully.”

SCREEN 3 — MAIN ANALYTICS DASHBOARD:
Purpose: Main home/dashboard screen.
Page title: “Analytics Dashboard”
Subtitle: “Your Instagram performance and AI recommendations at a glance.”

Include summary cards:
1. Total Views: 128.4K, +18.2%
2. Total Likes: 14.7K, +9.6%
3. Comments: 2.1K, +6.4%
4. Engagement Rate: 8.7%, +1.2%
5. Follower Growth: +1,240 this month
6. Burnout Risk: Low

Include charts:
- Line chart: “Engagement Over Time”
- Bar chart: “Best Performing Days”
- Donut chart: “Content Type Performance”
  - Reels 54%
  - Carousel 27%
  - Photo 12%
  - Story 7%

Include AI recommendation card:
Title: “Today’s AI Recommendation”
Text: “Post a short behind-the-scenes reel between 19:00–21:00. Your audience engagement is strongest during evening hours.”
Button: “Generate Content Idea”

Include top posts table:
Columns:
- Post
- Type
- Views
- Likes
- Comments
- Engagement Rate
Rows:
- “Morning routine reel” / Reel / 42.1K / 4.8K / 420 / 11.2%
- “Study desk setup” / Carousel / 25.7K / 2.2K / 190 / 8.4%
- “Gym progress clip” / Reel / 31.4K / 3.1K / 260 / 9.6%

Include mood summary card:
- Current mood: “Focused”
- Stress level: “Low”
- Suggestion: “You are in a good state for planning content.”

Interactions:
- “Generate Content Idea” goes to Content Ideas screen
- Clicking top post opens a small detail modal
- Dashboard sidebar links navigate to relevant pages

SCREEN 4 — CONTENT IDEAS PAGE:
Purpose: AI-generated post/reel idea suggestions.
Page title: “Content Ideas”
Subtitle: “Personalised AI suggestions based on your audience, trends, and past performance.”

Top controls:
- Button: “Generate New Ideas”
- Filters:
  - Content Type: All / Reel / Carousel / Photo / Story
  - Goal: Growth / Engagement / Sales / Awareness
  - Difficulty: Easy / Medium / Advanced
  - Mood Fit: Calm / Energetic / Professional / Funny

Idea cards:
Each card should include:
- Idea title
- Short description
- Recommended format
- Estimated engagement score
- Difficulty level
- Best posting time
- Buttons: “Use Idea”, “Save”, “Generate Caption”

Example cards:
1. “Behind-the-scenes study routine”
   Description: “A short reel showing your setup, planning process, and final result.”
   Format: Reel
   Estimated engagement: 91%
   Difficulty: Easy
   Best time: 20:00

2. “Before vs After content improvement”
   Description: “Show how your post quality changed with better planning and editing.”
   Format: Carousel
   Estimated engagement: 84%
   Difficulty: Medium
   Best time: 18:30

3. “3 mistakes creators make”
   Description: “Educational carousel explaining common content mistakes and quick fixes.”
   Format: Carousel
   Estimated engagement: 79%
   Difficulty: Easy
   Best time: 17:00

Interactions:
- “Generate New Ideas” refreshes or shows new idea cards
- “Save” changes to “Saved”
- “Generate Caption” opens Caption & Hashtags screen with selected idea

SCREEN 5 — CAPTION & HASHTAG GENERATOR:
Purpose: Generate captions and hashtags for selected content idea.
Page title: “Caption & Hashtag Generator”
Subtitle: “Create polished captions and discover relevant hashtags.”

Layout:
Left panel:
- Selected idea card
- Text area: “Describe your post idea…”
- Tone selector:
  - Professional
  - Friendly
  - Funny
  - Elegant
  - Motivational
- Caption length:
  - Short
  - Medium
  - Long
- Button: “Generate Captions”

Right panel:
- Generated caption suggestions
- Each caption has:
  - Caption text
  - Tone label
  - Copy button
  - Save button

Example captions:
1. “Small changes in planning can create a huge difference in content performance. Here is how I organise my ideas before posting.”
2. “Behind every good post, there is a quiet planning process nobody sees.”
3. “Creating consistently does not mean rushing. It means building a system that protects your energy.”

Hashtag section:
- Button: “Recommend Hashtags”
- Hashtag chips:
  #contentcreator
  #instagramgrowth
  #reelsstrategy
  #creatorroutine
  #digitalcreator
  #socialmediatips
  #contentplanning
  #growthstrategy

Hashtag metrics:
- Popularity score
- Competition level
- Relevance score

Interactions:
- “Generate Captions” displays 3 captions
- “Recommend Hashtags” displays hashtag chips
- “Copy” shows toast: “Copied to clipboard”
- “Save” shows toast: “Caption saved”

SCREEN 6 — POSTING TIME OPTIMISATION:
Purpose: Suggest best posting times.
Page title: “Posting Time Optimisation”
Subtitle: “Find the best time to post based on audience activity and previous engagement.”

Include:
- Weekly heatmap showing engagement by day and hour
- Recommended time cards:
  1. Monday 20:00 — Confidence 94%
  2. Wednesday 18:30 — Confidence 89%
  3. Sunday 21:00 — Confidence 86%
- Explanation card:
  “Your followers are most active between 18:00 and 21:00. Reels perform best on Monday and Sunday evenings.”
- Button: “Select Recommended Time”
- Button: “Add to Content Calendar”
- Upcoming schedule mini calendar

Interactions:
- Selecting a time highlights the card
- “Add to Content Calendar” shows success message
- Calendar updates with selected time

SCREEN 7 — ENGAGEMENT ANALYSIS:
Purpose: Analyse past Instagram post performance.
Page title: “Engagement Analysis”
Subtitle: “Understand what works, what underperforms, and why.”

Include:
- Button: “Analyse Latest Posts”
- Data cards:
  - Best performing format: Reels
  - Average engagement rate: 8.7%
  - Best caption tone: Educational
  - Most active audience: 18–24 age group
- Post performance table:
  Columns:
  - Post title
  - Type
  - Views
  - Likes
  - Comments
  - Shares
  - Engagement Rate
  - AI Insight

Example insights:
- “Strong hook in first 3 seconds”
- “Good use of trending audio”
- “Caption could be shorter”
- “Hashtags are too broad”

Include chart:
- Engagement comparison by content type
- Likes/comments/shares grouped bar chart

Interactions:
- “Analyse Latest Posts” shows loading state then results
- Clicking AI Insight opens a detail modal

SCREEN 8 — MOOD TRACKER:
Purpose: Track user mood and burnout risk.
Page title: “Mood Tracker”
Subtitle: “Monitor your creative energy and reduce burnout risk.”

Include:
- Mood input text box:
  Placeholder: “How do you feel about creating content today?”
- Quick mood buttons:
  Calm
  Focused
  Tired
  Stressed
  Inspired
  Unmotivated
- Button: “Analyse Mood”
- Result card:
  - Mood: Focused
  - Sentiment score: 82/100
  - Burnout risk: Low
  - Recommendation: “You are ready for planning. Try creating 2 content ideas today, but avoid overloading your schedule.”
- Mood history chart:
  - Last 7 days mood trend
- Burnout prevention card:
  - “Take breaks after long content sessions”
  - “Batch content planning, not content stress”
  - “Use lower-effort ideas on tired days”

Interactions:
- Selecting mood changes selected state
- “Analyse Mood” updates result card
- If user chooses “Stressed”, show warning card: “Burnout risk increased. Consider choosing a low-effort content idea.”

SCREEN 9 — AUDIENCE TARGETING:
Purpose: Show who engages most with the user’s content.
Page title: “Audience Targeting”
Subtitle: “Understand your most responsive audience segments.”

Include:
- Audience segment cards:
  1. Students, 18–24, high engagement
  2. Fitness lifestyle followers, medium engagement
  3. Productivity-focused users, high saves
- Audience interest chart:
  - Productivity
  - Fitness
  - Study routines
  - Lifestyle
  - Tech
- Recommended targeting advice:
  “Your highest engagement comes from students interested in productivity and lifestyle content. Use educational captions and evening posting times.”
- Button: “Generate Idea for This Audience”

Interactions:
- Clicking an audience segment updates recommendation card
- “Generate Idea for This Audience” goes to Content Ideas page

SCREEN 10 — REPORTS / EXPORT PAGE:
Purpose: Generate and download analytics report.
Page title: “Reports”
Subtitle: “Export your Instagram insights and AI recommendations.”

Include:
- Report type selector:
  - Weekly Summary
  - Monthly Analytics
  - Content Performance Report
  - Mood & Burnout Report
- Date range picker
- Checkboxes:
  - Include engagement metrics
  - Include top posts
  - Include AI recommendations
  - Include mood analysis
  - Include posting time suggestions
- Preview report card:
  - Report title
  - Generated date
  - Included sections
- Buttons:
  - “Generate Report”
  - “Download PDF”
  - “Download CSV”

Interactions:
- “Generate Report” shows loading state then preview
- “Download PDF” shows success toast: “Report downloaded successfully”

SCREEN 11 — SETTINGS PAGE:
Purpose: User preferences and privacy.
Page title: “Settings”
Include:
- Profile information
- Connected Instagram account status
- Notification preferences
- Privacy settings
- Data usage permission
- AI personalisation toggle
- Delete account button
- Save changes button

Interactions:
- Toggle switches work visually
- Save button shows toast

COMPONENT REQUIREMENTS:
Use reusable UI components:
- Sidebar
- Topbar
- StatCard
- ChartCard
- IdeaCard
- PostTable
- MoodCard
- RecommendationCard
- Modal
- Toast message
- Button
- Input
- Dropdown
- Tabs
- Toggle
- Badge/Chip

MOCK DATA:
Use realistic mock data:
User:
- Name: Ege Yüce
- Instagram: @ege.creator
- Followers: 18,400
- Monthly growth: +1,240
- Average engagement: 8.7%

Post examples:
- Morning routine reel
- Study desk setup
- Gym progress clip
- Behind-the-scenes planning
- Weekly content strategy

Metrics:
- Views
- Likes
- Comments
- Shares
- Saves
- Engagement rate
- Follower growth
- Best posting time
- Mood score
- Burnout risk

INTERACTIVITY:
Make these interactions clickable:
- Login goes to Dashboard
- Sidebar navigation changes pages
- Connect Instagram opens OAuth modal
- Approve access changes connection status
- Generate ideas creates/refreshes idea cards
- Generate caption shows caption suggestions
- Recommend hashtags shows hashtag chips
- Select posting time highlights selected time
- Add to calendar shows success
- Analyse mood updates mood result
- Generate report creates report preview
- Download PDF shows success toast

DESIGN QUALITY:
Make it look like a real high-fidelity product prototype.
Avoid empty plain pages.
Every page should have realistic data.
Every important screen should have a clear purpose.
Use consistent spacing, colours, typography, and components.
Use modern SaaS dashboard aesthetics.
The UI should be clean enough to include screenshots in a Software Design Document.

DELIVERABLE:
Generate the full interactive prototype with all screens connected.
Also include a polished landing/home feel inside the login page.
Make the final result presentation-ready for a university software engineering project.