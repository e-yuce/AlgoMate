/*
  AlgoMate SQL Server Database Setup
  Target: Microsoft SQL Server / SQL Server Management Studio (SSMS)
  Purpose: Creates a relational schema and realistic mock data for the AlgoMate dashboard prototype.

  Safe rerun behaviour:
  - Drops the AlgoMateDB database if it already exists.
  - Recreates schema, views, stored procedure, and mock data.

  Prototype login used in the React app:
  Email: demo.creator@algomate.com
  Password: AlgoMateDemo2026!
*/

USE master;
GO

IF DB_ID('AlgoMateDB') IS NOT NULL
BEGIN
    ALTER DATABASE AlgoMateDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE AlgoMateDB;
END
GO

CREATE DATABASE AlgoMateDB;
GO

USE AlgoMateDB;
GO

-- ============================================================
-- 1. Core Identity / Account Tables
-- ============================================================
CREATE TABLE dbo.Users (
    UserId              INT IDENTITY(1,1) PRIMARY KEY,
    FullName            NVARCHAR(120) NOT NULL,
    Username            NVARCHAR(60) NOT NULL UNIQUE,
    Email               NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash        NVARCHAR(255) NOT NULL,
    RoleName            NVARCHAR(30) NOT NULL DEFAULT 'Creator',
    IsActive            BIT NOT NULL DEFAULT 1,
    CreatedAt           DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    LastLoginAt         DATETIME2(0) NULL,
    CONSTRAINT CK_Users_RoleName CHECK (RoleName IN ('Admin', 'Creator', 'Analyst'))
);
GO

CREATE TABLE dbo.InstagramAccounts (
    AccountId           INT IDENTITY(1,1) PRIMARY KEY,
    UserId              INT NOT NULL,
    InstagramHandle     NVARCHAR(80) NOT NULL UNIQUE,
    DisplayName         NVARCHAR(120) NOT NULL,
    ProfileImageUrl     NVARCHAR(500) NULL,
    FollowersCount      INT NOT NULL DEFAULT 0,
    FollowingCount      INT NOT NULL DEFAULT 0,
    IsConnected         BIT NOT NULL DEFAULT 1,
    ConnectedAt         DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    LastSyncedAt        DATETIME2(0) NULL,
    CONSTRAINT FK_InstagramAccounts_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId) ON DELETE CASCADE,
    CONSTRAINT CK_InstagramAccounts_Followers CHECK (FollowersCount >= 0 AND FollowingCount >= 0)
);
GO

CREATE TABLE dbo.UserSessions (
    SessionId           UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    UserId              INT NOT NULL,
    StartedAt           DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    ExpiresAt           DATETIME2(0) NOT NULL,
    LoggedOutAt         DATETIME2(0) NULL,
    IpAddress           NVARCHAR(45) NULL,
    UserAgent           NVARCHAR(500) NULL,
    CONSTRAINT FK_UserSessions_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId) ON DELETE CASCADE,
    CONSTRAINT CK_UserSessions_Expiry CHECK (ExpiresAt > StartedAt)
);
GO

-- ============================================================
-- 2. Instagram Content Tables
-- ============================================================
CREATE TABLE dbo.Posts (
    PostId              INT IDENTITY(1,1) PRIMARY KEY,
    AccountId           INT NOT NULL,
    InstagramPostCode   NVARCHAR(80) NOT NULL UNIQUE,
    Title               NVARCHAR(160) NOT NULL,
    Caption             NVARCHAR(1200) NULL,
    PostType            NVARCHAR(30) NOT NULL,
    ContentPillar       NVARCHAR(80) NOT NULL,
    MediaUrl            NVARCHAR(500) NULL,
    PublishedAt         DATETIME2(0) NOT NULL,
    ViewCount           INT NOT NULL DEFAULT 0,
    ReachCount          INT NOT NULL DEFAULT 0,
    LikeCount           INT NOT NULL DEFAULT 0,
    CommentCount        INT NOT NULL DEFAULT 0,
    SaveCount           INT NOT NULL DEFAULT 0,
    ShareCount          INT NOT NULL DEFAULT 0,
    ProfileVisitCount   INT NOT NULL DEFAULT 0,
    FollowCount         INT NOT NULL DEFAULT 0,
    AttractedInterest AS (
        CASE
            WHEN (LikeCount + CommentCount + SaveCount + ShareCount + FollowCount) > ReachCount THEN ReachCount
            ELSE (LikeCount + CommentCount + SaveCount + ShareCount + FollowCount)
        END
    ) PERSISTED,
    DidNotAttractInterest AS (
        ReachCount -
        CASE
            WHEN (LikeCount + CommentCount + SaveCount + ShareCount + FollowCount) > ReachCount THEN ReachCount
            ELSE (LikeCount + CommentCount + SaveCount + ShareCount + FollowCount)
        END
    ) PERSISTED,
    EngagementRatePercent AS (
        CASE
            WHEN ReachCount = 0 THEN CONVERT(DECIMAL(6,2), 0)
            ELSE CONVERT(DECIMAL(6,2),
                (
                    CASE
                        WHEN (LikeCount + CommentCount + SaveCount + ShareCount + FollowCount) > ReachCount THEN ReachCount
                        ELSE (LikeCount + CommentCount + SaveCount + ShareCount + FollowCount)
                    END * 100.0
                ) / ReachCount
            )
        END
    ) PERSISTED,
    CreatedAt           DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Posts_InstagramAccounts FOREIGN KEY (AccountId) REFERENCES dbo.InstagramAccounts(AccountId) ON DELETE CASCADE,
    CONSTRAINT CK_Posts_Type CHECK (PostType IN ('Reel', 'Carousel', 'Image')),
    CONSTRAINT CK_Posts_Counts CHECK (
        ViewCount >= 0 AND ReachCount >= 0 AND LikeCount >= 0 AND CommentCount >= 0
        AND SaveCount >= 0 AND ShareCount >= 0 AND ProfileVisitCount >= 0 AND FollowCount >= 0
    )
);
GO

