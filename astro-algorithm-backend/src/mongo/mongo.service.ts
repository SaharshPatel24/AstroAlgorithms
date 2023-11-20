import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

/**
 * Service responsible for creating Mongoose connection options based on configuration settings.
 * This service implements the MongooseOptionsFactory interface to generate Mongoose options.
 */
@Injectable()
export class MongoConfigService implements MongooseOptionsFactory {
  /**
   * Constructs the MongoConfigService.
   * @param {ConfigService} configService - The Nest ConfigService providing access to configuration values.
   */
  constructor(private readonly configService: ConfigService) {}

  /**
   * Creates Mongoose connection options based on configuration.
   * Fetches the 'MONGODB_URI' value from the configuration and sets it as the URI for the Mongoose connection.
   * @returns {Promise<MongooseModuleOptions> | MongooseModuleOptions} - Mongoose connection options
   */
  createMongooseOptions(): Promise<MongooseModuleOptions> | MongooseModuleOptions {
    const uri = this.configService.get<string>('MONGODB_URI');
    return {
      uri
    };
  }
}
