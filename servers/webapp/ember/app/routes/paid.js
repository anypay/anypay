import Ember from 'ember';

export default Ember.Route.extend({

  amount: 0,

  setupController: function() {
    console.log('setup controller');

    this.set('amount', this.currentModel.amount);

    Ember.run.scheduleOnce('afterRender', this, function() {
      $('body').addClass('paid');
    });
  }
});
