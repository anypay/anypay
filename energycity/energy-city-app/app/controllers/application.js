import Ember from 'ember';
import { inject } from '@ember/service';

export default Ember.Controller.extend({

  geolocation: inject(),

  currentLocation: null,

  geolocation: null,

  socket: null,

  connected: false

});
