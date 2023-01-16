
import { prices } from '../lib';

export default async function initialize() {

  await prices.setAllCryptoPrices()

  await prices.setAllFiatPrices()

}

