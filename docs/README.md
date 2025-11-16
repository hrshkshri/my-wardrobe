# 📚 VYBE Documentation

**Last Updated:** 2025-11-16
**Schema Version:** V2 (Current)

---

## Quick Navigation

### **1. Product Documentation**
📄 [PRD.md](./PRD.md) - Product Requirements Document
- What we're building and why
- Feature set (MVP → V1 → V2)
- Target users
- Success metrics
- Technical architecture
- Roadmap and timeline

### **2. User Experience**
👥 [USER_JOURNEY.md](./USER_JOURNEY.md) - Complete User Flows
- Initial setup & onboarding
- Wardrobe management
- Outfit creation & library
- Calendar planning
- Friends & sharing
- Stylist journeys
- Styling session flows

### **3. Visual Flows**
📊 [DIAGRAMS.md](./DIAGRAMS.md) - System Diagrams
- User type & role selection
- Onboarding flows
- Feature-specific diagrams
- System architecture
- Database schema overview

### **4. Database Schema**
🗄️ [SCHEMA.md](./SCHEMA.md) - Current Schema Reference
- Architecture overview
- Domain breakdown (28 models)
- Key features explained
- User types and capabilities
- Quick query reference

---

## Document Purposes

### For Product/Design Teams
→ Start with **PRD.md** to understand the product vision
→ Then **USER_JOURNEY.md** for detailed user flows
→ Use **DIAGRAMS.md** for visual references

### For Backend Developers
→ Start with **SCHEMA.md** for database structure
→ Reference **PRD.md** for feature requirements
→ Check **USER_JOURNEY.md** for business logic

### For Frontend Developers
→ Start with **USER_JOURNEY.md** for UI flows
→ Reference **DIAGRAMS.md** for visual guides
→ Check **SCHEMA.md** for data structure

---

## Architecture At a Glance

```
┌─────────────────────────────────────┐
│         VYBE Platform               │
├─────────────────────────────────────┤
│                                     │
│  Fashion OS + Stylist Marketplace   │
│                                     │
│  • Digital Wardrobe Management      │
│  • Outfit Creation & Planning       │
│  • Social Sharing & Collaboration   │
│  • On-Demand Stylist Sessions       │
│  • Google Calendar Integration      │
│                                     │
└─────────────────────────────────────┘
```

### Tech Stack
- **Frontend:** React Native (iOS + Android)
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL (Supabase) + Prisma ORM
- **Storage:** AWS S3 / Cloudinary
- **Payments:** Razorpay
- **Notifications:** Firebase Cloud Messaging
- **Calling:** WebRTC

---

## Current Status

✅ **Schema V2:** Implemented
✅ **Core Models:** 28 models across 6 domains
✅ **Features:** Role-based architecture with approval workflow
🔄 **Next:** API implementation

---

## Quick Links

| Need | Go To |
|------|-------|
| Product overview | [PRD.md](./PRD.md) |
| User experience details | [USER_JOURNEY.md](./USER_JOURNEY.md) |
| Visual flowcharts | [DIAGRAMS.md](./DIAGRAMS.md) |
| Database schema | [SCHEMA.md](./SCHEMA.md) |
| Prisma schema file | `../prisma/schema.prisma` |

---

**Maintained by:** Engineering Team
**Questions?** Check the relevant doc above or refer to `prisma/schema.prisma` for implementation details.
