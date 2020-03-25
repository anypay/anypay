'use strict';

define('energy-city-app/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('components/location-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/location-list.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/application.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/application.js should pass ESLint\n\n10:3 - Duplicate key \'geolocation\'. (no-dupe-keys)');
  });

  QUnit.test('controllers/cities.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/cities.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/city.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/city.js should pass ESLint\n\n13:5 - Unexpected console statement. (no-console)\n19:5 - Unexpected console statement. (no-console)\n24:7 - Unexpected console statement. (no-console)');
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
    assert.ok(true, 'routes/application.js should pass ESLint\n\n');
  });

  QUnit.test('routes/business.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/business.js should pass ESLint\n\n5:9 - \'params\' is defined but never used. (no-unused-vars)\n9:31 - \'model\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('routes/cities.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/cities.js should pass ESLint\n\n11:9 - \'params\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('routes/city.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/city.js should pass ESLint\n\n20:5 - Unexpected console statement. (no-console)\n58:5 - Unexpected console statement. (no-console)');
  });

  QUnit.test('routes/geolocate.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/geolocate.js should pass ESLint\n\n23:9 - Unexpected console statement. (no-console)\n25:13 - \'cities\' is assigned a value but never used. (no-unused-vars)\n34:7 - Unexpected console statement. (no-console)');
  });

  QUnit.test('services/cities.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/cities.js should pass ESLint\n\n');
  });

  QUnit.test('services/geolocation.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'services/geolocation.js should pass ESLint\n\n11:7 - \'geolocator\' is not defined. (no-undef)\n37:13 - Unexpected console statement. (no-console)\n40:11 - Unexpected console statement. (no-console)');
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

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/application-test.js should pass ESLint\n\n');
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
