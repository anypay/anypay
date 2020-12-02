import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {
    searchCity() {

      document.getElementById("searchInput").focus();
    },

    async findNearby() {
      console.log('FIND NEARBY')

      $('#loader-wrapper').show()
      window.navigator.geolocation.getCurrentPosition((position) => {

        $('#loader-wrapper').hide()
        console.log('geolocation.currentposition', position)

        this.transitionToRoute('map', position.coords.latitude, position.coords.longitude)
      
      }, (error) => {
        $('#loader-wrapper').hide()
        console.log('geolocation.error', error)

        this.transitionToRoute('search-city')

      
      }, {
        enableHighAccuracy: false 
      });
    }
  }
});

function revokePermission() {
  return window.navigator.permissions.revoke({name:'geolocation'})
}
