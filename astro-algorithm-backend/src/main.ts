import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as express from 'express';

/**
 * Bootstraps the application.
 * @returns {Promise<void>}
 */
async function bootstrap() {
  try {
    // Create a NestJS application
    const app = await NestFactory.create(AppModule);

    // Define Swagger configuration
    const config = new DocumentBuilder()
      .setTitle('AstroAlgorithm')
      .setDescription('AstroAlgorithm, a space-themed coding challenges game.')
      .setVersion('1.0')
      .addTag('AstroAlgorithm')
      .build();

    // Create Swagger document
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // Define the path for Compodoc
    const compodocPath = 'C:/Users/patel/OneDrive/Desktop/AstroAlgorithms/astro-algorithm-backend/documentation';

    // Serve Compodoc files statically
    app.use('/', express.static(compodocPath));

    // Start the application on port 8080
    await app.listen(8080);
  } catch (error) {
    console.error('Error occurred while bootstrapping the application:', error);
  }
}

// Bootstrap the application
bootstrap();
