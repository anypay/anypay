import Ember from 'ember';
import { inject as service } from '@ember/service'

export default Ember.Controller.extend({
  addressSearch: service('address-search'),
  search: null,

  actions: {

    async searchLocation(query) {

      let results = await this.get('addressSearch').getCoordinates(this.get('search'))

      console.log('addressSearchResults' , results)

      this.get('googlemap').setCenter({
        lat: parseFloat(results.lat),
        lng: parseFloat(results.lng)
      })

    },

    merchantDetailsClicked(details)  {

      console.log('merchant details clicked', details)

      console.log(this.get('googlemap'))

      if (details.stub) {
        window.location = `https://app.anypayinc.com/pay/${details.stub}`
      }

      this.get('googlemap').setCenter({
        lat: parseFloat(details.latitude),
        lng: parseFloat(details.longitude)
      })

    },

    showDetails(location) {

      console.log('show details', location);

      this.set('location', location)

    }
  }
});
