(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var template = '\n  <div class="alert gmd gmd-alert-popup alert-ALERT_TYPE alert-dismissible" role="alert">\n    <button type="button" class="close" aria-label="Close"><span aria-hidden="true">\xD7</span></button>\n    <strong>ALERT_TITLE</strong> ALERT_MESSAGE\n    <a class="action" style="display: none;">Desfazer</a>\n  </div>\n';

var Provider = function Provider() {

  var alerts = [];

  String.prototype.toDOM = String.prototype.toDOM || function () {
    var el = document.createElement('div');
    el.innerHTML = this;
    var frag = document.createDocumentFragment();
    return frag.appendChild(el.removeChild(el.firstChild));
  };

  String.prototype.hashCode = function () {
    var hash = 0,
        i,
        chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr = this.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

  var getTemplate = function getTemplate(type, title, message) {
    var toReturn = template.trim().replace('ALERT_TYPE', type);
    toReturn = toReturn.trim().replace('ALERT_TITLE', title);
    toReturn = toReturn.trim().replace('ALERT_MESSAGE', message);
    return toReturn;
  };

  var getElementBody = function getElementBody() {
    return angular.element('body')[0];
  };

  var success = function success(title, message, time) {
    return createAlert(getTemplate('success', title || '', message || ''), time, { title: title, message: message });
  };

  var error = function error(title, message, time) {
    return createAlert(getTemplate('danger', title || '', message || ''), time, { title: title, message: message });
  };

  var warning = function warning(title, message, time) {
    return createAlert(getTemplate('warning', title, message), time, { title: title, message: message });
  };

  var info = function info(title, message, time) {
    return createAlert(getTemplate('info', title, message), time, { title: title, message: message });
  };

  var closeAlert = function closeAlert(elm, config) {
    alerts = alerts.filter(function (alert) {
      return !angular.equals(config, alert);
    });
    angular.element(elm).css({
      transform: 'scale(0.3)'
    });
    setTimeout(function () {
      var body = getElementBody();
      if (body.contains(elm)) {
        body.removeChild(elm);
      }
    }, 100);
  };

  var bottomLeft = function bottomLeft(elm) {
    var bottom = 15;
    angular.forEach(angular.element(getElementBody()).find('div.gmd-alert-popup'), function (popup) {
      angular.equals(elm[0], popup) ? angular.noop() : bottom += angular.element(popup).height() * 3;
    });
    elm.css({
      bottom: bottom + 'px',
      left: '15px',
      top: null,
      right: null
    });
  };

  var createAlert = function createAlert(template, time, config) {
    if (alerts.filter(function (alert) {
      return angular.equals(alert, config);
    }).length > 0) {
      return;
    }
    alerts.push(config);
    var _onDismiss = void 0,
        _onRollback = void 0,
        elm = angular.element(template.toDOM());
    getElementBody().appendChild(elm[0]);

    bottomLeft(elm);

    elm.find('button[class="close"]').click(function (evt) {
      closeAlert(elm[0]);
      _onDismiss ? _onDismiss(evt) : angular.noop();
    });

    elm.find('a[class="action"]').click(function (evt) {
      return _onRollback ? _onRollback(evt) : angular.noop();
    });

    time ? setTimeout(function () {
      closeAlert(elm[0], config);
      _onDismiss ? _onDismiss() : angular.noop();
    }, time) : angular.noop();

    return {
      position: function position(_position) {},
      onDismiss: function onDismiss(callback) {
        _onDismiss = callback;
        return this;
      },
      onRollback: function onRollback(callback) {
        elm.find('a[class="action"]').css({ display: 'block' });
        _onRollback = callback;
        return this;
      },
      close: function close() {
        closeAlert(elm[0]);
      }
    };
  };

  return {
    $get: function $get() {
      return {
        success: success,
        error: error,
        warning: warning,
        info: info
      };
    }
  };
};

Provider.$inject = [];

exports.default = Provider;

},{}],2:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function isDOMAttrModifiedSupported() {
	var p = document.createElement('p');
	var flag = false;

	if (p.addEventListener) {
		p.addEventListener('DOMAttrModified', function () {
			flag = true;
		}, false);
	} else if (p.attachEvent) {
		p.attachEvent('onDOMAttrModified', function () {
			flag = true;
		});
	} else {
		return false;
	}
	p.setAttribute('id', 'target');
	return flag;
}

function checkAttributes(chkAttr, e) {
	if (chkAttr) {
		var attributes = this.data('attr-old-value');

		if (e.attributeName.indexOf('style') >= 0) {
			if (!attributes['style']) attributes['style'] = {}; //initialize
			var keys = e.attributeName.split('.');
			e.attributeName = keys[0];
			e.oldValue = attributes['style'][keys[1]]; //old value
			e.newValue = keys[1] + ':' + this.prop("style")[$.camelCase(keys[1])]; //new value
			attributes['style'][keys[1]] = e.newValue;
		} else {
			e.oldValue = attributes[e.attributeName];
			e.newValue = this.attr(e.attributeName);
			attributes[e.attributeName] = e.newValue;
		}

		this.data('attr-old-value', attributes); //update the old value object
	}
}

//initialize Mutation Observer
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

angular.element.fn.attrchange = function (a, b) {
	if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object') {
		//core
		var cfg = {
			trackValues: false,
			callback: $.noop
		};
		//backward compatibility
		if (typeof a === "function") {
			cfg.callback = a;
		} else {
			$.extend(cfg, a);
		}

		if (cfg.trackValues) {
			//get attributes old value
			this.each(function (i, el) {
				var attributes = {};
				for (var attr, i = 0, attrs = el.attributes, l = attrs.length; i < l; i++) {
					attr = attrs.item(i);
					attributes[attr.nodeName] = attr.value;
				}
				$(this).data('attr-old-value', attributes);
			});
		}

		if (MutationObserver) {
			//Modern Browsers supporting MutationObserver
			var mOptions = {
				subtree: false,
				attributes: true,
				attributeOldValue: cfg.trackValues
			};
			var observer = new MutationObserver(function (mutations) {
				mutations.forEach(function (e) {
					var _this = e.target;
					//get new value if trackValues is true
					if (cfg.trackValues) {
						e.newValue = $(_this).attr(e.attributeName);
					}
					if ($(_this).data('attrchange-status') === 'connected') {
						//execute if connected
						cfg.callback.call(_this, e);
					}
				});
			});

			return this.data('attrchange-method', 'Mutation Observer').data('attrchange-status', 'connected').data('attrchange-obs', observer).each(function () {
				observer.observe(this, mOptions);
			});
		} else if (isDOMAttrModifiedSupported()) {
			//Opera
			//Good old Mutation Events
			return this.data('attrchange-method', 'DOMAttrModified').data('attrchange-status', 'connected').on('DOMAttrModified', function (event) {
				if (event.originalEvent) {
					event = event.originalEvent;
				} //jQuery normalization is not required
				event.attributeName = event.attrName; //property names to be consistent with MutationObserver
				event.oldValue = event.prevValue; //property names to be consistent with MutationObserver
				if ($(this).data('attrchange-status') === 'connected') {
					//disconnected logically
					cfg.callback.call(this, event);
				}
			});
		} else if ('onpropertychange' in document.body) {
			//works only in IE
			return this.data('attrchange-method', 'propertychange').data('attrchange-status', 'connected').on('propertychange', function (e) {
				e.attributeName = window.event.propertyName;
				//to set the attr old value
				checkAttributes.call($(this), cfg.trackValues, e);
				if ($(this).data('attrchange-status') === 'connected') {
					//disconnected logically
					cfg.callback.call(this, e);
				}
			});
		}
		return this;
	} else if (typeof a == 'string' && $.fn.attrchange.hasOwnProperty('extensions') && angular.element.fn.attrchange['extensions'].hasOwnProperty(a)) {
		//extensions/options
		return $.fn.attrchange['extensions'][a].call(this, b);
	}
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  transclude: true,
  bindings: {
    forceClick: '=?',
    opened: '=?'
  },
  template: '<ng-transclude></ng-transclude>',
  controller: ['$scope', '$element', '$attrs', '$timeout', '$parse', function ($scope, $element, $attrs, $timeout, $parse) {
    var ctrl = this;

    var handlingOptions = function handlingOptions(elements) {
      $timeout(function () {
        angular.forEach(elements, function (option) {
          angular.element(option).css({ left: (measureText(angular.element(option).text(), '14', option.style).width + 30) * -1 });
        });
      });
    };

    function measureText(pText, pFontSize, pStyle) {
      var lDiv = document.createElement('div');
      document.body.appendChild(lDiv);

      if (pStyle != null) {
        lDiv.style = pStyle;
      }

      lDiv.style.fontSize = "" + pFontSize + "px";
      lDiv.style.position = "absolute";
      lDiv.style.left = -1000;
      lDiv.style.top = -1000;

      lDiv.innerHTML = pText;

      var lResult = {
        width: lDiv.clientWidth,
        height: lDiv.clientHeight
      };

      document.body.removeChild(lDiv);

      lDiv = null;

      return lResult;
    }

    var withFocus = function withFocus(ul) {
      $element.on('mouseenter', function () {
        if (ctrl.opened) {
          return;
        }
        angular.forEach($element.find('ul'), function (ul) {
          verifyPosition(angular.element(ul));
          handlingOptions(angular.element(ul).find('li > span'));
        });
        open(ul);
      });
      $element.on('mouseleave', function () {
        if (ctrl.opened) {
          return;
        }
        verifyPosition(angular.element(ul));
        close(ul);
      });
    };

    var close = function close(ul) {
      if (ul[0].hasAttribute('left')) {
        ul.find('li').css({ transform: 'rotate(90deg) scale(0.3)' });
      } else {
        ul.find('li').css({ transform: 'scale(0.3)' });
      }
      ul.find('li > span').css({ opacity: '0', position: 'absolute' });
      ul.css({ visibility: "hidden", opacity: '0' });
      ul.removeClass('open');
      // if(ctrl.opened){
      //   ctrl.opened = false;
      //   $scope.$digest();
      // }
    };

    var open = function open(ul) {
      if (ul[0].hasAttribute('left')) {
        ul.find('li').css({ transform: 'rotate(90deg) scale(1)' });
      } else {
        ul.find('li').css({ transform: 'rotate(0deg) scale(1)' });
      }
      ul.find('li > span').hover(function () {
        angular.element(this).css({ opacity: '1', position: 'absolute' });
      });
      ul.css({ visibility: "visible", opacity: '1' });
      ul.addClass('open');
      // if(!ctrl.opened){
      //   ctrl.opened = true;
      //   $scope.$digest();
      // }
    };

    var withClick = function withClick(ul) {
      $element.find('button').first().on('click', function () {
        if (ul.hasClass('open')) {
          close(ul);
        } else {
          open(ul);
        }
      });
    };

    var verifyPosition = function verifyPosition(ul) {
      $element.css({ display: "inline-block" });
      if (ul[0].hasAttribute('left')) {
        var width = 0,
            lis = ul.find('li');
        angular.forEach(lis, function (li) {
          return width += angular.element(li)[0].offsetWidth;
        });
        var size = (width + 10 * lis.length) * -1;
        ul.css({ left: size });
      } else {
        var _size = ul.height();
        ul.css({ top: _size * -1 });
      }
    };

    $scope.$watch('$ctrl.opened', function (value) {
      angular.forEach($element.find('ul'), function (ul) {
        verifyPosition(angular.element(ul));
        handlingOptions(angular.element(ul).find('li > span'));
        if (value) {
          open(angular.element(ul));
        } else {
          close(angular.element(ul));
        }
      });
    }, true);

    $element.ready(function () {
      $timeout(function () {
        angular.forEach($element.find('ul'), function (ul) {
          verifyPosition(angular.element(ul));
          handlingOptions(angular.element(ul).find('li > span'));
          if (!ctrl.forceClick) {
            withFocus(angular.element(ul));
          } else {
            withClick(angular.element(ul));
          }
        });
      });
    });
  }]
};

exports.default = Component;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  bindings: {},
  template: '\n    <a class="navbar-brand" data-ng-click="$ctrl.navCollapse()" style="position: relative;cursor: pointer;">\n      <div class="navTrigger">\n        <i></i><i></i><i></i>\n      </div>\n    </a>\n  ',
  controller: ['$scope', '$element', '$attrs', '$timeout', '$parse', function ($scope, $element, $attrs, $timeout, $parse) {
    var ctrl = this;

    ctrl.$onInit = function () {
      angular.element("nav.gl-nav").attrchange({
        trackValues: true,
        callback: function callback(evnt) {
          if (evnt.attributeName == 'class') {
            ctrl.toggleHamburger(evnt.newValue.indexOf('collapsed') != -1);
          }
        }
      });

      ctrl.toggleHamburger = function (isCollapsed) {
        isCollapsed ? $element.find('div.navTrigger').addClass('active') : $element.find('div.navTrigger').removeClass('active');
      };

      ctrl.navCollapse = function () {
        document.querySelector('.gumga-layout nav.gl-nav').classList.toggle('collapsed');
        angular.element("nav.gl-nav").attrchange({
          trackValues: true,
          callback: function callback(evnt) {
            if (evnt.attributeName == 'class') {
              ctrl.toggleHamburger(evnt.newValue.indexOf('collapsed') != -1);
            }
          }
        });
      };

      ctrl.toggleHamburger(angular.element('nav.gl-nav').hasClass('collapsed'));
    };
  }]
};

