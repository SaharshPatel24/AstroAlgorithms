import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

@Injectable()
export class MongoConfigService implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMongooseOptions(): Promise<MongooseModuleOptions> | MongooseModuleOptions {
    const uri = this.configService.get<string>('MONGODB_URI');
    return {
      uri
    };
  }
}
