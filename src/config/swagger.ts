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
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the request was successful',
            },
            message: {
              type: 'string',
              description: 'Response message',
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
            traceId: {
              type: 'string',
              description: 'Request trace ID for debugging',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of the response',
            },
          },
          required: ['success', 'message'],
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                pageSize: { type: 'integer' },
                total: { type: 'integer' },
                totalPages: { type: 'integer' },
                hasNextPage: { type: 'boolean' },
                hasPreviousPage: { type: 'boolean' },
              },
              required: ['page', 'pageSize', 'total', 'totalPages'],
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
            errors: {
              type: 'object',
              description: 'Validation errors (optional)',
            },
            traceId: {
              type: 'string',
              description: 'Request trace ID for debugging',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
          required: ['success', 'message'],
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
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'My Wardrobe API Documentation',
  defaultModelsExpandDepth: 1,
  defaultModelExpandDepth: 1,
  deepLinking: true,
  presets: [
    'swaggerUIBundle.presets.apis',
    'swaggerUIBundle.SwaggerUIStandalonePreset',
  ],
};

export default { swaggerSpec, swaggerUiOptions };
