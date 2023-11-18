import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongoDBModule } from './mongo/mongo.module';

@Module({
  imports: [MongoDBModule, UserModule],
})
export class AppModule {}
