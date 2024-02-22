import createDebug from 'debug';
import { BeerRepository } from './beer.repo.js';
import { Beer } from '../../entities/beer.model.js';
import { BeerModel } from './beer.mongo.model.js';
import { HttpError } from '../../types/http.error.js';

const debug = createDebug('W9Final:Beer:mongo:repo');

export class BeerMongoRepo implements BeerRepository<Beer> {
  constructor() {
    debug('instantiated');
  }

  async getAll(): Promise<Beer[]> {
    const result = await BeerModel.find().populate('author', 'pubs').exec();
    if (!result)
      throw new HttpError(404, 'Not Found', 'Beer not found in file sistem');
    return result;
  }

  async getById(id: string): Promise<Beer> {
    const data = await BeerModel.findById(id).populate('author', 'pubs').exec();
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
      .populate('author', { user: 0 }, 'pubs', { pub: 0 })
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
      .populate('author', { id: 0 })
      .populate('pubs', { id: 0 })
      .exec();
    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');

    return result;
  }

  async delete(id: string): Promise<void> {
    const result = await BeerModel.findByIdAndDelete(id)
      .populate('author', 'pubs')
      .exec();
    if (!result) {
      throw new HttpError(404, 'Not Found', 'Delete not possible');
    }
  }
}
