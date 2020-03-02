import Ember from 'ember';
import config from 'ember-get-config';

export default Ember.Service.extend({

  cities: null,

  async listCities() {
    let result = await Ember.$.ajax({
      method: "GET",
      url: `${config.apiEndpoint}/api/cities`
    })

    this.set('cities', result.cities);

    return result.cities;
  },

  async getCity(city_tag) {

    if (!this.get('cities')) {
      await this.listCities(); 
    }

    return this.get('cities').find(city => {

      return city.city_tag === city_tag;

    });
  }

});
