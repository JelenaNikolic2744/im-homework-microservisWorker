import { Injectable, OnModuleInit } from '@nestjs/common';
import { SQS } from 'aws-sdk';
import { S3ServiceService } from 'src/s3-service/s3-service.service';

@Injectable()
export class SqsserviceService implements OnModuleInit {
  private sqs = new SQS({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.ACCESSKEYID,
      secretAccessKey: process.env.SECRETACCESSKEY,
    },
  });
  private queueUrl =process.env.QUEUEURL;

  constructor(private readonly s3Service: S3ServiceService) {}

  async onModuleInit() {
    this.startListening();
  }

  private startListening() {
    const params = {
      QueueUrl: this.queueUrl,
      WaitTimeSeconds: 20,
    };

    this.sqs.receiveMessage(params, (error, data) => {
      if (error) {
        console.log(error);
      } else if (data && data.Messages) {
        data.Messages.forEach(async (message) => {
          if (message.Body) this.handleMessage(message.Body);
        });
      }
    });
  }

  //Parse message data
  private handleMessage(message: any) {
    console.log(message);
    console.log('Downloading file');
    this.s3Service.readFileFromS3({
      key: message.nameKey,
      width: message.width,
      height: message.height,
    });
  }
}