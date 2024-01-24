import { Beer } from './beer.model';
import { Pub } from './pub.model.js';

export type UserLogin = {
  email: string;
  password: string;
};

export type User = UserLogin & {
  id: string;
  name: string;
  surname: string;
  age: number;
  userName: string;
  probada: Beer[];
  visitado: Pub[];
  role: 'Admin' | 'User';
};
