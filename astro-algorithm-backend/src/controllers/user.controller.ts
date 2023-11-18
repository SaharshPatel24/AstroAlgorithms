import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Controller('users')
export class UserController {
  public constructor(public readonly userService: UserService) {}

  @Get()
  public getAllUsers(): User[] {
    return this.userService.getAllUsers();
  }

  @Post()
  public createUser(@Body() userData: User): string {
    return this.userService.createUser(userData);
  }
}
