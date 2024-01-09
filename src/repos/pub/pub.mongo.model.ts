import { Schema, model } from 'mongoose';

export const pubSchema = new Schema({
  logo: {
    publicId: String,
    size: Number,
    format: String,
    url: String,
  },
  direction: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: String,
    required: true,
    unique: true,
  },
  taps: {
    type: Number,
    required: true,
    unique: true,
  },
  beers: [{ type: Schema.Types.ObjectId, ref: 'Beer' }],
});

export const PubModel = model('Pub', pubSchema, 'pub');

pubSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
