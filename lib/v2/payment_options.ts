import {convert} from '../prices'
import {getCoin} from '../coins'
import {toSatoshis} from '../pay'

export class PaymentOption {
  currency: string;
  uri: string;
  outputs: any[];
  invoice: any;
  address: any;
  invoice_uid: string;
  currency_name: string;
  currency_logo_url: string;

  constructor(invoice, address) {
    let coin = getCoin(address.currency)

    this.invoice = invoice;
    this.invoice_uid = invoice.uid;
    this.address = address;
    this.currency = address.currency;
    this.currency_name = coin.name;
    this.currency_logo_url = coin.logo_url;
    this.outputs = [];
  }

  static async fromRecord(invoice, record) {

    let option = new PaymentOption(invoice, { currency: record.currency })

    option.outputs = record.outputs

    return option
  }

  async setMerchantOutput() {

    let conversion = await convert({ value: this.invoice.amount, currency: this.invoice.currency }, this.address.currency)

    this.outputs.push({
      address: this.address.value,
      amount: toSatoshis(conversion.value)
    })

  }

  async setAffiliateOutput() {

  }

  async setPlatformFeeOutput() {

  }

  toJSON() {

    return {
      currency: this.address.currency,
      uri: this.invoice.uri,
      outputs: this.outputs,
      currency_logo_url: this.currency_logo_url,
      currency_name: this.currency_name
    }
  }

}

