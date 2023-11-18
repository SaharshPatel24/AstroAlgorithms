import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './interface/user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
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

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findUserById(id);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  @Put()
  async updateUser(@Body() updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const updatedUser = await this.userService.updateUser(updateUserDto);
      if (updatedUser === null) {
        throw new NotFoundException('User not found');
      }
      return updatedUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete()
  async deleteUser(@Body() requestedUser: User): Promise<User> {
    const deletedUser = await this.userService.deleteUser(requestedUser);
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return deletedUser;
  }
}
