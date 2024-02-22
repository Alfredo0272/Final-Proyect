import { Pub } from '../../entities/pub.model';
import { BeerMongoRepo } from '../../repos/beer/beer.mongo.repo';
import { PubMongoRepo } from '../../repos/pub/pub.mongo.repo';
import { HttpError } from '../../types/http.error';
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
      body: { id: 'validPubID' } as unknown as Pub,
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
      addBeerToTap: jest.fn().mockResolvedValue(mockUpdatedPub),
      removeBeerFromTap: jest.fn().mockResolvedValue(mockPub),
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
      expect(mockRepo.addBeerToTap).toHaveBeenCalledWith(
        mockBeer,
        'validPubID'
      );
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
        removeBeerFromTap: jest.fn().mockResolvedValueOnce({}),
      } as unknown as jest.Mocked<PubMongoRepo>;

      const controller = new PubController(mockRepo);
      controller.beerRepo = mockBeerRepo;

      await controller.removePubBeer(mockRequest, mockResponse, mockNext);

      expect(mockRepo.getById).toHaveBeenCalledWith('validPubID');
      expect(mockBeerRepo.getById).toHaveBeenCalledWith('validBeerID');
      expect(mockRepo.removeBeerFromTap).toHaveBeenCalledWith(
        mockBeer,
        'validPubID'
      );
      expect(mockBeerRepo.update).toHaveBeenCalledWith('validBeerID', mockBeer);
    });
  });
  describe('When we instantiate it with errors', () => {
    test('should throw a HttpError with status code 406 if no image file is provided', async () => {
      const mockRequest: Request = {
        params: { id: 'validUserID' },
        file: undefined,
        body: { name: 'Pub Name' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn(),
        statusMessage: '',
      } as unknown as Response;
      const mockNext = jest.fn();
      await controller.createPub(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(406, 'Not Acceptable', 'Invalid multer file')
      );
    });
    test('should throw HttpError with status 404 when Pub is not found', async () => {
      const mockPubRepo = {
        getById: jest.fn().mockResolvedValue(null),
      } as unknown as PubMongoRepo;
      const mockBeerRepo = {
        getById: jest.fn().mockResolvedValue({ id: 'validBeerId' }),
      } as unknown as BeerMongoRepo;
      const controller = new PubController(mockPubRepo);
      controller.beerRepo = mockBeerRepo;
      await controller.addPubBeer(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(404, 'Not Found', 'Pub not found')
      );
    });
    test('addPubBeer method should throw HttpError with status 404 when beer is not found', async () => {
      const mockPubRepo1 = {
        getById: jest
          .fn()
          .mockResolvedValue({ id: 'validPubID', beers: [], taps: 2 }),
      } as unknown as PubMongoRepo;
      const mockBeerRepo1 = {
        getById: jest.fn().mockResolvedValue(null),
      } as unknown as BeerMongoRepo;
      const controller = new PubController(mockPubRepo1);
      controller.beerRepo = mockBeerRepo1;
      await controller.addPubBeer(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(404, 'Not Found', 'Beer not found')
      );
    });
    test('should throw HttpError with status 409 if beer is already in the tap beers', async () => {
      const mockPub = {
        id: 'validUserID',
        beers: [{ id: 'existingBeerID' }],
      };
      const mockBeer = { id: 'existingBeerID' };
      const mockRepo = {
        getById: jest.fn().mockResolvedValue(mockPub),
        addPubBeer: jest.fn(),
      } as unknown as jest.Mocked<PubMongoRepo>;
      const mockBeerRepo = {
        getById: jest.fn().mockResolvedValue(mockBeer),
      } as unknown as BeerMongoRepo;
      const controller = new PubController(mockRepo);
      controller.beerRepo = mockBeerRepo;
      try {
        await controller.addPubBeer(mockRequest, mockResponse, mockNext);
      } catch (error) {
        expect(mockNext).toHaveBeenCalledWith(
          new HttpError(409, 'Conflict', 'Beer already in the tap beers')
        );
        expect(mockNext).toHaveBeenCalledWith(error);
      }
    });
    test('should throw HttpError with status 400 when pub is at full capacity', async () => {
      const mockPub = {
        id: 'validPubID',
        beers: [{ id: 'existingBeerID' }],
        taps: 1,
      };
      const mockBeer = { id: 'validBeerID' };
      const mockRepo = {
        getById: jest.fn().mockResolvedValue(mockPub),
      } as unknown as jest.Mocked<PubMongoRepo>;
      const controller = new PubController(mockRepo);
      controller.beerRepo = {
        getById: jest.fn().mockResolvedValue(mockBeer),
      } as unknown as BeerMongoRepo;
      await controller.addPubBeer(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(400, 'Bad Request', 'The pub is at full capacity')
      );
    });
    test('should throw a HttpError with status code 404 when update is not possible', async () => {
      const mockPub = { id: '1', beers: [], taps: 2 };
      const mockBeer = { id: '1', pubs: [] };
      const mockRequest = {
        body: mockPub,
        params: { id: mockBeer.id },
      } as unknown as Request;
      const mockResponse = {} as Response;
      const mockNext = jest.fn();
      const mockPubRepo = {
        getById: jest.fn().mockResolvedValue(mockPub),
        addBeerToTap: jest.fn().mockResolvedValue(null),
      } as unknown as PubMongoRepo;
      const mockBeerRepo = {
        getById: jest.fn().mockResolvedValue(mockBeer),
        update: jest.fn(),
      } as unknown as BeerMongoRepo;
      const controller = new PubController(mockPubRepo);
      controller.beerRepo = mockBeerRepo;
      await controller.addPubBeer(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(404, 'Not Found', 'Update not possible')
      );
    });
    test('should throw HttpError with status 404 when Pub is not found', async () => {
      const mockPubRepo = {
        getById: jest.fn().mockResolvedValue(null),
      } as unknown as PubMongoRepo;
      const mockBeerRepo = {
        getById: jest.fn().mockResolvedValue({ id: 'validBeerId' }),
      } as unknown as BeerMongoRepo;
      const controller = new PubController(mockPubRepo);
      controller.beerRepo = mockBeerRepo;
      await controller.removePubBeer(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(404, 'Not Found', 'Pub not found')
      );
    });
    test('removePubBeer method should throw HttpError with status 404 when beer is not found', async () => {
      const mockPubRepo2 = {
        getById: jest
          .fn()
          .mockResolvedValue({ id: 'validPubID', beers: [], taps: 2 }),
      } as unknown as PubMongoRepo;
      const mockBeerRepo2 = {
        getById: jest.fn().mockResolvedValue(null),
      } as unknown as BeerMongoRepo;
      const controller = new PubController(mockPubRepo2);
      controller.beerRepo = mockBeerRepo2;
      await controller.removePubBeer(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(404, 'Not Found', 'Beer not found')
      );
    });
    test('should throw HttpError with status 404 when beer is not found', async () => {
      const mockPub = {
        id: 'validUserID',
        beers: [],
      };
      const mockBeer = { id: 'existingBeerID' };
      const mockRepo = {
        getById: jest.fn().mockResolvedValue(mockPub),
        removeBeer: jest.fn(),
      } as unknown as jest.Mocked<PubMongoRepo>;
      const mockBeerRepo = {
        getById: jest.fn().mockResolvedValue(mockBeer),
      } as unknown as BeerMongoRepo;
      const controller = new PubController(mockRepo);
      controller.beerRepo = mockBeerRepo;
      try {
        await controller.removePubBeer(mockRequest, mockResponse, mockNext);
      } catch (error) {
        expect(mockNext).toHaveBeenCalledWith(
          new HttpError(
            409,
            'Conflict',
            'Update not possible, Beer already erased'
          )
        );
        expect(mockNext).toHaveBeenCalledWith(error);
      }
    });
  });
});
