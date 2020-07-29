import Ember from 'ember';
import { inject as service } from '@ember/service';

export default Ember.Route.extend({

  leaderboard: service(),

  model() {
    return this.get('leaderboard').getLeaderboard();
  },

  setupController(controller, model) {

    controller.set('leaderboard', model
      .map(i => i.account)
      .filter(a => !!a.business_name)
      .filter(a => a.id !== 1177)
    );

  }
});