CREATE TABLE dbo.PostTags (
    PostTagId           INT IDENTITY(1,1) PRIMARY KEY,
    PostId              INT NOT NULL,
    TagName             NVARCHAR(80) NOT NULL,
    CONSTRAINT FK_PostTags_Posts FOREIGN KEY (PostId) REFERENCES dbo.Posts(PostId) ON DELETE CASCADE,
    CONSTRAINT UQ_PostTags_Post_Tag UNIQUE(PostId, TagName)
);
GO

CREATE TABLE dbo.Stories (
    StoryId             INT IDENTITY(1,1) PRIMARY KEY,
    AccountId           INT NOT NULL,
    InstagramStoryCode  NVARCHAR(80) NOT NULL UNIQUE,
    Title               NVARCHAR(160) NOT NULL,
    StoryType           NVARCHAR(30) NOT NULL DEFAULT 'Story',
    MediaUrl            NVARCHAR(500) NULL,
    PublishedAt         DATETIME2(0) NOT NULL,
    ExpiresAt           DATETIME2(0) NOT NULL,
    ViewCount           INT NOT NULL DEFAULT 0,
    ReplyCount          INT NOT NULL DEFAULT 0,
    StickerTapCount     INT NOT NULL DEFAULT 0,
    LinkClickCount      INT NOT NULL DEFAULT 0,
    CompletionRate      DECIMAL(5,2) NOT NULL DEFAULT 0,
    CreatedAt           DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Stories_InstagramAccounts FOREIGN KEY (AccountId) REFERENCES dbo.InstagramAccounts(AccountId) ON DELETE CASCADE,
    CONSTRAINT CK_Stories_Type CHECK (StoryType IN ('Story', 'Poll', 'Question', 'Link', 'BehindTheScenes')),
    CONSTRAINT CK_Stories_Counts CHECK (ViewCount >= 0 AND ReplyCount >= 0 AND StickerTapCount >= 0 AND LinkClickCount >= 0),
    CONSTRAINT CK_Stories_Completion CHECK (CompletionRate BETWEEN 0 AND 100),
    CONSTRAINT CK_Stories_Expiry CHECK (ExpiresAt > PublishedAt)
);
GO

-- Optional detailed interaction rows. The dashboard can use aggregated Posts columns now,
-- while this table supports future per-viewer analytics.
CREATE TABLE dbo.Engagement (
    EngagementId        BIGINT IDENTITY(1,1) PRIMARY KEY,
    PostId              INT NOT NULL,
    ViewerKey           NVARCHAR(120) NOT NULL,
    Liked               BIT NOT NULL DEFAULT 0,
    Commented           BIT NOT NULL DEFAULT 0,
    Saved               BIT NOT NULL DEFAULT 0,
    Shared              BIT NOT NULL DEFAULT 0,
    FollowedAfterView   BIT NOT NULL DEFAULT 0,
    DwellSeconds        INT NOT NULL DEFAULT 0,
    CreatedAt           DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Engagement_Posts FOREIGN KEY (PostId) REFERENCES dbo.Posts(PostId) ON DELETE CASCADE,
    CONSTRAINT CK_Engagement_Dwell CHECK (DwellSeconds >= 0)
);
GO

