# 🗄️ DATABASE SCHEMA DOCUMENTATION

**Document Version:** 1.1
**Last Updated:** 2025-11-13
**Database:** PostgreSQL (via Supabase)
**ORM:** Prisma

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Core Entities](#core-entities)
3. [Enumerations](#enumerations)
4. [Relationships & Diagrams](#relationships--diagrams)
5. [Indexes & Performance](#indexes--performance)
6. [Data Integrity Rules](#data-integrity-rules)
7. [Migration Strategy](#migration-strategy)
8. [Future Features (V2+)](#future-features-v2)

---

## 1️⃣ OVERVIEW

The VYBE database schema is designed to support a comprehensive fashion management and stylist marketplace platform. It consists of **21 models** organized into 5 functional domains:

### Domain Breakdown

| Domain | Models | Purpose |
|--------|--------|---------|
| **User Management** | User, StylistProfile, FCMToken | Authentication, profiles, notifications |
| **Wardrobe System** | Wardrobe, Category, ClothingItem, ClothingImage, WardrobeShare | Digital wardrobe organization |
| **Outfit Management** | Outfit, OutfitItem, OutfitCalendarEntry, OutfitSuggestion, OutfitShare | Outfit creation, planning & sharing |
| **Stylist Marketplace** | StylingRequest, StylingSession, Message, Review | On-demand styling services |
| **Payments** | Payment, Transaction, Withdrawal, Notification | Financial transactions |

---

## 2️⃣ CORE ENTITIES

### 👤 User Management Domain

#### **User**
The central entity representing both general users and stylists.

**Key Fields:**
- `id` (UUID) - Primary key
- `email` (String, Unique) - Login identifier
- `password` (String, Optional) - Hashed password (null for OAuth users)
- `name` (String) - Display name
- `role` (UserRole) - USER or STYLIST
- `googleId`, `appleId` (String, Optional) - OAuth identifiers
- `freeSessions` (Int) - Remaining free styling sessions (default: 3)

**Authentication Features:**
- Email/password login
- Google OAuth
- Apple Sign-In
- Email verification tokens
- Password reset tokens

**Relations:**
- 1:Many with Wardrobe, Outfit, StylingRequest, Payment, Notification
- 1:1 with StylistProfile
- Many:Many with WardrobeShare (both as owner and shared user)

---

#### **StylistProfile**
Extended profile for users who are stylists.

**Key Fields:**
- `userId` (UUID, Unique) - Foreign key to User
- `bio` (String) - Professional bio
- `yearsOfExperience` (Int)
- `pricePerSession` (Float) - Custom pricing per stylist
- `expertise` (String[]) - Tags like ["Bridal", "Party", "Streetwear"]
- `portfolioImages` (String[]) - URLs to portfolio images
- `isAvailable` (Boolean) - Receive new requests or not
- `isVerified` (Boolean) - Default TRUE (instant onboarding)
- `walletBalance` (Float) - Current earnings available for withdrawal
- `averageRating` (Float) - Calculated from reviews
- `totalSessions` (Int) - Completed sessions count

**Business Rules:**
- Instant verification (no admin approval required)
- Minimum withdrawal: ₹500
- Platform fee: 20% (if user pays ₹299, stylist gets ₹239)

---

#### **FCMToken**
Stores Firebase Cloud Messaging tokens for push notifications.

**Key Fields:**
- `userId` (UUID) - Foreign key to User
- `token` (String, Unique) - FCM device token
- `deviceId` (String, Optional) - Device identifier

---

### 🧥 Wardrobe System Domain

#### **Wardrobe**
Represents a physical location where clothes are stored.

**Key Fields:**
- `userId` (UUID) - Owner
- `name` (String) - e.g., "Home", "Parents House", "Storage"
- `location` (String, Optional)
- `isDefault` (Boolean) - Active wardrobe

**Examples:**
```json
{
  "name": "Home Wardrobe",
  "location": "Bangalore Apartment",
  "isDefault": true
}
```

---

#### **Category**
Hierarchical organization within a wardrobe.

**Key Fields:**
- `wardrobeId` (UUID) - Parent wardrobe
- `name` (String) - e.g., "Tops", "Winter Wear"
- `parentId` (UUID, Optional) - For subcategories
- `order` (Int) - Display order

**Hierarchy Example:**
```
Wardrobe: "Home"
  ├── Category: "Tops" (parentId: null)
  │   ├── Subcategory: "T-Shirts" (parentId: Tops.id)
  │   └── Subcategory: "Shirts" (parentId: Tops.id)
  └── Category: "Bottoms" (parentId: null)
      ├── Subcategory: "Jeans"
      └── Subcategory: "Trousers"
```

---

#### **ClothingItem**
Individual clothing pieces.

**Key Fields:**
- `wardrobeId` (UUID)
- `categoryId` (UUID, Optional)
- `name` (String) - e.g., "Blue Denim Jacket"
- `itemType` (String) - e.g., "Jacket", "Shirt", "Jeans"
- `color` (String)
- `season` (Season) - SPRING, SUMMER, FALL, WINTER, ALL_SEASON
- `brand` (String)
- `purchaseDate`, `price` (Optional)
- `status` (ItemStatus) - AVAILABLE, IN_LAUNDRY, IN_REPAIR, DONATED, SOLD
- `isPrivate` (Boolean) - **NEW**: Mark items as private when sharing wardrobe

**Privacy Feature:**
When a user shares their wardrobe with friends or stylists, items marked as `isPrivate = true` will be hidden from the shared view. This allows users to maintain privacy for personal items (e.g., underwear, intimate wear) while still sharing their general wardrobe.

**Status Workflow:**
```
AVAILABLE → IN_LAUNDRY → AVAILABLE
AVAILABLE → IN_REPAIR → AVAILABLE
AVAILABLE → DONATED (final state)
AVAILABLE → SOLD (final state)
```

---

#### **ClothingImage**
Multiple images per clothing item.

**Key Fields:**
- `itemId` (UUID)
- `url` (String) - Cloudinary/S3 URL
- `order` (Int) - Display order

---

#### **WardrobeShare**
Sharing wardrobes with friends or stylists.

**Key Fields:**
- `wardrobeId` (UUID)
- `ownerId` (UUID)
- `sharedWithId` (UUID)
- `permission` (SharePermission) - VIEW_ONLY, SUGGEST, FULL_ACCESS
- `expiresAt` (DateTime, Optional) - Time-limited sharing

**Permission Levels:**
- **VIEW_ONLY**: Can only see items
- **SUGGEST**: Can view + create outfit suggestions
- **FULL_ACCESS**: Can view + edit items

---

### 👗 Outfit Management Domain

#### **Outfit**
Saved outfit combinations.

**Key Fields:**
- `userId` (UUID)
- `name` (String) - e.g., "Office Look Monday"
- `season` (Season, Optional)
- `occasion` (String) - e.g., "Wedding", "Office", "Casual"
- `tags` (String[]) - e.g., ["formal", "summer", "comfortable"]
- `isFavorite` (Boolean)
- `previewImage` (String, Optional) - Generated or uploaded image

---

#### **OutfitItem**
Junction table linking outfits to clothing items.

**Key Fields:**
- `outfitId` (UUID)
- `itemId` (UUID)
- `order` (Int) - Display order in outfit

**Unique Constraint:** `[outfitId, itemId]` - Same item can't appear twice in one outfit

---

#### **OutfitCalendarEntry**
Schedule outfits for specific dates.

**Key Fields:**
- `outfitId` (UUID)
- `userId` (UUID)
- `scheduledDate` (DateTime)
- `notes` (String, Optional) - e.g., "Meeting with client"

**Unique Constraint:** `[userId, scheduledDate]` - One outfit per day per user

---

#### **OutfitSuggestion**
Friend/stylist suggestions for shared wardrobes.

**Key Fields:**
- `wardrobeId` (UUID)
- `outfitId` (UUID, Optional)
- `suggestedById` (UUID) - Friend who made suggestion
- `isAccepted` (Boolean, Nullable)
  - `null` = Pending
  - `true` = Accepted
  - `false` = Rejected
- `comment` (String, Optional)

---

#### **OutfitShare**
**NEW**: Share individual outfits with friends or stylists.

**Key Fields:**
- `outfitId` (UUID) - The outfit being shared
- `ownerId` (UUID) - User who owns the outfit
- `sharedWithId` (UUID) - User receiving access
- `permission` (SharePermission) - VIEW_ONLY, SUGGEST, FULL_ACCESS
- `expiresAt` (DateTime, Optional) - Time-limited sharing

**Use Cases:**
1. **Share with Friends**: Get feedback on specific outfits without sharing entire wardrobe
2. **Share with Stylist**: User can share pre-created outfits with stylist during session
3. **Privacy Control**: More granular than wardrobe sharing - only share selected outfits

**Permission Levels:**
- **VIEW_ONLY**: Friend/stylist can only view the outfit
- **SUGGEST**: Can view + suggest modifications
- **FULL_ACCESS**: Can view + edit the outfit

**Unique Constraint:** `[outfitId, sharedWithId]` - Same outfit can't be shared twice with same user

**Example Usage:**
```json
{
  "outfitId": "uuid-1",
  "ownerId": "user-1",
  "sharedWithId": "stylist-1",
  "permission": "SUGGEST",
  "expiresAt": "2025-11-20T00:00:00Z"
}
```

---

### 💼 Stylist Marketplace Domain

#### **StylingRequest**
User requests for styling help.

**Key Fields:**
- `userId` (UUID)
- `occasion` (String) - e.g., "Wedding", "Party"
- `timeline` (RequestTimeline) - URGENT, WITHIN_WEEK, FLEXIBLE
- `requestType` (RequestType) - **NEW**: IMMEDIATE or SCHEDULED
- `scheduledStartTime` (DateTime, Optional) - **NEW**: For scheduled appointments
- `scheduledEndTime` (DateTime, Optional) - **NEW**: For scheduled appointments
- `preferredStyles` (String[])
- `budget` (Float, Optional)
- `status` (RequestStatus) - PENDING, MATCHED, COMPLETED, CANCELLED, EXPIRED
- `matchedStylistId` (UUID, Optional)
- `expiresAt` (DateTime, Optional) - For IMMEDIATE requests race mode (5 min expiry)

**Request Types:**

1. **IMMEDIATE** (Default - Race Mode):
   - User needs styling help right now
   - Request broadcast to available stylists
   - First stylist to accept gets the session
   - Expires in 5 minutes if no one accepts
   - `expiresAt` field is used

2. **SCHEDULED** (Appointment-Based):
   - User books stylist for specific time slot (e.g., "Tomorrow 1-4 PM")
   - `scheduledStartTime` and `scheduledEndTime` are required
   - No race mode - user can browse stylists and request specific one
   - Stylist can accept/decline based on availability
   - No auto-expiry - waits for stylist response

**Lifecycle:**

*IMMEDIATE Request:*
```
PENDING → (5 min race mode) → MATCHED → (Session Created) → COMPLETED
   ↓
EXPIRED (if no stylist accepts within 5 minutes)
   ↓
CANCELLED (user cancels)
```

*SCHEDULED Request:*
```
PENDING → (Stylist views & accepts) → MATCHED → (Session at scheduled time) → COMPLETED
   ↓
CANCELLED (user or stylist cancels)
```

**Example Usage:**
```json
// Immediate Request
{
  "requestType": "IMMEDIATE",
  "occasion": "Date Night",
  "timeline": "URGENT",
  "expiresAt": "2025-11-13T10:05:00Z"
}

// Scheduled Request
{
  "requestType": "SCHEDULED",
  "occasion": "Wedding Next Week",
  "timeline": "WITHIN_WEEK",
  "scheduledStartTime": "2025-11-15T13:00:00Z",
  "scheduledEndTime": "2025-11-15T16:00:00Z"
}
```

---

#### **StylingSession**
Active or completed styling session.

**Key Fields:**
- `requestId` (UUID, Unique) - One session per request
- `userId` (UUID)
- `stylistId` (UUID)
- `status` (SessionStatus) - ACTIVE, COMPLETED, CANCELLED
- `startedAt`, `endedAt` (DateTime)
- `isFreeSession` (Boolean) - One of user's 3 free sessions
- `amountCharged`, `platformFee`, `stylistEarning` (Float)

**Payment Breakdown Example:**
```
amountCharged: ₹299
platformFee: ₹60 (20%)
stylistEarning: ₹239 (80%)
```

---

#### **Message**
Chat messages within a session.

**Key Fields:**
- `sessionId` (UUID)
- `senderId` (UUID)
- `content` (String)
- `images` (String[]) - Multiple image URLs
- `isRead` (Boolean)

**Features:**
- Real-time messaging (WebSocket)
- Image sharing
- Outfit suggestions in chat

---

#### **Review**
Post-session ratings and reviews.

**Key Fields:**
- `sessionId` (UUID, Unique) - One review per session
- `userId` (UUID)
- `stylistId` (UUID)
- `rating` (Int) - 1-5 stars
- `comment` (String, Optional)
- `isFlagged` (Boolean) - For moderation

**Business Logic:**
- Only users can review stylists
- Review updates stylist's `averageRating` and `totalReviews`

---

### 💳 Payments Domain

#### **Payment**
Payment records for styling sessions.

**Key Fields:**
- `sessionId` (UUID, Unique)
- `userId` (UUID)
- `amount` (Float) - Total charged
- `platformFee` (Float) - 20%
- `stylistEarning` (Float) - 80%
- `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature` (String)
- `status` (PaymentStatus) - PENDING, COMPLETED, FAILED, REFUNDED

**Razorpay Integration Flow:**
1. Create order → `razorpayOrderId` generated
2. User pays → `razorpayPaymentId` received
3. Verify signature → `razorpaySignature` validated
4. Mark as COMPLETED

---

#### **Transaction**
Ledger of stylist earnings and withdrawals.

**Key Fields:**
- `stylistProfileId` (UUID)
- `type` (TransactionType) - EARNING or WITHDRAWAL
- `amount` (Float)
- `description` (String)
- `balanceBefore`, `balanceAfter` (Float)

**Example Entries:**
```json
{
  "type": "EARNING",
  "amount": 239,
  "description": "Session earnings for request #xyz",
  "balanceBefore": 500,
  "balanceAfter": 739
}
```

---

#### **Withdrawal**
Stylist withdrawal requests.

**Key Fields:**
- `stylistProfileId` (UUID)
- `amount` (Float) - Min ₹500
- `bankAccountNumber`, `ifscCode`, `accountHolderName` (String)
- `status` (WithdrawalStatus) - PENDING, PROCESSING, COMPLETED, FAILED
- `processedAt` (DateTime, Optional)
- `failureReason` (String, Optional)

**Withdrawal Flow:**
```
PENDING → PROCESSING → COMPLETED (1-2 days)
   ↓
FAILED (with failureReason)
```

---

#### **Notification**
Push notification records.

**Key Fields:**
- `userId` (UUID)
- `type` (NotificationType)
- `title`, `message` (String)
- `data` (Json, Optional) - Extra payload
- `isRead` (Boolean)

**Notification Types:**
- `STYLING_REQUEST` - To stylists
- `STYLIST_MATCHED` - To users
- `NEW_MESSAGE` - Chat messages
- `SESSION_ENDED`
- `PAYMENT_RECEIVED`
- `REVIEW_RECEIVED`
- `WARDROBE_SHARED`
- `OUTFIT_SUGGESTION`

---

## 3️⃣ ENUMERATIONS

### UserRole
```prisma
enum UserRole {
  USER      // General user
  STYLIST   // Stylist (has all USER features + styling)
}
```

### Season
```prisma
enum Season {
  SPRING
  SUMMER
  FALL
  WINTER
  ALL_SEASON
}
```

### ItemStatus
```prisma
enum ItemStatus {
  AVAILABLE   // Ready to wear
  IN_LAUNDRY  // Currently being washed
  IN_REPAIR   // At tailor/repair
  DONATED     // Given away
  SOLD        // Sold
}
```

### SharePermission
```prisma
enum SharePermission {
  VIEW_ONLY    // Can only view items
  SUGGEST      // Can view + suggest outfits
  FULL_ACCESS  // Can view + edit items
}
```

### RequestStatus
```prisma
enum RequestStatus {
  PENDING    // Waiting for stylist
  MATCHED    // Stylist accepted
  COMPLETED  // Session ended
  CANCELLED  // User cancelled
  EXPIRED    // No stylist accepted in time
}
```

### SessionStatus
```prisma
enum SessionStatus {
  ACTIVE     // Currently ongoing
  COMPLETED  // Successfully finished
  CANCELLED  // Terminated early
}
```

### PaymentStatus
```prisma
enum PaymentStatus {
  PENDING   // Payment initiated
  COMPLETED // Payment successful
  FAILED    // Payment failed
  REFUNDED  // Payment refunded
}
```

### TransactionType
```prisma
enum TransactionType {
  EARNING     // Money added (from session)
  WITHDRAWAL  // Money withdrawn
}
```

### WithdrawalStatus
```prisma
enum WithdrawalStatus {
  PENDING     // Requested
  PROCESSING  // Being processed
  COMPLETED   // Money transferred
  FAILED      // Transfer failed
}
```

### NotificationType
```prisma
enum NotificationType {
  STYLING_REQUEST
  STYLIST_MATCHED
  NEW_MESSAGE
  SESSION_ENDED
  PAYMENT_RECEIVED
  REVIEW_RECEIVED
  WARDROBE_SHARED
  OUTFIT_SUGGESTION
}
```

### RequestTimeline
```prisma
enum RequestTimeline {
  URGENT       // Need help ASAP
  WITHIN_WEEK  // Within 7 days
  FLEXIBLE     // No rush
}
```

### RequestType
**NEW**: Determines how styling requests are matched.

```prisma
enum RequestType {
  IMMEDIATE  // Race mode - first stylist to accept wins
  SCHEDULED  // Appointment-based - book for specific time slot
}
```

**Usage:**
- **IMMEDIATE**: User needs styling help right now. Request sent to multiple stylists, first to accept gets the session. Auto-expires in 5 minutes if no one accepts.
- **SCHEDULED**: User books stylist for later (e.g., "Tomorrow 1-4 PM"). Stylist can view and accept based on availability. No race mode or auto-expiry.

---

## 4️⃣ RELATIONSHIPS & DIAGRAMS

### Entity Relationship Overview

```
User (1) ─────────── (Many) Wardrobe
User (1) ─────────── (1) StylistProfile
User (1) ─────────── (Many) Outfit
User (1) ─────────── (Many) StylingRequest
User (1) ─────────── (Many) Notification

Wardrobe (1) ────── (Many) Category
Wardrobe (1) ────── (Many) ClothingItem
Wardrobe (1) ────── (Many) WardrobeShare

Category (1) ────── (Many) ClothingItem
Category (1) ────── (Many) Category (self-referencing hierarchy)

ClothingItem (1) ── (Many) ClothingImage
ClothingItem (Many) ─ (Many) Outfit (via OutfitItem junction)

Outfit (1) ──────── (Many) OutfitCalendarEntry
Outfit (1) ──────── (Many) OutfitSuggestion
Outfit (1) ──────── (Many) OutfitShare [NEW]

StylingRequest (1) ─ (1) StylingSession
StylingSession (1) ─ (Many) Message
StylingSession (1) ─ (1) Review
StylingSession (1) ─ (1) Payment

StylistProfile (1) ─ (Many) Transaction
StylistProfile (1) ─ (Many) Withdrawal
```

---

## 5️⃣ INDEXES & PERFORMANCE

### Primary Indexes (Automatic)
All models use UUID primary keys with automatic indexing.

### Foreign Key Indexes
All foreign keys are automatically indexed for join performance.

### Custom Indexes

#### User Model
```prisma
@@index([email])
@@index([googleId])
@@index([appleId])
```

#### StylistProfile Model
```prisma
@@index([userId])
@@index([isAvailable])  // For finding available stylists
@@index([isVerified])   // For filtering verified stylists
```

#### Wardrobe Model
```prisma
@@index([userId])
@@index([userId, isDefault])  // For fetching active wardrobe
```

#### ClothingItem Model
```prisma
@@index([wardrobeId])
@@index([categoryId])
@@index([season])     // For seasonal filtering
@@index([status])     // For filtering available items
@@index([isPrivate])  // [NEW] For filtering private items when sharing
```

#### Outfit Model
```prisma
@@index([userId])
@@index([season])
@@index([isFavorite])  // Quick access to favorites
```

#### Message Model
```prisma
@@index([sessionId])
@@index([senderId])
@@index([createdAt])  // For chronological sorting
```

#### Review Model
```prisma
@@index([stylistId])  // For fetching stylist reviews
@@index([rating])     // For filtering by rating
```

#### StylingRequest Model
```prisma
@@index([userId])
@@index([status])
@@index([matchedStylistId])
@@index([requestType])          // [NEW] For filtering by request type
@@index([scheduledStartTime])   // [NEW] For querying scheduled appointments
```

#### Payment Model
```prisma
@@index([userId])
@@index([status])
@@index([razorpayOrderId])
```

#### Transaction Model
```prisma
@@index([stylistProfileId])
@@index([createdAt])  // For transaction history
```

---

## 6️⃣ DATA INTEGRITY RULES

### Cascade Deletes

**User Deletion:**
When a user is deleted, CASCADE delete:
- All wardrobes
- All outfits
- All styling requests
- All messages
- All reviews (both given and received)
- All payments
- All notifications
- StylistProfile (if exists)
- FCMTokens

**Wardrobe Deletion:**
When a wardrobe is deleted, CASCADE delete:
- All categories
- All clothing items
- All wardrobe shares
- All outfit suggestions

**ClothingItem Deletion:**
When an item is deleted, CASCADE delete:
- All images
- All outfit-item relationships (OutfitItem)

**StylingSession Deletion:**
When a session is deleted, CASCADE delete:
- All messages
- Review (if exists)
- Payment (if exists)

### Set Null on Delete

**Category Deletion:**
When a category is deleted:
- Set `categoryId` to NULL in ClothingItem (items become uncategorized)

### Unique Constraints

```prisma
// User
email @unique
googleId @unique
appleId @unique

// StylistProfile
userId @unique

// FCMToken
token @unique

// WardrobeShare
[wardrobeId, sharedWithId] @unique  // Can't share same wardrobe twice with same user

// OutfitItem
[outfitId, itemId] @unique  // Can't add same item twice to same outfit

// OutfitCalendarEntry
[userId, scheduledDate] @unique  // One outfit per day

// StylingRequest
requestId @unique  // One session per request

// Payment
sessionId @unique
razorpayOrderId @unique
razorpayPaymentId @unique

// Review
sessionId @unique  // One review per session
```

---

## 7️⃣ MIGRATION STRATEGY

### Development Migrations

```bash
# Create a new migration
yarn prisma migrate dev --name descriptive_name

# Reset database (WARNING: deletes all data)
yarn prisma migrate reset

# Generate Prisma Client
yarn prisma generate
```

### Production Migrations

```bash
# Deploy pending migrations to production
yarn prisma migrate deploy

# Check migration status
yarn prisma migrate status
```

### Seeding (Future)

Create `prisma/seed.ts` for development data:
- Test users (both USER and STYLIST roles)
- Sample wardrobes with categories
- Sample clothing items
- Sample outfits
- Sample styling sessions

---

## 🔮 FUTURE FEATURES (V2+)

The schema is designed to be future-proof with support for upcoming features. All future fields have default values and are optional, so they won't break current MVP functionality.

### 🛒 Marketplace Features

Users will be able to **sell or rent their clothing items** to other users.

#### **New Models:**

**Listing Model:**
- Supports both SALE and RENT listing types
- Tracks listing status (DRAFT, ACTIVE, SOLD, RENTED, etc.)
- Rental-specific fields: `minRentalDays`, `maxRentalDays`, `securityDeposit`
- Transaction tracking: `buyerId`, `soldAt`, `rentalStartDate`, `rentalEndDate`
- Analytics: `viewCount`, `favoriteCount`

**Future API Endpoints:**
```
POST   /api/marketplace/listings           - Create new listing
GET    /api/marketplace/listings           - Browse all listings
GET    /api/marketplace/listings/:id       - View single listing
PUT    /api/marketplace/listings/:id       - Update listing
DELETE /api/marketplace/listings/:id       - Delete listing
POST   /api/marketplace/listings/:id/buy   - Purchase item
POST   /api/marketplace/listings/:id/rent  - Rent item
GET    /api/marketplace/my-listings        - User's active listings
GET    /api/marketplace/my-purchases       - User's purchase history
```

#### **ClothingItem Enhancements:**

Added **future fields** to existing ClothingItem model:
- `itemCategory` (enum) - Beyond clothing: FOOTWEAR, ACCESSORY, JEWELRY, WATCH, EYEWEAR
- `viewCount` - Track item views
- `wearCount` - Track how often item is worn
- `lastWornAt` - Last worn date
- `brandId` - Link to Brand model

---

### 💍 Accessories & Beyond Clothing

Support for items beyond traditional clothing.

#### **Item Categories (Enum):**
```prisma
enum ItemCategory {
  CLOTHING     // Traditional clothing
  FOOTWEAR     // Shoes, boots, sandals
  ACCESSORY    // Bags, belts, scarves, hats
  JEWELRY      // Rings, necklaces, bracelets, earrings
  WATCH        // Watches and timepieces
  EYEWEAR      // Sunglasses, glasses
  OTHER        // Miscellaneous items
}
```

**Benefits:**
- Comprehensive wardrobe management (not just clothes)
- Better categorization and filtering
- Specialized fields for different item types in future iterations

---

### 🏷️ Brand Collaborations & Affiliate Marketing

Partner with brands to promote products and earn commission.

#### **New Models:**

**Brand Model:**
- Brand catalog with logo, description, website
- Partnership status: `isPartner`
- Affiliate integration: `affiliateCode`, `commissionRate`
- Brand metadata: `category`, `priceRange`, `sustainability`
- Social links: Instagram, Twitter
- Stats: `followersCount`, `productsCount`

**BrandProduct Model:**
- Product catalog from partner brands
- Pricing: `price`, `salePrice`, `currency`
- Product details: `category`, `sizes`, `colors`, `inStock`
- Affiliate tracking: `affiliateUrl`, `productUrl`
- Analytics: `clickCount`, `purchaseCount`

**BrandFollow Model:**
- Users can follow their favorite brands
- Receive updates on new products
- Personalized brand recommendations

**Use Cases:**
1. **Affiliate Links**: Show users where to buy similar items
2. **Product Recommendations**: "Complete the look" with partner products
3. **Commission Tracking**: Earn commission on user purchases through affiliate links
4. **Brand Discovery**: Users discover new brands based on their style

**Future API Endpoints:**
```
GET    /api/brands                        - Browse all brands
GET    /api/brands/:slug                  - View brand details
POST   /api/brands/:id/follow             - Follow a brand
DELETE /api/brands/:id/unfollow           - Unfollow a brand
GET    /api/brands/:id/products           - Brand's product catalog
GET    /api/brands/recommendations        - Recommended brands for user
POST   /api/brands/products/:id/click     - Track affiliate click
```

---

### 🤖 Recommendation System

AI-powered recommendations based on user behavior and outfit history.

#### **New Models:**

**UserInteraction Model:**
- Tracks user behavior: VIEW, LIKE, SAVE, SHARE, TRY_OUTFIT, PURCHASE
- Links to items, outfits, or brand products
- Session tracking for grouped interactions
- Metadata for additional context

**RecommendationLog Model:**
- Logs all recommendations shown to users
- Tracks recommendation type: outfit, item, brand_product
- Algorithm tracking for A/B testing
- User response: `clicked`, `clickedId`, `converted`
- Context for why recommendation was made

**Data Collection:**
- Item view history
- Outfit creation patterns
- Wear frequency (from calendar)
- Favorite items/outfits
- Sharing behavior
- Purchase patterns

**Recommendation Types:**
1. **Outfit Recommendations**: Based on occasion, weather, past outfits
2. **Item Recommendations**: "You might also like..." based on wardrobe
3. **Brand Product Recommendations**: Affiliate products matching user style
4. **Wardrobe Gap Analysis**: Suggest missing pieces for better combinations

**Future API Endpoints:**
```
GET    /api/recommendations/outfits       - Get outfit recommendations
GET    /api/recommendations/items         - Get item recommendations
GET    /api/recommendations/products      - Get brand product recommendations
GET    /api/recommendations/gaps          - Wardrobe gap analysis
POST   /api/recommendations/:id/feedback  - User feedback on recommendation
```

---

### 📊 Analytics & Insights

**Item Analytics:**
- Most worn items
- Least worn items (closet dead stock)
- Cost per wear calculation
- Seasonal usage patterns
- Color palette analysis

**Outfit Analytics:**
- Favorite outfit combinations
- Outfit rotation frequency
- Occasion-based insights
- Success rate of stylist suggestions

**User Behavior Analytics:**
- Browsing patterns
- Purchase conversion rates (marketplace)
- Affiliate click-through rates
- Recommendation effectiveness

---

### 🎯 Implementation Strategy

**Phase 1 (MVP):** Core wardrobe + stylist marketplace
- All future fields exist but not used
- Schema supports future features without migration

**Phase 2 (V1):** Enable marketplace
- Activate Listing model
- Launch sell/rent features
- Start tracking analytics

**Phase 3 (V2):** Brand partnerships
- Activate Brand models
- Implement affiliate tracking
- Launch brand product catalog

**Phase 4 (V3):** AI Recommendations
- Start collecting interaction data
- Build recommendation engine
- Launch personalized suggestions

---

## 📊 DATABASE STATISTICS

### Current (MVP + Future-Proof)
**Total Models:** 27
- **MVP Models:** 21
- **Future Models:** 6 (Listing, Brand, BrandProduct, BrandFollow, UserInteraction, RecommendationLog)

**Total Enums:** 15
- **MVP Enums:** 11
- **Future Enums:** 4 (ItemCategory, ListingType, ListingStatus, InteractionType)

**Total Relations:** 70+
**Total Indexes:** 50+
**Average Model Size:** 8-15 fields

### Model Breakdown by Domain
| Domain | MVP Models | Future Models | Total |
|--------|-----------|---------------|-------|
| User Management | 3 | 0 | 3 |
| Wardrobe System | 5 | 0 | 5 |
| Outfit Management | 5 | 0 | 5 |
| Stylist Marketplace | 4 | 0 | 4 |
| Payments | 4 | 0 | 4 |
| **Marketplace** | 0 | 1 | 1 |
| **Brands & Affiliate** | 0 | 3 | 3 |
| **Recommendations** | 0 | 2 | 2 |
| **TOTAL** | **21** | **6** | **27** |

### Schema Evolution

**v1.0** (Initial)
- 20 models, 10 enums
- Core wardrobe + stylist marketplace

**v1.1** (Current)
- 27 models, 15 enums
- Added: OutfitShare, RequestType, privacy controls, scheduled sessions
- Added: Future marketplace, brand, and recommendation models
- All future fields have defaults - no migration needed when activating features

---

## 🔒 SECURITY CONSIDERATIONS

1. **Password Storage:** Passwords must be hashed using bcrypt before storage
2. **OAuth Tokens:** Store only OAuth IDs, never access tokens
3. **Payment Data:** Store only Razorpay IDs, never card details
4. **Bank Details:** Encrypted at rest for withdrawal information
5. **Image URLs:** Use signed URLs for private images (Cloudinary/S3)
6. **FCM Tokens:** Rotate and update regularly

---

## 🚀 PERFORMANCE TIPS

1. **Use Compound Indexes:** For frequently combined filters (e.g., `[userId, isDefault]`)
2. **Paginate Results:** Always use `skip` and `take` for large datasets
3. **Select Specific Fields:** Use Prisma's `select` to fetch only needed fields
4. **Use Transactions:** For operations that modify multiple tables (e.g., payment + transaction + wallet update)
5. **Connection Pooling:** Configure appropriate pool size in Supabase
6. **Query Optimization:** Use `include` sparingly, prefer separate queries when appropriate

---

**Document Status:** Living Document
**Next Review Date:** 2025-12-13
**Owner:** Engineering Team
