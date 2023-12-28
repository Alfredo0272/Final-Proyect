import { Schema } from 'mongoose';
import { Pub } from '../../entities/pub';

export const pubSchema = new Schema<Pub>({
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