-- ============================================================
-- 3. AI / Mood / Recommendation Tables
-- ============================================================
CREATE TABLE dbo.ContentRecommendations (
    RecommendationId        INT IDENTITY(1,1) PRIMARY KEY,
    UserId                  INT NOT NULL,
    GeneratedAt             DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    RecommendationTitle     NVARCHAR(200) NOT NULL,
    RecommendedFormat       NVARCHAR(30) NOT NULL,
    RecommendedPostWindow   NVARCHAR(60) NOT NULL,
    ConfidenceScore         DECIMAL(5,2) NOT NULL,
    PredictedEngagementRate DECIMAL(6,2) NOT NULL,
    HookSuggestion          NVARCHAR(500) NOT NULL,
    PatternExplanation      NVARCHAR(1200) NOT NULL,
    SourcePostCount         INT NOT NULL DEFAULT 5,
    CONSTRAINT FK_ContentRecommendations_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId) ON DELETE CASCADE,
    CONSTRAINT CK_ContentRecommendations_Format CHECK (RecommendedFormat IN ('Reel', 'Carousel', 'Image')),
    CONSTRAINT CK_ContentRecommendations_Confidence CHECK (ConfidenceScore BETWEEN 0 AND 100)
);
GO

CREATE TABLE dbo.MoodLogs (
    MoodLogId               INT IDENTITY(1,1) PRIMARY KEY,
    UserId                  INT NOT NULL,
    MoodState               NVARCHAR(30) NOT NULL,
    BurnoutRisk             NVARCHAR(30) NOT NULL,
    RecentEngagementRate    DECIMAL(6,2) NOT NULL,
    PreviousEngagementRate  DECIMAL(6,2) NOT NULL,
    ChangeRate              DECIMAL(6,2) NOT NULL,
    Reason                  NVARCHAR(1000) NOT NULL,
    CreatedAt               DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_MoodLogs_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId) ON DELETE CASCADE,
    CONSTRAINT CK_MoodLogs_Mood CHECK (MoodState IN ('Energised', 'Focused', 'Stable', 'Concerned')),
    CONSTRAINT CK_MoodLogs_Risk CHECK (BurnoutRisk IN ('Low', 'Moderate', 'Elevated', 'High'))
);
GO

-- ============================================================
-- 4. Helpful Indexes
-- ============================================================
CREATE INDEX IX_Posts_Account_PublishedAt ON dbo.Posts(AccountId, PublishedAt DESC);
CREATE INDEX IX_Posts_EngagementRate ON dbo.Posts(EngagementRatePercent DESC);
CREATE INDEX IX_Stories_Account_PublishedAt ON dbo.Stories(AccountId, PublishedAt DESC);
CREATE INDEX IX_Engagement_PostId ON dbo.Engagement(PostId);
CREATE INDEX IX_PostTags_TagName ON dbo.PostTags(TagName);
CREATE INDEX IX_MoodLogs_User_CreatedAt ON dbo.MoodLogs(UserId, CreatedAt DESC);
GO

-- ============================================================
-- 5. Dashboard Views
-- ============================================================
CREATE VIEW dbo.vwDashboardPosts AS
SELECT
    p.PostId,
    ia.UserId,
    ia.InstagramHandle,
    p.Title,
    p.Caption,
    p.PostType,
    p.ContentPillar,
    p.PublishedAt,
    p.ViewCount,
    p.ReachCount,
    p.LikeCount,
    p.CommentCount,
    p.SaveCount,
    p.ShareCount,
    p.ProfileVisitCount,
    p.FollowCount,
    p.AttractedInterest,
    p.DidNotAttractInterest,
    p.EngagementRatePercent
FROM dbo.Posts p
INNER JOIN dbo.InstagramAccounts ia ON ia.AccountId = p.AccountId;
GO

CREATE VIEW dbo.vwTopFiveBestPerformingPosts AS
SELECT TOP (5)
    PostId,
    UserId,
    InstagramHandle,
    Title,
    PostType,
    ContentPillar,
    PublishedAt,
    ReachCount,
    AttractedInterest,
    DidNotAttractInterest,
    EngagementRatePercent
FROM dbo.vwDashboardPosts
ORDER BY EngagementRatePercent DESC, AttractedInterest DESC;
GO

CREATE VIEW dbo.vwRecentStories AS
SELECT
    s.StoryId,
    ia.UserId,
    ia.InstagramHandle,
    s.Title,
    s.StoryType,
    s.PublishedAt,
    s.ExpiresAt,
    s.ViewCount,
    s.ReplyCount,
    s.StickerTapCount,
    s.LinkClickCount,
    s.CompletionRate
