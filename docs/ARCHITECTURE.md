# Architecture Documentation

## Project Structure

```
src/
├── config/                 # Configuration files
│   ├── environment.ts     # Environment variables validation
│   ├── index.ts           # Config exports
│   ├── swagger.ts         # OpenAPI/Swagger configuration
│   └── sentry.ts          # Error tracking setup
├── constants/             # Application constants
│   └── index.ts          # Constant definitions
├── controllers/           # Request handlers
│   └── status.controller.ts
├── dtos/                  # Data Transfer Objects
│   ├── pagination.dto.ts
│   └── response.dto.ts
├── middleware/            # Express middleware
│   ├── errorHandler.middleware.ts
│   ├── validate.middleware.ts
│   ├── security.middleware.ts
│   ├── requestLogger.middleware.ts
│   ├── auth.middleware.ts
│   └── authorization.middleware.ts
├── routes/                # API route definitions
│   └── status.routes.ts
├── services/              # Business logic layer
│   └── status.service.ts
├── types/                 # TypeScript interfaces
│   └── status.types.ts
├── utils/                 # Utility functions
│   ├── AppError.ts
│   ├── logger.ts
│   ├── prisma.ts
│   ├── rateLimiter.ts
│   ├── corsOptions.ts
│   └── cache.ts
└── index.ts              # Application entry point

prisma/
├── schema.prisma         # Database schema
└── migrations/           # Database migrations

tests/
├── setup.ts             # Jest setup
└── unit/                # Unit tests
    └── services/
    └── controllers/

.github/
└── workflows/           # CI/CD pipelines
    ├── test.yml
    ├── lint.yml
    └── build.yml

docs/
├── API.md              # API documentation
├── SETUP.md            # Setup guide
└── ARCHITECTURE.md     # This file
```

## Layered Architecture

The application follows a layered architecture pattern:

```
Request
   ↓
[Middleware Layer]
  - Security (Helmet, Sanitization)
  - Compression
  - CORS
  - Request ID / Logging
  - Rate Limiting
  - Authentication
  - Authorization
   ↓
[Route Layer]
  - Route handlers with validation
  - Request routing
   ↓
[Controller Layer]
  - HTTP request/response handling
  - Input validation
  - Response formatting
   ↓
[Service Layer]
  - Business logic
  - Data processing
  - External service integration
   ↓
[Data Layer]
  - Prisma ORM
  - Database queries
  - Cache layer (Redis)
   ↓
[Response]
```

## Technology Stack

### Core
- **Language**: TypeScript 5.9.3
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.1.0

### Database & ORM
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma 6.19.0
- **Migrations**: Prisma Migrate

### Caching
- **Cache Store**: Redis
- **Client**: ioredis 5.8.2

### Validation
- **Schema Validation**: Zod 4.1.12
- **Input Sanitization**: express-mongo-sanitize

### Security
- **Security Headers**: Helmet 8.1.0
- **Rate Limiting**: express-rate-limit 8.2.1
- **CORS**: cors 2.8.5

### Logging & Monitoring
- **Logging**: Winston 3.18.3
- **Error Tracking**: Sentry (Optional)

### Documentation
- **API Docs**: Swagger/OpenAPI with swagger-jsdoc

### Testing
- **Test Framework**: Jest 30.2.0
- **Test Utilities**: jest-mock-extended

### Development
- **Code Formatting**: Prettier 3.6.2
- **Git Hooks**: Husky + lint-staged
- **Hot Reload**: Nodemon

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions

## Middleware Stack Order

Order matters in Express middleware:

1. **Security Middleware** (Helmet, Sanitization)
   - Applied first for maximum protection

2. **Compression**
   - Compress responses

3. **Request ID Middleware**
   - Generate request IDs for tracing

4. **CORS**
   - Handle cross-origin requests

5. **Body Parsing**
   - Parse JSON and URL-encoded bodies

6. **Rate Limiting**
   - Limit requests per IP

7. **Authentication** (Upcoming)
   - Verify user credentials

8. **Routes**
   - Handle specific endpoints

9. **Error Logging**
   - Log errors before handling

10. **Error Handler** (Last)
    - Global error handling

## Data Flow Example

### Request Flow: GET /api/status

```
1. Request arrives at server
2. Security middleware validates request
3. Compression middleware activated
4. Request ID generated (req.id)
5. CORS headers added
6. Body parsed (if applicable)
7. Rate limiter checks limit
8. Route matched: /api/status
9. Controller: statusController.getStatus() called
10. Service: statusService.getStatus() executes
11. Database query via Prisma (health check)
12. Service returns data
13. Controller formats response
14. Response sent to client
15. Error logging middleware (if error)
16. Response compressed if applicable
17. Response returned to client
```

## Error Handling Flow

```
Error occurs
   ↓
Caught by middleware or try-catch
   ↓
Throw AppError or native Error
   ↓
Error logging middleware logs error
   ↓
Global error handler processes error
   ↓
Format error response
   ↓
Send HTTP response
   ↓
Client receives error
```

## Configuration Management

### Environment-Based Configuration

```
development
  ├── LOG_LEVEL: debug
  ├── PORT: 3000
  └── CORS_ORIGIN: http://localhost:3000

staging
  ├── LOG_LEVEL: info
  ├── PORT: 3000
  └── CORS_ORIGIN: https://staging.mywardrobe.com

production
  ├── LOG_LEVEL: warn
  ├── PORT: 3000
  └── CORS_ORIGIN: https://mywardrobe.com
```

