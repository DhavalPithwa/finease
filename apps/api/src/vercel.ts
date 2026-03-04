import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import express, { Request, Response } from 'express';

const server = express();

export const createServer = async (expressInstance: express.Express) => {
  try {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressInstance),
    );

    app.enableCors();

    const config = new DocumentBuilder()
      .setTitle('FinEase Wealth Architect API')
      .setDescription(
        'Personal finance management API for tracking wealth, assets, and goals.',
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter Firebase ID token',
          in: 'header',
        },
        'bearer',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document, {
      explorer: true,
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    await app.init();
    return app;
  } catch (error) {
    console.error('Error during app initialization:', error);
    throw error;
  }
};

// Vercel entry point
let cachedHandler: express.Express;

export default async (req: Request, res: Response) => {
  if (!cachedHandler) {
    await createServer(server);
    cachedHandler = server;
  }
  cachedHandler(req, res);
};
