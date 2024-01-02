import jwt from 'jsonwebtoken';
import { User } from '../entities/user.js';

export type TokenPayload = {
  id: User['id'];
  email: string;
} & jwt.JwtPayload;
