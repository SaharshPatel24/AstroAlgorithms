import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose'; // Import Types from mongoose

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const validObjectId = new Types.ObjectId().toHexString();

  const mockUser = {
    _id: validObjectId, // Assuming MongoDB returns _id as string
    name: 'mockUser',
    email: 'mock@example.com',
    // Other properties based on your schema
  };

  const createUserDto = {
    name: 'newUser',
    email: 'new@example.com',
    // Other properties based on your CreateUserDto
  };

  const updateUserDto = {
    _id: validObjectId, // Assuming MongoDB returns _id as string
    name: 'updatedUser',
    email: 'updated@example.com',
    // Other properties based on your UpdateUserDto
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
        ...createUserDto,
      });

      const result = await controller.createUser(createUserDto);

      expect(result).toEqual(expect.objectContaining(createUserDto));
    });

    it('should handle errors when creating a user', async () => {
      const error = new BadRequestException('Invalid input');
      jest.spyOn(userService, 'createUser').mockRejectedValue(error);

      await expect(controller.createUser(createUserDto)).rejects.toThrowError(error);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const result = await controller.getAllUsers();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const result = await controller.getUserById(validObjectId);
      expect(result).toEqual(mockUser);
    });

    it('should handle user not found by ID', async () => {
      jest.spyOn(userService, 'findUserById').mockResolvedValue(null);
      await expect(controller.getUserById('invalidObjectId')).rejects.toThrowError(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      jest.spyOn(userService, 'updateUser').mockResolvedValue({
        ...mockUser,
        ...updateUserDto,
      });
      const result = await controller.updateUser(updateUserDto);
      expect(result).toEqual(expect.objectContaining(updateUserDto));
    });

    it('should handle user not found when updating', async () => {
      jest.spyOn(userService, 'updateUser').mockResolvedValue(undefined);
      try {
        await controller.updateUser(updateUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('User not found');
      }
    });

    it('should handle errors when updating a user', async () => {
      const error = new BadRequestException('Invalid input');
      jest.spyOn(userService, 'updateUser').mockRejectedValue(error);
      await expect(controller.updateUser(updateUserDto)).rejects.toThrowError(error);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const result = await controller.deleteUser(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should handle user not found when deleting', async () => {
      jest.spyOn(userService, 'deleteUser').mockResolvedValue(null);
      await expect(controller.deleteUser(mockUser)).rejects.toThrowError(NotFoundException);
    });
  });
});
