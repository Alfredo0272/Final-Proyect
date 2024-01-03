import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { PubMongoRepo } from '../../repos/pub/pub.mongo.repo';
import { BeerMongoRepo } from '../../repos/beer/beer.mongo.repo';
import { Controller } from '../controller';
import { User } from '../../entities/user.model';
import { UserMongoRepo } from '../../repos/user/user.mongo.repo';
import { LoginResponse } from '../../types/login.response';
import { Auth } from '../../services/auth';
import { HttpError } from '../../types/http.error';

const debug = createDebug('W9Final:users:controller');

export class UsersController extends Controller<User> {
  beerRepo: BeerMongoRepo;
  pubRepo: PubMongoRepo;
  constructor(protected repo: UserMongoRepo) {
    super(repo);

    this.beerRepo = new BeerMongoRepo();
    this.pubRepo = new PubMongoRepo();
    debug('Instantiated');
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = req.body.userId
        ? await this.repo.getById(req.body.userId)
        : await this.repo.login(req.body);

      const data: LoginResponse = {
        user: result,
        token: Auth.signJWT({
          id: result.id,
          email: result.email,
          role: result.role,
        }),
      };
      res.status(202);
      res.statusMessage = 'Accepted';
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async addBeer(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.repo.getById(req.body.id);
      const beer = await this.beerRepo.getById(req.params.id);
      if (!user) {
        throw new HttpError(404, 'Not Found', 'User not found');
      }

      if (!beer) {
        throw new HttpError(404, 'Not Found', 'Beer not found');
      }

      if (user.probada.includes(beer)) {
        throw new HttpError(
          409,
          'Conflict',
          'Beer already in your tasted beers'
        );
      }

      const updatedUser = await this.repo.addBeer(beer, user.id);

      if (!updatedUser) {
        throw new HttpError(404, 'Not Found', 'Update not possible');
      }

      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async addPub(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.repo.getById(req.body.id);
      const pub = await this.pubRepo.getById(req.params.id);
      if (!user) {
        throw new HttpError(404, 'Not Found', 'User not found');
      }

      if (!pub) {
        throw new HttpError(404, 'Not Found', 'Pub not found');
      }

      if (user.visitado.includes(pub)) {
        throw new HttpError(
          409,
          'Conflict',
          'Pub already in your visited pubs'
        );
      }

      const updatedUser = await this.repo.addPub(pub, user.id);

      if (!updatedUser) {
        throw new HttpError(404, 'Not Found', 'Update not possible');
      }

      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async removeBeer(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.repo.getById(req.body.id);
      const beer = await this.beerRepo.getById(req.params.id);

      if (!user) {
        throw new HttpError(404, 'Not Found', 'User not found');
      }

      if (!beer) {
        throw new HttpError(404, 'Not Found', 'Beer not found');
      }

      if (user.probada.includes(beer)) {
        throw new HttpError(
          404,
          'Beer Found',
          'Update not possible, Beer already erase'
        );
      }

      const result = await this.repo.removeBeer(await beer, user.id);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async removePub(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.repo.getById(req.body.id);
      const Pub = await this.pubRepo.getById(req.params.id);

      if (!user) {
        throw new HttpError(404, 'Not Found', 'User not found');
      }

      if (!Pub) {
        throw new HttpError(404, 'Not Found', 'Pub not found');
      }

      if (user.visitado.includes(Pub)) {
        throw new HttpError(
          404,
          'Pub Found',
          'Update not possible, Pub already erase'
        );
      }

      const result = await this.repo.removePub(await Pub, user.id);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
