import { User } from '../../entities/user';
import { Auth } from '../../services/auth';
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

  describe('When we instantiate it without errors', () => {
    beforeEach(() => {
      repo = new UserMongoRepo();
      UserModel.findOne = jest.fn().mockReturnValue({
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
      UserModel.findByIdAndUpdate = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockReturnValue({ exec }) });
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
  });
});
