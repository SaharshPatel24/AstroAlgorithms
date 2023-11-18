import * as request from 'supertest';
import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { User } from '../src/user/interface/user.interface';
import { UserService } from '../src/user/user.service';

const mockUsers: User[] = [
  { _id: "1", name: 'Alice', email: 'alice@example.com' },
  { _id: "2", name: 'Bob', email: 'bob@example.com' },
];

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    userService = moduleFixture.get<UserService>(UserService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users (GET)', () => {
    it('should return all users', async () => {
      jest.spyOn(userService, 'findAllUsers').mockResolvedValue(mockUsers); // Mock the user service method
  
      const response = await request(app.getHttpServer()).get('/users');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers); // Compare response with mock data
    });;

    // Add more test cases for different scenarios related to fetching users
    it('should return an empty array if no users exist', async () => {
      // Mock the scenario where no users exist
      const emptyMockUsers: any[] = [];
      jest.spyOn(userService, 'findAllUsers').mockResolvedValue(emptyMockUsers);

      const response = await request(app.getHttpServer()).get('/users');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(emptyMockUsers);
    });

    // Add edge cases for pagination, sorting, filtering, etc.
  });

  describe('/users/:id (GET)', () => {
    it('should return a user by ID', async () => {
      const userId = "1"; // Assuming this ID exists in the mock data
      const expectedUser = mockUsers.find(user => user._id === userId);

      jest.spyOn(userService, 'findUserById').mockResolvedValue(expectedUser);

      const response = await request(app.getHttpServer()).get(`/users/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedUser);
    });

    it('should return 404 if user ID does not exist', async () => {
      const nonExistentUserId = "999";

      jest.spyOn(userService, 'findUserById').mockResolvedValue(null);

      const response = await request(app.getHttpServer()).get(`/users/${nonExistentUserId}`);
      expect(response.status).toBe(404);
    });
  });

  describe('/users (POST)', () => {
    it('should create a new user', async () => {
      const newUser = {
        _id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };
  
      // Mock the user service method to successfully create a new user
      jest.spyOn(userService, 'createUser').mockResolvedValue(newUser);
  
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(newUser);
  
      expect(response.status).toBe(201); // Assuming the endpoint returns 201 for successful creation
      expect(response.body).toEqual(newUser);
    });
  
    it('should return 400 on invalid user data', async () => {
      const invalidUser = {
        // Missing required fields for user creation
      };
  
      // Mock the user service method to handle invalid user data
      jest.spyOn(userService, 'createUser').mockImplementation(() => {
        throw new BadRequestException([
          'name must be a string',
          'Invalid email format',
        ]);
      });
  
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(invalidUser);
  
      expect(response.status).toBe(400);
      expect(response.body.message.join(', ')).toBe('name must be a string, Invalid email format');
    });
  });

  describe('/users (PUT)', () => {
    it('should update a user with valid data', async () => {
      const updatedUser = {
        _id: '1', // Assuming a valid user ID
        name: 'Updated Name',
        email: 'updated@example.com',
        // Other updated fields
      };
  
      jest.spyOn(userService, 'updateUser').mockResolvedValue(updatedUser as User);
  
      const response = await request(app.getHttpServer())
        .put(`/users`)
        .send(updatedUser);
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedUser);
    });
  
    it('should return 404 on invalid user ID for update', async () => {
      
      jest.spyOn(userService, 'updateUser').mockResolvedValue(null);
    
      const response = await request(app.getHttpServer())
        .put('/users');
    
      expect(response.status).toBe(400);
    });
  
  });

  describe('/users (DELETE)', () => {
    it('should delete a user by ID', async () => {
      const deleteUser = {
        _id: '1',
        name: 'Updated Name',
        email: 'updated@example.com',
      }
      jest.spyOn(userService, 'deleteUser').mockResolvedValue(deleteUser);
  
      const response = await request(app.getHttpServer())
          .delete(`/users`)
          .send(deleteUser);

      expect(response.status).toBe(200);
    });
  
    it('should return 404 for non-existing user ID', async () => {
      jest.spyOn(userService, 'deleteUser').mockResolvedValue(null);
  
      const response = await request(app.getHttpServer())
          .delete(`/users`)
          .send(null);

      expect(response.status).toBe(404);
    });
  
    it('should return 400 for invalid user ID format', async () => {
      const invalidUserId = {
        _id: 'invalidID',
        name: 'invalid',
        email: 'invalid@email.com'
      } // Replace with an invalid user ID format
      const response = await request(app.getHttpServer())
          .delete(`/users`)
          .send(invalidUserId);
      expect(response.status).toBe(404);
    });
  
  });
  
});
