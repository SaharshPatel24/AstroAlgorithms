import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { userSchema } from './schema/user.schema';

/**
 * Module responsible for user-related features.
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Users', schema: userSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
