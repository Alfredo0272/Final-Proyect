import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { Controller } from '../controller.js';
import { Pub } from '../../entities/pub.model.js';
import { BeerMongoRepo } from '../../repos/beer/beer.mongo.repo.js';
import { PubMongoRepo } from '../../repos/pub/pub.mongo.repo.js';
import { HttpError } from '../../types/http.error.js';

const debug = createDebug('W9Final:pubs:controller');

export class PubController extends Controller<Pub> {
  beerRepo: BeerMongoRepo;
  constructor(protected repo: PubMongoRepo) {
    super(repo);
    this.beerRepo = new BeerMongoRepo();
    debug('Instantiated');
  }

  async createPub(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file)
        throw new HttpError(406, 'Not Acceptable', 'Invalid multer file');
      const imgData = await this.cloudinaryService.uploadImage(req.file.path);
      req.body.logo = imgData;
      const result = await this.repo.create(req.body);
      res.status(201);
      res.statusMessage = 'Created';
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async addPubBeer(req: Request, res: Response, next: NextFunction) {
    try {
      const pub = await this.repo.getById(req.body.id);
      const beer = await this.beerRepo.getById(req.params.id);

      if (!pub) {
        throw new HttpError(404, 'Not Found', 'Pub not found');
      }

      if (!beer) {
        throw new HttpError(404, 'Not Found', 'Beer not found');
      }

      if (pub.beers.find((tapBeers) => tapBeers.id === beer.id)) {
        throw new HttpError(409, 'Conflict', 'Beer already in the tap beers');
      }

      if (pub.beers.length >= pub.taps) {
        throw new HttpError(400, 'Bad Request', 'The pub is at full capacity');
      }

      const updatedPub = await this.repo.addBeer(beer, pub.id);
      await beer.pubs.push(pub);
      await this.beerRepo.update(beer.id, beer);
      if (!updatedPub) {
        throw new HttpError(404, 'Not Found', 'Update not possible');
      }

      res.json(updatedPub);
    } catch (error) {
      next(error);
    }
  }

  async removePubBeer(req: Request, res: Response, next: NextFunction) {
    try {
      const pub = await this.repo.getById(req.body.id);
      const beer = await this.beerRepo.getById(req.params.id);

      if (!pub) {
        throw new HttpError(404, 'Not Found', 'Pub not found');
      }

      if (!beer) {
        throw new HttpError(404, 'Not Found', 'Beer not found');
      }

      if (!pub.beers.find((tapBeers) => tapBeers.id === beer.id)) {
        throw new HttpError(
          409,
          'Conflict',
          'Update not possible, Beer already erased'
        );
      }

      const beerPubs = beer.pubs.findIndex((item) => item.id === pub.id);
      beer.pubs.splice(beerPubs, 1);
      const updatedBeer = await this.beerRepo.update(beer.id, beer);
      const result = await this.repo.removeBeer(beer, pub.id);
      res.json({ pub: result, beer: updatedBeer });
    } catch (error) {
      next(error);
    }
  }
}
