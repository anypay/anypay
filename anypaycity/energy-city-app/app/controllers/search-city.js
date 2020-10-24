import Ember from 'ember';
import { inject as service } from '@ember/service'

export default Ember.Controller.extend({
  addressSearch: service('address-search'),
  search: null,

  actions: {

    async searchLocation(query) {

      let results = await this.get('addressSearch').getCoordinates(this.get('search'))

      this.transitionToRoute('map', results.lat, results.lng)

    }
  }


});
