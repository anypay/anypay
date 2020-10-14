import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {

    merchantDetailsClicked(details)  {

      console.log('merchant details clicked', details)

      console.log(this.get('googlemap'))
      
      this.get('googlemap').setCenter({
        lat: parseFloat(details.latitude),
        lng: parseFloat(details.longitude)
      })

    },

    showDetails(location) {

      console.log('show details', location);

      this.set('location', location)

    }
  }
});
