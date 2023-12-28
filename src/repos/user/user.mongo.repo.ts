/* eslint-disable no-unused-vars */
import createDebug from 'debug';
import { UserRepository } from './user.repo';
import { User, UserLogin } from '../../entities/user';
import { Beer } from '../../entities/beer';
import { Pub } from '../../entities/pubs';
import { UserModel } from './user.mongo.model';
import { HttpError } from '../../types/http.error';
import { Auth } from '../../services/auth';

const debug = createDebug('W9Final:Users:mongo:repo');

export class UserMongoRepo implements UserRepository<User, Beer, Pub> {
  constructor() {
    debug('Instantiated');
  }

  async login(loginUser: UserLogin): Promise<User> {
    const result = await UserModel.findOne({ email: loginUser.email })
      .populate('provadda', 'visitado')
      .exec();
    if (!result || !(await Auth.compare(loginUser.password, result.password)))
      throw new HttpError(401, 'Unauthorized');
    return result;
  }

  create(_newItem: Omit<User, 'id'>): Promise<User> {
    throw new Error('Method not implemented.');
  }

  getAll(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  getById(_id: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  search({
    key,
    value,
  }: {
    key:
      | keyof UserLogin
      | 'id'
      | 'name'
      | 'surname'
      | 'age'
      | 'userName'
      | 'probada'
      | 'visitado'
      | 'role';
    value: unknown;
  }): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  update(_id: string, _updatedItem: Partial<User>): Promise<User> {
    throw new Error('Method not implemented.');
  }

  delete(_id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  addBeer(_beer: Beer, _userId: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  addPub(_pub: Pub, _userId: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  removeBeer(_beer: Beer, _userId: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  removePub(_pub: Pub, _userId: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