FROM dbo.Stories s
INNER JOIN dbo.InstagramAccounts ia ON ia.AccountId = s.AccountId;
GO

-- ============================================================
-- 6. Stored Procedure: Generate a Mood Log from recent posts
-- ============================================================
CREATE PROCEDURE dbo.spGenerateMoodLog
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @RecentAvg DECIMAL(6,2);
    DECLARE @PreviousAvg DECIMAL(6,2);
    DECLARE @Change DECIMAL(6,2);
    DECLARE @Mood NVARCHAR(30);
    DECLARE @Risk NVARCHAR(30);
    DECLARE @Reason NVARCHAR(1000);

    ;WITH OrderedPosts AS (
        SELECT
            p.EngagementRatePercent,
            ROW_NUMBER() OVER (ORDER BY p.PublishedAt DESC) AS RowNum
        FROM dbo.Posts p
        INNER JOIN dbo.InstagramAccounts ia ON ia.AccountId = p.AccountId
        WHERE ia.UserId = @UserId
    )
    SELECT
        @RecentAvg = AVG(CASE WHEN RowNum BETWEEN 1 AND 3 THEN EngagementRatePercent END),
        @PreviousAvg = AVG(CASE WHEN RowNum BETWEEN 4 AND 6 THEN EngagementRatePercent END)
    FROM OrderedPosts
    WHERE RowNum BETWEEN 1 AND 6;

    SET @RecentAvg = ISNULL(@RecentAvg, 0);
    SET @PreviousAvg = ISNULL(@PreviousAvg, 0);
    SET @Change = @RecentAvg - @PreviousAvg;

    IF (@RecentAvg >= @PreviousAvg * 1.08 AND @RecentAvg >= 18)
    BEGIN
        SET @Mood = 'Energised';
        SET @Risk = 'Low';
        SET @Reason = 'Latest posts are outperforming the previous batch. Good moment to plan new content without overposting.';
    END
    ELSE IF (@Change >= 0)
    BEGIN
        SET @Mood = 'Focused';
        SET @Risk = 'Low';
        SET @Reason = 'Engagement is improving steadily. Continue the same format family and test one new hook.';
    END
    ELSE IF (@Change <= -4)
    BEGIN
        SET @Mood = 'Concerned';
        SET @Risk = 'Elevated';
        SET @Reason = 'Recent engagement declined meaningfully. Recommend a clearer first-frame promise and lower posting pressure.';
    END
    ELSE
    BEGIN
        SET @Mood = 'Stable';
        SET @Risk = 'Moderate';
        SET @Reason = 'Recent performance is steady. Keep a consistent content structure and avoid overreacting to one post.';
    END

    INSERT INTO dbo.MoodLogs (UserId, MoodState, BurnoutRisk, RecentEngagementRate, PreviousEngagementRate, ChangeRate, Reason)
    VALUES (@UserId, @Mood, @Risk, @RecentAvg, @PreviousAvg, @Change, @Reason);
END
GO

-- ============================================================
-- 7. Mock Data Seed
-- ============================================================
DECLARE @UserId INT;
DECLARE @AccountId INT;

INSERT INTO dbo.Users (FullName, Username, Email, PasswordHash, RoleName, LastLoginAt)
VALUES
('Ege Yüce', 'ege.creator', 'demo.creator@algomate.com', 'DEMO_ONLY__HASH_PLACEHOLDER__AlgoMateDemo2026!', 'Creator', DATEADD(HOUR, -2, SYSUTCDATETIME())),
('Maya Sterling', 'maya.admin', 'maya.admin@algomate.test', 'DEMO_ONLY__HASH_PLACEHOLDER__Admin2026!', 'Admin', DATEADD(DAY, -1, SYSUTCDATETIME()));

SELECT @UserId = UserId FROM dbo.Users WHERE Email = 'demo.creator@algomate.com';

INSERT INTO dbo.InstagramAccounts (UserId, InstagramHandle, DisplayName, ProfileImageUrl, FollowersCount, FollowingCount, LastSyncedAt)
VALUES (@UserId, '@ege.creator', 'Ege Creator Studio', 'https://example.com/profiles/ege.jpg', 48200, 620, SYSUTCDATETIME());

SELECT @AccountId = AccountId FROM dbo.InstagramAccounts WHERE InstagramHandle = '@ege.creator';

