import Ember from 'ember';
import $ from 'jquery';
import { inject as service } from '@ember/service';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  session: service(),

  model(params) {
    return params;
  },

  routeIfAlreadyAuthenticated: 'payments',
  routeAfterAuthenticated: 'payments',

  async setupController(controller, model) {

    controller.set('signing_in', true); 

    try {

      await this.get('session').authenticate('authenticator:token', model.code,model.state);

    } catch(error) { 

      console.log('error', error);

    }

  }
});
