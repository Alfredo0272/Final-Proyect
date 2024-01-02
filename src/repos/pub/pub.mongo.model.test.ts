import mongoose from 'mongoose';
import { pubSchema } from './pub.mongo.model';

describe('When...', () => {
  describe('should', () => {
    test('should transform returned object correctly in toJSON method', () => {
      const mockPubModel = mongoose.model('pub', pubSchema);
      const document = {
        direction: '',
        name: '',
        owner: '',
        taps: 1,
        beers: new mongoose.Types.ObjectId(),
      };

      // eslint-disable-next-line new-cap
      const userDocument = new mockPubModel(document);
      const returnedObject = userDocument.toJSON();
      expect(returnedObject._id).toBeUndefined();
    });
  });
});
