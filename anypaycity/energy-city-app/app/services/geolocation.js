import Ember from 'ember';
import { Promise } from 'rsvp';

function toRad (value) {
  return (value * Math.PI) / 180;
}

export default Ember.Service.extend({

  location: null,

  geolocate(options) {
    return new Promise((resolve, reject) => {

      geolocator.config({
          language: "en",
          google: {
              version: "3",
              key: "AIzaSyDHprMrEY-JrNMw4q55ZhoG4HXspKeG8V8" // zeiler.steven@gmail.com/anypay
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
  },

  getDistance(from, to) {
    const fromLat = from.latitude;
    const fromLon = from.longitude;
    const toLat = to.latitude;
    const toLon = to.longitude;

    const earthRadius = 6378137;

    const distance =
        Math.acos(
            normalizeACosArg(
                Math.sin(toRad(toLat)) * Math.sin(toRad(fromLat)) +
                    Math.cos(toRad(toLat)) *
                        Math.cos(toRad(fromLat)) *
                        Math.cos(toRad(fromLon) - toRad(toLon))
            )
        ) * earthRadius;

    const accuracy = 1;

    return Math.round(distance / accuracy) * accuracy;
  },

  async getLocation() {
    let location = this.get('location');
    if (!location) {
      location = await this.geolocate();
    }
    return location;
  }

});

function normalizeACosArg (val) {
    if (val > 1) {
        return 1;
    }
    if (val < -1) {
        return -1;
    }
    return val;
};

