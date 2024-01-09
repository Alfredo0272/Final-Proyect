import createDebug from 'debug';
import { Beer } from '../../entities/beer.model';
import { Pub } from '../../entities/pub.model';
import { PubRepository } from './pub.repo';
import { HttpError } from '../../types/http.error';
import { PubModel } from './pub.mongo.model';

const debug = createDebug('W9Final:Pubs:mongo:repo');
export class PubMongoRepo implements PubRepository<Pub, Beer> {
  constructor() {
    debug('instantiated');
  }

  async getAll(): Promise<Pub[]> {
    const result = await PubModel.find().populate('beers').exec();
    if (!result)
      throw new HttpError(404, 'Not Found', 'getAll method not possible');
    return result;
  }

  async getById(id: string): Promise<Pub> {
    const data = await PubModel.findById(id).populate('beers').exec();
    if (!data) {
      throw new HttpError(404, 'Not Found', 'Pub not found in file system', {
        cause: 'Trying findById',
      });
    }

    return data;
  }

  async search({ key, value }: { key: keyof Pub; value: any }): Promise<Pub[]> {
    const result = await PubModel.find({ [key]: value })
      .populate('beers', {
        beer: 0,
      })
      .exec();

    return result;
  }

  async create(newItem: Omit<Pub, 'id'>): Promise<Pub> {
    const result: Pub = await PubModel.create(newItem);
    return result;
  }

  async update(id: string, newData: Partial<Pub>): Promise<Pub> {
    const data = await PubModel.findByIdAndUpdate(id, newData, {
      new: true,
    })
      .populate('beers', { beer: 1 })
      .exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'Pub not found in file system', {
        cause: 'Trying findByIdAndUpdate',
      });
    return data;
  }

  async delete(id: string): Promise<void> {
    const result = await PubModel.findByIdAndDelete(id)
      .populate('beers')
      .exec();
    if (!result)
      throw new HttpError(404, 'Not Found', 'Pub not found in file system', {
        cause: 'Fail to delete',
      });
  }

  async addBeer(beer: Beer, pubId: Pub['id']): Promise<Pub> {
    const updatedUser = await PubModel.findByIdAndUpdate(
      pubId,
      { $push: { beers: beer } },
      { new: true }
    ).exec();

    if (!updatedUser) {
      throw new HttpError(
        404,
        'Not Found in mongo repo',
        'Update not possible'
      );
    }

    return updatedUser;
  }

  async removeBeer(beer: Beer, pubId: Pub['id']): Promise<Pub> {
    const updatedUser = await PubModel.findByIdAndUpdate(
      pubId,
      { $pull: { beers: beer.id } },
      { new: true }
    ).exec();

    if (!updatedUser) {
      throw new HttpError(404, 'Not Found', 'Update not possible');
    }

    return updatedUser;
  }
}
