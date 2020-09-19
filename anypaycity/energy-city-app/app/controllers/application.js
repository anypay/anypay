import Ember from 'ember';
import { inject as service } from '@ember/service';

export default Ember.Controller.extend({

  geolocation: service(),

  currentLocation: null,

  geolocation: null,

  socket: null,

  connected: false,

  session: service()

});
