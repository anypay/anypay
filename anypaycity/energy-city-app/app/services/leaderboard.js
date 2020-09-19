import Ember from 'ember';
import config from 'ember-get-config';
import { inject as service } from '@ember/service';

export default Ember.Service.extend({

  leaderboard: null,

  async getLeaderboard() {

    if (!this.get('leaderboard')) {
      
      let resp = await Ember.$.ajax({
        method: "GET",
        url: `${config.anypayAPI}/leaderboard`
      })

      this.set('leaderboard', resp.leaderboard);

      return this.get('leaderboard');
      
    }

    return this.get('leaderboard');

  }

});


