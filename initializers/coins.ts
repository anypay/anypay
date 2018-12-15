
import { coins, models } from '../lib';

let coinsConfig = require('../config/coins')['coins'];

export async function initialize() {

  await coins.initFromConfig(coinsConfig);


}