INSERT INTO dbo.UserSessions (UserId, StartedAt, ExpiresAt, LoggedOutAt, IpAddress, UserAgent)
VALUES
(@UserId, DATEADD(HOUR, -5, SYSUTCDATETIME()), DATEADD(HOUR, 7, SYSUTCDATETIME()), NULL, '127.0.0.1', 'AlgoMate Prototype Browser'),
(@UserId, DATEADD(DAY, -2, SYSUTCDATETIME()), DATEADD(DAY, -1, SYSUTCDATETIME()), DATEADD(DAY, -1, SYSUTCDATETIME()), '127.0.0.1', 'AlgoMate Prototype Browser');

INSERT INTO dbo.Posts
(AccountId, InstagramPostCode, Title, Caption, PostType, ContentPillar, MediaUrl, PublishedAt, ViewCount, ReachCount, LikeCount, CommentCount, SaveCount, ShareCount, ProfileVisitCount, FollowCount)
VALUES
(@AccountId, 'AM-P-1001', 'Desk reset before finals', 'A calm 20-minute study desk reset before a long revision block.', 'Reel', 'Study Productivity', 'https://example.com/posts/desk-reset.mp4', '2026-05-10T20:15:00', 48600, 39200, 5780, 462, 1740, 1180, 980, 332),
(@AccountId, 'AM-P-1002', '3 mistakes in content planning', 'A quick carousel on why posts fail before editing even starts.', 'Carousel', 'Creator Education', 'https://example.com/posts/three-mistakes.jpg', '2026-05-09T18:40:00', 31100, 27400, 2860, 236, 1510, 730, 510, 184),
(@AccountId, 'AM-P-1003', 'Gym progress check-in', 'A short training clip with a transparent weekly progress update.', 'Reel', 'Lifestyle Progress', 'https://example.com/posts/gym-progress.mp4', '2026-05-08T21:05:00', 42350, 33780, 3920, 318, 860, 690, 720, 214),
(@AccountId, 'AM-P-1004', 'One-hour deep work sprint', 'Timer, notes, and what changed after one uninterrupted hour.', 'Reel', 'Study Productivity', 'https://example.com/posts/deep-work.mp4', '2026-05-07T19:25:00', 36700, 30400, 3470, 280, 1320, 890, 660, 240),
(@AccountId, 'AM-P-1005', 'How I batch content ideas', 'A carousel showing the weekly board, hooks, and final content map.', 'Carousel', 'Creator Education', 'https://example.com/posts/batch-ideas.jpg', '2026-05-06T18:10:00', 28900, 24650, 2540, 198, 1680, 612, 420, 156),
(@AccountId, 'AM-P-1006', 'Morning coffee and notes', 'A cosy static image of a morning notes session.', 'Image', 'Lifestyle Progress', 'https://example.com/posts/morning-notes.jpg', '2026-05-05T09:05:00', 14800, 12900, 990, 84, 260, 110, 180, 48),
(@AccountId, 'AM-P-1007', 'Content calendar walkthrough', 'From idea backlog to a seven-day posting calendar.', 'Carousel', 'Creator Education', 'https://example.com/posts/calendar-walkthrough.jpg', '2026-05-04T17:45:00', 22400, 19120, 1810, 146, 1120, 402, 310, 104),
(@AccountId, 'AM-P-1008', 'Evening study accountability', 'A low-pressure reel asking followers to comment their task for the evening.', 'Reel', 'Community Engagement', 'https://example.com/posts/evening-accountability.mp4', '2026-05-03T20:35:00', 39800, 32200, 3620, 590, 720, 640, 690, 226),
(@AccountId, 'AM-P-1009', 'Creator dashboard redesign', 'A clean before-and-after of dashboard layout improvements.', 'Carousel', 'Creator Education', 'https://example.com/posts/dashboard-redesign.jpg', '2026-05-02T19:10:00', 24680, 20750, 1990, 166, 1170, 488, 350, 118),
(@AccountId, 'AM-P-1010', 'Show jumping lesson recap', 'A concise riding lesson recap with one training takeaway.', 'Reel', 'Lifestyle Progress', 'https://example.com/posts/riding-recap.mp4', '2026-05-01T20:50:00', 33800, 27640, 3010, 332, 680, 520, 590, 172),
(@AccountId, 'AM-P-1011', 'Caption hook formula', 'Five hook examples for making educational captions stronger.', 'Carousel', 'Creator Education', 'https://example.com/posts/hook-formula.jpg', '2026-04-30T18:30:00', 26400, 22900, 2170, 188, 1320, 560, 410, 138),
(@AccountId, 'AM-P-1012', 'What I learned this week', 'A reflective reel turning weekly mistakes into useful lessons.', 'Reel', 'Community Engagement', 'https://example.com/posts/weekly-lessons.mp4', '2026-04-29T21:20:00', 35200, 28670, 3260, 410, 760, 690, 640, 205),
(@AccountId, 'AM-P-1013', 'Minimal editing workflow', 'A practical carousel showing export settings and editing shortcuts.', 'Carousel', 'Creator Education', 'https://example.com/posts/editing-workflow.jpg', '2026-04-28T17:25:00', 21600, 18100, 1680, 126, 970, 390, 280, 96),
(@AccountId, 'AM-P-1014', 'Sunday reset plan', 'A low-stress reset checklist for planning the next week.', 'Image', 'Study Productivity', 'https://example.com/posts/sunday-reset.jpg', '2026-04-27T16:10:00', 17200, 14680, 1310, 94, 720, 180, 210, 62),
(@AccountId, 'AM-P-1015', 'Five-second first frame test', 'A reel showing how to judge whether the opening frame is strong enough.', 'Reel', 'Creator Education', 'https://example.com/posts/first-frame.mp4', '2026-04-26T20:05:00', 37600, 30550, 3540, 280, 1040, 850, 700, 238),
(@AccountId, 'AM-P-1016', 'Lecture notes system', 'A carousel explaining a simple note hierarchy for exam weeks.', 'Carousel', 'Study Productivity', 'https://example.com/posts/lecture-notes.jpg', '2026-04-25T18:55:00', 24100, 20200, 1920, 172, 1188, 420, 330, 112),
(@AccountId, 'AM-P-1017', 'One meal prep idea', 'A static lifestyle post showing a quick creator meal prep.', 'Image', 'Lifestyle Progress', 'https://example.com/posts/meal-prep.jpg', '2026-04-24T12:30:00', 12800, 11240, 760, 68, 210, 96, 140, 34),
(@AccountId, 'AM-P-1018', 'How to choose post time', 'A carousel explaining how to use past engagement windows.', 'Carousel', 'Creator Education', 'https://example.com/posts/post-time.jpg', '2026-04-23T19:40:00', 27300, 23110, 2320, 190, 1260, 540, 430, 142),
(@AccountId, 'AM-P-1019', 'Late night coding sprint', 'A short reel from a coding session with a productivity lesson.', 'Reel', 'Study Productivity', 'https://example.com/posts/coding-sprint.mp4', '2026-04-22T22:05:00', 34200, 28050, 3100, 260, 900, 640, 610, 190),
(@AccountId, 'AM-P-1020', 'Weekly analytics reflection', 'A transparent breakdown of what worked and what failed this week.', 'Carousel', 'Community Engagement', 'https://example.com/posts/analytics-reflection.jpg', '2026-04-21T18:20:00', 23800, 19840, 1880, 220, 840, 470, 320, 126);

