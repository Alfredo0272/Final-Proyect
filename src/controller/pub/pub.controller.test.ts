import { BeerMongoRepo } from '../../repos/beer/beer.mongo.repo';
import { PubMongoRepo } from '../../repos/pub/pub.mongo.repo';
import { PubController } from './pub.controller';
import { Request, Response, NextFunction } from 'express';

describe('Given PubController class', () => {
  let controller: PubController;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;
  let mockRepo: jest.Mocked<PubMongoRepo>;

  beforeAll(() => {
    mockRequest = {
      params: { id: 'validBeerID' },
      file: { path: 'validPath' },
      body: { id: 'validPubID' },
    } as unknown as Request;

    mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
      statusMessage: '',
    } as unknown as Response;
    mockNext = jest.fn();
  });
  const mockImgData = { url: 'validImageUrl' };
  const mockResult = {
    id: 'validBeerID',
    name: 'Pub Name',
    logo: mockImgData,
  };
  const mockCloudinaryService = {
    uploadImage: jest.fn().mockResolvedValue(mockImgData),
  };
  const mockBeer = { id: 'validBeerID', pubs: [] };
  const mockPub = { id: 'validPubID', beers: [], taps: 2 };
  const mockUpdatedPub = { id: 'validPubID', beers: [mockBeer] };

  beforeEach(() => {
    mockRepo = {
      getAll: jest.fn().mockResolvedValue([{}]),
      getById: jest.fn().mockResolvedValue(mockPub),
      create: jest.fn().mockResolvedValue({}),
      createPub: jest.fn().mockResolvedValue(mockResult),
      addBeer: jest.fn().mockResolvedValue(mockUpdatedPub),
      removeBeer: jest.fn().mockResolvedValue(mockPub),
    } as unknown as jest.Mocked<PubMongoRepo>;
    controller = new PubController(mockRepo);
    controller.cloudinaryService = mockCloudinaryService;
  });

  describe('When we instantiate it without errors', () => {
    test('should create a new pub when given valid input data and a valid image file', async () => {
      await controller.createPub(mockRequest, mockResponse, mockNext);
      expect(mockRepo.create).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.statusMessage).toBe('Created');
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });
    test('should successfully add a beer to a pub with available taps', async () => {
      const mockBeerRepo = {
        getById: jest.fn().mockResolvedValue(mockBeer),
        update: jest.fn(),
      } as unknown as jest.Mocked<BeerMongoRepo>;
      controller.beerRepo = mockBeerRepo;

      await controller.addPubBeer(mockRequest, mockResponse, mockNext);

      expect(mockRepo.getById).toHaveBeenCalledWith('validPubID');
      expect(mockBeerRepo.getById).toHaveBeenCalledWith('validBeerID');
      expect(mockRepo.addBeer).toHaveBeenCalledWith(mockBeer, 'validPubID');
      expect(mockBeerRepo.update).toHaveBeenCalledWith('validBeerID', mockBeer);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedPub);
    });
    test('should successfully remove a beer from a pub with valid pub and beer IDs', async () => {
      const mockBeerRepo = {
        getById: jest.fn().mockResolvedValue(mockBeer),
        update: jest.fn(),
      } as unknown as jest.Mocked<BeerMongoRepo>;

      const mockRepo = {
        getById: jest.fn().mockResolvedValueOnce(mockUpdatedPub),
        removeBeer: jest.fn().mockResolvedValueOnce({}),
      } as unknown as jest.Mocked<PubMongoRepo>;

      const controller = new PubController(mockRepo);
      controller.beerRepo = mockBeerRepo;

      await controller.removePubBeer(mockRequest, mockResponse, mockNext);

      expect(mockRepo.getById).toHaveBeenCalledWith('validPubID');
      expect(mockBeerRepo.getById).toHaveBeenCalledWith('validBeerID');
      expect(mockRepo.removeBeer).toHaveBeenCalledWith(mockBeer, 'validPubID');
      expect(mockBeerRepo.update).toHaveBeenCalledWith('validBeerID', mockBeer);
    });
  });
});
