import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {
    showDetails(location) {

      console.log('show details', location);

      this.set('location', location)

    }
  }
});
