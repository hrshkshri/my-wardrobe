# 🔄 SCHEMA V1 vs V2 - Side-by-Side Comparison

---

## 📊 Core Architecture Change

### **V1 (Old):**
```
User (single table with role field)
├─ role: "USER" or "STYLIST"
├─ StylistProfile (optional, if role = STYLIST)
└─ Problem: Role and profile separate, no approval workflow
```

### **V2 (New):**
```
AuthAccount (unified authentication)
├─ UserProfile (if they're a user)
├─ StylistProfile (if they're a stylist, with status)
├─ AdminProfile (if they're admin)
└─ Solution: Clear separation, approval workflow, admin system
```

---

## 🎯 What Each User Type Looks Like

### **Regular User**

**V1:**
```javascript
{
  id: "user-123",
  email: "rahul@gmail.com",
  password: "hashed...",
  name: "Rahul Kumar",
  role: "USER",
  freeSessions: 3,
  avatar: "url",
  googleId: "g123",
  appleId: null,
  // StylistProfile: null (doesn't exist)
}
```

**V2:**
```javascript
// AuthAccount
{
  id: "auth-123",
  email: "rahul@gmail.com",
  password: "hashed...",
  googleId: "g123",
  appleId: null,
  emailVerified: true,
  isActive: true,
}

// UserProfile
{
  id: "user-123",
  authAccountId: "auth-123",
  firstName: "Rahul",
  lastName: "Kumar",
  phone: "9876543210",
  bio: "Love fashion",
  avatar: "url",
  totalFreeSessions: 3,
  remainingFreeSessions: 2,
  // StylistProfile: null (doesn't exist)
}
```

**Advantage V2:**
✅ Email/password/OAuth separate from profile
✅ Can track free sessions separately
✅ Cleaner data model

---

### **Stylist (Approved)**

**V1:**
```javascript
// User
{
  id: "stylist-456",
  email: "priya@gmail.com",
  password: "hashed...",
  name: "Priya Sharma",
  role: "STYLIST",
  freeSessions: 3,
  avatar: "url",
}

// StylistProfile
{
  id: "profile-456",
  userId: "stylist-456",
  bio: "10 years bridal styling",
  yearsOfExperience: 10,
  pricePerSession: 299,
  languages: ["Hindi", "English"],
  expertise: ["Bridal", "Party"],
  portfolioImages: ["img1.jpg"],
  isAvailable: true,
  isVerified: true, // ← No approval workflow!
  walletBalance: 15000,
  // Problem: isVerified is boolean, not a status field
}
```

**V2:**
```javascript
// AuthAccount
{
  id: "auth-456",
  email: "priya@gmail.com",
  password: "hashed...",
  googleId: null,
  appleId: "apple-123",
}

// StylistProfile
{
  id: "stylist-456",
  authAccountId: "auth-456",

  // Status Workflow ✅
  profileStatus: "APPROVED", // PENDING_APPROVAL | APPROVED | REJECTED | SUSPENDED
  approvedAt: "2025-01-15T10:30:00Z",
  approvedBy: "admin-789", // Track who approved

  // Professional Info
  yearsOfExperience: 10,
  bio: "10 years bridal styling",
  pricePerSession: 299,
  languages: ["Hindi", "English"],
  expertise: ["Bridal", "Party"],
  portfolioImages: ["img1.jpg"],
  isAvailable: true,

  // Stats
  totalSessions: 45,
  totalEarnings: 45000,
  averageRating: 4.8,
  walletBalance: 15000,
}
```

**Advantage V2:**
✅ Clear approval workflow (PENDING → APPROVED/REJECTED)
✅ Track approval timestamps and admin notes
✅ Can suspend stylists
✅ Audit trail of all decisions

---

### **Dual-Role User (User + Stylist)**

**V1:**
```javascript
// User with role = STYLIST
{
  id: "dual-789",
  email: "ananya@gmail.com",
  role: "STYLIST", // ← Says STYLIST but wants wardrobe too
  freeSessions: 3,
}

// StylistProfile
{
  userId: "dual-789",
  bio: "Professional stylist",
  isVerified: true,
}

// Wardrobe
{
  userId: "dual-789", // ← Works, but confusing!
  name: "Home Closet",
}

// Problem: User role = STYLIST, but they're using wardrobe
// How does app know they're dual-role? Query for Wardrobe!
// This is confusing and error-prone
```

**V2:**
```javascript
// AuthAccount
{
  id: "auth-789",
  email: "ananya@gmail.com",
}

// UserProfile ✅
{
  id: "user-789",
  authAccountId: "auth-789",
  firstName: "Ananya",
}

// StylistProfile ✅
{
  id: "stylist-789",
  authAccountId: "auth-789",
  profileStatus: "APPROVED",
  bio: "Professional stylist",
}

// Wardrobe
{
  userId: "user-789", // ← Clear: from UserProfile
  name: "Home Closet",
}

// Clear:
// - AuthAccount = authentication
// - UserProfile exists = can use wardrobe
// - StylistProfile exists = can accept requests
// Both exist = DUAL-ROLE!
```

