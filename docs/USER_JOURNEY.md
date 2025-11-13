# 👥 USER JOURNEYS – VYBE

**Document Version:** 1.0
**Last Updated:** 2025-11-13

---

## 📋 TABLE OF CONTENTS

1. [User Types](#user-types)
2. [General User Journey](#general-user-journey)
3. [Stylist User Journey](#stylist-user-journey)
4. [Hybrid User Journey](#hybrid-user-journey)
5. [Collaboration Flows](#collaboration-flows)
6. [Payment Flows](#payment-flows)

---

## 🎭 USER TYPES

### 1. **General User**
- Primary goal: Organize wardrobe, create outfits, get styling help
- Can request styling sessions
- Can share wardrobe with friends/stylists
- Can collaborate on outfits
- Uses wardrobe management features

### 2. **Stylist**
- Primary goal: Provide styling services and earn money
- Receives styling requests
- Can access client wardrobes (with permission)
- Creates outfit suggestions
- Builds portfolio and reputation
- **Note:** Stylists can ALSO be General Users (use all wardrobe features)

### 3. **Hybrid User** (Stylist + General User)
- Can switch between both roles
- As General User: Manage personal wardrobe, request styling
- As Stylist: Accept requests, provide styling services
- Can request styling from OTHER stylists
- Full access to all platform features

---

## 👤 GENERAL USER JOURNEY

### Phase 1: Onboarding & Setup

#### Step 1: Sign Up
```
User opens app
  → Sees welcome screen with value proposition
  → Chooses sign up method:
     - Email/Password
     - Google
     - Apple
  → Enters basic info (name, email)
  → Verifies email (if email signup)
  → Chooses user type: "I want to organize my wardrobe" (General User)
```

**User State:** Authenticated, role = USER

#### Step 2: First Wardrobe Creation
```
User sees onboarding tutorial
  → "Let's create your first wardrobe"
  → Creates wardrobe:
     - Name: "My Main Wardrobe"
     - Location: "Home" (optional)
     - Description: "Daily wear clothes"
  → Sees empty wardrobe dashboard
```

**User State:** Has 1 empty wardrobe

#### Step 3: Adding First Items
```
User clicks "Add Item"
  → Takes photo or uploads from gallery
  → AI suggests tags (Future: color, type detected)
  → User fills details:
     - Item name: "Blue Denim Jacket"
     - Category: Creates "Jackets" category
     - Color: Blue
     - Season: All Season
     - Brand: Levi's (optional)
     - Notes: "Bought in 2023" (optional)
  → Saves item
  → Item appears in wardrobe grid
  → Tutorial: "Great! Add 5 more items to create your first outfit"
```

**User State:** Has wardrobe with items

---

### Phase 2: Core Usage

#### Use Case 1: Building an Outfit

```
User navigates to "Outfits" tab
  → Clicks "Create Outfit"
  → Sees item selector (all wardrobe items)
  → Filters by category: "Tops" → Selects blue shirt
  → Adds "Pants" → Selects black jeans
  → Adds "Shoes" → Selects white sneakers
  → Adds "Accessories" → Selects watch
  → Sees outfit preview (items displayed together)
  → Fills outfit details:
     - Name: "Casual Friday Look"
     - Season: All Season
     - Occasion: Work
     - Mood: Casual, Comfortable
  → Saves outfit
  → Outfit appears in "My Outfits" gallery
```

**Result:** Saved outfit, can reuse anytime

#### Use Case 2: Planning for an Event

```
User has wedding to attend in 2 days
  → Opens app
  → Checks "Outfits" → No suitable outfit saved
  → Options:
     A. Create outfit from existing wardrobe
     B. Request stylist help
  → User chooses B: "Get Styling Help"
```

*Continues to Requesting Styling Help flow...*

---

### Phase 3: Requesting Styling Help

#### Step 1: Create Styling Request
```
User clicks "Get Styling Help"
  → Fills request form:
     ┌─────────────────────────────────────┐
     │ What do you need help with?         │
     │ Occasion: Wedding                   │
     │ When: This Saturday (2 days)        │
     │ Preferred style:                    │
     │   ☑ Traditional Indian              │
     │   ☐ Western Formal                  │
     │   ☐ Fusion                          │
     │ Budget (optional): ₹1500            │
     │ Additional notes:                   │
     │ "Need outfit for cousin's wedding"  │
     └─────────────────────────────────────┘
  → Shares wardrobe with stylists (auto-selected)
  → Submits request
```

**User State:** Request created, status = PENDING

#### Step 2: Waiting for Stylist Match
```
User sees loading screen:
  "Finding the perfect stylist for you..."
  → (Behind the scenes: Push notification sent to stylists)
  → Estimated wait: 2-5 minutes
  → Shows:
     - Request details
     - "5 stylists notified"
     - Option to cancel request
```

**System:** Notifies stylists with matching expertise tags

#### Step 3: Stylist Accepts Request
```
Notification: "Priya (4.8⭐) accepted your request!"
  → User sees stylist profile:
     - Name: Priya Sharma
     - Expertise: Bridal, Indian Wear, Fusion
     - Experience: 5 years
     - Rating: 4.8 ⭐ (120 reviews)
     - Portfolio: [3 outfit images]
  → Session starts automatically
  → Chat opens
```

**User State:** In active styling session

#### Step 4: Styling Session
```
User receives message from Priya:
  "Hi! I've reviewed your wardrobe. I have 3 outfit ideas for the wedding."

Chat interface shows:
  ┌─────────────────────────────────┐
  │ Priya: [Outfit 1 preview]       │
  │ "Traditional look with your     │
  │  red kurta + gold dupatta"      │
  │                                 │
  │ User: "Love it! Do you have     │
  │       something more modern?"   │
  │                                 │
  │ Priya: [Outfit 2 preview]       │
  │ "Fusion look - your burgundy    │
  │  crop top + skirt combo"        │
  │                                 │
  │ Priya: "Want to hop on a quick  │
  │        call to discuss?"        │
  │                                 │
  │ [Audio Call Button]             │
  └─────────────────────────────────┘

User clicks call → Audio call starts (5 min discussion)

After call:
  Priya sends final outfit suggestion
  → Saves outfit to user's wardrobe
  → Session ends
```

**User State:** Session complete, outfit saved

#### Step 5: Post-Session
```
User sees:
  "How was your session with Priya?"

Rating screen:
  ┌─────────────────────────────────┐
  │ Rate your experience:            │
  │ ⭐⭐⭐⭐⭐ (5 stars selected)     │
  │                                  │
  │ Write a review:                  │
  │ "Super helpful! Loved the fusion │
  │  outfit idea. Very professional."│
  │                                  │
  │ [Submit Review]                  │
  └─────────────────────────────────┘

Payment screen:
  ┌─────────────────────────────────┐
  │ Session Summary                  │
  │ Stylist: Priya Sharma           │
  │ Duration: 18 minutes            │
  │                                  │
  │ This was your 2nd free session! │
  │ (1 more free session remaining) │
  │                                  │
  │ [Continue]                       │
  └─────────────────────────────────┘

After 3 free sessions → User pays ₹299/session
```

**User State:** Session complete, review submitted

---

### Phase 4: Collaboration with Friends

#### Use Case: Planning Trip Outfits with Friend

```
User going on Goa trip with best friend
  → Wants to coordinate outfits
  → Opens wardrobe
  → Clicks "Share" icon
  → Enters friend's email or phone
  → Sets permission: "Can suggest outfits"
  → Sends invite

Friend receives notification:
  "Sarah shared her wardrobe with you!"
  → Opens shared wardrobe
  → Browses Sarah's clothes
  → Creates outfit suggestion:
     - Selects items from Sarah's wardrobe
     - Saves as "Beach Day Look"
     - Adds note: "Perfect for our beach day!"

Sarah receives notification:
  "Priya suggested an outfit: Beach Day Look"
  → Reviews suggestion
  → Saves to her outfits
  → Replies: "Love it! 💙"
```

---

## 👩‍🎨 STYLIST USER JOURNEY

### Phase 1: Onboarding as Stylist

#### Step 1: Sign Up as Stylist
```
User opens app
  → Chooses sign up
  → Selects: "I want to provide styling services" (Stylist)
  → Enters details:
     - Name: Priya Sharma
     - Email/Phone
     - Verification
```

**User State:** Authenticated, role = STYLIST

#### Step 2: Create Stylist Profile
```
Stylist Profile Setup:
  ┌─────────────────────────────────────┐
  │ Build Your Stylist Profile          │
  │                                     │
  │ Profile Photo: [Upload]             │
  │ Bio: (Max 200 chars)                │
  │ "5 years experience in bridal       │
  │  and Indian traditional styling"    │
  │                                     │
  │ Expertise Tags: (Select all)        │
  │  ☑ Bridal                           │
  │  ☑ Indian Traditional               │
  │  ☑ Fusion                           │
  │  ☐ Western Formal                   │
  │  ☐ Streetwear                       │
  │  ☐ Minimalist                       │
  │                                     │
  │ Pricing per session: ₹299           │
  │ (Platform fee: 20%)                 │
  │                                     │
  │ Portfolio (Add 3-5 images):         │
  │ [Upload outfit photos]              │
  │                                     │
  │ Years of Experience: 5              │
  │                                     │
  │ Languages: English, Hindi           │
  │                                     │
  │ [Submit for Review]                 │
  └─────────────────────────────────────┘

Admin reviews profile (24-48 hours)
  → Profile approved
  → Stylist can now receive requests
```

**User State:** Active stylist profile

---

### Phase 2: Receiving & Accepting Requests

#### Step 1: Receive Styling Request Notification
```
Push Notification:
  "New styling request nearby! 🔔"
  "Wedding outfit needed - Traditional Indian"
  [View Request]

Stylist opens app → Sees request card:
  ┌─────────────────────────────────────┐
  │ NEW REQUEST                         │
  │                                     │
  │ User: Sarah K.                      │
  │ Occasion: Wedding                   │
  │ Timeline: In 2 days                 │
  │ Style: Traditional Indian           │
  │ Budget: ₹1500                       │
  │                                     │
  │ Your earnings: ₹239 (after fees)    │
  │                                     │
  │ 2 other stylists viewing            │
  │                                     │
  │ [Accept] [Decline]                  │
  │                                     │
  │ Expires in: 4:32 minutes            │
  └─────────────────────────────────────┘

Stylist decides:
  → Checks expertise match ✓
  → Checks timeline ✓
  → Clicks [Accept]
```

**System:** First stylist to accept gets the session

#### Step 2: Request Accepted
```
Success screen:
  "You got the request! 🎉"

Session details:
  ┌─────────────────────────────────────┐
  │ SESSION ACTIVE                      │
  │                                     │
  │ Client: Sarah K.                    │
  │ Occasion: Wedding (2 days away)     │
  │ Style: Traditional Indian           │
  │                                     │
  │ Wardrobe Access: ✓ Granted          │
  │ (85 items available)                │
  │                                     │
  │ [View Wardrobe] [Start Chat]       │
  └─────────────────────────────────────┘
```

**User State:** In active session with client

---

### Phase 3: Conducting Styling Session

#### Step 1: Review Client Wardrobe
```
Stylist clicks "View Wardrobe"
  → Sees all client's items organized by category
  → Filters:
     - Season: All
     - Color: Red, Gold, Burgundy (wedding colors)
     - Category: Traditional wear

Identifies potential items:
  - Red embroidered kurta
  - Gold dupatta
  - Burgundy crop top
  - Printed palazzo pants
  - Traditional jewelry
```

#### Step 2: Create Outfit Suggestions
```
Stylist uses outfit builder:
  → Creates Outfit 1: "Classic Traditional"
     - Red kurta + Gold dupatta + Juttis
  → Creates Outfit 2: "Modern Fusion"
     - Burgundy crop top + Printed palazzo + Statement earrings
  → Creates Outfit 3: "Elegant Contemporary"
     - Silk saree + Blouse + Clutch

Saves all outfits
```

#### Step 3: Chat with Client
```
Chat interface:
  Priya: "Hi Sarah! I've reviewed your wardrobe and
         created 3 outfit options for the wedding 🎊"
  Priya: [Sends Outfit 1 preview]
  Priya: [Sends Outfit 2 preview]
  Priya: [Sends Outfit 3 preview]

  Sarah: "Love these! Tell me more about outfit 2?"

  Priya: "Great choice! The burgundy crop top pairs
         beautifully with the printed palazzo. Very
         contemporary yet traditional enough for a wedding."

  Sarah: "Can we discuss on call?"

  Priya: [Initiates Audio Call]
  → 8-minute call discussing styling, accessories, makeup tips

  Priya: "I've saved the final outfit to your wardrobe.
         You're all set! Have a wonderful time 💃"
```

#### Step 4: End Session
```
Stylist clicks "End Session"
  → Session marked complete
  → Earnings updated: ₹239 added to wallet
  → Waits for client review
```

**User State:** Session complete, awaiting review

---

### Phase 4: Building Reputation

#### Step 1: Receiving Reviews
```
Client submits review:
  ⭐⭐⭐⭐⭐ 5 stars
  "Super helpful! Loved the fusion outfit idea."

Stylist profile updated:
  - Total sessions: 45 → 46
  - Average rating: 4.7 → 4.75 ⭐
  - Reviews: 38 → 39
```

#### Step 2: Managing Availability
```
Stylist dashboard shows:
  ┌─────────────────────────────────────┐
  │ DASHBOARD                           │
  │                                     │
  │ Status: 🟢 Available                │
  │ [Toggle Availability]               │
  │                                     │
  │ Today's Stats:                      │
  │ - Sessions: 3                       │
  │ - Earnings: ₹717                    │
  │ - Avg Rating: 4.9 ⭐                │
  │                                     │
  │ Pending Requests: 2                 │
  │ [View Requests]                     │
  │                                     │
  │ Wallet Balance: ₹12,450             │
  │ [Withdraw to Bank]                  │
  └─────────────────────────────────────┘

Stylist can:
  - Toggle availability (ON/OFF)
  - View request history
  - See earnings analytics
  - Withdraw money to bank
```

---

## 🔄 HYBRID USER JOURNEY

### Use Case: User who is BOTH General User AND Stylist

#### Scenario: Meera's Day

**Morning - As General User:**
```
Meera opens app (default: General User mode)
  → Checks her wardrobe
  → Creates outfit for client meeting today
  → Saves: "Corporate Chic Look"
```

**Afternoon - As Stylist:**
```
Meera receives styling request notification
  → Switches to Stylist mode (toggle in app)
  → Reviews request: "Party outfit needed"
  → Accepts request
  → Conducts 20-min styling session
  → Earns ₹239
```

**Evening - As General User Requesting Help:**
```
Meera has date night tomorrow
  → Switches back to General User mode
  → Clicks "Get Styling Help"
  → Creates request: "Date night outfit"

Notification sent to OTHER stylists (not Meera)
  → Another stylist (Priya) accepts
  → Meera receives styling help for her date
  → Pays ₹299 (her 4th session, free sessions exhausted)
```

**Key Points:**
- ✅ Can switch between modes seamlessly
- ✅ Can use wardrobe features while being a stylist
- ✅ Cannot accept own styling requests (conflict prevention)
- ✅ Separate wallets: Earnings wallet + Payment wallet

---

## 🤝 COLLABORATION FLOWS

### Flow 1: Friend Collaboration

```
User A (Sarah) → Shares wardrobe with Friend (Priya)
  ↓
Friend (Priya) → Views wardrobe, suggests outfit
  ↓
User A (Sarah) → Reviews suggestion, saves outfit
  ↓
Both → Chat about outfit, plan coordinated looks
```

### Flow 2: Stylist Access During Session

```
User → Requests styling
  ↓
Stylist → Accepts request
  ↓
System → Auto-grants temporary wardrobe access (VIEW_ONLY)
  ↓
Stylist → Creates outfit suggestions (SUGGEST permission)
  ↓
Session ends → Access remains until user revokes
```

---

## 💳 PAYMENT FLOWS

### Flow 1: First-Time User (Free Sessions)

```
Session 1: FREE ✓
Session 2: FREE ✓
Session 3: FREE ✓
Session 4: ₹299 (Razorpay payment)
Session 5+: ₹299 each OR Subscribe to Premium
```

### Flow 2: Premium Subscription

```
User clicks "Go Premium"
  → Plan options:
     - Monthly: ₹999/month
       (Unlimited sessions, unlimited wardrobes, priority matching)
     - Annual: ₹9,999/year (Save 17%)
  → Razorpay checkout
  → Subscription active
  → All sessions now FREE
```

### Flow 3: Stylist Earnings

```
User pays ₹299 for session
  ↓
Platform fee (20%): ₹60
  ↓
Stylist receives: ₹239
  ↓
Added to stylist wallet
  ↓
Stylist withdraws to bank (min ₹500)
```

---

## 📊 USER JOURNEY SUMMARY

### General User Path
```
Sign Up → Create Wardrobe → Add Items → Create Outfits → Request Styling → Rate Session → Repeat
```

### Stylist Path
```
Sign Up → Create Profile → Get Approved → Receive Requests → Accept → Style Client → Earn Money → Build Reputation
```

### Hybrid User Path
```
Sign Up → Enable Both Modes → Use Wardrobe + Provide Styling → Switch Modes as Needed
```

---

**Document Status:** Living Document
**Next Review Date:** 2025-12-13
**Owner:** Product Team
