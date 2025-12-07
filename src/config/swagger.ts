import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './environment';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Wardrobe API',
      version: '1.0.0',
      description: 'Digital wardrobe management and stylist marketplace API',
      contact: {
        name: 'My Wardrobe Team',
        email: 'support@mywardrobe.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Development server',
      },
      {
        url: 'https://staging-api.mywardrobe.com',
        description: 'Staging server',
      },
      {
        url: 'https://api.mywardrobe.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT authentication token',
        },
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API Key authentication',
        },
      },
      schemas: {
        // ===== Core Response Schemas =====
        ApiResponse: {
          type: 'object',
          description: 'Standard successful API response wrapper',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the request was successful',
              example: true,
            },
            message: {
              type: 'string',
              description: 'Human-readable response message',
              example: 'Operation completed successfully',
            },
            data: {
              type: 'object',
              description: 'Response data (structure varies by endpoint)',
            },
            traceId: {
              type: 'string',
              description: 'Request trace ID for debugging and support',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the response was generated',
              example: '2025-12-07T10:15:00.000Z',
            },
          },
          required: ['success', 'message', 'timestamp'],
        },

        Error: {
          type: 'object',
          description: 'Standard error response',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Resource not found',
            },
            errors: {
              type: 'object',
              description: 'Detailed validation errors (optional)',
              example: {
                email: ['Email is required', 'Email must be valid'],
                password: ['Password must be at least 8 characters'],
              },
            },
            traceId: {
              type: 'string',
              description: 'Request trace ID for debugging',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the error occurred',
            },
          },
          required: ['success', 'message', 'timestamp'],
        },

        PaginatedResponse: {
          type: 'object',
          description: 'Paginated list response',
          properties: {
            data: {
              type: 'array',
              description: 'Array of items',
              items: {
                type: 'object',
              },
            },
            pagination: {
              type: 'object',
              description: 'Pagination metadata',
              properties: {
                page: {
                  type: 'integer',
                  description: 'Current page number',
                  example: 1,
                },
                pageSize: {
                  type: 'integer',
                  description: 'Number of items per page',
                  example: 10,
                },
                total: {
                  type: 'integer',
                  description: 'Total number of items',
                  example: 250,
                },
                totalPages: {
                  type: 'integer',
                  description: 'Total number of pages',
                  example: 25,
                },
                hasNextPage: {
                  type: 'boolean',
                  description: 'Whether there is a next page',
                  example: true,
                },
                hasPreviousPage: {
                  type: 'boolean',
                  description: 'Whether there is a previous page',
                  example: false,
                },
              },
              required: ['page', 'pageSize', 'total', 'totalPages'],
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/**/*.ts', './src/controllers/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

/**
 * Swagger UI configuration
 */
export const swaggerUiOptions = {
  customSiteTitle: 'My Wardrobe API Documentation',
};

export default { swaggerSpec, swaggerUiOptions };
