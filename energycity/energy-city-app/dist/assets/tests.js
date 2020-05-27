'use strict';

define('energy-city-app/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('authenticators/token.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'authenticators/token.js should pass ESLint\n\n12:22 - \'$\' is not defined. (no-undef)\n18:5 - Unexpected console statement. (no-console)');
  });

  QUnit.test('components/location-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/location-list.js should pass ESLint\n\n');
  });

  QUnit.test('components/money-button.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/money-button.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/application.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/application.js should pass ESLint\n\n10:3 - Duplicate key \'geolocation\'. (no-dupe-keys)');
  });

  QUnit.test('controllers/business.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/business.js should pass ESLint\n\n2:8 - \'config\' is defined but never used. (no-unused-vars)\n8:1 - Unexpected console statement. (no-console)\n49:7 - Unexpected console statement. (no-console)\n55:7 - Unexpected console statement. (no-console)\n64:7 - Unexpected console statement. (no-console)\n68:7 - Unexpected console statement. (no-console)\n82:7 - \'$\' is not defined. (no-undef)\n84:7 - Unexpected console statement. (no-console)');
  });

  QUnit.test('controllers/cities.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/cities.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/city.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/city.js should pass ESLint\n\n16:5 - Unexpected console statement. (no-console)\n22:5 - Unexpected console statement. (no-console)\n27:7 - Unexpected console statement. (no-console)');
  });

  QUnit.test('controllers/moneybutton-auth-redirect.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/moneybutton-auth-redirect.js should pass ESLint\n\n');
  });

  QUnit.test('initializers/websockets.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'initializers/websockets.js should pass ESLint\n\n');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });

  QUnit.test('routes/application.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/application.js should pass ESLint\n\n16:5 - Unexpected console statement. (no-console)\n23:7 - Unexpected console statement. (no-console)\n28:7 - Unexpected console statement. (no-console)\n47:7 - Unexpected console statement. (no-console)');
  });

  QUnit.test('routes/business.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/business.js should pass ESLint\n\n42:5 - Unexpected console statement. (no-console)\n44:5 - Unexpected console statement. (no-console)\n76:5 - Unexpected console statement. (no-console)');
  });

  QUnit.test('routes/cities.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/cities.js should pass ESLint\n\n11:9 - \'params\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('routes/city.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/city.js should pass ESLint\n\n68:5 - Unexpected console statement. (no-console)');
  });

  QUnit.test('routes/geolocate.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/geolocate.js should pass ESLint\n\n23:9 - Unexpected console statement. (no-console)\n25:13 - \'cities\' is assigned a value but never used. (no-unused-vars)\n34:7 - Unexpected console statement. (no-console)');
  });

  QUnit.test('routes/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/index.js should pass ESLint\n\n');
  });

  QUnit.test('routes/logout.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/logout.js should pass ESLint\n\n');
  });

  QUnit.test('routes/moneybutton-auth-redirect.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/moneybutton-auth-redirect.js should pass ESLint\n\n2:8 - \'$\' is defined but never used. (no-unused-vars)\n26:7 - Unexpected console statement. (no-console)');
  });

  QUnit.test('routes/payments.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/payments.js should pass ESLint\n\n26:5 - Unexpected console statement. (no-console)');
  });

  QUnit.test('services/cities.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'services/cities.js should pass ESLint\n\n66:5 - Unexpected console statement. (no-console)');
  });

  QUnit.test('services/geolocation.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'services/geolocation.js should pass ESLint\n\n15:7 - \'geolocator\' is not defined. (no-undef)\n41:13 - Unexpected console statement. (no-console)\n44:11 - Unexpected console statement. (no-console)\n91:2 - Unnecessary semicolon. (no-extra-semi)');
  });
});
define('energy-city-app/tests/helpers/destroy-app', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = destroyApp;
  function destroyApp(application) {
    Ember.run(application, 'destroy');
  }
});
define('energy-city-app/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'energy-city-app/tests/helpers/start-app', 'energy-city-app/tests/helpers/destroy-app'], function (exports, _qunit, _startApp, _destroyApp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _startApp.default)();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },
      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return resolve(afterEach).then(function () {
          return (0, _destroyApp.default)(_this.application);
        });
      }
    });
  };

  var resolve = Ember.RSVP.resolve;
});
define('energy-city-app/tests/helpers/resolver', ['exports', 'energy-city-app/resolver', 'energy-city-app/config/environment'], function (exports, _resolver, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var resolver = _resolver.default.create();

  resolver.namespace = {
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix
  };

  exports.default = resolver;
});
define('energy-city-app/tests/helpers/start-app', ['exports', 'energy-city-app/app', 'energy-city-app/config/environment'], function (exports, _app, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = startApp;
  function startApp(attrs) {
    var attributes = Ember.merge({}, _environment.default.APP);
    attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

    return Ember.run(function () {
      var application = _app.default.create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
      return application;
    });
  }
});
define('energy-city-app/tests/integration/components/location-list-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('location-list', 'Integration | Component | location list', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "/KAjvSQe",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"location-list\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "RT7o2pnY",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"location-list\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('energy-city-app/tests/integration/components/money-button-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('money-button', 'Integration | Component | money button', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "4mdNgptU",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"money-button\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "gG0J82x8",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"money-button\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('energy-city-app/tests/test-helper', ['energy-city-app/tests/helpers/resolver', 'ember-qunit', 'ember-cli-qunit'], function (_resolver, _emberQunit, _emberCliQunit) {
  'use strict';

  (0, _emberQunit.setResolver)(_resolver.default);
  (0, _emberCliQunit.start)();
});
define('energy-city-app/tests/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('helpers/destroy-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/module-for-acceptance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/start-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/location-list-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/location-list-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/money-button-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/money-button-test.js should pass ESLint\n\n');
  });

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/application-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/business-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/business-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/moneybutton-auth-redirect-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/moneybutton-auth-redirect-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/root-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/root-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/initializers/websockets-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/initializers/websockets-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/application-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/business-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/business-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/cities-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/cities-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/city-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/city-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/geolocate-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/geolocate-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/index-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/index-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/moneybutton-auth-redirect-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/moneybutton-auth-redirect-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/payments-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/payments-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/cities-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/cities-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/geolocation-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/geolocation-test.js should pass ESLint\n\n');
  });
});
define('energy-city-app/tests/unit/controllers/application-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:application', 'Unit | Controller | application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('energy-city-app/tests/unit/controllers/business-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:business', 'Unit | Controller | business', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('energy-city-app/tests/unit/controllers/moneybutton-auth-redirect-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:moneybutton-auth-redirect', 'Unit | Controller | moneybutton auth redirect', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('energy-city-app/tests/unit/controllers/root-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:root', 'Unit | Controller | root', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('energy-city-app/tests/unit/initializers/websockets-test', ['energy-city-app/initializers/websockets', 'qunit', 'energy-city-app/tests/helpers/destroy-app'], function (_websockets, _qunit, _destroyApp) {
  'use strict';

  (0, _qunit.module)('Unit | Initializer | websockets', {
    beforeEach: function beforeEach() {
      var _this = this;

      Ember.run(function () {
        _this.application = Ember.Application.create();
        _this.application.deferReadiness();
      });
    },
    afterEach: function afterEach() {
      (0, _destroyApp.default)(this.application);
    }
  });

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    (0, _websockets.initialize)(this.application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });
});
define('energy-city-app/tests/unit/routes/application-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:application', 'Unit | Route | application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('energy-city-app/tests/unit/routes/business-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:business', 'Unit | Route | business', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('energy-city-app/tests/unit/routes/cities-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:cities', 'Unit | Route | cities', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('energy-city-app/tests/unit/routes/city-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:city', 'Unit | Route | city', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('energy-city-app/tests/unit/routes/geolocate-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:geolocate', 'Unit | Route | geolocate', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('energy-city-app/tests/unit/routes/index-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:index', 'Unit | Route | index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('energy-city-app/tests/unit/routes/moneybutton-auth-redirect-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:moneybutton-auth-redirect', 'Unit | Route | moneybutton auth redirect', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('energy-city-app/tests/unit/routes/payments-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:payments', 'Unit | Route | payments', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('energy-city-app/tests/unit/services/cities-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('service:cities', 'Unit | Service | cities', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('energy-city-app/tests/unit/services/geolocation-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('service:geolocation', 'Unit | Service | geolocation', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
require('energy-city-app/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
