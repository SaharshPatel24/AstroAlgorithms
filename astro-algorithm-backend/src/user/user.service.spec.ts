import { ConflictException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './interface/user.interface';
import { getModelToken } from '@nestjs/mongoose';

const validObjectId = new Types.ObjectId().toHexString(); // Generate a valid ObjectId

const mockUser: User = {
  _id: validObjectId,
  username: 'john_doe123',
  email: 'john@example.com',
  password: 'hashed_password', // Assuming a hashed password
  profile: {
    avatarURL: 'https://via.placeholder.com/150', // Placeholder URL for avatar
    completedChallenges: [
      { challengeId: validObjectId, challengeName: 'Challenge 1' },
      { challengeId: validObjectId, challengeName: 'Challenge 2' },
    ],
    points: 100,
    // Other profile properties as per your schema
  },
  createdAt: new Date('2023-01-01'), // A sample creation date
  lastLogin: new Date('2023-10-01'),
  // Other properties based on your schema
};

// Mock data for creating a new user
const mockCreateUserDto = {
  username: 'test',
  email: 'test@example.com',
  password: '123456',
  // Other properties based on your CreateUserDto
};

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('Users'),
          useValue: {
            find: jest.fn().mockResolvedValue([mockUser]),
            findOne: jest.fn().mockResolvedValue(mockUser),
            findByIdAndUpdate: jest.fn().mockResolvedValue(mockUser),
            findByIdAndDelete: jest.fn().mockResolvedValue(mockUser),
            create: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken('Users'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      jest.spyOn(service, 'createUser').mockResolvedValue(mockUser);

      // Perform the action
      const result = await service.createUser(mockCreateUserDto);

      // Assert
      expect(service.createUser).toHaveBeenCalledWith(mockCreateUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      jest.spyOn(userModel, 'create').mockRejectedValue({ code: 11000, keyPattern: { email: 1 } });
      await expect(service.createUser(mockCreateUserDto)).rejects.toThrowError(ConflictException);
    });
  });

  describe('findAllUsers', () => {
    it('should return all users', async () => {
      const result = await service.findAllUsers();
      expect(userModel.find).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
    // Add other test cases for findAllUsers as needed
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const result = await service.deleteUser(mockUser._id);
      expect(userModel.findByIdAndDelete).toHaveBeenCalledWith(validObjectId);
      expect(result).toEqual(mockUser);
    });
    // Add other test cases for deleteUser as needed
  });
});
