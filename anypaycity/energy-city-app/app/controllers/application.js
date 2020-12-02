import Ember from 'ember';
import { inject as service } from '@ember/service';

export default Ember.Controller.extend({
  addressSearch: service('address-search'),

  geolocation: service(),

  currentLocation: null,

  geolocation: null,

  socket: null,

  connected: false,

  session: service(),

  actions: {

    async searchLocation(query) {

      let results = await this.get('addressSearch').getCoordinates(this.get('search'))

      console.log('addressSearchResults' , results)

      this.get('googlemap').setCenter({
        lat: parseFloat(results.lat),
        lng: parseFloat(results.lng)
      })

    },


  }

});