**Advantage V2:**
✅ Crystal clear what role they have
✅ Can query: "has UserProfile AND StylistProfile"
✅ No ambiguity about dual-role

---

### **Stylist Pending Approval**

**V1:**
```javascript
// No way to represent this!
// isVerified is boolean:
// - true = approved
// - false = ??? pending or rejected?

{
  id: "profile-999",
  isVerified: false, // ← Ambiguous!
}
```

**V2:**
```javascript
{
  id: "stylist-999",
  authAccountId: "auth-999",
  profileStatus: "PENDING_APPROVAL", // Crystal clear!
  yearsOfExperience: 5,
  bio: "Want to become stylist",
  // Can see application form
}

// Can also see
StylistApprovalLog {
  stylistProfileId: "stylist-999",
  action: "SUBMITTED",
  submittedAt: "2025-01-14",
  // Awaiting admin review
}
```

**Advantage V2:**
✅ Can't accidentally approve/reject
✅ Stylist sees their status
✅ Admin can track applications

---

## 🔐 Authentication

### **V1:**
```
User Model handles everything:
├─ id
├─ email (authenticate with this)
├─ password
├─ googleId (authenticate with this)
├─ appleId (authenticate with this)
├─ role
└─ profile fields mixed in

Problem:
- Mixing auth with user profile
- Can't have admin without creating User
- Hard to track which auth method used
```

### **V2:**
```
Separated concerns:

AuthAccount (authentication only):
├─ id
├─ email
├─ password
├─ googleId
├─ appleId
├─ emailVerified
├─ isActive

UserProfile (user-specific):
├─ authAccountId (links to AuthAccount)
├─ firstName, lastName
├─ phone, bio, avatar
├─ wardrobe features

StylistProfile (stylist-specific):
├─ authAccountId (links to AuthAccount)
├─ professional info
├─ status
├─ wallet

AdminProfile (admin-specific):
├─ authAccountId (links to AuthAccount)
├─ admin level
├─ permissions

Advantage:
✅ One AuthAccount can be accessed by multiple apps
✅ Admin doesn't need to be "user" or "stylist"
✅ Clear separation of concerns
✅ Easier to add new profile types later
```

---

## 📱 Multi-App Support

### **V1:**
```
Single app:
- User logs in
- Role = USER → Show wardrobe features
- Role = STYLIST → Show marketplace features

Problem:
- Can't have separate apps
- Wardrobe features in same code as marketplace
- Stylist-only user sees wardrobe UI (confusing)
```

### **V2:**
```
Multiple apps with same credentials:

User App:
- Login with AuthAccount
- Check if UserProfile exists
- If yes → show wardrobe, outfit, request features
- If no → prompt to switch to Stylist App

Stylist App:
- Login with AuthAccount
- Check if StylistProfile exists
- If status = PENDING → show "awaiting approval"
- If status = APPROVED → show all stylist features
- If status = REJECTED → show rejection reason

Admin Panel:
- Login with AuthAccount
- Check if AdminProfile exists
- Access admin dashboard

Benefits:
✅ Same credentials across all apps
✅ Each app focuses on its features
✅ No confusion about UI visibility
✅ Easy to have mobile + web apps
✅ Native apps can differentiate features
```

---

## 🔄 Role Upgrade Path

### **V1:**
```
Regular User → Stylist:

1. User has: User (role: USER) + Wardrobe
2. User clicks "Become Stylist"
3. What happens?
   - Create StylistProfile
   - But what about User.role?
   - Update to "STYLIST"?
   - But then User.role says STYLIST, yet has wardrobe
   - Now User.role is misleading!

Problem: No clear upgrade workflow
```

### **V2:**
```
Regular User → Stylist (Approved):

1. User has: AuthAccount + UserProfile + Wardrobe
2. User clicks "Become Stylist"
3. System creates:
   - StylistProfile (status: PENDING_APPROVAL)
   - UpgradeRequest (for audit)
4. Admin review:
   - Checks application
   - Approves or rejects
   - Creates StylistApprovalLog
5. If approved:
   - StylistProfile.status = APPROVED
   - User can now accept requests
   - User still has UserProfile + Wardrobe
   - User is now DUAL-ROLE

Perfect clarity:
✅ Original UserProfile untouched
✅ New StylistProfile created
✅ Audit trail of decision
✅ Clear state at every step
```

---

## 👨‍💼 Admin System

