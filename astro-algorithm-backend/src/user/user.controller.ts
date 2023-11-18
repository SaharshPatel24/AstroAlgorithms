import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  NotFoundException,
  BadRequestException,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { User } from './interface/user.interface';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

/**
 * Controller for managing users
 */
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Create a new user
   * @param {CreateUserDto} createUserDto - User data to be created
   * @returns {Promise<User>} - The created user
   */
  @Post()
  @ApiResponse({ status: 201, description: 'The user has been successfully created.'})
  @UsePipes(new ValidationPipe({ transform: true }))
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Get all users
   * @returns {Promise<User[]>} - Array of users
   */
  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.findAllUsers();
  }

  /**
   * Delete a user by ID
   * @param {string} userId - ID of the user to be deleted (passed in the request body)
   * @returns {Promise<User>} - The deleted user
   */
  @Delete()
  async deleteUser(@Body('userId') userId: string): Promise<User> {
    const deletedUser = await this.userService.deleteUser(userId);
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return deletedUser;
  }
}
