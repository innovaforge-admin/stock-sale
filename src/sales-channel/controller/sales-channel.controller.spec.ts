import { Test, TestingModule } from '@nestjs/testing';
import { SalesChannelController } from '../sales-channel.controller';

describe('SalesChannelController', () => {
  let controller: SalesChannelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesChannelController],
    }).compile();

    controller = module.get<SalesChannelController>(SalesChannelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
