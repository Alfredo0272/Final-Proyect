import { validate } from 'express-validation';
import { userJoiSchema } from '../entities/user.model.js';

export class ValidationInterceptor {
  registerValidator() {
    return validate(
      {
        body: userJoiSchema,
      },
      { statusCode: 406 },
      { abortEarly: false }
    );
  }
}
