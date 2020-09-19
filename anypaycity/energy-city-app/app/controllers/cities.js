import Ember from 'ember';

export default Ember.Controller.extend({

  socket: null,

  connected: false,

  actions: {
    cityClicked(city) {

      console.log('city clicked', city.city_tag);

      this.transitionToRoute('city', city.city_tag);

    }
  }

});

