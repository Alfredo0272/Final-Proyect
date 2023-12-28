import { ImgData } from '../types/img.data.js';
import { Pub } from './pub.js';
import { User } from './user.js';

export type Beer = {
  id: string;
  name: string;
  brewer: string;
  style: string;
  alcohol: string;
  beerImg: ImgData;
  author: User;
  pubs: Pub;
};
