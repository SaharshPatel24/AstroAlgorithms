import {
  BadRequestException,
  ConflictException,
  Injectable,
  Module,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './interface/user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel('users') private readonly userModel: Model<User>) {}

  async createUser(userDto: CreateUserDto): Promise<User> {
    try {
      const newUser = await this.userModel.create(userDto);
      return newUser;
    } catch (error) {
      if (error.code === 11000 || error.code === 11001) {
        throw new ConflictException('Email already exists');
      } else {
        throw error;
      }
    }
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findUserById(id: string): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null
    }
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      return null;
    }
    return user;
  }

  async updateUser(userDto: UpdateUserDto): Promise<User | null> {
    try {
      if (!Types.ObjectId.isValid(userDto._id)) {
        return null;
      }
      return await this.userModel.findByIdAndUpdate(userDto._id, userDto, { new: true });
    } catch (error) {
      if (error.code === 11000 || error.code === 11001) {
        throw new ConflictException('Email already exists');
      } else {
        throw error;
      }
    }
  }

  async deleteUser(user: User): Promise<User | null> {
    return await this.userModel.findByIdAndDelete(user._id);
  }
}
