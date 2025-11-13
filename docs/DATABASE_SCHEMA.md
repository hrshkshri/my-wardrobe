# 🗄️ DATABASE SCHEMA DOCUMENTATION

**Document Version:** 1.0
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

---

## 1️⃣ OVERVIEW

The VYBE database schema is designed to support a comprehensive fashion management and stylist marketplace platform. It consists of **20 models** organized into 5 functional domains:

### Domain Breakdown

| Domain | Models | Purpose |
|--------|--------|---------|
| **User Management** | User, StylistProfile, FCMToken | Authentication, profiles, notifications |
| **Wardrobe System** | Wardrobe, Category, ClothingItem, ClothingImage, WardrobeShare | Digital wardrobe organization |
| **Outfit Management** | Outfit, OutfitItem, OutfitCalendarEntry, OutfitSuggestion | Outfit creation & planning |
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

### 💼 Stylist Marketplace Domain

#### **StylingRequest**
User requests for styling help.

**Key Fields:**
- `userId` (UUID)
- `occasion` (String) - e.g., "Wedding", "Party"
- `timeline` (RequestTimeline) - URGENT, WITHIN_WEEK, FLEXIBLE
- `preferredStyles` (String[])
- `budget` (Float, Optional)
- `status` (RequestStatus) - PENDING, MATCHED, COMPLETED, CANCELLED, EXPIRED
- `matchedStylistId` (UUID, Optional)
- `expiresAt` (DateTime, Optional) - For race mode (5 min expiry)

**Lifecycle:**
```
PENDING → MATCHED → (Session Created) → COMPLETED
   ↓
EXPIRED (if no stylist accepts within 5 minutes)
   ↓
CANCELLED (user cancels)
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
@@index([season])   // For seasonal filtering
@@index([status])   // For filtering available items
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

## 📊 DATABASE STATISTICS

**Total Models:** 20
**Total Enums:** 10
**Total Relations:** 50+
**Total Indexes:** 35+
**Average Model Size:** 8-12 fields

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
