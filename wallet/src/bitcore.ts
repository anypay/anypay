
import { BigNumber } from 'bignumber.js';

import { join } from 'path'


const assetsTs = require('require-all')({
  dirname: join(__dirname, 'assets'),
  filter      :  /\index.ts/,
  recursive: true
})

const assetsJs = require('require-all')({
  dirname: join(__dirname, 'assets'),
  filter      :  /\index.js/,
  recursive: true
})

export function getBitcore(asset): any {

  const tsAsset = assetsTs[asset.toLowerCase()]
  
  const jsAsset = assetsJs[asset.toLowerCase()]

  const bitcore = tsAsset ? (
    tsAsset['index.ts'].bitcore
  ) : (
    jsAsset['index.js'].bitcore
  )

  if (!bitcore) {

    throw new Error(`bitcore not available for ${asset}`)
  }

  return bitcore

}

export function toSatoshis(amount): number{
  let amt = new BigNumber(amount); 
  let scalar = new BigNumber(100000000);

  return amt.times(amount).toNumber();
}

