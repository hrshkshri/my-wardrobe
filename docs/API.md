# API Documentation

## Overview

The My Wardrobe API provides endpoints for managing digital wardrobes, outfit creation, and stylist marketplace features.

**Base URL**: `http://localhost:3000/api` (Development)

**API Documentation (Swagger UI)**: `http://localhost:3000/api-docs`

## Response Format

All API responses follow a standard format:

### Success Response

```json
{
  "success": true,
  "message": "Operation successful message",
  "data": {
    "id": "123",
    "name": "Example"
  },
  "traceId": "req-12345",
  "timestamp": "2024-11-25T10:30:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": ["Validation error message"]
  },
  "traceId": "req-12345",
  "timestamp": "2024-11-25T10:30:00.000Z"
}
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 204 | No Content - Successful but no content returned |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Duplicate entry |
| 422 | Unprocessable Entity - Validation error |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - Server overloaded |

## Endpoints

### Health Check

#### Get Server Status

```
GET /api/status
```

Returns server health status and database connection status.

**Response**:
```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "status": "healthy",
    "timestamp": "2024-11-25T10:30:00.000Z",
    "uptime": 1234.567,
    "environment": "development",
    "database": "connected",
    "version": "1.0.0"
  }
}
```

#### Ping

```
GET /api/status/ping
```

Simple ping endpoint to check server availability.

**Response**:
```json
{
  "success": true,
  "message": "pong",
  "data": {
    "timestamp": "2024-11-25T10:30:00.000Z"
  }
}
```

## Authentication

Currently under development. When implemented, authentication will use JWT tokens:

```
Authorization: Bearer <jwt-token>
```

### Upcoming Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - User logout

## Pagination

List endpoints support pagination with the following query parameters:

```
GET /api/users?page=1&pageSize=10&sortBy=createdAt&sortOrder=desc
```

**Query Parameters**:
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 10, max: 100)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - asc or desc (default: desc)

**Paginated Response**:
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    { "id": "1", "name": "User 1" }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## Error Handling

### Validation Errors

```json
{
  "success": false,
  "message": "Validation error: body.email: Invalid email format, body.password: Password must be at least 8 characters",
  "errors": {
    "email": ["Invalid email format"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

### Not Found

```json
{
  "success": false,
  "message": "User not found"
}
```

### Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

### Server Error

```json
{
  "success": false,
  "message": "Internal server error",
  "traceId": "req-abc123"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Global**: 100 requests per 15 minutes
- **Auth endpoints**: 5 requests per hour
- **API endpoints**: 30 requests per minute

Rate limit information is included in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640161800
```

## CORS

CORS is enabled with the following configuration:

- **Allowed Origins**: Configured via `CORS_ORIGIN` environment variable
- **Allowed Methods**: GET, POST, PUT, DELETE, PATCH
- **Allowed Headers**: Content-Type, Authorization

## API Versioning

Currently on API v1. Future versions will be accessible via:

```
GET /api/v2/endpoint
```

## Request/Response Examples

### Example: Get Server Status

**Request**:
```bash
curl -X GET http://localhost:3000/api/status \
  -H "Content-Type: application/json"
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "status": "healthy",
    "timestamp": "2024-11-25T10:30:00.000Z",
    "uptime": 1234.567,
    "environment": "development",
    "database": "connected",
    "version": "1.0.0"
  }
}
```

## Request Headers

Recommended headers for all requests:

```
Content-Type: application/json
X-Request-ID: unique-request-identifier (optional)
Authorization: Bearer <jwt-token> (when authenticated)
```

## Troubleshooting

### Getting 401 Unauthorized

- Check your JWT token is valid and not expired
- Ensure token is included in Authorization header
- Token format should be: `Bearer <token>`

### Getting 403 Forbidden

- Your user role doesn't have permission for this action
- Contact administrator to request access

### Getting 422 Unprocessable Entity

- Check request body against API schema
- Validate all required fields are present
- Check field formats and types

### Getting 503 Service Unavailable

- Server is temporarily overloaded
- Database connection issue
- Retry request after a few seconds

## Best Practices

1. **Always use HTTPS** in production
2. **Validate responses** on the client side
3. **Implement retry logic** for transient failures
4. **Cache responses** where appropriate
5. **Use request IDs** for debugging
6. **Monitor rate limits** and adjust requests accordingly
7. **Handle errors gracefully** with appropriate UI feedback

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review logs with the provided `traceId`
3. Contact the development team
