import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { Controller } from '../controller';
import { Pub } from '../../entities/pub.model';
import { BeerMongoRepo } from '../../repos/beer/beer.mongo.repo';
import { PubMongoRepo } from '../../repos/pub/pub.mongo.repo';
import { HttpError } from '../../types/http.error';

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

      const updatedPub = await this.repo.addBeer(beer, pub.id);

      if (!updatedPub) {
        throw new HttpError(404, 'Not Found', 'Update not possible');
      }

      res.json(updatedPub);
    } catch (error) {
      next(error);
    }
  }

  async removeBeer(req: Request, res: Response, next: NextFunction) {
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

      const result = await this.repo.removeBeer(await beer, pub.id);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
