import { Schema, model } from 'mongoose';
import { User } from '../../entities/user.model.js';

export const userSchema = new Schema<User>({
  name: {
    type: String,
    required: true,
    unique: false,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
    unique: false,
  },
  surname: {
    type: String,
    required: true,
    unique: false,
  },
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'User'],
    default: 'User',
  },
  probada: [{ type: Schema.Types.ObjectId, ref: 'Beer', required: false }],
  visitado: [{ type: Schema.Types.ObjectId, ref: 'Pub', required: false }],
});

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

export const UserModel = model('Users', userSchema, 'user');
