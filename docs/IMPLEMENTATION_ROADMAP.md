# 🚀 SCHEMA V2 - Implementation Roadmap

**Status:** Design Complete ✅
**Next Phase:** Prisma Implementation

---

## 📦 What You Have Now

### **Documentation Created:**

1. **SCHEMA_V2_REDESIGN.md** (772 lines)
   - Complete new data models
   - 6 new tables for auth/admin/approval
   - Updated relationships
   - Query examples
   - Full migration path

2. **V1_VS_V2_COMPARISON.md** (635 lines)
   - Side-by-side comparison
   - What changed and why
   - Real-world migration example
   - Benefits of V2

3. **SCHEMA_V2_VISUAL_GUIDE.md** (677 lines)
   - User journeys (3 types)
   - Admin dashboard flow
   - Role matrix
   - Database state examples
   - UI/UX reference

---

## 🎯 Key Architecture Decisions Made

### **1. Authentication**
✅ Unified **AuthAccount** table
✅ Email/Password support
✅ OAuth (Google, Apple)
✅ Admin gets separate login (email/password only)

### **2. User Roles**
✅ **UserProfile** - For regular users (wardrobe features)
✅ **StylistProfile** - For stylists (marketplace features)
✅ **AdminProfile** - For platform admins (approval system)
✅ **Dual-role support** - User can upgrade to stylist

### **3. Approval System**
✅ **StylistProfile.profileStatus** - Enum field
   - PENDING_APPROVAL
   - APPROVED
   - REJECTED
   - SUSPENDED

✅ **StylistApprovalLog** - Audit trail of all decisions
✅ **UpgradeRequest** - Track user→stylist conversions

### **4. Multi-App Architecture**
✅ **User App** - Wardrobe, outfits, request styling
✅ **Stylist App** - Accept requests, earn money, wallet
✅ **Admin Panel** - Approve stylists, view analytics
✅ **Same credentials** across all apps (via AuthAccount)

---

## 📊 New Models Summary

| Model | Purpose | 1:1 Links | 1:Many Links |
|-------|---------|-----------|--------------|
| **AuthAccount** | Core authentication | UserProfile, StylistProfile, AdminProfile | FCMToken |
| **UserProfile** | Regular user profile | AuthAccount | Wardrobe, Outfit, StylingRequest |
| **StylistProfile** | Stylist profile with status | AuthAccount | StylingSession, Review, Transaction, Withdrawal |
| **AdminProfile** | Admin user profile | AuthAccount | StylistApprovalLog |
| **StylistApprovalLog** | Decision audit trail | AdminProfile, StylistProfile | - |
| **UpgradeRequest** | User→Stylist conversion tracking | AuthAccount | - |

---

## 🔄 Updated Relationship Map

```
AuthAccount (Hub for all authentication)
├─ 1:1 → UserProfile (optional)
├─ 1:1 → StylistProfile (optional)
├─ 1:1 → AdminProfile (optional)
└─ 1:Many → FCMToken

UserProfile (User features)
├─ 1:Many → Wardrobe
├─ 1:Many → Outfit
├─ 1:Many → StylingRequest
└─ 1:Many → StylingSession (as client)

StylistProfile (Stylist features)
├─ 1:Many → StylingSession (as stylist)
├─ 1:Many → Review
├─ 1:Many → Transaction
└─ 1:Many → Withdrawal

AdminProfile
└─ 1:Many → StylistApprovalLog
```

---

## ✨ Next Steps: Implement in Prisma

### **Phase 1: Create Core Auth Models**
- [ ] Create `prisma/schema.prisma` from scratch
- [ ] Define AuthAccount model
- [ ] Define UserProfile model
- [ ] Define StylistProfile model (with enum)
- [ ] Define AdminProfile model
- [ ] Add relationships

### **Phase 2: Add Admin/Approval Models**
- [ ] Define StylistApprovalLog model
- [ ] Define UpgradeRequest model
- [ ] Add admin-specific enums

### **Phase 3: Update Existing Models**
- [ ] Update all models to reference AuthAccount or UserProfile
- [ ] Update relationships
- [ ] Remove old User model if migrating from V1

### **Phase 4: Enumerations**
- [ ] UserRole → UserType (USER only, since STYLIST is separate)
- [ ] ProfileStatus (PENDING_APPROVAL, APPROVED, REJECTED, SUSPENDED)
- [ ] AdminRole (SUPER_ADMIN, ADMIN, MODERATOR)
- [ ] Keep existing enums (Season, ItemStatus, etc.)

