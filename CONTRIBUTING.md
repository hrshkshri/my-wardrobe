# Contributing Guidelines

Thank you for contributing to My Wardrobe! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**: `git clone <your-fork-url>`
3. **Create a feature branch**: `git checkout -b feature/feature-name`
4. **Make your changes**
5. **Push to your fork**: `git push origin feature/feature-name`
6. **Create a Pull Request**

## Development Setup

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Run tests
yarn test

# Format code
yarn format

# Type check
yarn build
```

## Code Standards

### TypeScript

- Use strict mode (enabled in tsconfig.json)
- Add type annotations for function parameters and returns
- Use interfaces for object types
- Avoid `any` type

```typescript
// Good
function getUser(id: string): Promise<User | null> {
  // ...
}

// Avoid
function getUser(id: any): any {
  // ...
}
```

### Naming Conventions

- **Files**: kebab-case for file names (e.g., `status.routes.ts`)
- **Functions**: camelCase (e.g., `getStatusHealth`)
- **Classes**: PascalCase (e.g., `StatusController`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `HTTP_STATUS_CODES`)
- **Interfaces**: PascalCase with I prefix (e.g., `IStatusResponse`)

### Comments

Add comments for:
- Complex business logic
- Non-obvious code
- Public APIs and functions
- Edge cases and assumptions

```typescript
/**
 * Get user status with caching
 * @param userId - User ID to fetch
 * @returns User status or null if not found
 */
export const getUserStatus = async (userId: string): Promise<Status | null> => {
  // Implementation
};
```

### Error Handling

Always handle errors appropriately:

```typescript
try {
  const result = await someOperation();
  return result;
} catch (error) {
  logger.error('Operation failed', { error: error instanceof Error ? error.message : 'Unknown error' });
  throw new AppError('Operation failed', 500);
}
```

## Testing

### Test Coverage

- Aim for 70%+ coverage
- Test critical business logic
- Test error scenarios
- Test edge cases

### Writing Tests

```typescript
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('StatusService', () => {
  let service: StatusService;

  beforeEach(() => {
    service = new StatusService();
  });

  it('should return server status', async () => {
    const result = await service.getStatus();
    expect(result).toHaveProperty('status', 'healthy');
  });

  it('should handle database error', async () => {
    // Mock error scenario
    jest.spyOn(db, 'query').mockRejectedValue(new Error('DB Error'));

    expect(() => service.getStatus()).rejects.toThrow();
  });
});
```

## Git Workflow

### Commit Messages

Follow conventional commits format:

```
type(scope): subject

Body (optional)
Footer (optional)
```

**Types**: feat, fix, docs, style, refactor, test, chore

**Examples**:
```
feat(auth): add JWT token validation

fix(wardrobe): resolve item deletion issue

docs(api): update endpoint documentation

refactor(services): improve code readability

test(controllers): add endpoint tests
```

### Branch Naming

- `feature/feature-name` - New features
- `fix/issue-name` - Bug fixes
- `docs/doc-name` - Documentation
- `refactor/code-area` - Code refactoring

### Pull Request Process

1. **Update your branch** from main
2. **Run all tests**: `yarn test`
3. **Check formatting**: `yarn format:check`
4. **Run build**: `yarn build`
5. **Write descriptive PR title and description**
6. **Reference related issues**: `Closes #123`
7. **Request review** from maintainers
8. **Address review comments**
9. **Ensure CI passes**

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Testing Done
- [ ] Unit tests added
- [ ] Integration tests added
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] No new warnings generated
- [ ] Tests pass locally
- [ ] Documentation updated
```

## Code Review Process

### For Reviewers

- Review for correctness and code quality
- Check test coverage
- Verify documentation
- Ensure consistency with codebase standards
- Provide constructive feedback

### For Contributors

- Respond to review comments promptly
- Ask for clarification if needed
- Don't take feedback personally
- Update code based on feedback
- Re-request review after changes

## Database Changes

When modifying the database schema:

1. **Update** `prisma/schema.prisma`
2. **Create migration**: `yarn db:migrate:create -- --name migration_name`
3. **Review migration** in `prisma/migrations/`
4. **Test locally**: `yarn db:push`
5. **Document changes** in PR description

## Adding New Features

### Feature Checklist

1. **Create issue** describing the feature
2. **Create branch** from main
3. **Implement feature** following standards
4. **Add tests** for new functionality
5. **Update documentation**
6. **Create PR** with description
7. **Respond to review comments**
8. **Merge** when approved

### Adding New API Endpoint

```typescript
// 1. Create validator (src/validators/user.validator.ts)
export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

// 2. Create service (src/services/user.service.ts)
export class UserService {
  async createUser(data: z.infer<typeof createUserSchema>) {
    // Business logic
  }
}

// 3. Create controller (src/controllers/user.controller.ts)
export const createUser = asyncHandler(async (req, res) => {
  const data = createUserSchema.parse(req.body);
  const user = await userService.createUser(data);
  res.status(201).json(createSuccessResponse('User created', user));
});

// 4. Add routes (src/routes/user.routes.ts)
router.post('/', validate(createUserSchema), createUser);

// 5. Mount in index.ts
app.use('/api/users', userRoutes);

// 6. Add tests (tests/unit/controllers/user.controller.test.ts)
```

## Documentation

### When to Update Docs

- Adding new features
- Changing API behavior
- Adding new environment variables
- Changing deployment process
- Adding new dependencies

### Documentation Files

- **README.md** - Project overview
- **docs/API.md** - API documentation
- **docs/SETUP.md** - Setup instructions
- **docs/ARCHITECTURE.md** - Architecture details
- **CONTRIBUTING.md** - Contributing guidelines

## Performance Considerations

- Avoid N+1 queries with proper Prisma relations
- Use pagination for large datasets
- Cache frequently accessed data
- Lazy load relations
- Optimize database indexes

## Security Considerations

- Always validate user input
- Escape output to prevent XSS
- Use parameterized queries (Prisma handles this)
- Never log sensitive information
- Use environment variables for secrets
- Implement rate limiting
- Validate CORS origins

## Questions or Need Help?

1. Check existing documentation
2. Search closed issues
3. Create a new discussion
4. Contact maintainers

## Code of Conduct

- Be respectful and inclusive
- Welcome diverse perspectives
- Provide constructive feedback
- Focus on the code, not the person
- Avoid harassment or discrimination

Thank you for contributing to My Wardrobe!
