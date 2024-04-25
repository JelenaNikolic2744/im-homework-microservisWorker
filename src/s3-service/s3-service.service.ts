import { Injectable } from '@nestjs/common';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { ImageResizeService } from 'src/image-resize/image-resize.service';
import { pipeline } from 'stream/promises';
import { createWriteStream, promises } from 'fs';
import { Readable } from 'stream';

@Injectable()
export class S3ServiceService {
  AWS_S3_BUCKET = 'im-homework';

  s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.ACCESSKEYID,
      secretAccessKey: process.env.SECRETACCESSKEY,
    },
  });

  constructor(private readonly imageResizeService: ImageResizeService) { }

  public async readFileFromS3(fileMetadata: any) {
    const fileParams = {
      Bucket: this.AWS_S3_BUCKET,
      Key: fileMetadata.key,
    };

    const tempFilePath = `./resize-${fileMetadata.key}`;

    try {
      const { Body } = await this.s3Client.send(
        new GetObjectCommand(fileParams),
      );

      if (!(Body instanceof Readable)) {
        console.error('Must be readable stream');
        return;
      }

      await pipeline(Body, createWriteStream(tempFilePath));

      const resizedImage = await this.imageResizeService.resizeImage(
        tempFilePath,
        fileMetadata.width,
        fileMetadata.height,
      );

      this.s3_upload(
        resizedImage,
        this.AWS_S3_BUCKET,
        `resize-${fileMetadata.key}`,
        '',
      );
    } catch (error) {
      console.log(error);
    } finally {
      await promises.unlink(tempFilePath).catch((error) => {
        console.log(error);
      });
    }
  }

  private async s3_upload(file: any, bucket: any, name: any, mimetype: any) {
    try {
      let s3Response = await this.s3Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: String(name),
          Body: file,
          ContentType: mimetype,
        }),
      );
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }
}