exports.default = Component;

},{}],5:[function(require,module,exports){
'use strict';

var _component = require('./menu/component.js');

var _component2 = _interopRequireDefault(_component);

var _component3 = require('./menu-shrink/component.js');

var _component4 = _interopRequireDefault(_component3);

var _component5 = require('./notification/component.js');

var _component6 = _interopRequireDefault(_component5);

var _component7 = require('./select/component.js');

var _component8 = _interopRequireDefault(_component7);

var _component9 = require('./select/search/component.js');

var _component10 = _interopRequireDefault(_component9);

var _component11 = require('./select/option/component.js');

var _component12 = _interopRequireDefault(_component11);

var _component13 = require('./select/empty/component.js');

var _component14 = _interopRequireDefault(_component13);

var _component15 = require('./input/component.js');

var _component16 = _interopRequireDefault(_component15);

var _component17 = require('./ripple/component.js');

var _component18 = _interopRequireDefault(_component17);

var _component19 = require('./fab/component.js');

var _component20 = _interopRequireDefault(_component19);

var _component21 = require('./spinner/component.js');

var _component22 = _interopRequireDefault(_component21);

var _component23 = require('./hamburger/component.js');

var _component24 = _interopRequireDefault(_component23);

var _provider = require('./alert/provider.js');

var _provider2 = _interopRequireDefault(_provider);

var _provider3 = require('./theme/provider.js');

var _provider4 = _interopRequireDefault(_provider3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

angular.module('gumga.layout', []).provider('$gmdAlert', _provider2.default).provider('$gmdTheme', _provider4.default).directive('gmdRipple', _component18.default).component('glMenu', _component2.default).component('menuShrink', _component4.default).component('glNotification', _component6.default).component('gmdSelect', _component8.default).component('gmdSelectSearch', _component10.default).component('gmdOptionEmpty', _component14.default).component('gmdOption', _component12.default).component('gmdInput', _component16.default).component('gmdFab', _component20.default).component('gmdSpinner', _component22.default).component('gmdHamburger', _component24.default);

},{"./alert/provider.js":1,"./fab/component.js":3,"./hamburger/component.js":4,"./input/component.js":6,"./menu-shrink/component.js":7,"./menu/component.js":8,"./notification/component.js":9,"./ripple/component.js":10,"./select/component.js":11,"./select/empty/component.js":12,"./select/option/component.js":13,"./select/search/component.js":14,"./spinner/component.js":15,"./theme/provider.js":16}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  transclude: true,
  bindings: {},
  template: '\n    <div ng-transclude></div>\n  ',
  controller: ['$scope', '$element', '$attrs', '$timeout', '$parse', function ($scope, $element, $attrs, $timeout, $parse) {
    var ctrl = this,
        input = void 0,
        model = void 0;

    ctrl.$onInit = function () {
      var changeActive = function changeActive(target) {
        if (target.value) {
          target.classList.add('active');
        } else {
          target.classList.remove('active');
        }
      };
      ctrl.$doCheck = function () {
        if (input && input[0]) changeActive(input[0]);
      };
      ctrl.$postLink = function () {
        var gmdInput = $element.find('input');
        if (gmdInput[0]) {
          input = angular.element(gmdInput);
        } else {
          input = angular.element($element.find('textarea'));
        }
        model = input.attr('ng-model') || input.attr('data-ng-model');
      };
    };
  }]
};

exports.default = Component;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Component = {
    transclude: true,
    bindings: {
        menu: '<',
        keys: '<',
        logo: '@?',
        largeLogo: '@?',
        smallLogo: '@?',
        hideSearch: '=?',
        isOpened: '=?',
        iconFirstLevel: '@?',
        showButtonFirstLevel: '=?',
        textFirstLevel: '@?',
        itemDisabled: '&?'
    },
    template: '\n\n    <nav class="main-menu">\n        <div class="menu-header">\n            <img ng-init="$ctrl.observeError()" ng-if="$ctrl.logo" ng-src="{{$ctrl.logo}}"/>\n            <img ng-init="$ctrl.observeError()" class="large" ng-if="$ctrl.largeLogo" ng-src="{{$ctrl.largeLogo}}"/>\n            <img ng-init="$ctrl.observeError()" class="small" ng-if="$ctrl.smallLogo" ng-src="{{$ctrl.smallLogo}}"/>\n\n            <svg version="1.1" ng-click="$ctrl.toggleMenu()" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n                width="613.408px" height="613.408px" viewBox="0 0 613.408 613.408" xml:space="preserve">\n                <g>\n                <path d="M605.254,168.94L443.792,7.457c-6.924-6.882-17.102-9.239-26.319-6.069c-9.177,3.128-15.809,11.241-17.019,20.855\n                    l-9.093,70.512L267.585,216.428h-142.65c-10.344,0-19.625,6.215-23.629,15.746c-3.92,9.573-1.71,20.522,5.589,27.779\n                    l105.424,105.403L0.699,613.408l246.635-212.869l105.423,105.402c4.881,4.881,11.45,7.467,17.999,7.467\n                    c3.295,0,6.632-0.709,9.78-2.002c9.573-3.922,15.726-13.244,15.726-23.504V345.168l123.839-123.714l70.429-9.176\n                    c9.614-1.251,17.727-7.862,20.813-17.039C614.472,186.021,612.136,175.801,605.254,168.94z M504.856,171.985\n                    c-5.568,0.751-10.762,3.232-14.745,7.237L352.758,316.596c-4.796,4.775-7.466,11.242-7.466,18.041v91.742L186.437,267.481h91.68\n                    c6.757,0,13.243-2.669,18.04-7.466L433.51,122.766c3.983-3.983,6.569-9.176,7.258-14.786l3.629-27.696l88.155,88.114\n                    L504.856,171.985z"/>\n                </g>\n            </svg>\n\n        </div>\n        <div class="scrollbar style-1">\n            <ul data-ng-class="\'level\'.concat($ctrl.back.length)">\n\n                <li class="goback gmd gmd-ripple" data-ng-show="$ctrl.previous.length > 0" data-ng-click="$ctrl.prev()">\n                    <a>\n                        <i class="material-icons">\n                            keyboard_arrow_left\n                        </i>\n                        <span data-ng-bind="$ctrl.back[$ctrl.back.length - 1].label" class="nav-text"></span>\n                    </a>\n                </li>\n\n                <li class="gmd-ripple"\n                    data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search"\n                    data-ng-show="$ctrl.allow(item)"\n                    data-ng-click="$ctrl.next(item, $event)"\n                    data-ng-class="[!$ctrl.disableAnimations ? $ctrl.slide : \'\', {\'disabled\': $ctrl.itemDisabled({item: item})}, {header: item.type == \'header\', divider: item.type == \'separator\'}]">\n                    \n                    <a ng-if="item.type != \'separator\' && item.state" ui-sref="{{item.state}}">\n                        <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n                        <span class="nav-text" ng-bind="item.label"></span>\n                        <i data-ng-if="item.children && item.children.length > 0" class="material-icons pull-right">keyboard_arrow_right</i>\n                    </a>\n\n                    <a ng-if="item.type != \'separator\' && !item.state">\n                        <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n                        <span class="nav-text" ng-bind="item.label"></span>\n                        <i data-ng-if="item.children && item.children.length > 0" class="material-icons pull-right">keyboard_arrow_right</i>\n                    </a>\n\n                </li>\n            </ul>\n\n            <ng-transclude></ng-transclude>\n\n        </div>\n    </nav>\n    \n    ',
    controller: ['$timeout', '$attrs', '$element', function ($timeout, $attrs, $element) {
        var ctrl = this;
        ctrl.keys = ctrl.keys || [];
        ctrl.iconFirstLevel = ctrl.iconFirstLevel || 'glyphicon glyphicon-home';
        ctrl.previous = [];
        ctrl.back = [];
        var mainContent = void 0,
            headerContent = void 0;

        ctrl.$onInit = function () {
            mainContent = angular.element('.gumga-layout .gl-main');
            headerContent = angular.element('.gumga-layout .gl-header');
            if (eval(sessionStorage.getItem('gmd-menu-shrink'))) {
                $element.addClass('fixed');
            }
        };

        ctrl.observeError = function () {
            $timeout(function () {
                var img = $element.find('img');
                img.bind('error', function () {
                    return img.css({ 'display': 'none' });
                });
                img.bind('load', function () {
                    return img.css({ 'display': 'block' });
                });
            });
        };

        ctrl.toggleMenu = function () {
            $element.toggleClass('fixed');
            sessionStorage.setItem('gmd-menu-shrink', $element.hasClass('fixed'));
        };

        ctrl.prev = function () {
            ctrl.menu = ctrl.previous.pop();
            ctrl.back.pop();
        };

        ctrl.next = function (item) {
            if (item.children && item.children.length > 0) {
                ctrl.previous.push(ctrl.menu);
                ctrl.menu = item.children;
                ctrl.back.push(item);
            }
        };

        ctrl.goBackToFirstLevel = function () {
            ctrl.menu = ctrl.previous[0];
            ctrl.previous = [];
            ctrl.back = [];
        };

        ctrl.allow = function (item) {
            if (ctrl.keys && ctrl.keys.length > 0) {
                if (!item.key) return true;
                return ctrl.keys.indexOf(item.key) > -1;
            }
        };
    }]
};

exports.default = Component;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
require('../attrchange/attrchange');

var Component = {
  transclude: true,
  bindings: {
    menu: '<',
    keys: '<',
    hideSearch: '=?',
    isOpened: '=?',
    iconFirstLevel: '@?',
    showButtonFirstLevel: '=?',
    textFirstLevel: '@?',
    disableAnimations: '=?',
    shrinkMode: '=?'
  },
  template: '\n\n    <div style="padding: 15px 15px 0px 15px;" ng-if="!$ctrl.hideSearch">\n      <input type="text" data-ng-model="$ctrl.search" class="form-control gmd" placeholder="Busca...">\n      <div class="bar"></div>\n    </div>\n\n    <button class="btn btn-default btn-block gmd" data-ng-if="$ctrl.showButtonFirstLevel" data-ng-click="$ctrl.goBackToFirstLevel()" data-ng-disabled="!$ctrl.previous.length" type="button">\n      <i data-ng-class="[$ctrl.iconFirstLevel]"></i>\n      <span data-ng-bind="$ctrl.textFirstLevel"></span>\n    </button>\n\n    <ul menu data-ng-class="\'level\'.concat($ctrl.back.length)">\n      <li class="goback gmd gmd-ripple" data-ng-show="$ctrl.previous.length > 0" data-ng-click="$ctrl.prev()">\n        <a>\n          <i class="material-icons">\n            keyboard_arrow_left\n          </i>\n          <span data-ng-bind="$ctrl.back[$ctrl.back.length - 1].label"></span>\n        </a>\n      </li>\n\n      <li class="gmd gmd-ripple" \n          data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search"\n          data-ng-show="$ctrl.allow(item)"\n          ng-click="$ctrl.next(item, $event)"\n          data-ng-class="[!$ctrl.disableAnimations ? $ctrl.slide : \'\', {header: item.type == \'header\', divider: item.type == \'separator\'}]">\n\n          <a ng-if="item.type != \'separator\' && item.state" ui-sref="{{item.state}}">\n            <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n            <span ng-bind="item.label"></span>\n            <i data-ng-if="item.children" class="material-icons pull-right">\n              keyboard_arrow_right\n            </i>\n          </a>\n\n          <a ng-if="item.type != \'separator\' && !item.state">\n            <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n            <span ng-bind="item.label"></span>\n            <i data-ng-if="item.children" class="material-icons pull-right">\n              keyboard_arrow_right\n            </i>\n          </a>\n\n      </li>\n    </ul>\n\n    <ng-transclude></ng-transclude>\n\n    <ul class="gl-menu-chevron" ng-if="$ctrl.shrinkMode && !$ctrl.fixed" ng-click="$ctrl.openMenuShrink()">\n      <li>\n        <i class="material-icons">chevron_left</i>\n      </li>\n    </ul>\n\n    <ul class="gl-menu-chevron unfixed" ng-if="$ctrl.shrinkMode && $ctrl.fixed">\n      <li ng-click="$ctrl.unfixedMenuShrink()">\n        <i class="material-icons">chevron_left</i>\n      </li>\n    </ul>\n\n    <ul class="gl-menu-chevron possiblyFixed" ng-if="$ctrl.possiblyFixed">\n      <li ng-click="$ctrl.fixedMenuShrink()" align="center" style="display: flex; justify-content: flex-end;">\n      <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n            width="613.408px" style="display: inline-block; position: relative; height: 1em; width: 3em; font-size: 1.33em; padding: 0; margin: 0;;"  height="613.408px" viewBox="0 0 613.408 613.408" style="enable-background:new 0 0 613.408 613.408;"\n            xml:space="preserve">\n        <g>\n          <path d="M605.254,168.94L443.792,7.457c-6.924-6.882-17.102-9.239-26.319-6.069c-9.177,3.128-15.809,11.241-17.019,20.855\n            l-9.093,70.512L267.585,216.428h-142.65c-10.344,0-19.625,6.215-23.629,15.746c-3.92,9.573-1.71,20.522,5.589,27.779\n            l105.424,105.403L0.699,613.408l246.635-212.869l105.423,105.402c4.881,4.881,11.45,7.467,17.999,7.467\n            c3.295,0,6.632-0.709,9.78-2.002c9.573-3.922,15.726-13.244,15.726-23.504V345.168l123.839-123.714l70.429-9.176\n            c9.614-1.251,17.727-7.862,20.813-17.039C614.472,186.021,612.136,175.801,605.254,168.94z M504.856,171.985\n            c-5.568,0.751-10.762,3.232-14.745,7.237L352.758,316.596c-4.796,4.775-7.466,11.242-7.466,18.041v91.742L186.437,267.481h91.68\n            c6.757,0,13.243-2.669,18.04-7.466L433.51,122.766c3.983-3.983,6.569-9.176,7.258-14.786l3.629-27.696l88.155,88.114\n            L504.856,171.985z"/>\n        </g>\n        </svg>\n      </li>\n    </ul>\n\n  ',
  controller: ['$timeout', '$attrs', '$element', function ($timeout, $attrs, $element) {
    var ctrl = this;
    ctrl.keys = ctrl.keys || [];
    ctrl.iconFirstLevel = ctrl.iconFirstLevel || 'glyphicon glyphicon-home';
    ctrl.previous = [];
    ctrl.back = [];

    ctrl.$onInit = function () {
      ctrl.disableAnimations = ctrl.disableAnimations || false;

      var mainContent = angular.element('.gumga-layout .gl-main');
      var headerContent = angular.element('.gumga-layout .gl-header');

      var stringToBoolean = function stringToBoolean(string) {
        switch (string.toLowerCase().trim()) {
          case "true":case "yes":case "1":
            return true;
          case "false":case "no":case "0":case null:
            return false;
          default:
            return Boolean(string);
        }
      };

      ctrl.fixed = stringToBoolean($attrs.fixed || 'false');
      ctrl.fixedMain = stringToBoolean($attrs.fixedMain || 'false');

      if (ctrl.fixedMain) {
        ctrl.fixed = true;
      }

      var onBackdropClick = function onBackdropClick(evt) {
        if (ctrl.shrinkMode) {
          angular.element('.gumga-layout nav.gl-nav').addClass('closed');
          angular.element('div.gmd-menu-backdrop').removeClass('active');
        } else {
          angular.element('.gumga-layout nav.gl-nav').removeClass('collapsed');
        }
      };

      var init = function init() {
        if (!ctrl.fixed || ctrl.shrinkMode) {
          var elm = document.createElement('div');
          elm.classList.add('gmd-menu-backdrop');
          if (angular.element('div.gmd-menu-backdrop').length == 0) {
            angular.element('body')[0].appendChild(elm);
          }
          angular.element('div.gmd-menu-backdrop').on('click', onBackdropClick);
        }
      };

      init();

      var setMenuTop = function setMenuTop() {
        $timeout(function () {
          var size = angular.element('.gumga-layout .gl-header').height();
          if (size == 0) setMenuTop();
          if (ctrl.fixed) size = 0;
          angular.element('.gumga-layout nav.gl-nav.collapsed').css({
            top: size
          });
        });
      };

      ctrl.toggleContent = function (isCollapsed) {
        $timeout(function () {
          if (ctrl.fixed) {
            var _mainContent = angular.element('.gumga-layout .gl-main');
            var _headerContent = angular.element('.gumga-layout .gl-header');
            if (isCollapsed) {
              _headerContent.ready(function () {
                setMenuTop();
              });
            }
            isCollapsed ? _mainContent.addClass('collapsed') : _mainContent.removeClass('collapsed');
            if (!ctrl.fixedMain && ctrl.fixed) {
              isCollapsed ? _headerContent.addClass('collapsed') : _headerContent.removeClass('collapsed');
            }
          }
        });
      };

      var verifyBackdrop = function verifyBackdrop(isCollapsed) {
        var headerContent = angular.element('.gumga-layout .gl-header');
        var backContent = angular.element('div.gmd-menu-backdrop');
        if (isCollapsed && !ctrl.fixed) {
          backContent.addClass('active');
          var size = headerContent.height();
          if (size > 0 && !ctrl.shrinkMode) {
            backContent.css({ top: size });
          } else {
            backContent.css({ top: 0 });
          }
        } else {
          backContent.removeClass('active');
        }
        $timeout(function () {
          return ctrl.isOpened = isCollapsed;
        });
      };

      if (ctrl.shrinkMode) {
        var _mainContent2 = angular.element('.gumga-layout .gl-main');
        var _headerContent2 = angular.element('.gumga-layout .gl-header');
        var navContent = angular.element('.gumga-layout nav.gl-nav');
        _mainContent2.css({ 'margin-left': '64px' });
        _headerContent2.css({ 'margin-left': '64px' });
        navContent.css({ 'z-index': '1006' });
        angular.element("nav.gl-nav").addClass('closed collapsed');
        verifyBackdrop(!angular.element('nav.gl-nav').hasClass('closed'));
      }

      if (angular.element.fn.attrchange) {
        angular.element("nav.gl-nav").attrchange({
          trackValues: true,
          callback: function callback(evnt) {
            if (evnt.attributeName == 'class') {
              if (ctrl.shrinkMode) {
                ctrl.possiblyFixed = evnt.newValue.indexOf('closed') == -1;
                verifyBackdrop(ctrl.possiblyFixed);
              } else {
                ctrl.toggleContent(evnt.newValue.indexOf('collapsed') != -1);
                verifyBackdrop(evnt.newValue.indexOf('collapsed') != -1);
              }
            }
          }
        });
        if (!ctrl.shrinkMode) {
          ctrl.toggleContent(angular.element('nav.gl-nav').hasClass('collapsed'));
          verifyBackdrop(angular.element('nav.gl-nav').hasClass('collapsed'));
        }
      }

      ctrl.$onInit = function () {
        if (!ctrl.hasOwnProperty('showButtonFirstLevel')) {
          ctrl.showButtonFirstLevel = true;
        }
      };

      ctrl.prev = function () {
        $timeout(function () {
          // ctrl.slide = 'slide-in-left';
          ctrl.menu = ctrl.previous.pop();
          ctrl.back.pop();
        }, 250);
      };

      ctrl.next = function (item) {
        var nav = angular.element('nav.gl-nav')[0];
        if (ctrl.shrinkMode && nav.classList.contains('closed') && item.children && angular.element('.gumga-layout nav.gl-nav').is('[open-on-hover]')) {
          ctrl.openMenuShrink();
          ctrl.next(item);
          return;
        }
        $timeout(function () {
          if (item.children) {
            // ctrl.slide = 'slide-in-right';
            ctrl.previous.push(ctrl.menu);
            ctrl.menu = item.children;
            ctrl.back.push(item);
          }
        }, 250);
      };

      ctrl.goBackToFirstLevel = function () {
        // ctrl.slide = 'slide-in-left'
        ctrl.menu = ctrl.previous[0];
        ctrl.previous = [];
        ctrl.back = [];
      };

      ctrl.allow = function (item) {
        if (ctrl.keys && ctrl.keys.length > 0) {
          if (!item.key) return true;
          return ctrl.keys.indexOf(item.key) > -1;
        }
      };

      // ctrl.slide = 'slide-in-left';

      ctrl.openMenuShrink = function () {
        ctrl.possiblyFixed = true;
        angular.element('.gumga-layout nav.gl-nav').removeClass('closed');
      };

      ctrl.fixedMenuShrink = function () {
        $element.attr('fixed', true);
        ctrl.fixed = true;
        ctrl.possiblyFixed = false;
        init();
        mainContent.css({ 'margin-left': '' });
        headerContent.css({ 'margin-left': '' });
        ctrl.toggleContent(true);
        verifyBackdrop(true);
      };

      ctrl.unfixedMenuShrink = function () {
        $element.attr('fixed', false);
        ctrl.fixed = false;
        ctrl.possiblyFixed = true;
        init();
        mainContent.css({ 'margin-left': '64px' });
        headerContent.css({ 'margin-left': '64px' });
        verifyBackdrop(true);
        angular.element('.gumga-layout nav.gl-nav').addClass('closed');
      };
    };
  }]
};

exports.default = Component;

},{"../attrchange/attrchange":2}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  bindings: {
    icon: '@',
    notifications: '=',
    onView: '&?'
  },
  template: '\n    <ul class="nav navbar-nav navbar-right notifications">\n      <li class="dropdown">\n        <a href="#" badge="{{$ctrl.notifications.length}}" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">\n          <i class="material-icons" data-ng-bind="$ctrl.icon"></i>\n        </a>\n        <ul class="dropdown-menu">\n          <li data-ng-repeat="item in $ctrl.notifications" data-ng-click="$ctrl.view($event, item)">\n            <div class="media">\n              <div class="media-left">\n                <img class="media-object" data-ng-src="{{item.image}}">\n              </div>\n              <div class="media-body" data-ng-bind="item.content"></div>\n            </div>\n          </li>\n        </ul>\n      </li>\n    </ul>\n  ',
  controller: function controller() {
    var ctrl = this;

    ctrl.$onInit = function () {
      ctrl.view = function (event, item) {
        return ctrl.onView({ event: event, item: item });
      };
    };
  }
};

exports.default = Component;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = function Component() {
  return {
    restrict: 'C',
    link: function link($scope, element, attrs) {
      if (!element[0].classList.contains('fixed')) {
        element[0].style.position = 'relative';
      }
      element[0].style.overflow = 'hidden';
      element[0].style.userSelect = 'none';

      element[0].style.msUserSelect = 'none';
      element[0].style.mozUserSelect = 'none';
      element[0].style.webkitUserSelect = 'none';

      function createRipple(evt) {
        var ripple = angular.element('<span class="gmd-ripple-effect animate">'),
            rect = element[0].getBoundingClientRect(),
            radius = Math.max(rect.height, rect.width),
            left = evt.pageX - rect.left - radius / 2 - document.body.scrollLeft,
            top = evt.pageY - rect.top - radius / 2 - document.body.scrollTop;

        ripple[0].style.width = ripple[0].style.height = radius + 'px';
        ripple[0].style.left = left + 'px';
        ripple[0].style.top = top + 'px';
        ripple.on('animationend webkitAnimationEnd', function () {
          angular.element(this).remove();
        });

        element.append(ripple);
      }

      element.bind('mousedown', createRipple);
    }
  };
};

exports.default = Component;

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  require: ['ngModel', 'ngRequired'],
  transclude: true,
  bindings: {
    ngModel: '=',
    ngDisabled: '=?',
    unselect: '@?',
    options: '<',
    option: '@',
    value: '@',
    placeholder: '@?',
    onChange: "&?",
    translateLabel: '=?'
  },
  template: '\n  <div class="dropdown gmd">\n     <label class="control-label floating-dropdown" ng-show="$ctrl.selected">\n      {{$ctrl.placeholder}} <span ng-if="$ctrl.validateGumgaError" ng-class="{\'gmd-select-required\': $ctrl.ngModelCtrl.$error.required}">*<span>\n     </label>\n     <button class="btn btn-default gmd dropdown-toggle gmd-select-button"\n             type="button"\n             style="border-radius: 0;"\n             id="gmdSelect"\n             data-toggle="dropdown"\n             ng-disabled="$ctrl.ngDisabled"\n             aria-haspopup="true"\n             aria-expanded="true">\n       <span class="item-select" ng-if="!$ctrl.translateLabel" data-ng-show="$ctrl.selected" data-ng-bind="$ctrl.selected"></span>\n       <span class="item-select" ng-if="$ctrl.translateLabel" data-ng-show="$ctrl.selected">\n          {{ $ctrl.selected | gumgaTranslate }}\n       </span>\n       <span data-ng-hide="$ctrl.selected" class="item-select placeholder">\n        {{$ctrl.placeholder}}\n       </span>\n       <span ng-if="$ctrl.ngModelCtrl.$error.required && $ctrl.validateGumgaError" class="word-required">*</span>\n       <span class="caret"></span>\n     </button>\n     <ul class="dropdown-menu" aria-labelledby="gmdSelect" ng-show="$ctrl.option" style="display: none;">\n       <li data-ng-click="$ctrl.clear()" ng-if="$ctrl.unselect">\n         <a data-ng-class="{active: false}">{{$ctrl.unselect}}</a>\n       </li>\n       <li data-ng-repeat="option in $ctrl.options track by $index">\n         <a class="select-option" data-ng-click="$ctrl.select(option)" data-ng-bind="option[$ctrl.option] || option" data-ng-class="{active: $ctrl.isActive(option)}"></a>\n       </li>\n     </ul>\n     <ul class="dropdown-menu gmd" aria-labelledby="gmdSelect" ng-show="!$ctrl.option" style="max-height: 250px;overflow: auto;display: none;" ng-transclude></ul>\n   </div>\n  ',
  controller: ['$scope', '$attrs', '$timeout', '$element', '$transclude', '$compile', function ($scope, $attrs, $timeout, $element, $transclude, $compile) {
    var ctrl = this,
        ngModelCtrl = $element.controller('ngModel');

    var options = ctrl.options || [];

    ctrl.ngModelCtrl = ngModelCtrl;
    ctrl.validateGumgaError = $attrs.hasOwnProperty('gumgaRequired');

    function findParentByName(elm, parentName) {
      if (elm.className == parentName) {
        return elm;
      }
      if (elm.parentNode) {
        return findParentByName(elm.parentNode, parentName);
      }
      return elm;
    }

    function preventDefault(e) {
      e = e || window.event;
      var target = findParentByName(e.target, 'select-option');
      if (target.nodeName == 'A' && target.className == 'select-option' || e.target.nodeName == 'A' && e.target.className == 'select-option') {
        var direction = findScrollDirectionOtherBrowsers(e);
        var scrollTop = angular.element(target.parentNode.parentNode).scrollTop();
        if (scrollTop + angular.element(target.parentNode.parentNode).innerHeight() >= target.parentNode.parentNode.scrollHeight && direction != 'UP') {
          if (e.preventDefault) e.preventDefault();
          e.returnValue = false;
        } else if (scrollTop <= 0 && direction != 'DOWN') {
          if (e.preventDefault) e.preventDefault();
          e.returnValue = false;
        } else {
          e.returnValue = true;
          return;
        }
      } else {
        if (e.preventDefault) e.preventDefault();
        e.returnValue = false;
      }
    }

    function findScrollDirectionOtherBrowsers(event) {
      var delta;
      if (event.wheelDelta) {
        delta = event.wheelDelta;
      } else {
        delta = -1 * event.deltaY;
      }
      if (delta < 0) {
        return "DOWN";
      } else if (delta > 0) {
        return "UP";
      }
    }

    function preventDefaultForScrollKeys(e) {
      if (keys && keys[e.keyCode]) {
        preventDefault(e);
        return false;
      }
      console.clear();
    }

    function disableScroll() {
      if (window.addEventListener) {
        window.addEventListener('scroll', preventDefault, false);
        window.addEventListener('DOMMouseScroll', preventDefault, false);
      }
      window.onwheel = preventDefault; // modern standard
      window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
      window.ontouchmove = preventDefault; // mobile
      document.onkeydown = preventDefaultForScrollKeys;
    }

    function enableScroll() {
      if (window.removeEventListener) window.removeEventListener('DOMMouseScroll', preventDefault, false);
      window.onmousewheel = document.onmousewheel = null;
      window.onwheel = null;
      window.ontouchmove = null;
      document.onkeydown = null;
    }

    var getOffset = function getOffset(el) {
      var rect = el.getBoundingClientRect(),
          scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
          scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var _x = 0,
          _y = 0;
      while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        if (el.nodeName == 'BODY') {
          _y += el.offsetTop - Math.max(angular.element("html").scrollTop(), angular.element("body").scrollTop());
        } else {
          _y += el.offsetTop - el.scrollTop;
        }
        el = el.offsetParent;
      }
      return { top: _y, left: rect.left + scrollLeft };
    };

    var getElementMaxHeight = function getElementMaxHeight(elm) {
      var scrollPosition = Math.max(angular.element("html").scrollTop(), angular.element("body").scrollTop());
      var elementOffset = elm.offset().top;
      var elementDistance = elementOffset - scrollPosition;
      var windowHeight = angular.element(window).height();
      return windowHeight - elementDistance;
    };

    var handlingElementStyle = function handlingElementStyle($element, uls) {
      var SIZE_BOTTOM_DISTANCE = 5;
      var position = getOffset($element[0]);

      angular.forEach(uls, function (ul) {
        if (angular.element(ul).height() == 0) return;
        var maxHeight = getElementMaxHeight(angular.element($element[0]));
        if (angular.element(ul).height() > maxHeight) {
          angular.element(ul).css({
            height: maxHeight - SIZE_BOTTOM_DISTANCE + 'px'
          });
        } else if (angular.element(ul).height() != maxHeight - SIZE_BOTTOM_DISTANCE) {
          angular.element(ul).css({
            height: 'auto'
          });
        }

        angular.element(ul).css({
          display: 'block',
          position: 'fixed',
          left: position.left - 1 + 'px',
          top: position.top - 2 + 'px',
          width: $element.find('div.dropdown')[0].clientWidth + 1
        });
      });
    };

    var handlingElementInBody = function handlingElementInBody(elm, uls) {
      var body = angular.element(document).find('body').eq(0);
      var div = angular.element(document.createElement('div'));
      div.addClass("dropdown gmd");
      div.append(uls);
      body.append(div);
      angular.element(elm.find('button.dropdown-toggle')).attrchange({
        trackValues: true,
        callback: function callback(evnt) {
          if (evnt.attributeName == 'aria-expanded' && evnt.newValue == 'false') {
            enableScroll();
            uls = angular.element(div).find('ul');
            angular.forEach(uls, function (ul) {
              angular.element(ul).css({
                display: 'none'
              });
            });
            elm.find('div.dropdown').append(uls);
            div.remove();
          }
        }
      });
    };

    $element.bind('click', function (event) {
      var uls = $element.find('ul');
      if (uls.find('gmd-option').length == 0) {
        event.stopPropagation();
        return;
      }
      handlingElementStyle($element, uls);
      disableScroll();
      handlingElementInBody($element, uls);
    });

    ctrl.select = function (option) {
      angular.forEach(options, function (option) {
        option.selected = false;
      });
      option.selected = true;
      ctrl.ngModel = option.ngValue;
      ctrl.selected = option.ngLabel;
    };

    ctrl.addOption = function (option) {
      options.push(option);
    };

    var setSelected = function setSelected(value) {
      angular.forEach(options, function (option) {
        if (option.ngValue.$$hashKey) {
          delete option.ngValue.$$hashKey;
        }
        if (angular.equals(value, option.ngValue)) {
          ctrl.select(option);
        }
      });
    };

    $timeout(function () {
      return setSelected(ctrl.ngModel);
    });

    ctrl.$doCheck = function () {
      if (options && options.length > 0) setSelected(ctrl.ngModel);
    };
  }]
};

