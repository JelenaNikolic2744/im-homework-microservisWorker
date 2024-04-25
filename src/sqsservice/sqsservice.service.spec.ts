import { Test, TestingModule } from '@nestjs/testing';
import { SqsserviceService } from './sqsservice.service';

describe('SqsserviceService', () => {
  let service: SqsserviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SqsserviceService],
    }).compile();

    service = module.get<SqsserviceService>(SqsserviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
