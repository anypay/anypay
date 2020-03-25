import Ember from 'ember';
import { Promise } from 'rsvp';

export default Ember.Service.extend({

  location: null,

  geolocate(options) {
    return new Promise((resolve, reject) => {

      geolocator.config({
          language: "en",
          google: {
              version: "3",
              key: "AIzaSyBzFUoLc2p9xXpizIJV8CJOo3buh8RZKKA"
          }
      });

      options = Object.assign({
          enableHighAccuracy: false,
          timeout: 5000,
          maximumWait: 10000,     // max wait time for desired accuracy
          maximumAge: 0,          // disable cache
          desiredAccuracy: 30,    // meters
          fallbackToIP: true,     // fallback to IP if Geolocation fails or rejected
          addressLookup: true,    // requires Google API key if true
          timezone: true         // requires Google API key if true
      }, options);

      this.set('geolocating', true);

      window.geolocator.locate(options, (err, location) => {
        this.set('location', location);
        this.set('geolocating', false);

          if (err) {
            console.log(err);
            return reject(err);
          }
          console.log(location);
          resolve(location);
      });
    });
  }


});
