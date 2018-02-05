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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComparisonOperator; });
var ComparisonOperator;
(function (ComparisonOperator) {
    ComparisonOperator[ComparisonOperator["CONTAINS"] = 0] = "CONTAINS";
    ComparisonOperator[ComparisonOperator["NOT_CONTAINS"] = 1] = "NOT_CONTAINS";
    ComparisonOperator[ComparisonOperator["STARTS_WITH"] = 2] = "STARTS_WITH";
    ComparisonOperator[ComparisonOperator["ENDS_WITH"] = 3] = "ENDS_WITH";
    ComparisonOperator[ComparisonOperator["EQUAL"] = 4] = "EQUAL";
    ComparisonOperator[ComparisonOperator["NOT_EQUAL"] = 5] = "NOT_EQUAL";
    ComparisonOperator[ComparisonOperator["GREATER_EQUAL"] = 6] = "GREATER_EQUAL";
    ComparisonOperator[ComparisonOperator["GREATER"] = 7] = "GREATER";
    ComparisonOperator[ComparisonOperator["LOWER_EQUAL"] = 8] = "LOWER_EQUAL";
    ComparisonOperator[ComparisonOperator["LOWER"] = 9] = "LOWER";
    ComparisonOperator[ComparisonOperator["IN_ELEMENTS"] = 10] = "IN_ELEMENTS";
    ComparisonOperator[ComparisonOperator["IS"] = 11] = "IS";
    ComparisonOperator[ComparisonOperator["IN"] = 12] = "IN";
    ComparisonOperator[ComparisonOperator["BETWEEN"] = 13] = "BETWEEN";
    ComparisonOperator[ComparisonOperator["LIKE"] = 14] = "LIKE";
})(ComparisonOperator || (ComparisonOperator = {}));


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CriteriaJoinType; });
var CriteriaJoinType;
(function (CriteriaJoinType) {
    CriteriaJoinType[CriteriaJoinType["ON"] = 0] = "ON";
    CriteriaJoinType[CriteriaJoinType["OR"] = 1] = "OR";
    CriteriaJoinType[CriteriaJoinType["AND"] = 2] = "AND";
})(CriteriaJoinType || (CriteriaJoinType = {}));


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Criteria; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__comparison_operator__ = __webpack_require__(0);

var Criteria = (function () {
    function Criteria(field, comparisonOperator, value) {
        if (field === void 0) { field = 1; }
        if (value === void 0) { value = 1; }
        this.init();
        this.field = field;
        this.comparisonOperator = comparisonOperator && typeof comparisonOperator == "string" ? comparisonOperator : __WEBPACK_IMPORTED_MODULE_0__comparison_operator__["a" /* ComparisonOperator */][comparisonOperator];
        this.value = value;
    }
    Criteria.prototype.init = function () {
        this.comparisonOperator = __WEBPACK_IMPORTED_MODULE_0__comparison_operator__["a" /* ComparisonOperator */][__WEBPACK_IMPORTED_MODULE_0__comparison_operator__["a" /* ComparisonOperator */].EQUAL];
        this.fieldFunction = "%s";
        this.valueFunction = "%s";
    };
    Criteria.prototype.getField = function () {
        return this.field;
    };
    Criteria.prototype.setField = function (field) {
        this.field = field;
    };
    Criteria.prototype.getComparisonOperator = function () {
        return this.comparisonOperator;
    };
    Criteria.prototype.setComparisonOperator = function (comparisonOperator) {
        this.comparisonOperator = __WEBPACK_IMPORTED_MODULE_0__comparison_operator__["a" /* ComparisonOperator */][comparisonOperator];
    };
    Criteria.prototype.getValue = function () {
        return this.value;
    };
    Criteria.prototype.setValue = function (value) {
        this.value = value;
    };
    Criteria.prototype.getValues = function () {
        return this.values;
    };
    Criteria.prototype.setValues = function (values) {
        this.values = values;
    };
    Criteria.prototype.getFieldFunction = function () {
        return this.fieldFunction;
    };
    Criteria.prototype.setFieldFunction = function (fieldFunction) {
        this.fieldFunction = fieldFunction;
    };
    Criteria.prototype.getValueFunction = function () {
        return this.valueFunction;
    };
    Criteria.prototype.setValueFunction = function (valueFunction) {
        this.valueFunction = valueFunction;
    };
    return Criteria;
}());



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JoinType; });
var JoinType;
(function (JoinType) {
    JoinType[JoinType["INNER"] = 0] = "INNER";
    JoinType[JoinType["LEFT"] = 1] = "LEFT";
})(JoinType || (JoinType = {}));


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LogicalOperator; });
var LogicalOperator;
(function (LogicalOperator) {
    LogicalOperator[LogicalOperator["SIMPLE"] = 0] = "SIMPLE";
    LogicalOperator[LogicalOperator["NOT"] = 1] = "NOT";
    LogicalOperator[LogicalOperator["OR"] = 2] = "OR";
    LogicalOperator[LogicalOperator["AND"] = 3] = "AND";
})(LogicalOperator || (LogicalOperator = {}));


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__logical_operator__ = __webpack_require__(4);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_0__logical_operator__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__criteria__ = __webpack_require__(2);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__criteria__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__gquery__ = __webpack_require__(9);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_2__gquery__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__comparison_operator__ = __webpack_require__(0);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_3__comparison_operator__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__join_type__ = __webpack_require__(3);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return __WEBPACK_IMPORTED_MODULE_4__join_type__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__join__ = __webpack_require__(10);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return __WEBPACK_IMPORTED_MODULE_5__join__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__criteria_field__ = __webpack_require__(7);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return __WEBPACK_IMPORTED_MODULE_6__criteria_field__["a"]; });









