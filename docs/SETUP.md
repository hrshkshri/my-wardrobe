# Production Setup Guide

This guide covers setting up the My Wardrobe API for development, staging, and production environments.

## Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis 7+ (optional, for caching)
- Docker & Docker Compose (for containerized setup)
- Yarn package manager

## Local Development Setup

### 1. Install Dependencies

```bash
yarn install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mywardrobe
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
```

### 3. Database Setup

```bash
# Generate Prisma Client
yarn db:generate

# Push schema to database
yarn db:push

# Or run migrations
yarn db:migrate
```

### 4. Start Development Server

```bash
yarn dev
```

The server will start at `http://localhost:3000`

API Documentation will be available at `http://localhost:3000/api-docs`

## Docker Setup

### Using Docker Compose (Recommended for Local Development)

```bash
# Build and start services
yarn docker:up

# View logs
yarn docker:logs

# Stop services
yarn docker:down
```

This will start:
- PostgreSQL database
- Redis cache
- Node.js application

### Building Docker Image

```bash
# Build image
yarn docker:build

# Run image
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://... \
  -e SUPABASE_URL=https://... \
  -e SUPABASE_ANON_KEY=your-key \
  mywardrobe-api:latest
```

## Testing

### Run Tests

```bash
# Run all tests
yarn test

# Watch mode
yarn test:watch

# With coverage report
yarn test:coverage

# CI mode
yarn test:ci
```

## Building for Production

```bash
# Build TypeScript
yarn build

# Start production server
yarn start
```

## Code Quality

### Format Code

```bash
# Format code
yarn format

# Check formatting
yarn format:check
```

## Database Management

```bash
# Open Prisma Studio GUI
yarn db:studio

# Create a new migration
yarn db:migrate:create -- --name migration_name

# Push schema changes
yarn db:push
```

## Environment Variables

### Required Variables

- `DATABASE_URL` - PostgreSQL connection string
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key

### Optional Variables

- `NODE_ENV` - Set to `development`, `staging`, or `production`
- `PORT` - Server port (default: 3000)
- `CORS_ORIGIN` - CORS allowed origin
- `LOG_LEVEL` - Logging level: `debug`, `info`, `warn`, `error`

## Security Considerations

1. **Environment Variables**: Never commit `.env` file
2. **HTTPS**: Always use HTTPS in production
3. **API Keys**: Rotate keys regularly
4. **Database**: Use strong passwords and SSL connections
5. **Rate Limiting**: Adjust limits based on your load
6. **CORS**: Configure specific origins in production

## Monitoring & Logging

The application uses Winston for logging. Logs are structured with the following information:

- Timestamp
- Log level
- Message
- Context (requestId, userId, etc.)

Configure log level with `LOG_LEVEL` environment variable.

## Troubleshooting

### Database Connection Failed

- Check `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Verify database credentials

### Port Already in Use

```bash
# Find and kill process using port 3000
lsof -i :3000
kill -9 <PID>
```

### Module Not Found

```bash
# Regenerate Prisma Client
yarn db:generate

# Reinstall dependencies
rm -rf node_modules
yarn install
```

## CI/CD Pipeline

GitHub Actions workflows are configured in `.github/workflows/`:

- `test.yml` - Run tests on every PR
- `lint.yml` - Code quality checks
- `build.yml` - Build and push Docker image

See individual workflow files for configuration details.
