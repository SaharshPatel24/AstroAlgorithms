import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/user.dto';
import { User } from './interface/user.interface';
import * as gravatar from 'gravatar';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel('Users') private readonly userModel: Model<User>) {}

  async createUser(userDto: CreateUserDto): Promise<User> {
    try {
      const { username, email, password } = userDto;

      // Generate a random avatar URL (replace this logic with your avatar generation method)
      const randomAvatarUrl = gravatar.url(email, { s: '200', d: 'wavatar', r: 'g' });

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await this.userModel.create({
        username,
        email,
        password: hashedPassword,
        profile: {
          avatarURL: randomAvatarUrl,
          completedChallenges: [],
          points: 0,
        },
        createdAt: new Date(),
        lastLoginAt: null,
      });

      return newUser;
    } catch (error) {
      if (error.code === 11000 || error.code === 11001) {
        if (error.keyPattern?.username) {
          throw new ConflictException('Username is not available');
        } else if (error.keyPattern?.email) {
          throw new ConflictException('Email is already registered');
        }
      } else {
        throw new InternalServerErrorException('Failed to create user');
      }
    }
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userModel.find();
  }

  async deleteUser(userId: string): Promise<User | null> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        return null;
      }
      return await this.userModel.findByIdAndDelete(userId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}
