import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongoDBModule } from './mongo/mongo.module';
import { ChallengesModule } from './challenges/challenges.module';

@Module({
  imports: [MongoDBModule, UserModule, ChallengesModule],
})
export class AppModule {}
