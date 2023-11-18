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

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.findAllUsers();
  }

  @Delete()
  async deleteUser(@Body() userId: string): Promise<User> {
    const deletedUser = await this.userService.deleteUser(userId);
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return deletedUser;
  }
}
