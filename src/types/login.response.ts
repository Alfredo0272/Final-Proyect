import { User } from '../entities/user.model.js';

export type LoginResponse = {
  user: User;
  token: String;
};
