import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    didTransition: function() {
      console.log('DID TRANSITION');

      Ember.$('.ember-google-map').css({
        position: 'fixed',
        top: '50px',
        bottom: '0px',
        left: '0px',
        right: '0px'
      });
    }
  },

  setupController() {
    console.log('SETUP CONTROLLER');
    setTimeout(() => {

      Ember.$('.ember-google-map').css('position', 'fixed');
    }, 1000);

    Ember.run.scheduleOnce('afterRender', this, function() {                                                                  
      console.log('AFTER RENDER');

      Ember.$('.ember-google-map').css({
        position: 'fixed',
        top: '50px',
        bottom: '0px',
        left: '0px',
        right: '0px'
      });
    });      
  }
});
