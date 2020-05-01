import Ember from 'ember';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import $ from 'jquery';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  session: service(),

  async model() {
    let token = this.get('session')['session']['content']['authenticated']['token']

    let resp = await $.ajax({
      method: 'GET',
      url: '/payments',
      headers: {
        'Authorization': `Basic ${btoa(token + ':')}`
      }
    });

    return resp;

  },

  setupController(controller, model) {
    controller.set('payments', model);
  }

});
