import Ember from 'ember';

export default Ember.Controller.extend({

  socket: null,

  connected: false,

  actions: {
    cityClicked(city) {

      console.log('city clicked', city);

      if (city.city.latitude && city.city.longitude) {

        this.transitionToRoute('map', city.city.latitude, city.city.longitude);

      } else {

        this.transitionToRoute('city', city.city_tag);

      }

    }
  }

});

