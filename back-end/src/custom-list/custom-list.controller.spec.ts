import { Test, TestingModule } from '@nestjs/testing';
import { CustomListController } from './custom-list.controller';

describe('CustomListController', () => {
  let controller: CustomListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomListController],
    }).compile();

    controller = module.get<CustomListController>(CustomListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