### **V1:**
```
No admin system:
- isVerified field on StylistProfile
- No way to approve/reject
- No audit trail
- No way to suspend
- No approval UI

Problem: Can't manage quality of stylists
```

### **V2:**
```
Complete admin system:

AdminProfile:
├─ id
├─ authAccountId
├─ role: SUPER_ADMIN | ADMIN | MODERATOR
├─ permissions: [APPROVE_STYLISTS, VIEW_ANALYTICS, etc]
└─ lastLoginAt

StylistApprovalLog:
├─ stylistProfileId
├─ adminId (who approved/rejected)
├─ action: SUBMITTED | APPROVED | REJECTED | SUSPENDED
├─ previousStatus → newStatus
├─ reason (admin notes)
└─ createdAt

Features:
✅ Dashboard to review pending applications
✅ Approve or reject with feedback
✅ Suspend/unsuspend stylists
✅ View all decisions with audit trail
✅ Email notifications to stylists
✅ Analytics on stylist quality
```

---

## 📊 Comparison Table

| Feature | V1 | V2 |
|---------|----|----|
| **Authentication** | Mixed in User | Separate AuthAccount |
| **User Profile** | Single User table | UserProfile table |
| **Stylist Profile** | StylistProfile optional | StylistProfile with status |
| **Admin System** | ❌ None | ✅ AdminProfile + approvals |
| **Approval Workflow** | ❌ No workflow | ✅ Full workflow |
| **Dual-Role Support** | ❓ Ambiguous | ✅ Clear |
| **Role Tracking** | User.role | AuthAccount + profile checks |
| **Status Field** | Boolean isVerified | Enum profileStatus |
| **Audit Trail** | ❌ None | ✅ ApprovalLog |
| **Multi-App Support** | ❌ Single app | ✅ Multiple apps |
| **OAuth Support** | ✅ Yes | ✅ Better integration |
| **User Upgrade Path** | ❓ Unclear | ✅ Clear workflow |

---

## 🎯 Migration Example

### **Scenario: User "Rahul" starts as regular user**

**V1 State:**
```
User {
  id: "u1",
  email: "rahul@gmail.com",
  name: "Rahul Kumar",
  role: "USER",
  ...
}

Wardrobe {
  userId: "u1",
  ...
}
```

**V2 State:**
```
AuthAccount {
  id: "auth1",
  email: "rahul@gmail.com",
  ...
}

UserProfile {
  id: "up1",
  authAccountId: "auth1",
  firstName: "Rahul",
  lastName: "Kumar",
  ...
}

Wardrobe {
  userId: "up1", // Points to UserProfile now
  ...
}
```

---

### **6 months later: Rahul wants to become stylist**

**V1 State:**
```
User {
  id: "u1",
  email: "rahul@gmail.com",
  role: "STYLIST", // ← Changed!
  // But still has wardrobe...
  // Confusing!
}

StylistProfile {
  userId: "u1",
  isVerified: true, // ← No approval process
  ...
}

Wardrobe {
  userId: "u1",
  ...
}
```

**V2 State:**
```
AuthAccount {
  id: "auth1",
  email: "rahul@gmail.com",
  ...
}

UserProfile {
  id: "up1",
  authAccountId: "auth1",
  // ← Unchanged! Still has wardrobe
}

StylistProfile {
  id: "sp1",
  authAccountId: "auth1",
  profileStatus: "APPROVED", // ← Admin approved
  approvedAt: "2025-06-15",
  ...
}

UpgradeRequest {
  id: "ur1",
  authAccountId: "auth1",
  status: "APPROVED",
  ...
}

Wardrobe {
  userId: "up1",
  // ← Still points to UserProfile, so still accessible
}

StylistApprovalLog {
  stylistProfileId: "sp1",
  adminId: "admin123",
  action: "APPROVED",
  reason: "Good portfolio and experience",
  ...
}
```

**Crystal clear: Rahul is now DUAL-ROLE**

---

## ✅ Summary: Why V2 is Better

1. **Clear Role System**
   - V1: Role field is confusing for dual-role users
   - V2: Separate profiles make it crystal clear

2. **Admin Approval**
   - V1: No workflow
   - V2: Full approval system with audit trail

3. **Multi-App Support**
   - V1: Single app handles everything
   - V2: Separate apps with same credentials

4. **Upgrade Path**
   - V1: Ambiguous and error-prone
   - V2: Clear workflow with approval

5. **Audit Trail**
   - V1: No tracking of decisions
   - V2: Every decision logged

6. **OAuth Integration**
   - V1: Works but mixed with profile
   - V2: Clean separation

7. **Extensibility**
   - V1: Hard to add new role types
   - V2: Easy to add new profile types

---

**Ready to implement V2 in Prisma?**
