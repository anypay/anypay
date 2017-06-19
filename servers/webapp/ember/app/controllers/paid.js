import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {
    newInvoice: function() {
      window.location = '/new-invoice';
    }
  }
});
