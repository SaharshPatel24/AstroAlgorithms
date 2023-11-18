import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Module responsible for initializing the MongoDB connection.
 */
@Module({
  imports: [
    ConfigModule.forRoot(), // Ensure ConfigModule is imported
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to use ConfigService
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService], // Inject ConfigService into the factory
    }),
  ],
})
export class MongoDBModule {}
