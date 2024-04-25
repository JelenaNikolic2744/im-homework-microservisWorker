import { Injectable } from '@nestjs/common';
import Jimp from 'jimp';

@Injectable()
export class ImageResizeService {
  public async resizeImage(imageData: any, width: any, height: any) {
    const image = await Jimp.read(imageData);
    const resizedImage = await image
      .resize(width, height)
      .getBufferAsync(Jimp.MIME_JPEG);
    return resizedImage;
  }
}