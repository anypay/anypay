import Ember from 'ember';
import { inject as service } from '@ember/service';

export default Ember.Route.extend({

  geolocation: service(),

  async setupController(controller) {

    controller.set('geolocating', true);
    controller.set('location', null);
    controller.set('geolocationError', null);

    try {

      let location = await this.get('geolocation').geolocate();


      controller.set('location', location);
      controller.set('geolocating', false);

      if (location.address.stateCode === 'NH') {
        console.log("YES NH");
        let city = location.address.city;
        let cities = await this.get('cities');

        controller.transitionToRoute('city', `${city.toLowerCase()}-nh`);

      } else {
        
        controller.transitionToRoute('cities');
      }

      console.log("NOT NH");

    } catch(error) {

      controller.set('geolocationError', error);

    }

  }

});
