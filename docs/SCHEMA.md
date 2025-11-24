# 🗄️ VYBE Database Schema

**Version:** V2 (Current)
**Database:** PostgreSQL via Supabase
**ORM:** Prisma
**Last Updated:** 2025-11-16

---

## Overview

VYBE uses a role-based architecture with separate profiles for different user types. All authentication is centralized through `AuthAccount`, with optional profiles for each role.

---

## Core Architecture

```
AuthAccount (Authentication Hub)
├─ UserProfile (optional) - Regular users with wardrobes
├─ StylistProfile (optional) - Stylists who provide services
├─ AdminProfile (optional) - Platform administrators
└─ FCMToken - Push notifications
```

**Key Concept:** One `AuthAccount` can have multiple profiles (e.g., both User and Stylist).

---

## Domain Breakdown

### 0️⃣ Authentication & Admin (7 models)
- **AuthAccount** - Core authentication (email, OAuth)
- **UserProfile** - Regular users (wardrobe features)
- **StylistProfile** - Stylists (marketplace features)
- **AdminProfile** - Platform admins
- **StylistApprovalLog** - Audit trail for approvals
- **UpgradeRequest** - User→Stylist conversion tracking
- **FCMToken** - Push notification tokens

### 1️⃣ User Management (1 model)
- **Notification** - In-app notifications

### 2️⃣ Wardrobe System (5 models)
- **Wardrobe** - User's wardrobe containers
- **Category** - Hierarchical categories (CLOTHING or OUTFIT type)
- **ClothingItem** - Individual clothing pieces
- **ClothingImage** - Item photos
- **WardrobeShare** - Sharing with friends/stylists

### 3️⃣ Outfit Management (5 models)
- **Outfit** - Saved outfit combinations
- **OutfitItem** - Junction table (Outfit ↔ ClothingItem)
- **OutfitCalendarEntry** - Scheduled outfits (Google Calendar sync)
- **OutfitShare** - Share specific outfits
- **OutfitSuggestion** - Friend suggestions

### 4️⃣ Friendship & Social (1 model)
- **Friendship** - Friend connections with status (PENDING, ACCEPTED, etc.)

### 5️⃣ Stylist Marketplace (4 models)
- **StylingRequest** - User requests styling help
- **StylingSession** - Active/completed sessions
- **Message** - In-session chat
- **Review** - Post-session ratings

### 6️⃣ Payments (3 models)
- **Payment** - Razorpay transactions
- **Transaction** - Stylist wallet ledger
- **Withdrawal** - Stylist bank withdrawals

---

## Key Features

### Generic Category Model
```prisma
Category {
  type: CategoryType  // CLOTHING or OUTFIT

  // For CLOTHING: per-wardrobe categories
  wardrobeId: String? (required when type=CLOTHING)

  // For OUTFIT: user-level categories
  userId: String (always required)

  // Both types can have hierarchical structure
  parentId: String?
  children: Category[]
}
```

### Google Calendar Integration
```prisma
OutfitCalendarEntry {
  googleEventId: String?       // Google Calendar event ID
  syncedToGoogle: Boolean       // Sync status
  lastSyncedAt: DateTime?      // Last sync timestamp
}

AuthAccount {
  googleAccessToken: String?    // For Calendar API
  googleRefreshToken: String?   // Token refresh
  googleTokenExpiry: DateTime?  // Token expiry
  googleScope: String?          // Granted permissions
}
```

### Friendship System
```prisma
Friendship {
  status: FriendshipStatus  // PENDING, ACCEPTED, REJECTED, BLOCKED

  // Acts as ACL for sharing
  // Business logic checks friendship before creating shares
}
```

### Approval Workflow
```prisma
StylistProfile {
  profileStatus: ProfileStatus  // Current state only
  // History in StylistApprovalLog
}

StylistApprovalLog {
  action: ApprovalAction  // Who did what, when, why
  adminId: String         // Which admin
  reason: String?         // Why
  createdAt: DateTime     // When
}
```

---

## User Types

### Regular User
- **Has:** AuthAccount + UserProfile
- **Can:** Manage wardrobe, create outfits, request styling
- **Cannot:** Accept styling requests, earn money

### Stylist (Approved)
- **Has:** AuthAccount + StylistProfile (status=APPROVED)
- **Can:** Accept requests, earn money, conduct sessions
- **Cannot:** Have personal wardrobe (unless dual-role)

### Dual-Role User
- **Has:** AuthAccount + UserProfile + StylistProfile (status=APPROVED)
- **Can:** Everything! Wardrobe features + stylist features
- **Created:** When regular user upgrades to stylist

### Admin
- **Has:** AuthAccount + AdminProfile
- **Can:** Approve stylists, manage platform
- **Cannot:** Use wardrobe or stylist features

---

## Total Stats

- **Models:** 28
- **Enumerations:** 16
- **Relationships:** 60+
- **Indexes:** 50+

---

## Quick Reference

### Foreign Key Pattern
```prisma
// Authentication references
wardrobes → UserProfile.id
outfits → UserProfile.id
stylingRequests → UserProfile.id

// Stylist references
stylingSessions.stylistId → StylistProfile.id

// Category references
ClothingItem.categoryId → Category.id (type=CLOTHING)
Outfit.categoryId → Category.id (type=OUTFIT)
```

### Common Queries
```prisma
// Get dual-role users
findMany({
  where: {
    userProfile: { isNot: null },
    stylistProfile: {
      is: { profileStatus: "APPROVED" }
    }
  }
})

// Get clothing categories for wardrobe
findMany({
  where: {
    type: "CLOTHING",
    wardrobeId: "xyz"
  }
})

// Get outfit categories for user
findMany({
  where: {
    type: "OUTFIT",
    userId: "abc"
  }
})
```

---

## Schema Location

Current schema: `prisma/schema.prisma`

For full model definitions, see the Prisma schema file.

---

**Status:** Production Ready ✅
**Next:** API implementation
