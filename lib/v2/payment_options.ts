import {convert} from '../prices';

export class PaymentOption {
  invoice_uid: string;
  currency: string;
  uri: string;
  outputs: any[];
  invoice: any;
  address: any;

  constructor(invoice, address) {
    this.invoice = invoice;
    this.address = address;
    this.outputs = [];
  }

  async setMerchantOutput() {

    let conversion = await convert({ value: this.invoice.amount, currency: this.invoice.currency }, this.address.currency)

    this.outputs.push({
      address: this.address.value,
      amount: conversion.value
    })

  }

  async setAffiliateOutput() {

  }

  async setPlatformFeeOutput() {

  }

  toJSON() {
    console.log('INVOICE', this.invoice)

    return {
      currency: this.address.currency,
      invoice_uid: this.invoice.uid,
      uri: this.invoice.uri,
      outputs: this.outputs
    }
  }

}

