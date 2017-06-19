import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('home', { path: '/' });
  this.route('new-invoice');
  this.route('invoice', { path: 'invoices/:uid/:address/:amount' });
  this.route('paid', { path: 'paid/:amount' });
});

export default Router;
