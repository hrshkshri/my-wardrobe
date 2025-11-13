# 📊 VYBE - Visual Diagrams

**Document Version:** 1.0
**Last Updated:** 2025-11-13

> **Note:** These diagrams use Mermaid syntax. You can view them rendered in:
> - GitHub (automatic rendering)
> - VS Code (with Mermaid extension)
> - Online: https://mermaid.live/

---

## 📋 TABLE OF CONTENTS

1. [User Type Relationships](#1-user-type-relationships)
2. [General User Journey](#2-general-user-journey)
3. [Stylist User Journey](#3-stylist-user-journey)
4. [Styling Session Flow](#4-styling-session-flow)
5. [Database Schema Overview](#5-database-schema-overview)
6. [System Architecture](#6-system-architecture)

---

## 1. User Type Relationships

```mermaid
graph TB
    A[User Signs Up] --> B{Choose Role}
    B -->|General User| C[User Profile]
    B -->|Stylist| D[Stylist Profile]
    B -->|Both| E[Hybrid Profile]

    C --> F[Can Use Wardrobe]
    C --> G[Can Request Styling]
    C --> H[Can Share Wardrobe]

    D --> I[Can Provide Styling]
    D --> J[Can Earn Money]
    D --> K[Build Reputation]

    E --> F
    E --> G
    E --> H
    E --> I
    E --> J
    E --> K
    E --> L[Switch Between Modes]

    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#e8f5e9
    style D fill:#f3e5f5
    style E fill:#fff9c4
```

---

## 2. General User Journey

### 2.1 Complete User Flow

```mermaid
flowchart TD
    Start([User Opens App]) --> SignUp[Sign Up / Login]
    SignUp --> Onboard[Onboarding Tutorial]
    Onboard --> CreateWard[Create First Wardrobe]
    CreateWard --> AddItems[Add Clothing Items]

    AddItems --> Decision1{What to do?}

    Decision1 -->|Organize More| AddMore[Add More Items]
    AddMore --> AddItems

    Decision1 -->|Create Outfit| BuildOutfit[Use Outfit Builder]
    BuildOutfit --> SelectItems[Select Items]
    SelectItems --> SaveOutfit[Save Outfit]
    SaveOutfit --> OutfitLib[Outfit Library]

    Decision1 -->|Need Help| RequestStyle[Request Styling]
    RequestStyle --> FillForm[Fill Request Form]
    FillForm --> ShareWard[Share Wardrobe Access]
    ShareWard --> Wait[Wait for Stylist Match]
    Wait --> Matched{Stylist Accepts?}

    Matched -->|Yes| StartSession[Session Starts]
    Matched -->|No| Timeout[Timeout - Retry]
    Timeout --> RequestStyle

    StartSession --> Chat[Chat with Stylist]
    Chat --> Call{Need Call?}
    Call -->|Yes| AudioCall[Audio Call]
    Call -->|No| Continue[Continue Chat]
    AudioCall --> GetSuggestions[Receive Outfit Suggestions]
    Continue --> GetSuggestions

    GetSuggestions --> Review[Review Suggestions]
    Review --> EndSession[End Session]
    EndSession --> Rate[Rate & Review Stylist]

    Rate --> Payment{Free Sessions Left?}
    Payment -->|Yes| Free[Use Free Session]
    Payment -->|No| Pay[Pay ₹299 via Razorpay]

    Free --> Done[Session Complete]
    Pay --> Done

    Done --> Decision1

    style Start fill:#4CAF50
    style Done fill:#4CAF50
    style RequestStyle fill:#2196F3
    style Pay fill:#FF9800
```

### 2.2 Wardrobe Management Flow

```mermaid
stateDiagram-v2
    [*] --> EmptyWardrobe
    EmptyWardrobe --> AddingItems: Add First Item
    AddingItems --> HasItems: Item Added
    HasItems --> AddingItems: Add More
    HasItems --> CreatingOutfit: Create Outfit
    CreatingOutfit --> HasItems: Save Outfit
    HasItems --> SharingWardrobe: Share with Friend/Stylist
    SharingWardrobe --> SharedWardrobe: Access Granted
    SharedWardrobe --> HasItems: Revoke Access
    HasItems --> [*]
```

---

## 3. Stylist User Journey

### 3.1 Stylist Complete Flow

```mermaid
flowchart TD
    Start([Stylist Opens App]) --> SignUp[Sign Up as Stylist]
    SignUp --> CreateProfile[Create Stylist Profile]
    CreateProfile --> AddInfo[Add Bio, Expertise, Pricing]
    AddInfo --> UploadPort[Upload Portfolio]
    UploadPort --> Submit[Submit for Approval]
    Submit --> Wait[Wait for Admin Review]
    Wait --> Approved{Approved?}

    Approved -->|Yes| Dashboard[Stylist Dashboard]
    Approved -->|No| Rejected[Rejection Feedback]
    Rejected --> AddInfo

    Dashboard --> ToggleAvail[Set Availability: ON]
    ToggleAvail --> WaitRequest[Wait for Requests]

    WaitRequest --> Notif[📱 Receive Notification]
    Notif --> ViewReq[View Request Details]
    ViewReq --> Decision{Accept?}

    Decision -->|No| Decline[Decline Request]
    Decision -->|Yes| Accept[Accept Request]
    Decline --> WaitRequest

    Accept --> Matched{Got it?}
    Matched -->|Another stylist faster| Missed[Missed Request]
    Matched -->|Yes| SessionStart[Session Starts]
    Missed --> WaitRequest

    SessionStart --> ViewWard[View Client Wardrobe]
    ViewWard --> CreateOutfits[Create Outfit Suggestions]
    CreateOutfits --> ChatClient[Chat with Client]

    ChatClient --> CallOption{Client Wants Call?}
    CallOption -->|Yes| AudioCall[Audio Call]
    CallOption -->|No| ContinueChat[Continue Chat]
    AudioCall --> FinalSuggestion[Send Final Suggestions]
    ContinueChat --> FinalSuggestion

    FinalSuggestion --> EndSession[End Session]
    EndSession --> EarnMoney[💰 Earn ₹239]
    EarnMoney --> WaitReview[Wait for Review]
    WaitReview --> GetReview[Receive Rating & Review]
    GetReview --> UpdateProfile[Profile Updated]

    UpdateProfile --> WaitRequest

    style Start fill:#9C27B0
    style EarnMoney fill:#4CAF50
    style Accept fill:#2196F3
```

### 3.2 Stylist Availability State

```mermaid
stateDiagram-v2
    [*] --> Offline
    Offline --> Available: Toggle ON
    Available --> Offline: Toggle OFF
    Available --> Busy: Accept Request
    Busy --> Available: Complete Session
    Busy --> Offline: Toggle OFF (After Session)
```

---

## 4. Styling Session Flow

### 4.1 Request-Match-Session Flow

```mermaid
sequenceDiagram
    participant U as User
    participant S as System
    participant ST as Stylist 1
    participant ST2 as Stylist 2

    U->>S: Create Styling Request
    Note over U,S: Occasion: Wedding<br/>Style: Traditional
    S->>S: Find Matching Stylists

    par Notify Multiple Stylists
        S->>ST: 📱 Push Notification
        S->>ST2: 📱 Push Notification
    end

    ST->>S: View Request
    ST2->>S: View Request

    Note over ST,ST2: Race to accept

    ST->>S: Accept Request (First!)
    S->>ST2: ❌ Request Taken
    S->>U: ✅ Matched with Stylist 1

    Note over U,ST: Session Starts

    S->>ST: Grant Wardrobe Access
    ST->>S: View User's Wardrobe
    ST->>ST: Create Outfit Suggestions

    ST->>U: Send Outfit 1
    ST->>U: Send Outfit 2
    U->>ST: "Love outfit 2!"
    U->>ST: Request Audio Call

    ST->>U: Start Audio Call
    Note over U,ST: 10-minute call
    ST->>U: End Call

    ST->>U: Send Final Outfit
    U->>ST: "Thank you! 💙"
    ST->>S: End Session

    S->>U: Request Rating
    U->>S: Submit 5⭐ Rating
    S->>ST: Update Profile (Rating)

    alt Free Session Available
        S->>U: Free Session Used (2 left)
    else No Free Sessions
        S->>U: Payment: ₹299
        U->>S: Pay via Razorpay
        S->>ST: Transfer ₹239 to Wallet
    end
```

### 4.2 Session State Machine

```mermaid
stateDiagram-v2
    [*] --> RequestCreated
    RequestCreated --> Matching: System Notifies Stylists
    Matching --> Matched: Stylist Accepts
    Matching --> Expired: Timeout (No Accept)
    Expired --> [*]

    Matched --> Active: Session Starts
    Active --> Chatting: Exchanging Messages
    Chatting --> InCall: Audio Call Started
    InCall --> Chatting: Call Ended
    Chatting --> Completed: Stylist Ends Session

    Completed --> Rated: User Submits Rating
    Rated --> Paid: Payment Processed
    Paid --> [*]
```

---

## 5. Database Schema Overview

### 5.1 Core Entities Relationship

```mermaid
erDiagram
    USER ||--o{ WARDROBE : owns
    USER ||--o| STYLIST_PROFILE : "has (optional)"
    USER ||--o{ STYLING_REQUEST : creates
    USER ||--o{ STYLING_SESSION : participates
    USER ||--o{ MESSAGE : sends
    USER ||--o{ REVIEW : writes
    USER ||--o| SUBSCRIPTION : subscribes

    WARDROBE ||--o{ CATEGORY : contains
    WARDROBE ||--o{ CLOTHING_ITEM : holds
    WARDROBE ||--o{ WARDROBE_SHARE : "shared via"

    CATEGORY ||--o{ CATEGORY : "has sub-categories"
    CATEGORY ||--o{ CLOTHING_ITEM : categorizes

    CLOTHING_ITEM ||--o{ OUTFIT_ITEM : "used in"

    USER ||--o{ OUTFIT : creates
    OUTFIT ||--o{ OUTFIT_ITEM : contains

    STYLING_REQUEST ||--|| STYLING_SESSION : "becomes"
    STYLING_SESSION ||--o{ MESSAGE : "has conversation"
    STYLING_SESSION ||--|| REVIEW : "receives"
    STYLING_SESSION ||--|| PAYMENT : "triggers"

    STYLIST_PROFILE ||--o{ STYLING_SESSION : conducts
    STYLIST_PROFILE ||--o{ REVIEW : receives
```

### 5.2 User Role Model

```mermaid
graph LR
    A[User Table] --> B{Role}
    B -->|USER| C[Can use wardrobe<br/>Can request styling]
    B -->|STYLIST| D[Has StylistProfile table<br/>Can accept requests]
    B -->|BOTH| E[Full access to both features<br/>Can switch modes]

    D --> F[StylistProfile Table]
    F --> G[expertise, pricing, rating]

    style A fill:#2196F3
    style F fill:#9C27B0
```

---

## 6. System Architecture

### 6.1 High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Mobile App - React Native]
        B[Web App - Future]
    end

    subgraph "API Layer"
        C[Express.js REST API]
        C1[Authentication Middleware]
        C2[Validation Middleware]
        C3[Rate Limiter]
    end

    subgraph "Business Logic Layer"
        D[Controllers]
        E[Services]
        F[Validators]
    end

    subgraph "Data Layer"
        G[Prisma ORM]
        H[(PostgreSQL - Supabase)]
    end

    subgraph "External Services"
        I[AWS S3 / Cloudinary - Images]
        J[Razorpay - Payments]
        K[Firebase - Push Notifications]
        L[WebRTC - Audio Calls]
        M[AI Service - Future]
    end

    A --> C
    B --> C
    C --> C1
    C1 --> C2
    C2 --> C3
    C3 --> D
    D --> E
    E --> F
    E --> G
    G --> H

    E --> I
    E --> J
    E --> K
    E --> L
    E -.-> M

    style A fill:#4CAF50
    style C fill:#2196F3
    style E fill:#FF9800
    style H fill:#9C27B0
```

### 6.2 API Request Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant API as Express API
    participant Auth as Auth Middleware
    participant Val as Validation
    participant Ctrl as Controller
    participant Svc as Service
    participant DB as Prisma/PostgreSQL

    C->>API: HTTP Request
    API->>Auth: Verify JWT Token

    alt Token Invalid
        Auth->>C: 401 Unauthorized
    else Token Valid
        Auth->>Val: Validate Request Body

        alt Validation Fails
            Val->>C: 400 Bad Request
        else Validation Passes
            Val->>Ctrl: Route to Controller
            Ctrl->>Svc: Call Service Method
            Svc->>DB: Query Database
            DB->>Svc: Return Data
            Svc->>Ctrl: Process & Return
            Ctrl->>C: 200 Success Response
        end
    end
```

### 6.3 Notification Flow

```mermaid
flowchart LR
    A[User Creates<br/>Styling Request] --> B[System Finds<br/>Matching Stylists]
    B --> C[Queue Push<br/>Notifications]
    C --> D[Firebase Cloud<br/>Messaging]
    D --> E1[📱 Stylist 1]
    D --> E2[📱 Stylist 2]
    D --> E3[📱 Stylist 3]

    E1 --> F{First to<br/>Accept?}
    E2 --> F
    E3 --> F

    F -->|Yes| G[Session Created]
    F -->|No| H[Request Taken<br/>Notification]

    style A fill:#4CAF50
    style G fill:#2196F3
    style H fill:#FF5722
```

---

## 7. Feature Modules Map

```mermaid
mindmap
  root((VYBE Platform))
    Authentication
      Email/Password
      Google OAuth
      Apple Sign-In
      JWT Tokens
    Wardrobe OS
      Create Wardrobes
      Add Items
      Categories
      Search & Filter
      Image Upload
    Outfit Builder
      Select Items
      Combine
      Save Outfits
      Tag Metadata
    Stylist Marketplace
      Stylist Profiles
      Request Matching
      Real-time Notifications
      Session Management
    Communication
      In-app Chat
      Audio Calls
      Image Sharing
      Outfit Sharing
    Collaboration
      Share Wardrobe
      Permission Levels
      Friend Invites
      Collaborative Outfits
    Payments
      Razorpay Integration
      Free Sessions Tracking
      Premium Subscriptions
      Stylist Earnings
    Reviews & Ratings
      Post-Session Rating
      Written Reviews
      Stylist Leaderboard
    AI Features (Future)
      Auto-tagging
      Outfit Generation
      Wardrobe Analytics
      Smart Suggestions
```

---

## 8. Data Flow Diagrams

### 8.1 Outfit Creation Flow

```mermaid
flowchart TD
    A[User Opens<br/>Outfit Builder] --> B[Fetch User's<br/>Wardrobe Items]
    B --> C[Display Items<br/>by Category]
    C --> D[User Selects<br/>Items]
    D --> E{Enough Items?}
    E -->|No| C
    E -->|Yes| F[Preview Outfit]
    F --> G[Add Metadata<br/>Name, Season, Occasion]
    G --> H[Save to Database]
    H --> I[Generate Outfit ID]
    I --> J[Create Outfit-Item<br/>Relations]
    J --> K[Success Response]
    K --> L[Display in<br/>Outfit Library]
```

### 8.2 Payment Flow

```mermaid
flowchart TD
    A[Session Ends] --> B{User Has Free<br/>Sessions Left?}
    B -->|Yes| C[Deduct Free Session<br/>Counter]
    C --> D[Mark Session as FREE]
    D --> E[Update Stylist Stats]
    E --> Z[Complete]

    B -->|No| F[Calculate Amount<br/>₹299]
    F --> G[Create Razorpay Order]
    G --> H[Redirect to<br/>Razorpay Checkout]
    H --> I{Payment Success?}
    I -->|No| J[Payment Failed]
    J --> K[Notify User]
    K --> H
    I -->|Yes| L[Verify Payment<br/>Signature]
    L --> M[Mark Payment as SUCCESS]
    M --> N[Calculate Platform Fee<br/>20% = ₹60]
    N --> O[Transfer to Stylist<br/>₹239]
    O --> P[Update Stylist Wallet]
    P --> E
```

---

## 📌 How to Use These Diagrams

### In GitHub
- Diagrams render automatically in `.md` files
- No additional tools needed

### In VS Code
1. Install extension: "Markdown Preview Mermaid Support"
2. Open this file
3. Press `Ctrl+Shift+V` (or `Cmd+Shift+V` on Mac)

### Online Rendering
- Visit: https://mermaid.live/
- Copy paste any diagram code
- Edit and export as PNG/SVG

### In Documentation Tools
- Notion: Use `/code` block with language `mermaid`
- Confluence: Install Mermaid macro
- GitBook: Native support

---

**Document Status:** Living Document
**Last Updated:** 2025-11-13
**Owner:** Product & Engineering Teams
