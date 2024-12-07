import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Employment Tracker API',
      version: '1.0.0',
      description: 'Documentation de l’API pour gérer les personnes et leurs emplois.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement',
      },
    ],
    components: {
      schemas: {
        Person: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID unique de la personne',
            },
            firstname: {
              type: 'string',
              description: 'Prénom de la personne',
            },
            lastname: {
              type: 'string',
              description: 'Nom de la famille de la personne',
            },
            birthdate: {
              type: 'string',
              format: 'date',
              description: 'Date de naissance de la personne',
            },
            jobs: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Job',
              },
              description: 'Liste des emplois associés à cette personne',
            },
          },
          required: ['firstname', 'lastname', 'birthdate'],
        },
        Job: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID unique de l\'emploi',
            },
            company: {
              type: 'string',
              description: 'Nom de l\'entreprise',
            },
            position: {
              type: 'string',
              description: 'Poste occupé',
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: 'Date de début de l\'emploi',
            },
            endDate: {
              type: 'string',
              format: 'date',
              nullable: true,
              description: 'Date de fin de l\'emploi (optionnelle)',
            },
            personId: {
              type: 'string',
              format: 'uuid',
              description: 'ID de la personne associée',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
