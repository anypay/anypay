import Ember from 'ember';
import config from 'ember-get-config';
import { inject as service } from '@ember/service';

export default Ember.Service.extend({

  cities: null,
  geolocation: service(),

  async listCities() {

    if (this.get('cities')) {
      
      Ember.$.ajax({
        method: "GET",
        url: `${config.apiEndpoint}/api/cities`
      })
      .then(result => {

        this.set('cities', result.cities);

      });

      return this.get('cities');
      
    } else {

      let result = await Ember.$.ajax({
        method: "GET",
        url: `${config.apiEndpoint}/api/cities`
      })

      this.set('cities', result.cities);

      return result.cities;

    }

  },

  async getCity(city_tag) {

    let location = await this.get('geolocation').getLocation();

    if (!this.get('cities')) {
      await this.listCities(); 
    }

    let city = this.get('cities').find(city => {

      return city.city_tag === city_tag;

    });

    console.log('BZ', city);

    let accounts =  this.orderByDistance(location.coords, city.accounts);

    console.log("ACCOUNTS", accounts);

    city.accounts = accounts;

    // order by distance from you, add distance

    return city;

  },

  orderByDistance(coordinates, businesses) {
    console.log('businesses', businesses);

    return businesses.map(business => {

      return Object.assign(business, {
        distance: this.get('geolocation').getDistance(coordinates, {
          latitude: business.latitude,
          longitude: business.longitude
        })
      });

    })
    .sort((a, b) => {
      return a.distance - b.distance;
    });

  }

});
