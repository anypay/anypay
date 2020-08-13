import Ember from 'ember';
import config from 'ember-get-config';
import { inject as service } from '@ember/service';

var calculator = [];

async function generateInvoice(account_id, amount, accessToken) {
console.log('generate', account_id);
  let headers = {
    'Authorization': `Basic ${btoa(accessToken + ":")}`
  };
  let resp = await Ember.$.ajax({
    method: 'POST',
    url: `https://api.anypayinc.com/accounts/${account_id}/invoices`,
    data: {
      amount: parseFloat(amount)
      //redirect_url: 'https://anypay.city/'
    },
    headers: headers
  })

  return resp;
}

export default Ember.Controller.extend({
  session: service(),
  amount: '0.00',

  isShowNextButton: Ember.computed('amount', function() {
    return this.get("amount") > 0;
  }),

  actions: {
    calculatorPress(event) {
      let n = Ember.$(event.target).html();
      let decimalIndex = calculator.indexOf('.');
      if (decimalIndex > 0 && decimalIndex === (calculator.length - 3)) {
        return;
      }
      if (n === '.') {
        if (decimalIndex !== -1) {
          return;
        }
        if (calculator.length === 0) {
          return;
        }
      }
      console.log("calculator press", n);
      calculator.push(n);
      let decimalPlaces = this.get('denominationCurrency.decimal_places') || 2;
      var total = parseFloat(calculator.join('')) / Math.pow(10, decimalPlaces);
      this.set('amount', total.toFixed(decimalPlaces));

      console.log('amount', this.get('amount'));
      if (parseFloat(this.get('amount')) > 0) {
        Ember.$("#collect-amount").show();
      } else {
        Ember.$("#collect-amount").hide();
      }
    },

    pressBackspace() {
      console.log('back');
      calculator.splice(-1,1);
      let decimalPlaces = this.get('denominationCurrency.decimal_places') || 2;
      var total = calculator.join('') / Math.pow(10, decimalPlaces || 0);
      console.log('total', total);
      this.set('amount', total.toFixed(decimalPlaces));
    },

    clearCalculator() {
      calculator = [];
      this.set('amount', this.getAmountMask());
      Ember.$("#collect-amount").hide();
    },

    async generateInvoice() {

      let token = this.get('session')['session']['content']['authenticated']['token']

      $('.loading').show();
      let resp = await generateInvoice(this.get('business').id, this.get('amount'), token);
      console.log('GENERATED!', resp);

      $('.loading').hide();

      window.location = `https://app.anypayinc.com/invoices/${resp.invoice.uid}`;
    }

  }

});
