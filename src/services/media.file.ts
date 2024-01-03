/* eslint-disable camelcase */
import { v2 as cloudinary } from 'cloudinary';
import createDebug from 'debug';
import { ImgData } from '../types/img.data.js';
import { HttpError } from '../types/http.error.js';

/* istanbul ignore next */
const debug = createDebug('W9Final:media.files');

export class MediaFiles {
  constructor() {
    cloudinary.config({
      cloud_name: 'dv0kwrjox',
      api_key: '992654134475157',
      api_secret: process.env.CLOUDINARY_SECRET,
      secure: true,
    });
    debug('Instantiated');
    debug('Key:', process.env.CLOUDINARY_KEY);
  }

  async uploadImage(imagePath: string) {
    try {
      const uploadApiResponse = await cloudinary.uploader.upload(imagePath, {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });

      const imgData: ImgData = {
        url: uploadApiResponse.url,
        publicId: uploadApiResponse.public_id,
        size: uploadApiResponse.bytes,
        height: uploadApiResponse.height,
        width: uploadApiResponse.width,
        format: uploadApiResponse.format,
      };

      return imgData;
    } catch (err) {
      const error = err as Error;
      throw new HttpError(406, 'Not Acceptable', error.message);
    }
  }
}
