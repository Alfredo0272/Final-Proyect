import { User } from '../../entities/user.model';
import { BeerMongoRepo } from '../../repos/beer/beer.mongo.repo';
import { PubMongoRepo } from '../../repos/pub/pub.mongo.repo';
import { UserMongoRepo } from '../../repos/user/user.mongo.repo';
import { HttpError } from '../../types/http.error';
import { UsersController } from './user.controller';
import { Request, Response, NextFunction } from 'express';

jest.mock('../../services/auth');

describe('Given UserController class', () => {
  let controller: UsersController;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;
  let mockRepo: jest.Mocked<UserMongoRepo>;

  beforeAll(() => {
    mockRequest = {
      body: { userId: 'validUserId' },
      params: { id: 'validBeerId' },
      query: { key: 'value' },
    } as unknown as Request;
    mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
    } as unknown as Response;
    mockNext = jest.fn();
  });

  beforeEach(() => {
    mockRepo = {
      getAll: jest.fn().mockResolvedValue([{}]),
      getById: jest.fn().mockResolvedValue({}),
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      search: jest.fn().mockResolvedValue([{}]),
      delete: jest.fn().mockResolvedValue(undefined),
      login: jest.fn().mockResolvedValue('validUserID'),
      removePub: jest.fn().mockResolvedValue({}),
    } as unknown as jest.Mocked<UserMongoRepo>;

    controller = new UsersController(mockRepo);
  });
  describe('When we instantiate it without errors', () => {
    test('Then login should return user data and token for a valid user', async () => {
      await controller.login(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalled();
    });
    test('Then getAll should ...', async () => {
      await controller.getAll(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith([{}]);
    });
    test('Then getById should ...', async () => {
      await controller.getById(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });

    test('Then search should ...', async () => {
      await controller.search(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith([{}]);
    });

    test('Then create should ...', async () => {
      await controller.create(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });

    test('Then update should ...', async () => {
      await controller.update(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });
    test('Then delete should ...', async () => {
      await controller.delete(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });
    test('Then login should successfully authenticate with valid credentials and return user data and token', async () => {
      const mockRequest = {
        body: {
          email: 'test@example.com',
          passwd: 'test',
        },
      } as unknown as Request;

      const mockUser = {
        email: 'TestName',
        passwd: 'test',
      } as unknown as User;
      mockRepo.login.mockResolvedValueOnce(mockUser);
      await controller.login(mockRequest, mockResponse, mockNext);

      expect(mockRepo.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        passwd: 'test',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(202);
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: mockUser,
      });
    });
    test("should add a beer to a user's tasted beers list when the beer and user exist and the beer is not already in the user's tasted beers list", async () => {
      const mockUser = { id: 'validUserID', probada: [] };
      const mockBeer = { id: 'validBeerID' };
      const mockUpdatedUser = { userId: 'validUserID', probada: [mockBeer] };
      const mockRepo = {
        getById: jest.fn().mockResolvedValue(mockUser),
        addBeer: jest.fn().mockResolvedValue(mockUpdatedUser),
      } as unknown as jest.Mocked<UserMongoRepo>;
      const mockBeerRepo = {
        getById: jest.fn().mockResolvedValue(mockBeer),
      } as unknown as BeerMongoRepo;
      const controller = new UsersController(mockRepo);
      controller.beerRepo = mockBeerRepo;

      await controller.addBeer(mockRequest, mockResponse, mockNext);
      await controller.addBeer(mockRequest, mockResponse, mockNext);
      expect(mockRepo.getById).toHaveBeenCalledWith('validUserId');
      expect(mockRepo.addBeer).toHaveBeenCalledWith(mockBeer, 'validUserID');
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedUser);
    });

    test("should add a pub to a user's visited beers list when the pub and user exist and the pub is not already in the user's visited pub list", async () => {
      const mockUser = { id: 'validUserID', visitado: [] };
      const mockPub = { id: 'validpubID' };
      const mockUpdatedUser = { userId: 'validpubID', visitado: [mockPub] };
      const mockRepo = {
        getById: jest.fn().mockResolvedValue(mockUser),
        addPub: jest.fn().mockResolvedValue(mockUpdatedUser),
      } as unknown as jest.Mocked<UserMongoRepo>;
      const mockPubRepo = {
        getById: jest.fn().mockResolvedValue(mockPub),
      } as unknown as PubMongoRepo;
      const controller = new UsersController(mockRepo);
      controller.pubRepo = mockPubRepo;

      await controller.addPub(mockRequest, mockResponse, mockNext);
      expect(mockRepo.getById).toHaveBeenCalledWith('validUserId');
      expect(mockRepo.addPub).toHaveBeenCalledWith(mockPub, 'validUserID');
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedUser);
    });
    test('should successfully remove a beer from a users tasted beers list when the beer and user exist and the beer is in the users tasted beers list', async () => {
      const mockBeer = { id: 'validBeerID' };
      const mockUser = { id: 'validUserID', probada: [mockBeer] };
      const mockUpdatedUser = { userId: 'validUserID', probada: [] };
      const mockRepo = {
        getById: jest.fn().mockResolvedValue(mockUser),
        removeBeer: jest.fn().mockResolvedValueOnce(mockUpdatedUser),
      } as unknown as jest.Mocked<UserMongoRepo>;
      const mockBeerRepo = {
        getById: jest.fn().mockResolvedValue(mockBeer),
      } as unknown as BeerMongoRepo;
      const controller = new UsersController(mockRepo);
      controller.beerRepo = mockBeerRepo;

      await controller.removeBeer(mockRequest, mockResponse, mockNext);
      expect(mockRepo.getById).toHaveBeenCalledWith('validUserId');
      expect(mockRepo.removeBeer).toHaveBeenCalledWith(mockBeer, 'validUserID');
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedUser);
    });
    test('should successfully remove a pub from a users visited pubs list when the pub and user exist and the pub is in the users visited pub list', async () => {
      const mockPub = { id: 'validpubID' };
      const mockUser = { id: 'validUserID', visitado: [mockPub] };
      const mockUpdatedUser = { userId: 'validUserID', visitado: [] };
      const mockRepo = {
        getById: jest.fn().mockResolvedValue(mockUser),
        removePub: jest.fn().mockResolvedValue(mockUpdatedUser),
      } as unknown as jest.Mocked<UserMongoRepo>;
      const mockPubRepo = {
        getById: jest.fn().mockResolvedValue(mockPub),
      } as unknown as PubMongoRepo;
      const controller = new UsersController(mockRepo);
      controller.pubRepo = mockPubRepo;

      await controller.removePub(mockRequest, mockResponse, mockNext);
      expect(mockRepo.getById).toHaveBeenCalledWith('validUserId');
      expect(mockRepo.removePub).toHaveBeenCalledWith(mockPub, 'validUserID');
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedUser);
    });
  });
  describe('When we instantiate it with errors', () => {
    let mockError: Error;
    beforeEach(() => {
      mockError = new Error('Mock error');
      const mockRepo = {
        getAll: jest.fn().mockRejectedValue(mockError),
        getById: jest.fn().mockRejectedValue(mockError),
        search: jest.fn().mockRejectedValue(mockError),
        create: jest.fn().mockRejectedValue(mockError),
        update: jest.fn().mockRejectedValue(mockError),
        delete: jest.fn().mockRejectedValue(mockError),
      } as unknown as UserMongoRepo;
      controller = new UsersController(mockRepo);
    });
    test('Then getAll should ...', async () => {
      await controller.getAll(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenLastCalledWith(mockError);
    });

    test('Then getById should ...', async () => {
      await controller.getById(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenLastCalledWith(mockError);
    });

    test('Then search should ...', async () => {
      await controller.search(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenLastCalledWith(mockError);
    });

    test('Then create should ...', async () => {
      await controller.create(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenLastCalledWith(mockError);
    });

    test('Then update should ...', async () => {
      await controller.update(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenLastCalledWith(mockError);
    });

    test('Then delete should ...', async () => {
      await controller.delete(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenLastCalledWith(mockError);
    });
    test('Then login should call next with an HttpError when an error occurs', async () => {
      await controller.login(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
    test('addBeer should throw HttpError with status 404 when user is not found', async () => {
      const mockUserRepo = {
        getById: jest.fn().mockResolvedValue(null),
      } as unknown as UserMongoRepo;
      const mockBeerRepo = {
        getById: jest.fn().mockResolvedValue({ id: 'validBeerId' }),
      } as unknown as BeerMongoRepo;
      const controller = new UsersController(mockUserRepo);
      controller.beerRepo = mockBeerRepo;
      await controller.addBeer(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(404, 'Not Found', 'User not found')
      );
    });
    test('addBeer should throw HttpError with status 404 when beer is not found', async () => {
      const mockUserRepo = {
        getById: jest.fn().mockResolvedValue({ probada: [] }),
      } as unknown as UserMongoRepo;
      const mockBeerRepo = {
        getById: jest.fn().mockResolvedValue(null),
      } as unknown as BeerMongoRepo;
      const controller = new UsersController(mockUserRepo);
      controller.beerRepo = mockBeerRepo;
      await controller.addBeer(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(404, 'Not Found', 'Beer not found')
      );
    });
    test("addBeer should throw HttpError with status 409 if beer is already in user's tasted beers list", async () => {
      const mockUser = {
        userId: 'validUserID',
        probada: [{ id: 'existingBeerID' }],
      };
      const mockBeer = { id: 'existingBeerID' };
      const mockRepo = {
        getById: jest.fn().mockResolvedValue(mockUser),
        addBeer: jest.fn(),
      } as unknown as jest.Mocked<UserMongoRepo>;
      const mockBeerRepo = {
        getById: jest.fn().mockResolvedValue(mockBeer),
      } as unknown as BeerMongoRepo;
      const controller = new UsersController(mockRepo);
      controller.beerRepo = mockBeerRepo;
      try {
        await controller.addBeer(mockRequest, mockResponse, mockNext);
      } catch (error) {
        expect(mockNext).toHaveBeenCalledWith(
          new HttpError(409, 'Conflict', 'Beer already in your tasted beers')
        );
        expect(mockRepo.getById).toHaveBeenCalledWith('validUserId');
        expect(mockRepo.addBeer).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith(error);
        expect(mockNext).toHaveBeenCalledWith(
          new HttpError(404, 'Not Found', 'Update not possible')
        );
      }
    });
    test('addBeer should throw an HttpError with status 404 and message "Update not possible" when the update fails', async () => {
      const mockUser = {
        userId: 'validUserId',
        probada: [{ id: 'existingBeerId' }],
      };
      const mockBeer = { id: 'validBeerId' };
      const mockRepo = {
        getById: jest.fn().mockResolvedValue(mockUser),
        addBeer: jest.fn().mockResolvedValue(null),
      } as unknown as jest.Mocked<UserMongoRepo>;
      const mockBeerRepo = {
        getById: jest.fn().mockResolvedValue(mockBeer),
      } as unknown as BeerMongoRepo;
      const controller = new UsersController(mockRepo);
      controller.beerRepo = mockBeerRepo;
      await controller.addBeer(mockRequest, mockResponse, mockNext);
      expect(mockRepo.getById).toHaveBeenCalledWith('validUserId');
      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(404, 'Not Found', 'Update not possible')
      );
    });
    test('removeBeer should throw HttpError with status 404 when user is not found', async () => {
      const mockUserRepo = {
        getById: jest.fn().mockResolvedValue(null),
      } as unknown as UserMongoRepo;
      const mockBeerRepo = {
        getById: jest.fn().mockResolvedValue({ id: 'validBeerId' }),
      } as unknown as BeerMongoRepo;
      const controller = new UsersController(mockUserRepo);
      controller.beerRepo = mockBeerRepo;
      await controller.removeBeer(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(404, 'Not Found', 'User not found')
      );
    });
    test('removeBeer should throw HttpError with status 404 when beer is not found', async () => {
      const mockRequest = {
        body: { id: 'validUserId' },
        params: { id: 'invalidBeerId' },
      } as unknown as Request;
      const mockUserRepo = {
        getById: jest.fn().mockResolvedValue({ probada: [] }),
      } as unknown as UserMongoRepo;
      const mockBeerRepo = {
        getById: jest.fn().mockResolvedValue(null),
      } as unknown as BeerMongoRepo;
      const controller = new UsersController(mockUserRepo);
      controller.beerRepo = mockBeerRepo;
      await controller.removeBeer(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(404, 'Not Found', 'Beer not found')
      );
    });
    test('removeBeer should throw an HttpError with status 404 and message "Update not possible" when the update fails', async () => {
      const mockUser = {
        id: 'validUserId',
        probada: [],
      };
      const mockBeer = { id: 'validBeerID' };
      const mockRepo = {
        getById: jest.fn().mockResolvedValue(mockUser),
        removeBeer: jest.fn().mockResolvedValue(null),
      } as unknown as jest.Mocked<UserMongoRepo>;
      const mockBeerRepo = {
        getById: jest.fn().mockResolvedValue(mockBeer),
      } as unknown as BeerMongoRepo;
      const controller = new UsersController(mockRepo);
      controller.beerRepo = mockBeerRepo;
      await controller.removeBeer(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(
          409,
          'Conflict',
          'Update not possible, Beer already erased'
        )
      );
    });
    test('addPub should throw HttpError with status 404 when user is not found', async () => {
      const mockUserRepo = {
        getById: jest.fn().mockResolvedValue(null),
      } as unknown as UserMongoRepo;
      const mockPubRepo = {
        getById: jest.fn().mockResolvedValue({ id: 'validPubId' }),
      } as unknown as PubMongoRepo;
      const controller = new UsersController(mockUserRepo);
      controller.pubRepo = mockPubRepo;
      await controller.addPub(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(404, 'Not Found', 'User not found')
      );
    });
    test('addPub should throw HttpError with status 404 when Pub is not found', async () => {
      const mockUserRepo = {
        getById: jest.fn().mockResolvedValue({ visitado: [] }),
      } as unknown as UserMongoRepo;
      const mockPubRepo = {
        getById: jest.fn().mockResolvedValue(null),
      } as unknown as PubMongoRepo;
      const controller = new UsersController(mockUserRepo);
      controller.pubRepo = mockPubRepo;
      await controller.addPub(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(404, 'Not Found', 'Beer not found')
      );
    });
    test('addPub should throw an HttpError with status 404 and message "Update not possible" when the update fails', async () => {
      const mockUser = {
        id: 'validUserId',
        visitado: [{ id: 'existingBeerId' }],
      };
      const mockPub = { id: 'validPubId' };
      const mockRepo = {
        getById: jest.fn().mockResolvedValue(mockUser),
        addPub: jest.fn().mockResolvedValue(null),
      } as unknown as jest.Mocked<UserMongoRepo>;
      const mockPubRepo = {
        getById: jest.fn().mockResolvedValue(mockPub),
      } as unknown as PubMongoRepo;
      const controller = new UsersController(mockRepo);
      controller.pubRepo = mockPubRepo;
      await controller.addPub(mockRequest, mockResponse, mockNext);
      expect(mockRepo.getById).toHaveBeenCalledWith('validUserId');
      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(404, 'Not Found', 'Update not possible')
      );
    });
    test("addPub should throw HttpError with status 409 if pub is already in user's visited pub list", async () => {
      const mockUser = {
        id: 'validUserID',
        visitado: [{ id: 'existingBeerID' }],
      };
      const mockPub = { id: 'existingBeerID' };
      const mockRepo = {
        getById: jest.fn().mockResolvedValue(mockUser),
        addPub: jest.fn(),
      } as unknown as jest.Mocked<UserMongoRepo>;
      const mockPubRepo = {
        getById: jest.fn().mockResolvedValue(mockPub),
      } as unknown as PubMongoRepo;
      const controller = new UsersController(mockRepo);
      controller.pubRepo = mockPubRepo;
      try {
        await controller.addPub(mockRequest, mockResponse, mockNext);
      } catch (error) {
        expect(mockNext).toHaveBeenCalledWith(
          new HttpError(409, 'Conflict', 'Pub already in your tasted beers')
        );
        expect(mockRepo.getById).toHaveBeenCalledWith('validUserId');
        expect(mockRepo.addPub).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith(error);
        expect(mockNext).toHaveBeenCalledWith(
          new HttpError(409, 'Conflict', 'Pub already in your tasted beers')
        );
      }
    });
    test('removePub should throw HttpError with status 404 when user is not found', async () => {
      const mockUserRepo = {
        getById: jest.fn().mockResolvedValue(null),
      } as unknown as UserMongoRepo;
      const mockPubRepo = {
        getById: jest.fn().mockResolvedValue({ id: 'validBeerId' }),
      } as unknown as PubMongoRepo;
      const controller = new UsersController(mockUserRepo);
      controller.pubRepo = mockPubRepo;
      await controller.removePub(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(404, 'Not Found', 'User not found')
      );
    });
    test('removePub should throw HttpError with status 404 when pub is not found', async () => {
      const mockRequest = {
        body: { id: 'validUserId' },
        params: { id: 'invalidBeerId' },
      } as unknown as Request;
      const mockUserRepo = {
        getById: jest.fn().mockResolvedValue({ probada: [] }),
      } as unknown as UserMongoRepo;
      const mockPubRepo = {
        getById: jest.fn().mockResolvedValue(null),
      } as unknown as PubMongoRepo;
      const controller = new UsersController(mockUserRepo);
      controller.pubRepo = mockPubRepo;
      await controller.removePub(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(404, 'Not Found', 'Beer not found')
      );
    });
    test('removePub should throw an HttpError with status 409 and message "Update not possible" when the update fails', async () => {
      const mockUser = {
        id: 'validUserId',
        visitado: [],
      };
      const mockPub = { id: 'validBeerID' };
      const mockRepo = {
        getById: jest.fn().mockResolvedValue(mockUser),
        removePub: jest.fn().mockResolvedValue(null),
      } as unknown as jest.Mocked<UserMongoRepo>;
      const mockPubRepo = {
        getById: jest.fn().mockResolvedValue(mockPub),
      } as unknown as PubMongoRepo;
      const controller = new UsersController(mockRepo);
      controller.pubRepo = mockPubRepo;
      await controller.removePub(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(
          409,
          'Conflict',
          'Update not possible, Beer already erased'
        )
      );
    });
  });
});