/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__models__ = __webpack_require__(5);

window.GQuery = window.GQuery || __WEBPACK_IMPORTED_MODULE_0__models__["a" /* GQuery */];
window.Criteria = window.Criteria || __WEBPACK_IMPORTED_MODULE_0__models__["b" /* Criteria */];
window.ComparisonOperator = window.ComparisonOperator || __WEBPACK_IMPORTED_MODULE_0__models__["c" /* ComparisonOperator */];
window.LogicalOperator = window.LogicalOperator || __WEBPACK_IMPORTED_MODULE_0__models__["d" /* LogicalOperator */];
window.JoinType = window.JoinType || __WEBPACK_IMPORTED_MODULE_0__models__["e" /* JoinType */];
window.Join = window.Join || __WEBPACK_IMPORTED_MODULE_0__models__["f" /* Join */];
window.CriteriaField = window.CriteriaField || __WEBPACK_IMPORTED_MODULE_0__models__["g" /* CriteriaField */];
/* harmony default export */ __webpack_exports__["default"] = (window.GQuery);


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CriteriaField; });
var CriteriaField = (function () {
    function CriteriaField(field) {
        this.field = field;
    }
    return CriteriaField;
}());



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CriteriaJoin; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__criteria_join_type__ = __webpack_require__(1);

var CriteriaJoin = (function () {
    function CriteriaJoin(criteria, type) {
        this.criteria = criteria;
        this.type = __WEBPACK_IMPORTED_MODULE_0__criteria_join_type__["a" /* CriteriaJoinType */][type];
    }
    return CriteriaJoin;
}());



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GQuery; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__logical_operator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__criteria__ = __webpack_require__(2);