### Configuration Loading

1. Load `.env` file (dotenv)
2. Validate against Zod schema (src/config/environment.ts)
3. Export validated config (src/config/index.ts)
4. Use config throughout application (env.PORT, env.DATABASE_URL, etc.)

## Database Architecture

### Schema Organization

The database schema (prisma/schema.prisma) is organized into 6 domains:

1. **Authentication & Admin** - User accounts and admin management
2. **User Management** - Notifications and user-specific data
3. **Wardrobe System** - Wardrobe and clothing items
4. **Outfit Management** - Outfit creation and sharing
5. **Friendship & Social** - Social connections
6. **Stylist Marketplace** - Styling services and transactions

### Relations Strategy

- One-to-Many: User → Wardrobes
- Many-to-Many: User ↔ Friends (via Friendship)
- Hierarchical: Category → SubCategories

## Logging Strategy

### Log Levels

- **DEBUG**: Development information, detailed tracing
- **INFO**: General information messages
- **WARN**: Warning messages, non-critical issues
- **ERROR**: Error messages, critical issues

### Log Format

```json
{
  "level": "info",
  "message": "User logged in",
  "timestamp": "2024-11-25T10:30:00.000Z",
  "requestId": "req-12345",
  "userId": "user-123",
  "duration": "45ms",
  "context": {
    "method": "POST",
    "path": "/api/auth/login",
    "statusCode": 200
  }
}
```

## Caching Strategy

### Cache Layer (Redis)

Used for:
- Session data
- Frequently accessed data
- Rate limiting counters
- Search results

### Cache Keys Naming Convention

```
cache:domain:resource:id
cache:user:profile:123
cache:wardrobe:items:456
cache:outfit:suggestions:789
```

### TTL (Time To Live)

- SHORT: 5 minutes (user preferences)
- MEDIUM: 30 minutes (search results)
- LONG: 1 hour (static data)
- VERY_LONG: 24 hours (configuration)

## Security Architecture

### Defense Layers

1. **Helmet.js**
   - XSS protection
   - Clickjacking prevention
   - MIME type sniffing prevention

2. **Input Sanitization**
   - NoSQL injection prevention
   - Zod schema validation

3. **Rate Limiting**
   - Per-IP request limiting
   - Endpoint-specific limits

4. **CORS**
   - Origin validation
   - Credential handling

5. **HTTPS Enforcement** (Production)
   - Redirect HTTP → HTTPS

6. **Authentication** (Upcoming)
   - JWT token validation
   - Session management

7. **Authorization** (Upcoming)
   - Role-based access control
   - Resource ownership validation

## Testing Architecture

### Test Structure

```
tests/
├── setup.ts              # Jest configuration
├── unit/
│   ├── services/
│   │   └── status.service.test.ts
│   ├── controllers/
│   │   └── status.controller.test.ts
│   └── utils/
│       └── AppError.test.ts
├── integration/
│   └── api/
│       └── status.test.ts
└── e2e/
    └── health-check.test.ts
```

### Test Patterns

- Unit tests for services and utilities
- Integration tests for endpoints
- E2E tests for critical workflows
- Mock external dependencies
- Aim for 70%+ coverage

## Deployment Architecture

### Docker Deployment

```
Docker Image
├── Base: node:18-alpine
├── Build Stage
│   ├── Install dependencies
│   ├── Build TypeScript
│   └── Generate Prisma Client
└── Runtime Stage
    ├── Minimal dependencies
    ├── Non-root user
    └── Health checks
```

### Docker Compose Setup

- **PostgreSQL** - Database
- **Redis** - Cache
- **Node App** - Application server
- **Networks** - Service communication

### CI/CD Pipeline

```
GitHub Push
    ↓
[Tests] (test.yml)
    ↓
[Lint] (lint.yml)
    ↓
[Build] (build.yml)
    ├→ Build Docker image
    └→ Push to registry
    ↓
[Deploy] (manual or automated)
```

## Performance Considerations

### Optimization Strategies

1. **Database**
   - Index frequently queried fields
   - Use pagination for large datasets
   - Lazy load relations

2. **Caching**
   - Cache frequently accessed data
   - Implement cache invalidation
   - Use Redis for session data

3. **Response Compression**
   - gzip compression enabled
   - Reduce payload size

4. **Request Limiting**
   - Rate limiting prevents abuse
   - Protects from DoS attacks

5. **Lazy Loading**
   - Load data on demand
   - Reduce initial payload

## Scalability

### Horizontal Scaling

The application is designed for horizontal scaling:

1. **Stateless Design** - No server-side sessions
2. **External Cache** - Redis for shared state
3. **Database** - Separate PostgreSQL instance
4. **Load Balancer** - Distribute requests across instances
5. **API Gateway** - Manage traffic and routing

### Vertical Scaling

For temporary increased load:
- Increase server resources (CPU, RAM)
- Optimize database queries
- Implement query caching
- Use connection pooling

## Monitoring & Observability

### Key Metrics

- Request rate and latency
- Error rate and types
- Database query performance
- Cache hit/miss rate
- Server resource usage

### Tools

- **Logging**: Winston
- **Error Tracking**: Sentry (Optional)
- **APM**: Application Performance Monitoring (Upcoming)
- **Metrics**: Prometheus (Upcoming)