INSERT INTO dbo.PostTags (PostId, TagName)
SELECT p.PostId, v.TagName
FROM dbo.Posts p
INNER JOIN (VALUES
('AM-P-1001','study'),('AM-P-1001','routine'),('AM-P-1001','desk'),('AM-P-1001','finals'),
('AM-P-1002','creator'),('AM-P-1002','planning'),('AM-P-1002','mistakes'),('AM-P-1002','growth'),
('AM-P-1003','gym'),('AM-P-1003','progress'),('AM-P-1003','routine'),('AM-P-1003','discipline'),
('AM-P-1004','deepwork'),('AM-P-1004','study'),('AM-P-1004','routine'),('AM-P-1004','focus'),
('AM-P-1005','content'),('AM-P-1005','planning'),('AM-P-1005','workflow'),('AM-P-1005','creator'),
('AM-P-1006','morning'),('AM-P-1006','notes'),('AM-P-1006','coffee'),('AM-P-1006','routine'),
('AM-P-1007','calendar'),('AM-P-1007','creator'),('AM-P-1007','workflow'),('AM-P-1007','planning'),
('AM-P-1008','study'),('AM-P-1008','accountability'),('AM-P-1008','community'),('AM-P-1008','evening'),
('AM-P-1009','dashboard'),('AM-P-1009','design'),('AM-P-1009','beforeafter'),('AM-P-1009','creator'),
('AM-P-1010','riding'),('AM-P-1010','equestrian'),('AM-P-1010','lesson'),('AM-P-1010','discipline'),
('AM-P-1011','caption'),('AM-P-1011','hooks'),('AM-P-1011','copywriting'),('AM-P-1011','creator'),
('AM-P-1012','reflection'),('AM-P-1012','weekly'),('AM-P-1012','community'),('AM-P-1012','growth'),
('AM-P-1013','editing'),('AM-P-1013','workflow'),('AM-P-1013','shortcuts'),('AM-P-1013','creator'),
('AM-P-1014','reset'),('AM-P-1014','study'),('AM-P-1014','planning'),('AM-P-1014','week'),
('AM-P-1015','firstframe'),('AM-P-1015','reels'),('AM-P-1015','hook'),('AM-P-1015','creator'),
('AM-P-1016','lecture'),('AM-P-1016','notes'),('AM-P-1016','exam'),('AM-P-1016','study'),
('AM-P-1017','mealprep'),('AM-P-1017','lifestyle'),('AM-P-1017','creator'),('AM-P-1017','routine'),
('AM-P-1018','postingtime'),('AM-P-1018','analytics'),('AM-P-1018','planning'),('AM-P-1018','creator'),
('AM-P-1019','coding'),('AM-P-1019','deepwork'),('AM-P-1019','study'),('AM-P-1019','night'),
('AM-P-1020','analytics'),('AM-P-1020','reflection'),('AM-P-1020','community'),('AM-P-1020','growth')
) AS v(PostCode, TagName) ON v.PostCode = p.InstagramPostCode;

