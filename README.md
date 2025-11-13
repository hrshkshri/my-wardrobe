# My Wardrobe Notes Backend

A TypeScript-based note backend API built with Express, Prisma, and PostgreSQL (Supabase).

## Features

- RESTful API for notes management
- TypeScript for type safety
- Prisma ORM for database management
- PostgreSQL database hosted on Supabase
- Prettier for code formatting
- Husky for pre-commit hooks
- CORS enabled

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Package Manager**: Yarn
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

## API Endpoints

### Notes

| Method | Endpoint        | Description           |
|--------|----------------|-----------------------|
| GET    | `/api/notes`    | Get all notes         |
| GET    | `/api/notes/:id`| Get a single note     |
| POST   | `/api/notes`    | Create a new note     |
| PUT    | `/api/notes/:id`| Update a note         |
| DELETE | `/api/notes/:id`| Delete a note         |

### Example Requests

**Create a note:**

```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "My First Note", "content": "This is the content"}'
```

**Get all notes:**

```bash
curl http://localhost:3000/api/notes
```

**Update a note:**

```bash
curl -X PUT http://localhost:3000/api/notes/{id} \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title", "content": "Updated content"}'
```

**Delete a note:**

```bash
curl -X DELETE http://localhost:3000/api/notes/{id}
```

## Project Structure

```
my-wardrobe/
├── prisma/
│   ├── schema.prisma       # Prisma schema
│   └── migrations/         # Database migrations
├── src/
│   ├── controllers/        # Route controllers
│   │   └── note.controller.ts
│   ├── routes/             # API routes
│   │   └── note.routes.ts
│   ├── lib/                # Utility libraries
│   │   └── prisma.ts       # Prisma client instance
│   ├── generated/          # Generated Prisma client
│   └── index.ts            # Application entry point
├── dist/                   # Compiled JavaScript (after build)
├── .env                    # Environment variables
├── .prettierrc             # Prettier configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies
```

## Database Schema

### Note Model

```prisma
model Note {
  id        String   @id @default(uuid())
  title     String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("notes")
}
```

## Development

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

## Contributing

1. Create a new branch
2. Make your changes
3. Commit your changes (pre-commit hooks will run automatically)
4. Push to the branch
5. Create a Pull Request

## License

MIT
