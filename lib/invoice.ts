import * as DashAddressService from './dash/forwarding_address_service';
import * as LitecoinAddressService from './litecoin/address_service';
import * as BitcoinCashAddressService from './bitcoin_cash/address_service';
import * as BitcoinAddressService from './bitcoin/address_service';
import * as DogecoinAddressService from './dogecoin/address_service';
import * as ZcashAddressService from './zcash/address_service';
import * as ZencashAddressService from './zencash/address_service';

import * as models from './models';

import {convert} from './prices';

interface Amount {
  currency: string;
  value: number
}

interface InvoiceChangeset {
  accountId: number;
  address: string;
  denominationAmount: Amount;
  invoiceAmount: Amount;
}

interface Address {
  currency: string,
  value: string
}

async function getNewInvoiceAddress(accountId: number, currency: string): Promise<Address> {
  var address;

  switch(currency) {

    case 'DASH':

      address = await DashAddressService.getNewAddress(accountId);

      break;

    case 'BTC':

      address = await BitcoinAddressService.getNewAddress(accountId);

      break;

    case 'LTC':

      address = await LitecoinAddressService.getNewAddress(accountId);

      break;

    case 'BCH':

      address = await BitcoinCashAddressService.getNewAddress(accountId);

      break;

    case 'DOGE':

      address = await DogecoinAddressService.getNewAddress(accountId);

      break;

    case 'ZEC':

      address = await ZcashAddressService.getNewAddress(accountId);

      break;

    case 'ZEN':

      address = await ZencashAddressService.getNewAddress(accountId);

      break;
  }

  if (!address) {
    throw new Error(`unable to generate address for ${currency}`);
  }

  return {
    currency,
    value: address
  }

};

export async function generateInvoice(accountId: number, denominationAmountValue: number, invoiceCurrency: string): Promise<any> {

  var account = await models.Account.findOne({ where: { id: accountId }});

  let invoiceAmount = await convert({
    currency: account.denomination,
    value: denominationAmountValue
  }, invoiceCurrency);

  console.log('invoiceAmount', invoiceAmount);

  let address = await getNewInvoiceAddress(accountId, invoiceCurrency);

  let invoiceChangeset: InvoiceChangeset = {
    accountId,
    address: address.value,
    denominationAmount: {
      currency: account.denomination,
      value: denominationAmountValue
    },
    invoiceAmount
  };

  var invoice = await models.Invoice.create({
    address: invoiceChangeset.address,
    invoice_amount: invoiceChangeset.invoiceAmount.value,
    invoice_currency: invoiceChangeset.invoiceAmount.currency,
    denomination_currency: invoiceChangeset.denominationAmount.currency,
    denomination_amount: invoiceChangeset.denominationAmount.value,
    account_id: invoiceChangeset.accountId,
    status: 'unpaid',

    amount: invoiceChangeset.invoiceAmount.value, // DEPRECATED
    currency: invoiceChangeset.invoiceAmount.currency, // DEPRECATED
    dollar_amount: invoiceChangeset.denominationAmount.value // DEPRECATED
  });

  return invoice;
}

