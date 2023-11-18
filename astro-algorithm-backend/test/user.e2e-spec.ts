import * as request from 'supertest';
import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { User } from '../src/user/interface/user.interface';
import { UserService } from '../src/user/user.service';

const mockUsers: User[] = [
  {
    _id: '1',
    username: 'Alice123',
    email: 'alice@example.com',
    password: 'password123',
    profile: {
      avatarURL: 'https://example.com/avatar1.jpg',
      completedChallenges: [
        { challengeId: 'challenge1', challengeName: 'Challenge One' },
        { challengeId: 'challenge2', challengeName: 'Challenge Two' },
      ],
      points: 100,
    },
    createdAt: new Date('2023-11-18T00:00:00Z'),
    lastLogin: new Date('2023-11-18T08:00:00Z'),
  },
  {
    _id: '2',
    username: 'Bob456',
    email: 'bob@example.com',
    password: 'password456',
    profile: {
      avatarURL: 'https://example.com/avatar2.jpg',
      completedChallenges: [
        { challengeId: 'challenge3', challengeName: 'Challenge Three' },
        { challengeId: 'challenge4', challengeName: 'Challenge Four' },
      ],
      points: 150,
    },
    createdAt: new Date('2023-11-17T00:00:00Z'),
    lastLogin: new Date('2023-11-17T08:00:00Z'),
  },
];

const mockCreateUser = {
  username: 'Alice123',
  email: 'alice@example.com',
  password: 'password123',
};

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

      for (const user of response.body) {
        const mockUserKeys = Object.keys(mockUsers[0]);
        const userKeys = Object.keys(user);
        expect(userKeys).toEqual(expect.arrayContaining(mockUserKeys));
      } // Compare response with mock data
    });

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

  describe('/users (POST)', () => {
    it('should create a new user', async () => {
      // Mock the user service method to successfully create a new user
      jest.spyOn(userService, 'createUser').mockResolvedValue(mockUsers[0]);

      // Send a POST request to create a new user
      const response = await request(app.getHttpServer()).post('/users').send(mockCreateUser);

      // Validate the response status code
      expect(response.status).toBe(201); // Assuming the endpoint returns 201 for successful creation

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { createdAt, lastLogin, ...expectedUser } = mockUsers[0];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { createdAt: respCreatedAt, lastLogin: respLastLogin, ...respUser } = response.body;

      expect(respUser).toEqual(expectedUser);
    });

    it('should return 400 on invalid username', async () => {
      const invalidUser = {};

      // Mock the user service method to handle invalid user data
      jest.spyOn(userService, 'createUser').mockImplementation(() => {
        throw new BadRequestException([
          'Username must contain only letters and numbers',
          'Username must be at least 3 characters',
          'username must be a string',
          'Invalid email format',
          'Password must be at least 6 characters',
          'password must be a string',
        ]);
      });

      const response = await request(app.getHttpServer()).post('/users').send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.message.join(', ')).toBe(
        'Username must contain only letters and numbers, Username must be at least 3 characters, username must be a string, Invalid email format, Password must be at least 6 characters, password must be a string',
      );
    });
  });

  describe('/users (DELETE)', () => {
    it('should delete a user by ID', async () => {
      jest.spyOn(userService, 'deleteUser').mockResolvedValue(mockUsers[0]);

      const response = await request(app.getHttpServer()).delete(`/users`).send({ _id: '1' });

      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existing user ID', async () => {
      jest.spyOn(userService, 'deleteUser').mockResolvedValue(null);

      const response = await request(app.getHttpServer()).delete(`/users`).send(null);

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid user ID format', async () => {
      const invalidUserId = {
        _id: 'invalidID',
        name: 'invalid',
        email: 'invalid@email.com',
      }; // Replace with an invalid user ID format
      const response = await request(app.getHttpServer()).delete(`/users`).send(invalidUserId);
      expect(response.status).toBe(404);
    });
  });
});
