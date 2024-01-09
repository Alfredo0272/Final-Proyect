import { Request, Response } from 'express';
import { FileInterceptor } from './file.interceptor';
import multer from 'multer';

jest.mock('multer');

describe('Given FileInterceptor', () => {
  const middlewareMock = jest.fn();
  const single = jest.fn().mockReturnValue(middlewareMock);
  multer.diskStorage = jest
    .fn()
    .mockImplementation(({ filename }) => filename('', '', () => {}));
  (multer as unknown as jest.Mock).mockReturnValue({ single });

  describe('When we instantiate it', () => {
    const interceptor = new FileInterceptor();

    test('Then singleFileStore should be used', () => {
      interceptor.singleFileStore()({} as Request, {} as Response, jest.fn());
      expect(multer.diskStorage).toHaveBeenCalled();
      expect(single).toHaveBeenCalled();
      expect(middlewareMock).toHaveBeenCalled();
    });
  });
});
