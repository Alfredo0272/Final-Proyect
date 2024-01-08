import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { UsersController } from '../controller/user/user.controler';
import { UserMongoRepo } from '../repos/user/user.mongo.repo';

const debug = createDebug('W9Final:user:router');

export const userRouter = createRouter();

debug('Starting');
const repo = new UserMongoRepo();
const controller = new UsersController(repo);

userRouter.post('/login', controller.login.bind(controller));
userRouter.post('/register', controller.create.bind(controller));
