import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MongoConfigService } from './mongo.service';

describe('MongoConfigService', () => {
  let service: MongoConfigService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongoConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'MONGODB_URI') {
                return 'mocked_mongodb_uri';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<MongoConfigService>(MongoConfigService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create Mongoose options with configured URI', async () => {
    const mongooseOptions = await service.createMongooseOptions();
    expect(mongooseOptions).toBeDefined();
    expect(mongooseOptions).toHaveProperty('uri', 'mocked_mongodb_uri');
  });

  it('should use ConfigService to get MONGODB_URI', async () => {
    const getSpy = jest.spyOn(configService, 'get');
    await service.createMongooseOptions();
    expect(getSpy).toHaveBeenCalledWith('MONGODB_URI');
  });
});
