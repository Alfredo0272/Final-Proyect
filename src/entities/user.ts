import { Beer } from './beer';
import joi from 'joi';
import { Pub } from './pubs';

export type UserLogin = {
  password: string;
  email: string;
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

export const userJoiSchema = joi.object<User>({
  email: joi.string().email().required().messages({
    'string.base': 'Formato no válido',
    'string.email': 'Formato de email no válido',
    'string.required': 'Valor requerido',
  }),
  password: joi
    .string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .required(),
  age: joi.number().min(18).max(100),
});
