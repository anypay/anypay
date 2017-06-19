import Ember from 'ember';

export default Ember.Route.extend({

  setupController: function() {

    Ember.run.scheduleOnce('afterRender', this, function() {                      
        $('body').removeClass('paid');                                              
    });  
  }
});
