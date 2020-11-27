import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {
    searchCity() {

      document.getElementById("searchInput").focus();
    },

    async findNearby() {
      console.log("find nearby")

      let permission = await window.navigator.permissions.query({name:'geolocation'})

      if (permission.state === 'granted') {

      } else {

        //alert(permission.state)
      }

      if (permission.state === 'granted') {

      } else {

      }

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
