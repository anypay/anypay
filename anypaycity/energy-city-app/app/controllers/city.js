import Ember from 'ember';
import { inject as service } from '@ember/service';

export default Ember.Controller.extend({

  socket: null,

  connected: false,

  locations: [],

  session: service(),

  handleInvoicePaid(invoice) {

    console.log('invoice.paid', invoice);

  },

  handleInvoiceCreated(invoice) {

    console.log('invoice.created', invoice);

    let locations = this.get('locations');

    for (let i=0; i < locations.length; i++) {
      console.log(locations[i]);

      if (locations[i].account_id === invoice.account_id) {

        Ember.set(locations[i], 'invoice', invoice);

        setTimeout(() => {

          Ember.set(locations[i], 'invoice', null);
          
        }, 10000);

      }
    
    } 

  },

  actions: {
    businessClicked(business) {
      console.log('business clicked!', business)
      this.transitionToRoute('business', business)
      //window.open(`https://app.anypayinc.com/pay/${business.stub}`)
    }
  }

});

