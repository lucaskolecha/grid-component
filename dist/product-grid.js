/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

__webpack_require__(2);

var Component = {
    template: __webpack_require__(3),
    controller: function controller() {

        var ctrl = this;

        ctrl.list = [];

        ctrl.addList = function (size) {
            ctrl.list.push({
                label: size.name,
                custo: ctrl.custo
            });
        };

        ctrl.removeList = function (size) {
            var index = ctrl.list.indexOf(size);
            ctrl.list.splice(index, 1);
        };
    },
    bindings: {
        colors: '=',
        sizes: "=",
        bars: "="
    }
};

exports.default = Component;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _productGrid = __webpack_require__(0);

var _productGrid2 = _interopRequireDefault(_productGrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

angular.module('components', []).component('grid', _productGrid2.default);

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = "<div class=\"ma-container\">\n    <div class=\"ma-page\">\n        <div class=\"row\">\n            <div class=\"col-md-12\">\n                <div class=\"panel gmd ma-panel\" style=\"margin-top: 15px;\">\n                    <div class=\"panel-body ma-pad-panel\">\n                        <div class=\"row\">\n                            <div class=\"col-md-4\" style=\"margin-top: 7px;\">\n                                <gumga-chips placeholder=\"Buscar Tamanho...\" on-selected=\"$ctrl.addList(value)\"\n                                             on-remove=\"$ctrl.removeList(value)\"\n                                             ng-model=\"sizes\" input-position=\"start\">\n                                    <gumga-chips-item ng-repeat=\"item in sizes\" ng-value=\"item\">\n                                        {{item.name}}\n                                    </gumga-chips-item>\n                                    <gumga-chips-option ng-repeat=\"option in $ctrl.sizes\" ng-value=\"option\">\n                                        {{option.name}}\n                                    </gumga-chips-option>\n                                </gumga-chips>\n                            </div>\n                            <div class=\"col-md-4\">\n                                <gmd-input>\n                                    <input type=\"text\"\n                                           class=\"form-control gmd\"\n                                           ng-model=\"$ctrl.custo\" id=\"name\">\n                                    <span class=\"bar\"></span>\n                                    <label for=\"name\" class=\"control-label\">Custo</label>\n                                </gmd-input>\n                            </div>\n                            <div class=\"col-md-4\">\n                                <gmd-input>\n                                    <input type=\"text\"\n                                           class=\"form-control gmd\"\n                                           ng-model=\"venda\" id=\"venda\">\n                                    <span class=\"bar\"></span>\n                                    <label for=\"venda\" class=\"control-label\">Venda</label>\n                                </gmd-input>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"row\" ng-repeat=\"obj in $ctrl.list\">\n            <div class=\"col-md-12\">\n                <div class=\"panel gmd ma-panel\">\n                    <div class=\"panel-body ma-pad-card\">\n                        <div class=\"row reset-height\">\n                            <div class=\"col-md-1 ma-no-pad-left\">\n                                <label class=\"ma-label-grid\">\n                                    <span class=\"bigger\">{{obj.label}}</span>\n                                    <span ng-show=\"colors.length > 0\" class=\"less\">Cores</span>\n                                    <span ng-show=\"colors.length > 0\" class=\"less\">{{colors.length}}</span>\n                                </label>\n                            </div>\n                            <div class=\"col-md-5\">\n                                <div style=\"margin-top: 16px;\">\n                                    <gumga-chips placeholder=\"Buscar Cor...\"\n                                                 ng-model=\"colors\" input-position=\"start\">\n                                        <gumga-chips-item ng-repeat=\"item in colors\" ng-value=\"item\">\n                                            {{item.name}}\n                                        </gumga-chips-item>\n                                        <gumga-chips-option ng-repeat=\"option in $ctrl.colors\" ng-value=\"option\">\n                                            {{option.name}}\n                                        </gumga-chips-option>\n                                    </gumga-chips>\n                                </div>\n                            </div>\n                            <div class=\"col-md-6\">\n                                <div class=\"row\">\n                                    <div class=\"col-md-6\">\n                                        <div style=\"margin-top: 30px;\">\n                                            <gmd-input>\n                                                <input type=\"text\"\n                                                       class=\"form-control gmd\"\n                                                       ng-model=\"barras\" id=\"barras\"\n                                                       required>\n                                                <span class=\"bar\"></span>\n                                                <label for=\"barras\" class=\"control-label\">Cód. Barras</label>\n                                            </gmd-input>\n                                        </div>\n                                    </div>\n                                    <div class=\"col-md-6\">\n                                        <div class=\"row\">\n                                            <div class=\"col-md-6\">\n                                                <gmd-input>\n                                                    <input type=\"text\"\n                                                           class=\"form-control gmd\"\n                                                           ng-model=\"intCusto\" id=\"intCusto\"\n                                                           required>\n                                                    <span class=\"bar\"></span>\n                                                    <label for=\"intCusto\" class=\"control-label\">Custo</label>\n                                                </gmd-input>\n                                            </div>\n                                            <div class=\"col-md-6\">\n                                                <gmd-input>\n                                                    <input type=\"text\"\n                                                           class=\"form-control gmd\"\n                                                           ng-model=\"intMargem\" id=\"intMargem\"\n                                                           required>\n                                                    <span class=\"bar\"></span>\n                                                    <label for=\"intMargem\" class=\"control-label\">Margem</label>\n                                                </gmd-input>\n                                            </div>\n                                            <div class=\"col-md-12\">\n                                                <gmd-input>\n                                                    <input type=\"text\"\n                                                           class=\"form-control gmd\"\n                                                           ng-model=\"intVenda\" id=\"intVenda\"\n                                                           required>\n                                                    <span class=\"bar\"></span>\n                                                    <label for=\"intVenda\" class=\"control-label\">Venda</label>\n                                                </gmd-input>\n                                            </div>\n                                        </div>\n\n\n\n\n\n                                    </div>\n                                </div>\n\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n        <!--<div class=\"row\">-->\n        <!--<div class=\"col-md-12\">-->\n        <!--<p ng-repeat=\"color in $ctrl.colors\">-->\n        <!--{{color.id}} - {{color.name}}-->\n        <!--</p>-->\n        <!--<hr>-->\n        <!--<p ng-repeat=\"size in $ctrl.sizes\">-->\n        <!--{{size.id}} - {{size.name}}-->\n        <!--</p>-->\n        <!--<hr>-->\n        <!--<p ng-repeat=\"color in $ctrl.colors\">-->\n        <!--<span ng-repeat=\"size in $ctrl.sizes\"> (Tamanho: {{size.name}}, Cor: {{color.name}})</span>-->\n        <!--</p>-->\n        <!--<p ng-repeat=\"bar in $ctrl.bars\">-->\n        <!--<span>Código de Barras: {{bar.name}}<span>-->\n        <!--</p>-->\n        <!--</div>-->\n        <!--</div>-->\n    </div>\n</div>\n\n";

/***/ })
/******/ ]);