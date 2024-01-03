// Can upload an image successfully
import { v2 as cloudinary } from 'cloudinary';
import { MediaFiles } from './media.file.js';
import { HttpError } from '../types/http.error';
describe('Given the Media File class', () => {
  describe('When I use upload a image', () => {
    test('should upload an image successfully when given a valid imagePath', async () => {
      const imagePath = 'valid/image/path.jpg';
      const uploadApiResponse = {
        url: 'https://example.com/image.jpg',
        // eslint-disable-next-line camelcase
        public_id: 'public_id',
        bytes: 1000,
        height: 500,
        width: 500,
        format: 'jpg',
      };
      cloudinary.uploader.upload = jest
        .fn()
        .mockResolvedValue(uploadApiResponse);
      const mediaFiles = new MediaFiles();
      const result = await mediaFiles.uploadImage(imagePath);
      expect(cloudinary.uploader.upload).toHaveBeenCalledWith(imagePath, {
        // eslint-disable-next-line camelcase
        use_filename: true,
        // eslint-disable-next-line camelcase
        unique_filename: false,
        overwrite: true,
      });
      expect(result).toEqual({
        url: 'https://example.com/image.jpg',
        publicId: 'public_id',
        size: 1000,
        height: 500,
        width: 500,
        format: 'jpg',
      });
    });
    test('should handle cloudinary API errors when image upload fails', async () => {
      const imagePath = 'valid/image/path.jpg';
      const error = new Error('Upload failed');
      cloudinary.uploader.upload = jest.fn().mockRejectedValue(error);
      const mediaFiles = new MediaFiles();
      let errorResult: HttpError | undefined;
      try {
        await mediaFiles.uploadImage(imagePath);
      } catch (error) {
        errorResult = error as HttpError;
      }

      if (errorResult) {
        expect(errorResult).toBeInstanceOf(HttpError);
        expect(errorResult.status).toBe(406);
        expect(errorResult.statusMessage).toBe('Not Acceptable');
        expect(errorResult.message).toBe('Upload failed');
      }
    });
  });
});
