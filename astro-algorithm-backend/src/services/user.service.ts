import { Injectable } from '@nestjs/common';
import { User } from '../models/user.model';

@Injectable()
export class UserService {
  public users: User[] = [];

  public getAllUsers(): User[] {
    return this.users;
  }

  public createUser(userData: User): string {
    this.users.push(userData);
    return 'User created successfully';
  }
}
