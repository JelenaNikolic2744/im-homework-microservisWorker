import { Module } from '@nestjs/common';
import { ImageResizeService } from './image-resize/image-resize.service';
import { S3ServiceService } from './s3-service/s3-service.service';
import { SqsserviceService } from './sqsservice/sqsservice.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    SqsserviceService,
    S3ServiceService,
    ImageResizeService,
  ],
  exports: [S3ServiceService, ImageResizeService],
})
export class AppModule {}
