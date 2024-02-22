import { Beer } from '../../entities/beer.model';
import { Pub } from '../../entities/pub.model';
import { HttpError } from '../../types/http.error';
import { PubModel } from './pub.mongo.model';
import { PubMongoRepo } from './pub.mongo.repo';

jest.mock('./pub.mongo.model');
jest.mock('../beer/beer.mongo.model');

describe('Given PubMongoRepo class', () => {
  const id = 'validId';
  const pub = {
    name: 'Updated Beer',
    beers: [],
  } as unknown as Pub;
  const beer = {} as unknown as Beer;
  let repo: PubMongoRepo;
  describe('When we instantiate it without errors', () => {
    const exec = jest.fn().mockResolvedValue(pub);
    beforeEach(() => {
      repo = new PubMongoRepo();
      PubModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      PubModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      PubModel.create = jest.fn().mockReturnValue(pub);
      PubModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      PubModel.findByIdAndDelete = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
    });
    test('should return all Pubs', async () => {
      const result = await repo.getAll();
      expect(PubModel.find).toHaveBeenCalledWith();
      expect(result).toEqual(pub);
    });
    test('should return a beer object when a valid id is passed', async () => {
      const result = await repo.getById(id);
      expect(PubModel.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(pub);
    });
    test('Then it should execute search', async () => {
      const result = await repo.search({ key: 'beers', value: '' });
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(pub);
    });
    test('should create a new user with valid input', async () => {
      const result = await repo.create({} as Omit<Pub, 'id'>);
      expect(PubModel.create).toHaveBeenCalled();
      expect(result).toEqual(pub);
    });
    test('Then update should be executed with', async () => {
      const result = await repo.update('', { beers: [] });
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(pub);
    });
    test('Then should delete a beer with a valid id', async () => {
      const result = await repo.delete(id);
      expect(exec).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
    test('should return an add Pub and update objet', async () => {
      const updatedPub = {
        beers: [{}] as unknown as Beer,
      };
      PubModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedPub),
      });
      const result = await repo.addBeerToTap(beer, id);
      expect(result).toEqual(updatedPub);
    });
    test('should delete a beer fron the provadas array', async () => {
      const updatedPub = { id, beer: [] };
      PubModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedPub),
      });
      const result = await repo.removeBeerFromTap(beer, id);
      expect(result).toEqual(updatedPub);
    });
  });
  describe('When we instantiate it with an error', () => {
    const exec = jest.fn().mockResolvedValue(null);
    const newData: Partial<Pub> = { name: 'John pub' };
    const id = 'invalidId';
    beforeEach(() => {
      repo = new PubMongoRepo();
      PubModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      PubModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      PubModel.create = jest.fn().mockReturnValue(pub);
      PubModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      });
      PubModel.findByIdAndDelete = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });
    });
    test('Then getAll method should throw an error', async () => {
      expect(repo.getAll).rejects.toThrow();
    });
    test('Then getById method should throw an error', async () => {
      expect(repo.getById).rejects.toThrow();
    });
    test('Then, when data isnt found with the update() method', async () => {
      PubModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(null),
        }),
      });
      await expect(repo.update(id, newData)).rejects.toThrow(HttpError);
      expect(PubModel.findByIdAndUpdate).toHaveBeenCalledWith(id, newData, {
        new: true,
      });
    });
    test('Then it should execute delete method', async () => {
      await expect(repo.delete(id)).rejects.toThrow(HttpError);
    });
    test('should throw a 404 error if the user is not found in the database when we update the beers list', async () => {
      await expect(repo.addBeerToTap(beer, id)).rejects.toThrow(
        new HttpError(404, 'Not Found in mongo repo', 'Update not possible')
      );
    });
    test('should throw a HttpError with status 404 when the removeBeer fails', async () => {
      await expect(repo.removeBeerFromTap(beer, id)).rejects.toThrow(
        new HttpError(404, 'Not Found in mongo repo', 'Update not possible')
      );
    });
  });
});
