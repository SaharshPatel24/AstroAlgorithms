import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose'; // Import Types from mongoose
import { User } from './interface/user.interface';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const validObjectId = new Types.ObjectId().toHexString();

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

  const userServiceMock = {
    createUser: jest.fn(async (createUserData) => ({
      ...mockUser,
      ...createUserData,
    })),
    findAllUsers: jest.fn(async () => [mockUser]),
    findUserById: jest.fn(async (_id) => {
      if (_id === validObjectId) {
        return mockUser;
      }
      return null;
    }),
    updateUser: jest.fn(async (updateUserData) => ({
      ...mockUser,
      ...updateUserData,
    })),
    deleteUser: jest.fn(async (requestedUser) => requestedUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      jest.spyOn(userService, 'createUser').mockResolvedValue({
        ...mockUser,
        _id: validObjectId, // Mocking the MongoDB generated ID
        ...mockCreateUserDto,
      });

      const result = await controller.createUser(mockCreateUserDto);

      expect(result).toEqual(expect.objectContaining(mockCreateUserDto));
    });

    it('should handle errors when creating a user', async () => {
      const error = new BadRequestException('Invalid input');
      jest.spyOn(userService, 'createUser').mockRejectedValue(error);

      await expect(controller.createUser(mockCreateUserDto)).rejects.toThrowError(error);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const result = await controller.getAllUsers();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const result = await controller.deleteUser(mockUser._id);
      expect(result).toEqual(mockUser._id);
    });

    it('should handle user not found when deleting', async () => {
      jest.spyOn(userService, 'deleteUser').mockResolvedValue(null);
      await expect(controller.deleteUser(mockUser._id)).rejects.toThrowError(NotFoundException);
    });
  });
});