INSERT INTO dbo.Stories
(AccountId, InstagramStoryCode, Title, StoryType, MediaUrl, PublishedAt, ExpiresAt, ViewCount, ReplyCount, StickerTapCount, LinkClickCount, CompletionRate)
VALUES
(@AccountId, 'AM-S-2001', 'Poll: post tonight?', 'Poll', 'https://example.com/stories/poll-tonight.jpg', '2026-05-11T13:10:00', '2026-05-12T13:10:00', 12480, 184, 980, 116, 88.00),
(@AccountId, 'AM-S-2002', 'Behind the carousel draft', 'BehindTheScenes', 'https://example.com/stories/carousel-draft.jpg', '2026-05-11T11:40:00', '2026-05-12T11:40:00', 10120, 142, 740, 82, 84.00),
(@AccountId, 'AM-S-2003', 'Study desk Q&A', 'Question', 'https://example.com/stories/study-qa.jpg', '2026-05-10T22:15:00', '2026-05-11T22:15:00', 14920, 336, 1220, 154, 91.00),
(@AccountId, 'AM-S-2004', 'Gym session check', 'Story', 'https://example.com/stories/gym-check.jpg', '2026-05-10T17:20:00', '2026-05-11T17:20:00', 9430, 118, 530, 44, 79.00),
(@AccountId, 'AM-S-2005', 'Choose tomorrow topic', 'Poll', 'https://example.com/stories/topic-poll.jpg', '2026-05-09T21:30:00', '2026-05-10T21:30:00', 13240, 220, 1060, 128, 87.00),
(@AccountId, 'AM-S-2006', 'Editing timeline preview', 'BehindTheScenes', 'https://example.com/stories/editing-preview.jpg', '2026-05-09T16:15:00', '2026-05-10T16:15:00', 8740, 96, 420, 58, 76.00),
(@AccountId, 'AM-S-2007', 'Ask me about studying', 'Question', 'https://example.com/stories/study-question.jpg', '2026-05-08T20:25:00', '2026-05-09T20:25:00', 12100, 310, 860, 92, 86.00),
(@AccountId, 'AM-S-2008', 'New reel teaser', 'Story', 'https://example.com/stories/reel-teaser.jpg', '2026-05-08T14:00:00', '2026-05-09T14:00:00', 7920, 80, 390, 34, 74.00),
(@AccountId, 'AM-S-2009', 'Link: content checklist', 'Link', 'https://example.com/stories/checklist-link.jpg', '2026-05-07T19:00:00', '2026-05-08T19:00:00', 11870, 144, 720, 310, 83.00),
(@AccountId, 'AM-S-2010', 'Quick workspace tour', 'BehindTheScenes', 'https://example.com/stories/workspace-tour.jpg', '2026-05-06T12:20:00', '2026-05-07T12:20:00', 9180, 104, 560, 49, 80.00),
(@AccountId, 'AM-S-2011', 'Caption A or B?', 'Poll', 'https://example.com/stories/caption-ab.jpg', '2026-05-05T18:45:00', '2026-05-06T18:45:00', 10750, 166, 880, 76, 85.00),
(@AccountId, 'AM-S-2012', 'Weekly analytics mini recap', 'Story', 'https://example.com/stories/analytics-recap.jpg', '2026-05-04T21:10:00', '2026-05-05T21:10:00', 11220, 174, 650, 122, 82.00);

