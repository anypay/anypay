"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('anypay-dash/app', ['exports', 'ember', 'anypay-dash/resolver', 'ember-load-initializers', 'anypay-dash/config/environment'], function (exports, _ember, _anypayDashResolver, _emberLoadInitializers, _anypayDashConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _anypayDashConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _anypayDashConfigEnvironment['default'].podModulePrefix,
    Resolver: _anypayDashResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _anypayDashConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('anypay-dash/controllers/invoice', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({

    actions: {
      subscribe: function subscribe(uid) {

        console.log(io);
      }
    }

  });
});
define('anypay-dash/controllers/new-invoice', ['exports', 'ember', 'anypay-dash/models/invoice'], function (exports, _ember, _anypayDashModelsInvoice) {

  function _generateInvoice(amount, callback) {
    amount = (amount / 190).toFixed(5);

    _ember['default'].$.ajax({
      method: 'POST',
      url: 'https://api.dash.anypay.global/invoices',
      data: {
        amount: amount
      }
    }).done(function (result) {
      console.log('invoice generated!');
      callback(result);
    })['catch'](function (error) {
      console.error(error);
    });
  }

  exports['default'] = _ember['default'].Controller.extend({

    amount: 1.00,

    actions: {

      generateInvoice: function generateInvoice() {
        var controller = this;

        this.set('isLoading', true);
        console.log('generate invoice');

        _generateInvoice(this.amount, function (invoice) {
          console.log(invoice);

          //this.get('store').push('invoice', {data: invoice});

          var url = '/invoices/' + invoice.uid + '/' + invoice.address + '/' + invoice.amount;
          window.location = url;
          //this.transitionTo(url);
        });
      }
    },

    isLoading: false
  });
});
define('anypay-dash/controllers/paid', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({

    actions: {
      newInvoice: function newInvoice() {
        window.location = '/new-invoice';
      }
    }
  });
});
define('anypay-dash/helpers/app-version', ['exports', 'ember', 'anypay-dash/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _ember, _anypayDashConfigEnvironment, _emberCliAppVersionUtilsRegexp) {
  exports.appVersion = appVersion;
  var version = _anypayDashConfigEnvironment['default'].APP.version;

  function appVersion(_) {
    var hash = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (hash.hideSha) {
      return version.match(_emberCliAppVersionUtilsRegexp.versionRegExp)[0];
    }

    if (hash.hideVersion) {
      return version.match(_emberCliAppVersionUtilsRegexp.shaRegExp)[0];
    }

    return version;
  }

  exports['default'] = _ember['default'].Helper.helper(appVersion);
});
define('anypay-dash/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('anypay-dash/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('anypay-dash/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'anypay-dash/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _anypayDashConfigEnvironment) {
  var _config$APP = _anypayDashConfigEnvironment['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(name, version)
  };
});
define('anypay-dash/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('anypay-dash/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('anypay-dash/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/index'], function (exports, _emberDataSetupContainer, _emberDataIndex) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.Controller.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('anypay-dash/initializers/export-application-global', ['exports', 'ember', 'anypay-dash/config/environment'], function (exports, _ember, _anypayDashConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_anypayDashConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _anypayDashConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_anypayDashConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('anypay-dash/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('anypay-dash/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('anypay-dash/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("anypay-dash/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('anypay-dash/models/invoice', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    uid: _emberData['default'].attr('string'),
    amount: _emberData['default'].attr('number'),
    address: _emberData['default'].attr('string')
  });
});
define('anypay-dash/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('anypay-dash/router', ['exports', 'ember', 'anypay-dash/config/environment'], function (exports, _ember, _anypayDashConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _anypayDashConfigEnvironment['default'].locationType,
    rootURL: _anypayDashConfigEnvironment['default'].rootURL
  });

  Router.map(function () {
    this.route('home', { path: '/' });
    this.route('new-invoice');
    this.route('invoice', { path: 'invoices/:uid/:address/:amount' });
    this.route('paid', { path: 'paid/:amount' });
  });

  exports['default'] = Router;
});
define('anypay-dash/routes/home', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('anypay-dash/routes/invoice', ['exports', 'ember'], function (exports, _ember) {

  function subscribe(invoice) {

    console.log("subscribe", invoice.uid);
    var socket = io('http://149.56.89.142:3000');
    socket.on('invoice:paid', function (data) {
      console.log('invoice:paid', data);
      window.location = '/paid/' + invoice.amount;
    });
    socket.emit('subscribe', { invoice: invoice.uid });
  }

  function showQR(address, amount) {

    var qrcode = new QRCode("qrcode", {
      text: 'dash:' + address + '?amount=' + parseFloat(amount).toFixed(5),
      width: 256,
      height: 256,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  exports['default'] = _ember['default'].Route.extend({

    setupController: function setupController(p) {
      subscribe(this.currentModel, this);
      _ember['default'].run.scheduleOnce('afterRender', this, function () {
        showQR(this.currentModel.address, this.currentModel.amount);
      });
      this.set('address', this.currentModel.address);
      this.set('amount', this.currentModel.amount);
    }
  });
});
define('anypay-dash/routes/new-invoice', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    setupController: function setupController() {

      _ember['default'].run.scheduleOnce('afterRender', this, function () {
        $('body').removeClass('paid');
      });
    }
  });
});
define('anypay-dash/routes/paid', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    amount: 0,

    setupController: function setupController() {
      console.log('setup controller');

      this.set('amount', this.currentModel.amount);

      _ember['default'].run.scheduleOnce('afterRender', this, function () {
        $('body').addClass('paid');
      });
    }
  });
});
define('anypay-dash/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define("anypay-dash/templates/home", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "kKlVCo92", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"id\",\"home\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/dash.png\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"Dash Checkout\"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Pair this app with your AnyPay account to accept dash anytime, anywhere.\"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"get-started\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"block\",[\"link-to\"],[\"new-invoice\"],null,0],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n  \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"h2\",[]],[\"flush-element\"],[\"text\",\"anypay\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"GET STARTED\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "anypay-dash/templates/home.hbs" } });
});
define("anypay-dash/templates/invoice", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "eUU4xCUZ", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"id\",\"qrcode\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"p\",[]],[\"static-attr\",\"id\",\"address\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"address\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"p\",[]],[\"static-attr\",\"id\",\"amount\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"amount\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "anypay-dash/templates/invoice.hbs" } });
});
define("anypay-dash/templates/new-invoice", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "v519yuiJ", "block": "{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"isLoading\"]]],null,1,0],[\"text\",\"\\n\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"main\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"h1\",[]],[\"static-attr\",\"id\",\"invoice-amount\"],[\"flush-element\"],[\"text\",\"$\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"amount\"]],false],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"id\",\"calculator-pad\"],[\"flush-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"id\",\"calculator-1\"],[\"flush-element\"],[\"text\",\"1\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"id\",\"calculator-2\"],[\"flush-element\"],[\"text\",\"2\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"id\",\"calculator-3\"],[\"flush-element\"],[\"text\",\"3\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"id\",\"calculator-4\"],[\"flush-element\"],[\"text\",\"4\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"id\",\"calculator-5\"],[\"flush-element\"],[\"text\",\"5\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"id\",\"calculator-6\"],[\"flush-element\"],[\"text\",\"6\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"id\",\"calculator-7\"],[\"flush-element\"],[\"text\",\"7\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"id\",\"calculator-8\"],[\"flush-element\"],[\"text\",\"8\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"id\",\"calculator-9\"],[\"flush-element\"],[\"text\",\"9\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"id\",\"calculator-00\"],[\"flush-element\"],[\"text\",\"00\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"id\",\"calculator-0\"],[\"flush-element\"],[\"text\",\"0\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"id\",\"calculator-delete\"],[\"flush-element\"],[\"text\",\"delete\"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"h1\",[]],[\"static-attr\",\"id\",\"invoice-collect\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"generateInvoice\"],null],null],[\"static-attr\",\"class\",\"background2 bottom\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/dash.png\"],[\"flush-element\"],[\"close-element\"],[\"text\",\" COLLECT $\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"amount\"]],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"  \"],[\"open-element\",\"img\",[]],[\"static-attr\",\"class\",\"loading-spinner\"],[\"static-attr\",\"src\",\"/loading.gif\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "anypay-dash/templates/new-invoice.hbs" } });
});
define("anypay-dash/templates/paid", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "4EH3AnV0", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"paid\"],[\"flush-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"Paid\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"h2\",[]],[\"flush-element\"],[\"text\",\"DASH \"],[\"append\",[\"unknown\",[\"amount\"]],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"class\",\"link-to-new-invoice\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"newInvoice\"],null],null],[\"flush-element\"],[\"text\",\"Next Payment\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "anypay-dash/templates/paid.hbs" } });
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('anypay-dash/config/environment', ['ember'], function(Ember) {
  var prefix = 'anypay-dash';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("anypay-dash/app")["default"].create({"name":"anypay-dash","version":"0.0.0+4d278ad1"});
}

/* jshint ignore:end */
//# sourceMappingURL=anypay-dash.map
