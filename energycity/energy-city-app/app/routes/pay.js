
import Ember from 'ember';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Ember.Route.extend({
  session: service(),
  messageBus: Ember.inject.service('message-bus'),

  async getInvoice(uid) {
    let token = this.get('session')['session']['content']['authenticated']['token']

    let resp = await $.ajax({
      method: 'GET',
      url: `https://api.anypayinc.com/invoices/${uid}`,
      headers: {
        'Authorization': `Basic ${btoa(token + ':')}`
      }
    });

    return resp;

  },

  async model(params) {

    console.log('PARAMS', params);

    let token = this.get('session')['session']['content']['authenticated']['token']

    let resp = await $.ajax({
      method: 'GET',
      url: `/businesses/${params.stub}`,
      headers: {
        'Authorization': `Basic ${btoa(token + ':')}`
      }
    });

    return resp;

  },

  async handleInvoiceCreated(invoice) {
    console.log('handle invoice created', invoice);
    invoice = await this.getInvoice(invoice.uid);
    console.log('fetched invoice', invoice);

    let bsvOption = invoice.payment_options.find(option => {
      return option.currency === 'BSV'
    });

    if (bsvOption) {
      $('.pay-bottom-tray').removeClass('pay-bottom-tray--is-hidden');
      $('.pay-bottom-tray').addClass('pay-bottom-tray--is-shown');

      const div = document.getElementById('my-money-button')

      this.controller.set('bsvAmount', bsvOption.denomination_amount);

      window.moneyButton.render(div, {
        outputs: [{
          to: bsvOption.address,
          amount: bsvOption.amount,
          currency: 'BSV'
        }, {
          to: 'steven@simply.cash',
          amount: 0.0002,
          currency: 'BSV'
        }]
      });


    }

  },

  deactivate() {
    console.log('destroy business route');
    //this.get('messageBus').unsubscribe(`accounts_${this.get('business').id}_invoice_created`, this, this.handleInvoiceCreated);
    $('.pay-bottom-tray').addClass('pay-bottom-tray--is-hidden');
    $('.pay-bottom-tray').removeClass('pay-bottom-tray--is-shown');
  },

  setupController(controller, model) {
    controller.set('business', model);
    this.get('messageBus').subscribe(`accounts_${model.id}_invoice_created`, this, this.handleInvoiceCreated);
  }

});
