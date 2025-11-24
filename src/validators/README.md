# Validators

This folder contains Zod validation schemas for validating request data.

## Usage

### 1. Create a validator

Create a new validator file in this directory:

```typescript
import { z } from 'zod';
import { emailSchema, passwordSchema } from './common.validator';

export const createItemSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    price: z.number().positive('Price must be positive'),
  }),
});
```

### 2. Use in routes

Apply the validator to your routes using the validation middleware:

```typescript
import { Router } from 'express';
import { validate } from '../middleware/validate.middleware';
import { createItemSchema } from '../validators/item.validator';
import itemController from '../controllers/item.controller';

const router = Router();

router.post('/', validate(createItemSchema), itemController.createItem);

export default router;
```

### 3. Error handling

Validation errors are automatically caught and formatted by the error handler middleware. They return a 400 status with detailed error messages.

Example error response:
```json
{
  "success": false,
  "message": "Validation error: body.email: Invalid email format, body.password: Password must be at least 8 characters"
}
```

## Available Common Validators

- `uuidSchema` - Validates UUID format
- `emailSchema` - Validates email format
- `passwordSchema` - Validates password (min 8 chars, letter + number)
- `phoneSchema` - Validates international phone format
- `urlSchema` - Validates URL format
- `dateSchema` - Validates datetime format
- `paginationSchema` - Validates pagination params (page, limit)
- `sortOrderSchema` - Validates sort order ('asc' | 'desc')
- `idParamSchema` - Validates UUID in route params

## Examples

Check `example.validator.ts` for complete examples of:
- Creating resources
- Updating resources
- Getting resources by ID
- Query parameters with pagination
- Login/authentication validation
