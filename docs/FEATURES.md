# 🎯 VYBE - Complete Feature List

**Document Version:** 1.0
**Last Updated:** 2025-11-13

---

## 📋 TABLE OF CONTENTS

1. [MVP Features (Month 0-2)](#mvp-features-month-0-2)
2. [V1 Features (Month 2-4)](#v1-features-month-2-4)
3. [V2 Features (Month 4-9)](#v2-features-month-4-9)
4. [Feature Priority Matrix](#feature-priority-matrix)
5. [API Endpoints Overview](#api-endpoints-overview)

---

## 🟣 MVP FEATURES (Month 0-2)

### 1. Authentication & User Management

#### 1.1 User Registration & Login
- [x] Email/password signup with validation
- [x] Email verification flow
- [x] Google OAuth integration
- [x] Apple Sign-In integration
- [x] Password reset via email
- [x] JWT-based authentication
- [x] Refresh token mechanism
- [x] Role selection during signup (USER | STYLIST | BOTH)

**API Endpoints:**
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/google
POST   /api/auth/apple
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/refresh-token
POST   /api/auth/logout
```

#### 1.2 User Profile
- [x] View profile
- [x] Edit profile (name, email, phone, bio)
- [x] Upload profile picture
- [x] Change password
- [x] Delete account

**API Endpoints:**
```
GET    /api/users/me
PUT    /api/users/me
PUT    /api/users/me/password
DELETE /api/users/me
POST   /api/users/me/avatar
```

---

### 2. Wardrobe Management

#### 2.1 Wardrobe CRUD
- [x] Create wardrobe with name, location, description
- [x] View all user's wardrobes
- [x] View single wardrobe details
- [x] Edit wardrobe details
- [x] Delete wardrobe (with confirmation)
- [x] Set default wardrobe
- [x] Wardrobe stats (item count, outfit count)

**API Endpoints:**
```
POST   /api/wardrobes
GET    /api/wardrobes
GET    /api/wardrobes/:id
PUT    /api/wardrobes/:id
DELETE /api/wardrobes/:id
PATCH  /api/wardrobes/:id/default
GET    /api/wardrobes/:id/stats
```

#### 2.2 Categories
- [x] Create category (with optional parent for subcategories)
- [x] View categories for wardrobe
- [x] Edit category
- [x] Delete category
- [x] Reorder categories
- [x] Hierarchical category structure

**API Endpoints:**
```
POST   /api/wardrobes/:wardrobeId/categories
GET    /api/wardrobes/:wardrobeId/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
PATCH  /api/categories/reorder
```

#### 2.3 Clothing Items
- [x] Add clothing item with details:
  - Images (multiple)
  - Name
  - Item type
  - Color
  - Season (SPRING | SUMMER | FALL | WINTER | ALL_SEASON)
  - Brand
  - Notes
  - Purchase date (optional)
  - Price (optional)
- [x] View all items in wardrobe
- [x] View single item details
- [x] Edit item details
- [x] Delete item
- [x] Add/remove images
- [x] Search items (by name, type, color, brand)
- [x] Filter items (by category, season, color)
- [x] Sort items (by date added, name, price)

**API Endpoints:**
```
POST   /api/wardrobes/:wardrobeId/items
GET    /api/wardrobes/:wardrobeId/items
GET    /api/items/:id
PUT    /api/items/:id
DELETE /api/items/:id
POST   /api/items/:id/images
DELETE /api/items/:id/images/:imageId
GET    /api/items/search
```

---

### 3. Outfit Builder

#### 3.1 Outfit Management
- [x] Create outfit by selecting multiple items
- [x] View all user's outfits
- [x] View single outfit details
- [x] Edit outfit metadata
- [x] Delete outfit
- [x] Mark outfit as favorite
- [x] Outfit metadata:
  - Name
  - Description
  - Season
  - Occasion
  - Mood/tags
  - Preview image (auto-generated or uploaded)

**API Endpoints:**
```
POST   /api/outfits
GET    /api/outfits
GET    /api/outfits/:id
PUT    /api/outfits/:id
DELETE /api/outfits/:id
PATCH  /api/outfits/:id/favorite
POST   /api/outfits/:id/items
DELETE /api/outfits/:id/items/:itemId
```

#### 3.2 Outfit Search & Filter
- [x] Search outfits by name
- [x] Filter by season
- [x] Filter by occasion
- [x] Filter by favorites
- [x] Sort by date created, name

**API Endpoints:**
```
GET    /api/outfits/search
```

---

### 4. Wardrobe Sharing & Collaboration

#### 4.1 Share Wardrobe
- [x] Share wardrobe with friend via email/username
- [x] Set permission levels:
  - VIEW_ONLY - Can only view items
  - SUGGEST - Can view + suggest outfits
  - FULL_ACCESS - Can view + edit items
- [x] View all shared wardrobes
- [x] Revoke access
- [x] Set expiration date for share
- [x] View who has access to wardrobe

**API Endpoints:**
```
POST   /api/wardrobes/:id/share
GET    /api/wardrobes/:id/shares
DELETE /api/wardrobes/:id/shares/:shareId
GET    /api/wardrobes/shared-with-me
```

#### 4.2 Collaborative Outfit Suggestions
- [x] Friend creates outfit suggestion from shared wardrobe
- [x] User receives notification
- [x] User can accept/save suggestion
- [x] Comment on suggestions

**API Endpoints:**
```
POST   /api/wardrobes/:id/suggestions
GET    /api/wardrobes/:id/suggestions
PUT    /api/suggestions/:id/accept
POST   /api/suggestions/:id/comments
```

---

### 5. Stylist Marketplace (Basic)

#### 5.1 Stylist Profile
- [x] Create stylist profile with:
  - Bio (200 chars)
  - Expertise tags (Bridal, Party, Streetwear, etc.)
  - Years of experience
  - Pricing per session
  - Portfolio images (3-5 images)
  - Languages
- [x] View stylist profile
- [x] Edit stylist profile
- [x] Toggle availability (ON/OFF)
- [x] Admin approval workflow
- [x] Verification badge (after approval)

**API Endpoints:**
```
POST   /api/stylists/profile
GET    /api/stylists/profile/me
PUT    /api/stylists/profile/me
PATCH  /api/stylists/profile/me/availability
GET    /api/stylists/:id
GET    /api/stylists (browse stylists)
```

#### 5.2 Styling Requests
- [x] User creates styling request with:
  - Occasion
  - Timeline (urgent, within week, flexible)
  - Preferred styles
  - Budget (optional)
  - Additional notes
- [x] Auto-share wardrobe with stylists
- [x] View request status
- [x] Cancel request (if not matched)
- [x] Edit request (before match)

**API Endpoints:**
```
POST   /api/styling/requests
GET    /api/styling/requests
GET    /api/styling/requests/:id
PUT    /api/styling/requests/:id
DELETE /api/styling/requests/:id
```

#### 5.3 Stylist Matching (Simple)
- [x] Notify stylists with matching expertise
- [x] Stylist views available requests
- [x] Stylist accepts request (first-come-first-serve)
- [x] System creates session
- [x] Auto-grant wardrobe access to stylist
- [x] Notify user of match

**API Endpoints:**
```
GET    /api/stylists/requests/available
POST   /api/styling/requests/:id/accept
POST   /api/styling/requests/:id/reject
```

---

### 6. Styling Sessions

#### 6.1 Session Management
- [x] Create session (automatic on request accept)
- [x] View active sessions
- [x] View session history
- [x] End session
- [x] Session details include:
  - User info
  - Stylist info
  - Duration
  - Status (ACTIVE | COMPLETED | CANCELLED)

**API Endpoints:**
```
GET    /api/sessions
GET    /api/sessions/:id
PATCH  /api/sessions/:id/end
GET    /api/sessions/:id/wardrobe
```

#### 6.2 In-Session Chat
- [x] Send text messages
- [x] Send images
- [x] Share outfit suggestions in chat
- [x] Real-time messaging (WebSocket)
- [x] Message history
- [x] Mark messages as read
- [x] Typing indicators

**API Endpoints:**
```
POST   /api/sessions/:id/messages
GET    /api/sessions/:id/messages
PATCH  /api/messages/:id/read
WebSocket: /ws/sessions/:id
```

---

### 7. Ratings & Reviews

#### 7.1 Post-Session Review
- [x] User rates stylist (1-5 stars)
- [x] User writes review text
- [x] One review per session
- [x] Reviews visible on stylist profile
- [x] Average rating calculation
- [x] Review moderation (flag inappropriate)

**API Endpoints:**
```
POST   /api/sessions/:id/review
GET    /api/stylists/:id/reviews
PATCH  /api/reviews/:id/flag
```

---

### 8. Payments (Basic)

#### 8.1 Free Sessions Tracking
- [x] Track free session count per user (3 free)
- [x] Decrement on session completion
- [x] Show remaining free sessions
- [x] Reset logic (optional: annually)

**API Endpoints:**
```
GET    /api/users/me/free-sessions
```

#### 8.2 Razorpay Integration
- [x] Create Razorpay order
- [x] Payment page redirect
- [x] Verify payment signature
- [x] Mark session as PAID
- [x] Store payment details
- [x] Payment history for user

**API Endpoints:**
```
POST   /api/payments/create-order
POST   /api/payments/verify
GET    /api/payments/history
```

#### 8.3 Stylist Earnings
- [x] Track stylist earnings per session
- [x] Platform commission (20%)
- [x] Stylist wallet balance
- [x] Earnings history
- [x] Withdraw to bank (minimum ₹500)
- [x] Withdrawal history

**API Endpoints:**
```
GET    /api/stylists/earnings
GET    /api/stylists/wallet
POST   /api/stylists/withdraw
GET    /api/stylists/withdrawals
```

---

### 9. Notifications

#### 9.1 Push Notifications
- [x] Styling request received (to stylists)
- [x] Stylist matched (to user)
- [x] New message in session
- [x] Session ended
- [x] Payment received
- [x] Review received
- [x] Wardrobe shared with you
- [x] Friend suggested outfit

**API Endpoints:**
```
POST   /api/notifications/register-device
GET    /api/notifications
PATCH  /api/notifications/:id/read
PATCH  /api/notifications/read-all
```

---

## 🔵 V1 FEATURES (Month 2-4)

### 1. Enhanced Stylist Matching (Rapido Model)

#### 1.1 Real-Time Matching
- [ ] Broadcast request to multiple stylists simultaneously
- [ ] Show "X stylists viewing" counter
- [ ] First to accept gets the session
- [ ] Request expires after 5 minutes
- [ ] Auto-retry with different stylists if expired
- [ ] Priority queue for premium users

**New API Endpoints:**
```
GET    /api/styling/requests/:id/viewers
POST   /api/styling/requests/:id/broadcast
```

#### 1.2 Stylist Availability Status
- [ ] Real-time availability tracking
- [ ] Auto-toggle OFF after 3 declined requests
- [ ] Snooze mode (temporarily unavailable)
- [ ] Schedule availability (set hours)

---

### 2. Advanced Stylist Features

#### 2.1 Specialization Tags
- [ ] Granular expertise categories:
  - Bridal & Wedding
  - Party & Events
  - Corporate & Professional
  - Casual & Streetwear
  - Ethnic & Traditional
  - Minimal & Sustainable
  - Vintage & Retro
- [ ] Smart request routing based on tags
- [ ] Tag-based search for users

#### 2.2 Stylist Portfolio Management
- [ ] Multiple portfolio albums
- [ ] Before/After transformations
- [ ] Client testimonials (with permission)
- [ ] Instagram integration
- [ ] Featured work showcase

**New API Endpoints:**
```
POST   /api/stylists/portfolio/albums
POST   /api/stylists/portfolio/transformations
GET    /api/stylists/:id/portfolio
```

---

### 3. In-App Audio Calling

#### 3.1 WebRTC Audio Calls
- [ ] Initiate audio call from chat
- [ ] Accept/reject call
- [ ] Call duration tracking
- [ ] Call quality monitoring
- [ ] Call recording (with consent) - Optional
- [ ] Call history

**New API Endpoints:**
```
POST   /api/sessions/:id/call/initiate
POST   /api/sessions/:id/call/accept
POST   /api/sessions/:id/call/end
GET    /api/sessions/:id/call/history
```

---

### 4. Premium Subscription

#### 4.1 Subscription Plans
- [ ] Free tier (3 sessions)
- [ ] Premium Monthly (₹999/month)
  - Unlimited styling sessions
  - Unlimited wardrobes
  - Priority stylist matching
  - Ad-free experience
  - Advanced analytics
  - Early AI feature access
- [ ] Premium Annual (₹9,999/year - 17% off)

#### 4.2 Subscription Management
- [ ] Subscribe via Razorpay
- [ ] Auto-renewal
- [ ] Cancel anytime
- [ ] Proration on upgrades
- [ ] Invoice generation

**New API Endpoints:**
```
POST   /api/subscriptions/create
GET    /api/subscriptions/plans
PATCH  /api/subscriptions/cancel
PATCH  /api/subscriptions/resume
GET    /api/subscriptions/invoices
```

---

### 5. Enhanced User Experience

#### 5.1 Wardrobe Analytics
- [ ] Cost per wear calculation
- [ ] Most worn items
- [ ] Least worn items (closet dead stock)
- [ ] Seasonal distribution chart
- [ ] Color palette analysis
- [ ] Category breakdown
- [ ] Wardrobe value estimation

**New API Endpoints:**
```
GET    /api/wardrobes/:id/analytics
GET    /api/wardrobes/:id/insights
```

#### 5.2 Outfit Calendar
- [ ] Plan outfits for week/month
- [ ] Drag-drop outfits to dates
- [ ] Event integration
- [ ] Reminders for planned outfits
- [ ] Weather-based suggestions

**New API Endpoints:**
```
GET    /api/outfits/calendar
POST   /api/outfits/calendar/schedule
PUT    /api/outfits/calendar/:date
DELETE /api/outfits/calendar/:date
```

#### 5.3 Packing Assistant
- [ ] Create trip
- [ ] Suggest outfits based on:
  - Destination weather
  - Trip duration
  - Planned activities
- [ ] Packing checklist
- [ ] Share trip plans with travel buddy

**New API Endpoints:**
```
POST   /api/trips
GET    /api/trips
GET    /api/trips/:id/suggestions
POST   /api/trips/:id/share
```

---

### 6. Enhanced Reviews & Ratings

#### 6.1 Stylist Leaderboard
- [ ] Top-rated stylists (weekly, monthly, all-time)
- [ ] Most booked stylists
- [ ] Rising stars
- [ ] Category-wise leaderboards

**New API Endpoints:**
```
GET    /api/stylists/leaderboard
GET    /api/stylists/leaderboard/:category
```

#### 6.2 Review Responses
- [ ] Stylists can respond to reviews
- [ ] Highlight helpful reviews
- [ ] Report fake reviews

---

## 🟢 V2 FEATURES (Month 4-9)

### 1. AI Features

#### 1.1 AI Auto-Tagging
- [ ] Detect item type on upload
- [ ] Detect color(s)
- [ ] Detect pattern (solid, striped, floral, etc.)
- [ ] Detect brand (if visible logo)
- [ ] Suggest category placement
- [ ] OCR for brand tags

**New API Endpoints:**
```
POST   /api/ai/analyze-image
POST   /api/items/:id/auto-tag
```

#### 1.2 AI Outfit Generator
- [ ] Generate outfit based on:
  - Occasion
  - Weather
  - Mood
  - Color preferences
- [ ] Multiple outfit options
- [ ] Explanation for each outfit
- [ ] Learn from user preferences

**New API Endpoints:**
```
POST   /api/ai/generate-outfit
GET    /api/ai/outfit-suggestions
```

#### 1.3 AI Wardrobe Analysis
- [ ] Identify wardrobe gaps
- [ ] Suggest purchases
- [ ] Color harmony analysis
- [ ] Style profile generation
- [ ] Sustainability score
- [ ] Duplicate detection

**New API Endpoints:**
```
GET    /api/ai/wardrobe-analysis/:wardrobeId
GET    /api/ai/recommendations
```

---

### 2. Social Features

#### 2.1 Public Outfit Boards
- [ ] Make outfits public
- [ ] Discover feed (explore trending looks)
- [ ] Like and save others' outfits
- [ ] Comment on outfits
- [ ] Follow users/stylists
- [ ] Share to Instagram/Pinterest

**New API Endpoints:**
```
PATCH  /api/outfits/:id/visibility
GET    /api/explore/feed
POST   /api/outfits/:id/like
POST   /api/outfits/:id/comments
POST   /api/users/:id/follow
GET    /api/users/following
```

#### 2.2 Fashion Challenges
- [ ] Weekly styling challenges
- [ ] User submissions
- [ ] Community voting
- [ ] Winner announcements
- [ ] Prizes & badges

**New API Endpoints:**
```
GET    /api/challenges
POST   /api/challenges/:id/submit
POST   /api/challenges/:id/vote
```

#### 2.3 Hashtags & Trends
- [ ] Add hashtags to outfits
- [ ] Trending hashtags
- [ ] Search by hashtag
- [ ] Discover similar styles

**New API Endpoints:**
```
GET    /api/hashtags/trending
GET    /api/outfits/hashtag/:tag
```

---

### 3. AR & Virtual Try-On

#### 3.1 Avatar Creation
- [ ] Create 3D avatar from photos
- [ ] Customize body measurements
- [ ] Skin tone, hair style options

#### 3.2 Virtual Try-On
- [ ] Try outfits on avatar
- [ ] Rotate 360° view
- [ ] Save virtual looks
- [ ] Share virtual looks

**New API Endpoints:**
```
POST   /api/avatar/create
GET    /api/avatar/me
POST   /api/avatar/try-on
```

---

### 4. Marketplace Expansion

#### 4.1 Group Styling
- [ ] Book stylist for group (2-5 friends)
- [ ] Collaborative session
- [ ] Split payment

#### 4.2 Subscription Packages
- [ ] Monthly styling packages
- [ ] Quarterly wardrobe refresh
- [ ] Personal shopper service

#### 4.3 Brand Partnerships
- [ ] Affiliate links for items
- [ ] Commission on purchases
- [ ] Brand collaborations
- [ ] Sponsored content

---

## 📊 FEATURE PRIORITY MATRIX

### High Priority (Must Have - MVP)
- ✅ Authentication & User Management
- ✅ Wardrobe CRUD
- ✅ Clothing Items Management
- ✅ Outfit Builder
- ✅ Basic Stylist Marketplace
- ✅ In-App Chat
- ✅ Payments & Free Sessions
- ✅ Reviews & Ratings

### Medium Priority (V1)
- 🔵 Enhanced Stylist Matching
- 🔵 Audio Calling
- 🔵 Premium Subscriptions
- 🔵 Wardrobe Analytics
- 🔵 Outfit Calendar

### Low Priority (V2 - Future)
- 🟢 AI Features
- 🟢 Social Features
- 🟢 AR Try-On
- 🟢 Brand Partnerships

---

## 🚀 API ENDPOINTS OVERVIEW

### Total API Endpoints (MVP)

| Module | Endpoints Count |
|--------|-----------------|
| Authentication | 8 |
| Users | 5 |
| Wardrobes | 7 |
| Categories | 5 |
| Clothing Items | 9 |
| Outfits | 10 |
| Wardrobe Sharing | 6 |
| Stylist Profile | 6 |
| Styling Requests | 7 |
| Styling Sessions | 5 |
| Messages | 4 |
| Reviews | 3 |
| Payments | 7 |
| Notifications | 4 |
| **TOTAL MVP** | **86 endpoints** |

### Additional Endpoints (V1)
- Subscriptions: 5
- Analytics: 3
- Calendar: 4
- Trips: 4
- **TOTAL V1**: **16 endpoints**

### Additional Endpoints (V2)
- AI Features: 5
- Social: 12
- Avatar/AR: 4
- **TOTAL V2**: **21 endpoints**

### **GRAND TOTAL: 123 API endpoints**

---

**Document Status:** Living Document
**Next Review Date:** 2025-12-13
**Owner:** Product & Engineering Teams