-- Detailed engagement mock rows: 32 sample interactions per post.
;WITH Nums AS (
    SELECT TOP (32) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
    FROM sys.all_objects
), PostRows AS (
    SELECT PostId, PublishedAt
    FROM dbo.Posts
)
INSERT INTO dbo.Engagement (PostId, ViewerKey, Liked, Commented, Saved, Shared, FollowedAfterView, DwellSeconds, CreatedAt)
SELECT
    p.PostId,
    CONCAT('viewer_', p.PostId, '_', n.n),
    CASE WHEN n.n % 2 IN (0, 1) THEN 1 ELSE 0 END,
    CASE WHEN n.n % 11 = 0 THEN 1 ELSE 0 END,
    CASE WHEN n.n % 5 = 0 THEN 1 ELSE 0 END,
    CASE WHEN n.n % 7 = 0 THEN 1 ELSE 0 END,
    CASE WHEN n.n % 19 = 0 THEN 1 ELSE 0 END,
    4 + (n.n * 3) % 47,
    DATEADD(MINUTE, n.n * 7, p.PublishedAt)
FROM PostRows p
CROSS JOIN Nums n;

INSERT INTO dbo.ContentRecommendations
(UserId, GeneratedAt, RecommendationTitle, RecommendedFormat, RecommendedPostWindow, ConfidenceScore, PredictedEngagementRate, HookSuggestion, PatternExplanation, SourcePostCount)
VALUES
(@UserId, SYSUTCDATETIME(), 'Study Productivity: routine save-worthy checklist', 'Reel', '19:00-21:30', 91.00, 22.40, 'Start with the final desk setup, then reveal the exact three steps that produced it.', 'Top five posts repeatedly combine Reels, study/productivity themes, routine tags, and strong save/share behaviour. Evening posts outperform morning posts.', 5),
(@UserId, DATEADD(DAY, -1, SYSUTCDATETIME()), 'Creator Education: planning carousel checklist', 'Carousel', '18:00-20:00', 86.00, 19.80, 'Open with a clear mistake, then give a simple correction per slide.', 'High-performing carousels have planning, workflow, and creator tags with above-average saves.', 5),
(@UserId, DATEADD(DAY, -2, SYSUTCDATETIME()), 'Community Engagement: evening accountability reel', 'Reel', '20:00-22:00', 83.00, 18.90, 'Ask followers to comment one task before showing your own work sprint.', 'Posts that invite a response produce more comments and profile visits.', 5);

INSERT INTO dbo.MoodLogs
(UserId, MoodState, BurnoutRisk, RecentEngagementRate, PreviousEngagementRate, ChangeRate, Reason, CreatedAt)
VALUES
(@UserId, 'Focused', 'Low', 21.35, 19.20, 2.15, 'Engagement is improving steadily. Continue with the same format family and test one new hook.', DATEADD(DAY, -6, SYSUTCDATETIME())),
(@UserId, 'Stable', 'Moderate', 19.90, 20.10, -0.20, 'Performance is steady. Avoid unnecessary posting pressure.', DATEADD(DAY, -5, SYSUTCDATETIME())),
(@UserId, 'Focused', 'Low', 20.70, 19.60, 1.10, 'Recent posts are improving with evening publication windows.', DATEADD(DAY, -4, SYSUTCDATETIME())),
(@UserId, 'Energised', 'Low', 22.30, 19.10, 3.20, 'Latest posts are outperforming the previous batch.', DATEADD(DAY, -3, SYSUTCDATETIME())),
(@UserId, 'Stable', 'Moderate', 19.80, 20.50, -0.70, 'Performance remains healthy but not dramatically above baseline.', DATEADD(DAY, -2, SYSUTCDATETIME())),
(@UserId, 'Focused', 'Low', 21.10, 19.40, 1.70, 'Recent content is improving and still sustainable.', DATEADD(DAY, -1, SYSUTCDATETIME()));

EXEC dbo.spGenerateMoodLog @UserId = @UserId;
GO

-- ============================================================
-- 8. Quick Test Queries for SSMS
-- ============================================================
SELECT * FROM dbo.vwDashboardPosts ORDER BY PublishedAt DESC;
SELECT * FROM dbo.vwTopFiveBestPerformingPosts;
SELECT * FROM dbo.vwRecentStories ORDER BY PublishedAt DESC;
SELECT TOP (10) * FROM dbo.MoodLogs ORDER BY CreatedAt DESC;
SELECT TOP (10) * FROM dbo.ContentRecommendations ORDER BY GeneratedAt DESC;
GO
