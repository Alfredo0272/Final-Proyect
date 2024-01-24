import { BeerMongoRepo } from '../../repos/beer/beer.mongo.repo';
import { UserMongoRepo } from '../../repos/user/user.mongo.repo';
import { HttpError } from '../../types/http.error';
import { BeerController } from './beer.controller';
import { Request, Response, NextFunction } from 'express';

describe('Given BeerController class', () => {
  const mockRequest: Request = {
    params: { id: 'validUserID' },
    file: { path: 'validPath' },
    body: { name: 'Beer Name' },
  } as unknown as Request;
  const mockResponse: Response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    statusMessage: '',
  } as unknown as Response;
  const mockNext: NextFunction = jest.fn();
  describe('When we instantiate it without errors', () => {
    test('should create a beer with valid input data and image file', async () => {
      const mockAuthor = { id: 'validUserID', name: 'Author Name' };
      const mockImgData = { url: 'validImageUrl' };
      const mockResult = {
        id: 'validBeerID',
        name: 'Beer Name',
        description: 'Beer Description',
        author: mockAuthor,
        beerImg: mockImgData,
      };

      const mockUserRepo = {
        getById: jest.fn().mockResolvedValue(mockAuthor),
      } as unknown as UserMongoRepo;

      const mockCloudinaryService = {
        uploadImage: jest.fn().mockResolvedValue(mockImgData),
      };
      const mockRepo = {
        create: jest.fn().mockResolvedValue(mockResult),
      } as unknown as BeerMongoRepo;

      const controller = new BeerController(mockRepo);
      controller.userRepo = mockUserRepo;
      controller.cloudinaryService = mockCloudinaryService;

      await controller.createBeer(mockRequest, mockResponse, mockNext);

      expect(mockUserRepo.getById).toHaveBeenCalledWith('validUserID');
      expect(mockRequest.body.author).toEqual(mockAuthor);
      expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(
        'validPath'
      );
      expect(mockRequest.body.beerImg).toEqual(mockImgData);
      expect(mockRepo.create).toHaveBeenCalledWith({
        name: 'Beer Name',
        author: mockAuthor,
        beerImg: mockImgData,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.statusMessage).toEqual('Created');
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });
  });
  describe('When we instantiate it with errors', () => {
    test('should throw an error with status 404 when the user with the given ID does not exist', async () => {
      const mockRequest2: Request = {
        params: { id: 'invalidUserID' },
        file: { path: 'validPath' },
        body: { name: 'Beer Name' },
      } as unknown as Request;
      const mockResponse2: Response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        statusMessage: '',
      } as unknown as Response;
      const mockNext: NextFunction = jest.fn();
      const mockError = new HttpError(404, 'Not Found', 'User not found');

      const mockUserRepo = {
        getById: jest.fn().mockRejectedValue(mockError),
      } as unknown as UserMongoRepo;

      const controller = new BeerController({} as BeerMongoRepo);
      controller.userRepo = mockUserRepo;

      await controller.createBeer(mockRequest2, mockResponse2, mockNext);

      expect(mockUserRepo.getById).toHaveBeenCalledWith('invalidUserID');
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
    test('should throw an error with status 406 when the file is invalid', async () => {
      const mockRequest: Request = {
        params: { id: 'validUserID' },
        file: undefined,
        body: { name: 'Beer Name' },
      } as unknown as Request;
      const mockResponse: Response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        statusMessage: '',
      } as unknown as Response;
      const mockNext: NextFunction = jest.fn();
      const mockError = new HttpError(
        406,
        'Not Acceptable',
        'Invalid multer file'
      );

      const mockUserRepo = {
        getById: jest
          .fn()
          .mockResolvedValue({ id: 'validUserID', name: 'Author Name' }),
      } as unknown as UserMongoRepo;

      const controller = new BeerController({} as BeerMongoRepo);
      controller.userRepo = mockUserRepo;

      await controller.createBeer(mockRequest, mockResponse, mockNext);

      expect(mockUserRepo.getById).toHaveBeenCalledWith('validUserID');
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});
