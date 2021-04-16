import Ember from 'ember';
import $ from 'jquery'

export default Ember.Service.extend({

  getCoordinates(query) {

    // zeiler.steven@gmail.com/anypay
    var apiKey = 'AIzaSyDHprMrEY-JrNMw4q55ZhoG4HXspKeG8V8';

    var url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query.replace(' /g', '+')}&key=${apiKey}`;

    return $.ajax({
      url
    })
    .then(resp => {
      console.log(resp)

      if (resp.results.length > 0) {

        let location = resp.results[0].geometry.location;

        console.log('getcoordinates', location);

        return location;

      } else {

        throw new Error('location not found')

      }

    });


  }
});
