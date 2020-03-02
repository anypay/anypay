import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('cities', { path: '/' });
  this.route('city', { path: '/cities/:city' });
  this.route('business', { path: '/:city/businesses/:stub' });
});

export default Router;
