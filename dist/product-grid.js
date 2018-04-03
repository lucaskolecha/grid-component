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
    bindings: {
        ngModel: '=',
        colors: '=',
        sizes: "=",
        layout: "=?"
    },
    controller: function controller() {
        var ctrl = this;

        ctrl.$onInit = function () {
            ctrl.selecionados = ctrl.ngModel;

            ctrl.cost = ctrl.cost || null;
            ctrl.sale = ctrl.sale || null;
            ctrl.margin = ctrl.margin || null;

            ctrl.addList = function (size) {
                ctrl.generate = size.map(function (sz) {
                    ctrl.blockInput = false;
                    return {
                        id: sz.id,
                        name: sz.name,
                        colors: []
                    };
                });
                ctrl.ngModel = ctrl.generate;
            };

            if (ctrl.selecionados) {
                ctrl.addList(ctrl.selecionados);
                ctrl.generate = ctrl.selecionados;

                ctrl.selecionados = ctrl.generate.map(function (item) {
                    return {
                        id: item.id,
                        name: item.name
                    };
                });
            }

            ctrl.removeListColor = function (value, index) {
                for (var i = 0; i <= ctrl.generate[index].colors.length - 1; i++) {
                    if (ctrl.generate[index].colors[i].name == value.name) ctrl.generate[index].colors.splice(i, 1);
                }
            };

            ctrl.calculateMargin = function () {
                return (ctrl.sale * 100 / ctrl.cost - 100) / 100 * 100;
            };

            ctrl.addBarCode = function (indexSize, indexColor) {

                var margin = ctrl.calculateMargin();

                ctrl.generate[indexSize].colors[indexColor].bars.push({
                    id: null,
                    value: '0000000000 - new',
                    cost: ctrl.cost,
                    sale: ctrl.sale,
                    margin: margin
                });
            };

            ctrl.removeBarCode = function (indexSize, indexColor, bar) {
                var index = ctrl.generate[indexSize].colors[indexColor].bars.indexOf(bar);
                ctrl.generate[indexSize].colors[indexColor].bars.splice(index, 1);
            };

            ctrl.generateBars = function (value, index) {
                if (ctrl.layout.bars) {
                    var margin = ctrl.calculateMargin();
                    ctrl.generate[index].colors.forEach(function (color) {
                        if (color.name == value.name) {
                            color.bars = [{
                                id: null,
                                value: '0000000000',
                                cost: ctrl.cost,
                                sale: ctrl.sale,
                                margin: margin
                            }];
                        }
                    });
                }
            };

            ctrl.removeList = function (value) {
                console.log(ctrl.generate.length);
                for (var i = 0; i <= ctrl.generate.length - 1; i++) {
                    if (ctrl.generate[i].id == value.id) ctrl.generate.splice(i, 1);
                }
                if (ctrl.generate.length == 0) {
                    ctrl.blockInput = true;
                }
            };

            ctrl.copyColors = function (index) {
                if (ctrl.layout.bars) {
                    var margin = ctrl.calculateMargin();
                    ctrl.generate[index].colors = ctrl.generate[index - 1].colors.map(function (t) {
                        return {
                            id: t.id,
                            name: t.name,
                            bars: [{
                                id: null,
                                value: '',
                                cost: ctrl.cost,
                                sale: ctrl.sale,
                                margin: margin
                            }]
                        };
                    });
                } else {
                    ctrl.generate[index].colors = ctrl.generate[index - 1].colors.map(function (t) {
                        return {
                            id: t.id,
                            name: t.name,
                            qtdColor: t.qtdColor
                        };
                    });
                }
            };

            ctrl.checkPrevious = function (index) {
                if (index > 0) {
                    return !ctrl.generate[index - 1].colors.length > 0;
                } else {
                    return true;
                }
            };

            ctrl.ngModel = ctrl.generate;
        };
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

angular.module('mobiageGrid', []).component('grid', _productGrid2.default);

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = "<div class=\"panel gmd ma-panel\">\n    <div class=\"panel-body ma-pad-panel\">\n        <div class=\"row\">\n            <div ng-class=\"$ctrl.layout.facilitator ? 'col-md-4' : 'col-md-12'\" style=\"margin-top: 7px;\">\n                <gumga-chips placeholder=\"Buscar Tamanho...\" on-remove=\"$ctrl.removeList(value)\" ng-model=\"$ctrl.selecionados\" input-position=\"start\">\n                    <gumga-chips-item ng-repeat=\"item in $ctrl.selecionados\" ng-value=\"item\">\n                        {{item.name}}\n                    </gumga-chips-item>\n                    <gumga-chips-option ng-repeat=\"option in $ctrl.sizes\" ng-value=\"option\">\n                        {{option.name}}\n                    </gumga-chips-option>\n                </gumga-chips>\n                <br>\n                <button class=\"btn btn-primary\" ng-class=\"$ctrl.layout.floatRightButton ? 'pull-right' : ''\" ng-hide=\"$ctrl.generate.length > 0\"\n                    ng-click=\"$ctrl.addList($ctrl.selecionados)\">Inserir Tamanhos</button>\n            </div>\n            <div class=\"col-xs-6 col-md-4\" ng-show=\"$ctrl.layout.facilitator\">\n                <gmd-input>\n                    <input type=\"text\" class=\"form-control gmd\" ng-disabled=\"$ctrl.blockInput == false\" ng-model=\"$ctrl.cost\" id=\"name\">\n                    <span class=\"bar\"></span>\n                    <label for=\"name\" class=\"control-label\">cost</label>\n                </gmd-input>\n            </div>\n            <div class=\"col-xs-6 col-md-4\" ng-show=\"$ctrl.layout.facilitator\">\n                <gmd-input>\n                    <input type=\"text\" class=\"form-control gmd\" ng-disabled=\"$ctrl.blockInput == false\" ng-model=\"$ctrl.sale\" id=\"sale\">\n                    <span class=\"bar\"></span>\n                    <label for=\"sale\" class=\"control-label\">sale</label>\n                </gmd-input>\n            </div>\n        </div>\n    </div>\n</div>\n<div ng-repeat=\"obj in $ctrl.generate\">\n    <div class=\"panel gmd ma-panel\" style=\"min-height: 123px;\">\n        <div class=\"panel-body ma-pad-card\">\n            <div class=\"row reset-height\">\n                <div class=\"ma-no-pad-left text-center\" ng-class=\"$ctrl.layout.bars ? 'col-md-1' : 'col-md-2'\">\n                    <label class=\"ma-label-grid\">\n                        <span class=\"bigger\">{{obj.name}}</span>\n                        <span ng-show=\"obj.colors.length > 0\" class=\"less\">Cores</span>\n                        <span ng-show=\"obj.colors.length > 0\" class=\"less\">{{obj.colors.length}}</span>\n                    </label>\n                </div>\n                <div ng-class=\"$ctrl.layout.bars ? 'col-md-5' : 'col-md-10'\">\n                    <div style=\"margin-top: 15px;\">\n                        <gumga-chips placeholder=\"Buscar Cor...\" item-focused=\"focusedColor\" on-remove=\"$ctrl.removeListColor(value, $index)\" on-selected=\"$ctrl.generateBars(value, $index)\"\n                            ng-model=\"obj.colors\" input-position=\"start\">\n                            <gumga-chips-item ng-repeat=\"item in obj.colors\" ng-value=\"item\">\n                                {{item.name}}\n                            </gumga-chips-item>\n                            <gumga-chips-option ng-if=\"option.name !== obj.colors[$index].name\" ng-repeat=\"option in $ctrl.colors\" ng-value=\"option\">\n                                {{option.name}}\n                            </gumga-chips-option>\n                        </gumga-chips>\n                        <a class=\"ma-grid-link\" ng-hide=\"!obj.colors.length == 0 || $ctrl.checkPrevious($index)\" ng-click=\"$ctrl.copyColors($index)\">Copiar cores do tamanho anterior</a>\n                    </div>\n                </div>\n                <div class=\"col-md-6\">\n                    <div class=\"row\" ng-repeat=\"color in obj.colors\">\n\n                        <div class=\"col-md-5 ma-no-pad-left\" style=\"margin-top: 15px;\" ng-if=\"color.id == focusedColor.id && $ctrl.layout.qtdColor\">\n                            <gmd-input>\n                                <input type=\"text\" class=\"form-control gmd\" ng-model=\"color.qtdColor\" id=\"qtdColor\" required>\n                                <span class=\"bar\"></span>\n                                <label for=\"qtdColor\" class=\"control-label\">Quantidade</label>\n                            </gmd-input>\n                        </div>\n\n                        <div ng-repeat=\"bar in obj.colors[$index].bars\" ng-if=\"color.id == focusedColor.id && $ctrl.layout.bars\">\n                            <div class=\"col-md-12\">\n                                <span class=\"glyphicon glyphicon-remove ma-remove-grid\" ng-if=\"!$first\" ng-click=\"$ctrl.removeBarCode($parent.$parent.$parent.$parent.$index,$parent.$parent.$parent.$index,bar)\"></span>\n                            </div>\n                            <div class=\"col-md-6\" style=\"margin-top: 25px;\">\n                                <div>\n                                    <gmd-input>\n                                        <input type=\"text\" class=\"form-control gmd\" ng-model=\"bar.value\" id=\"codBarras\" required>\n                                        <span class=\"bar\"></span>\n                                        <label for=\"codBarras\" class=\"control-label\">Cód. Barras</label>\n                                    </gmd-input>\n                                </div>\n                            </div>\n                            <div style=\"margin-top:10px;\">\n                                <div class=\"col-md-3\">\n                                    <gmd-input>\n                                        <input type=\"text\" class=\"form-control gmd\" ng-model=\"bar.cost\" id=\"intcost\">\n                                        <span class=\"bar\"></span>\n                                        <label for=\"intcost\" class=\"control-label\">cost</label>\n                                    </gmd-input>\n                                </div>\n                                <div class=\"col-md-2\">\n                                    <gmd-input>\n                                        <input type=\"text\" class=\"form-control gmd\" ng-model=\"bar.margin\" id=\"intmargin\">\n                                        <span class=\"bar\"></span>\n                                        <label for=\"intmargin\" class=\"control-label\">margin</label>\n                                    </gmd-input>\n                                </div>\n                                <div class=\"col-md-3\">\n                                    <gmd-input>\n                                        <input type=\"text\" class=\"form-control gmd\" ng-model=\"bar.sale\" id=\"intsale\">\n                                        <span class=\"bar\"></span>\n                                        <label for=\"intsale\" class=\"control-label\">sale</label>\n                                    </gmd-input>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"row\" ng-show=\"$ctrl.layout.bars\">\n                            <div class=\"col-md-12\" ng-if=\"color.$$hashKey == focusedColor.$$hashKey\">\n                                <a class=\"pull-right ma-grid-add-barcode \" ng-click=\"$ctrl.addBarCode($parent.$parent.$index,$index)\">Adicionar Cód. Barras</a>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>";

/***/ })
/******/ ]);