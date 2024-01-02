import { Beer } from '../../entities/beer.model';
import { Pub } from '../../entities/pub.model';
import { User } from '../../entities/user.model';
import { Auth } from '../../services/auth';
import { HttpError } from '../../types/http.error';
import { UserModel } from './user.mongo.model';
import { UserMongoRepo } from './user.mongo.repo';

jest.mock('./user.mongo.model');
jest.mock('../../services/auth');
jest.mock('../beer/beer.mongo.model');
jest.mock('../pub/pub.mongo.model');

describe('Given UserMongoRepo class', () => {
  const id = 'validId';
  const user: User = {} as unknown as User;
  let repo: UserMongoRepo;
  const exec = jest.fn().mockResolvedValue(user);
  const hashedPassword = 'hashedPassword';
  const beer: Beer = {} as unknown as Beer;
  const pub: Pub = {} as unknown as Pub;
  describe('When we instantiate it without errors', () => {
    beforeEach(() => {
      repo = new UserMongoRepo();
      UserModel.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      UserModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      UserModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      UserModel.create = jest.fn().mockReturnValue({});
      UserModel.findByIdAndDelete = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      Auth.compare = jest.fn().mockResolvedValue(true);
      Auth.hash = jest.fn().mockResolvedValue(hashedPassword);
    });
    test('should find a user by email and return it when a valid email is provided', async () => {
      const loginUser = {
        email: 'test@example.com',
        password: 'password123',
      };
      const result = await repo.login(loginUser);
      expect(UserModel.findOne).toHaveBeenCalledWith({
        email: loginUser.email,
      });
      expect(result).toEqual(user);
    });
    test('should create a new user with valid input', async () => {
      const result = await repo.create({} as Omit<User, 'id'>);
      expect(Auth.hash).toHaveBeenCalled();
      expect(UserModel.create).toHaveBeenCalled();
      expect(result).toEqual(user);
    });
    test('should return a user object when a valid id is passed', async () => {
      const repo = new UserMongoRepo();
      const result = await repo.getById(id);
      expect(UserModel.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(user);
    });
    test('should return all users', async () => {
      const repo = new UserMongoRepo();
      const result = await repo.getAll();
      expect(UserModel.find).toHaveBeenCalledWith();
      expect(result).toEqual(user);
    });
    test('Then it should execute search', async () => {
      const result = await repo.search({ key: 'age', value: 18 });
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(user);
    });
    test('Then it should execute update', async () => {
      const result = await repo.update('', { name: '' });
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(user);
    });
    test('Then it should execute delete', async () => {
      const result = await repo.delete(id);
      expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });
    test('should return an add beer and update objet', async () => {
      const updatedUser = {
        probada: [beer],
      };
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });
      const result = await repo.addBeer(beer, id);
      expect(result).toEqual(updatedUser);
    });
    test('should return an add Pub and update objet', async () => {
      const updatedUser = {
        visitado: [pub],
      };
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });
      const result = await repo.addPub(pub, id);
      expect(result).toEqual(updatedUser);
    });
    test('should delete a beer fron the provadas array', async () => {
      const updatedUser = { id, probada: [] };
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });
      const result = await repo.removeBeer(beer, id);
      expect(result).toEqual(updatedUser);
    });
    test('should delete a Pub fron the visitado array', async () => {
      const updatedUser = { id, visitado: [] };
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });
      const result = await repo.removePub(pub, id);
      expect(result).toEqual(updatedUser);
    });
  });
  describe('When we instantiate it with errors', () => {
    const id = 'invalidId';
    const newData: Partial<User> = { name: 'John Doe' };
    beforeEach(() => {
      repo = new UserMongoRepo();
      const exec = jest.fn().mockResolvedValueOnce(null);
      UserModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });

      UserModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      UserModel.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      });
      UserModel.findByIdAndDelete = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });
    });
    test('Then login should throw an error', async () => {
      expect(repo.login({} as User)).rejects.toThrow();
    });
    test('Then getAll should throw an error', async () => {
      expect(repo.getAll).rejects.toThrow();
    });
    test('Then getById should throw an error', async () => {
      expect(repo.getById).rejects.toThrow();
    });
    test('Then, when data isnt found with the update() method', async () => {
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(null),
        }),
      });
      await expect(repo.update(id, newData)).rejects.toThrow(HttpError);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(id, newData, {
        new: true,
      });
    });
    test('Then, when data isnt found with the delete() method', async () => {
      await expect(repo.delete('')).rejects.toThrow();
    });
    test('should throw a 404 error if the user is not found in the database', async () => {
      await expect(repo.addBeer(beer, id)).rejects.toThrow(
        new HttpError(404, 'Not Found in mongo repo', 'User not found')
      );
    });
    test('should throw a 404 error if the user is not found in the database when we update the visitado list', async () => {
      await expect(repo.addPub(pub, id)).rejects.toThrow(
        new HttpError(404, 'Not Found in mongo repo', 'Update not possible')
      );
    });
    test('should throw a HttpError with status 404 when the removeBeer fails', async () => {
      await expect(repo.removeBeer(beer, id)).rejects.toThrow(
        new HttpError(404, 'Not Found in mongo repo', 'Update not possible')
      );
    });
    test('should throw a HttpError with status 404 when the removePub fails', async () => {
      await expect(repo.removePub(pub, id)).rejects.toThrow(
        new HttpError(404, 'Not Found in mongo repo', 'Update not possible')
      );
    });
  });
});
