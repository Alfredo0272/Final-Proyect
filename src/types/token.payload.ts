import jwt from 'jsonwebtoken';
import { User } from '../entities/user.model.js';

export type TokenPayload = {
  id: User['id'];
  email: string;
  role: User['role'];
} & jwt.JwtPayload;
