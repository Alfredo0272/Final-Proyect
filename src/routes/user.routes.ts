import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { UsersController } from '../controller/user/user.controler';
import { UserMongoRepo } from '../repos/user/user.mongo.repo';
import { ValidationInterceptor } from '../middleware/validation.interceptor';

const debug = createDebug('W9Final:user:router');
export const userRouter = createRouter();
debug('Starting');
const repo = new UserMongoRepo();
const controller = new UsersController(repo);
const validationInterceptor = new ValidationInterceptor();

userRouter.post('/login', controller.login.bind(controller));
userRouter.post(
  '/register',
  validationInterceptor.registerValidator().bind(validationInterceptor),
  controller.create.bind(controller)
);
