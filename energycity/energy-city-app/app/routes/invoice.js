import Ember from 'ember';

export default Ember.Route.extend({

  model(params) {
    return { uid: params.uid }
  },

  setupController(controller, model) {
    controller.set('uid', model.uid);
  }


});
