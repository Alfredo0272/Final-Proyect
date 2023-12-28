import { User } from '../../entities/user';
import { Auth } from '../../services/auth';
import { UserModel } from './user.mongo.model';
import { UserMongoRepo } from './user.mongo.repo';

jest.mock('./user.mongo.model');
jest.mock('../../services/auth');
jest.mock('../beer/beer.mongo.model');
jest.mock('../pub/pub.mongo.model');

describe('Given UserMongoRepo class', () => {
  // eslint-disable-next-line no-unused-vars
  let repo: UserMongoRepo;
  const exec = jest.fn().mockResolvedValue('name');

  describe('When we instantiate it without errors', () => {
    beforeEach(() => {
      repo = new UserMongoRepo();
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
      UserModel.create = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockReturnValue({ exec }) });
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
      });
      Auth.compare = jest.fn().mockResolvedValue(true);
    });
    const id = 'validId';
    const user: User = {} as unknown as User;
    test('should return a user object when a valid id is passed', async () => {
      const repo = new UserMongoRepo();
      const exec = jest.fn().mockResolvedValue(user);
      UserModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });

      const result = await repo.getById(id);
      expect(UserModel.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(user);
    });
  });
});
