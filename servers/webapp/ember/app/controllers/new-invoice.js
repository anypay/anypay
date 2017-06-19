import Ember from 'ember';
import Invoice from '../models/invoice';

function generateInvoice(amount, callback) {
  amount = (amount / 190).toFixed(5); 

  Ember.$.ajax({
    method: 'POST',
    url: 'https://api.dash.anypay.global/invoices',
    data: {
      amount: amount
    }
  })
  .done(result => {
    console.log('invoice generated!');
    callback(result);
  })
  .catch(error => {
    console.error(error);
  });
}

export default Ember.Controller.extend({

  amount: 1.00,

  actions: {

    generateInvoice: function() {
      let controller = this;

      this.set('isLoading', true);
      console.log('generate invoice');
      
      generateInvoice(this.amount, invoice => {
        console.log(invoice);

        //this.get('store').push('invoice', {data: invoice});

        let url = `/invoices/${invoice.uid}/${invoice.address}/${invoice.amount}`;
        window.location = url;
        //this.transitionTo(url);
      });
    }
  },

  isLoading: false
});