### **Phase 5: Generate & Test**
- [ ] Run `prisma generate`
- [ ] Run `prisma migrate` (create initial migration)
- [ ] Test relationships with sample queries

---

## 🎯 Implementation Checklist

### **Models to Create:**

**Auth Layer (NEW):**
- [ ] AuthAccount
- [ ] UserProfile (replaces old User for regular users)
- [ ] StylistProfile (updated with status field)
- [ ] AdminProfile
- [ ] StylistApprovalLog
- [ ] UpgradeRequest

**Keep from V1:**
- [ ] Wardrobe
- [ ] Category
- [ ] ClothingItem
- [ ] ClothingImage
- [ ] WardrobeShare
- [ ] Outfit
- [ ] OutfitItem
- [ ] OutfitCalendarEntry
- [ ] OutfitShare
- [ ] OutfitSuggestion
- [ ] StylingRequest
- [ ] StylingSession
- [ ] Message
- [ ] Review
- [ ] Payment
- [ ] Transaction
- [ ] Withdrawal
- [ ] FCMToken (update to use AuthAccount)
- [ ] Notification (update to use AuthAccount)

---

## 📋 Enumerations to Define

### **New Enums:**
- [ ] ProfileStatus (for StylistProfile)
- [ ] AdminRole (for AdminProfile)
- [ ] StylistApprovalAction (SUBMITTED, APPROVED, REJECTED, SUSPENDED, UNSUSPENDED)
- [ ] UpgradeRequestStatus (SUBMITTED, REVIEWING, APPROVED, REJECTED)

### **Keep from V1:**
- [ ] Season
- [ ] ItemStatus
- [ ] SharePermission
- [ ] RequestStatus
- [ ] SessionStatus
- [ ] PaymentStatus
- [ ] TransactionType
- [ ] WithdrawalStatus
- [ ] NotificationType
- [ ] RequestTimeline
- [ ] RequestType

---

## 🔗 Foreign Key Updates

| Old Reference | New Reference | Reason |
|---------------|---------------|--------|
| User.id | UserProfile.authAccountId | Separated auth from profile |
| User.id | StylistProfile.authAccountId | Separated auth from profile |
| User.id | AdminProfile.authAccountId | Separated auth from profile |
| User.id in Wardrobe | UserProfile.id | References UserProfile |
| User.id in Outfit | UserProfile.id | References UserProfile |
| User.id in StylingRequest | UserProfile.id | References UserProfile |
| User.id in StylingSession | StylistProfile.id | Clearer stylist reference |
| StylistProfile.userId | StylistProfile.authAccountId | Uses AuthAccount |

---

## 🚨 Migration Strategy (if upgrading from V1)

### **Option A: Create New Tables (Recommended)**
```sql
-- Step 1: Create new auth tables
CREATE TABLE AuthAccount (...)
CREATE TABLE UserProfile (...)
CREATE TABLE StylistProfile_v2 (...)
CREATE TABLE AdminProfile (...)
CREATE TABLE StylistApprovalLog (...)

-- Step 2: Copy and transform data
INSERT INTO AuthAccount (email, password, ...)
SELECT email, password, ... FROM User

INSERT INTO UserProfile (authAccountId, ...)
SELECT aa.id, ... FROM User u
JOIN AuthAccount aa ON u.email = aa.email
WHERE u.role = 'USER'

-- Step 3: Update foreign keys in Wardrobe, Outfit, etc.
ALTER TABLE Wardrobe
  DROP CONSTRAINT Wardrobe_userId_fkey,
  ADD FOREIGN KEY (userId) REFERENCES UserProfile(id)

-- Step 4: Verify data integrity
SELECT COUNT(*) FROM User -- should match UserProfile + StylistProfile counts

-- Step 5: Drop old User table
DROP TABLE User
```

### **Option B: V2 Fresh Start (What we recommend for now)**
- Start with V2 schema
- Don't worry about V1 yet
- Focus on building the system
- Handle migration when needed

---

## 📱 App-Specific Features

### **User App Features**
```prisma
// Only accessible if UserProfile exists
- Wardrobe
- Outfit
- StylingRequest
- WardrobeShare
- OutfitShare
- OutfitSuggestion
```

