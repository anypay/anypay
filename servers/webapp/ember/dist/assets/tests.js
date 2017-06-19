'use strict';

define('anypay-dash/tests/app.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass jshint.');
  });
});
define('anypay-dash/tests/controllers/invoice.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | controllers/invoice.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/invoice.js should pass jshint.\ncontrollers/invoice.js: line 6, col 25, \'uid\' is defined but never used.\ncontrollers/invoice.js: line 8, col 19, \'io\' is not defined.\n\n2 errors');
  });
});
define('anypay-dash/tests/controllers/new-invoice.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | controllers/new-invoice.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/new-invoice.js should pass jshint.\ncontrollers/new-invoice.js: line 30, col 11, \'controller\' is defined but never used.\ncontrollers/new-invoice.js: line 2, col 8, \'Invoice\' is defined but never used.\n\n2 errors');
  });
});
define('anypay-dash/tests/controllers/paid.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | controllers/paid.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/paid.js should pass jshint.');
  });
});
define('anypay-dash/tests/helpers/destroy-app', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = destroyApp;

  function destroyApp(application) {
    _ember['default'].run(application, 'destroy');
  }
});
define('anypay-dash/tests/helpers/destroy-app.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/destroy-app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass jshint.');
  });
});
define('anypay-dash/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'ember', 'anypay-dash/tests/helpers/start-app', 'anypay-dash/tests/helpers/destroy-app'], function (exports, _qunit, _ember, _anypayDashTestsHelpersStartApp, _anypayDashTestsHelpersDestroyApp) {
  var Promise = _ember['default'].RSVP.Promise;

  exports['default'] = function (name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _anypayDashTestsHelpersStartApp['default'])();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },

      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Promise.resolve(afterEach).then(function () {
          return (0, _anypayDashTestsHelpersDestroyApp['default'])(_this.application);
        });
      }
    });
  };
});
define('anypay-dash/tests/helpers/module-for-acceptance.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/module-for-acceptance.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass jshint.');
  });
});
define('anypay-dash/tests/helpers/resolver', ['exports', 'anypay-dash/resolver', 'anypay-dash/config/environment'], function (exports, _anypayDashResolver, _anypayDashConfigEnvironment) {

  var resolver = _anypayDashResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _anypayDashConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _anypayDashConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});
define('anypay-dash/tests/helpers/resolver.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/resolver.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass jshint.');
  });
});
define('anypay-dash/tests/helpers/start-app', ['exports', 'ember', 'anypay-dash/app', 'anypay-dash/config/environment'], function (exports, _ember, _anypayDashApp, _anypayDashConfigEnvironment) {
  exports['default'] = startApp;

  function startApp(attrs) {
    var application = undefined;

    // use defaults, but you can override
    var attributes = _ember['default'].assign({}, _anypayDashConfigEnvironment['default'].APP, attrs);

    _ember['default'].run(function () {
      application = _anypayDashApp['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }
});
define('anypay-dash/tests/helpers/start-app.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/start-app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass jshint.');
  });
});
define('anypay-dash/tests/models/invoice.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | models/invoice.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/invoice.js should pass jshint.');
  });
});
define('anypay-dash/tests/resolver.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | resolver.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass jshint.');
  });
});
define('anypay-dash/tests/router.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | router.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass jshint.');
  });
});
define('anypay-dash/tests/routes/home.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/home.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/home.js should pass jshint.');
  });
});
define('anypay-dash/tests/routes/invoice.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/invoice.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/invoice.js should pass jshint.\nroutes/invoice.js: line 9, col 48, Missing semicolon.\nroutes/invoice.js: line 16, col 7, \'qrcode\' is defined but never used.\nroutes/invoice.js: line 28, col 29, \'p\' is defined but never used.\nroutes/invoice.js: line 6, col 16, \'io\' is not defined.\nroutes/invoice.js: line 16, col 20, \'QRCode\' is not defined.\nroutes/invoice.js: line 22, col 22, \'QRCode\' is not defined.\n\n6 errors');
  });
});
define('anypay-dash/tests/routes/new-invoice.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/new-invoice.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/new-invoice.js should pass jshint.\nroutes/new-invoice.js: line 8, col 9, \'$\' is not defined.\n\n1 error');
  });
});
define('anypay-dash/tests/routes/paid.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/paid.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/paid.js should pass jshint.\nroutes/paid.js: line 13, col 7, \'$\' is not defined.\n\n1 error');
  });
});
define('anypay-dash/tests/test-helper', ['exports', 'anypay-dash/tests/helpers/resolver', 'ember-qunit'], function (exports, _anypayDashTestsHelpersResolver, _emberQunit) {

  (0, _emberQunit.setResolver)(_anypayDashTestsHelpersResolver['default']);
});
define('anypay-dash/tests/test-helper.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | test-helper.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass jshint.');
  });
});
define('anypay-dash/tests/unit/controllers/invoice-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:invoice', 'Unit | Controller | invoice', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('anypay-dash/tests/unit/controllers/invoice-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/controllers/invoice-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/invoice-test.js should pass jshint.');
  });
});
define('anypay-dash/tests/unit/controllers/new-invoice-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:new-invoice', 'Unit | Controller | new invoice', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('anypay-dash/tests/unit/controllers/new-invoice-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/controllers/new-invoice-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/new-invoice-test.js should pass jshint.');
  });
});
define('anypay-dash/tests/unit/controllers/paid-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:paid', 'Unit | Controller | paid', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('anypay-dash/tests/unit/controllers/paid-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/controllers/paid-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/paid-test.js should pass jshint.');
  });
});
define('anypay-dash/tests/unit/models/invoice-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('invoice', 'Unit | Model | invoice', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('anypay-dash/tests/unit/models/invoice-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/models/invoice-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/invoice-test.js should pass jshint.');
  });
});
define('anypay-dash/tests/unit/routes/home-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:home', 'Unit | Route | home', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('anypay-dash/tests/unit/routes/home-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/routes/home-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/home-test.js should pass jshint.');
  });
});
define('anypay-dash/tests/unit/routes/invoice-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:invoice', 'Unit | Route | invoice', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('anypay-dash/tests/unit/routes/invoice-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/routes/invoice-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/invoice-test.js should pass jshint.');
  });
});
define('anypay-dash/tests/unit/routes/new-invoice-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:new-invoice', 'Unit | Route | new invoice', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('anypay-dash/tests/unit/routes/new-invoice-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/routes/new-invoice-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/new-invoice-test.js should pass jshint.');
  });
});
define('anypay-dash/tests/unit/routes/paid-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:paid', 'Unit | Route | paid', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('anypay-dash/tests/unit/routes/paid-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/routes/paid-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/paid-test.js should pass jshint.');
  });
});
/* jshint ignore:start */

require('anypay-dash/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;

/* jshint ignore:end */
//# sourceMappingURL=tests.map