exports.default = Component;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  transclude: true,
  require: {
    gmdSelectCtrl: '^gmdSelect'
  },
  bindings: {},
  template: '\n      <a class="select-option" data-ng-click="$ctrl.select()" ng-transclude></a>\n    ',
  controller: ['$scope', '$attrs', '$timeout', '$element', '$transclude', function ($scope, $attrs, $timeout, $element, $transclude) {
    var _this = this;

    var ctrl = this;

    ctrl.select = function () {
      ctrl.gmdSelectCtrl.select(_this);
    };
  }]
};

exports.default = Component;

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  // require: ['ngModel','ngRequired'],
  transclude: true,
  require: {
    gmdSelectCtrl: '^gmdSelect'
  },
  bindings: {
    ngValue: '=',
    ngLabel: '='
  },
  template: '\n    <a class="select-option" data-ng-click="$ctrl.select($ctrl.ngValue, $ctrl.ngLabel)" ng-class="{active: $ctrl.selected}" ng-transclude></a>\n  ',
  controller: ['$scope', '$attrs', '$timeout', '$element', '$transclude', function ($scope, $attrs, $timeout, $element, $transclude) {
    var _this = this;

    var ctrl = this;

    ctrl.$onInit = function () {
      ctrl.gmdSelectCtrl.addOption(_this);
    };

    ctrl.select = function () {
      ctrl.gmdSelectCtrl.select(ctrl);
      if (ctrl.gmdSelectCtrl.onChange) {
        ctrl.gmdSelectCtrl.onChange({ value: _this.ngValue });
      }
    };
  }]
};

exports.default = Component;

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  transclude: true,
  require: {
    gmdSelectCtrl: '^gmdSelect'
  },
  bindings: {
    ngModel: '=',
    placeholder: '@?'
  },
  template: '\n    <div class="input-group" style="border: none;background: #f9f9f9;">\n      <span class="input-group-addon" id="basic-addon1" style="border: none;">\n        <i class="material-icons">search</i>\n      </span>\n      <input type="text" style="border: none;" class="form-control gmd" ng-model="$ctrl.ngModel" placeholder="{{$ctrl.placeholder}}">\n    </div>\n  ',
  controller: ['$scope', '$attrs', '$timeout', '$element', '$transclude', function ($scope, $attrs, $timeout, $element, $transclude) {
    var ctrl = this;

    $element.bind('click', function (evt) {
      evt.stopPropagation();
    });
  }]
};

exports.default = Component;

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  bindings: {
    diameter: "@?",
    box: "=?"
  },
  template: "\n  <div class=\"spinner-material\" ng-if=\"$ctrl.diameter\">\n   <svg xmlns=\"http://www.w3.org/2000/svg\"\n        xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n        version=\"1\"\n        ng-class=\"{'spinner-box' : $ctrl.box}\"\n        style=\"width: {{$ctrl.diameter}};height: {{$ctrl.diameter}};\"\n        viewBox=\"0 0 28 28\">\n    <g class=\"qp-circular-loader\">\n     <path class=\"qp-circular-loader-path\" fill=\"none\" d=\"M 14,1.5 A 12.5,12.5 0 1 1 1.5,14\" stroke-linecap=\"round\" />\n    </g>\n   </svg>\n  </div>",
  controller: ['$scope', '$element', '$attrs', '$timeout', '$parse', function ($scope, $element, $attrs, $timeout, $parse) {
    var ctrl = this;

    ctrl.$onInit = function () {
      ctrl.diameter = ctrl.diameter || '50px';
    };
  }]
};

exports.default = Component;

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Provider = function Provider() {

    var setElementHref = function setElementHref(href) {
        var elm = angular.element('link[href*="gumga-layout"]');
        if (elm && elm[0]) {
            elm.attr('href', href);
        }
        elm = angular.element(document.createElement('link'));
        elm.attr('href', href);
        elm.attr('rel', 'stylesheet');
        document.head.appendChild(elm[0]);
    };

    var setThemeDefault = function setThemeDefault(themeName, save) {
        var src = void 0,
            themeDefault = sessionStorage.getItem('gmd-theme-default');
        if (themeName && !themeDefault) {
            if (save) sessionStorage.setItem('gmd-theme-default', themeName);
            src = 'gumga-layout/' + themeName + '/gumga-layout.min.css';
        } else {
            if (themeDefault) {
                src = 'gumga-layout/' + themeDefault + '/gumga-layout.min.css';
            } else {
                src = 'gumga-layout/gumga-layout.min.css';
            }
        }
        setElementHref(src);
    };

    var setTheme = function setTheme(themeName, updateSession) {
        var src,
            themeDefault = sessionStorage.getItem('gmd-theme');

        if (themeName && updateSession || themeName && !themeDefault) {
            sessionStorage.setItem('gmd-theme', themeName);
            src = 'gumga-layout/' + themeName + '/gumga-layout.min.css';
            setElementHref(src);
            return;
        }

        if (themeName && !updateSession) {
            src = 'gumga-layout/' + themeDefault + '/gumga-layout.min.css';
            setElementHref(src);
            return;
        }

        src = 'gumga-layout/gumga-layout.min.css';
        setElementHref(src);
    };

    return {
        setThemeDefault: setThemeDefault,
        setTheme: setTheme,
        $get: function $get() {
            return {
                setThemeDefault: setThemeDefault,
                setTheme: setTheme
            };
        }
    };
};

Provider.$inject = [];

