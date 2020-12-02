import Ember from 'ember';

export default Ember.Route.extend({

  async setupController() {

    if (window.navigator.permissions) {

      let permission = await window.navigator.permissions.query({name:'geolocation'})

      if (permission.state === 'granted') {

        $('#loader-wrapper').show()
        window.navigator.geolocation.getCurrentPosition((position) => {

          $('#loader-wrapper').hide()
          console.log('geolocation.currentposition', position)

          this.transitionTo('map', position.coords.latitude, position.coords.longitude)
        
        }, (error) => {
          $('#loader-wrapper').hide()
          console.log('geolocation.error', error)

          this.transitionToRoute('search-city')

        
        }, {
          enableHighAccuracy: false 
        });

      }

    }

  }
});


