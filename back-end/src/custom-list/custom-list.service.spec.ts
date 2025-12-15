import { Test, TestingModule } from '@nestjs/testing';
import { CustomListService } from './custom-list.service';

describe('CustomListService', () => {
  let service: CustomListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomListService],
    }).compile();

    service = module.get<CustomListService>(CustomListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
