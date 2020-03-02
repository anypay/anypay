import Ember from 'ember';

import { inject as service } from '@ember/service';

export default Ember.Route.extend({

  socketIOService: service('socket-io'),

  setupController(controller) {

    const socket = this.get("socketIOService").socketFor('wss://nrgcty.com');

    controller.set('socket', socket);

    socket.on('connect', function() {
      controller.set('connected', true);
      Ember.Logger.info('socket.connected');
      socket.emit('subscribe');
      Ember.Logger.info('socket.subscribed');
    });

    socket.on('close', () => {
      controller.set('connected', false);
      Ember.Logger.info('socket.disconnected');
    });

    socket.on('error', (error) => {
      Ember.Logger.info('socket.error', error.message); 
    });

  }

});
