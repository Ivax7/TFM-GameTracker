import { Test, TestingModule } from '@nestjs/testing';
import { UserReviewsController } from './user-reviews.controller';

describe('UserReviewsController', () => {
  let controller: UserReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserReviewsController],
    }).compile();

    controller = module.get<UserReviewsController>(UserReviewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
