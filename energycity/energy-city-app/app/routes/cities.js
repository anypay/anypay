import Ember from 'ember';

import { inject as service } from '@ember/service';

export default Ember.Route.extend({

  cities: service('cities'),

  socketIOService: service('socket-io'),

  model(params) {

    return this.get('cities').listCities();

  },

  setupController(controller, model) {

    Ember.Logger.info(model);
    controller.set('cities', model);

    const socket = this.get("socketIOService").socketFor('wss://anypay.city');
    controller.set('socket', socket);


  }

});
