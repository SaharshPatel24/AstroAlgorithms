import { ConflictException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './interface/user.interface';
import { getModelToken } from '@nestjs/mongoose';

const validObjectId = new Types.ObjectId().toHexString(); // Generate a valid ObjectId

const mockUser: User = {
  _id: validObjectId,
  name: 'JohnDoe',
  email: 'john@example.com',
  // Other properties based on your User interface
};

const mockCreateUserDto = {
  name: 'JohnDoe',
  email: 'john@example.com',
  // Other properties based on your CreateUserDto
};

const mockUpdateUserDto = {
  _id: validObjectId,
  name: 'UpdatedJohnDoe',
  email: 'updatedjohn@example.com',
  // Other properties based on your UpdateUserDto
};

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('users'),
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
    userModel = module.get<Model<User>>(getModelToken('users'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const result = await service.createUser(mockCreateUserDto);
      expect(userModel.create).toHaveBeenCalledWith(mockCreateUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      jest.spyOn(userModel, 'create').mockRejectedValue({ code: 11000 });
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

  describe('findUserById', () => {
    it('should return a user by ID', async () => {
      const result = await service.findUserById(validObjectId);
      expect(userModel.findOne).toHaveBeenCalledWith({ _id: validObjectId });
      expect(result).toEqual(mockUser);
    });

    it('should return null for invalid ID', async () => {
      const result = await service.findUserById('invalidId');
      expect(userModel.findOne).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
    // Add other test cases for findUserById as needed
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const result = await service.updateUser(mockUpdateUserDto);
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(validObjectId, mockUpdateUserDto, { new: true });
      expect(result).toEqual(mockUser);
    });
    // Add other test cases for updateUser as needed
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const result = await service.deleteUser(mockUser);
      expect(userModel.findByIdAndDelete).toHaveBeenCalledWith(validObjectId);
      expect(result).toEqual(mockUser);
    });
    // Add other test cases for deleteUser as needed
  });
});
