import { Beer } from '../../entities/beer.model';
import { HttpError } from '../../types/http.error';
import { BeerModel } from './beer.mongo.model';
import { BeerMongoRepo } from './beer.mongo.repo';

jest.mock('../user/user.mongo.model');
jest.mock('./beer.mongo.model');

describe('Given BeerMongoRepo class', () => {
  const id = 'validId';
  const beer = {
    name: 'Updated Beer',
    author: 'validUserID',
  } as unknown as Beer;
  let repo: BeerMongoRepo;
  describe('When we instantiate it without errors', () => {
    const exec = jest.fn().mockResolvedValue(beer);
    beforeEach(() => {
      repo = new BeerMongoRepo();

      BeerModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      BeerModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      BeerModel.create = jest.fn().mockReturnValue(beer);
      BeerModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec,
          }),
        }),
      });
      BeerModel.findByIdAndDelete = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
    });
    test('should return all beers', async () => {
      const result = await repo.getAll();
      expect(BeerModel.find).toHaveBeenCalledWith();
      expect(result).toEqual(beer);
    });
    test('should return a beer object when a valid id is passed', async () => {
      const result = await repo.getById(id);
      expect(BeerModel.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(beer);
    });

    test('Then it should execute search', async () => {
      const result = await repo.search({ key: 'alcohol', value: '' });
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(beer);
    });
    test('should create a new user with valid input', async () => {
      const result = await repo.create({} as Omit<Beer, 'id'>);
      expect(BeerModel.create).toHaveBeenCalled();
      expect(result).toEqual(beer);
    });
    test('Then update should be executed with', async () => {
      const result = await repo.update('', { brewer: '' });
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(beer);
    });
    test('Then should delete a beer with a valid id', async () => {
      const result = await repo.delete(id);
      expect(exec).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });
  describe('When we have an error', () => {
    const exec = jest.fn().mockResolvedValue(null);
    beforeEach(() => {
      repo = new BeerMongoRepo();
      BeerModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      BeerModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      BeerModel.create = jest.fn().mockReturnValue(beer);
      BeerModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec,
          }),
        }),
      });
      BeerModel.findByIdAndDelete = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
    });
    test('should throw an HttpError with status 404 and correct message', async () => {
      await expect(repo.getAll()).rejects.toThrow(HttpError);
      await expect(repo.getAll()).rejects.toThrow(
        'Beer not found in file sistem'
      );
    });
    test('should throw an HttpError with status 404 when an invalid id is passed', async () => {
      const id = 'invalidId';
      await expect(repo.getById(id)).rejects.toThrow(HttpError);
    });
    test('should throw an HttpErrorand dont update beer when a invalid id is passed', async () => {
      const id = 'invalidId';
      const updatedItem = {
        name: 'Updated Beer',
      };
      await expect(repo.update(id, updatedItem)).rejects.toThrow(HttpError);
    });
    test('should not delete a beer with a invalid id', async () => {
      const id = 'invalidId';
      await expect(repo.delete(id)).rejects.toThrow(HttpError);
    });
  });
});
