import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoConfigService } from './mongo.service';

/**
 * Module responsible for MongoDB Connection.
 */
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongoConfigService,
      inject: [ConfigService],
    }),
  ],
})
export class MongoDBModule {}
