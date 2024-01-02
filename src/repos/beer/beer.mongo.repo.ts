import createDebug from 'debug';
import { Repository } from './beer.repo';
import { UserMongoRepo } from '../user/user.mongo.repo';
import { Beer } from '../../entities/beer.model';
import { BeerModel } from './beer.mongo.model';
import { HttpError } from '../../types/http.error';

const debug = createDebug('W9Final:Beer:mongo:repo');

export class BeerMongoRepo implements Repository<Beer> {
  userRepo: UserMongoRepo;
  constructor() {
    this.userRepo = new UserMongoRepo();
    debug('instantiated');
  }

  async getAll(): Promise<Beer[]> {
    const result = await BeerModel.find().populate('author').exec();
    if (!result)
      throw new HttpError(404, 'Not Found', 'getAll nethod not possible');
    return result;
  }

  async getById(id: string): Promise<Beer> {
    const data = await BeerModel.findById(id).populate('author').exec();
    if (!data) {
      throw new HttpError(404, 'Not Found', 'Beer not found in file sistem', {
        cause: 'trying findById',
      });
    }

    return data;
  }

  async search({
    key,
    value,
  }: {
    key: keyof Beer;
    value: any;
  }): Promise<Beer[]> {
    const result = await BeerModel.find({ [key]: value })
      .populate('author', {
        user: 0,
      })
      .exec();

    return result;
  }

  async create(newItem: Omit<Beer, 'id'>): Promise<Beer> {
    const result: Beer = await BeerModel.create(newItem);
    return result;
  }

  async update(id: string, updatedItem: Partial<Beer>): Promise<Beer> {
    const result = await BeerModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
    })
      .populate('User', { name: 1 })
      .exec();
    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');

    return result;
  }

  async delete(id: string): Promise<void> {
    const result = await BeerModel.findByIdAndDelete(id)
      .populate('author', { beer: 0 })
      .exec();
    if (!result) {
      throw new HttpError(404, 'Not Found', 'Delete not possible');
    }
  }
}