### **Stylist App Features**
```prisma
// Only accessible if StylistProfile exists AND status = APPROVED
- StylingRequest (view & accept)
- StylingSession (conduct)
- Message
- Review (receive)
- Transaction (view)
- Withdrawal (request)
- StylistProfile (edit)
```

### **Admin Panel Features**
```prisma
// Only accessible if AdminProfile exists AND role = ADMIN/SUPER_ADMIN
- StylistProfile list (all)
- StylistApprovalLog (create entries)
- User analytics
- Payment analytics
- AdminProfile management
```

---

## 🎬 Example Prisma Schema Structure

```prisma
// This is what we'll build:

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ===== AUTH LAYER =====
model AuthAccount {
  id                    String    @id @default(uuid())
  email                 String    @unique
  password              String?
  googleId              String?   @unique
  appleId               String?   @unique
  emailVerified         Boolean   @default(false)
  emailVerificationToken String?
  isActive              Boolean   @default(true)

  userProfile           UserProfile?
  stylistProfile        StylistProfile?
  adminProfile          AdminProfile?
  fcmTokens             FCMToken[]
  notifications         Notification[]

  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}

model UserProfile {
  id                    String    @id @default(uuid())
  authAccountId         String    @unique
  authAccount           AuthAccount @relation(fields: [authAccountId], references: [id], onDelete: Cascade)

  firstName             String
  lastName              String
  phone                 String?
  bio                   String?
  avatar                String?

  totalFreeSessions     Int       @default(3)
  remainingFreeSessions Int       @default(3)

  wardrobes             Wardrobe[]
  outfits               Outfit[]
  stylingRequests       StylingRequest[]
  clientSessions        StylingSession[]  @relation("ClientSessions")
  wardrobeShares        WardrobeShare[]
  outfitShares          OutfitShare[]

  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}

model StylistProfile {
  id                    String    @id @default(uuid())
  authAccountId         String    @unique
  authAccount           AuthAccount @relation(fields: [authAccountId], references: [id], onDelete: Cascade)

  profileStatus         ProfileStatus @default(PENDING_APPROVAL)
  approvedAt            DateTime?
  rejectedAt            DateTime?
  rejectionReason       String?
  suspendedAt           DateTime?
  suspensionReason      String?

  yearsOfExperience     Int
  bio                   String
  pricePerSession       Float
  languages             String[]
  expertise             String[]
  portfolioImages       String[]

  totalSessions         Int       @default(0)
  totalEarnings         Float     @default(0)
  averageRating         Float     @default(0)
  totalReviews          Int       @default(0)
  walletBalance         Float     @default(0)
  isAvailable           Boolean   @default(true)

  stylistSessions       StylingSession[]  @relation("StylistSessions")
  reviews               Review[]
  transactions          Transaction[]
  withdrawals           Withdrawal[]
  approvalLogs          StylistApprovalLog[]

  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}

model AdminProfile {
  id                    String    @id @default(uuid())
  authAccountId         String    @unique
  authAccount           AuthAccount @relation(fields: [authAccountId], references: [id], onDelete: Cascade)

  firstName             String
  lastName              String
  adminRole             AdminRole
  permissions           String[]
  isActive              Boolean   @default(true)
  lastLoginAt           DateTime?

  approvalLogs          StylistApprovalLog[]

  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}

// ... rest of models
```

---

## ⏱️ Estimated Timeline

- **Design Phase:** ✅ COMPLETE (today)
- **Prisma Schema:** 2-3 hours
- **Migrations:** 1 hour
- **API Endpoints:** 4-5 hours
- **Testing:** 3-4 hours
- **Total:** ~10-15 hours

---

## 🎯 Success Criteria

After implementation, you should be able to:

✅ Signup as regular user (creates AuthAccount + UserProfile)
✅ Signup as stylist (creates AuthAccount + StylistProfile in PENDING status)
✅ Admin approves stylist (updates profileStatus to APPROVED)
✅ Regular user upgrades to stylist (creates StylistProfile while keeping UserProfile)
✅ User logs in to User App (if UserProfile exists)
✅ Stylist logs in to Stylist App (if StylistProfile.status = APPROVED)
✅ Admin logs in to Admin Panel (if AdminProfile exists)
✅ Audit trail tracks all approval decisions

---

## 📞 Ready to Start Implementing?

Let me know when you want to start writing the Prisma schema!

**Options:**
1. Build the complete Prisma schema file now
2. Build it incrementally (Phase 1 → Phase 2 → etc.)
3. Review & discuss any clarifications first

What's your preference? 🚀
