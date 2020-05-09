import Ember from 'ember';

export default Ember.Route.extend({

  setupController() {
    this.transitionTo('cities') 
  }

});
