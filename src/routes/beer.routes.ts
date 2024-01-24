import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { BeerMongoRepo } from '../repos/beer/beer.mongo.repo.js';
import { BeerController } from '../controller/beer/beer.controller.js';
import { FileInterceptor } from '../middleware/file.interceptor.js';
// Import { Interceptor } from '../middleware/auth.interceptor.js';

const debug = createDebug('W9Final:beer:router');

export const beerRouter = createRouter();
debug('Starting');

const repo = new BeerMongoRepo();
const controller = new BeerController(repo);
const fileInterceptor = new FileInterceptor();
// Const interceptor = new Interceptor();

beerRouter.post(
  '/:id',
  fileInterceptor.singleFileStore('beerImg').bind(fileInterceptor),
  controller.createBeer.bind(controller)
);
beerRouter.get(
  '/',
  fileInterceptor.singleFileStore('beerImg').bind(fileInterceptor),
  controller.getAll.bind(controller)
);
beerRouter.get(
  '/:id',
  fileInterceptor.singleFileStore('beerImg').bind(fileInterceptor),
  controller.getById.bind(controller)
);

beerRouter.delete(
  '/delBeer/:id',
  fileInterceptor.singleFileStore('beerImg').bind(fileInterceptor),
  controller.delete.bind(controller)
);
