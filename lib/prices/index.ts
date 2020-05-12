
import { log } from '../logger';

import { models } from '../models';

export interface Price {
  base_currency: string;
  currency: string;
  value: number;
  source: string;
}

const MAX_DECIMALS = 5;

interface Amount {
  currency: string;
  value: number;
};

interface Conversion {
  input: Amount;
  output: Amount;
  timestamp: Date
};

async function createConversion(inputAmount: Amount, outputCurrency: string): Promise<Conversion> {
  let input = inputAmount;
  let output = await convert(inputAmount, outputCurrency);
  let timestamp = new Date();

  return {
    input,
    output,
    timestamp
  };
};

async function convert(inputAmount: Amount, outputCurrency: string, precision?: number): Promise<Amount> {

  // input currency is the account's denomination 
  // output currency is the payment option currency

  let where = {
    base_currency: inputAmount.currency,
    currency: outputCurrency
  };

  let price = await models.Price.findOne({ where });

  if (price) {
    console.log('price found', price.toJSON());
  } else {
    console.log('price not found', where);
  }

  let targetAmount = inputAmount.value * price.value;

  return {
    currency: outputCurrency,
    value: parseFloat(targetAmount.toFixed(precision || MAX_DECIMALS))
  };
};

export async function setPrice(currency:string, value:number, source:string,  base_currency:string) {

  log.info("set price", currency, value, base_currency);

  let [price, isNew] = await models.Price.findOrCreate({

    where: {

      currency,

      base_currency

    },

    defaults: {

      currency,

      value,

      base_currency,
    
      source

    }
  });

  if (!isNew) {

    price.value = value;

    price.source = source;

    await price.save();

  }

  return price;

}

export {
  convert, createConversion
};