exports.default = Provider;

},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2d1bWdhLWxheW91dC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiLi4vLi4vLi4vdXNyL2xpYi9ub2RlX21vZHVsZXMvZ3VtZ2EtbGF5b3V0L3NyYy9jb21wb25lbnRzL2FsZXJ0L3Byb3ZpZGVyLmpzIiwiLi4vLi4vLi4vdXNyL2xpYi9ub2RlX21vZHVsZXMvZ3VtZ2EtbGF5b3V0L3NyYy9jb21wb25lbnRzL2F0dHJjaGFuZ2UvYXR0cmNoYW5nZS5qcyIsIi4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2d1bWdhLWxheW91dC9zcmMvY29tcG9uZW50cy9mYWIvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vdXNyL2xpYi9ub2RlX21vZHVsZXMvZ3VtZ2EtbGF5b3V0L3NyYy9jb21wb25lbnRzL2hhbWJ1cmdlci9jb21wb25lbnQuanMiLCIuLi8uLi8uLi91c3IvbGliL25vZGVfbW9kdWxlcy9ndW1nYS1sYXlvdXQvc3JjL2NvbXBvbmVudHMvaW5kZXguanMiLCIuLi8uLi8uLi91c3IvbGliL25vZGVfbW9kdWxlcy9ndW1nYS1sYXlvdXQvc3JjL2NvbXBvbmVudHMvaW5wdXQvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vdXNyL2xpYi9ub2RlX21vZHVsZXMvZ3VtZ2EtbGF5b3V0L3NyYy9jb21wb25lbnRzL21lbnUtc2hyaW5rL2NvbXBvbmVudC5qcyIsIi4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2d1bWdhLWxheW91dC9zcmMvY29tcG9uZW50cy9tZW51L2NvbXBvbmVudC5qcyIsIi4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2d1bWdhLWxheW91dC9zcmMvY29tcG9uZW50cy9ub3RpZmljYXRpb24vY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vdXNyL2xpYi9ub2RlX21vZHVsZXMvZ3VtZ2EtbGF5b3V0L3NyYy9jb21wb25lbnRzL3JpcHBsZS9jb21wb25lbnQuanMiLCIuLi8uLi8uLi91c3IvbGliL25vZGVfbW9kdWxlcy9ndW1nYS1sYXlvdXQvc3JjL2NvbXBvbmVudHMvc2VsZWN0L2NvbXBvbmVudC5qcyIsIi4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2d1bWdhLWxheW91dC9zcmMvY29tcG9uZW50cy9zZWxlY3QvZW1wdHkvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vdXNyL2xpYi9ub2RlX21vZHVsZXMvZ3VtZ2EtbGF5b3V0L3NyYy9jb21wb25lbnRzL3NlbGVjdC9vcHRpb24vY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vdXNyL2xpYi9ub2RlX21vZHVsZXMvZ3VtZ2EtbGF5b3V0L3NyYy9jb21wb25lbnRzL3NlbGVjdC9zZWFyY2gvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vdXNyL2xpYi9ub2RlX21vZHVsZXMvZ3VtZ2EtbGF5b3V0L3NyYy9jb21wb25lbnRzL3NwaW5uZXIvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vdXNyL2xpYi9ub2RlX21vZHVsZXMvZ3VtZ2EtbGF5b3V0L3NyYy9jb21wb25lbnRzL3RoZW1lL3Byb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNBQSxJQUFJLHlVQUFKOztBQVFBLElBQUksV0FBVyxTQUFYLFFBQVcsR0FBTTs7QUFFbkIsTUFBSSxTQUFTLEVBQWI7O0FBRUEsU0FBTyxTQUFQLENBQWlCLEtBQWpCLEdBQXlCLE9BQU8sU0FBUCxDQUFpQixLQUFqQixJQUEwQixZQUFVO0FBQzNELFFBQUksS0FBSyxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBVDtBQUNBLE9BQUcsU0FBSCxHQUFlLElBQWY7QUFDQSxRQUFJLE9BQU8sU0FBUyxzQkFBVCxFQUFYO0FBQ0EsV0FBTyxLQUFLLFdBQUwsQ0FBaUIsR0FBRyxXQUFILENBQWUsR0FBRyxVQUFsQixDQUFqQixDQUFQO0FBQ0QsR0FMRDs7QUFPQSxTQUFPLFNBQVAsQ0FBaUIsUUFBakIsR0FBNEIsWUFBVztBQUNyQyxRQUFJLE9B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QWEsYUFBZCxJQUFpQyxhQUFhLENBQUMsWUFBbEQsRUFBZ0U7QUFDNUQsMkJBQWUsT0FBZixDQUF1QixXQUF2QixFQUFvQyxTQUFwQztBQUNBLGtCQUFNLGtCQUFrQixTQUFsQixHQUE4Qix1QkFBcEM7QUFDQSwyQkFBZSxHQUFmO0FBQ0E7QUFDSDs7QUFFRCxZQUFHLGFBQWEsQ0FBQyxhQUFqQixFQUErQjtBQUMzQixrQkFBTSxrQkFBa0IsWUFBbEIsR0FBaUMsdUJBQXZDO0FBQ0EsMkJBQWUsR0FBZjtBQUNBO0FBQ0g7O0FBRUQsY0FBTSxtQ0FBTjtBQUNBLHVCQUFlLEdBQWY7QUFDSCxLQWxCRDs7QUFvQkEsV0FBTztBQUNILHlCQUFpQixlQURkO0FBRUgsa0JBQVUsUUFGUDtBQUdILFlBSEcsa0JBR0k7QUFDSCxtQkFBTztBQUNILGlDQUFpQixlQURkO0FBRUgsMEJBQVU7QUFGUCxhQUFQO0FBSUg7QUFSRSxLQUFQO0FBVUgsQ0ExREQ7O0FBNERBLFNBQVMsT0FBVCxHQUFtQixFQUFuQjs7a0JBRWUsUSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJsZXQgdGVtcGxhdGUgPSBgXG4gIDxkaXYgY2xhc3M9XCJhbGVydCBnbWQgZ21kLWFsZXJ0LXBvcHVwIGFsZXJ0LUFMRVJUX1RZUEUgYWxlcnQtZGlzbWlzc2libGVcIiByb2xlPVwiYWxlcnRcIj5cbiAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+PHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+w5c8L3NwYW4+PC9idXR0b24+XG4gICAgPHN0cm9uZz5BTEVSVF9USVRMRTwvc3Ryb25nPiBBTEVSVF9NRVNTQUdFXG4gICAgPGEgY2xhc3M9XCJhY3Rpb25cIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+RGVzZmF6ZXI8L2E+XG4gIDwvZGl2PlxuYDtcblxubGV0IFByb3ZpZGVyID0gKCkgPT4ge1xuXG4gIGxldCBhbGVydHMgPSBbXTtcblxuICBTdHJpbmcucHJvdG90eXBlLnRvRE9NID0gU3RyaW5nLnByb3RvdHlwZS50b0RPTSB8fCBmdW5jdGlvbigpe1xuICAgIGxldCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVsLmlubmVySFRNTCA9IHRoaXM7XG4gICAgbGV0IGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgcmV0dXJuIGZyYWcuYXBwZW5kQ2hpbGQoZWwucmVtb3ZlQ2hpbGQoZWwuZmlyc3RDaGlsZCkpO1xuICB9O1xuXG4gIFN0cmluZy5wcm90b3R5cGUuaGFzaENvZGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaGFzaCA9IDAsIGksIGNocjtcbiAgICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVybiBoYXNoO1xuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjaHIgICA9IHRoaXMuY2hhckNvZGVBdChpKTtcbiAgICAgIGhhc2ggID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjaHI7XG4gICAgICBoYXNoIHw9IDA7IC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuICAgIH1cbiAgICByZXR1cm4gaGFzaDtcbiAgfTtcblxuICBjb25zdCBnZXRUZW1wbGF0ZSA9ICh0eXBlLCB0aXRsZSwgbWVzc2FnZSkgPT4ge1xuICAgIGxldCB0b1JldHVybiA9IHRlbXBsYXRlLnRyaW0oKS5yZXBsYWNlKCdBTEVSVF9UWVBFJywgdHlwZSk7XG4gICAgICAgIHRvUmV0dXJuID0gdG9SZXR1cm4udHJpbSgpLnJlcGxhY2UoJ0FMRVJUX1RJVExFJywgdGl0bGUpO1xuICAgICAgICB0b1JldHVybiA9IHRvUmV0dXJuLnRyaW0oKS5yZXBsYWNlKCdBTEVSVF9NRVNTQUdFJywgbWVzc2FnZSk7XG4gICAgcmV0dXJuIHRvUmV0dXJuO1xuICB9XG5cbiAgY29uc3QgZ2V0RWxlbWVudEJvZHkgICAgPSAoKSA9PiBhbmd1bGFyLmVsZW1lbnQoJ2JvZHknKVswXTtcblxuICBjb25zdCBzdWNjZXNzID0gKHRpdGxlLCBtZXNzYWdlLCB0aW1lKSA9PiB7XG4gICAgcmV0dXJuIGNyZWF0ZUFsZXJ0KGdldFRlbXBsYXRlKCdzdWNjZXNzJywgdGl0bGUgfHwgJycsIG1lc3NhZ2UgfHwgJycpLCB0aW1lLCB7dGl0bGUsIG1lc3NhZ2V9KTtcbiAgfVxuXG4gIGNvbnN0IGVycm9yID0gKHRpdGxlLCBtZXNzYWdlLCB0aW1lKSA9PiB7XG4gICAgcmV0dXJuIGNyZWF0ZUFsZXJ0KGdldFRlbXBsYXRlKCdkYW5nZXInLCB0aXRsZSB8fCAnJywgbWVzc2FnZSB8fCAnJyksIHRpbWUsIHt0aXRsZSwgbWVzc2FnZX0pO1xuICB9XG5cbiAgY29uc3Qgd2FybmluZyA9ICh0aXRsZSwgbWVzc2FnZSwgdGltZSkgPT4ge1xuICAgIHJldHVybiBjcmVhdGVBbGVydChnZXRUZW1wbGF0ZSgnd2FybmluZycsIHRpdGxlLCBtZXNzYWdlKSwgdGltZSwge3RpdGxlLCBtZXNzYWdlfSk7XG4gIH1cblxuICBjb25zdCBpbmZvID0gKHRpdGxlLCBtZXNzYWdlLCB0aW1lKSA9PiB7XG4gICAgcmV0dXJuIGNyZWF0ZUFsZXJ0KGdldFRlbXBsYXRlKCdpbmZvJywgdGl0bGUsIG1lc3NhZ2UpLCB0aW1lLCB7dGl0bGUsIG1lc3NhZ2V9KTtcbiAgfVxuXG4gIGNvbnN0IGNsb3NlQWxlcnQgPSAoZWxtLCBjb25maWcpID0+IHtcbiAgICBhbGVydHMgPSBhbGVydHMuZmlsdGVyKGFsZXJ0ID0+ICFhbmd1bGFyLmVxdWFscyhjb25maWcsIGFsZXJ0KSk7XG4gICAgYW5ndWxhci5lbGVtZW50KGVsbSkuY3NzKHtcbiAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDAuMyknXG4gICAgfSk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBsZXQgYm9keSA9IGdldEVsZW1lbnRCb2R5KCk7XG4gICAgICBpZihib2R5LmNvbnRhaW5zKGVsbSkpe1xuICAgICAgICBib2R5LnJlbW92ZUNoaWxkKGVsbSk7XG4gICAgICB9XG5cbiAgICB9LCAxMDApO1xuICB9XG5cbiAgY29uc3QgYm90dG9tTGVmdCA9IChlbG0pID0+IHtcbiAgICBsZXQgYm90dG9tID0gMTU7XG4gICAgYW5ndWxhci5mb3JFYWNoKGFuZ3VsYXIuZWxlbWVudChnZXRFbGVtZW50Qm9keSgpKS5maW5kKCdkaXYuZ21kLWFsZXJ0LXBvcHVwJyksIHBvcHVwID0+IHtcbiAgICAgIGFuZ3VsYXIuZXF1YWxzKGVsbVswXSwgcG9wdXApID8gYW5ndWxhci5ub29wKCkgOiBib3R0b20gKz0gYW5ndWxhci5lbGVtZW50KHBvcHVwKS5oZWlnaHQoKSAqIDM7XG4gICAgfSk7XG4gICAgZWxtLmNzcyh7XG4gICAgICBib3R0b206IGJvdHRvbSsgJ3B4JyxcbiAgICAgIGxlZnQgIDogJzE1cHgnLFxuICAgICAgdG9wICAgOiAgbnVsbCxcbiAgICAgIHJpZ2h0IDogIG51bGxcbiAgICB9KVxuICB9XG5cbiAgY29uc3QgY3JlYXRlQWxlcnQgPSAodGVtcGxhdGUsIHRpbWUsIGNvbmZpZykgPT4ge1xuICAgIGlmKGFsZXJ0cy5maWx0ZXIoYWxlcnQgPT4gYW5ndWxhci5lcXVhbHMoYWxlcnQsIGNvbmZpZykpLmxlbmd0aCA+IDApe1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhbGVydHMucHVzaChjb25maWcpO1xuICAgIGxldCBvbkRpc21pc3MsIG9uUm9sbGJhY2ssIGVsbSA9IGFuZ3VsYXIuZWxlbWVudCh0ZW1wbGF0ZS50b0RPTSgpKTtcbiAgICBnZXRFbGVtZW50Qm9keSgpLmFwcGVuZENoaWxkKGVsbVswXSk7XG5cbiAgICBib3R0b21MZWZ0KGVsbSk7XG5cbiAgICBlbG0uZmluZCgnYnV0dG9uW2NsYXNzPVwiY2xvc2VcIl0nKS5jbGljaygoZXZ0KSA9PiB7XG4gICAgICBjbG9zZUFsZXJ0KGVsbVswXSk7XG4gICAgICBvbkRpc21pc3MgPyBvbkRpc21pc3MoZXZ0KSA6IGFuZ3VsYXIubm9vcCgpXG4gICAgfSk7XG5cbiAgICBlbG0uZmluZCgnYVtjbGFzcz1cImFjdGlvblwiXScpLmNsaWNrKChldnQpID0+IG9uUm9sbGJhY2sgPyBvblJvbGxiYWNrKGV2dCkgOiBhbmd1bGFyLm5vb3AoKSk7XG5cbiAgICB0aW1lID8gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjbG9zZUFsZXJ0KGVsbVswXSwgY29uZmlnKTtcbiAgICAgIG9uRGlzbWlzcyA/IG9uRGlzbWlzcygpIDogYW5ndWxhci5ub29wKCk7XG4gICAgfSwgdGltZSkgOiBhbmd1bGFyLm5vb3AoKTtcblxuICAgIHJldHVybiB7XG4gICAgICBwb3NpdGlvbihwb3NpdGlvbil7XG5cbiAgICAgIH0sXG4gICAgICBvbkRpc21pc3MoY2FsbGJhY2spIHtcbiAgICAgICAgb25EaXNtaXNzID0gY2FsbGJhY2s7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSxcbiAgICAgIG9uUm9sbGJhY2soY2FsbGJhY2spIHtcbiAgICAgICAgZWxtLmZpbmQoJ2FbY2xhc3M9XCJhY3Rpb25cIl0nKS5jc3MoeyBkaXNwbGF5OiAnYmxvY2snIH0pO1xuICAgICAgICBvblJvbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSxcbiAgICAgIGNsb3NlKCl7XG4gICAgICAgIGNsb3NlQWxlcnQoZWxtWzBdKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAkZ2V0KCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN1Y2Nlc3M6IHN1Y2Nlc3MsXG4gICAgICAgICAgZXJyb3IgIDogZXJyb3IsXG4gICAgICAgICAgd2FybmluZzogd2FybmluZyxcbiAgICAgICAgICBpbmZvICAgOiBpbmZvXG4gICAgICAgIH07XG4gICAgICB9XG4gIH1cbn1cblxuUHJvdmlkZXIuJGluamVjdCA9IFtdO1xuXG5leHBvcnQgZGVmYXVsdCBQcm92aWRlclxuIiwiZnVuY3Rpb24gaXNET01BdHRyTW9kaWZpZWRTdXBwb3J0ZWQoKSB7XG5cdFx0dmFyIHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cdFx0dmFyIGZsYWcgPSBmYWxzZTtcblxuXHRcdGlmIChwLmFkZEV2ZW50TGlzdGVuZXIpIHtcblx0XHRcdHAuYWRkRXZlbnRMaXN0ZW5lcignRE9NQXR0ck1vZGlmaWVkJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGZsYWcgPSB0cnVlXG5cdFx0XHR9LCBmYWxzZSk7XG5cdFx0fSBlbHNlIGlmIChwLmF0dGFjaEV2ZW50KSB7XG5cdFx0XHRwLmF0dGFjaEV2ZW50KCdvbkRPTUF0dHJNb2RpZmllZCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRmbGFnID0gdHJ1ZVxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0cC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3RhcmdldCcpO1xuXHRcdHJldHVybiBmbGFnO1xuXHR9XG5cblx0ZnVuY3Rpb24gY2hlY2tBdHRyaWJ1dGVzKGNoa0F0dHIsIGUpIHtcblx0XHRpZiAoY2hrQXR0cikge1xuXHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSB0aGlzLmRhdGEoJ2F0dHItb2xkLXZhbHVlJyk7XG5cblx0XHRcdGlmIChlLmF0dHJpYnV0ZU5hbWUuaW5kZXhPZignc3R5bGUnKSA+PSAwKSB7XG5cdFx0XHRcdGlmICghYXR0cmlidXRlc1snc3R5bGUnXSlcblx0XHRcdFx0XHRhdHRyaWJ1dGVzWydzdHlsZSddID0ge307IC8vaW5pdGlhbGl6ZVxuXHRcdFx0XHR2YXIga2V5cyA9IGUuYXR0cmlidXRlTmFtZS5zcGxpdCgnLicpO1xuXHRcdFx0XHRlLmF0dHJpYnV0ZU5hbWUgPSBrZXlzWzBdO1xuXHRcdFx0XHRlLm9sZFZhbHVlID0gYXR0cmlidXRlc1snc3R5bGUnXVtrZXlzWzFdXTsgLy9vbGQgdmFsdWVcblx0XHRcdFx0ZS5uZXdWYWx1ZSA9IGtleXNbMV0gKyAnOidcblx0XHRcdFx0XHRcdCsgdGhpcy5wcm9wKFwic3R5bGVcIilbJC5jYW1lbENhc2Uoa2V5c1sxXSldOyAvL25ldyB2YWx1ZVxuXHRcdFx0XHRhdHRyaWJ1dGVzWydzdHlsZSddW2tleXNbMV1dID0gZS5uZXdWYWx1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGUub2xkVmFsdWUgPSBhdHRyaWJ1dGVzW2UuYXR0cmlidXRlTmFtZV07XG5cdFx0XHRcdGUubmV3VmFsdWUgPSB0aGlzLmF0dHIoZS5hdHRyaWJ1dGVOYW1lKTtcblx0XHRcdFx0YXR0cmlidXRlc1tlLmF0dHJpYnV0ZU5hbWVdID0gZS5uZXdWYWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5kYXRhKCdhdHRyLW9sZC12YWx1ZScsIGF0dHJpYnV0ZXMpOyAvL3VwZGF0ZSB0aGUgb2xkIHZhbHVlIG9iamVjdFxuXHRcdH1cblx0fVxuXG5cdC8vaW5pdGlhbGl6ZSBNdXRhdGlvbiBPYnNlcnZlclxuXHR2YXIgTXV0YXRpb25PYnNlcnZlciA9IHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyXG5cdFx0XHR8fCB3aW5kb3cuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcblxuXHRhbmd1bGFyLmVsZW1lbnQuZm4uYXR0cmNoYW5nZSA9IGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRpZiAodHlwZW9mIGEgPT0gJ29iamVjdCcpIHsvL2NvcmVcblx0XHRcdHZhciBjZmcgPSB7XG5cdFx0XHRcdHRyYWNrVmFsdWVzIDogZmFsc2UsXG5cdFx0XHRcdGNhbGxiYWNrIDogJC5ub29wXG5cdFx0XHR9O1xuXHRcdFx0Ly9iYWNrd2FyZCBjb21wYXRpYmlsaXR5XG5cdFx0XHRpZiAodHlwZW9mIGEgPT09IFwiZnVuY3Rpb25cIikgeyBjZmcuY2FsbGJhY2sgPSBhOyB9IGVsc2UgeyAkLmV4dGVuZChjZmcsIGEpOyB9XG5cblx0XHRcdGlmIChjZmcudHJhY2tWYWx1ZXMpIHsgLy9nZXQgYXR0cmlidXRlcyBvbGQgdmFsdWVcblx0XHRcdFx0dGhpcy5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG5cdFx0XHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSB7fTtcblx0XHRcdFx0XHRmb3IgKCB2YXIgYXR0ciwgaSA9IDAsIGF0dHJzID0gZWwuYXR0cmlidXRlcywgbCA9IGF0dHJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHRcdFx0XHRcdFx0YXR0ciA9IGF0dHJzLml0ZW0oaSk7XG5cdFx0XHRcdFx0XHRhdHRyaWJ1dGVzW2F0dHIubm9kZU5hbWVdID0gYXR0ci52YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JCh0aGlzKS5kYXRhKCdhdHRyLW9sZC12YWx1ZScsIGF0dHJpYnV0ZXMpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKE11dGF0aW9uT2JzZXJ2ZXIpIHsgLy9Nb2Rlcm4gQnJvd3NlcnMgc3VwcG9ydGluZyBNdXRhdGlvbk9ic2VydmVyXG5cdFx0XHRcdHZhciBtT3B0aW9ucyA9IHtcblx0XHRcdFx0XHRzdWJ0cmVlIDogZmFsc2UsXG5cdFx0XHRcdFx0YXR0cmlidXRlcyA6IHRydWUsXG5cdFx0XHRcdFx0YXR0cmlidXRlT2xkVmFsdWUgOiBjZmcudHJhY2tWYWx1ZXNcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24obXV0YXRpb25zKSB7XG5cdFx0XHRcdFx0bXV0YXRpb25zLmZvckVhY2goZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdFx0dmFyIF90aGlzID0gZS50YXJnZXQ7XG5cdFx0XHRcdFx0XHQvL2dldCBuZXcgdmFsdWUgaWYgdHJhY2tWYWx1ZXMgaXMgdHJ1ZVxuXHRcdFx0XHRcdFx0aWYgKGNmZy50cmFja1ZhbHVlcykge1xuXHRcdFx0XHRcdFx0XHRlLm5ld1ZhbHVlID0gJChfdGhpcykuYXR0cihlLmF0dHJpYnV0ZU5hbWUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCQoX3RoaXMpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJykgPT09ICdjb25uZWN0ZWQnKSB7IC8vZXhlY3V0ZSBpZiBjb25uZWN0ZWRcblx0XHRcdFx0XHRcdFx0Y2ZnLmNhbGxiYWNrLmNhbGwoX3RoaXMsIGUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhKCdhdHRyY2hhbmdlLW1ldGhvZCcsICdNdXRhdGlvbiBPYnNlcnZlcicpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJywgJ2Nvbm5lY3RlZCcpXG5cdFx0XHRcdFx0XHQuZGF0YSgnYXR0cmNoYW5nZS1vYnMnLCBvYnNlcnZlcikuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0b2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLCBtT3B0aW9ucyk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSBpZiAoaXNET01BdHRyTW9kaWZpZWRTdXBwb3J0ZWQoKSkgeyAvL09wZXJhXG5cdFx0XHRcdC8vR29vZCBvbGQgTXV0YXRpb24gRXZlbnRzXG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEoJ2F0dHJjaGFuZ2UtbWV0aG9kJywgJ0RPTUF0dHJNb2RpZmllZCcpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJywgJ2Nvbm5lY3RlZCcpLm9uKCdET01BdHRyTW9kaWZpZWQnLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRcdGlmIChldmVudC5vcmlnaW5hbEV2ZW50KSB7IGV2ZW50ID0gZXZlbnQub3JpZ2luYWxFdmVudDsgfS8valF1ZXJ5IG5vcm1hbGl6YXRpb24gaXMgbm90IHJlcXVpcmVkXG5cdFx0XHRcdFx0ZXZlbnQuYXR0cmlidXRlTmFtZSA9IGV2ZW50LmF0dHJOYW1lOyAvL3Byb3BlcnR5IG5hbWVzIHRvIGJlIGNvbnNpc3RlbnQgd2l0aCBNdXRhdGlvbk9ic2VydmVyXG5cdFx0XHRcdFx0ZXZlbnQub2xkVmFsdWUgPSBldmVudC5wcmV2VmFsdWU7IC8vcHJvcGVydHkgbmFtZXMgdG8gYmUgY29uc2lzdGVudCB3aXRoIE11dGF0aW9uT2JzZXJ2ZXJcblx0XHRcdFx0XHRpZiAoJCh0aGlzKS5kYXRhKCdhdHRyY2hhbmdlLXN0YXR1cycpID09PSAnY29ubmVjdGVkJykgeyAvL2Rpc2Nvbm5lY3RlZCBsb2dpY2FsbHlcblx0XHRcdFx0XHRcdGNmZy5jYWxsYmFjay5jYWxsKHRoaXMsIGV2ZW50KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIGlmICgnb25wcm9wZXJ0eWNoYW5nZScgaW4gZG9jdW1lbnQuYm9keSkgeyAvL3dvcmtzIG9ubHkgaW4gSUVcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YSgnYXR0cmNoYW5nZS1tZXRob2QnLCAncHJvcGVydHljaGFuZ2UnKS5kYXRhKCdhdHRyY2hhbmdlLXN0YXR1cycsICdjb25uZWN0ZWQnKS5vbigncHJvcGVydHljaGFuZ2UnLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0ZS5hdHRyaWJ1dGVOYW1lID0gd2luZG93LmV2ZW50LnByb3BlcnR5TmFtZTtcblx0XHRcdFx0XHQvL3RvIHNldCB0aGUgYXR0ciBvbGQgdmFsdWVcblx0XHRcdFx0XHRjaGVja0F0dHJpYnV0ZXMuY2FsbCgkKHRoaXMpLCBjZmcudHJhY2tWYWx1ZXMsIGUpO1xuXHRcdFx0XHRcdGlmICgkKHRoaXMpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJykgPT09ICdjb25uZWN0ZWQnKSB7IC8vZGlzY29ubmVjdGVkIGxvZ2ljYWxseVxuXHRcdFx0XHRcdFx0Y2ZnLmNhbGxiYWNrLmNhbGwodGhpcywgZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIGEgPT0gJ3N0cmluZycgJiYgJC5mbi5hdHRyY2hhbmdlLmhhc093blByb3BlcnR5KCdleHRlbnNpb25zJykgJiZcblx0XHRcdFx0YW5ndWxhci5lbGVtZW50LmZuLmF0dHJjaGFuZ2VbJ2V4dGVuc2lvbnMnXS5oYXNPd25Qcm9wZXJ0eShhKSkgeyAvL2V4dGVuc2lvbnMvb3B0aW9uc1xuXHRcdFx0cmV0dXJuICQuZm4uYXR0cmNoYW5nZVsnZXh0ZW5zaW9ucyddW2FdLmNhbGwodGhpcywgYik7XG5cdFx0fVxuXHR9XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICB0cmFuc2NsdWRlOiB0cnVlLFxuICBiaW5kaW5nczoge1xuICAgIGZvcmNlQ2xpY2s6ICc9PycsXG4gICAgb3BlbmVkOiAnPT8nXG4gIH0sXG4gIHRlbXBsYXRlOiBgPG5nLXRyYW5zY2x1ZGU+PC9uZy10cmFuc2NsdWRlPmAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCckYXR0cnMnLCckdGltZW91dCcsICckcGFyc2UnLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0aW1lb3V0LCRwYXJzZSkge1xuICAgIGxldCBjdHJsID0gdGhpcztcblxuICAgIGNvbnN0IGhhbmRsaW5nT3B0aW9ucyA9IChlbGVtZW50cykgPT4ge1xuICAgICAgJHRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBhbmd1bGFyLmZvckVhY2goZWxlbWVudHMsIChvcHRpb24pID0+IHtcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQob3B0aW9uKS5jc3Moe2xlZnQ6IChtZWFzdXJlVGV4dChhbmd1bGFyLmVsZW1lbnQob3B0aW9uKS50ZXh0KCksICcxNCcsIG9wdGlvbi5zdHlsZSkud2lkdGggKyAzMCkgKiAtMX0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWVhc3VyZVRleHQocFRleHQsIHBGb250U2l6ZSwgcFN0eWxlKSB7XG4gICAgICAgIHZhciBsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobERpdik7XG5cbiAgICAgICAgaWYgKHBTdHlsZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBsRGl2LnN0eWxlID0gcFN0eWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgbERpdi5zdHlsZS5mb250U2l6ZSA9IFwiXCIgKyBwRm9udFNpemUgKyBcInB4XCI7XG4gICAgICAgIGxEaXYuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICAgIGxEaXYuc3R5bGUubGVmdCA9IC0xMDAwO1xuICAgICAgICBsRGl2LnN0eWxlLnRvcCA9IC0xMDAwO1xuXG4gICAgICAgIGxEaXYuaW5uZXJIVE1MID0gcFRleHQ7XG5cbiAgICAgICAgdmFyIGxSZXN1bHQgPSB7XG4gICAgICAgICAgICB3aWR0aDogbERpdi5jbGllbnRXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogbERpdi5jbGllbnRIZWlnaHRcbiAgICAgICAgfTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxEaXYpO1xuXG4gICAgICAgIGxEaXYgPSBudWxsO1xuXG4gICAgICAgIHJldHVybiBsUmVzdWx0O1xuICAgIH1cblxuICAgIGNvbnN0IHdpdGhGb2N1cyA9ICh1bCkgPT4ge1xuICAgICAgJGVsZW1lbnQub24oJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICAgIGlmKGN0cmwub3BlbmVkKXtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRlbGVtZW50LmZpbmQoJ3VsJyksICh1bCkgPT4ge1xuICAgICAgICAgIHZlcmlmeVBvc2l0aW9uKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICAgIGhhbmRsaW5nT3B0aW9ucyhhbmd1bGFyLmVsZW1lbnQodWwpLmZpbmQoJ2xpID4gc3BhbicpKTtcbiAgICAgICAgfSlcbiAgICAgICAgb3Blbih1bCk7XG4gICAgICB9KTtcbiAgICAgICRlbGVtZW50Lm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgICBpZihjdHJsLm9wZW5lZCl7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZlcmlmeVBvc2l0aW9uKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICBjbG9zZSh1bCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBjbG9zZSA9ICh1bCkgPT4ge1xuICAgICAgaWYodWxbMF0uaGFzQXR0cmlidXRlKCdsZWZ0Jykpe1xuICAgICAgICB1bC5maW5kKCdsaScpLmNzcyh7dHJhbnNmb3JtOiAncm90YXRlKDkwZGVnKSBzY2FsZSgwLjMpJ30pO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHVsLmZpbmQoJ2xpJykuY3NzKHt0cmFuc2Zvcm06ICdzY2FsZSgwLjMpJ30pO1xuICAgICAgfVxuICAgICAgdWwuZmluZCgnbGkgPiBzcGFuJykuY3NzKHtvcGFjaXR5OiAnMCcsIHBvc2l0aW9uOiAnYWJzb2x1dGUnfSlcbiAgICAgIHVsLmNzcyh7dmlzaWJpbGl0eTogXCJoaWRkZW5cIiwgb3BhY2l0eTogJzAnfSlcbiAgICAgIHVsLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICAvLyBpZihjdHJsLm9wZW5lZCl7XG4gICAgICAvLyAgIGN0cmwub3BlbmVkID0gZmFsc2U7XG4gICAgICAvLyAgICRzY29wZS4kZGlnZXN0KCk7XG4gICAgICAvLyB9XG4gICAgfVxuXG4gICAgY29uc3Qgb3BlbiA9ICh1bCkgPT4ge1xuICAgICAgaWYodWxbMF0uaGFzQXR0cmlidXRlKCdsZWZ0Jykpe1xuICAgICAgICB1bC5maW5kKCdsaScpLmNzcyh7dHJhbnNmb3JtOiAncm90YXRlKDkwZGVnKSBzY2FsZSgxKSd9KTtcbiAgICAgIH1lbHNle1xuICAgICAgICB1bC5maW5kKCdsaScpLmNzcyh7dHJhbnNmb3JtOiAncm90YXRlKDBkZWcpIHNjYWxlKDEpJ30pO1xuICAgICAgfVxuICAgICAgdWwuZmluZCgnbGkgPiBzcGFuJykuaG92ZXIoZnVuY3Rpb24oKXtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KHRoaXMpLmNzcyh7b3BhY2l0eTogJzEnLCBwb3NpdGlvbjogJ2Fic29sdXRlJ30pXG4gICAgICB9KVxuICAgICAgdWwuY3NzKHt2aXNpYmlsaXR5OiBcInZpc2libGVcIiwgb3BhY2l0eTogJzEnfSlcbiAgICAgIHVsLmFkZENsYXNzKCdvcGVuJyk7XG4gICAgICAvLyBpZighY3RybC5vcGVuZWQpe1xuICAgICAgLy8gICBjdHJsLm9wZW5lZCA9IHRydWU7XG4gICAgICAvLyAgICRzY29wZS4kZGlnZXN0KCk7XG4gICAgICAvLyB9XG4gICAgfVxuXG4gICAgY29uc3Qgd2l0aENsaWNrID0gKHVsKSA9PiB7XG4gICAgICAgJGVsZW1lbnQuZmluZCgnYnV0dG9uJykuZmlyc3QoKS5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICBpZih1bC5oYXNDbGFzcygnb3BlbicpKXtcbiAgICAgICAgICAgY2xvc2UodWwpO1xuICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgIG9wZW4odWwpO1xuICAgICAgICAgfVxuICAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgdmVyaWZ5UG9zaXRpb24gPSAodWwpID0+IHtcbiAgICAgICRlbGVtZW50LmNzcyh7ZGlzcGxheTogXCJpbmxpbmUtYmxvY2tcIn0pO1xuICAgICAgaWYodWxbMF0uaGFzQXR0cmlidXRlKCdsZWZ0Jykpe1xuICAgICAgICBsZXQgd2lkdGggPSAwLCBsaXMgPSB1bC5maW5kKCdsaScpO1xuICAgICAgICBhbmd1bGFyLmZvckVhY2gobGlzLCBsaSA9PiB3aWR0aCs9YW5ndWxhci5lbGVtZW50KGxpKVswXS5vZmZzZXRXaWR0aCk7XG4gICAgICAgIGNvbnN0IHNpemUgPSAod2lkdGggKyAoMTAgKiBsaXMubGVuZ3RoKSkgKiAtMTtcbiAgICAgICAgdWwuY3NzKHtsZWZ0OiBzaXplfSk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHVsLmhlaWdodCgpO1xuICAgICAgICB1bC5jc3Moe3RvcDogc2l6ZSAqIC0xfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAkc2NvcGUuJHdhdGNoKCckY3RybC5vcGVuZWQnLCAodmFsdWUpID0+IHtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRlbGVtZW50LmZpbmQoJ3VsJyksICh1bCkgPT4ge1xuICAgICAgICAgIHZlcmlmeVBvc2l0aW9uKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICAgIGhhbmRsaW5nT3B0aW9ucyhhbmd1bGFyLmVsZW1lbnQodWwpLmZpbmQoJ2xpID4gc3BhbicpKTtcbiAgICAgICAgICBpZih2YWx1ZSl7XG4gICAgICAgICAgICBvcGVuKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIGNsb3NlKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgIH0sIHRydWUpO1xuXG4gICAgJGVsZW1lbnQucmVhZHkoKCkgPT4ge1xuICAgICAgJHRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBhbmd1bGFyLmZvckVhY2goJGVsZW1lbnQuZmluZCgndWwnKSwgKHVsKSA9PiB7XG4gICAgICAgICAgdmVyaWZ5UG9zaXRpb24oYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgaGFuZGxpbmdPcHRpb25zKGFuZ3VsYXIuZWxlbWVudCh1bCkuZmluZCgnbGkgPiBzcGFuJykpO1xuICAgICAgICAgIGlmKCFjdHJsLmZvcmNlQ2xpY2spe1xuICAgICAgICAgICAgd2l0aEZvY3VzKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgd2l0aENsaWNrKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIGJpbmRpbmdzOiB7XG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGEgY2xhc3M9XCJuYXZiYXItYnJhbmRcIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwubmF2Q29sbGFwc2UoKVwiIHN0eWxlPVwicG9zaXRpb246IHJlbGF0aXZlO2N1cnNvcjogcG9pbnRlcjtcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJuYXZUcmlnZ2VyXCI+XG4gICAgICAgIDxpPjwvaT48aT48L2k+PGk+PC9pPlxuICAgICAgPC9kaXY+XG4gICAgPC9hPlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywnJGF0dHJzJywnJHRpbWVvdXQnLCAnJHBhcnNlJywgZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdGltZW91dCwkcGFyc2UpIHtcbiAgICBsZXQgY3RybCA9IHRoaXM7XG5cbiAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICBhbmd1bGFyLmVsZW1lbnQoXCJuYXYuZ2wtbmF2XCIpLmF0dHJjaGFuZ2Uoe1xuICAgICAgICAgIHRyYWNrVmFsdWVzOiB0cnVlLFxuICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihldm50KSB7XG4gICAgICAgICAgICBpZihldm50LmF0dHJpYnV0ZU5hbWUgPT0gJ2NsYXNzJyl7XG4gICAgICAgICAgICAgIGN0cmwudG9nZ2xlSGFtYnVyZ2VyKGV2bnQubmV3VmFsdWUuaW5kZXhPZignY29sbGFwc2VkJykgIT0gLTEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjdHJsLnRvZ2dsZUhhbWJ1cmdlciA9IChpc0NvbGxhcHNlZCkgPT4ge1xuICAgICAgICBpc0NvbGxhcHNlZCA/ICRlbGVtZW50LmZpbmQoJ2Rpdi5uYXZUcmlnZ2VyJykuYWRkQ2xhc3MoJ2FjdGl2ZScpIDogJGVsZW1lbnQuZmluZCgnZGl2Lm5hdlRyaWdnZXInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICB9XG5cbiAgICAgIGN0cmwubmF2Q29sbGFwc2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmd1bWdhLWxheW91dCBuYXYuZ2wtbmF2JylcbiAgICAgICAgICAuY2xhc3NMaXN0LnRvZ2dsZSgnY29sbGFwc2VkJyk7XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudChcIm5hdi5nbC1uYXZcIikuYXR0cmNoYW5nZSh7XG4gICAgICAgICAgICB0cmFja1ZhbHVlczogdHJ1ZSxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihldm50KSB7XG4gICAgICAgICAgICAgIGlmKGV2bnQuYXR0cmlidXRlTmFtZSA9PSAnY2xhc3MnKXtcbiAgICAgICAgICAgICAgICBjdHJsLnRvZ2dsZUhhbWJ1cmdlcihldm50Lm5ld1ZhbHVlLmluZGV4T2YoJ2NvbGxhcHNlZCcpICE9IC0xKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY3RybC50b2dnbGVIYW1idXJnZXIoYW5ndWxhci5lbGVtZW50KCduYXYuZ2wtbmF2JykuaGFzQ2xhc3MoJ2NvbGxhcHNlZCcpKTtcbiAgICB9XG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50O1xuIiwiaW1wb3J0IE1lbnUgICAgICAgICBmcm9tICcuL21lbnUvY29tcG9uZW50LmpzJztcbmltcG9ydCBNZW51U2hyaW5rICAgICAgICAgZnJvbSAnLi9tZW51LXNocmluay9jb21wb25lbnQuanMnO1xuaW1wb3J0IEdtZE5vdGlmaWNhdGlvbiBmcm9tICcuL25vdGlmaWNhdGlvbi9jb21wb25lbnQuanMnO1xuaW1wb3J0IFNlbGVjdCAgICAgICBmcm9tICcuL3NlbGVjdC9jb21wb25lbnQuanMnO1xuaW1wb3J0IFNlbGVjdFNlYXJjaCAgICAgICBmcm9tICcuL3NlbGVjdC9zZWFyY2gvY29tcG9uZW50LmpzJztcbmltcG9ydCBPcHRpb24gICAgICAgZnJvbSAnLi9zZWxlY3Qvb3B0aW9uL2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgT3B0aW9uRW1wdHkgICAgICAgZnJvbSAnLi9zZWxlY3QvZW1wdHkvY29tcG9uZW50LmpzJztcbmltcG9ydCBJbnB1dCAgICAgICAgZnJvbSAnLi9pbnB1dC9jb21wb25lbnQuanMnO1xuaW1wb3J0IFJpcHBsZSAgICAgICBmcm9tICcuL3JpcHBsZS9jb21wb25lbnQuanMnO1xuaW1wb3J0IEZhYiAgICAgICAgICBmcm9tICcuL2ZhYi9jb21wb25lbnQuanMnO1xuaW1wb3J0IFNwaW5uZXIgICAgICBmcm9tICcuL3NwaW5uZXIvY29tcG9uZW50LmpzJztcbmltcG9ydCBIYW1idXJnZXIgICAgICBmcm9tICcuL2hhbWJ1cmdlci9jb21wb25lbnQuanMnO1xuaW1wb3J0IEFsZXJ0ICAgICAgZnJvbSAnLi9hbGVydC9wcm92aWRlci5qcyc7XG5pbXBvcnQgVGhlbWUgICAgICBmcm9tICcuL3RoZW1lL3Byb3ZpZGVyLmpzJztcblxuYW5ndWxhclxuICAubW9kdWxlKCdndW1nYS5sYXlvdXQnLCBbXSlcbiAgLnByb3ZpZGVyKCckZ21kQWxlcnQnLCBBbGVydClcbiAgLnByb3ZpZGVyKCckZ21kVGhlbWUnLCBUaGVtZSlcbiAgLmRpcmVjdGl2ZSgnZ21kUmlwcGxlJywgUmlwcGxlKVxuICAuY29tcG9uZW50KCdnbE1lbnUnLCBNZW51KVxuICAuY29tcG9uZW50KCdtZW51U2hyaW5rJywgTWVudVNocmluaylcbiAgLmNvbXBvbmVudCgnZ2xOb3RpZmljYXRpb24nLCBHbWROb3RpZmljYXRpb24pXG4gIC5jb21wb25lbnQoJ2dtZFNlbGVjdCcsIFNlbGVjdClcbiAgLmNvbXBvbmVudCgnZ21kU2VsZWN0U2VhcmNoJywgU2VsZWN0U2VhcmNoKVxuICAuY29tcG9uZW50KCdnbWRPcHRpb25FbXB0eScsIE9wdGlvbkVtcHR5KVxuICAuY29tcG9uZW50KCdnbWRPcHRpb24nLCBPcHRpb24pXG4gIC5jb21wb25lbnQoJ2dtZElucHV0JywgSW5wdXQpXG4gIC5jb21wb25lbnQoJ2dtZEZhYicsIEZhYilcbiAgLmNvbXBvbmVudCgnZ21kU3Bpbm5lcicsIFNwaW5uZXIpXG4gIC5jb21wb25lbnQoJ2dtZEhhbWJ1cmdlcicsIEhhbWJ1cmdlcilcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIGJpbmRpbmdzOiB7XG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBuZy10cmFuc2NsdWRlPjwvZGl2PlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywnJGF0dHJzJywnJHRpbWVvdXQnLCAnJHBhcnNlJywgZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdGltZW91dCwkcGFyc2UpIHtcbiAgICBsZXQgY3RybCA9IHRoaXMsXG4gICAgICAgIGlucHV0LFxuICAgICAgICBtb2RlbDtcblxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGxldCBjaGFuZ2VBY3RpdmUgPSB0YXJnZXQgPT4ge1xuICAgICAgICBpZiAodGFyZ2V0LnZhbHVlKSB7XG4gICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGN0cmwuJGRvQ2hlY2sgPSAoKSA9PiB7XG4gICAgICAgIGlmIChpbnB1dCAmJiBpbnB1dFswXSkgY2hhbmdlQWN0aXZlKGlucHV0WzBdKVxuICAgICAgfVxuICAgICAgY3RybC4kcG9zdExpbmsgPSAoKSA9PiB7XG4gICAgICAgIGxldCBnbWRJbnB1dCA9ICRlbGVtZW50LmZpbmQoJ2lucHV0Jyk7XG4gICAgICAgIGlmKGdtZElucHV0WzBdKXtcbiAgICAgICAgICBpbnB1dCA9IGFuZ3VsYXIuZWxlbWVudChnbWRJbnB1dClcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgaW5wdXQgPSBhbmd1bGFyLmVsZW1lbnQoJGVsZW1lbnQuZmluZCgndGV4dGFyZWEnKSk7XG4gICAgICAgIH1cbiAgICAgICAgbW9kZWwgPSBpbnB1dC5hdHRyKCduZy1tb2RlbCcpIHx8IGlucHV0LmF0dHIoJ2RhdGEtbmctbW9kZWwnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgYmluZGluZ3M6IHtcbiAgICAgICAgbWVudTogJzwnLFxuICAgICAgICBrZXlzOiAnPCcsXG4gICAgICAgIGxvZ286ICdAPycsXG4gICAgICAgIGxhcmdlTG9nbzogJ0A/JyxcbiAgICAgICAgc21hbGxMb2dvOiAnQD8nLFxuICAgICAgICBoaWRlU2VhcmNoOiAnPT8nLFxuICAgICAgICBpc09wZW5lZDogJz0/JyxcbiAgICAgICAgaWNvbkZpcnN0TGV2ZWw6ICdAPycsXG4gICAgICAgIHNob3dCdXR0b25GaXJzdExldmVsOiAnPT8nLFxuICAgICAgICB0ZXh0Rmlyc3RMZXZlbDogJ0A/JyxcbiAgICAgICAgaXRlbURpc2FibGVkOiAnJj8nXG4gICAgfSxcbiAgICB0ZW1wbGF0ZTogYFxuXG4gICAgPG5hdiBjbGFzcz1cIm1haW4tbWVudVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibWVudS1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxpbWcgbmctaW5pdD1cIiRjdHJsLm9ic2VydmVFcnJvcigpXCIgbmctaWY9XCIkY3RybC5sb2dvXCIgbmctc3JjPVwie3skY3RybC5sb2dvfX1cIi8+XG4gICAgICAgICAgICA8aW1nIG5nLWluaXQ9XCIkY3RybC5vYnNlcnZlRXJyb3IoKVwiIGNsYXNzPVwibGFyZ2VcIiBuZy1pZj1cIiRjdHJsLmxhcmdlTG9nb1wiIG5nLXNyYz1cInt7JGN0cmwubGFyZ2VMb2dvfX1cIi8+XG4gICAgICAgICAgICA8aW1nIG5nLWluaXQ9XCIkY3RybC5vYnNlcnZlRXJyb3IoKVwiIGNsYXNzPVwic21hbGxcIiBuZy1pZj1cIiRjdHJsLnNtYWxsTG9nb1wiIG5nLXNyYz1cInt7JGN0cmwuc21hbGxMb2dvfX1cIi8+XG5cbiAgICAgICAgICAgIDxzdmcgdmVyc2lvbj1cIjEuMVwiIG5nLWNsaWNrPVwiJGN0cmwudG9nZ2xlTWVudSgpXCIgaWQ9XCJDYXBhXzFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIlxuICAgICAgICAgICAgICAgIHdpZHRoPVwiNjEzLjQwOHB4XCIgaGVpZ2h0PVwiNjEzLjQwOHB4XCIgdmlld0JveD1cIjAgMCA2MTMuNDA4IDYxMy40MDhcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPlxuICAgICAgICAgICAgICAgIDxnPlxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNjA1LjI1NCwxNjguOTRMNDQzLjc5Miw3LjQ1N2MtNi45MjQtNi44ODItMTcuMTAyLTkuMjM5LTI2LjMxOS02LjA2OWMtOS4xNzcsMy4xMjgtMTUuODA5LDExLjI0MS0xNy4wMTksMjAuODU1XG4gICAgICAgICAgICAgICAgICAgIGwtOS4wOTMsNzAuNTEyTDI2Ny41ODUsMjE2LjQyOGgtMTQyLjY1Yy0xMC4zNDQsMC0xOS42MjUsNi4yMTUtMjMuNjI5LDE1Ljc0NmMtMy45Miw5LjU3My0xLjcxLDIwLjUyMiw1LjU4OSwyNy43NzlcbiAgICAgICAgICAgICAgICAgICAgbDEwNS40MjQsMTA1LjQwM0wwLjY5OSw2MTMuNDA4bDI0Ni42MzUtMjEyLjg2OWwxMDUuNDIzLDEwNS40MDJjNC44ODEsNC44ODEsMTEuNDUsNy40NjcsMTcuOTk5LDcuNDY3XG4gICAgICAgICAgICAgICAgICAgIGMzLjI5NSwwLDYuNjMyLTAuNzA5LDkuNzgtMi4wMDJjOS41NzMtMy45MjIsMTUuNzI2LTEzLjI0NCwxNS43MjYtMjMuNTA0VjM0NS4xNjhsMTIzLjgzOS0xMjMuNzE0bDcwLjQyOS05LjE3NlxuICAgICAgICAgICAgICAgICAgICBjOS42MTQtMS4yNTEsMTcuNzI3LTcuODYyLDIwLjgxMy0xNy4wMzlDNjE0LjQ3MiwxODYuMDIxLDYxMi4xMzYsMTc1LjgwMSw2MDUuMjU0LDE2OC45NHogTTUwNC44NTYsMTcxLjk4NVxuICAgICAgICAgICAgICAgICAgICBjLTUuNTY4LDAuNzUxLTEwLjc2MiwzLjIzMi0xNC43NDUsNy4yMzdMMzUyLjc1OCwzMTYuNTk2Yy00Ljc5Niw0Ljc3NS03LjQ2NiwxMS4yNDItNy40NjYsMTguMDQxdjkxLjc0MkwxODYuNDM3LDI2Ny40ODFoOTEuNjhcbiAgICAgICAgICAgICAgICAgICAgYzYuNzU3LDAsMTMuMjQzLTIuNjY5LDE4LjA0LTcuNDY2TDQzMy41MSwxMjIuNzY2YzMuOTgzLTMuOTgzLDYuNTY5LTkuMTc2LDcuMjU4LTE0Ljc4NmwzLjYyOS0yNy42OTZsODguMTU1LDg4LjExNFxuICAgICAgICAgICAgICAgICAgICBMNTA0Ljg1NiwxNzEuOTg1elwiLz5cbiAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICA8L3N2Zz5cblxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInNjcm9sbGJhciBzdHlsZS0xXCI+XG4gICAgICAgICAgICA8dWwgZGF0YS1uZy1jbGFzcz1cIidsZXZlbCcuY29uY2F0KCRjdHJsLmJhY2subGVuZ3RoKVwiPlxuXG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZ29iYWNrIGdtZCBnbWQtcmlwcGxlXCIgZGF0YS1uZy1zaG93PVwiJGN0cmwucHJldmlvdXMubGVuZ3RoID4gMFwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5wcmV2KClcIj5cbiAgICAgICAgICAgICAgICAgICAgPGE+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5Ym9hcmRfYXJyb3dfbGVmdFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1uZy1iaW5kPVwiJGN0cmwuYmFja1skY3RybC5iYWNrLmxlbmd0aCAtIDFdLmxhYmVsXCIgY2xhc3M9XCJuYXYtdGV4dFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG5cbiAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJnbWQtcmlwcGxlXCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1uZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLm1lbnUgfCBmaWx0ZXI6JGN0cmwuc2VhcmNoXCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1uZy1zaG93PVwiJGN0cmwuYWxsb3coaXRlbSlcIlxuICAgICAgICAgICAgICAgICAgICBkYXRhLW5nLWNsaWNrPVwiJGN0cmwubmV4dChpdGVtLCAkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1uZy1jbGFzcz1cIlshJGN0cmwuZGlzYWJsZUFuaW1hdGlvbnMgPyAkY3RybC5zbGlkZSA6ICcnLCB7J2Rpc2FibGVkJzogJGN0cmwuaXRlbURpc2FibGVkKHtpdGVtOiBpdGVtfSl9LCB7aGVhZGVyOiBpdGVtLnR5cGUgPT0gJ2hlYWRlcicsIGRpdmlkZXI6IGl0ZW0udHlwZSA9PSAnc2VwYXJhdG9yJ31dXCI+XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICA8YSBuZy1pZj1cIml0ZW0udHlwZSAhPSAnc2VwYXJhdG9yJyAmJiBpdGVtLnN0YXRlXCIgdWktc3JlZj1cInt7aXRlbS5zdGF0ZX19XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5pY29uXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIml0ZW0uaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibmF2LXRleHRcIiBuZy1iaW5kPVwiaXRlbS5sYWJlbFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmNoaWxkcmVuICYmIGl0ZW0uY2hpbGRyZW4ubGVuZ3RoID4gMFwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnMgcHVsbC1yaWdodFwiPmtleWJvYXJkX2Fycm93X3JpZ2h0PC9pPlxuICAgICAgICAgICAgICAgICAgICA8L2E+XG5cbiAgICAgICAgICAgICAgICAgICAgPGEgbmctaWY9XCJpdGVtLnR5cGUgIT0gJ3NlcGFyYXRvcicgJiYgIWl0ZW0uc3RhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmljb25cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5pY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJuYXYtdGV4dFwiIG5nLWJpbmQ9XCJpdGVtLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uY2hpbGRyZW4gJiYgaXRlbS5jaGlsZHJlbi5sZW5ndGggPiAwXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29ucyBwdWxsLXJpZ2h0XCI+a2V5Ym9hcmRfYXJyb3dfcmlnaHQ8L2k+XG4gICAgICAgICAgICAgICAgICAgIDwvYT5cblxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgICA8bmctdHJhbnNjbHVkZT48L25nLXRyYW5zY2x1ZGU+XG5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9uYXY+XG4gICAgXG4gICAgYCxcbiAgICBjb250cm9sbGVyOiBbJyR0aW1lb3V0JywgJyRhdHRycycsICckZWxlbWVudCcsIGZ1bmN0aW9uICgkdGltZW91dCwgJGF0dHJzLCAkZWxlbWVudCkge1xuICAgICAgICBsZXQgY3RybCA9IHRoaXM7XG4gICAgICAgIGN0cmwua2V5cyA9IGN0cmwua2V5cyB8fCBbXTtcbiAgICAgICAgY3RybC5pY29uRmlyc3RMZXZlbCA9IGN0cmwuaWNvbkZpcnN0TGV2ZWwgfHwgJ2dseXBoaWNvbiBnbHlwaGljb24taG9tZSc7XG4gICAgICAgIGN0cmwucHJldmlvdXMgPSBbXTtcbiAgICAgICAgY3RybC5iYWNrID0gW107XG4gICAgICAgIGxldCBtYWluQ29udGVudCwgaGVhZGVyQ29udGVudDtcblxuICAgICAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICAgICAgICBtYWluQ29udGVudCA9IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCAuZ2wtbWFpbicpO1xuICAgICAgICAgICAgaGVhZGVyQ29udGVudCA9IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCAuZ2wtaGVhZGVyJyk7XG4gICAgICAgICAgICBpZihldmFsKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2dtZC1tZW51LXNocmluaycpKSl7XG4gICAgICAgICAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ2ZpeGVkJyk7XG4gICAgICAgICAgICB9ICAgICAgICAgICAgXG4gICAgICAgIH07XG5cbiAgICAgICAgY3RybC5vYnNlcnZlRXJyb3IgPSAoKSA9PiB7XG4gICAgICAgICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGltZyA9ICRlbGVtZW50LmZpbmQoJ2ltZycpO1xuICAgICAgICAgICAgICAgIGltZy5iaW5kKCdlcnJvcicsICgpID0+IGltZy5jc3MoeydkaXNwbGF5JyA6ICdub25lJ30pKTtcbiAgICAgICAgICAgICAgICBpbWcuYmluZCgnbG9hZCcsICAoKSA9PiBpbWcuY3NzKHsnZGlzcGxheScgOiAnYmxvY2snfSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjdHJsLnRvZ2dsZU1lbnUgPSAoKSA9PiB7XG4gICAgICAgICAgICAkZWxlbWVudC50b2dnbGVDbGFzcygnZml4ZWQnKTtcbiAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2dtZC1tZW51LXNocmluaycsICRlbGVtZW50Lmhhc0NsYXNzKCdmaXhlZCcpKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjdHJsLnByZXYgPSAoKSA9PiB7XG4gICAgICAgICAgICBjdHJsLm1lbnUgPSBjdHJsLnByZXZpb3VzLnBvcCgpO1xuICAgICAgICAgICAgY3RybC5iYWNrLnBvcCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGN0cmwubmV4dCA9IChpdGVtKSA9PiB7XG4gICAgICAgICAgICBpZiAoaXRlbS5jaGlsZHJlbiAmJiBpdGVtLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjdHJsLnByZXZpb3VzLnB1c2goY3RybC5tZW51KTtcbiAgICAgICAgICAgICAgICBjdHJsLm1lbnUgPSBpdGVtLmNoaWxkcmVuO1xuICAgICAgICAgICAgICAgIGN0cmwuYmFjay5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGN0cmwuZ29CYWNrVG9GaXJzdExldmVsID0gKCkgPT4ge1xuICAgICAgICAgICAgY3RybC5tZW51ID0gY3RybC5wcmV2aW91c1swXTtcbiAgICAgICAgICAgIGN0cmwucHJldmlvdXMgPSBbXTtcbiAgICAgICAgICAgIGN0cmwuYmFjayA9IFtdO1xuICAgICAgICB9O1xuXG4gICAgICAgIGN0cmwuYWxsb3cgPSBpdGVtID0+IHtcbiAgICAgICAgICAgIGlmIChjdHJsLmtleXMgJiYgY3RybC5rZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBpZiAoIWl0ZW0ua2V5KSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3RybC5rZXlzLmluZGV4T2YoaXRlbS5rZXkpID4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICB9XVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50OyIsInJlcXVpcmUoJy4uL2F0dHJjaGFuZ2UvYXR0cmNoYW5nZScpO1xuXG5sZXQgQ29tcG9uZW50ID0ge1xuICB0cmFuc2NsdWRlOiB0cnVlLFxuICBiaW5kaW5nczoge1xuICAgIG1lbnU6ICc8JyxcbiAgICBrZXlzOiAnPCcsXG4gICAgaGlkZVNlYXJjaDogJz0/JyxcbiAgICBpc09wZW5lZDogJz0/JyxcbiAgICBpY29uRmlyc3RMZXZlbDogJ0A/JyxcbiAgICBzaG93QnV0dG9uRmlyc3RMZXZlbDogJz0/JyxcbiAgICB0ZXh0Rmlyc3RMZXZlbDogJ0A/JyxcbiAgICBkaXNhYmxlQW5pbWF0aW9uczogJz0/JyxcbiAgICBzaHJpbmtNb2RlOiAnPT8nXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG5cbiAgICA8ZGl2IHN0eWxlPVwicGFkZGluZzogMTVweCAxNXB4IDBweCAxNXB4O1wiIG5nLWlmPVwiISRjdHJsLmhpZGVTZWFyY2hcIj5cbiAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtbmctbW9kZWw9XCIkY3RybC5zZWFyY2hcIiBjbGFzcz1cImZvcm0tY29udHJvbCBnbWRcIiBwbGFjZWhvbGRlcj1cIkJ1c2NhLi4uXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiYmFyXCI+PC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi1ibG9jayBnbWRcIiBkYXRhLW5nLWlmPVwiJGN0cmwuc2hvd0J1dHRvbkZpcnN0TGV2ZWxcIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuZ29CYWNrVG9GaXJzdExldmVsKClcIiBkYXRhLW5nLWRpc2FibGVkPVwiISRjdHJsLnByZXZpb3VzLmxlbmd0aFwiIHR5cGU9XCJidXR0b25cIj5cbiAgICAgIDxpIGRhdGEtbmctY2xhc3M9XCJbJGN0cmwuaWNvbkZpcnN0TGV2ZWxdXCI+PC9pPlxuICAgICAgPHNwYW4gZGF0YS1uZy1iaW5kPVwiJGN0cmwudGV4dEZpcnN0TGV2ZWxcIj48L3NwYW4+XG4gICAgPC9idXR0b24+XG5cbiAgICA8dWwgbWVudSBkYXRhLW5nLWNsYXNzPVwiJ2xldmVsJy5jb25jYXQoJGN0cmwuYmFjay5sZW5ndGgpXCI+XG4gICAgICA8bGkgY2xhc3M9XCJnb2JhY2sgZ21kIGdtZC1yaXBwbGVcIiBkYXRhLW5nLXNob3c9XCIkY3RybC5wcmV2aW91cy5sZW5ndGggPiAwXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnByZXYoKVwiPlxuICAgICAgICA8YT5cbiAgICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+XG4gICAgICAgICAgICBrZXlib2FyZF9hcnJvd19sZWZ0XG4gICAgICAgICAgPC9pPlxuICAgICAgICAgIDxzcGFuIGRhdGEtbmctYmluZD1cIiRjdHJsLmJhY2tbJGN0cmwuYmFjay5sZW5ndGggLSAxXS5sYWJlbFwiPjwvc3Bhbj5cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cblxuICAgICAgPGxpIGNsYXNzPVwiZ21kIGdtZC1yaXBwbGVcIiBcbiAgICAgICAgICBkYXRhLW5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwubWVudSB8IGZpbHRlcjokY3RybC5zZWFyY2hcIlxuICAgICAgICAgIGRhdGEtbmctc2hvdz1cIiRjdHJsLmFsbG93KGl0ZW0pXCJcbiAgICAgICAgICBuZy1jbGljaz1cIiRjdHJsLm5leHQoaXRlbSwgJGV2ZW50KVwiXG4gICAgICAgICAgZGF0YS1uZy1jbGFzcz1cIlshJGN0cmwuZGlzYWJsZUFuaW1hdGlvbnMgPyAkY3RybC5zbGlkZSA6ICcnLCB7aGVhZGVyOiBpdGVtLnR5cGUgPT0gJ2hlYWRlcicsIGRpdmlkZXI6IGl0ZW0udHlwZSA9PSAnc2VwYXJhdG9yJ31dXCI+XG5cbiAgICAgICAgICA8YSBuZy1pZj1cIml0ZW0udHlwZSAhPSAnc2VwYXJhdG9yJyAmJiBpdGVtLnN0YXRlXCIgdWktc3JlZj1cInt7aXRlbS5zdGF0ZX19XCI+XG4gICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5pY29uXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIml0ZW0uaWNvblwiPjwvaT5cbiAgICAgICAgICAgIDxzcGFuIG5nLWJpbmQ9XCJpdGVtLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uY2hpbGRyZW5cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zIHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAga2V5Ym9hcmRfYXJyb3dfcmlnaHRcbiAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICA8L2E+XG5cbiAgICAgICAgICA8YSBuZy1pZj1cIml0ZW0udHlwZSAhPSAnc2VwYXJhdG9yJyAmJiAhaXRlbS5zdGF0ZVwiPlxuICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uaWNvblwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIiBkYXRhLW5nLWJpbmQ9XCJpdGVtLmljb25cIj48L2k+XG4gICAgICAgICAgICA8c3BhbiBuZy1iaW5kPVwiaXRlbS5sYWJlbFwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmNoaWxkcmVuXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29ucyBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgIGtleWJvYXJkX2Fycm93X3JpZ2h0XG4gICAgICAgICAgICA8L2k+XG4gICAgICAgICAgPC9hPlxuXG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG5cbiAgICA8bmctdHJhbnNjbHVkZT48L25nLXRyYW5zY2x1ZGU+XG5cbiAgICA8dWwgY2xhc3M9XCJnbC1tZW51LWNoZXZyb25cIiBuZy1pZj1cIiRjdHJsLnNocmlua01vZGUgJiYgISRjdHJsLmZpeGVkXCIgbmctY2xpY2s9XCIkY3RybC5vcGVuTWVudVNocmluaygpXCI+XG4gICAgICA8bGk+XG4gICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5jaGV2cm9uX2xlZnQ8L2k+XG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG5cbiAgICA8dWwgY2xhc3M9XCJnbC1tZW51LWNoZXZyb24gdW5maXhlZFwiIG5nLWlmPVwiJGN0cmwuc2hyaW5rTW9kZSAmJiAkY3RybC5maXhlZFwiPlxuICAgICAgPGxpIG5nLWNsaWNrPVwiJGN0cmwudW5maXhlZE1lbnVTaHJpbmsoKVwiPlxuICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+Y2hldnJvbl9sZWZ0PC9pPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuXG4gICAgPHVsIGNsYXNzPVwiZ2wtbWVudS1jaGV2cm9uIHBvc3NpYmx5Rml4ZWRcIiBuZy1pZj1cIiRjdHJsLnBvc3NpYmx5Rml4ZWRcIj5cbiAgICAgIDxsaSBuZy1jbGljaz1cIiRjdHJsLmZpeGVkTWVudVNocmluaygpXCIgYWxpZ249XCJjZW50ZXJcIiBzdHlsZT1cImRpc3BsYXk6IGZsZXg7IGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XCI+XG4gICAgICA8c3ZnIHZlcnNpb249XCIxLjFcIiBpZD1cIkNhcGFfMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB4PVwiMHB4XCIgeT1cIjBweFwiXG4gICAgICAgICAgICB3aWR0aD1cIjYxMy40MDhweFwiIHN0eWxlPVwiZGlzcGxheTogaW5saW5lLWJsb2NrOyBwb3NpdGlvbjogcmVsYXRpdmU7IGhlaWdodDogMWVtOyB3aWR0aDogM2VtOyBmb250LXNpemU6IDEuMzNlbTsgcGFkZGluZzogMDsgbWFyZ2luOiAwOztcIiAgaGVpZ2h0PVwiNjEzLjQwOHB4XCIgdmlld0JveD1cIjAgMCA2MTMuNDA4IDYxMy40MDhcIiBzdHlsZT1cImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNjEzLjQwOCA2MTMuNDA4O1wiXG4gICAgICAgICAgICB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPlxuICAgICAgICA8Zz5cbiAgICAgICAgICA8cGF0aCBkPVwiTTYwNS4yNTQsMTY4Ljk0TDQ0My43OTIsNy40NTdjLTYuOTI0LTYuODgyLTE3LjEwMi05LjIzOS0yNi4zMTktNi4wNjljLTkuMTc3LDMuMTI4LTE1LjgwOSwxMS4yNDEtMTcuMDE5LDIwLjg1NVxuICAgICAgICAgICAgbC05LjA5Myw3MC41MTJMMjY3LjU4NSwyMTYuNDI4aC0xNDIuNjVjLTEwLjM0NCwwLTE5LjYyNSw2LjIxNS0yMy42MjksMTUuNzQ2Yy0zLjkyLDkuNTczLTEuNzEsMjAuNTIyLDUuNTg5LDI3Ljc3OVxuICAgICAgICAgICAgbDEwNS40MjQsMTA1LjQwM0wwLjY5OSw2MTMuNDA4bDI0Ni42MzUtMjEyLjg2OWwxMDUuNDIzLDEwNS40MDJjNC44ODEsNC44ODEsMTEuNDUsNy40NjcsMTcuOTk5LDcuNDY3XG4gICAgICAgICAgICBjMy4yOTUsMCw2LjYzMi0wLjcwOSw5Ljc4LTIuMDAyYzkuNTczLTMuOTIyLDE1LjcyNi0xMy4yNDQsMTUuNzI2LTIzLjUwNFYzNDUuMTY4bDEyMy44MzktMTIzLjcxNGw3MC40MjktOS4xNzZcbiAgICAgICAgICAgIGM5LjYxNC0xLjI1MSwxNy43MjctNy44NjIsMjAuODEzLTE3LjAzOUM2MTQuNDcyLDE4Ni4wMjEsNjEyLjEzNiwxNzUuODAxLDYwNS4yNTQsMTY4Ljk0eiBNNTA0Ljg1NiwxNzEuOTg1XG4gICAgICAgICAgICBjLTUuNTY4LDAuNzUxLTEwLjc2MiwzLjIzMi0xNC43NDUsNy4yMzdMMzUyLjc1OCwzMTYuNTk2Yy00Ljc5Niw0Ljc3NS03LjQ2NiwxMS4yNDItNy40NjYsMTguMDQxdjkxLjc0MkwxODYuNDM3LDI2Ny40ODFoOTEuNjhcbiAgICAgICAgICAgIGM2Ljc1NywwLDEzLjI0My0yLjY2OSwxOC4wNC03LjQ2Nkw0MzMuNTEsMTIyLjc2NmMzLjk4My0zLjk4Myw2LjU2OS05LjE3Niw3LjI1OC0xNC43ODZsMy42MjktMjcuNjk2bDg4LjE1NSw4OC4xMTRcbiAgICAgICAgICAgIEw1MDQuODU2LDE3MS45ODV6XCIvPlxuICAgICAgICA8L2c+XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuXG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHRpbWVvdXQnLCAnJGF0dHJzJywgJyRlbGVtZW50JywgZnVuY3Rpb24gKCR0aW1lb3V0LCAkYXR0cnMsICRlbGVtZW50KSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgY3RybC5rZXlzID0gY3RybC5rZXlzIHx8IFtdO1xuICAgIGN0cmwuaWNvbkZpcnN0TGV2ZWwgPSBjdHJsLmljb25GaXJzdExldmVsIHx8ICdnbHlwaGljb24gZ2x5cGhpY29uLWhvbWUnO1xuICAgIGN0cmwucHJldmlvdXMgPSBbXTtcbiAgICBjdHJsLmJhY2sgPSBbXTtcblxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuZGlzYWJsZUFuaW1hdGlvbnMgPSBjdHJsLmRpc2FibGVBbmltYXRpb25zIHx8IGZhbHNlO1xuXG4gICAgICBjb25zdCBtYWluQ29udGVudCA9IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCAuZ2wtbWFpbicpO1xuICAgICAgY29uc3QgaGVhZGVyQ29udGVudCA9IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCAuZ2wtaGVhZGVyJyk7XG5cbiAgICAgIGNvbnN0IHN0cmluZ1RvQm9vbGVhbiA9IChzdHJpbmcpID0+IHtcbiAgICAgICAgc3dpdGNoIChzdHJpbmcudG9Mb3dlckNhc2UoKS50cmltKCkpIHtcbiAgICAgICAgICBjYXNlIFwidHJ1ZVwiOiBjYXNlIFwieWVzXCI6IGNhc2UgXCIxXCI6IHJldHVybiB0cnVlO1xuICAgICAgICAgIGNhc2UgXCJmYWxzZVwiOiBjYXNlIFwibm9cIjogY2FzZSBcIjBcIjogY2FzZSBudWxsOiByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgZGVmYXVsdDogcmV0dXJuIEJvb2xlYW4oc3RyaW5nKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjdHJsLmZpeGVkID0gc3RyaW5nVG9Cb29sZWFuKCRhdHRycy5maXhlZCB8fCAnZmFsc2UnKTtcbiAgICAgIGN0cmwuZml4ZWRNYWluID0gc3RyaW5nVG9Cb29sZWFuKCRhdHRycy5maXhlZE1haW4gfHwgJ2ZhbHNlJyk7XG5cbiAgICAgIGlmIChjdHJsLmZpeGVkTWFpbikge1xuICAgICAgICBjdHJsLmZpeGVkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgb25CYWNrZHJvcENsaWNrID0gKGV2dCkgPT4ge1xuICAgICAgICBpZihjdHJsLnNocmlua01vZGUpe1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCBuYXYuZ2wtbmF2JykuYWRkQ2xhc3MoJ2Nsb3NlZCcpO1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnZGl2LmdtZC1tZW51LWJhY2tkcm9wJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgbmF2LmdsLW5hdicpLnJlbW92ZUNsYXNzKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBpbml0ID0gKCkgPT4ge1xuICAgICAgICBpZiAoIWN0cmwuZml4ZWQgfHwgY3RybC5zaHJpbmtNb2RlKSB7XG4gICAgICAgICAgbGV0IGVsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIGVsbS5jbGFzc0xpc3QuYWRkKCdnbWQtbWVudS1iYWNrZHJvcCcpO1xuICAgICAgICAgIGlmIChhbmd1bGFyLmVsZW1lbnQoJ2Rpdi5nbWQtbWVudS1iYWNrZHJvcCcpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJ2JvZHknKVswXS5hcHBlbmRDaGlsZChlbG0pOyBcbiAgICAgICAgICB9XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KCdkaXYuZ21kLW1lbnUtYmFja2Ryb3AnKS5vbignY2xpY2snLCBvbkJhY2tkcm9wQ2xpY2spO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGluaXQoKTtcblxuICAgICAgY29uc3Qgc2V0TWVudVRvcCA9ICgpID0+IHtcbiAgICAgICAgJHRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGxldCBzaXplID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1oZWFkZXInKS5oZWlnaHQoKTtcbiAgICAgICAgICBpZiAoc2l6ZSA9PSAwKSBzZXRNZW51VG9wKCk7XG4gICAgICAgICAgaWYgKGN0cmwuZml4ZWQpIHNpemUgPSAwO1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCBuYXYuZ2wtbmF2LmNvbGxhcHNlZCcpLmNzcyh7XG4gICAgICAgICAgICB0b3A6IHNpemVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGN0cmwudG9nZ2xlQ29udGVudCA9IChpc0NvbGxhcHNlZCkgPT4ge1xuICAgICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgaWYgKGN0cmwuZml4ZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IG1haW5Db250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1tYWluJyk7XG4gICAgICAgICAgICBjb25zdCBoZWFkZXJDb250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1oZWFkZXInKTtcbiAgICAgICAgICAgIGlmIChpc0NvbGxhcHNlZCkge1xuICAgICAgICAgICAgICBoZWFkZXJDb250ZW50LnJlYWR5KCgpID0+IHtcbiAgICAgICAgICAgICAgICBzZXRNZW51VG9wKCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaXNDb2xsYXBzZWQgPyBtYWluQ29udGVudC5hZGRDbGFzcygnY29sbGFwc2VkJykgOiBtYWluQ29udGVudC5yZW1vdmVDbGFzcygnY29sbGFwc2VkJyk7XG4gICAgICAgICAgICBpZiAoIWN0cmwuZml4ZWRNYWluICYmIGN0cmwuZml4ZWQpIHtcbiAgICAgICAgICAgICAgaXNDb2xsYXBzZWQgPyBoZWFkZXJDb250ZW50LmFkZENsYXNzKCdjb2xsYXBzZWQnKSA6IGhlYWRlckNvbnRlbnQucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlZCcpO1xuICAgICAgICAgICAgfSAgICAgICAgICAgIFxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgY29uc3QgdmVyaWZ5QmFja2Ryb3AgPSAoaXNDb2xsYXBzZWQpID0+IHtcbiAgICAgICAgY29uc3QgaGVhZGVyQ29udGVudCA9IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCAuZ2wtaGVhZGVyJyk7XG4gICAgICAgIGNvbnN0IGJhY2tDb250ZW50ID0gYW5ndWxhci5lbGVtZW50KCdkaXYuZ21kLW1lbnUtYmFja2Ryb3AnKTtcbiAgICAgICAgaWYgKGlzQ29sbGFwc2VkICYmICFjdHJsLmZpeGVkKSB7XG4gICAgICAgICAgYmFja0NvbnRlbnQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgIGxldCBzaXplID0gaGVhZGVyQ29udGVudC5oZWlnaHQoKTtcbiAgICAgICAgICBpZiAoc2l6ZSA+IDAgJiYgIWN0cmwuc2hyaW5rTW9kZSkge1xuICAgICAgICAgICAgYmFja0NvbnRlbnQuY3NzKHsgdG9wOiBzaXplIH0pO1xuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgYmFja0NvbnRlbnQuY3NzKHsgdG9wOiAwIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBiYWNrQ29udGVudC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAgICAgJHRpbWVvdXQoKCkgPT4gY3RybC5pc09wZW5lZCA9IGlzQ29sbGFwc2VkKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGN0cmwuc2hyaW5rTW9kZSkge1xuICAgICAgICBjb25zdCBtYWluQ29udGVudCA9IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCAuZ2wtbWFpbicpO1xuICAgICAgICBjb25zdCBoZWFkZXJDb250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1oZWFkZXInKTtcbiAgICAgICAgY29uc3QgbmF2Q29udGVudCA9IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCBuYXYuZ2wtbmF2Jyk7XG4gICAgICAgIG1haW5Db250ZW50LmNzcyh7J21hcmdpbi1sZWZ0JzogJzY0cHgnfSk7XG4gICAgICAgIGhlYWRlckNvbnRlbnQuY3NzKHsnbWFyZ2luLWxlZnQnOiAnNjRweCd9KTtcbiAgICAgICAgbmF2Q29udGVudC5jc3MoeyAnei1pbmRleCc6ICcxMDA2J30pO1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoXCJuYXYuZ2wtbmF2XCIpLmFkZENsYXNzKCdjbG9zZWQgY29sbGFwc2VkJyk7XG4gICAgICAgIHZlcmlmeUJhY2tkcm9wKCFhbmd1bGFyLmVsZW1lbnQoJ25hdi5nbC1uYXYnKS5oYXNDbGFzcygnY2xvc2VkJykpO1xuICAgICAgfVxuXG4gICAgICBpZiAoYW5ndWxhci5lbGVtZW50LmZuLmF0dHJjaGFuZ2UpIHtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KFwibmF2LmdsLW5hdlwiKS5hdHRyY2hhbmdlKHtcbiAgICAgICAgICB0cmFja1ZhbHVlczogdHJ1ZSxcbiAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24gKGV2bnQpIHtcbiAgICAgICAgICAgIGlmIChldm50LmF0dHJpYnV0ZU5hbWUgPT0gJ2NsYXNzJykge1xuICAgICAgICAgICAgICBpZihjdHJsLnNocmlua01vZGUpe1xuICAgICAgICAgICAgICAgIGN0cmwucG9zc2libHlGaXhlZCA9IGV2bnQubmV3VmFsdWUuaW5kZXhPZignY2xvc2VkJykgPT0gLTE7XG4gICAgICAgICAgICAgICAgdmVyaWZ5QmFja2Ryb3AoY3RybC5wb3NzaWJseUZpeGVkKTtcbiAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgY3RybC50b2dnbGVDb250ZW50KGV2bnQubmV3VmFsdWUuaW5kZXhPZignY29sbGFwc2VkJykgIT0gLTEpO1xuICAgICAgICAgICAgICAgIHZlcmlmeUJhY2tkcm9wKGV2bnQubmV3VmFsdWUuaW5kZXhPZignY29sbGFwc2VkJykgIT0gLTEpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFjdHJsLnNocmlua01vZGUpIHtcbiAgICAgICAgICBjdHJsLnRvZ2dsZUNvbnRlbnQoYW5ndWxhci5lbGVtZW50KCduYXYuZ2wtbmF2JykuaGFzQ2xhc3MoJ2NvbGxhcHNlZCcpKTtcbiAgICAgICAgICB2ZXJpZnlCYWNrZHJvcChhbmd1bGFyLmVsZW1lbnQoJ25hdi5nbC1uYXYnKS5oYXNDbGFzcygnY29sbGFwc2VkJykpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgICAgaWYgKCFjdHJsLmhhc093blByb3BlcnR5KCdzaG93QnV0dG9uRmlyc3RMZXZlbCcpKSB7XG4gICAgICAgICAgY3RybC5zaG93QnV0dG9uRmlyc3RMZXZlbCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY3RybC5wcmV2ID0gKCkgPT4ge1xuICAgICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgLy8gY3RybC5zbGlkZSA9ICdzbGlkZS1pbi1sZWZ0JztcbiAgICAgICAgICBjdHJsLm1lbnUgPSBjdHJsLnByZXZpb3VzLnBvcCgpO1xuICAgICAgICAgIGN0cmwuYmFjay5wb3AoKTtcbiAgICAgICAgfSwgMjUwKTtcbiAgICAgIH1cblxuICAgICAgY3RybC5uZXh0ID0gKGl0ZW0pID0+IHtcbiAgICAgICAgbGV0IG5hdiA9IGFuZ3VsYXIuZWxlbWVudCgnbmF2LmdsLW5hdicpWzBdO1xuICAgICAgICBpZiAoY3RybC5zaHJpbmtNb2RlICYmIG5hdi5jbGFzc0xpc3QuY29udGFpbnMoJ2Nsb3NlZCcpICYmIGl0ZW0uY2hpbGRyZW4gJiYgYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IG5hdi5nbC1uYXYnKS5pcygnW29wZW4tb24taG92ZXJdJykpIHtcbiAgICAgICAgICBjdHJsLm9wZW5NZW51U2hyaW5rKCk7XG4gICAgICAgICAgY3RybC5uZXh0KGl0ZW0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgaWYgKGl0ZW0uY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIC8vIGN0cmwuc2xpZGUgPSAnc2xpZGUtaW4tcmlnaHQnO1xuICAgICAgICAgICAgY3RybC5wcmV2aW91cy5wdXNoKGN0cmwubWVudSk7XG4gICAgICAgICAgICBjdHJsLm1lbnUgPSBpdGVtLmNoaWxkcmVuO1xuICAgICAgICAgICAgY3RybC5iYWNrLnB1c2goaXRlbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAyNTApO1xuICAgICAgfVxuXG4gICAgICBjdHJsLmdvQmFja1RvRmlyc3RMZXZlbCA9ICgpID0+IHtcbiAgICAgICAgLy8gY3RybC5zbGlkZSA9ICdzbGlkZS1pbi1sZWZ0J1xuICAgICAgICBjdHJsLm1lbnUgPSBjdHJsLnByZXZpb3VzWzBdXG4gICAgICAgIGN0cmwucHJldmlvdXMgPSBbXVxuICAgICAgICBjdHJsLmJhY2sgPSBbXVxuICAgICAgfVxuXG4gICAgICBjdHJsLmFsbG93ID0gaXRlbSA9PiB7XG4gICAgICAgIGlmIChjdHJsLmtleXMgJiYgY3RybC5rZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBpZiAoIWl0ZW0ua2V5KSByZXR1cm4gdHJ1ZVxuICAgICAgICAgIHJldHVybiBjdHJsLmtleXMuaW5kZXhPZihpdGVtLmtleSkgPiAtMVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGN0cmwuc2xpZGUgPSAnc2xpZGUtaW4tbGVmdCc7XG5cbiAgICAgIGN0cmwub3Blbk1lbnVTaHJpbmsgPSAoKSA9PiB7XG4gICAgICAgIGN0cmwucG9zc2libHlGaXhlZCA9IHRydWU7IFxuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgbmF2LmdsLW5hdicpLnJlbW92ZUNsYXNzKCdjbG9zZWQnKTtcbiAgICAgIH1cblxuICAgICAgY3RybC5maXhlZE1lbnVTaHJpbmsgPSAoKSA9PiB7XG4gICAgICAgICRlbGVtZW50LmF0dHIoJ2ZpeGVkJywgdHJ1ZSk7XG4gICAgICAgIGN0cmwuZml4ZWQgPSB0cnVlO1xuICAgICAgICBjdHJsLnBvc3NpYmx5Rml4ZWQgPSBmYWxzZTtcbiAgICAgICAgaW5pdCgpO1xuICAgICAgICBtYWluQ29udGVudC5jc3MoeydtYXJnaW4tbGVmdCc6ICcnfSk7XG4gICAgICAgIGhlYWRlckNvbnRlbnQuY3NzKHsnbWFyZ2luLWxlZnQnOiAnJ30pO1xuICAgICAgICBjdHJsLnRvZ2dsZUNvbnRlbnQodHJ1ZSk7XG4gICAgICAgIHZlcmlmeUJhY2tkcm9wKHRydWUpO1xuICAgICAgfVxuXG4gICAgICBjdHJsLnVuZml4ZWRNZW51U2hyaW5rID0gKCkgPT4ge1xuICAgICAgICAkZWxlbWVudC5hdHRyKCdmaXhlZCcsIGZhbHNlKTtcbiAgICAgICAgY3RybC5maXhlZCA9IGZhbHNlO1xuICAgICAgICBjdHJsLnBvc3NpYmx5Rml4ZWQgPSB0cnVlO1xuICAgICAgICBpbml0KCk7XG4gICAgICAgIG1haW5Db250ZW50LmNzcyh7J21hcmdpbi1sZWZ0JzogJzY0cHgnfSk7XG4gICAgICAgIGhlYWRlckNvbnRlbnQuY3NzKHsnbWFyZ2luLWxlZnQnOiAnNjRweCd9KTtcbiAgICAgICAgdmVyaWZ5QmFja2Ryb3AodHJ1ZSk7XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCBuYXYuZ2wtbmF2JykuYWRkQ2xhc3MoJ2Nsb3NlZCcpO1xuICAgICAgfVxuXG4gICAgfVxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgYmluZGluZ3M6IHtcbiAgICBpY29uOiAnQCcsXG4gICAgbm90aWZpY2F0aW9uczogJz0nLFxuICAgIG9uVmlldzogJyY/J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDx1bCBjbGFzcz1cIm5hdiBuYXZiYXItbmF2IG5hdmJhci1yaWdodCBub3RpZmljYXRpb25zXCI+XG4gICAgICA8bGkgY2xhc3M9XCJkcm9wZG93blwiPlxuICAgICAgICA8YSBocmVmPVwiI1wiIGJhZGdlPVwie3skY3RybC5ub3RpZmljYXRpb25zLmxlbmd0aH19XCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgcm9sZT1cImJ1dHRvblwiIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+XG4gICAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIiRjdHJsLmljb25cIj48L2k+XG4gICAgICAgIDwvYT5cbiAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPlxuICAgICAgICAgIDxsaSBkYXRhLW5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwubm90aWZpY2F0aW9uc1wiIGRhdGEtbmctY2xpY2s9XCIkY3RybC52aWV3KCRldmVudCwgaXRlbSlcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtbGVmdFwiPlxuICAgICAgICAgICAgICAgIDxpbWcgY2xhc3M9XCJtZWRpYS1vYmplY3RcIiBkYXRhLW5nLXNyYz1cInt7aXRlbS5pbWFnZX19XCI+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtYm9keVwiIGRhdGEtbmctYmluZD1cIml0ZW0uY29udGVudFwiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgPC91bD5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cbiAgYCxcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG5cbiAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICBjdHJsLnZpZXcgPSAoZXZlbnQsIGl0ZW0pID0+IGN0cmwub25WaWV3KHtldmVudDogZXZlbnQsIGl0ZW06IGl0ZW19KVxuICAgIH1cbiAgICBcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0MnLFxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIGlmKCFlbGVtZW50WzBdLmNsYXNzTGlzdC5jb250YWlucygnZml4ZWQnKSl7XG4gICAgICAgIGVsZW1lbnRbMF0uc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnXG4gICAgICB9XG4gICAgICBlbGVtZW50WzBdLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUudXNlclNlbGVjdCA9ICdub25lJ1xuXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLm1zVXNlclNlbGVjdCA9ICdub25lJ1xuICAgICAgZWxlbWVudFswXS5zdHlsZS5tb3pVc2VyU2VsZWN0ID0gJ25vbmUnXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPSAnbm9uZSdcblxuICAgICAgZnVuY3Rpb24gY3JlYXRlUmlwcGxlKGV2dCkge1xuICAgICAgICB2YXIgcmlwcGxlID0gYW5ndWxhci5lbGVtZW50KCc8c3BhbiBjbGFzcz1cImdtZC1yaXBwbGUtZWZmZWN0IGFuaW1hdGVcIj4nKSxcbiAgICAgICAgICByZWN0ID0gZWxlbWVudFswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICByYWRpdXMgPSBNYXRoLm1heChyZWN0LmhlaWdodCwgcmVjdC53aWR0aCksXG4gICAgICAgICAgbGVmdCA9IGV2dC5wYWdlWCAtIHJlY3QubGVmdCAtIHJhZGl1cyAvIDIgLSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQsXG4gICAgICAgICAgdG9wID0gZXZ0LnBhZ2VZIC0gcmVjdC50b3AgLSByYWRpdXMgLyAyIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XG5cbiAgICAgICAgcmlwcGxlWzBdLnN0eWxlLndpZHRoID0gcmlwcGxlWzBdLnN0eWxlLmhlaWdodCA9IHJhZGl1cyArICdweCc7XG4gICAgICAgIHJpcHBsZVswXS5zdHlsZS5sZWZ0ID0gbGVmdCArICdweCc7XG4gICAgICAgIHJpcHBsZVswXS5zdHlsZS50b3AgPSB0b3AgKyAncHgnO1xuICAgICAgICByaXBwbGUub24oJ2FuaW1hdGlvbmVuZCB3ZWJraXRBbmltYXRpb25FbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQodGhpcykucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGVsZW1lbnQuYXBwZW5kKHJpcHBsZSk7XG4gICAgICB9XG5cbiAgICAgIGVsZW1lbnQuYmluZCgnbW91c2Vkb3duJywgY3JlYXRlUmlwcGxlKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICByZXF1aXJlOiBbJ25nTW9kZWwnLCduZ1JlcXVpcmVkJ10sXG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIGJpbmRpbmdzOiB7XG4gICAgbmdNb2RlbDogJz0nLFxuICAgIG5nRGlzYWJsZWQ6ICc9PycsXG4gICAgdW5zZWxlY3Q6ICdAPycsXG4gICAgb3B0aW9uczogJzwnLFxuICAgIG9wdGlvbjogJ0AnLFxuICAgIHZhbHVlOiAnQCcsXG4gICAgcGxhY2Vob2xkZXI6ICdAPycsXG4gICAgb25DaGFuZ2U6IFwiJj9cIixcbiAgICB0cmFuc2xhdGVMYWJlbDogJz0/J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICA8ZGl2IGNsYXNzPVwiZHJvcGRvd24gZ21kXCI+XG4gICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZmxvYXRpbmctZHJvcGRvd25cIiBuZy1zaG93PVwiJGN0cmwuc2VsZWN0ZWRcIj5cbiAgICAgIHt7JGN0cmwucGxhY2Vob2xkZXJ9fSA8c3BhbiBuZy1pZj1cIiRjdHJsLnZhbGlkYXRlR3VtZ2FFcnJvclwiIG5nLWNsYXNzPVwieydnbWQtc2VsZWN0LXJlcXVpcmVkJzogJGN0cmwubmdNb2RlbEN0cmwuJGVycm9yLnJlcXVpcmVkfVwiPio8c3Bhbj5cbiAgICAgPC9sYWJlbD5cbiAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBnbWQgZHJvcGRvd24tdG9nZ2xlIGdtZC1zZWxlY3QtYnV0dG9uXCJcbiAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICBzdHlsZT1cImJvcmRlci1yYWRpdXM6IDA7XCJcbiAgICAgICAgICAgICBpZD1cImdtZFNlbGVjdFwiXG4gICAgICAgICAgICAgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXG4gICAgICAgICAgICAgbmctZGlzYWJsZWQ9XCIkY3RybC5uZ0Rpc2FibGVkXCJcbiAgICAgICAgICAgICBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiXG4gICAgICAgICAgICAgYXJpYS1leHBhbmRlZD1cInRydWVcIj5cbiAgICAgICA8c3BhbiBjbGFzcz1cIml0ZW0tc2VsZWN0XCIgbmctaWY9XCIhJGN0cmwudHJhbnNsYXRlTGFiZWxcIiBkYXRhLW5nLXNob3c9XCIkY3RybC5zZWxlY3RlZFwiIGRhdGEtbmctYmluZD1cIiRjdHJsLnNlbGVjdGVkXCI+PC9zcGFuPlxuICAgICAgIDxzcGFuIGNsYXNzPVwiaXRlbS1zZWxlY3RcIiBuZy1pZj1cIiRjdHJsLnRyYW5zbGF0ZUxhYmVsXCIgZGF0YS1uZy1zaG93PVwiJGN0cmwuc2VsZWN0ZWRcIj5cbiAgICAgICAgICB7eyAkY3RybC5zZWxlY3RlZCB8IGd1bWdhVHJhbnNsYXRlIH19XG4gICAgICAgPC9zcGFuPlxuICAgICAgIDxzcGFuIGRhdGEtbmctaGlkZT1cIiRjdHJsLnNlbGVjdGVkXCIgY2xhc3M9XCJpdGVtLXNlbGVjdCBwbGFjZWhvbGRlclwiPlxuICAgICAgICB7eyRjdHJsLnBsYWNlaG9sZGVyfX1cbiAgICAgICA8L3NwYW4+XG4gICAgICAgPHNwYW4gbmctaWY9XCIkY3RybC5uZ01vZGVsQ3RybC4kZXJyb3IucmVxdWlyZWQgJiYgJGN0cmwudmFsaWRhdGVHdW1nYUVycm9yXCIgY2xhc3M9XCJ3b3JkLXJlcXVpcmVkXCI+Kjwvc3Bhbj5cbiAgICAgICA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPlxuICAgICA8L2J1dHRvbj5cbiAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiIGFyaWEtbGFiZWxsZWRieT1cImdtZFNlbGVjdFwiIG5nLXNob3c9XCIkY3RybC5vcHRpb25cIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+XG4gICAgICAgPGxpIGRhdGEtbmctY2xpY2s9XCIkY3RybC5jbGVhcigpXCIgbmctaWY9XCIkY3RybC51bnNlbGVjdFwiPlxuICAgICAgICAgPGEgZGF0YS1uZy1jbGFzcz1cInthY3RpdmU6IGZhbHNlfVwiPnt7JGN0cmwudW5zZWxlY3R9fTwvYT5cbiAgICAgICA8L2xpPlxuICAgICAgIDxsaSBkYXRhLW5nLXJlcGVhdD1cIm9wdGlvbiBpbiAkY3RybC5vcHRpb25zIHRyYWNrIGJ5ICRpbmRleFwiPlxuICAgICAgICAgPGEgY2xhc3M9XCJzZWxlY3Qtb3B0aW9uXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnNlbGVjdChvcHRpb24pXCIgZGF0YS1uZy1iaW5kPVwib3B0aW9uWyRjdHJsLm9wdGlvbl0gfHwgb3B0aW9uXCIgZGF0YS1uZy1jbGFzcz1cInthY3RpdmU6ICRjdHJsLmlzQWN0aXZlKG9wdGlvbil9XCI+PC9hPlxuICAgICAgIDwvbGk+XG4gICAgIDwvdWw+XG4gICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUgZ21kXCIgYXJpYS1sYWJlbGxlZGJ5PVwiZ21kU2VsZWN0XCIgbmctc2hvdz1cIiEkY3RybC5vcHRpb25cIiBzdHlsZT1cIm1heC1oZWlnaHQ6IDI1MHB4O292ZXJmbG93OiBhdXRvO2Rpc3BsYXk6IG5vbmU7XCIgbmctdHJhbnNjbHVkZT48L3VsPlxuICAgPC9kaXY+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGF0dHJzJywnJHRpbWVvdXQnLCckZWxlbWVudCcsICckdHJhbnNjbHVkZScsICckY29tcGlsZScsIGZ1bmN0aW9uKCRzY29wZSwkYXR0cnMsJHRpbWVvdXQsJGVsZW1lbnQsJHRyYW5zY2x1ZGUsICRjb21waWxlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgLCAgIG5nTW9kZWxDdHJsID0gJGVsZW1lbnQuY29udHJvbGxlcignbmdNb2RlbCcpO1xuXG4gICAgbGV0IG9wdGlvbnMgPSBjdHJsLm9wdGlvbnMgfHwgW107XG5cbiAgICBjdHJsLm5nTW9kZWxDdHJsICAgICAgICA9IG5nTW9kZWxDdHJsO1xuICAgIGN0cmwudmFsaWRhdGVHdW1nYUVycm9yID0gJGF0dHJzLmhhc093blByb3BlcnR5KCdndW1nYVJlcXVpcmVkJyk7XG5cbiAgICBmdW5jdGlvbiBmaW5kUGFyZW50QnlOYW1lKGVsbSwgcGFyZW50TmFtZSl7XG4gICAgICBpZihlbG0uY2xhc3NOYW1lID09IHBhcmVudE5hbWUpe1xuICAgICAgICByZXR1cm4gZWxtO1xuICAgICAgfVxuICAgICAgaWYoZWxtLnBhcmVudE5vZGUpe1xuICAgICAgICByZXR1cm4gZmluZFBhcmVudEJ5TmFtZShlbG0ucGFyZW50Tm9kZSwgcGFyZW50TmFtZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZWxtO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByZXZlbnREZWZhdWx0KGUpIHtcbiAgICAgIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcbiAgICAgIGxldCB0YXJnZXQgPSBmaW5kUGFyZW50QnlOYW1lKGUudGFyZ2V0LCAnc2VsZWN0LW9wdGlvbicpO1xuICAgICAgaWYoKHRhcmdldC5ub2RlTmFtZSA9PSAnQScgJiYgdGFyZ2V0LmNsYXNzTmFtZSA9PSAnc2VsZWN0LW9wdGlvbicpIHx8IChlLnRhcmdldC5ub2RlTmFtZSA9PSAnQScgJiYgZS50YXJnZXQuY2xhc3NOYW1lID09ICdzZWxlY3Qtb3B0aW9uJykpe1xuICAgICAgICBsZXQgZGlyZWN0aW9uID0gZmluZFNjcm9sbERpcmVjdGlvbk90aGVyQnJvd3NlcnMoZSlcbiAgICAgICAgbGV0IHNjcm9sbFRvcCA9IGFuZ3VsYXIuZWxlbWVudCh0YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlKS5zY3JvbGxUb3AoKTtcbiAgICAgICAgaWYoc2Nyb2xsVG9wICsgYW5ndWxhci5lbGVtZW50KHRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUpLmlubmVySGVpZ2h0KCkgPj0gdGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5zY3JvbGxIZWlnaHQgJiYgZGlyZWN0aW9uICE9ICdVUCcpe1xuICAgICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KVxuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICB9ZWxzZSBpZihzY3JvbGxUb3AgPD0gMCAgJiYgZGlyZWN0aW9uICE9ICdET1dOJyl7XG4gICAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpXG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZS5yZXR1cm5WYWx1ZSA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9ZWxzZXtcbiAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5kU2Nyb2xsRGlyZWN0aW9uT3RoZXJCcm93c2VycyhldmVudCl7XG4gICAgICB2YXIgZGVsdGE7XG4gICAgICBpZiAoZXZlbnQud2hlZWxEZWx0YSl7XG4gICAgICAgIGRlbHRhID0gZXZlbnQud2hlZWxEZWx0YTtcbiAgICAgIH1lbHNle1xuICAgICAgICBkZWx0YSA9IC0xICpldmVudC5kZWx0YVk7XG4gICAgICB9XG4gICAgICBpZiAoZGVsdGEgPCAwKXtcbiAgICAgICAgcmV0dXJuIFwiRE9XTlwiO1xuICAgICAgfWVsc2UgaWYgKGRlbHRhID4gMCl7XG4gICAgICAgIHJldHVybiBcIlVQXCI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJldmVudERlZmF1bHRGb3JTY3JvbGxLZXlzKGUpIHtcbiAgICAgICAgaWYgKGtleXMgJiYga2V5c1tlLmtleUNvZGVdKSB7XG4gICAgICAgICAgICBwcmV2ZW50RGVmYXVsdChlKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmNsZWFyKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGlzYWJsZVNjcm9sbCgpIHtcbiAgICAgIGlmICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcil7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBwcmV2ZW50RGVmYXVsdCwgZmFsc2UpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NTW91c2VTY3JvbGwnLCBwcmV2ZW50RGVmYXVsdCwgZmFsc2UpO1xuICAgICAgfVxuICAgICAgd2luZG93Lm9ud2hlZWwgPSBwcmV2ZW50RGVmYXVsdDsgLy8gbW9kZXJuIHN0YW5kYXJkXG4gICAgICB3aW5kb3cub25tb3VzZXdoZWVsID0gZG9jdW1lbnQub25tb3VzZXdoZWVsID0gcHJldmVudERlZmF1bHQ7IC8vIG9sZGVyIGJyb3dzZXJzLCBJRVxuICAgICAgd2luZG93Lm9udG91Y2htb3ZlICA9IHByZXZlbnREZWZhdWx0OyAvLyBtb2JpbGVcbiAgICAgIGRvY3VtZW50Lm9ua2V5ZG93biAgPSBwcmV2ZW50RGVmYXVsdEZvclNjcm9sbEtleXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW5hYmxlU2Nyb2xsKCkge1xuICAgICAgICBpZiAod2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIpXG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignRE9NTW91c2VTY3JvbGwnLCBwcmV2ZW50RGVmYXVsdCwgZmFsc2UpO1xuICAgICAgICB3aW5kb3cub25tb3VzZXdoZWVsID0gZG9jdW1lbnQub25tb3VzZXdoZWVsID0gbnVsbDtcbiAgICAgICAgd2luZG93Lm9ud2hlZWwgPSBudWxsO1xuICAgICAgICB3aW5kb3cub250b3VjaG1vdmUgPSBudWxsO1xuICAgICAgICBkb2N1bWVudC5vbmtleWRvd24gPSBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGdldE9mZnNldCA9IGVsID0+IHtcbiAgICAgICAgdmFyIHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgc2Nyb2xsTGVmdCA9IHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCxcbiAgICAgICAgc2Nyb2xsVG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG4gICAgICAgIGxldCBfeCA9IDAsIF95ID0gMDtcbiAgICAgICAgd2hpbGUoIGVsICYmICFpc05hTiggZWwub2Zmc2V0TGVmdCApICYmICFpc05hTiggZWwub2Zmc2V0VG9wICkgKSB7XG4gICAgICAgICAgICBfeCArPSBlbC5vZmZzZXRMZWZ0IC0gZWwuc2Nyb2xsTGVmdDsgICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKGVsLm5vZGVOYW1lID09ICdCT0RZJyl7XG4gICAgICAgICAgICAgIF95ICs9IGVsLm9mZnNldFRvcCAtIE1hdGgubWF4KCBhbmd1bGFyLmVsZW1lbnQoXCJodG1sXCIpLnNjcm9sbFRvcCgpLCBhbmd1bGFyLmVsZW1lbnQoXCJib2R5XCIpLnNjcm9sbFRvcCgpICk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgX3kgKz0gZWwub2Zmc2V0VG9wIC0gZWwuc2Nyb2xsVG9wO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWwgPSBlbC5vZmZzZXRQYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgdG9wOiBfeSwgbGVmdDogcmVjdC5sZWZ0ICsgc2Nyb2xsTGVmdCB9XG4gICAgfVxuXG4gICAgY29uc3QgZ2V0RWxlbWVudE1heEhlaWdodCA9IChlbG0pID0+IHtcbiAgICAgIHZhciBzY3JvbGxQb3NpdGlvbiA9IE1hdGgubWF4KCBhbmd1bGFyLmVsZW1lbnQoXCJodG1sXCIpLnNjcm9sbFRvcCgpLCBhbmd1bGFyLmVsZW1lbnQoXCJib2R5XCIpLnNjcm9sbFRvcCgpICk7XG4gICAgICB2YXIgZWxlbWVudE9mZnNldCA9IGVsbS5vZmZzZXQoKS50b3A7XG4gICAgICB2YXIgZWxlbWVudERpc3RhbmNlID0gKGVsZW1lbnRPZmZzZXQgLSBzY3JvbGxQb3NpdGlvbik7XG4gICAgICB2YXIgd2luZG93SGVpZ2h0ID0gYW5ndWxhci5lbGVtZW50KHdpbmRvdykuaGVpZ2h0KCk7XG4gICAgICByZXR1cm4gd2luZG93SGVpZ2h0IC0gZWxlbWVudERpc3RhbmNlO1xuICAgIH1cblxuICAgIGNvbnN0IGhhbmRsaW5nRWxlbWVudFN0eWxlID0gKCRlbGVtZW50LCB1bHMpID0+IHtcbiAgICAgIGxldCBTSVpFX0JPVFRPTV9ESVNUQU5DRSA9IDU7XG4gICAgICBsZXQgcG9zaXRpb24gPSBnZXRPZmZzZXQoJGVsZW1lbnRbMF0pO1xuXG4gICAgICBhbmd1bGFyLmZvckVhY2godWxzLCB1bCA9PiB7XG4gICAgICAgIGlmKGFuZ3VsYXIuZWxlbWVudCh1bCkuaGVpZ2h0KCkgPT0gMCkgcmV0dXJuO1xuICAgICAgICBsZXQgbWF4SGVpZ2h0ID0gZ2V0RWxlbWVudE1heEhlaWdodChhbmd1bGFyLmVsZW1lbnQoJGVsZW1lbnRbMF0pKTtcbiAgICAgICAgaWYoYW5ndWxhci5lbGVtZW50KHVsKS5oZWlnaHQoKSA+IG1heEhlaWdodCl7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KHVsKS5jc3Moe1xuICAgICAgICAgICAgaGVpZ2h0OiBtYXhIZWlnaHQgLSBTSVpFX0JPVFRPTV9ESVNUQU5DRSArICdweCdcbiAgICAgICAgICB9KTtcbiAgICAgICAgfWVsc2UgaWYoYW5ndWxhci5lbGVtZW50KHVsKS5oZWlnaHQoKSAhPSAobWF4SGVpZ2h0IC1TSVpFX0JPVFRPTV9ESVNUQU5DRSkpe1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCh1bCkuY3NzKHtcbiAgICAgICAgICAgIGhlaWdodDogJ2F1dG8nXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBhbmd1bGFyLmVsZW1lbnQodWwpLmNzcyh7XG4gICAgICAgICAgZGlzcGxheTogJ2Jsb2NrJyxcbiAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICBsZWZ0OiBwb3NpdGlvbi5sZWZ0LTEgKyAncHgnLFxuICAgICAgICAgIHRvcDogcG9zaXRpb24udG9wLTIgKyAncHgnLFxuICAgICAgICAgIHdpZHRoOiAkZWxlbWVudC5maW5kKCdkaXYuZHJvcGRvd24nKVswXS5jbGllbnRXaWR0aCArIDFcbiAgICAgICAgfSk7XG5cblxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgaGFuZGxpbmdFbGVtZW50SW5Cb2R5ID0gKGVsbSwgdWxzKSA9PiB7XG4gICAgICB2YXIgYm9keSA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudCkuZmluZCgnYm9keScpLmVxKDApO1xuICAgICAgbGV0IGRpdiA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSk7XG4gICAgICBkaXYuYWRkQ2xhc3MoXCJkcm9wZG93biBnbWRcIik7XG4gICAgICBkaXYuYXBwZW5kKHVscyk7XG4gICAgICBib2R5LmFwcGVuZChkaXYpO1xuICAgICAgYW5ndWxhci5lbGVtZW50KGVsbS5maW5kKCdidXR0b24uZHJvcGRvd24tdG9nZ2xlJykpLmF0dHJjaGFuZ2Uoe1xuICAgICAgICAgIHRyYWNrVmFsdWVzOiB0cnVlLFxuICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihldm50KSB7XG4gICAgICAgICAgICBpZihldm50LmF0dHJpYnV0ZU5hbWUgPT0gJ2FyaWEtZXhwYW5kZWQnICYmIGV2bnQubmV3VmFsdWUgPT0gJ2ZhbHNlJyl7XG4gICAgICAgICAgICAgIGVuYWJsZVNjcm9sbCgpO1xuICAgICAgICAgICAgICB1bHMgPSBhbmd1bGFyLmVsZW1lbnQoZGl2KS5maW5kKCd1bCcpO1xuICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godWxzLCB1bCA9PiB7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KHVsKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ25vbmUnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGVsbS5maW5kKCdkaXYuZHJvcGRvd24nKS5hcHBlbmQodWxzKTtcbiAgICAgICAgICAgICAgZGl2LnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgICRlbGVtZW50LmJpbmQoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgbGV0IHVscyA9ICRlbGVtZW50LmZpbmQoJ3VsJyk7XG4gICAgICBpZih1bHMuZmluZCgnZ21kLW9wdGlvbicpLmxlbmd0aCA9PSAwKXtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGhhbmRsaW5nRWxlbWVudFN0eWxlKCRlbGVtZW50LCB1bHMpOyAgICBcbiAgICAgIGRpc2FibGVTY3JvbGwoKTtcbiAgICAgIGhhbmRsaW5nRWxlbWVudEluQm9keSgkZWxlbWVudCwgdWxzKTtcbiAgICB9KVxuXG4gICAgY3RybC5zZWxlY3QgPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgICBjdHJsLm5nTW9kZWwgPSBvcHRpb24ubmdWYWx1ZVxuICAgICAgY3RybC5zZWxlY3RlZCA9IG9wdGlvbi5uZ0xhYmVsXG4gICAgfTtcblxuICAgIGN0cmwuYWRkT3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICBvcHRpb25zLnB1c2gob3B0aW9uKTtcbiAgICB9O1xuXG4gICAgbGV0IHNldFNlbGVjdGVkID0gKHZhbHVlKSA9PiB7XG4gICAgICBhbmd1bGFyLmZvckVhY2gob3B0aW9ucywgb3B0aW9uID0+IHtcbiAgICAgICAgaWYgKG9wdGlvbi5uZ1ZhbHVlLiQkaGFzaEtleSkge1xuICAgICAgICAgIGRlbGV0ZSBvcHRpb24ubmdWYWx1ZS4kJGhhc2hLZXlcbiAgICAgICAgfVxuICAgICAgICBpZiAoYW5ndWxhci5lcXVhbHModmFsdWUsIG9wdGlvbi5uZ1ZhbHVlKSkge1xuICAgICAgICAgIGN0cmwuc2VsZWN0KG9wdGlvbilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICAkdGltZW91dCgoKSA9PiBzZXRTZWxlY3RlZChjdHJsLm5nTW9kZWwpKTtcblxuICAgIGN0cmwuJGRvQ2hlY2sgPSAoKSA9PiB7XG4gICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmxlbmd0aCA+IDApIHNldFNlbGVjdGVkKGN0cmwubmdNb2RlbClcbiAgICB9XG5cblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICByZXF1aXJlOiB7XG4gICAgICBnbWRTZWxlY3RDdHJsOiAnXmdtZFNlbGVjdCdcbiAgICB9LFxuICAgIGJpbmRpbmdzOiB7XG4gICAgfSxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgPGEgY2xhc3M9XCJzZWxlY3Qtb3B0aW9uXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnNlbGVjdCgpXCIgbmctdHJhbnNjbHVkZT48L2E+XG4gICAgYCxcbiAgICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRhdHRycycsJyR0aW1lb3V0JywnJGVsZW1lbnQnLCckdHJhbnNjbHVkZScsIGZ1bmN0aW9uKCRzY29wZSwkYXR0cnMsJHRpbWVvdXQsJGVsZW1lbnQsJHRyYW5zY2x1ZGUpIHtcbiAgICAgIGxldCBjdHJsID0gdGhpcztcbiBcbiAgICAgIGN0cmwuc2VsZWN0ID0gKCkgPT4ge1xuICAgICAgICBjdHJsLmdtZFNlbGVjdEN0cmwuc2VsZWN0KHRoaXMpO1xuICAgICAgfVxuICAgICAgXG4gICAgfV1cbiAgfVxuICBcbiAgZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4gICIsImxldCBDb21wb25lbnQgPSB7XG4gIC8vIHJlcXVpcmU6IFsnbmdNb2RlbCcsJ25nUmVxdWlyZWQnXSxcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgcmVxdWlyZToge1xuICAgIGdtZFNlbGVjdEN0cmw6ICdeZ21kU2VsZWN0J1xuICB9LFxuICBiaW5kaW5nczoge1xuICAgIG5nVmFsdWU6ICc9JyxcbiAgICBuZ0xhYmVsOiAnPSdcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YSBjbGFzcz1cInNlbGVjdC1vcHRpb25cIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuc2VsZWN0KCRjdHJsLm5nVmFsdWUsICRjdHJsLm5nTGFiZWwpXCIgbmctY2xhc3M9XCJ7YWN0aXZlOiAkY3RybC5zZWxlY3RlZH1cIiBuZy10cmFuc2NsdWRlPjwvYT5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckYXR0cnMnLCckdGltZW91dCcsJyRlbGVtZW50JywnJHRyYW5zY2x1ZGUnLCBmdW5jdGlvbigkc2NvcGUsJGF0dHJzLCR0aW1lb3V0LCRlbGVtZW50LCR0cmFuc2NsdWRlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzO1xuXG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgY3RybC5nbWRTZWxlY3RDdHJsLmFkZE9wdGlvbih0aGlzKVxuICAgIH1cbiAgICBcbiAgICBjdHJsLnNlbGVjdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuZ21kU2VsZWN0Q3RybC5zZWxlY3QoY3RybCk7XG4gICAgICBpZihjdHJsLmdtZFNlbGVjdEN0cmwub25DaGFuZ2Upe1xuICAgICAgICBjdHJsLmdtZFNlbGVjdEN0cmwub25DaGFuZ2Uoe3ZhbHVlOiB0aGlzLm5nVmFsdWV9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICB0cmFuc2NsdWRlOiB0cnVlLFxuICByZXF1aXJlOiB7XG4gICAgZ21kU2VsZWN0Q3RybDogJ15nbWRTZWxlY3QnXG4gIH0sXG4gIGJpbmRpbmdzOiB7XG4gICAgbmdNb2RlbDogJz0nLFxuICAgIHBsYWNlaG9sZGVyOiAnQD8nXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCIgc3R5bGU9XCJib3JkZXI6IG5vbmU7YmFja2dyb3VuZDogI2Y5ZjlmOTtcIj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYWRkb25cIiBpZD1cImJhc2ljLWFkZG9uMVwiIHN0eWxlPVwiYm9yZGVyOiBub25lO1wiPlxuICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+c2VhcmNoPC9pPlxuICAgICAgPC9zcGFuPlxuICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgc3R5bGU9XCJib3JkZXI6IG5vbmU7XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZ21kXCIgbmctbW9kZWw9XCIkY3RybC5uZ01vZGVsXCIgcGxhY2Vob2xkZXI9XCJ7eyRjdHJsLnBsYWNlaG9sZGVyfX1cIj5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckYXR0cnMnLCckdGltZW91dCcsJyRlbGVtZW50JywnJHRyYW5zY2x1ZGUnLCBmdW5jdGlvbigkc2NvcGUsJGF0dHJzLCR0aW1lb3V0LCRlbGVtZW50LCR0cmFuc2NsdWRlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzO1xuXG4gICAgJGVsZW1lbnQuYmluZCgnY2xpY2snLCAoZXZ0KSA9PiB7XG4gICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSlcblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIGJpbmRpbmdzOiB7XG4gICAgZGlhbWV0ZXI6IFwiQD9cIixcbiAgICBib3ggICAgIDogXCI9P1wiXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgY2xhc3M9XCJzcGlubmVyLW1hdGVyaWFsXCIgbmctaWY9XCIkY3RybC5kaWFtZXRlclwiPlxuICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgICAgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCJcbiAgICAgICAgdmVyc2lvbj1cIjFcIlxuICAgICAgICBuZy1jbGFzcz1cInsnc3Bpbm5lci1ib3gnIDogJGN0cmwuYm94fVwiXG4gICAgICAgIHN0eWxlPVwid2lkdGg6IHt7JGN0cmwuZGlhbWV0ZXJ9fTtoZWlnaHQ6IHt7JGN0cmwuZGlhbWV0ZXJ9fTtcIlxuICAgICAgICB2aWV3Qm94PVwiMCAwIDI4IDI4XCI+XG4gICAgPGcgY2xhc3M9XCJxcC1jaXJjdWxhci1sb2FkZXJcIj5cbiAgICAgPHBhdGggY2xhc3M9XCJxcC1jaXJjdWxhci1sb2FkZXItcGF0aFwiIGZpbGw9XCJub25lXCIgZD1cIk0gMTQsMS41IEEgMTIuNSwxMi41IDAgMSAxIDEuNSwxNFwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiAvPlxuICAgIDwvZz5cbiAgIDwvc3ZnPlxuICA8L2Rpdj5gLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywnJGF0dHJzJywnJHRpbWVvdXQnLCAnJHBhcnNlJywgZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdGltZW91dCwkcGFyc2UpIHtcbiAgICBsZXQgY3RybCA9IHRoaXM7XG5cbiAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICBjdHJsLmRpYW1ldGVyID0gY3RybC5kaWFtZXRlciB8fCAnNTBweCc7XG4gICAgfVxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IFByb3ZpZGVyID0gKCkgPT4ge1xuXG4gICAgY29uc3Qgc2V0RWxlbWVudEhyZWYgPSAoaHJlZikgPT4ge1xuICAgICAgICBsZXQgZWxtID0gYW5ndWxhci5lbGVtZW50KCdsaW5rW2hyZWYqPVwiZ3VtZ2EtbGF5b3V0XCJdJyk7XG4gICAgICAgIGlmKGVsbSAmJiBlbG1bMF0pe1xuICAgICAgICAgICAgZWxtLmF0dHIoJ2hyZWYnLCBocmVmKTtcbiAgICAgICAgfVxuICAgICAgICBlbG0gPSBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpKTtcbiAgICAgICAgZWxtLmF0dHIoJ2hyZWYnLCBocmVmKTtcbiAgICAgICAgZWxtLmF0dHIoJ3JlbCcsICdzdHlsZXNoZWV0Jyk7XG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoZWxtWzBdKTtcbiAgICB9XG5cbiAgICBjb25zdCBzZXRUaGVtZURlZmF1bHQgPSAodGhlbWVOYW1lLCBzYXZlKSA9PiB7XG4gICAgICAgIGxldCBzcmMsIHRoZW1lRGVmYXVsdCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2dtZC10aGVtZS1kZWZhdWx0Jyk7XG4gICAgICAgIGlmKHRoZW1lTmFtZSAmJiAhdGhlbWVEZWZhdWx0KXtcbiAgICAgICAgICAgIGlmKHNhdmUpIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2dtZC10aGVtZS1kZWZhdWx0JywgdGhlbWVOYW1lKTtcbiAgICAgICAgICAgIHNyYyA9ICdndW1nYS1sYXlvdXQvJyt0aGVtZU5hbWUrJy9ndW1nYS1sYXlvdXQubWluLmNzcyc7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgaWYodGhlbWVEZWZhdWx0KXtcbiAgICAgICAgICAgICAgICBzcmMgPSAnZ3VtZ2EtbGF5b3V0LycrdGhlbWVEZWZhdWx0KycvZ3VtZ2EtbGF5b3V0Lm1pbi5jc3MnO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgc3JjID0gJ2d1bWdhLWxheW91dC9ndW1nYS1sYXlvdXQubWluLmNzcyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2V0RWxlbWVudEhyZWYoc3JjKTtcbiAgICB9XG5cbiAgICBjb25zdCBzZXRUaGVtZSA9ICh0aGVtZU5hbWUsIHVwZGF0ZVNlc3Npb24pID0+IHtcbiAgICAgICAgdmFyIHNyYywgdGhlbWVEZWZhdWx0ID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnZ21kLXRoZW1lJyk7XG5cbiAgICAgICAgaWYoKHRoZW1lTmFtZSAmJiB1cGRhdGVTZXNzaW9uKSB8fCAodGhlbWVOYW1lICYmICF0aGVtZURlZmF1bHQpKXtcbiAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2dtZC10aGVtZScsIHRoZW1lTmFtZSk7XG4gICAgICAgICAgICBzcmMgPSAnZ3VtZ2EtbGF5b3V0LycgKyB0aGVtZU5hbWUgKyAnL2d1bWdhLWxheW91dC5taW4uY3NzJztcbiAgICAgICAgICAgIHNldEVsZW1lbnRIcmVmKHNyYyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZih0aGVtZU5hbWUgJiYgIXVwZGF0ZVNlc3Npb24pe1xuICAgICAgICAgICAgc3JjID0gJ2d1bWdhLWxheW91dC8nICsgdGhlbWVEZWZhdWx0ICsgJy9ndW1nYS1sYXlvdXQubWluLmNzcyc7XG4gICAgICAgICAgICBzZXRFbGVtZW50SHJlZihzcmMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc3JjID0gJ2d1bWdhLWxheW91dC9ndW1nYS1sYXlvdXQubWluLmNzcyc7XG4gICAgICAgIHNldEVsZW1lbnRIcmVmKHNyYyk7XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHNldFRoZW1lRGVmYXVsdDogc2V0VGhlbWVEZWZhdWx0LCBcbiAgICAgICAgc2V0VGhlbWU6IHNldFRoZW1lLCBcbiAgICAgICAgJGdldCgpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc2V0VGhlbWVEZWZhdWx0OiBzZXRUaGVtZURlZmF1bHQsXG4gICAgICAgICAgICAgICAgc2V0VGhlbWU6IHNldFRoZW1lXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufVxuXG5Qcm92aWRlci4kaW5qZWN0ID0gW107XG5cbmV4cG9ydCBkZWZhdWx0IFByb3ZpZGVyO1xuIl19
