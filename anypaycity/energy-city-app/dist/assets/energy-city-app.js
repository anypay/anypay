"use strict";



define('energy-city-app/app', ['exports', 'energy-city-app/resolver', 'ember-load-initializers', 'energy-city-app/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
define('energy-city-app/authenticators/token', ['exports', 'ember-simple-auth/authenticators/base'], function (exports, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  exports.default = _base.default.extend({
    restore: function restore(data) {
      return Ember.RSVP.Promise.resolve(data);
    },
    authenticate: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(code, state) {
        var resp;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                //get signed webtoken using moneybutton oauth code and state
                Ember.Logger.log('authenticate', code);

                _context.next = 3;
                return $.ajax({
                  method: 'POST',
                  url: '/auth/moneybutton',
                  data: { code: code, state: state }
                });

              case 3:
                resp = _context.sent;


                console.log("RESP", resp);

                return _context.abrupt('return', Ember.RSVP.Promise.resolve({ token: resp.token }));

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function authenticate(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return authenticate;
    }(),
    invalidate: function invalidate() {
      return Ember.RSVP.Promise.resolve();
    }
  });
});
define('energy-city-app/components/-private-api/addon-factory', ['exports', 'ember-google-maps/components/-private-api/addon-factory'], function (exports, _addonFactory) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _addonFactory.default;
    }
  });
});
define('energy-city-app/components/-private-api/warn-missing-component', ['exports', 'ember-google-maps/components/-private-api/warn-missing-component'], function (exports, _warnMissingComponent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _warnMissingComponent.default;
    }
  });
});
define('energy-city-app/components/bs-accordion', ['exports', 'ember-bootstrap/components/bs-accordion'], function (exports, _bsAccordion) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsAccordion.default;
    }
  });
});
define('energy-city-app/components/bs-accordion/item', ['exports', 'ember-bootstrap/components/bs-accordion/item'], function (exports, _item) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _item.default;
    }
  });
});
define('energy-city-app/components/bs-accordion/item/body', ['exports', 'ember-bootstrap/components/bs-accordion/item/body'], function (exports, _body) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _body.default;
    }
  });
});
define('energy-city-app/components/bs-accordion/item/title', ['exports', 'ember-bootstrap/components/bs-accordion/item/title'], function (exports, _title) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _title.default;
    }
  });
});
define('energy-city-app/components/bs-alert', ['exports', 'ember-bootstrap/components/bs-alert'], function (exports, _bsAlert) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsAlert.default;
    }
  });
});
define('energy-city-app/components/bs-button-group', ['exports', 'ember-bootstrap/components/bs-button-group'], function (exports, _bsButtonGroup) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsButtonGroup.default;
    }
  });
});
define('energy-city-app/components/bs-button-group/button', ['exports', 'ember-bootstrap/components/bs-button-group/button'], function (exports, _button) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _button.default;
    }
  });
});
define('energy-city-app/components/bs-button', ['exports', 'ember-bootstrap/components/bs-button'], function (exports, _bsButton) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsButton.default;
    }
  });
});
define('energy-city-app/components/bs-carousel', ['exports', 'ember-bootstrap/components/bs-carousel'], function (exports, _bsCarousel) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsCarousel.default;
    }
  });
});
define('energy-city-app/components/bs-carousel/slide', ['exports', 'ember-bootstrap/components/bs-carousel/slide'], function (exports, _slide) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _slide.default;
    }
  });
});
define('energy-city-app/components/bs-collapse', ['exports', 'ember-bootstrap/components/bs-collapse'], function (exports, _bsCollapse) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsCollapse.default;
    }
  });
});
define('energy-city-app/components/bs-dropdown', ['exports', 'ember-bootstrap/components/bs-dropdown'], function (exports, _bsDropdown) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsDropdown.default;
    }
  });
});
define('energy-city-app/components/bs-dropdown/button', ['exports', 'ember-bootstrap/components/bs-dropdown/button'], function (exports, _button) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _button.default;
    }
  });
});
define('energy-city-app/components/bs-dropdown/menu', ['exports', 'ember-bootstrap/components/bs-dropdown/menu'], function (exports, _menu) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _menu.default;
    }
  });
});
define('energy-city-app/components/bs-dropdown/menu/divider', ['exports', 'ember-bootstrap/components/bs-dropdown/menu/divider'], function (exports, _divider) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _divider.default;
    }
  });
});
define('energy-city-app/components/bs-dropdown/menu/item', ['exports', 'ember-bootstrap/components/bs-dropdown/menu/item'], function (exports, _item) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _item.default;
    }
  });
});
define('energy-city-app/components/bs-dropdown/menu/link-to', ['exports', 'ember-bootstrap/components/bs-dropdown/menu/link-to'], function (exports, _linkTo) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _linkTo.default;
    }
  });
});
define('energy-city-app/components/bs-dropdown/toggle', ['exports', 'ember-bootstrap/components/bs-dropdown/toggle'], function (exports, _toggle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _toggle.default;
    }
  });
});
define('energy-city-app/components/bs-form', ['exports', 'ember-bootstrap/components/bs-form'], function (exports, _bsForm) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsForm.default;
    }
  });
});
define('energy-city-app/components/bs-form/element', ['exports', 'ember-bootstrap/components/bs-form/element'], function (exports, _element) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _element.default;
    }
  });
});
define('energy-city-app/components/bs-form/element/control', ['exports', 'ember-bootstrap/components/bs-form/element/control'], function (exports, _control) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _control.default;
    }
  });
});
define('energy-city-app/components/bs-form/element/control/checkbox', ['exports', 'ember-bootstrap/components/bs-form/element/control/checkbox'], function (exports, _checkbox) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _checkbox.default;
    }
  });
});
define('energy-city-app/components/bs-form/element/control/input', ['exports', 'ember-bootstrap/components/bs-form/element/control/input'], function (exports, _input) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _input.default;
    }
  });
});
define('energy-city-app/components/bs-form/element/control/radio', ['exports', 'ember-bootstrap/components/bs-form/element/control/radio'], function (exports, _radio) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _radio.default;
    }
  });
});
define('energy-city-app/components/bs-form/element/control/textarea', ['exports', 'ember-bootstrap/components/bs-form/element/control/textarea'], function (exports, _textarea) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _textarea.default;
    }
  });
});
define('energy-city-app/components/bs-form/element/errors', ['exports', 'ember-bootstrap/components/bs-form/element/errors'], function (exports, _errors) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _errors.default;
    }
  });
});
define('energy-city-app/components/bs-form/element/feedback-icon', ['exports', 'ember-bootstrap/components/bs-form/element/feedback-icon'], function (exports, _feedbackIcon) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _feedbackIcon.default;
    }
  });
});
define('energy-city-app/components/bs-form/element/help-text', ['exports', 'ember-bootstrap/components/bs-form/element/help-text'], function (exports, _helpText) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _helpText.default;
    }
  });
});
define('energy-city-app/components/bs-form/element/label', ['exports', 'ember-bootstrap/components/bs-form/element/label'], function (exports, _label) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _label.default;
    }
  });
});
define('energy-city-app/components/bs-form/element/layout/horizontal', ['exports', 'ember-bootstrap/components/bs-form/element/layout/horizontal'], function (exports, _horizontal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _horizontal.default;
    }
  });
});
define('energy-city-app/components/bs-form/element/layout/horizontal/checkbox', ['exports', 'ember-bootstrap/components/bs-form/element/layout/horizontal/checkbox'], function (exports, _checkbox) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _checkbox.default;
    }
  });
});
define('energy-city-app/components/bs-form/element/layout/inline', ['exports', 'ember-bootstrap/components/bs-form/element/layout/inline'], function (exports, _inline) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _inline.default;
    }
  });
});
define('energy-city-app/components/bs-form/element/layout/inline/checkbox', ['exports', 'ember-bootstrap/components/bs-form/element/layout/inline/checkbox'], function (exports, _checkbox) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _checkbox.default;
    }
  });
});
define('energy-city-app/components/bs-form/element/layout/vertical', ['exports', 'ember-bootstrap/components/bs-form/element/layout/vertical'], function (exports, _vertical) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _vertical.default;
    }
  });
});
define('energy-city-app/components/bs-form/element/layout/vertical/checkbox', ['exports', 'ember-bootstrap/components/bs-form/element/layout/vertical/checkbox'], function (exports, _checkbox) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _checkbox.default;
    }
  });
});
define('energy-city-app/components/bs-form/group', ['exports', 'ember-bootstrap/components/bs-form/group'], function (exports, _group) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _group.default;
    }
  });
});
define('energy-city-app/components/bs-modal-simple', ['exports', 'ember-bootstrap/components/bs-modal-simple'], function (exports, _bsModalSimple) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsModalSimple.default;
    }
  });
});
define('energy-city-app/components/bs-modal', ['exports', 'ember-bootstrap/components/bs-modal'], function (exports, _bsModal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsModal.default;
    }
  });
});
define('energy-city-app/components/bs-modal/body', ['exports', 'ember-bootstrap/components/bs-modal/body'], function (exports, _body) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _body.default;
    }
  });
});
define('energy-city-app/components/bs-modal/dialog', ['exports', 'ember-bootstrap/components/bs-modal/dialog'], function (exports, _dialog) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _dialog.default;
    }
  });
});
define('energy-city-app/components/bs-modal/footer', ['exports', 'ember-bootstrap/components/bs-modal/footer'], function (exports, _footer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _footer.default;
    }
  });
});
define('energy-city-app/components/bs-modal/header', ['exports', 'ember-bootstrap/components/bs-modal/header'], function (exports, _header) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _header.default;
    }
  });
});
define('energy-city-app/components/bs-modal/header/close', ['exports', 'ember-bootstrap/components/bs-modal/header/close'], function (exports, _close) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _close.default;
    }
  });
});
define('energy-city-app/components/bs-modal/header/title', ['exports', 'ember-bootstrap/components/bs-modal/header/title'], function (exports, _title) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _title.default;
    }
  });
});
define('energy-city-app/components/bs-nav', ['exports', 'ember-bootstrap/components/bs-nav'], function (exports, _bsNav) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsNav.default;
    }
  });
});
define('energy-city-app/components/bs-nav/item', ['exports', 'ember-bootstrap/components/bs-nav/item'], function (exports, _item) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _item.default;
    }
  });
});
define('energy-city-app/components/bs-nav/link-to', ['exports', 'ember-bootstrap/components/bs-nav/link-to'], function (exports, _linkTo) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _linkTo.default;
    }
  });
});
define('energy-city-app/components/bs-navbar', ['exports', 'ember-bootstrap/components/bs-navbar'], function (exports, _bsNavbar) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsNavbar.default;
    }
  });
});
define('energy-city-app/components/bs-navbar/content', ['exports', 'ember-bootstrap/components/bs-navbar/content'], function (exports, _content) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _content.default;
    }
  });
});
define('energy-city-app/components/bs-navbar/link-to', ['exports', 'ember-bootstrap/components/bs-navbar/link-to'], function (exports, _linkTo) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _linkTo.default;
    }
  });
});
define('energy-city-app/components/bs-navbar/nav', ['exports', 'ember-bootstrap/components/bs-navbar/nav'], function (exports, _nav) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _nav.default;
    }
  });
});
define('energy-city-app/components/bs-navbar/toggle', ['exports', 'ember-bootstrap/components/bs-navbar/toggle'], function (exports, _toggle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _toggle.default;
    }
  });
});
define('energy-city-app/components/bs-popover', ['exports', 'ember-bootstrap/components/bs-popover'], function (exports, _bsPopover) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsPopover.default;
    }
  });
});
define('energy-city-app/components/bs-popover/element', ['exports', 'ember-bootstrap/components/bs-popover/element'], function (exports, _element) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _element.default;
    }
  });
});
define('energy-city-app/components/bs-progress', ['exports', 'ember-bootstrap/components/bs-progress'], function (exports, _bsProgress) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsProgress.default;
    }
  });
});
define('energy-city-app/components/bs-progress/bar', ['exports', 'ember-bootstrap/components/bs-progress/bar'], function (exports, _bar) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bar.default;
    }
  });
});
define('energy-city-app/components/bs-tab', ['exports', 'ember-bootstrap/components/bs-tab'], function (exports, _bsTab) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsTab.default;
    }
  });
});
define('energy-city-app/components/bs-tab/pane', ['exports', 'ember-bootstrap/components/bs-tab/pane'], function (exports, _pane) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _pane.default;
    }
  });
});
define('energy-city-app/components/bs-tooltip', ['exports', 'ember-bootstrap/components/bs-tooltip'], function (exports, _bsTooltip) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsTooltip.default;
    }
  });
});
define('energy-city-app/components/bs-tooltip/element', ['exports', 'ember-bootstrap/components/bs-tooltip/element'], function (exports, _element) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _element.default;
    }
  });
});
define('energy-city-app/components/ember-popper-targeting-parent', ['exports', 'ember-popper/components/ember-popper-targeting-parent'], function (exports, _emberPopperTargetingParent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _emberPopperTargetingParent.default;
    }
  });
});
define('energy-city-app/components/ember-popper', ['exports', 'ember-popper/components/ember-popper'], function (exports, _emberPopper) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _emberPopper.default;
    }
  });
});
define('energy-city-app/components/g-map-addons/pin', ['exports', 'in-repo-pin-addon/components/g-map-addons/pin'], function (exports, _pin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _pin.default;
    }
  });
});
define('energy-city-app/components/g-map', ['exports', 'ember-google-maps/components/g-map'], function (exports, _gMap) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _gMap.default;
    }
  });
});
define('energy-city-app/components/g-map/autocomplete', ['exports', 'ember-google-maps/components/g-map/autocomplete'], function (exports, _autocomplete) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _autocomplete.default;
    }
  });
});
define('energy-city-app/components/g-map/canvas', ['exports', 'ember-google-maps/components/g-map/canvas'], function (exports, _canvas) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _canvas.default;
    }
  });
});
define('energy-city-app/components/g-map/circle', ['exports', 'ember-google-maps/components/g-map/circle'], function (exports, _circle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _circle.default;
    }
  });
});
define('energy-city-app/components/g-map/control', ['exports', 'ember-google-maps/components/g-map/control'], function (exports, _control) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _control.default;
    }
  });
});
define('energy-city-app/components/g-map/directions', ['exports', 'ember-google-maps/components/g-map/directions'], function (exports, _directions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _directions.default;
    }
  });
});
define('energy-city-app/components/g-map/info-window', ['exports', 'ember-google-maps/components/g-map/info-window'], function (exports, _infoWindow) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _infoWindow.default;
    }
  });
});
define('energy-city-app/components/g-map/map-component', ['exports', 'ember-google-maps/components/g-map/map-component'], function (exports, _mapComponent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _mapComponent.default;
    }
  });
});
define('energy-city-app/components/g-map/marker', ['exports', 'ember-google-maps/components/g-map/marker'], function (exports, _marker) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _marker.default;
    }
  });
});
define('energy-city-app/components/g-map/overlay', ['exports', 'ember-google-maps/components/g-map/overlay'], function (exports, _overlay) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _overlay.default;
    }
  });
});
define('energy-city-app/components/g-map/polyline', ['exports', 'ember-google-maps/components/g-map/polyline'], function (exports, _polyline) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _polyline.default;
    }
  });
});
define('energy-city-app/components/g-map/route', ['exports', 'ember-google-maps/components/g-map/route'], function (exports, _route) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _route.default;
    }
  });
});
define('energy-city-app/components/g-map/waypoint', ['exports', 'ember-google-maps/components/g-map/waypoint'], function (exports, _waypoint) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _waypoint.default;
    }
  });
});
define('energy-city-app/components/location-list', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({});
});
define('energy-city-app/components/money-button', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    didInsertElement: function didInsertElement() {
      this._super.apply(this, arguments);

      var div = document.getElementById('my-money-button');

      window.moneyButton.render(div, {
        outputs: [{
          to: 'steven@simply.cash',
          amount: 0.1,
          currency: 'BSV'
        }, {
          to: 'steven@simply.cash',
          amount: 0.0001,
          currency: 'BSV'
        }]
      });
    }
  });
});
define('energy-city-app/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _welcomePage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
define('energy-city-app/controllers/application', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Ember$Controller$ext;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  exports.default = Ember.Controller.extend((_Ember$Controller$ext = {
    addressSearch: Ember.inject.service('address-search'),

    geolocation: Ember.inject.service(),

    currentLocation: null

  }, _defineProperty(_Ember$Controller$ext, 'geolocation', null), _defineProperty(_Ember$Controller$ext, 'socket', null), _defineProperty(_Ember$Controller$ext, 'connected', false), _defineProperty(_Ember$Controller$ext, 'session', Ember.inject.service()), _defineProperty(_Ember$Controller$ext, 'actions', {
    searchLocation: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(query) {
        var results;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.get('addressSearch').getCoordinates(this.get('search'));

              case 2:
                results = _context.sent;


                console.log('addressSearchResults', results);

                this.get('googlemap').setCenter({
                  lat: parseFloat(results.lat),
                  lng: parseFloat(results.lng)
                });

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function searchLocation(_x) {
        return _ref.apply(this, arguments);
      }

      return searchLocation;
    }()
  }), _Ember$Controller$ext));
});
define('energy-city-app/controllers/business', ['exports', 'ember-get-config'], function (exports, _emberGetConfig) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var calculator = [];

  var _generateInvoice = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(account_id, amount, accessToken) {
      var headers, resp;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log('generate', account_id);
              headers = {
                'Authorization': 'Basic ' + btoa(accessToken + ":")
              };
              _context.next = 4;
              return Ember.$.ajax({
                method: 'POST',
                url: 'https://api.anypayinc.com/accounts/' + account_id + '/invoices',
                data: {
                  amount: parseFloat(amount)
                  //redirect_url: 'https://anypay.city/'
                },
                headers: headers
              });

            case 4:
              resp = _context.sent;
              return _context.abrupt('return', resp);

            case 6:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function _generateInvoice(_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();

  exports.default = Ember.Controller.extend({
    session: Ember.inject.service(),
    amount: '0.00',

    isShowNextButton: Ember.computed('amount', function () {
      return this.get("amount") > 0;
    }),

    actions: {
      calculatorPress: function calculatorPress(event) {
        var n = Ember.$(event.target).html();
        var decimalIndex = calculator.indexOf('.');
        if (decimalIndex > 0 && decimalIndex === calculator.length - 3) {
          return;
        }
        if (n === '.') {
          if (decimalIndex !== -1) {
            return;
          }
          if (calculator.length === 0) {
            return;
          }
        }
        console.log("calculator press", n);
        calculator.push(n);
        var decimalPlaces = this.get('denominationCurrency.decimal_places') || 2;
        var total = parseFloat(calculator.join('')) / Math.pow(10, decimalPlaces);
        this.set('amount', total.toFixed(decimalPlaces));

        console.log('amount', this.get('amount'));
        if (parseFloat(this.get('amount')) > 0) {
          Ember.$("#collect-amount").show();
        } else {
          Ember.$("#collect-amount").hide();
        }
      },
      pressBackspace: function pressBackspace() {
        console.log('back');
        calculator.splice(-1, 1);
        var decimalPlaces = this.get('denominationCurrency.decimal_places') || 2;
        var total = calculator.join('') / Math.pow(10, decimalPlaces || 0);
        console.log('total', total);
        this.set('amount', total.toFixed(decimalPlaces));
      },
      clearCalculator: function clearCalculator() {
        calculator = [];
        this.set('amount', this.getAmountMask());
        Ember.$("#collect-amount").hide();
      },
      generateInvoice: function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
          var token, resp;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  token = this.get('session')['session']['content']['authenticated']['token'];


                  $('.loading').show();
                  _context2.next = 4;
                  return _generateInvoice(this.get('business').id, this.get('amount'), token);

                case 4:
                  resp = _context2.sent;

                  console.log('GENERATED!', resp);

                  $('.loading').hide();

                  window.location = 'https://app.anypayinc.com/invoices/' + resp.invoice.uid;

                case 8:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function generateInvoice() {
          return _ref2.apply(this, arguments);
        }

        return generateInvoice;
      }()
    }

  });
});
define('energy-city-app/controllers/cities', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({

    socket: null,

    connected: false,

    actions: {
      cityClicked: function cityClicked(city) {

        console.log('city clicked', city);

        if (city.city.latitude && city.city.longitude) {

          this.transitionToRoute('map', city.city.latitude, city.city.longitude);
        } else {

          this.transitionToRoute('city', city.city_tag);
        }
      }
    }

  });
});
define('energy-city-app/controllers/city', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({

    socket: null,

    connected: false,

    locations: [],

    session: Ember.inject.service(),

    handleInvoicePaid: function handleInvoicePaid(invoice) {

      console.log('invoice.paid', invoice);
    },
    handleInvoiceCreated: function handleInvoiceCreated(invoice) {

      console.log('invoice.created', invoice);

      var locations = this.get('locations');

      var _loop = function _loop(i) {
        console.log(locations[i]);

        if (locations[i].account_id === invoice.account_id) {

          Ember.set(locations[i], 'invoice', invoice);

          setTimeout(function () {

            Ember.set(locations[i], 'invoice', null);
          }, 10000);
        }
      };

      for (var i = 0; i < locations.length; i++) {
        _loop(i);
      }
    },


    actions: {
      businessClicked: function businessClicked(business) {
        console.log('business clicked!', business);
        this.transitionToRoute('business', business);
        //window.open(`https://app.anypayinc.com/pay/${business.stub}`)
      }
    }

  });
});
define('energy-city-app/controllers/home', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  exports.default = Ember.Controller.extend({

    actions: {
      findNearby: function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          var _this = this;

          var permission;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  console.log("find nearby");

                  _context.next = 3;
                  return window.navigator.permissions.query({ name: 'geolocation' });

                case 3:
                  permission = _context.sent;


                  if (permission.state === 'granted') {} else {

                    //alert(permission.state)
                  }

                  if (permission.state === 'granted') {} else {}

                  $('#loader-wrapper').show();
                  window.navigator.geolocation.getCurrentPosition(function (position) {

                    $('#loader-wrapper').hide();
                    console.log('geolocation.currentposition', position);

                    _this.transitionToRoute('map', position.coords.latitude, position.coords.longitude);
                  }, function (error) {
                    $('#loader-wrapper').hide();
                    console.log('geolocation.error', error);

                    _this.transitionToRoute('search-city');
                  }, {
                    enableHighAccuracy: false
                  });

                case 8:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function findNearby() {
          return _ref.apply(this, arguments);
        }

        return findNearby;
      }()
    }
  });


  function revokePermission() {
    return window.navigator.permissions.revoke({ name: 'geolocation' });
  }
});
define('energy-city-app/controllers/leaderboard', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({});
});
define('energy-city-app/controllers/map', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  exports.default = Ember.Controller.extend({
    addressSearch: Ember.inject.service('address-search'),
    search: null,
    selectedMerchant: null,
    selectedMerchantCoins: [],

    actions: {
      closeModal: function closeModal() {
        Ember.$('.business-modal').addClass('close');
        this.set('selectedMerchant', null);
        this.set('selectedMerchantDetails', null);
      },
      searchLocation: function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(query) {
          var results;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.get('addressSearch').getCoordinates(this.get('search'));

                case 2:
                  results = _context.sent;


                  console.log('addressSearchResults', results);

                  this.get('googlemap').setCenter({
                    lat: parseFloat(results.lat),
                    lng: parseFloat(results.lng)
                  });

                case 5:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function searchLocation(_x) {
          return _ref.apply(this, arguments);
        }

        return searchLocation;
      }(),
      payNow: function payNow() {

        if (this.get('selectedMerchant').stub) {
          window.open('https://app.anypayinc.com/pay/' + this.get('selectedMerchant').stub);
        }
      },
      merchantDetailsClicked: function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(details) {
          var resp;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  this.set('selectedMerchant', details);

                  Ember.$('.business-modal').removeClass('close');

                  _context2.next = 4;
                  return Ember.$.getJSON('https://api.anypayinc.com/accounts/' + details.id);

                case 4:
                  resp = _context2.sent;


                  this.set('selectedMerchantDetails', resp);
                  this.set('selectedMerchantCoins', resp.coins.join(', '));

                  /*
                  console.log('merchant details clicked', details)
                  if (details.stub) {
                    window.location = `https://app.anypayinc.com/pay/${details.stub}`
                  }
                   this.get('googlemap').setCenter({
                    lat: parseFloat(details.latitude),
                    lng: parseFloat(details.longitude)
                  })
                  */

                case 7:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function merchantDetailsClicked(_x2) {
          return _ref2.apply(this, arguments);
        }

        return merchantDetailsClicked;
      }(),
      showDetails: function showDetails(location) {

        console.log('show details', location);

        this.set('location', location);
      }
    }
  });
});
define('energy-city-app/controllers/moneybutton-auth-redirect', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    queryParams: ['code', 'state']
  });
});
define('energy-city-app/controllers/pay', ['exports', 'ember-get-config'], function (exports, _emberGetConfig) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var calculator = [];

  var _generateInvoice = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(account_id, amount, accessToken) {
      var headers, resp;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log('generate', account_id);
              headers = {
                'Authorization': 'Basic ' + btoa(accessToken + ":")
              };
              _context.next = 4;
              return Ember.$.ajax({
                method: 'POST',
                url: 'https://api.anypayinc.com/accounts/' + account_id + '/invoices',
                data: {
                  amount: parseFloat(amount)
                  //redirect_url: 'https://anypay.city/'
                },
                headers: headers
              });

            case 4:
              resp = _context.sent;
              return _context.abrupt('return', resp);

            case 6:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function _generateInvoice(_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();

  exports.default = Ember.Controller.extend({
    session: Ember.inject.service(),
    amount: '0.00',

    isShowNextButton: Ember.computed('amount', function () {
      return this.get("amount") > 0;
    }),

    actions: {
      calculatorPress: function calculatorPress(event) {
        var n = Ember.$(event.target).html();
        var decimalIndex = calculator.indexOf('.');
        if (decimalIndex > 0 && decimalIndex === calculator.length - 3) {
          return;
        }
        if (n === '.') {
          if (decimalIndex !== -1) {
            return;
          }
          if (calculator.length === 0) {
            return;
          }
        }
        console.log("calculator press", n);
        calculator.push(n);
        var decimalPlaces = this.get('denominationCurrency.decimal_places') || 2;
        var total = parseFloat(calculator.join('')) / Math.pow(10, decimalPlaces);
        this.set('amount', total.toFixed(decimalPlaces));

        console.log('amount', this.get('amount'));
        if (parseFloat(this.get('amount')) > 0) {
          Ember.$("#collect-amount").show();
        } else {
          Ember.$("#collect-amount").hide();
        }
      },
      pressBackspace: function pressBackspace() {
        console.log('back');
        calculator.splice(-1, 1);
        var decimalPlaces = this.get('denominationCurrency.decimal_places') || 2;
        var total = calculator.join('') / Math.pow(10, decimalPlaces || 0);
        console.log('total', total);
        this.set('amount', total.toFixed(decimalPlaces));
      },
      clearCalculator: function clearCalculator() {
        calculator = [];
        this.set('amount', this.getAmountMask());
        Ember.$("#collect-amount").hide();
      },
      generateInvoice: function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
          var token, resp;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  token = this.get('session')['session']['content']['authenticated']['token'];


                  $('.loading').show();
                  _context2.next = 4;
                  return _generateInvoice(this.get('business').id, this.get('amount'), token);

                case 4:
                  resp = _context2.sent;

                  console.log('GENERATED!', resp);

                  $('.loading').hide();

                  window.location = 'https://app.anypayinc.com/invoices/' + resp.invoice.uid;

                case 8:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function generateInvoice() {
          return _ref2.apply(this, arguments);
        }

        return generateInvoice;
      }()
    }

  });
});
define('energy-city-app/controllers/search-city', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  exports.default = Ember.Controller.extend({
    addressSearch: Ember.inject.service('address-search'),
    search: null,

    actions: {
      searchLocation: function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(query) {
          var results;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.get('addressSearch').getCoordinates(this.get('search'));

                case 2:
                  results = _context.sent;


                  this.transitionToRoute('map', results.lat, results.lng);

                case 4:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function searchLocation(_x) {
          return _ref.apply(this, arguments);
        }

        return searchLocation;
      }()
    }

  });
});
define('energy-city-app/helpers/-link-to-params', ['exports', 'ember-angle-bracket-invocation-polyfill/helpers/-link-to-params'], function (exports, _linkToParams) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _linkToParams.default;
    }
  });
});
define('energy-city-app/helpers/app-version', ['exports', 'energy-city-app/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  function appVersion(_) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var version = _environment.default.APP.version;
    // e.g. 1.0.0-alpha.1+4jds75hf

    // Allow use of 'hideSha' and 'hideVersion' For backwards compatibility
    var versionOnly = hash.versionOnly || hash.hideSha;
    var shaOnly = hash.shaOnly || hash.hideVersion;

    var match = null;

    if (versionOnly) {
      if (hash.showExtended) {
        match = version.match(_regexp.versionExtendedRegExp); // 1.0.0-alpha.1
      }
      // Fallback to just version
      if (!match) {
        match = version.match(_regexp.versionRegExp); // 1.0.0
      }
    }

    if (shaOnly) {
      match = version.match(_regexp.shaRegExp); // 4jds75hf
    }

    return match ? match[0] : version;
  }

  exports.default = Ember.Helper.helper(appVersion);
});
define('energy-city-app/helpers/append', ['exports', 'ember-composable-helpers/helpers/append'], function (exports, _append) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _append.default;
    }
  });
  Object.defineProperty(exports, 'append', {
    enumerable: true,
    get: function () {
      return _append.append;
    }
  });
});
define('energy-city-app/helpers/bs-contains', ['exports', 'ember-bootstrap/helpers/bs-contains'], function (exports, _bsContains) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsContains.default;
    }
  });
  Object.defineProperty(exports, 'bsContains', {
    enumerable: true,
    get: function () {
      return _bsContains.bsContains;
    }
  });
});
define('energy-city-app/helpers/bs-eq', ['exports', 'ember-bootstrap/helpers/bs-eq'], function (exports, _bsEq) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _bsEq.default;
    }
  });
  Object.defineProperty(exports, 'eq', {
    enumerable: true,
    get: function () {
      return _bsEq.eq;
    }
  });
});
define('energy-city-app/helpers/call', ['exports', 'ember-composable-helpers/helpers/call'], function (exports, _call) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _call.default;
    }
  });
  Object.defineProperty(exports, 'call', {
    enumerable: true,
    get: function () {
      return _call.call;
    }
  });
});
define('energy-city-app/helpers/cancel-all', ['exports', 'ember-concurrency/helpers/cancel-all'], function (exports, _cancelAll) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _cancelAll.default;
    }
  });
});
define('energy-city-app/helpers/chunk', ['exports', 'ember-composable-helpers/helpers/chunk'], function (exports, _chunk) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _chunk.default;
    }
  });
  Object.defineProperty(exports, 'chunk', {
    enumerable: true,
    get: function () {
      return _chunk.chunk;
    }
  });
});
define('energy-city-app/helpers/compact', ['exports', 'ember-composable-helpers/helpers/compact'], function (exports, _compact) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _compact.default;
    }
  });
});
define('energy-city-app/helpers/compute', ['exports', 'ember-composable-helpers/helpers/compute'], function (exports, _compute) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _compute.default;
    }
  });
  Object.defineProperty(exports, 'compute', {
    enumerable: true,
    get: function () {
      return _compute.compute;
    }
  });
});
define('energy-city-app/helpers/contains', ['exports', 'ember-composable-helpers/helpers/contains'], function (exports, _contains) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _contains.default;
    }
  });
  Object.defineProperty(exports, 'contains', {
    enumerable: true,
    get: function () {
      return _contains.contains;
    }
  });
});
define('energy-city-app/helpers/dec', ['exports', 'ember-composable-helpers/helpers/dec'], function (exports, _dec) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _dec.default;
    }
  });
  Object.defineProperty(exports, 'dec', {
    enumerable: true,
    get: function () {
      return _dec.dec;
    }
  });
});
define('energy-city-app/helpers/drop', ['exports', 'ember-composable-helpers/helpers/drop'], function (exports, _drop) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _drop.default;
    }
  });
});
define('energy-city-app/helpers/entries', ['exports', 'ember-composable-helpers/helpers/entries'], function (exports, _entries) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _entries.default;
    }
  });
  Object.defineProperty(exports, 'entries', {
    enumerable: true,
    get: function () {
      return _entries.entries;
    }
  });
});
define('energy-city-app/helpers/filter-by', ['exports', 'ember-composable-helpers/helpers/filter-by'], function (exports, _filterBy) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _filterBy.default;
    }
  });
});
define('energy-city-app/helpers/filter', ['exports', 'ember-composable-helpers/helpers/filter'], function (exports, _filter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _filter.default;
    }
  });
});
define('energy-city-app/helpers/find-by', ['exports', 'ember-composable-helpers/helpers/find-by'], function (exports, _findBy) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _findBy.default;
    }
  });
});
define('energy-city-app/helpers/flatten', ['exports', 'ember-composable-helpers/helpers/flatten'], function (exports, _flatten) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _flatten.default;
    }
  });
  Object.defineProperty(exports, 'flatten', {
    enumerable: true,
    get: function () {
      return _flatten.flatten;
    }
  });
});
define('energy-city-app/helpers/from-entries', ['exports', 'ember-composable-helpers/helpers/from-entries'], function (exports, _fromEntries) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _fromEntries.default;
    }
  });
  Object.defineProperty(exports, 'fromEntries', {
    enumerable: true,
    get: function () {
      return _fromEntries.fromEntries;
    }
  });
});
define('energy-city-app/helpers/g-map/compute', ['exports', 'ember-google-maps/helpers/g-map/compute'], function (exports, _compute) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _compute.default;
    }
  });
  Object.defineProperty(exports, 'gMapCompute', {
    enumerable: true,
    get: function () {
      return _compute.gMapCompute;
    }
  });
});
define('energy-city-app/helpers/group-by', ['exports', 'ember-composable-helpers/helpers/group-by'], function (exports, _groupBy) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _groupBy.default;
    }
  });
});
define('energy-city-app/helpers/has-next', ['exports', 'ember-composable-helpers/helpers/has-next'], function (exports, _hasNext) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _hasNext.default;
    }
  });
  Object.defineProperty(exports, 'hasNext', {
    enumerable: true,
    get: function () {
      return _hasNext.hasNext;
    }
  });
});
define('energy-city-app/helpers/has-previous', ['exports', 'ember-composable-helpers/helpers/has-previous'], function (exports, _hasPrevious) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _hasPrevious.default;
    }
  });
  Object.defineProperty(exports, 'hasPrevious', {
    enumerable: true,
    get: function () {
      return _hasPrevious.hasPrevious;
    }
  });
});
define('energy-city-app/helpers/inc', ['exports', 'ember-composable-helpers/helpers/inc'], function (exports, _inc) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _inc.default;
    }
  });
  Object.defineProperty(exports, 'inc', {
    enumerable: true,
    get: function () {
      return _inc.inc;
    }
  });
});
define('energy-city-app/helpers/includes', ['exports', 'ember-composable-helpers/helpers/includes'], function (exports, _includes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _includes.default;
    }
  });
  Object.defineProperty(exports, 'includes', {
    enumerable: true,
    get: function () {
      return _includes.includes;
    }
  });
});
define('energy-city-app/helpers/intersect', ['exports', 'ember-composable-helpers/helpers/intersect'], function (exports, _intersect) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _intersect.default;
    }
  });
});
define('energy-city-app/helpers/invoke', ['exports', 'ember-composable-helpers/helpers/invoke'], function (exports, _invoke) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _invoke.default;
    }
  });
  Object.defineProperty(exports, 'invoke', {
    enumerable: true,
    get: function () {
      return _invoke.invoke;
    }
  });
});
define('energy-city-app/helpers/is-after', ['exports', 'ember-moment/helpers/is-after'], function (exports, _isAfter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isAfter.default;
    }
  });
});
define('energy-city-app/helpers/is-before', ['exports', 'ember-moment/helpers/is-before'], function (exports, _isBefore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isBefore.default;
    }
  });
});
define('energy-city-app/helpers/is-between', ['exports', 'ember-moment/helpers/is-between'], function (exports, _isBetween) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isBetween.default;
    }
  });
});
define('energy-city-app/helpers/is-same-or-after', ['exports', 'ember-moment/helpers/is-same-or-after'], function (exports, _isSameOrAfter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isSameOrAfter.default;
    }
  });
});
define('energy-city-app/helpers/is-same-or-before', ['exports', 'ember-moment/helpers/is-same-or-before'], function (exports, _isSameOrBefore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isSameOrBefore.default;
    }
  });
});
define('energy-city-app/helpers/is-same', ['exports', 'ember-moment/helpers/is-same'], function (exports, _isSame) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isSame.default;
    }
  });
});
define('energy-city-app/helpers/join', ['exports', 'ember-composable-helpers/helpers/join'], function (exports, _join) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _join.default;
    }
  });
});
define('energy-city-app/helpers/keys', ['exports', 'ember-composable-helpers/helpers/keys'], function (exports, _keys) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _keys.default;
    }
  });
  Object.defineProperty(exports, 'keys', {
    enumerable: true,
    get: function () {
      return _keys.keys;
    }
  });
});
define('energy-city-app/helpers/map-by', ['exports', 'ember-composable-helpers/helpers/map-by'], function (exports, _mapBy) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _mapBy.default;
    }
  });
});
define('energy-city-app/helpers/map', ['exports', 'ember-composable-helpers/helpers/map'], function (exports, _map) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _map.default;
    }
  });
});
define('energy-city-app/helpers/moment-add', ['exports', 'ember-moment/helpers/moment-add'], function (exports, _momentAdd) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentAdd.default;
    }
  });
});
define('energy-city-app/helpers/moment-calendar', ['exports', 'ember-moment/helpers/moment-calendar'], function (exports, _momentCalendar) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentCalendar.default;
    }
  });
});
define('energy-city-app/helpers/moment-diff', ['exports', 'ember-moment/helpers/moment-diff'], function (exports, _momentDiff) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentDiff.default;
    }
  });
});
define('energy-city-app/helpers/moment-duration', ['exports', 'ember-moment/helpers/moment-duration'], function (exports, _momentDuration) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentDuration.default;
    }
  });
});
define('energy-city-app/helpers/moment-format', ['exports', 'ember-moment/helpers/moment-format'], function (exports, _momentFormat) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentFormat.default;
    }
  });
});
define('energy-city-app/helpers/moment-from-now', ['exports', 'ember-moment/helpers/moment-from-now'], function (exports, _momentFromNow) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentFromNow.default;
    }
  });
});
define('energy-city-app/helpers/moment-from', ['exports', 'ember-moment/helpers/moment-from'], function (exports, _momentFrom) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentFrom.default;
    }
  });
});
define('energy-city-app/helpers/moment-subtract', ['exports', 'ember-moment/helpers/moment-subtract'], function (exports, _momentSubtract) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentSubtract.default;
    }
  });
});
define('energy-city-app/helpers/moment-to-date', ['exports', 'ember-moment/helpers/moment-to-date'], function (exports, _momentToDate) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentToDate.default;
    }
  });
});
define('energy-city-app/helpers/moment-to-now', ['exports', 'ember-moment/helpers/moment-to-now'], function (exports, _momentToNow) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentToNow.default;
    }
  });
});
define('energy-city-app/helpers/moment-to', ['exports', 'ember-moment/helpers/moment-to'], function (exports, _momentTo) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentTo.default;
    }
  });
});
define('energy-city-app/helpers/moment-unix', ['exports', 'ember-moment/helpers/unix'], function (exports, _unix) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _unix.default;
    }
  });
});
define('energy-city-app/helpers/moment', ['exports', 'ember-moment/helpers/moment'], function (exports, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _moment.default;
    }
  });
});
define('energy-city-app/helpers/next', ['exports', 'ember-composable-helpers/helpers/next'], function (exports, _next) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _next.default;
    }
  });
  Object.defineProperty(exports, 'next', {
    enumerable: true,
    get: function () {
      return _next.next;
    }
  });
});
define("energy-city-app/helpers/noop", ["exports", "ember-composable-helpers/helpers/noop"], function (exports, _noop) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function () {
      return _noop.default;
    }
  });
  Object.defineProperty(exports, "noop", {
    enumerable: true,
    get: function () {
      return _noop.noop;
    }
  });
});
define('energy-city-app/helpers/now', ['exports', 'ember-moment/helpers/now'], function (exports, _now) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _now.default;
    }
  });
});
define('energy-city-app/helpers/object-at', ['exports', 'ember-composable-helpers/helpers/object-at'], function (exports, _objectAt) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _objectAt.default;
    }
  });
  Object.defineProperty(exports, 'objectAt', {
    enumerable: true,
    get: function () {
      return _objectAt.objectAt;
    }
  });
});
define('energy-city-app/helpers/optional', ['exports', 'ember-composable-helpers/helpers/optional'], function (exports, _optional) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _optional.default;
    }
  });
  Object.defineProperty(exports, 'optional', {
    enumerable: true,
    get: function () {
      return _optional.optional;
    }
  });
});
define('energy-city-app/helpers/perform', ['exports', 'ember-concurrency/helpers/perform'], function (exports, _perform) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _perform.default;
    }
  });
});
define('energy-city-app/helpers/pick', ['exports', 'ember-composable-helpers/helpers/pick'], function (exports, _pick) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _pick.default;
    }
  });
  Object.defineProperty(exports, 'pick', {
    enumerable: true,
    get: function () {
      return _pick.pick;
    }
  });
});
define('energy-city-app/helpers/pipe-action', ['exports', 'ember-composable-helpers/helpers/pipe-action'], function (exports, _pipeAction) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _pipeAction.default;
    }
  });
});
define('energy-city-app/helpers/pipe', ['exports', 'ember-composable-helpers/helpers/pipe'], function (exports, _pipe) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _pipe.default;
    }
  });
  Object.defineProperty(exports, 'pipe', {
    enumerable: true,
    get: function () {
      return _pipe.pipe;
    }
  });
});
define('energy-city-app/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('energy-city-app/helpers/previous', ['exports', 'ember-composable-helpers/helpers/previous'], function (exports, _previous) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _previous.default;
    }
  });
  Object.defineProperty(exports, 'previous', {
    enumerable: true,
    get: function () {
      return _previous.previous;
    }
  });
});
define('energy-city-app/helpers/queue', ['exports', 'ember-composable-helpers/helpers/queue'], function (exports, _queue) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _queue.default;
    }
  });
  Object.defineProperty(exports, 'queue', {
    enumerable: true,
    get: function () {
      return _queue.queue;
    }
  });
});
define('energy-city-app/helpers/range', ['exports', 'ember-composable-helpers/helpers/range'], function (exports, _range) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _range.default;
    }
  });
  Object.defineProperty(exports, 'range', {
    enumerable: true,
    get: function () {
      return _range.range;
    }
  });
});
define('energy-city-app/helpers/reduce', ['exports', 'ember-composable-helpers/helpers/reduce'], function (exports, _reduce) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _reduce.default;
    }
  });
});
define('energy-city-app/helpers/reject-by', ['exports', 'ember-composable-helpers/helpers/reject-by'], function (exports, _rejectBy) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _rejectBy.default;
    }
  });
});
define('energy-city-app/helpers/repeat', ['exports', 'ember-composable-helpers/helpers/repeat'], function (exports, _repeat) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _repeat.default;
    }
  });
  Object.defineProperty(exports, 'repeat', {
    enumerable: true,
    get: function () {
      return _repeat.repeat;
    }
  });
});
define('energy-city-app/helpers/reverse', ['exports', 'ember-composable-helpers/helpers/reverse'], function (exports, _reverse) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _reverse.default;
    }
  });
});
define('energy-city-app/helpers/shuffle', ['exports', 'ember-composable-helpers/helpers/shuffle'], function (exports, _shuffle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _shuffle.default;
    }
  });
  Object.defineProperty(exports, 'shuffle', {
    enumerable: true,
    get: function () {
      return _shuffle.shuffle;
    }
  });
});
define('energy-city-app/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define('energy-city-app/helpers/slice', ['exports', 'ember-composable-helpers/helpers/slice'], function (exports, _slice) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _slice.default;
    }
  });
});
define('energy-city-app/helpers/sort-by', ['exports', 'ember-composable-helpers/helpers/sort-by'], function (exports, _sortBy) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _sortBy.default;
    }
  });
});
define('energy-city-app/helpers/take', ['exports', 'ember-composable-helpers/helpers/take'], function (exports, _take) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _take.default;
    }
  });
});
define('energy-city-app/helpers/task', ['exports', 'ember-concurrency/helpers/task'], function (exports, _task) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _task.default;
    }
  });
});
define('energy-city-app/helpers/toggle-action', ['exports', 'ember-composable-helpers/helpers/toggle-action'], function (exports, _toggleAction) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _toggleAction.default;
    }
  });
});
define('energy-city-app/helpers/toggle', ['exports', 'ember-composable-helpers/helpers/toggle'], function (exports, _toggle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _toggle.default;
    }
  });
  Object.defineProperty(exports, 'toggle', {
    enumerable: true,
    get: function () {
      return _toggle.toggle;
    }
  });
});
define('energy-city-app/helpers/union', ['exports', 'ember-composable-helpers/helpers/union'], function (exports, _union) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _union.default;
    }
  });
});
define('energy-city-app/helpers/unix', ['exports', 'ember-moment/helpers/unix'], function (exports, _unix) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _unix.default;
    }
  });
});
define('energy-city-app/helpers/utc', ['exports', 'ember-moment/helpers/utc'], function (exports, _utc) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _utc.default;
    }
  });
  Object.defineProperty(exports, 'utc', {
    enumerable: true,
    get: function () {
      return _utc.utc;
    }
  });
});
define('energy-city-app/helpers/values', ['exports', 'ember-composable-helpers/helpers/values'], function (exports, _values) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _values.default;
    }
  });
  Object.defineProperty(exports, 'values', {
    enumerable: true,
    get: function () {
      return _values.values;
    }
  });
});
define('energy-city-app/helpers/without', ['exports', 'ember-composable-helpers/helpers/without'], function (exports, _without) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _without.default;
    }
  });
  Object.defineProperty(exports, 'without', {
    enumerable: true,
    get: function () {
      return _without.without;
    }
  });
});
define('energy-city-app/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'energy-city-app/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var name = void 0,
      version = void 0;
  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('energy-city-app/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('energy-city-app/initializers/data-adapter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('energy-city-app/initializers/ember-concurrency', ['exports', 'ember-concurrency/initializers/ember-concurrency'], function (exports, _emberConcurrency) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _emberConcurrency.default;
    }
  });
});
define('energy-city-app/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('energy-city-app/initializers/ember-simple-auth', ['exports', 'energy-city-app/config/environment', 'ember-simple-auth/configuration', 'ember-simple-auth/initializers/setup-session', 'ember-simple-auth/initializers/setup-session-service', 'ember-simple-auth/initializers/setup-session-restoration'], function (exports, _environment, _configuration, _setupSession, _setupSessionService, _setupSessionRestoration) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-simple-auth',

    initialize: function initialize(registry) {
      var config = _environment.default['ember-simple-auth'] || {};
      config.rootURL = _environment.default.rootURL || _environment.default.baseURL;
      _configuration.default.load(config);

      (0, _setupSession.default)(registry);
      (0, _setupSessionService.default)(registry);
      (0, _setupSessionRestoration.default)(registry);
    }
  };
});
define('energy-city-app/initializers/export-application-global', ['exports', 'energy-city-app/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
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

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
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

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('energy-city-app/initializers/injectStore', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('energy-city-app/initializers/load-bootstrap-config', ['exports', 'energy-city-app/config/environment', 'ember-bootstrap/config'], function (exports, _environment, _config) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() /* container, application */{
    _config.default.load(_environment.default['ember-bootstrap'] || {});
  }

  exports.default = {
    name: 'load-bootstrap-config',
    initialize: initialize
  };
});
define('energy-city-app/initializers/store', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('energy-city-app/initializers/transforms', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("energy-city-app/initializers/websockets", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() /* application */{
    // application.inject('route', 'foo', 'service:foo');
  }

  exports.default = {
    initialize: initialize
  };
});
define("energy-city-app/instance-initializers/ember-data", ["exports", "ember-data/instance-initializers/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
define('energy-city-app/instance-initializers/ember-simple-auth', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-simple-auth',

    initialize: function initialize() {}
  };
});
define('energy-city-app/mixins/process-options', ['exports', 'ember-google-maps/mixins/process-options'], function (exports, _processOptions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _processOptions.default;
    }
  });
});
define('energy-city-app/mixins/register-events', ['exports', 'ember-google-maps/mixins/register-events'], function (exports, _registerEvents) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _registerEvents.default;
    }
  });
});
define('energy-city-app/modifiers/ref', ['exports', 'ember-ref-modifier/modifiers/ref'], function (exports, _ref) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ref.default;
    }
  });
});
define('energy-city-app/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
define('energy-city-app/router', ['exports', 'energy-city-app/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {
    //this.route('geolocate', { path: '/' });
    this.route('city', { path: '/cities/:city' });
    this.route('business', { path: '/businesses/:stub' });
    this.route('pay', { path: '/businesses/:stub/pay' });
    this.route('home', { path: '/' });
    this.route('moneybutton-auth-redirect', { path: '/auth/moneybutton/redirect' });
    this.route('payments');
    this.route('logout');
    this.route('index');
    this.route('leaderboard');
    this.route('invoice', { path: '/invoice/:uid' });
    this.route('map', { path: '/map/:lat/:lng' });
    this.route('cities');
    this.route('search-city');
  });

  exports.default = Router;
});
define('energy-city-app/routes/application', ['exports', 'ember-simple-auth/mixins/application-route-mixin'], function (exports, _applicationRouteMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend(_applicationRouteMixin.default, {
    messageBus: Ember.inject.service('message-bus'),

    geolocation: Ember.inject.service(),

    socketIOService: Ember.inject.service('socket-io'),

    sessionAlreadyAuthenticated: function sessionAlreadyAuthenticated() {

      console.log('TT');
      this.transitionTo('cities');
    },

    sessionAuthenticationSucceeded: function sessionAuthenticationSucceeded() {

      try {
        console.log("TRANSITION");

        this.transitionTo('cities');
      } catch (err) {
        console.log('error catch:', err);
        //this.get('errorManager').catchError(err, 'application', 'route', 'sessionAuthenticationSucceeded - try-catch');
      }
    },

    setupController: function setupController(controller) {
      var _this = this;

      controller.set('defaultCoordinates', {
        lat: 13.737275,
        lng: 100.560145
      });

      var socket = this.get("socketIOService").socketFor('wss://anypay.city');

      controller.set('socket', socket);

      socket.on('connect', function () {
        controller.set('connected', true);
        Ember.Logger.info('socket.connected');
        socket.emit('subscribe');
        Ember.Logger.info('socket.subscribed');
      });

      socket.on('invoice.created', function (invoice) {
        console.log("INVOICE CREATED", invoice);
        _this.get('messageBus').publish('accounts_' + invoice.account_id + '_invoice_created', invoice);
      });

      socket.on('close', function () {
        controller.set('connected', false);
        Ember.Logger.info('socket.disconnected');
      });

      socket.on('close', function () {
        controller.set('connected', false);
        Ember.Logger.info('socket.disconnected');
      });

      socket.on('error', function (error) {
        Ember.Logger.info('socket.error', error.message);
      });
    }
  });
});
define('energy-city-app/routes/business', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  exports.default = Ember.Route.extend({
    session: Ember.inject.service(),
    messageBus: Ember.inject.service('message-bus'),

    getInvoice: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(uid) {
        var token, resp;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                token = this.get('session')['session']['content']['authenticated']['token'];
                _context.next = 3;
                return Ember.$.ajax({
                  method: 'GET',
                  url: 'https://api.anypayinc.com/invoices/' + uid,
                  headers: {
                    'Authorization': 'Basic ' + btoa(token + ':')
                  }
                });

              case 3:
                resp = _context.sent;
                return _context.abrupt('return', resp);

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getInvoice(_x) {
        return _ref.apply(this, arguments);
      }

      return getInvoice;
    }(),
    model: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(params) {
        var token, resp;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:

                console.log('PARAMS', params);
                token = this.get('session')['session']['content']['authenticated']['token'];
                _context2.next = 4;
                return Ember.$.ajax({
                  method: 'GET',
                  url: '/businesses/' + params.stub,
                  headers: {
                    'Authorization': 'Basic ' + btoa(token + ':')
                  }
                });

              case 4:
                resp = _context2.sent;
                return _context2.abrupt('return', Object.assign(resp, { stub: params.stub }));

              case 6:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function model(_x2) {
        return _ref2.apply(this, arguments);
      }

      return model;
    }(),
    handleInvoiceCreated: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(invoice) {
        var bsvOption, div;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                console.log('handle invoice created', invoice);
                _context3.next = 3;
                return this.getInvoice(invoice.uid);

              case 3:
                invoice = _context3.sent;

                console.log('fetched invoice', invoice);

                bsvOption = invoice.payment_options.find(function (option) {
                  return option.currency === 'BSV';
                });


                if (bsvOption) {
                  Ember.$('.pay-bottom-tray').removeClass('pay-bottom-tray--is-hidden');
                  Ember.$('.pay-bottom-tray').addClass('pay-bottom-tray--is-shown');

                  div = document.getElementById('my-money-button');


                  this.controller.set('bsvAmount', bsvOption.denomination_amount);

                  window.moneyButton.render(div, {
                    outputs: [{
                      to: bsvOption.address,
                      amount: bsvOption.amount,
                      currency: 'BSV'
                    }, {
                      to: 'steven@simply.cash',
                      amount: 0.0002,
                      currency: 'BSV'
                    }]
                  });
                }

              case 7:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function handleInvoiceCreated(_x3) {
        return _ref3.apply(this, arguments);
      }

      return handleInvoiceCreated;
    }(),
    deactivate: function deactivate() {
      console.log('destroy business route');
      //this.get('messageBus').unsubscribe(`accounts_${this.get('business').id}_invoice_created`, this, this.handleInvoiceCreated);
      Ember.$('.pay-bottom-tray').addClass('pay-bottom-tray--is-hidden');
      Ember.$('.pay-bottom-tray').removeClass('pay-bottom-tray--is-shown');
    },
    setupController: function setupController(controller, model) {
      console.log('model', model);
      controller.set('business', model);
      this.get('messageBus').subscribe('accounts_' + model.id + '_invoice_created', this, this.handleInvoiceCreated);
    }
  });
});
define('energy-city-app/routes/cities', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({

    cities: Ember.inject.service('cities'),

    socketIOService: Ember.inject.service('socket-io'),

    model: function model(params) {

      return this.get('cities').listCities();
    },
    setupController: function setupController(controller, model) {

      Ember.Logger.info(model);
      controller.set('cities', model);

      var socket = this.get("socketIOService").socketFor('wss://anypay.city');
      controller.set('socket', socket);
    }
  });
});
define('energy-city-app/routes/city', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  exports.default = Ember.Route.extend({

    //geolocation: service(),

    cities: Ember.inject.service(),
    session: Ember.inject.service(),

    socketIOService: Ember.inject.service('socket-io'),

    model: function model(params) {

      return this.get('cities').getCity(params.city);
    },
    setupController: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(controller, model) {
        var locations, socket;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                /*
                 let location = await this.get("geolocation").getLocation();
                 console.log(model);
                 controller.set('city', model);
                controller.set('location', location);
                 console.log('location', location);
                */

                Ember.Logger.info('city', { city: model });

                if (!(model.city.latitude && model.city.longitude)) {
                  _context.next = 4;
                  break;
                }

                this.transitionTo('map', model.city.latitude, model.city.longitude);

                return _context.abrupt('return');

              case 4:
                locations = model.accounts.map(function (account) {

                  var assign = {};

                  var bch_tipjar = account.tipjars.find(function (jar) {
                    return jar.currency === 'BCH';
                  });

                  if (bch_tipjar) {

                    assign['bch_tipjar'] = bch_tipjar;
                  }

                  var bsv_tipjar = account.tipjars.find(function (jar) {
                    return jar.currency === 'BSV';
                  });

                  if (bsv_tipjar) {

                    assign['bsv_tipjar'] = bsv_tipjar;
                  }

                  var dash_tipjar = account.tipjars.find(function (jar) {
                    return jar.currency === 'DASH';
                  });

                  if (dash_tipjar) {

                    assign['dash_tipjar'] = dash_tipjar;
                  }

                  return Object.assign(account, assign);
                });


                console.log(locations);

                controller.set('locations', locations);

                socket = this.get("socketIOService").socketFor('wss://anypay.city');

                controller.set('socket', socket);

                socket.on('invoice.created', controller.handleInvoiceCreated, controller);
                socket.on('invoice.paid', controller.handleInvoicePaid, controller);

                socket.on('close', function () {
                  controller.set('connected', false);
                  Ember.Logger.info('socket.disconnected');
                });

                socket.on('error', function (error) {
                  Ember.Logger.info('socket.error', error.message);
                });

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function setupController(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return setupController;
    }()
  });
});
define('energy-city-app/routes/geolocate', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  exports.default = Ember.Route.extend({

    geolocation: Ember.inject.service(),

    setupController: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(controller) {
        var location, city, cities;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:

                controller.set('geolocating', true);
                controller.set('location', null);
                controller.set('geolocationError', null);

                _context.prev = 3;
                _context.next = 6;
                return this.get('geolocation').geolocate();

              case 6:
                location = _context.sent;


                controller.set('location', location);
                controller.set('geolocating', false);

                if (!(location.address.stateCode === 'NH')) {
                  _context.next = 18;
                  break;
                }

                console.log("YES NH");
                city = location.address.city;
                _context.next = 14;
                return this.get('cities');

              case 14:
                cities = _context.sent;


                controller.transitionToRoute('city', city.toLowerCase() + '-nh');

                _context.next = 19;
                break;

              case 18:

                controller.transitionToRoute('cities');

              case 19:

                console.log("NOT NH");

                _context.next = 25;
                break;

              case 22:
                _context.prev = 22;
                _context.t0 = _context['catch'](3);


                controller.set('geolocationError', _context.t0);

              case 25:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 22]]);
      }));

      function setupController(_x) {
        return _ref.apply(this, arguments);
      }

      return setupController;
    }()
  });
});
define('energy-city-app/routes/home', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  exports.default = Ember.Route.extend({
    setupController: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this = this;

        var permission;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return window.navigator.permissions.query({ name: 'geolocation' });

              case 2:
                permission = _context.sent;


                if (permission.state === 'granted') {

                  $('#loader-wrapper').show();
                  window.navigator.geolocation.getCurrentPosition(function (position) {

                    $('#loader-wrapper').hide();
                    console.log('geolocation.currentposition', position);

                    _this.transitionTo('map', position.coords.latitude, position.coords.longitude);
                  }, function (error) {
                    $('#loader-wrapper').hide();
                    console.log('geolocation.error', error);

                    _this.transitionToRoute('search-city');
                  }, {
                    enableHighAccuracy: false
                  });
                }

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function setupController() {
        return _ref.apply(this, arguments);
      }

      return setupController;
    }()
  });
});
define('energy-city-app/routes/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    setupController: function setupController() {
      this.transitionTo('cities');
    }
  });
});
define('energy-city-app/routes/invoice', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    model: function model(params) {
      return { uid: params.uid };
    },
    setupController: function setupController(controller, model) {
      controller.set('uid', model.uid);
    }
  });
});
define('energy-city-app/routes/leaderboard', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({

    leaderboard: Ember.inject.service(),

    model: function model() {
      return this.get('leaderboard').getLeaderboard();
    },
    setupController: function setupController(controller, model) {

      controller.set('leaderboard', model.map(function (i) {
        return i.account;
      }).filter(function (a) {
        return !!a.business_name;
      }).filter(function (a) {
        return a.id !== 1177;
      }));
    }
  });
});
define('energy-city-app/routes/logout', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    session: Ember.inject.service('session'),

    setupController: function setupController() {
      var _this = this;

      this.get('session').invalidate().then(function () {
        _this.transitionTo('login');
      });
    }
  });
});
define('energy-city-app/routes/map', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            step("next", value);
                        }, function (err) {
                            step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    var getNearbyAccounts = function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(lat, lng) {
            var _ref2, accounts;

            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            Ember.$('#loader-wrapper').show();

                            _context.next = 3;
                            return Ember.$.getJSON('https://api.anypayinc.com/search/accounts/near/' + lat + '/' + lng + '?limit=100');

                        case 3:
                            _ref2 = _context.sent;
                            accounts = _ref2.accounts;

                            Ember.$('#loader-wrapper').hide();

                            return _context.abrupt('return', accounts);

                        case 7:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        return function getNearbyAccounts(_x, _x2) {
            return _ref.apply(this, arguments);
        };
    }();

    var controller;

    exports.default = Ember.Route.extend({

        addressSearch: Ember.inject.service('address-search'),

        actions: {
            didTransition: function didTransition() {
                console.log('DID TRANSITION');

                /*
                Ember.$('.ember-google-map').css({
                  position: 'fixed',
                  top: '50px',
                  bottom: '0px',
                  left: '0px',
                  right: '0px'
                });
                */
            }
        },

        model: function model(params) {
            var model = {};

            model['lat'] = parseFloat(params['lat']);
            model['lng'] = parseFloat(params['lng']);

            console.log("PARSE", parseFloat(params['lng']));

            return model;
        },
        setupController: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(ctrl, model) {
                var addressSearchResults, lat, lng, _ref4, accounts, frequencyIcons;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:

                                console.log('MODEL', model);

                                _context3.next = 3;
                                return this.get('addressSearch').getCoordinates('keene, new hampshire');

                            case 3:
                                addressSearchResults = _context3.sent;


                                console.log('address search results', addressSearchResults);

                                model['lat'] = parseFloat(model['lat']);
                                model['lng'] = parseFloat(model['lng']);

                                /*model.lat = addressSearchResults.lat
                                model.lng = addressSearchResults.lng
                                */

                                controller = ctrl;

                                lat = model.lat || 13.737275;
                                lng = model.lng || 100.560145;
                                _context3.next = 12;
                                return Ember.$.getJSON('https://api.anypayinc.com/search/accounts/near/' + lat + '/' + lng + '?limit=100');

                            case 12:
                                _ref4 = _context3.sent;
                                accounts = _ref4.accounts;


                                console.log('search result', accounts);

                                frequencyIcons = {

                                    'one-week': '/google-map-marker-512-green.png',

                                    'one-month': '/google-map-marker-yellow.png',

                                    'three-months': '/google-map-marker-512.png',

                                    'inactive': '/google-map-marker-512-grey.png',

                                    'bitcoincom': '/bitcoincomlogo.png'

                                };


                                controller.set('icons', frequencyIcons);

                                controller.set('mapStyles', [{
                                    "featureType": "all",
                                    "elementType": "labels",
                                    "stylers": [{
                                        "visibility": "on"
                                    }]
                                }, {
                                    "featureType": "all",
                                    "elementType": "labels.text.fill",
                                    "stylers": [{
                                        "saturation": 36
                                    }, {
                                        "color": "#000000"
                                    }, {
                                        "lightness": 40
                                    }]
                                }, {
                                    "featureType": "all",
                                    "elementType": "labels.text.stroke",
                                    "stylers": [{
                                        "visibility": "on"
                                    }, {
                                        "color": "#000000"
                                    }, {
                                        "lightness": 16
                                    }]
                                }, {
                                    "featureType": "all",
                                    "elementType": "labels.icon",
                                    "stylers": [{
                                        "visibility": "off"
                                    }]
                                }, {
                                    "featureType": "administrative",
                                    "elementType": "geometry.fill",
                                    "stylers": [{
                                        "color": "#000000"
                                    }, {
                                        "lightness": 20
                                    }]
                                }, {
                                    "featureType": "administrative",
                                    "elementType": "geometry.stroke",
                                    "stylers": [{
                                        "color": "#000000"
                                    }, {
                                        "lightness": 17
                                    }, {
                                        "weight": 1.2
                                    }]
                                }, {
                                    "featureType": "administrative.country",
                                    "elementType": "labels.text.fill",
                                    "stylers": [{
                                        "color": "#e5c163"
                                    }]
                                }, {
                                    "featureType": "administrative.locality",
                                    "elementType": "labels.text.fill",
                                    "stylers": [{
                                        "color": "#c4c4c4"
                                    }]
                                }, {
                                    "featureType": "administrative.neighborhood",
                                    "elementType": "labels.text.fill",
                                    "stylers": [{
                                        "color": "#e5c163"
                                    }]
                                }, {
                                    "featureType": "landscape",
                                    "elementType": "geometry",
                                    "stylers": [{
                                        "color": "#000000"
                                    }, {
                                        "lightness": 20
                                    }]
                                }, {
                                    "featureType": "poi",
                                    "elementType": "geometry",
                                    "stylers": [{
                                        "color": "#000000"
                                    }, {
                                        "lightness": 21
                                    }, {
                                        "visibility": "on"
                                    }]
                                }, {
                                    "featureType": "poi.business",
                                    "elementType": "geometry",
                                    "stylers": [{
                                        "visibility": "on"
                                    }]
                                }, {
                                    "featureType": "road.highway",
                                    "elementType": "geometry.fill",
                                    "stylers": [{
                                        "color": "#e5c163"
                                    }, {
                                        "lightness": "0"
                                    }]
                                }, {
                                    "featureType": "road.highway",
                                    "elementType": "geometry.stroke",
                                    "stylers": [{
                                        "visibility": "off"
                                    }]
                                }, {
                                    "featureType": "road.highway",
                                    "elementType": "labels.text.fill",
                                    "stylers": [{
                                        "color": "#ffffff"
                                    }]
                                }, {
                                    "featureType": "road.highway",
                                    "elementType": "labels.text.stroke",
                                    "stylers": [{
                                        "color": "#e5c163"
                                    }]
                                }, {
                                    "featureType": "road.arterial",
                                    "elementType": "geometry",
                                    "stylers": [{
                                        "color": "#000000"
                                    }, {
                                        "lightness": 18
                                    }]
                                }, {
                                    "featureType": "road.arterial",
                                    "elementType": "geometry.fill",
                                    "stylers": [{
                                        "color": "#575757"
                                    }]
                                }, {
                                    "featureType": "road.arterial",
                                    "elementType": "labels.text.fill",
                                    "stylers": [{
                                        "color": "#ffffff"
                                    }]
                                }, {
                                    "featureType": "road.arterial",
                                    "elementType": "labels.text.stroke",
                                    "stylers": [{
                                        "color": "#2c2c2c"
                                    }]
                                }, {
                                    "featureType": "road.local",
                                    "elementType": "geometry",
                                    "stylers": [{
                                        "color": "#000000"
                                    }, {
                                        "lightness": 16
                                    }]
                                }, {
                                    "featureType": "road.local",
                                    "elementType": "labels.text.fill",
                                    "stylers": [{
                                        "color": "#999999"
                                    }]
                                }, {
                                    "featureType": "transit",
                                    "elementType": "geometry",
                                    "stylers": [{
                                        "color": "#000000"
                                    }, {
                                        "lightness": 19
                                    }]
                                }, {
                                    "featureType": "water",
                                    "elementType": "geometry",
                                    "stylers": [{
                                        "color": "#0077C0"
                                    }, {
                                        "lightness": 60

                                    }]
                                }]);

                                controller.set('merchants', accounts.map(function (merchant) {

                                    if (!merchant.image_url) {
                                        merchant.image_url = 'https://media.bitcoinfiles.org/87225dad1311748ab90cd37cf4c2b2dbd1ef3576bbf9f42cb97292a9155e3afb';
                                    }

                                    return merchant;
                                }));
                                console.log('SETUP CONTROLLER');
                                setTimeout(function () {

                                    //Ember.$('.map').css('position', 'fixed');
                                }, 1000);

                                Ember.run.scheduleOnce('afterRender', this, function () {
                                    var _this = this;

                                    console.log('AFTER RENDER');

                                    var map = new window.google.maps.Map(document.getElementById("map"), {
                                        center: { lat: model.lat, lng: model.lng },
                                        fullscreenControl: false,
                                        mapTypeControl: false,
                                        streetViewControl: false,
                                        zoom: 15
                                    });

                                    var centerChanged = function () {

                                        var lastChangedAt;

                                        return function () {};
                                    }();

                                    map.addListener('center_changed', function () {

                                        var center = map.getCenter();

                                        setTimeout(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                                            var newCenter, _accounts;

                                            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                                while (1) {
                                                    switch (_context2.prev = _context2.next) {
                                                        case 0:
                                                            newCenter = map.getCenter();

                                                            if (!(center.lat() === newCenter.lat() && center.lng() === newCenter.lng())) {
                                                                _context2.next = 9;
                                                                break;
                                                            }

                                                            console.log('definitive center change', { lat: newCenter.lat(), lng: newCenter.lng() });
                                                            console.log('latlng', newCenter.toJSON());

                                                            _context2.next = 6;
                                                            return getNearbyAccounts(newCenter.lat(), newCenter.lng());

                                                        case 6:
                                                            _accounts = _context2.sent;


                                                            console.log('accounts', _accounts);

                                                            controller.set('merchants', _accounts.map(function (merchant) {

                                                                if (!merchant.image_url) {
                                                                    merchant.image_url = 'https://media.bitcoinfiles.org/87225dad1311748ab90cd37cf4c2b2dbd1ef3576bbf9f42cb97292a9155e3afb';
                                                                }

                                                                return merchant;
                                                            }));

                                                        case 9:
                                                        case 'end':
                                                            return _context2.stop();
                                                    }
                                                }
                                            }, _callee2, _this);
                                        })), 100);
                                    });

                                    controller.set('googlemap', map);
                                    var appCtrl = this.controllerFor('application');
                                    appCtrl.set('googlemap', map);
                                    console.log('set google map');

                                    loadMerchants(map);

                                    /*Ember.$('.map').css({
                                      position: 'fixed',
                                      top: '50px',
                                      bottom: '0px',
                                      left: '0px',
                                      right: '0px'
                                    });
                                    */
                                });

                            case 22:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function setupController(_x3, _x4) {
                return _ref3.apply(this, arguments);
            }

            return setupController;
        }()
    });


    function loadMerchants(map) {

        var frequencyIcons = {

            'one-week': '/google-map-marker-512-green.png',

            'one-month': '/google-map-marker-yellow.png',

            'three-months': '/google-map-marker-512.png',

            'inactive': '/google-map-marker-512-grey.png',

            'bitcoincom': '/bitcoincomlogo.png'

        };

        var activeMerchants;

        Ember.$.ajax({

            method: 'GET',

            url: 'https://api.anypay.global/active-merchants'

        }).then(function (resp) {
            console.log("ACTIVE MERCHANTS", resp);

            activeMerchants = resp;

            return Ember.$.ajax({

                method: 'GET',

                url: 'https://api.anypay.global/active-merchant-coins'

            });
        }).then(function (resp) {

            console.log("RESP", resp);

            var coinsByMerchant = resp.reduce(function (merchantCoins, merchantCoin) {

                if (!merchantCoins[merchantCoin.id]) {

                    merchantCoins[merchantCoin.id] = [];
                }

                merchantCoins[merchantCoin.id].push(merchantCoin.currency);

                return merchantCoins;
            });

            console.log("COINS", resp);

            var oneWeekMerchants = activeMerchants.oneWeek.reduce(function (sum, i) {

                sum[i.id] = true;

                return sum;
            }, {});

            console.log('one week', oneWeekMerchants);

            var oneMonthMerchants = activeMerchants.oneMonth.reduce(function (map, i) {

                map[i.id] = true;

                return map;
            }, {});

            var threeMonthsMerchants = activeMerchants.threeMonths.reduce(function (map, i) {

                map[i.id] = true;

                return map;
            }, {});

            var inactiveMerchants = activeMerchants.merchants.reduce(function (map, i) {

                map[i.id] = true;

                return map;
            }, {});

            var source = document.getElementById("merchant-popup-template").innerHTML;
            var template = Handlebars.compile(source);

            console.log('template', template);

            var currentlyOpenInfowindow;

            activeMerchants.merchants.forEach(function (merchant) {

                var markerOpts = {

                    position: {

                        lat: parseFloat(merchant.latitude),

                        lng: parseFloat(merchant.longitude)

                    },

                    map: map

                };

                if (inactiveMerchants[merchant.id]) {

                    markerOpts.icon = frequencyIcons['inactive'];
                }

                if (threeMonthsMerchants[merchant.id]) {

                    markerOpts.icon = frequencyIcons['three-months'];
                }

                if (oneMonthMerchants[merchant.id]) {

                    markerOpts.icon = frequencyIcons['one-month'];
                }

                if (oneWeekMerchants[merchant.id]) {

                    markerOpts.icon = frequencyIcons['one-week'];
                }

                if (!markerOpts.icon) {

                    return;
                }

                var marker = new google.maps.Marker(markerOpts);

                var content = template({
                    business_name: merchant.business_name,
                    physical_address: merchant.physical_address,
                    coins_accepted: ['BCH', 'BTC', 'DASH'].join(', ')
                });

                merchant.coins_accepted = coinsByMerchant[merchant.id] || [];

                if (!merchant.image_url) {
                    merchant.image_url = 'https://media.bitcoinfiles.org/87225dad1311748ab90cd37cf4c2b2dbd1ef3576bbf9f42cb97292a9155e3afb';
                }

                var infowindow = new google.maps.InfoWindow({
                    maxWidth: 500,
                    height: 300,
                    content: '\n          <h1>' + merchant.business_name + '</h1>\n          <h2>' + merchant.physical_address + '</h2>\n          <div style=\'position:relative\'>\n            <img src=\'' + merchant.image_url + '\' style=\'width: 100%; height: 100%\'>\n            <h3>Coins accepted: ' + merchant.coins_accepted + '</h3>\n          </div>\n        '
                });

                marker.addListener('click', function () {

                    controller.send('merchantDetailsClicked', merchant);

                    /*
                    if (currentlyOpenInfowindow) {
                      currentlyOpenInfowindow.close();
                    }
                     infowindow.open(map, marker);
                     currentlyOpenInfowindow = infowindow;
                    */
                });
            });
        });
    }
});
define('energy-city-app/routes/moneybutton-auth-redirect', ['exports', 'ember-simple-auth/mixins/unauthenticated-route-mixin'], function (exports, _unauthenticatedRouteMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  exports.default = Ember.Route.extend(_unauthenticatedRouteMixin.default, {
    session: Ember.inject.service(),

    model: function model(params) {
      return params;
    },


    routeIfAlreadyAuthenticated: 'payments',
    routeAfterAuthenticated: 'payments',

    setupController: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(controller, model) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:

                controller.set('signing_in', true);

                _context.prev = 1;
                _context.next = 4;
                return this.get('session').authenticate('authenticator:token', model.code, model.state);

              case 4:
                _context.next = 9;
                break;

              case 6:
                _context.prev = 6;
                _context.t0 = _context['catch'](1);


                console.log('error', _context.t0);

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 6]]);
      }));

      function setupController(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return setupController;
    }()
  });
});
define('energy-city-app/routes/pay', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  exports.default = Ember.Route.extend({
    session: Ember.inject.service(),
    messageBus: Ember.inject.service('message-bus'),

    getInvoice: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(uid) {
        var token, resp;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                token = this.get('session')['session']['content']['authenticated']['token'];
                _context.next = 3;
                return Ember.$.ajax({
                  method: 'GET',
                  url: 'https://api.anypayinc.com/invoices/' + uid,
                  headers: {
                    'Authorization': 'Basic ' + btoa(token + ':')
                  }
                });

              case 3:
                resp = _context.sent;
                return _context.abrupt('return', resp);

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getInvoice(_x) {
        return _ref.apply(this, arguments);
      }

      return getInvoice;
    }(),
    model: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(params) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt('return', params);

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function model(_x2) {
        return _ref2.apply(this, arguments);
      }

      return model;
    }(),
    handleInvoiceCreated: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(invoice) {
        var bsvOption, div;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                console.log('handle invoice created', invoice);
                _context3.next = 3;
                return this.getInvoice(invoice.uid);

              case 3:
                invoice = _context3.sent;

                console.log('fetched invoice', invoice);

                bsvOption = invoice.payment_options.find(function (option) {
                  return option.currency === 'BSV';
                });


                if (bsvOption) {
                  Ember.$('.pay-bottom-tray').removeClass('pay-bottom-tray--is-hidden');
                  Ember.$('.pay-bottom-tray').addClass('pay-bottom-tray--is-shown');

                  div = document.getElementById('my-money-button');


                  this.controller.set('bsvAmount', bsvOption.denomination_amount);

                  window.moneyButton.render(div, {
                    outputs: [{
                      to: bsvOption.address,
                      amount: bsvOption.amount,
                      currency: 'BSV'
                    }, {
                      to: 'steven@simply.cash',
                      amount: 0.0002,
                      currency: 'BSV'
                    }]
                  });
                }

              case 7:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function handleInvoiceCreated(_x3) {
        return _ref3.apply(this, arguments);
      }

      return handleInvoiceCreated;
    }(),
    deactivate: function deactivate() {
      console.log('destroy business route');
      //this.get('messageBus').unsubscribe(`accounts_${this.get('business').id}_invoice_created`, this, this.handleInvoiceCreated);
      Ember.$('.pay-bottom-tray').addClass('pay-bottom-tray--is-hidden');
      Ember.$('.pay-bottom-tray').removeClass('pay-bottom-tray--is-shown');
    },
    setupController: function setupController(controller, model) {
      window.location = 'https://app.anypayinc.com/pay/' + model.stub;
      controller.set('business', model);
      this.get('messageBus').subscribe('accounts_' + model.id + '_invoice_created', this, this.handleInvoiceCreated);
    }
  });
});
define('energy-city-app/routes/payments', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin'], function (exports, _authenticatedRouteMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  exports.default = Ember.Route.extend(_authenticatedRouteMixin.default, {
    session: Ember.inject.service(),

    model: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var token, resp;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                token = this.get('session')['session']['content']['authenticated']['token'];
                _context.next = 3;
                return Ember.$.ajax({
                  method: 'GET',
                  url: '/payments',
                  headers: {
                    'Authorization': 'Basic ' + btoa(token + ':')
                  }
                });

              case 3:
                resp = _context.sent;
                return _context.abrupt('return', resp.invoices);

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function model() {
        return _ref.apply(this, arguments);
      }

      return model;
    }(),
    setupController: function setupController(controller, model) {

      console.log(model);

      controller.set('payments', model);
    }
  });
});
define('energy-city-app/routes/search-city', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('energy-city-app/services/address-search', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({
    getCoordinates: function getCoordinates(query) {

      var apiKey = 'AIzaSyBzFUoLc2p9xXpizIJV8CJOo3buh8RZKKA';

      var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + query.replaceAll(' ', '+') + '&key=' + apiKey;

      console.log('search url', url);

      return $.ajax({
        url: url
      }).then(function (resp) {
        console.log(resp);

        if (resp.results.length > 0) {

          var location = resp.results[0].geometry.location;

          console.log('getcoordinates', location);

          return location;
        } else {

          throw new Error('location not found');
        }
      });
    }
  });
});
define('energy-city-app/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define('energy-city-app/services/cities', ['exports', 'ember-get-config'], function (exports, _emberGetConfig) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  exports.default = Ember.Service.extend({

    cities: null,
    geolocation: Ember.inject.service(),

    listCities: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this = this;

        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.get('cities')) {
                  _context.next = 5;
                  break;
                }

                Ember.$.ajax({
                  method: "GET",
                  url: _emberGetConfig.default.apiEndpoint + '/api/cities'
                }).then(function (result) {

                  _this.set('cities', result.cities);
                });

                return _context.abrupt('return', this.get('cities'));

              case 5:
                _context.next = 7;
                return Ember.$.ajax({
                  method: "GET",
                  url: _emberGetConfig.default.apiEndpoint + '/api/cities'
                });

              case 7:
                result = _context.sent;


                this.set('cities', result.cities);

                return _context.abrupt('return', result.cities);

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function listCities() {
        return _ref.apply(this, arguments);
      }

      return listCities;
    }(),
    getCity: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(city_tag) {
        var city;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.get('cities')) {
                  _context2.next = 3;
                  break;
                }

                _context2.next = 3;
                return this.listCities();

              case 3:
                city = this.get('cities').find(function (city) {

                  return city.city_tag === city_tag;
                });

                /*let accounts =  this.orderByDistance(location.coords, city.accounts);
                 city.accounts = accounts;*/

                // order by distance from you, add distance

                return _context2.abrupt('return', city);

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getCity(_x) {
        return _ref2.apply(this, arguments);
      }

      return getCity;
    }(),
    orderByDistance: function orderByDistance(coordinates, businesses) {
      var _this2 = this;

      console.log('businesses', businesses);

      return businesses.map(function (business) {

        return Object.assign(business, {
          distance: _this2.get('geolocation').getDistance(coordinates, {
            latitude: business.latitude,
            longitude: business.longitude
          })
        });
      }).sort(function (a, b) {
        return a.distance - b.distance;
      });
    }
  });
});
define('energy-city-app/services/city-service', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({});
});
define('energy-city-app/services/cookies', ['exports', 'ember-cookies/services/cookies'], function (exports, _cookies) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _cookies.default;
});
define('energy-city-app/services/geolocation', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            step("next", value);
                        }, function (err) {
                            step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    function toRad(value) {
        return value * Math.PI / 180;
    }

    exports.default = Ember.Service.extend({

        location: null,

        geolocate: function geolocate(options) {
            var _this = this;

            return new Ember.RSVP.Promise(function (resolve, reject) {

                geolocator.config({
                    language: "en",
                    google: {
                        version: "3",
                        key: "AIzaSyDHprMrEY-JrNMw4q55ZhoG4HXspKeG8V8"
                    }
                });

                options = Object.assign({
                    enableHighAccuracy: false,
                    timeout: 5000,
                    maximumWait: 10000, // max wait time for desired accuracy
                    maximumAge: 0, // disable cache
                    desiredAccuracy: 30, // meters
                    fallbackToIP: true, // fallback to IP if Geolocation fails or rejected
                    addressLookup: true, // requires Google API key if true
                    timezone: true // requires Google API key if true
                }, options);

                _this.set('geolocating', true);

                window.geolocator.locate(options, function (err, location) {
                    _this.set('location', location);
                    _this.set('geolocating', false);

                    if (err) {
                        console.log(err);
                        return reject(err);
                    }
                    console.log(location);
                    resolve(location);
                });
            });
        },
        getDistance: function getDistance(from, to) {
            var fromLat = from.latitude;
            var fromLon = from.longitude;
            var toLat = to.latitude;
            var toLon = to.longitude;

            var earthRadius = 6378137;

            var distance = Math.acos(normalizeACosArg(Math.sin(toRad(toLat)) * Math.sin(toRad(fromLat)) + Math.cos(toRad(toLat)) * Math.cos(toRad(fromLat)) * Math.cos(toRad(fromLon) - toRad(toLon)))) * earthRadius;

            var accuracy = 1;

            return Math.round(distance / accuracy) * accuracy;
        },
        getLocation: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var location;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                location = this.get('location');

                                if (location) {
                                    _context.next = 5;
                                    break;
                                }

                                _context.next = 4;
                                return this.geolocate();

                            case 4:
                                location = _context.sent;

                            case 5:
                                return _context.abrupt('return', location);

                            case 6:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getLocation() {
                return _ref.apply(this, arguments);
            }

            return getLocation;
        }()
    });


    function normalizeACosArg(val) {
        if (val > 1) {
            return 1;
        }
        if (val < -1) {
            return -1;
        }
        return val;
    };
});
define('energy-city-app/services/google-maps-api', ['exports', 'ember-google-maps/services/google-maps-api'], function (exports, _googleMapsApi) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _googleMapsApi.default;
    }
  });
});
define('energy-city-app/services/leaderboard', ['exports', 'ember-get-config'], function (exports, _emberGetConfig) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  exports.default = Ember.Service.extend({

    leaderboard: null,

    getLeaderboard: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var resp;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (this.get('leaderboard')) {
                  _context.next = 6;
                  break;
                }

                _context.next = 3;
                return Ember.$.ajax({
                  method: "GET",
                  url: _emberGetConfig.default.anypayAPI + '/leaderboard'
                });

              case 3:
                resp = _context.sent;


                this.set('leaderboard', resp.leaderboard);

                return _context.abrupt('return', this.get('leaderboard'));

              case 6:
                return _context.abrupt('return', this.get('leaderboard'));

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getLeaderboard() {
        return _ref.apply(this, arguments);
      }

      return getLeaderboard;
    }()
  });
});
define('energy-city-app/services/message-bus', ['exports', 'ember-message-bus/services/message-bus'], function (exports, _messageBus) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _messageBus.default;
    }
  });
});
define('energy-city-app/services/moment', ['exports', 'ember-moment/services/moment', 'energy-city-app/config/environment'], function (exports, _moment, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get;
  exports.default = _moment.default.extend({
    defaultFormat: get(_environment.default, 'moment.outputFormat')
  });
});
define('energy-city-app/services/session', ['exports', 'ember-simple-auth/services/session'], function (exports, _session) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _session.default;
});
define('energy-city-app/services/socket-io', ['exports', 'ember-websockets/services/socket-io'], function (exports, _socketIo) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _socketIo.default;
    }
  });
});
define('energy-city-app/services/websockets', ['exports', 'ember-websockets/services/websockets'], function (exports, _websockets) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _websockets.default;
    }
  });
});
define('energy-city-app/session-stores/application', ['exports', 'ember-simple-auth/session-stores/adaptive'], function (exports, _adaptive) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _adaptive.default.extend();
});
define("energy-city-app/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "2QbHTxpV", "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[2,\"<nav class=\\\"navbar navbar-light\\\" style=\\\"background-color: #039454;\\\">\"],[0,\"\\n\"],[6,\"nav\"],[9,\"class\",\"navbar navbar-dark \"],[9,\"style\",\"background-color: black;\"],[7],[0,\"\\n\\n\\n  \"],[6,\"form\"],[9,\"class\",\"search-form\"],[3,\"action\",[[19,0,[]],\"searchLocation\"],[[\"on\"],[\"submit\"]]],[7],[0,\"\\n    \"],[1,[25,\"input\",null,[[\"class\",\"type\",\"value\",\"placeholder\"],[\"search-city\",\"search\",[19,0,[\"search\"]],\"search city or address\"]]],false],[0,\"\\n  \"],[8],[0,\"\\n\\n\\n\"],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"container bodycontainer\"],[7],[0,\"\\n\\n\"],[6,\"div\"],[9,\"id\",\"loader-wrapper\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"id\",\"loader\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"style\",\"display:none\"],[9,\"class\",\"loading\"],[7],[8],[0,\"\\n  \"],[1,[18,\"outlet\"],false],[0,\"\\n\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "energy-city-app/templates/application.hbs" } });
});
define("energy-city-app/templates/business", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Vh5HoCWL", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"outlet\"],false],[0,\"\\n\\n\"],[6,\"h1\"],[7],[1,[20,[\"business\",\"business_name\"]],false],[8],[0,\"\\n\\n\"],[4,\"if\",[[19,0,[\"business\",\"image_url\"]]],null,{\"statements\":[[0,\"  \"],[6,\"section\"],[9,\"class\",\"business-image\"],[7],[0,\"\\n    \"],[6,\"img\"],[10,\"src\",[26,[[20,[\"business\",\"image_url\"]]]]],[7],[8],[0,\"\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[6,\"section\"],[7],[0,\"\\n  \"],[4,\"link-to\",[\"pay\",[19,0,[\"business\"]]],null,{\"statements\":[[6,\"button\"],[9,\"class\",\"link-to-pay-now\"],[7],[0,\"Pay Now\"],[8]],\"parameters\":[]},null],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"pay-bottom-tray pay-bottom-tray--is-hidden\"],[7],[0,\"\\n\\n  \"],[6,\"p\"],[7],[0,\"Swipe to pay $\"],[1,[18,\"bsvAmount\"],false],[8],[0,\"\\n  \"],[1,[18,\"money-button\"],false],[0,\"\\n  \"],[6,\"div\"],[9,\"id\",\"my-money-button\"],[7],[8],[0,\"\\n\\n\"],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"cd-panel cd-panel--from-right js-cd-panel-main\"],[7],[0,\"\\n   \"],[6,\"header\"],[9,\"class\",\"cd-panel__header\"],[7],[0,\"\\n      \"],[6,\"h1\"],[7],[0,\"Title Goes Here\"],[8],[0,\"\\n      \"],[6,\"a\"],[9,\"href\",\"#0\"],[9,\"class\",\"cd-panel__close js-cd-close\"],[7],[0,\"Close\"],[8],[0,\"\\n   \"],[8],[0,\"\\n\\n   \"],[6,\"div\"],[9,\"class\",\"cd-panel__container\"],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"cd-panel__content\"],[7],[0,\"\\n         \"],[2,\" your side panel content here \"],[0,\"\\n      \"],[8],[0,\" \"],[2,\" cd-panel__content \"],[0,\"\\n   \"],[8],[0,\" \"],[2,\" cd-panel__container \"],[0,\"\\n\"],[8],[0,\" \"],[2,\" cd-panel \"],[0,\"\\n\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "energy-city-app/templates/business.hbs" } });
});
define("energy-city-app/templates/cities", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "hynj9YAG", "block": "{\"symbols\":[\"city\"],\"statements\":[[1,[18,\"outlet\"],false],[0,\"\\n\\n\"],[6,\"table\"],[9,\"class\",\"table table-striped\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"cities\"]]],null,{\"statements\":[[0,\"    \"],[6,\"tr\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"cityClicked\",[19,1,[]]],null],null],[7],[0,\"\\n      \"],[6,\"td\"],[7],[0,\"\\n        \"],[1,[19,1,[\"name\"]],false],[0,\"\\n      \"],[8],[0,\"\\n\\n      \"],[6,\"td\"],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"accounts\"]]],null,{\"statements\":[[0,\"          \"],[6,\"span\"],[9,\"class\",\"badge badge-success\"],[7],[1,[19,1,[\"accounts\",\"length\"]],false],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"      \"],[8],[0,\"\\n\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[8],[0,\"\\n\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "energy-city-app/templates/cities.hbs" } });
});
define("energy-city-app/templates/city", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "aKgjSsHh", "block": "{\"symbols\":[\"location\"],\"statements\":[[1,[18,\"outlet\"],false],[0,\"\\n\\n\\n\"],[6,\"button\"],[9,\"class\",\"btn btn-large float-left\"],[7],[0,\"\\n  \"],[4,\"link-to\",[\"cities\"],null,{\"statements\":[[0,\"all cities\"]],\"parameters\":[]},null],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[6,\"h2\"],[9,\"class\",\"banner\"],[7],[1,[20,[\"city\",\"name\"]],false],[8],[0,\"\\n\\n  \"],[6,\"ul\"],[7],[0,\"\\n\\n\"],[4,\"each\",[[19,0,[\"locations\"]]],null,{\"statements\":[[0,\"    \"],[6,\"li\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"businessClicked\",[19,1,[]]],null],null],[7],[0,\"\\n\"],[4,\"if\",[[19,0,[\"session\",\"isAuthenticated\"]]],null,{\"statements\":[[0,\"\\n\"],[4,\"link-to\",[\"business\",[19,1,[\"stub\"]]],null,{\"statements\":[[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"half-left\"],[7],[0,\"\\n            \"],[6,\"h4\"],[7],[1,[19,1,[\"business_name\"]],false],[8],[0,\"\\n            \"],[6,\"span\"],[9,\"class\",\"badge badge-primary\"],[7],[0,\"Pay Now\"],[8],[0,\"\\n          \"],[8],[0,\"\\n\\n\"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"half-left\"],[7],[0,\"\\n          \"],[6,\"h4\"],[7],[1,[19,1,[\"business_name\"]],false],[8],[0,\"\\n          \"],[6,\"span\"],[9,\"class\",\"badge badge-primary\"],[7],[0,\"Pay Now\"],[8],[0,\"\\n        \"],[8],[0,\"\\n\\n\"]],\"parameters\":[]}],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"clear\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"clear\"],[7],[8],[0,\"\\n\\n\"]],\"parameters\":[1]},null],[0,\"  \"],[8],[0,\"\\n\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "energy-city-app/templates/city.hbs" } });
});
define('energy-city-app/templates/components/ember-popper-targeting-parent', ['exports', 'ember-popper/templates/components/ember-popper-targeting-parent'], function (exports, _emberPopperTargetingParent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _emberPopperTargetingParent.default;
    }
  });
});
define('energy-city-app/templates/components/ember-popper', ['exports', 'ember-popper/templates/components/ember-popper'], function (exports, _emberPopper) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _emberPopper.default;
    }
  });
});
define('energy-city-app/templates/components/g-map/canvas', ['exports', 'ember-google-maps/templates/components/g-map/canvas'], function (exports, _canvas) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _canvas.default;
    }
  });
});
define('energy-city-app/templates/components/g-map/marker', ['exports', 'ember-google-maps/templates/components/g-map/marker'], function (exports, _marker) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _marker.default;
    }
  });
});
define("energy-city-app/templates/components/location-list", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "plLNXzj6", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1],[0,\"\\n\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "energy-city-app/templates/components/location-list.hbs" } });
});
define("energy-city-app/templates/components/money-button", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "iAtuntjk", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1]],\"hasEval\":false}", "meta": { "moduleName": "energy-city-app/templates/components/money-button.hbs" } });
});
define("energy-city-app/templates/geolocate", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "0/sXA3sB", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"outlet\"],false],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"box\"],[7],[0,\"\\n\\n\"],[4,\"if\",[[19,0,[\"geolocating\"]]],null,{\"statements\":[[0,\"\\n    \"],[6,\"div\"],[7],[0,\"\\n      \"],[6,\"h1\"],[9,\"class\",\"flex-center\"],[7],[0,\"Locating Nearby Businesses\"],[8],[0,\"\\n    \"],[8],[0,\"\\n\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"\\n    \"],[6,\"div\"],[7],[0,\"\\n      \"],[6,\"h1\"],[9,\"class\",\"flex-center\"],[7],[1,[20,[\"location\",\"address\",\"city\"]],false],[8],[0,\"\\n    \"],[8],[0,\"\\n\\n\"]],\"parameters\":[]}],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "energy-city-app/templates/geolocate.hbs" } });
});
define("energy-city-app/templates/home", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "uI8uTeeV", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"outlet\"],false],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"home\"],[7],[0,\"\\n\\n  \"],[6,\"button\"],[9,\"style\",\"width: 100%; padding: 2em; border: 0px\"],[9,\"class\",\"nearby-button\"],[3,\"action\",[[19,0,[]],\"findNearby\"]],[7],[0,\"Find\\n  Nearby\"],[8],[0,\"\\n\\n  \"],[6,\"p\"],[7],[0,\"or\"],[8],[0,\"\\n\\n  \"],[6,\"button\"],[9,\"style\",\"width: 100%; padding: 2em; border: 0px\"],[7],[4,\"link-to\",[\"search-city\"],null,{\"statements\":[[0,\"Search City\"]],\"parameters\":[]},null],[8],[0,\"\\n\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "energy-city-app/templates/home.hbs" } });
});
define("energy-city-app/templates/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "4bL8NOQ6", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"outlet\"],false]],\"hasEval\":false}", "meta": { "moduleName": "energy-city-app/templates/index.hbs" } });
});
define("energy-city-app/templates/invoice", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "YWenYMW6", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"outlet\"],false],[0,\"\\n\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "energy-city-app/templates/invoice.hbs" } });
});
define("energy-city-app/templates/leaderboard", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "NhAf2tuQ", "block": "{\"symbols\":[\"account\",\"i\"],\"statements\":[[1,[18,\"outlet\"],false],[0,\"\\n\\n\"],[6,\"h1\"],[7],[0,\"Leaderboard\"],[8],[0,\"\\n\\n\"],[6,\"table\"],[9,\"class\",\"leaderboard table table-striped\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"leaderboard\"]]],null,{\"statements\":[[0,\"    \"],[6,\"tr\"],[7],[0,\"\\n\\n      \"],[6,\"td\"],[7],[0,\"\\n        \"],[1,[19,2,[]],false],[0,\") \"],[1,[19,1,[\"business_name\"]],false],[0,\"\\n      \"],[8],[0,\"\\n\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[1,2]},null],[8],[0,\"\\n\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "energy-city-app/templates/leaderboard.hbs" } });
});
define("energy-city-app/templates/map", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "mHJRneAp", "block": "{\"symbols\":[\"merchant\"],\"statements\":[[1,[18,\"outlet\"],false],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"business-modal close\"],[7],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"close-link\"],[3,\"action\",[[19,0,[]],\"closeModal\"]],[7],[0,\"X\"],[8],[0,\"\\n\\n  \"],[6,\"h1\"],[7],[1,[20,[\"selectedMerchant\",\"business_name\"]],false],[8],[0,\"\\n  \"],[6,\"img\"],[9,\"class\",\"logo\"],[10,\"src\",[20,[\"selectedMerchant\",\"image_url\"]],null],[7],[8],[0,\"\\n  \"],[6,\"p\"],[9,\"class\",\"business-address\"],[7],[1,[20,[\"selectedMerchant\",\"physical_address\"]],false],[8],[0,\"\\n\\n  \"],[6,\"div\"],[9,\"class\",\"selected-merchant-details\"],[7],[0,\"\\n\\n    \"],[6,\"p\"],[9,\"class\",\"selected-merchant-coins\"],[7],[6,\"b\"],[7],[1,[18,\"selectedMerchantCoins\"],false],[8],[8],[0,\"\\n\"],[4,\"if\",[[19,0,[\"selectedMerchant\",\"stub\"]]],null,{\"statements\":[[0,\"      \"],[6,\"button\"],[9,\"class\",\"btn btn-large pay-now-button\"],[3,\"action\",[[19,0,[]],\"payNow\"]],[7],[0,\"Pay Now\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"    \"],[6,\"p\"],[7],[6,\"i\"],[7],[0,\"Active \"],[1,[25,\"moment-from-now\",[[19,0,[\"selectedMerchantDetails\",\"payments\",\"latest\",\"time\"]]],null],false],[8],[8],[0,\"\\n\\n  \"],[8],[0,\"\\n\\n\"],[8],[0,\"\\n\\n\"],[6,\"script\"],[9,\"id\",\"merchant-popup-template\"],[9,\"type\",\"text/x-handlebars-template\"],[7],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"map-container\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"id\",\"map\"],[9,\"class\",\"map\"],[7],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"map-location-chosen\"],[7],[0,\"\\n    \"],[6,\"ul\"],[9,\"class\",\"map-merchant-list\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"merchants\"]]],null,{\"statements\":[[0,\"      \"],[6,\"li\"],[9,\"class\",\"map-merchant-details\"],[3,\"action\",[[19,0,[]],\"merchantDetailsClicked\",[19,1,[]]]],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"merchant-name\"],[7],[0,\"\\n          \"],[6,\"h2\"],[7],[1,[19,1,[\"business_name\"]],false],[8],[0,\"\\n          \"],[6,\"p\"],[7],[1,[19,1,[\"physical_address\"]],false],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"img\"],[9,\"class\",\"merchant-image\"],[10,\"src\",[19,1,[\"image_url\"]],null],[9,\"style\",\"max-width:200px;\"],[7],[8],[0,\"\\n      \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "energy-city-app/templates/map.hbs" } });
});
define("energy-city-app/templates/moneybutton-auth-redirect", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "jMYMO83m", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"outlet\"],false],[0,\"\\n\\n\"],[4,\"if\",[[19,0,[\"session\",\"isAuthenticated\"]]],null,{\"statements\":[[0,\"  Signed In\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"  Signing In\\n\"]],\"parameters\":[]}],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "energy-city-app/templates/moneybutton-auth-redirect.hbs" } });
});
define("energy-city-app/templates/pay", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "vqA8NTj6", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"outlet\"],false],[0,\"\\n\\n\"],[6,\"h1\"],[7],[1,[20,[\"business\",\"business_name\"]],false],[8],[0,\"\\n\\n\"],[6,\"section\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"container page-layout page-layout--background-primary\\n  calculator-pad-top noselect\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"invoice-amount\"],[7],[0,\"\\n\"],[0,\"      \"],[6,\"h1\"],[9,\"class\",\"invoice-amount\"],[9,\"id\",\"invoice-amount\"],[7],[6,\"span\"],[7],[0,\"$\"],[1,[18,\"amount\"],false],[8],[0,\" \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"page-layout__content calculator-pad-top noselect\"],[9,\"style\",\"display: block;\"],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"row calculator-pad noselect\"],[9,\"id\",\"calculator-pad\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"calculator-button col-sm-4 noselect\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"calculatorPress\"],null],null],[9,\"id\",\"calculator-1\"],[7],[0,\"1\"],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"calculator-button col-sm-4 noselect\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"calculatorPress\"],null],null],[9,\"id\",\"calculator-2\"],[7],[0,\"2\"],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"calculator-button col-sm-4 noselect\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"calculatorPress\"],null],null],[9,\"id\",\"calculator-3\"],[7],[0,\"3\"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"calculator-button col-sm-4 noselect\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"calculatorPress\"],null],null],[9,\"id\",\"calculator-4\"],[7],[0,\"4\"],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"calculator-button col-sm-4 noselect\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"calculatorPress\"],null],null],[9,\"id\",\"calculator-5\"],[7],[0,\"5\"],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"calculator-button col-sm-4 noselect\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"calculatorPress\"],null],null],[9,\"id\",\"calculator-6\"],[7],[0,\"6\"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"calculator-button col-sm-4 noselect\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"calculatorPress\"],null],null],[9,\"id\",\"calculator-7\"],[7],[0,\"7\"],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"calculator-button col-sm-4 noselect\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"calculatorPress\"],null],null],[9,\"id\",\"calculator-8\"],[7],[0,\"8\"],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"calculator-button col-sm-4 noselect\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"calculatorPress\"],null],null],[9,\"id\",\"calculator-9\"],[7],[0,\"9\"],[8],[0,\"\\n        \"],[8],[0,\"\\n\\n        \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"calculator-button col-sm-4 noselect invisible\"],[9,\"id\",\"calculator-delete\"],[7],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"calculator-button col-sm-4 noselect\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"calculatorPress\"],null],null],[9,\"id\",\"calculator-0\"],[7],[0,\"0\"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"],[4,\"if\",[[19,0,[\"isShowNextButton\"]]],null,{\"statements\":[[0,\"          \"],[6,\"div\"],[9,\"class\",\"calculator-button col-sm-4\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"pressBackspace\"],null],null],[9,\"id\",\"calculator-backspace\"],[7],[0,\"\\n            \"],[6,\"img\"],[9,\"class\",\"left-chevron-back\"],[10,\"src\",[26,[[18,\"rootURL\"],\"left-chevron.png\"]]],[7],[8],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"          \"],[6,\"div\"],[9,\"class\",\"col-sm-4 invisible\"],[7],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"      \"],[8],[0,\"\\n\\n      \"],[6,\"div\"],[9,\"class\",\"invoice-page__controls\"],[7],[0,\"\\n\\n\"],[4,\"if\",[[19,0,[\"isShowNextButton\"]]],null,{\"statements\":[[0,\"        \"],[6,\"img\"],[9,\"class\",\"new-invoice-next-button\"],[10,\"src\",[26,[[18,\"rootURL\"],\"img/Green_Anypay_Next_Arrow.svg\"]]],[3,\"action\",[[19,0,[]],\"generateInvoice\"]],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"      \"],[8],[0,\"\\n\\n    \"],[8],[0,\"\\n\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"pay-bottom-tray pay-bottom-tray--is-hidden\"],[7],[0,\"\\n\\n  \"],[6,\"p\"],[7],[0,\"Swipe to pay $\"],[1,[18,\"bsvAmount\"],false],[8],[0,\"\\n  \"],[1,[18,\"money-button\"],false],[0,\"\\n  \"],[6,\"div\"],[9,\"id\",\"my-money-button\"],[7],[8],[0,\"\\n\\n\"],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"cd-panel cd-panel--from-right js-cd-panel-main\"],[7],[0,\"\\n   \"],[6,\"header\"],[9,\"class\",\"cd-panel__header\"],[7],[0,\"\\n      \"],[6,\"h1\"],[7],[0,\"Title Goes Here\"],[8],[0,\"\\n      \"],[6,\"a\"],[9,\"href\",\"#0\"],[9,\"class\",\"cd-panel__close js-cd-close\"],[7],[0,\"Close\"],[8],[0,\"\\n   \"],[8],[0,\"\\n\\n   \"],[6,\"div\"],[9,\"class\",\"cd-panel__container\"],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"cd-panel__content\"],[7],[0,\"\\n         \"],[2,\" your side panel content here \"],[0,\"\\n      \"],[8],[0,\" \"],[2,\" cd-panel__content \"],[0,\"\\n   \"],[8],[0,\" \"],[2,\" cd-panel__container \"],[0,\"\\n\"],[8],[0,\" \"],[2,\" cd-panel \"],[0,\"\\n\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "energy-city-app/templates/pay.hbs" } });
});
define("energy-city-app/templates/payments", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "eyX0V1N7", "block": "{\"symbols\":[\"payment\"],\"statements\":[[1,[18,\"outlet\"],false],[0,\"\\n\"],[6,\"h1\"],[7],[0,\"My Payments\"],[8],[0,\"\\n\\n\"],[6,\"ul\"],[9,\"class\",\"payments-list\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"payments\"]]],null,{\"statements\":[[0,\"\\n  \"],[6,\"li\"],[7],[0,\"\\n    \"],[6,\"h2\"],[7],[1,[19,1,[\"account\",\"business_name\"]],false],[8],[0,\"\\n    \"],[6,\"p\"],[7],[1,[19,1,[\"invoice_amount_paid\"]],false],[0,\" \"],[1,[19,1,[\"currency\"]],false],[8],[0,\"\\n    \"],[6,\"p\"],[7],[1,[19,1,[\"denomination_amount_paid\"]],false],[0,\" \"],[1,[19,1,[\"denomination_currency\"]],false],[8],[0,\"\\n    \"],[6,\"p\"],[7],[1,[25,\"moment-format\",[[19,1,[\"completed_at\"]],\"dddd, MMMM Do YYYY hh:mm a\"],null],false],[8],[0,\"\\n\"],[4,\"if\",[[19,1,[\"true_reviews_token\"]]],null,{\"statements\":[[0,\"      \"],[6,\"a\"],[10,\"href\",[19,1,[\"true_reviews_token\",\"redeemURL\"]],null],[9,\"target\",\"_blank\"],[7],[0,\"\\n        \"],[6,\"img\"],[9,\"class\",\"true-reviews-logo\"],[9,\"src\",\"/img/true_reviews_logo.png\"],[7],[8],[0,\"\\n      \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"  \"],[8],[0,\"\\n\\n\"]],\"parameters\":[1]},null],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "energy-city-app/templates/payments.hbs" } });
});
define("energy-city-app/templates/root", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "p1EjChqh", "block": "{\"symbols\":[\"location\"],\"statements\":[[1,[18,\"outlet\"],false],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"jumbotron\"],[7],[0,\"\\n  \"],[6,\"h1\"],[9,\"class\",\"align-center center\"],[7],[0,\"Energy City\"],[8],[0,\"\\n\"],[4,\"if\",[[19,0,[\"connected\"]]],null,{\"statements\":[[0,\"    \"],[6,\"span\"],[9,\"class\",\"badge badge-success\"],[7],[0,\"connected\"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"    \"],[6,\"span\"],[9,\"class\",\"badge badge-warning\"],[7],[0,\"not connected\"],[8],[0,\"\\n\"]],\"parameters\":[]}],[8],[0,\"\\n\\n\"],[6,\"table\"],[9,\"class\",\"table table-striped\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"locations\"]]],null,{\"statements\":[[0,\"    \"],[6,\"tr\"],[7],[0,\"\\n      \"],[6,\"td\"],[7],[0,\"\\n        \"],[6,\"a\"],[9,\"target\",\"_blank\"],[10,\"href\",[26,[\"https://anypayapp.com/pay/\",[19,1,[\"stub\"]]]]],[7],[0,\"\\n          \"],[1,[19,1,[\"name\"]],false],[0,\"\\n        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n\\n      \"],[6,\"td\"],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"tipjar\"]]],null,{\"statements\":[[0,\"          \"],[6,\"a\"],[9,\"target\",\"_blank\"],[10,\"href\",[19,1,[\"tipjar\"]],null],[7],[0,\"\\n            \"],[6,\"span\"],[9,\"class\",\"badge badge-primary\"],[7],[0,\"tipjar\"],[8],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"      \"],[8],[0,\"\\n\\n      \"],[6,\"td\"],[9,\"class\",\"align-right\"],[7],[0,\"\\n\\n\"],[4,\"if\",[[19,1,[\"invoice\"]]],null,{\"statements\":[[0,\"\\n          \"],[6,\"span\"],[9,\"class\",\"badge badge-warning\"],[7],[0,\"\\n\\n            \"],[6,\"a\"],[9,\"target\",\"_blank\"],[10,\"href\",[19,1,[\"invoice\",\"uri\"]],null],[7],[0,\"\\n\\n              Pay $\"],[1,[19,1,[\"invoice\",\"denomination_amount\"]],false],[0,\" \"],[1,[19,1,[\"invoice\",\"currency\"]],false],[0,\"\\n\\n            \"],[8],[0,\"\\n\\n          \"],[8],[0,\"\\n\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"\\n\"]],\"parameters\":[]}],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[8],[0,\"\\n\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "energy-city-app/templates/root.hbs" } });
});
define("energy-city-app/templates/search-city", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "q2ra0rjf", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"outlet\"],false],[0,\"\\n\\n\"],[6,\"form\"],[3,\"action\",[[19,0,[]],\"searchLocation\"],[[\"on\"],[\"submit\"]]],[7],[0,\"\\n  \"],[1,[25,\"input\",null,[[\"style\",\"type\",\"value\",\"placeholder\"],[\"width:100%;padding:1em\",\"search\",[19,0,[\"search\"]],\"search city or address\"]]],false],[0,\"\\n  \"],[1,[25,\"input\",null,[[\"style\",\"class\",\"type\",\"value\"],[\"width:100%;padding:1em\",\"search-city-page\",\"submit\",\"submit\"]]],false],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "energy-city-app/templates/search-city.hbs" } });
});
define('energy-city-app/utils/helpers', ['exports', 'ember-google-maps/utils/helpers'], function (exports, _helpers) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'computedPromise', {
    enumerable: true,
    get: function () {
      return _helpers.computedPromise;
    }
  });
  Object.defineProperty(exports, 'position', {
    enumerable: true,
    get: function () {
      return _helpers.position;
    }
  });
});


define('energy-city-app/config/environment', ['ember'], function(Ember) {
  var prefix = 'energy-city-app';
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

});

if (!runningTests) {
  require("energy-city-app/app")["default"].create({"name":"energy-city-app","version":"0.0.0+b580b46d"});
}
//# sourceMappingURL=energy-city-app.map
