/* eslint-env node */
'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'energy-city-app',
    environment,
    rootURL: '',
    locationType: 'hash',
    anypayAPI: 'https://api.staging.anypayinc.com',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    'ember-websockets': {
      socketIO: true
    }
  };

  ENV['ember-simple-auth'] = {
    routeAfterAuthentication:    'payments',
    routeIfAlreadyAuthenticated: 'payments'
  };

  if (environment === 'development') {
    ENV.apiEndpoint = 'http://127.0.0.1:3000'
    ENV.apiEndpoint = 'https://anypay.city'
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.apiEndpoint = 'https://anypay.city'

  }

  return ENV;
};
