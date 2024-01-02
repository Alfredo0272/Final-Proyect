import mongoose from 'mongoose';
import { beerSchema } from './beer.mongo.model.js';

describe('When...', () => {
  describe('should', () => {
    test('should transform returned object correctly in toJSON method', () => {
      const mockBeerModel = mongoose.model('Beers', beerSchema);
      const document = {
        name: 'IPA',
        brewer: 'Craft Brewery',
        style: 'India Pale Ale',
        alcohol: '7%',
        autor: new mongoose.Types.ObjectId(),
        probada: false,
      };

      // eslint-disable-next-line new-cap
      const userDocument = new mockBeerModel(document);
      const returnedObject = userDocument.toJSON();
      expect(returnedObject._id).toBeUndefined();
    });
  });
});
