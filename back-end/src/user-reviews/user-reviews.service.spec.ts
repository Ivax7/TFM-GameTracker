import { Test, TestingModule } from '@nestjs/testing';
import { UserReviewsService } from './user-reviews.service';

describe('UserReviewsService', () => {
  let service: UserReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserReviewsService],
    }).compile();

    service = module.get<UserReviewsService>(UserReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
