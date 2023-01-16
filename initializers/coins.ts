
import { coins } from '../lib';

let coinsConfig = require('../config/coins')['coins'];

export default async function initialize() {

  await coins.initFromConfig(coinsConfig);

}
