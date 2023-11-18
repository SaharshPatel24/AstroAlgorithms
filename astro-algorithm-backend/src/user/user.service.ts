import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/user.dto';
import { User } from './interface/user.interface';
import * as gravatar from 'gravatar';
import * as bcrypt from 'bcrypt';

/**
 * Service handling user-related operations.
 */
@Injectable()
export class UserService {
  constructor(@InjectModel('Users') private readonly userModel: Model<User>) {}

  /**
   * Create a new user.
   * @param {CreateUserDto} userDto - User data for creation.
   * @returns {Promise<User>} Newly created user.
   * @throws {ConflictException} If username or email already exists.
   * @throws {InternalServerErrorException} If creation fails due to unexpected errors.
   */
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

  /**
   * Retrieve all users.
   * @returns {Promise<User[]>} List of all users.
   */
  async findAllUsers(): Promise<User[]> {
    // Retrieves all users from the database
    return await this.userModel.find();
  }

  /**
   * Delete a user by ID.
   * @param {string} userId - ID of the user to be deleted.
   * @returns {Promise<User | null>} Deleted user if found, otherwise null.
   * @throws {InternalServerErrorException} If deletion fails due to unexpected errors.
   */
  async deleteUser(userId: string): Promise<User | null> {
    try {
      // Check if the provided userId is a valid MongoDB ObjectId
      if (!Types.ObjectId.isValid(userId)) {
        return null;
      }
      // Find and delete the user by ID
      return await this.userModel.findByIdAndDelete(userId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
