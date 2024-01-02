import mongoose from 'mongoose';
import { userSchema } from './user.mongo.model.js';

describe('When...', () => {
  describe('should', () => {
    test('should transform returned object correctly in toJSON method', () => {
      const mockUserModel = mongoose.model('Users', userSchema);
      const document = {
        name: 'John Doe',
        password: 'password123',
        email: 'john.doe@example.com',
        age: 25,
        surname: 'Doe',
      };

      // eslint-disable-next-line new-cap
      const userDocument = new mockUserModel(document);
      const returnedObject = userDocument.toJSON();
      expect(returnedObject._id).toBeUndefined();
    });
  });
});
