import Ember from 'ember';
import { inject as service } from '@ember/service';

export default Ember.Controller.extend({
  routing: service('-routing'),

  addressSearch: service('address-search'),

  geolocation: service(),

  currentLocation: null,

  socket: null,

  connected: false,

  session: service(),

  actions: {

    async searchLocation() {

      var currentRoute = this.get('routing').get('currentRouteName');

      let results = await this.get('addressSearch').getCoordinates(this.get('search'))

      if (this.get('googlemap')) {

        this.get('googlemap').setCenter({
          lat: parseFloat(results.lat),
          lng: parseFloat(results.lng)
        })

      } else {

        this.transitionToRoute('map', {lat: results.lat, lng: results.lng})

      }

    },


  }

});
