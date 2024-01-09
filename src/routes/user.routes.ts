import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { UsersController } from '../controller/user/user.controler';
import { UserMongoRepo } from '../repos/user/user.mongo.repo';
import { ValidationInterceptor } from '../middleware/validation.interceptor';
import { AuthInterceptor } from '../middleware/auth.interceptor';

const debug = createDebug('W9Final:user:router');
export const userRouter = createRouter();
debug('Starting');
const repo = new UserMongoRepo();
const controller = new UsersController(repo);
const interceptor = new AuthInterceptor();
const validationInterceptor = new ValidationInterceptor();

userRouter.post('/login', controller.login.bind(controller));
userRouter.patch(
  '/login',
  interceptor.authorization.bind(interceptor),
  controller.login.bind(controller)
);
userRouter.post(
  '/register',
  validationInterceptor.registerValidator().bind(validationInterceptor),
  controller.create.bind(controller)
);
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
