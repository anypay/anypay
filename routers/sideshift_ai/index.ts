
import { models } from '../../lib/models';
import * as http from 'superagent';

import BigNumber from 'bignumber.js';

interface AccountRoute {
  id: number;
  account_id: number;
  router_name: string;
  input_currency: string;
  output_currency: string;
  output_address: string;
}

interface NewSidesiftQuote {
  inputCurrency: string;
  outputCurrency: string;
  outputAddress: string;
}

interface SideshiftPair {
  inputCurrency: string;
  outputCurrency: string;
}

export async function getNewAddress(accountRoute: AccountRoute): Promise<any> {
  // create quote in sideshift
  // save sideshift quote in database
  let sideshiftQuote = await createQuote({
    inputCurrency: accountRoute.input_currency,
    outputCurrency: accountRoute.output_currency,
    outputAddress: accountRoute.output_address
  })

  // return new address
  return sideshiftQuote.depositAddress_address
}

export async function convertAmount(outputAmount, outputCurrency, inputCurrency) {
  // USDC, 100, DASH -> Convert DASH to 100 USDC at current rate

  let record = await getPair({
    inputCurrency,
    outputCurrency
  });

  let output_amount = new BigNumber(outputAmount); 
  let rate = new BigNumber(record.rate);
  let min_input = new BigNumber(record.min);
  let max_input = new BigNumber(record.max);

  let max_output = max_input.times(rate);
  let min_output = min_input.times(rate);

  if (outputAmount > max_output.toNumber()) {
    throw new Error(`cannot only route up to ${max_output.toNumber()}`);
  }

  if (outputAmount < min_output.toNumber()) {
    throw new Error(`must route more than ${min_output.toNumber()}`);
  }

  let inputAmount = outputAmount.dividedBy(rate);

  return inputAmount.toNumber();
}

async function getPair(pair: SideshiftPair): Promise<any> {

  let input = pair.inputCurrency;
  let output = pair.outputCurrency;

  let response = await http
    .get(`https://sideshift.ai/api/pairs/${input}/${output}`)

  console.log('sideshift.pair.response', response.body);

  let record = await models.SideshiftPair.create({
    input: input,
    output: output,
    rate: parseFloat(response.body.rate),
    min: parseFloat(response.body.min),
    max: parseFloat(response.body.max)
  })

  return record;

}

async function createQuote(newQuote: NewSidesiftQuote): Promise<any> {

  let response = await http
    .post('https://sideshift.ai/api/quotes')
    .send({
      depositMethodId: newQuote.inputCurrency.toLowerCase(),
      settlementMethodId: newQuote.outputCurrency.toLowerCase(),
      settlementAddress: newQuote.outputAddress
    })

  let record = await models.SideshiftQuote.create({
    quoteId: response.body.quoteId,
    depositMethodId: response.body.depositMethodId,
    settlementMethodId: response.body.settlementMethodId,
    depositAddress_address: response.body.depositAddress.address,
    settlementAddress_address: response.body.settlementAddress.address
  })

  return record;

}
