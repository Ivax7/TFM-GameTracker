import { Test, TestingModule } from '@nestjs/testing';
import { UserGameController } from './user-game.controller';

describe('UserGameController', () => {
  let controller: UserGameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserGameController],
    }).compile();

    controller = module.get<UserGameController>(UserGameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
