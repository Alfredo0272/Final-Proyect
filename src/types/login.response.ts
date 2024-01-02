import { User } from '../entities/user.js';

export type LoginResponse = {
  user: User;
  token: String;
};