var GQuery = (function () {
    function GQuery(p1, p2, p3) {
        this.subQuerys = [];
        this.joins = [];
        if (typeof p1 == "number")
            this.logicalOperator = __WEBPACK_IMPORTED_MODULE_0__logical_operator__["a" /* LogicalOperator */][p1];
        if (typeof p2 == "number")
            this.logicalOperator = __WEBPACK_IMPORTED_MODULE_0__logical_operator__["a" /* LogicalOperator */][p2];
        if (typeof p3 == "number")
            this.logicalOperator = __WEBPACK_IMPORTED_MODULE_0__logical_operator__["a" /* LogicalOperator */][p3];
        if (p1 instanceof __WEBPACK_IMPORTED_MODULE_1__criteria__["a" /* Criteria */])
            this.criteria = p1;
        if (p2 instanceof __WEBPACK_IMPORTED_MODULE_1__criteria__["a" /* Criteria */])
            this.criteria = p2;
        if (p3 instanceof __WEBPACK_IMPORTED_MODULE_1__criteria__["a" /* Criteria */])
            this.criteria = p3;
        if (p1 instanceof Array)
            this.subQuerys = p1;
        if (p2 instanceof Array)
            this.subQuerys = p2;
        if (p3 instanceof Array)
            this.subQuerys = p3;
        if (!this.logicalOperator)
            this.logicalOperator = 'SIMPLE';
    }
    GQuery.prototype.getLogicalOperator = function () {
        return this.logicalOperator;
    };
    GQuery.prototype.setLogicalOperator = function (logicalOperator) {
        this.logicalOperator = __WEBPACK_IMPORTED_MODULE_0__logical_operator__["a" /* LogicalOperator */][logicalOperator];
        return this;
    };
    GQuery.prototype.getCriteria = function () {
        return this.criteria;
    };
    GQuery.prototype.setCriteria = function (criteria) {
        this.criteria = criteria;
        return this;
    };
    GQuery.prototype.getSubQuerys = function () {
        return this.subQuerys;
    };
    GQuery.prototype.setSubQuerys = function (subQuerys) {
        this.subQuerys = subQuerys;
        return this;
    };
    GQuery.prototype.andGQuery = function (other) {
        if (__WEBPACK_IMPORTED_MODULE_0__logical_operator__["a" /* LogicalOperator */][__WEBPACK_IMPORTED_MODULE_0__logical_operator__["a" /* LogicalOperator */].AND] === this.logicalOperator) {
            this.subQuerys = this.subQuerys || new Array();
            this.subQuerys.push(other);
            return this;
        }
        return new GQuery(__WEBPACK_IMPORTED_MODULE_0__logical_operator__["a" /* LogicalOperator */].AND, null, new Array(this, other));
    };
    GQuery.prototype.and = function (criteriaOrGQuery) {
        if (criteriaOrGQuery instanceof GQuery) {
            return this.andGQuery(criteriaOrGQuery);
        }
        else {
            var other = new GQuery();
            other.setCriteria(criteriaOrGQuery);
            if (__WEBPACK_IMPORTED_MODULE_0__logical_operator__["a" /* LogicalOperator */][__WEBPACK_IMPORTED_MODULE_0__logical_operator__["a" /* LogicalOperator */].AND] == this.logicalOperator) {
                this.subQuerys = Object.assign(new Array(), this.subQuerys);
                this.subQuerys.push(other);
                return this;
            }
            return new GQuery(__WEBPACK_IMPORTED_MODULE_0__logical_operator__["a" /* LogicalOperator */].AND, null, new Array(this, other));
        }
    };
    GQuery.prototype.orGQuery = function (other) {
        if (__WEBPACK_IMPORTED_MODULE_0__logical_operator__["a" /* LogicalOperator */][__WEBPACK_IMPORTED_MODULE_0__logical_operator__["a" /* LogicalOperator */].OR] == this.logicalOperator) {
            this.subQuerys = Object.assign(new Array(), this.subQuerys);
            this.subQuerys.push(other);
            return this;
        }
        return new GQuery(__WEBPACK_IMPORTED_MODULE_0__logical_operator__["a" /* LogicalOperator */].OR, null, new Array(this, other));
    };
    GQuery.prototype.or = function (criteriaOrGQuery) {
        if (criteriaOrGQuery instanceof GQuery) {
            return this.orGQuery(criteriaOrGQuery);
        }
        else {
            var other = new GQuery(null, criteriaOrGQuery);
            if (__WEBPACK_IMPORTED_MODULE_0__logical_operator__["a" /* LogicalOperator */][__WEBPACK_IMPORTED_MODULE_0__logical_operator__["a" /* LogicalOperator */].OR] == this.logicalOperator) {
                this.subQuerys = Object.assign(new Array(), this.subQuerys);
                this.subQuerys.push(other);
                return this;
            }
            return new GQuery(__WEBPACK_IMPORTED_MODULE_0__logical_operator__["a" /* LogicalOperator */].OR, null, new Array(this, other));
        }
    };
    GQuery.prototype.join = function (join) {
        this.joins.push(join);
        return this;
    };
    return GQuery;
}());



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Join; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__join_type__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__criteria_join__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__criteria_join_type__ = __webpack_require__(1);



var Join = (function () {
    function Join(table, type) {
        this.subQuerys = [];
        this.table = table;
        this.type = __WEBPACK_IMPORTED_MODULE_0__join_type__["a" /* JoinType */][type];
    }
    Join.prototype.on = function (criteria) {
        this.subQuerys.push(new __WEBPACK_IMPORTED_MODULE_1__criteria_join__["a" /* CriteriaJoin */](criteria, __WEBPACK_IMPORTED_MODULE_2__criteria_join_type__["a" /* CriteriaJoinType */].ON));
        return this;
    };
    Join.prototype.and = function (criteria) {
        this.subQuerys.push(new __WEBPACK_IMPORTED_MODULE_1__criteria_join__["a" /* CriteriaJoin */](criteria, __WEBPACK_IMPORTED_MODULE_2__criteria_join_type__["a" /* CriteriaJoinType */].AND));
        return this;
    };
    Join.prototype.or = function (criteria) {
        this.subQuerys.push(new __WEBPACK_IMPORTED_MODULE_1__criteria_join__["a" /* CriteriaJoin */](criteria, __WEBPACK_IMPORTED_MODULE_2__criteria_join_type__["a" /* CriteriaJoinType */].OR));
        return this;
    };
    return Join;
}());



/***/ })
/******/ ]);