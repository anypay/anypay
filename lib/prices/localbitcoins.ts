
import * as localbitcoins from '../localbitcoins';

var cache;

async function updateVESPrice() {

  cache = await localbitcoins.getVESPrice();

  return;
}

setInterval(async () => {

    console.log('update VES Price');

    await updateVESPrice();

}, 1000 * 60 * 10); // every ten minutes

(async () => {

  await updateVESPrice();

})()

async function getVESPrice() {

  if (!cache) {
    await updateVESPrice();
  }

  return cache;
}

export { getVESPrice }
