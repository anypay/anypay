
import coins from './coins';
import rabbi from './rabbi';

export async function initialize() {
  await coins();
  await rabbi()
}

