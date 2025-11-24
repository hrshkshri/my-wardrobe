# My Wardrobe Backend

A robust TypeScript-based backend API built with Express, Prisma, and PostgreSQL (Supabase).

## Features

- **TypeScript** - Full type safety across the entire codebase
- **Robust Error Handling** - Custom AppError class with global error handler
- **Service-Controller Architecture** - Clean separation of concerns
- **Express Async Handler** - Better async/await error management
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Hosted on Supabase
- **Global Error Handler Middleware** - Centralized error handling
- **Prettier** - Consistent code formatting
- **Husky + lint-staged** - Pre-commit hooks for code quality
- **CORS** - Cross-origin resource sharing enabled
- **Consistent API Response Format** - Standardized responses across all endpoints

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Package Manager**: Yarn
- **Error Handling**: express-async-handler + Custom AppError
- **Code Formatting**: Prettier
- **Git Hooks**: Husky + lint-staged

## Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- Supabase account (for database)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd my-wardrobe
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Set up environment variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Update the `.env` file with your Supabase credentials:

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
PORT=3000
NODE_ENV=development
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

**Finding your Supabase credentials:**

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** > **Database** > **Connection string** (copy the connection string)
4. Go to **Settings** > **API** (copy the URL and anon key)

### 4. Set up the database

Define your models in `prisma/schema.prisma`, then:

Generate Prisma Client:

```bash
yarn db:generate
```

Run database migrations:

```bash
yarn db:migrate
```

Or push the schema directly (for development):

```bash
yarn db:push
```

### 5. Start the development server

```bash
yarn dev
```

The server will start on `http://localhost:3000`

## Available Scripts

- `yarn dev` - Start development server with hot reload
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting
- `yarn db:generate` - Generate Prisma Client
- `yarn db:push` - Push schema to database (development)
- `yarn db:migrate` - Run database migrations
- `yarn db:studio` - Open Prisma Studio (database GUI)

## Project Structure

```
my-wardrobe/
├── prisma/
│   ├── schema.prisma           # Prisma schema - Define your models here
│   └── migrations/             # Database migrations
├── src/
│   ├── controllers/            # HTTP request/response handlers
│   ├── services/               # Business logic layer
│   ├── routes/                 # API route definitions
│   ├── middleware/             # Custom middleware
│   │   └── errorHandler.middleware.ts  # Global error handler
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Utility functions & classes
│   │   └── AppError.ts         # Custom error class
│   ├── lib/                    # External libraries setup
│   │   └── prisma.ts           # Prisma client instance
│   ├── generated/              # Generated Prisma client
│   └── index.ts                # Application entry point
├── dist/                       # Compiled JavaScript (after build)
├── .env                        # Environment variables (not in git)
├── .env.example                # Environment variables template
├── .prettierrc                 # Prettier configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Project dependencies
```

## Architecture

The project follows a **layered architecture** pattern:

1. **Routes** (`src/routes/`): Define API endpoints and map them to controllers
2. **Controllers** (`src/controllers/`): Handle HTTP requests/responses and input validation
3. **Services** (`src/services/`): Contain business logic and database operations
4. **Middleware** (`src/middleware/`): Process requests before they reach controllers
5. **Types** (`src/types/`): TypeScript interfaces and type definitions
6. **Utils** (`src/utils/`): Reusable utility functions and classes

### Request Flow

```
Request → Middleware → Route → Controller → Service → Database
                                     ↓
Response ← Error Handler ← Controller ← Service ← Database
```

## API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful message",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message description"
}
```

## Error Handling

The application uses a centralized error handling system:

### Custom AppError Class
```typescript
throw new AppError('Error message', 400);
```

### Prisma Error Handling
The global error handler automatically catches and formats Prisma errors:
- `P2002` - Unique constraint violation (409)
- `P2025` - Record not found (404)
- `P2003` - Foreign key constraint (400)

## Database Schema

Define your models in `prisma/schema.prisma`. Example:

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

After updating the schema:
```bash
yarn db:migrate  # For production
# or
yarn db:push     # For development
```

## Development

### Adding a New Feature

1. **Define Model** - Add to `prisma/schema.prisma`
2. **Create Types** - Add interfaces to `src/types/`
3. **Create Service** - Add business logic to `src/services/`
4. **Create Controller** - Add request handlers to `src/controllers/`
5. **Create Routes** - Add endpoints to `src/routes/`
6. **Register Routes** - Import and use in `src/index.ts`

### Code Formatting

This project uses Prettier for code formatting. Husky runs Prettier automatically on pre-commit.

To manually format code:

```bash
yarn format
```

To check formatting:

```bash
yarn format:check
```

## Example: Creating a New Resource

Here's a complete example of adding a "User" resource:

### 1. Define the Prisma Model
```prisma
// prisma/schema.prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2. Create Types
```typescript
// src/types/user.types.ts
export interface CreateUserData {
  email: string;
  name: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
}
```

### 3. Create Service
```typescript
// src/services/user.service.ts
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';
import { CreateUserData, UpdateUserData } from '../types/user.types';

const userService = {
  getAllUsers: async () => {
    return await prisma.user.findMany();
  },

  createUser: async (userData: CreateUserData) => {
    return await prisma.user.create({ data: userData });
  },

  // Add more methods...
};

export default userService;
```

### 4. Create Controller
```typescript
// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import userService from '../services/user.service';

const userController = {
  getAllUsers: expressAsyncHandler(async (req: Request, res: Response) => {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    });
  }),

  // Add more methods...
};

export default userController;
```

### 5. Create Routes
```typescript
// src/routes/user.routes.ts
import { Router } from 'express';
import userController from '../controllers/user.controller';

const router = Router();

router.get('/', userController.getAllUsers);
// Add more routes...

export default router;
```

### 6. Register Routes
```typescript
// src/index.ts
import userRoutes from './routes/user.routes';

// In the API Routes section:
app.use('/api/users', userRoutes);
```

## Contributing

1. Create a new branch
2. Make your changes
3. Commit your changes (pre-commit hooks will run automatically)
4. Push to the branch
5. Create a Pull Request

## License

MIT
