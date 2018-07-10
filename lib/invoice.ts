import * as DashAddressService from './dash/address_service';
import * as Account from './models/account';
import * as Invoice from './models/invoice';
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

  var account = await Account.findOne({ where: { id: accountId }});

  let invoiceAmount = await convert({
    currency: account.denomination,
    value: denominationAmountValue
  }, invoiceCurrency);

  let address = await getNewInvoiceAddress(accountId, invoiceCurrency);

  let invoiceChangeset: InvoiceChangeset = {
    accountId,
    address: address.value,
    denominationAmount: {
      currency: address.currency,
      value: denominationAmountValue
    },
    invoiceAmount
  }

  var invoice = await Invoice.create({
    address: invoiceChangeset.address,
    amount: invoiceChangeset.invoiceAmount.value,
    currency: invoiceChangeset.invoiceAmount.currency,
    dollar_amount: invoiceChangeset.denominationAmount.value,
    account_id: invoiceChangeset.accountId,
    status: 'unpaid'
  });

  return invoice;
}

