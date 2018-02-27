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

        ctrl.ngModel = [];
        ctrl.cost = ctrl.cost || null;
        ctrl.sale = ctrl.sale || null;
        ctrl.margin = ctrl.margin || null;

        ctrl.addList = function (size) {
            return ctrl.ngModel = size.map(function (sz) {
                ctrl.blockInput = false;
                return {
                    id: sz.id,
                    label: sz.name,
                    colors: []
                };
            });
        };

        ctrl.calculateMargin = function () {
            return (ctrl.sale * 100 / ctrl.cost - 100) / 100 * 100;
        };

        ctrl.addBarCode = function (indexSize, indexColor) {

            var margin = ctrl.calculateMargin();

            ctrl.ngModel[indexSize].colors[indexColor].bars.push({
                id: null,
                value: '0000000000 - new',
                cost: ctrl.cost,
                sale: ctrl.sale,
                margin: margin
            });
        };

        ctrl.removeBarCode = function (indexSize, indexColor, bar) {
            var index = ctrl.ngModel[indexSize].colors[indexColor].bars.indexOf(bar);
            ctrl.ngModel[indexSize].colors[indexColor].bars.splice(index, 1);
        };

        ctrl.generateBars = function (value, index) {

            var margin = ctrl.calculateMargin();

            ctrl.ngModel[index].colors.push({
                id: value.id,
                name: value.name,
                bars: [{
                    id: null,
                    value: '0000000000 - ' + value.name,
                    cost: ctrl.cost,
                    sale: ctrl.sale,
                    margin: margin
                }]
            });
        };

        ctrl.removeListColor = function (value, index) {
            for (var i = 0; i <= ctrl.ngModel[index].colors.length - 1; i++) {
                if (ctrl.ngModel[index].colors[i].name == value.name) ctrl.ngModel[index].colors.splice(i, 1);
            }
        };

        ctrl.removeList = function (value) {
            for (var i = 0; i <= ctrl.ngModel.length - 1; i++) {
                if (ctrl.ngModel[i].id == value.id) ctrl.ngModel.splice(i, 1);
            }
            if (ctrl.ngModel.length == 0) {
                ctrl.blockInput = true;
            }
        };

        ctrl.copyColors = function (index) {
            var arrayColor = angular.copy(ctrl.ngModel[index - 1].colors);

            ctrl.ngModel[index].colors = arrayColor;
        };
    },
    bindings: {
        ngModel: '=',
        colors: '=',
        sizes: "="
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

module.exports = "<div class=\"ma-container\">\n    <div class=\"ma-page\">\n        <div class=\"row\">\n            <div class=\"col-md-12\">\n                <div class=\"panel gmd ma-panel\" style=\"margin-top: 15px;\">\n                    <div class=\"panel-body ma-pad-panel\">\n                        <div class=\"row\">\n                            <div class=\"col-md-4\" style=\"margin-top: 7px;\">\n                                <gumga-chips placeholder=\"Buscar Tamanho...\" on-remove=\"$ctrl.removeList(value)\" ng-model=\"sizes\" input-position=\"start\">\n                                    <gumga-chips-item ng-repeat=\"item in sizes\" ng-value=\"item\">\n                                        {{item.name}}\n                                    </gumga-chips-item>\n                                    <gumga-chips-option ng-repeat=\"option in $ctrl.sizes\" ng-value=\"option\">\n                                        {{option.name}}\n                                    </gumga-chips-option>\n                                </gumga-chips>\n                                <br>\n                                <button class=\"btn btn-primary\" ng-click=\"$ctrl.addList(sizes)\">Inserir Tamanhos\n                                </button>\n                            </div>\n                            <div class=\"col-md-4\">\n                                <gmd-input>\n                                    <input type=\"text\" class=\"form-control gmd\" ng-disabled=\"$ctrl.blockInput == false\" ng-model=\"$ctrl.cost\" id=\"name\">\n                                    <span class=\"bar\"></span>\n                                    <label for=\"name\" class=\"control-label\">cost</label>\n                                </gmd-input>\n                            </div>\n                            <div class=\"col-md-4\">\n                                <gmd-input>\n                                    <input type=\"text\" class=\"form-control gmd\" ng-disabled=\"$ctrl.blockInput == false\" ng-model=\"$ctrl.sale\" id=\"sale\">\n                                    <span class=\"bar\"></span>\n                                    <label for=\"sale\" class=\"control-label\">sale</label>\n                                </gmd-input>\n                            </div>\n                        </div>\n                        <div class=\"row reset-height\" style=\"display: none;\">\n                            <div class=\"col-md-12\">\n                                <button class=\"btn btn-primary\">Gerar tamanhos</button>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"row\" ng-repeat=\"obj in $ctrl.ngModel\">\n            <div class=\"col-md-12\">\n                <div class=\"panel gmd ma-panel\" style=\"min-height: 123px;\">\n                    <div class=\"panel-body ma-pad-card\">\n                        <div class=\"row reset-height\">\n                            <div class=\"col-md-1 ma-no-pad-left text-center\">\n                                <label style=\"text-align: center;\n                                width: 90px;\n                                border: 10px solid var(--primary);\n                                margin-left: 14px;\n                                margin-top: 16px;\n                                height: 90px;\n                                background-color: var(--primary);\n                                border-radius: 50%;\n                                color: #fff;\n                                -webkit-box-shadow: 0px 5px 5px 0px rgba(0,0,0,0.37);\n                                -moz-box-shadow: 0px 5px 5px 0px rgba(0,0,0,0.37);\n                                box-shadow: 0px 5px 5px 0px rgba(0,0,0,0.37)\" class=\"ma-label-grid\">\n                                    <span class=\"bigger\">{{obj.label}}</span>\n                                    <span ng-show=\"colors.length > 0\" class=\"less\">Cores</span>\n                                    <span ng-show=\"colors.length > 0\" class=\"less\">{{colors.length}}</span>\n                                </label>\n                            </div>\n                            <div class=\"col-md-5\">\n                                <div style=\"margin-top: 35px;\">\n                                    <gumga-chips placeholder=\"Buscar Cor...\" item-focused=\"focusedColor\" on-remove=\"$ctrl.removeListColor(value, $index)\" on-selected=\"$ctrl.generateBars(value, $index)\"\n                                        ng-model=\"colors\" input-position=\"start\">\n                                        <gumga-chips-item ng-repeat=\"item in colors\" ng-value=\"item\">\n                                            {{item.name}}\n                                        </gumga-chips-item>\n                                        <gumga-chips-option ng-repeat=\"option in $ctrl.colors\" ng-value=\"option\">\n                                            {{option.name}}\n                                        </gumga-chips-option>\n                                    </gumga-chips>\n                                    <a ng-show=\"!$first\"style=\"cursor:pointer; float:right;margin-top:7px;\" ng-click=\"$ctrl.copyColors($index)\">Copiar cores do tamanho anterior</a>\n                                </div>\n                            </div>\n                            <div class=\"col-md-6\">\n                                <div class=\"row\" ng-repeat=\"color in colors\">\n                                    <div ng-repeat=\"bar in obj.colors[$index].bars\" ng-if=\"color.id == focusedColor.id\">\n                                        <div class=\"col-md-12\" style=\"margin-top: 25px;\">\n                                            <span class=\"glyphicon glyphicon-remove\" ng-if=\"!$first\" ng-click=\"$ctrl.removeBarCode($parent.$parent.$parent.$parent.$index,$parent.$parent.$parent.$index,bar)\"\n                                                style=\"position: absolute;\n                                                z-index: 100;\n                                                right: 14px;\n                                                color: #d70000;\n                                                font-size: 14px;\n                                                cursor: pointer;\"></span>\n                                            <div>\n                                                <gmd-input>\n                                                    <input type=\"text\" class=\"form-control gmd\" ng-model=\"bar.value\" id=\"codBarras\" required>\n                                                    <span class=\"bar\"></span>\n                                                    <label for=\"codBarras\" class=\"control-label\">Cód. Barras</label>\n                                                </gmd-input>\n                                            </div>\n                                        </div>\n                                        <div style=\"margin-top:10px;\">\n                                            <div class=\"col-md-3\">\n                                                <gmd-input>\n                                                    <input type=\"text\" class=\"form-control gmd\" ng-model=\"bar.cost\" id=\"intcost\">\n                                                    <span class=\"bar\"></span>\n                                                    <label for=\"intcost\" class=\"control-label\">cost</label>\n                                                </gmd-input>\n                                            </div>\n                                            <div class=\"col-md-3\">\n                                                <gmd-input>\n                                                    <input type=\"text\" class=\"form-control gmd\" ng-model=\"bar.sale\" id=\"intsale\">\n                                                    <span class=\"bar\"></span>\n                                                    <label for=\"intsale\" class=\"control-label\">sale</label>\n                                                </gmd-input>\n                                            </div>\n                                            <div class=\"col-md-2\">\n                                                <gmd-input>\n                                                    <input type=\"text\" class=\"form-control gmd\" ng-model=\"bar.margin\" id=\"intmargin\">\n                                                    <span class=\"bar\"></span>\n                                                    <label for=\"intmargin\" class=\"control-label\">margin</label>\n                                                </gmd-input>\n                                            </div>\n                                        </div>\n                                    </div>\n                                    <div class=\"row\">\n                                        <div class=\"col-md-12\" style=\"margin-top: -33px;\" ng-if=\"color.id == focusedColor.id\">\n                                            <a class=\"pull-right\" style=\"margin-bottom: 15px; margin-top: 5px; cursor: pointer\" ng-click=\"$ctrl.addBarCode($parent.$parent.$index,$index)\">Adicionar Cód. Barras</a>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>";

/***/ })
/******/ ]);