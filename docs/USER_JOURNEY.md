# 👥 USER JOURNEYS – VYBE

**Document Version:** 2.0
**Last Updated:** 2025-11-13

---

## 📋 TABLE OF CONTENTS

1. [User Types](#user-types)
2. [Initial Setup & Onboarding](#1-initial-setup--onboarding)
3. [Wardrobe Management](#2-wardrobe-management)
4. [Outfit Creation & Library](#3-outfit-creation--library)
5. [Outfit Planner (Calendar)](#4-outfit-planner-calendar)
6. [Friends & Sharing](#5-friends--sharing)
7. [Stylist Session](#6-stylist-session)
8. [Navigation Summary](#navigation-summary)

---

## 🎭 USER TYPES

### 1. **General User**
- Primary goal: Organize wardrobe, create outfits, get styling help
- Can request styling sessions
- Can share wardrobe with friends/stylists
- Can collaborate on outfits
- Can upgrade to become a stylist anytime

### 2. **Stylist**
- Primary goal: Provide styling services and earn money
- Receives styling requests (instant notification)
- Can access client wardrobes (with permission)
- Creates outfit suggestions
- Builds portfolio and reputation through reviews
- **Can also use all general user features** (wardrobe, outfits, etc.)
- Can request styling from OTHER stylists

### 3. **Role Selection at Signup**
At signup, users choose:
- **"I want to organize my wardrobe"** → General User
- **"I'm a Stylist"** → Stylist (with instant onboarding)
- **"Both"** → Full access to everything

**Key Points:**
- General users can upgrade to stylist later
- Stylists have ALL user features + styling capabilities
- No admin approval needed - instant activation
- Quality controlled through user reviews and ratings

---

## 1️⃣ INITIAL SETUP & ONBOARDING

### General User Onboarding

```
1. Sign Up / Login
   ↓
2. Choose Role: "I want to organize my wardrobe"
   ↓
3. Onboarding Tutorial (3 steps)
   ↓
4. Step 1: Create First Wardrobe
   - Enter name: "Home"
   - Enter location: "Mumbai Apartment"
   - Set as active wardrobe ✓
   ↓
5. Step 2: Create Categories
   - Add categories: Tops, Bottoms, Dresses, Shoes, Accessories
   - Can add more later
   ↓
6. Step 3: Add First Items
   - Upload photo
   - Enter item details:
     • Name: "Blue Denim Jacket"
     • Category: Jackets
     • Tags: Casual, Blue, Denim
     • Color: Blue
     • Brand: Levi's (optional)
     • Season: All Season
     • Status: Available
   - Item saved ✓
   ↓
7. Tutorial Complete! → Go to Dashboard
```

### Stylist Onboarding

```
1. Sign Up / Login
   ↓
2. Choose Role: "I'm a Stylist"
   ↓
3. Create Stylist Profile
   - Upload profile photo
   - Bio (200 characters): "5 years experience in bridal styling"
   - Select expertise tags:
     ☑ Bridal & Wedding
     ☑ Traditional Indian
     ☑ Fusion
   - Set pricing: ₹299/session (default)
   - Upload portfolio (3-5 images)
   - Years of experience: 5
   - Languages: English, Hindi
   ↓
4. Submit Profile
   ↓
5. Profile Goes Live Instantly! ✓
   - Visible to all users
   - Can receive requests immediately
   - Toggle availability: ON
   ↓
6. Can also create wardrobe (optional)
   ↓
7. Go to Dashboard
```

---

## 2️⃣ WARDROBE MANAGEMENT

### Daily Wardrobe Operations

**From Dashboard → Select "Manage Wardrobe"**

#### A. View Current Wardrobe
```
View Wardrobe: "Home Mumbai"
├── Categories
│   ├── Tops (15 items)
│   ├── Bottoms (12 items)
│   ├── Dresses (8 items)
│   ├── Shoes (10 items)
│   └── Accessories (20 items)
└── Actions Available
```

#### B. Add New Item
```
1. Click "Add Item"
   ↓
2. Upload Photo (camera or gallery)
   ↓
3. Fill Details:
   - Name: "Red Floral Dress"
   - Category: Dresses
   - Tags: Summer, Party, Floral
   - Color: Red
   - Brand: Zara
   - Season: Summer
   - Purchase Date: 2024-01-15 (optional)
   - Price: ₹2999 (optional)
   - Status: Available
   ↓
4. Save Item ✓
   ↓
5. Item appears in wardrobe grid
```

#### C. Manage Item Status
```
Item Status Options:
├── Available (can be used in outfits)
├── In Laundry (temporarily unavailable)
├── In Repair (temporarily unavailable)
├── Donated (soft delete)
└── Sold (soft delete)

Update Status:
1. Select item
2. Click "Update Status"
3. Choose new status
4. Item automatically filtered from outfit builder if unavailable
```

#### D. Multiple Wardrobes
```
Scenario: User has clothes in different locations

Wardrobe 1: "Home - Mumbai"
├── Active: ✓
├── Items: 65
└── Categories: All

Wardrobe 2: "Parents House - Delhi"
├── Active: ✗
├── Items: 30
└── Categories: Seasonal wear

Wardrobe 3: "Storage - Winter Clothes"
├── Active: ✗
├── Items: 25
└── Categories: Winter wear only

Switch Active Wardrobe:
1. Click "Switch Wardrobe"
2. Select "Parents House - Delhi"
3. Now active ✓
4. Outfit builder will use this wardrobe
```

#### E. Browse & Search
```
Filter Items:
- By Category: Tops, Bottoms, etc.
- By Season: Summer, Winter, All Season
- By Color: Red, Blue, Black, etc.
- By Status: Available, In Laundry
- By Tags: Casual, Formal, Party

Search:
- By name: "denim"
- By brand: "Zara"
- By tags: "summer party"
```

---

## 3️⃣ OUTFIT CREATION & LIBRARY

### A. Create New Outfit

```
1. Dashboard → "Create Outfit"
   ↓
2. Using Active Wardrobe: "Home Mumbai"
   ↓
3. System automatically filters:
   ✓ Show: Available items only
   ✗ Hide: Items in laundry, in repair
   ↓
4. Browse by Category
   ↓
5. Select Items:
   ✓ Tops → Blue Shirt
   ✓ Bottoms → Black Jeans
   ✓ Shoes → White Sneakers
   ✓ Accessories → Silver Watch
   ↓
6. Preview Outfit (all items displayed together)
   ↓
7. Happy with look?
   - No → Go back and change items
   - Yes → Continue to save
   ↓
8. Add Outfit Details:
   - Name: "Casual Friday"
   - Category: Casual
   - Tags: Work, Comfortable, Friday
   - Season: All Season
   - Occasion: Office
   - Mood: Relaxed
   ↓
9. Save to Library ✓
   ↓
10. Success: "Casual Friday" saved to Outfit Library
```

### B. Outfit Library Operations

```
Dashboard → "Outfit Library"

View All Outfits:
├── Casual (12 outfits)
├── Formal (8 outfits)
├── Party (15 outfits)
├── Work (10 outfits)
└── Date Night (6 outfits)

For Each Outfit:
├── View Details
├── Edit (change items or metadata)
├── Delete
├── Mark as Favorite ⭐
├── Share with Friend
├── Add to Calendar
└── Duplicate (create similar)

Browse Options:
├── Filter by Category
├── Filter by Season
├── Filter by Tags
├── Search by Name
├── Sort by: Date Created, Favorites, Most Worn
└── Show only: Favorites
```

### C. Outfit from Library to Calendar

```
1. In Outfit Library
   ↓
2. Select outfit: "Casual Friday"
   ↓
3. Click "Add to Calendar"
   ↓
4. Opens Outfit Planner
   ↓
5. Select date to wear
```

---

## 4️⃣ OUTFIT PLANNER (CALENDAR)

### Calendar-Based Outfit Planning

**Dashboard → "Outfit Planner"**

#### A. View Modes

```
Calendar View Options:
├── Day View: Today's outfit
├── Week View: 7-day plan
└── Month View: Monthly overview

Weekly View Example:
┌─────────────────────────────────┐
│ Week of Nov 11-17               │
├─────────────────────────────────┤
│ Mon 11: Work Formal             │
│ Tue 12: Casual Friday ✓         │
│ Wed 13: (empty)                 │
│ Thu 14: Party Dress             │
│ Fri 15: Date Night Look         │
│ Sat 16: (empty)                 │
│ Sun 17: Brunch Outfit           │
└─────────────────────────────────┘
```

#### B. Add Outfit to Date

```
Method 1: From Library
1. Click date: Friday, Nov 15
2. Click "Add from Library"
3. Browse outfits
4. Select: "Casual Friday"
5. Add optional notes: "Client meeting at 2pm"
6. Confirm ✓
7. Outfit scheduled for Nov 15

Method 2: Create New
1. Click date: Monday, Nov 18
2. Click "Create New Outfit"
3. Opens Outfit Builder
4. Create outfit
5. Auto-assigns to selected date
6. Saved to library & calendar ✓
```

#### C. Plan Ahead

```
Use Case: Planning for a Trip

1. Trip to Goa: Dec 20-25 (6 days)
   ↓
2. Open Outfit Planner → Month View
   ↓
3. For each day:
   - Dec 20: Beach Day Outfit
   - Dec 21: Brunch Look
   - Dec 22: Party Night
   - Dec 23: Casual Exploring
   - Dec 24: Dinner Date
   - Dec 25: Travel Home Comfort
   ↓
4. All outfits planned ✓
   ↓
5. Can share plan with travel buddy
   ↓
6. Packing list auto-generated (all items needed)
```

#### D. Track Usage

```
After wearing an outfit:
1. Mark as "Worn" ✓
   ↓
2. System tracks:
   - Last worn date
   - Total times worn
   - Cost per wear (if price added)
   ↓
3. Analytics:
   - Most worn outfits
   - Least worn outfits
   - Items never used (closet dead stock)
```

---

## 5️⃣ FRIENDS & SHARING

### A. Friend Management

```
Dashboard → "Friends & Sharing"

Friend List:
├── Sarah Khan (Connected)
├── John Doe (Connected)
├── Priya Sharma (Pending - sent)
└── Rahul Verma (Request received)

Actions:
├── Add New Friend
│   ├── Enter email or username
│   ├── Send friend request
│   └── Wait for acceptance
│
├── View Pending Requests
│   ├── Accept → Friend added ✓
│   └── Decline → Request removed
│
└── Remove Friend
    └── Confirm removal
```

### B. Share Wardrobe with Friend

```
1. Select "Share Wardrobe"
   ↓
2. Pick Friend: Sarah Khan
   ↓
3. Pick Wardrobe: "Home Mumbai"
   ↓
4. Choose Permission Level:

   Option A: View Only
   ├── Sarah can: View items
   └── Sarah cannot: Edit items, suggest outfits

   Option B: Can Suggest (Recommended)
   ├── Sarah can: View items, create outfit suggestions
   └── Sarah cannot: Edit items

   Option C: Full Access
   ├── Sarah can: View, edit items, suggest outfits
   └── Use for: Close friends, partners
   ↓
5. Set Expiration (Optional):
   - No expiration
   - 1 week
   - 1 month
   - Custom date
   ↓
6. Share ✓
   ↓
7. Sarah receives notification:
   "Your friend shared their wardrobe with you!"
```

### C. Share Outfit Library

```
1. Select "Share Outfit Library"
   ↓
2. Pick Friend: John Doe
   ↓
3. John can now:
   - View all your saved outfits
   - Get inspiration
   - Like outfits
   - Comment on outfits
   ↓
4. Library shared ✓
```

### D. Share Outfit Planner

```
Use Case: Planning coordinated looks for wedding

1. Select "Share Planner"
   ↓
2. Pick Friend: Sarah (going to same wedding)
   ↓
3. Now Both Can:
   - View each other's planned outfits
   - Suggest changes
   - Coordinate colors
   - Plan complementary looks
   ↓
4. Collaborative planning ✓
```

### E. Friend Suggestions

```
Sarah suggests an outfit for you:

Notification: "Sarah suggested an outfit: Beach Vibes"

View Suggestion:
├── Outfit Preview (items from your wardrobe)
├── Sarah's Note: "Perfect for Goa trip!"
├── Items Used:
│   ├── White Tank Top
│   ├── Blue Shorts
│   ├── Sandals
│   └── Sunglasses
└── Actions:
    ├── Save to Library ✓
    ├── Add to Calendar
    ├── Edit & Save
    └── Ignore

If you save:
1. Outfit added to your library
2. Sarah receives notification: "Your friend loved your suggestion!"
3. You can thank Sarah via message
```

---

## 6️⃣ STYLIST SESSION

### Complete Styling Session Flow

#### Step 1: Create Request

```
Dashboard → "Need Styling Help"

Fill Request Form:
┌─────────────────────────────────┐
│ What do you need help with?     │
├─────────────────────────────────┤
│ Occasion:                       │
│ ○ Wedding                       │
│ ○ Party                         │
│ ○ Work/Office                   │
│ ○ Date                          │
│ ○ Casual Day Out                │
│ ○ Other: ___________            │
│                                 │
│ Timeline:                       │
│ ○ Today (urgent)                │
│ ● In 2 days                     │
│ ○ This week                     │
│ ○ Flexible                      │
│                                 │
│ Preferred Style:                │
│ ☑ Traditional Indian            │
│ ☑ Fusion                        │
│ ☐ Western Formal                │
│ ☐ Casual/Streetwear             │
│ ☐ Minimalist                    │
│                                 │
│ Budget (optional): ₹1500        │
│                                 │
│ Additional Notes:               │
│ "It's my cousin's wedding.      │
│  Want something elegant but     │
│  not too heavy."                │
│                                 │
│ [Submit Request]                │
└─────────────────────────────────┘
```

#### Step 2: Matching Process

```
Request Submitted ✓
   ↓
System Actions:
1. Auto-share Active Wardrobe with matched stylist
2. Find stylists with matching expertise:
   - Traditional Indian ✓
   - Fusion ✓
   - Available now ✓
   ↓
3. Send push notifications to 5-10 stylists:

   📱 Notification to Stylists:
   "New request: Wedding outfit - Traditional Indian"
   "Timeline: 2 days | Budget: ₹1500"
   "Your earnings: ₹239"
   [View Request] [Accept]
   ↓
4. User sees:
   "Matching in progress..."
   "5 stylists notified"
   "Estimated wait: 2-5 minutes"
   ↓
5. First stylist to accept gets the session
```

#### Step 3: Stylist Accepts

```
✓ Matched with Stylist!

Stylist Profile:
┌─────────────────────────────────┐
│ 👤 Priya Sharma                 │
│ ⭐ 4.8 (120 reviews)            │
│ 💼 Expertise:                   │
│    • Bridal & Wedding           │
│    • Traditional Indian         │
│    • Fusion Wear                │
│ 📊 52 sessions completed        │
│ 🎓 5 years experience           │
│ 📸 View Portfolio →             │
│                                 │
│ [Start Session]                 │
└─────────────────────────────────┘

Click "Start Session" → Chat Opens
```

#### Step 4: Chat Session

```
Session Started - Chat Interface:

[Priya Sharma - Online 🟢]

Priya: Hi! I've reviewed your wardrobe and I
       have some great ideas for the wedding! 😊

You:   Hi Priya! That's great! What do you
       suggest?

Priya: I found 3 options that would work
       perfectly. Let me share them with you!

[Priya sends Outfit 1]
┌─────────────────────────────────┐
│ Outfit 1: Classic Traditional  │
│ • Red embroidered kurta         │
│ • Gold dupatta                  │
│ • Gold juttis                   │
│ • Statement earrings            │
│                                 │
│ [View Full]  [Save]  [❤️]       │
└─────────────────────────────────┘

[Priya sends Outfit 2]
┌─────────────────────────────────┐
│ Outfit 2: Modern Fusion         │
│ • Burgundy crop top             │
│ • Printed palazzo               │
│ • Heels                         │
│ • Contemporary jewelry          │
│                                 │
│ [View Full]  [Save]  [❤️]       │
└─────────────────────────────────┘

You:   I love outfit 2! Can we talk more
       about accessories?

Priya: Absolutely! Want to hop on a quick
       audio call?

[🎙️ Audio Call Request]
[Accept]  [Decline]
```

#### Step 5: Audio Call (Optional)

```
You accept the call

🎙️ Audio Call In Progress
├── Duration: 8:24
├── Priya Sharma
└── [End Call]

Discussion Topics:
• Accessory recommendations
• Makeup suggestions (neutral vs bold)
• Hair styling ideas
• Shoe comfort vs style
• Backup outfit ideas
• Shopping recommendations if needed

Call ends after 12 minutes
```

#### Step 6: Final Suggestions

```
After call:

Priya: Based on our call, I've updated
       outfit 2 with accessory recommendations:

[Final Outfit - Saved]
┌─────────────────────────────────┐
│ Wedding Look - Fusion Style     │
│                                 │
│ Main Outfit:                    │
│ • Burgundy crop top             │
│ • Printed palazzo               │
│ • Gold block heels              │
│                                 │
│ Accessories:                    │
│ • Statement jhumkas             │
│ • Layered necklace              │
│ • Clutch                        │
│                                 │
│ Makeup: Soft glam, pink lip     │
│ Hair: Low bun with flowers      │
│                                 │
│ ✓ Saved to Your Library         │
└─────────────────────────────────┘

Priya: You're all set! Have an amazing
       time at the wedding! 💃

You:   Thank you so much, Priya! This
       is perfect! 🙏
```

#### Step 7: End Session

```
You: I think we're good! Thanks again!
Priya: My pleasure! [End Session]

Session Ended
Duration: 18 minutes
```

#### Step 8: Rate & Review

```
How was your session with Priya?

Rate Your Experience:
⭐⭐⭐⭐⭐ (5 stars)

Write a Review:
┌─────────────────────────────────┐
│ "Super helpful! Priya understood│
│  exactly what I wanted. The     │
│  fusion outfit is perfect and   │
│  she gave great accessory tips. │
│  Very professional!"            │
└─────────────────────────────────┘

[Submit Review]
```

#### Step 9: Payment

```
Session Summary:
├── Stylist: Priya Sharma
├── Duration: 18 minutes
├── Outfits Saved: 2
├── Rating Given: 5 ⭐
└── Payment Status: Checking...

Free Sessions Tracking:
You've used: 2/3 free sessions
This session: FREE ✓

Remaining: 1 free session left

┌─────────────────────────────────┐
│ Session Complete! ✓             │
│                                 │
│ You've received:                │
│ ✓ 2 outfit suggestions          │
│ ✓ Styling advice                │
│ ✓ Accessory recommendations     │
│                                 │
│ This was a FREE session         │
│ (1 free session remaining)      │
│                                 │
│ [Back to Dashboard]             │
└─────────────────────────────────┘

---

4th Session (After Free Sessions):
┌─────────────────────────────────┐
│ Payment Required                │
│                                 │
│ Session Fee: ₹299               │
│ Platform Fee: Free for users    │
│ Total: ₹299                     │
│                                 │
│ [Pay with Razorpay]             │
└─────────────────────────────────┘

Payment Methods:
├── UPI
├── Credit/Debit Card
├── Net Banking
└── Wallets

Payment Success ✓
Receipt sent to email
```

#### Step 10: Post-Session

```
After completing session:

Your Saved Outfits:
├── Wedding Look - Fusion Style (from Priya) ✓
├── Classic Traditional (from Priya) ✓
└── Available in Outfit Library

Priya's Profile Updated:
├── Total Sessions: 52 → 53
├── Average Rating: 4.8 → 4.82 ⭐
└── New Review Added

You can:
├── View saved outfits anytime
├── Add to Outfit Planner
├── Share with friends
├── Rebook Priya for future styling
└── Browse other stylists
```

---

## 📱 NAVIGATION SUMMARY

### Main Dashboard

```
VYBE Home
├── 👤 Profile & Settings
│
├── 1️⃣ Manage Wardrobe
│   ├── View Active Wardrobe
│   ├── Add/Edit Items
│   ├── Switch Wardrobe
│   ├── Manage Categories
│   └── Update Item Status
│
├── 2️⃣ Create Outfit
│   └── Opens Outfit Builder
│
├── 3️⃣ Outfit Library
│   ├── Browse Outfits
│   ├── Filter by Category
│   ├── Search Outfits
│   └── Manage Saved Outfits
│
├── 4️⃣ Outfit Planner
│   ├── Calendar View
│   ├── Schedule Outfits
│   ├── View Weekly Plan
│   └── Track Usage
│
├── 5️⃣ Friends & Sharing
│   ├── Manage Friends
│   ├── Share Wardrobe
│   ├── Share Library
│   ├── Share Planner
│   └── View Suggestions
│
└── 6️⃣ Get Styling Help
    ├── Browse Stylists
    ├── Create Request
    ├── Active Sessions
    └── Session History
```

### User Flow Summary

**Core Loop:**
```
Dashboard
  → Choose Action (1-6)
  → Complete Task
  → Back to Dashboard
  → Repeat
```

**Key Flows:**
1. **Wardrobe:** Add items → Organize → Manage status
2. **Outfits:** Create → Save to library → Use later
3. **Planner:** Schedule outfits → Plan ahead → Track usage
4. **Friends:** Connect → Share → Collaborate
5. **Stylist:** Request → Match → Session → Save suggestions

---

**Document Status:** Living Document
**Next Review Date:** 2025-12-13
**Owner:** Product Team
