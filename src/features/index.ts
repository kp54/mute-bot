import { Feature } from '../feature';
import Echo from './echo';
import Ping from './ping';

const features: Array<typeof Feature> = [
  Echo,
  Ping,
];

export default features;
