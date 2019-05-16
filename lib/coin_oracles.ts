
import { hash } from './accounts';
import { bcryptCompare } from './account_login';

import * as models from './models';

import { v4 } from 'uuid';

export async function createCoinOracle(coin) {

  let existingOracle = await models.CoinOracle.findOne({ where: { coin }});

  if (existingOracle) {

    throw new Error(`oracle already exists for coin ${coin}`);

  }

  let access_token = v4();
  let access_token_hash = await hash(access_token);

  let coin_oracle = await models.CoinOracle.create({

    coin,

    access_token_hash

  });

  return {

    coin_oracle: coin_oracle.toJSON(),

    access_token 

  }

}

export async function authCoinOracle(coin: string, accessToken: string): Promise<Boolean> {
 
  var oracle;

  oracle = await models.CoinOracle.findOne({ where: { coin }});

  if (!oracle) {

    throw new Error(`no oracle for coin ${coin}`);

  }
  try {

    await bcryptCompare(accessToken, oracle.access_token_hash);

    console.log('successful bcrypt compare');

    return true;

  } catch(error) {

    console.log(error)
    return false;
  }

}

export async function deleteCoinOracle(coin: string) {

  await models.CoinOracle.destroy({ where: { coin }});

}

