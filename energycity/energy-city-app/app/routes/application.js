import Ember from 'ember';

import { inject as service } from '@ember/service';

import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  messageBus: Ember.inject.service('message-bus'),

  geolocation: service(),

  socketIOService: service('socket-io'),

  sessionAlreadyAuthenticated: function() {
  
    console.log('TT');
    this.transitionTo('cities');
  },

  sessionAuthenticationSucceeded: function() {

    try {
      console.log("TRANSITION");

      this.transitionTo('cities');

    } catch(err) {
      console.log('error catch:', err);
      //this.get('errorManager').catchError(err, 'application', 'route', 'sessionAuthenticationSucceeded - try-catch');
    }
  },

  setupController(controller) {

    const socket = this.get("socketIOService").socketFor('wss://nrgcty.com');

    controller.set('socket', socket);

    socket.on('connect', function() {
      controller.set('connected', true);
      Ember.Logger.info('socket.connected');
      socket.emit('subscribe');
      Ember.Logger.info('socket.subscribed');
    });

    socket.on('invoice.created', (invoice) => {
      console.log("INVOICE CREATED", invoice);
      this.get('messageBus').publish(`accounts_${invoice.account_id}_invoice_created`, invoice);
    });

    socket.on('close', () => {
      controller.set('connected', false);
      Ember.Logger.info('socket.disconnected');
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
