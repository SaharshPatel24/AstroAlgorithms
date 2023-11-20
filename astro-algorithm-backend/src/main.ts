import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';

/**
 * Bootstraps the application.
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
      .build();

    const customOptions: SwaggerCustomOptions = {
        customSiteTitle: 'AstroAlgorithm API',
    }

    // Create Swagger document
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, customOptions);

    // Define the path for Compodoc
    const compodocPath = path.join(__dirname, '../documentation');

    // Serve Compodoc files statically
    app.use('/', express.static(compodocPath));

    // Start the application on port 8080
  await app.listen(3000);
  } catch (error) {
    console.error('Error occurred while bootstrapping the application:', error);
  }
}

// Bootstrap the application
bootstrap();
