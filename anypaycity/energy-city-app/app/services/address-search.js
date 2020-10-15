import Ember from 'ember';

export default Ember.Service.extend({

  getCoordinates(query) {

    var apiKey = 'AIzaSyBzFUoLc2p9xXpizIJV8CJOo3buh8RZKKA';

    var url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query.replaceAll(' ', '+')}&key=${apiKey}`;

    console.log('search url', url)

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
