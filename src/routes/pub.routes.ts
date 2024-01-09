import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { PubMongoRepo } from '../repos/pub/pub.mongo.repo';
import { PubController } from '../controller/pub/pub.controller';
import { FileInterceptor } from '../middleware/file.interceptor';
import { AuthInterceptor } from '../middleware/auth.interceptor';

const debug = createDebug('W9Final:user:router');
export const pubRouter = createRouter();
debug('Starting');
const repo = new PubMongoRepo();
const controller = new PubController(repo);
const interceptor = new AuthInterceptor();
const fileInterceptor = new FileInterceptor();

pubRouter.post(
  '/create',
  interceptor.authorization.bind(interceptor),
  interceptor.isAdmin.bind(interceptor),
  fileInterceptor.singleFileStore('logo').bind(fileInterceptor),
  controller.createPub.bind(controller)
);

pubRouter.get(
  '/',
  interceptor.authorization.bind(interceptor),
  interceptor.isAdmin.bind(interceptor),
  fileInterceptor.singleFileStore('logo').bind(fileInterceptor),
  controller.getAll.bind(controller)
);

pubRouter.get(
  '/:id',
  fileInterceptor.singleFileStore('logo').bind(fileInterceptor),
  controller.getById.bind(controller)
);

pubRouter.patch(
  '/addBeer/:id',
  interceptor.authorization.bind(interceptor),
  interceptor.isAdmin.bind(interceptor),
  controller.addPubBeer.bind(controller)
);

pubRouter.patch(
  '/addBeer/:id',
  interceptor.authorization.bind(interceptor),
  interceptor.isAdmin.bind(interceptor),
  controller.removePubBeer.bind(controller)
);
