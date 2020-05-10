import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),

  setupController: function() {
    this.get('session').invalidate().then(() => {
      this.transitionTo('login');
    });
  }
});
