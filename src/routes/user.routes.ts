import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { UsersController } from '../controller/user/user.controller.js';
import { UserMongoRepo } from '../repos/user/user.mongo.repo.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';

const debug = createDebug('W9Final:user:router');
export const userRouter = createRouter();
debug('Starting');
const repo = new UserMongoRepo();
const controller = new UsersController(repo);
const interceptor = new AuthInterceptor();

userRouter.post('/login', controller.login.bind(controller));
userRouter.patch(
  '/login',
  interceptor.authorization.bind(interceptor),
  controller.login.bind(controller)
);
userRouter.post('/register', controller.create.bind(controller));

userRouter.patch(
  '/addBeer/:id',
  interceptor.authorization.bind(interceptor),
  controller.addBeer.bind(controller)
);
userRouter.patch(
  '/delBeer/:id',
  interceptor.authorization.bind(interceptor),
  controller.removeBeer.bind(controller)
);

userRouter.get(
  '/:id',
  interceptor.authorization.bind(interceptor),
  interceptor.isAdmin.bind(interceptor),
  controller.getById.bind(controller)
);

userRouter.get(
  '/',
  interceptor.authorization.bind(interceptor),
  controller.getAll.bind(controller)
);
