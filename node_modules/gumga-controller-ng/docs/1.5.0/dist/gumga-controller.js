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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
  'use strict';

  function GumgaController(Service, identifierOrConfiguration, container, pageModel) {
    var self = this;
    this.and = this;
    this.data = [];
    this.page = 1;
    this.pageSize = 10;
    this.count = 0;
    this.records = [];
    this.pageModel = pageModel;
    this.container = container;
    this.identifierOrConfiguration = identifierOrConfiguration;

    this.storage = {
      set: function set(key, value) {
        sessionStorage.setItem(identifierOrConfiguration + '-' + key, value);
      },
      get: function get(key) {
        return sessionStorage.getItem(identifierOrConfiguration + '-' + key);
      }
    };

    this.setPageInContainer = function () {
      if (!self.container[pageModel]) {
        var page = parseInt(self.storage.get('page') || self.page);
        self.container[pageModel] = page;
      }
    };

    this.handlingStorage = function (page, pageSize, field, way, param) {
      if (!page) {
        page = parseInt(self.storage.get('page') || self.page);
      }
      if (!pageSize) {
        pageSize = parseInt(self.storage.get('pageSize') || self.pageSize);
      }
      if (!field) {
        field = self.storage.get('field');
      }
      if (!way) {
        way = self.storage.get('way');
      }
      if (!param) {
        param = "";
      }
      self.storage.set('page', page || self.page);
      self.storage.set('pageSize', pageSize || self.pageSize);
      self.storage.set('field', field);
      self.storage.set('way', way);
      self.storage.set('param', param);

      return {
        page: page,
        pageSize: pageSize,
        field: field,
        way: way,
        param: param
      };
    };

    this.methods = {
      getLatestOperation: function getLatestOperation() {
        self.setPageInContainer();
        var operation = self.storage.get('last-operation');
        if (!operation) {
          self.methods.get(self.storage.get('page'), self.storage.get('pageSize'));
        }
        switch (operation) {
          case 'get':
            self.methods.get(self.storage.get('page'), self.storage.get('pageSize'));
            break;
          case 'sort':
            self.methods.sort(self.storage.get('field'), self.storage.get('way'), self.storage.get('pageSize'));
            break;
          case 'search':
            self.methods.search(self.storage.get('field'), self.storage.get('param'), self.storage.get('pageSize'), self.storage.get('page'));
            break;
          case 'asyncSearch':
            self.methods.asyncSearch(self.storage.get('field'), self.storage.get('param'));
            break;
          case 'advancedSearch':
            self.methods.advancedSearch(JSON.parse(self.storage.get('param')), self.storage.get('pageSize'), self.storage.get('page'));
            break;
          default:
            self.methods.get(self.storage.get('page'), self.storage.get('pageSize'));
        }
      },
      getRecords: function getRecords() {
        return self.records;
      },
      asyncSearch: function asyncSearch(field, param) {
        var storage = self.handlingStorage(undefined, undefined, field, undefined, param);
        self.storage.set('last-operation', 'asyncSearch');
        return Service.getSearch(field, param).then(function (data) {
          self.storage.set('pageSize', data.data.pageSize);
          return data.data.values;
        });
      },
      asyncPost: function asyncPost(value, param) {
        self.emit('asyncPostStart');
        return Service.save(value);
      },
      get: function get(page, pageSize) {
        if (!pageSize) pageSize = self.pageSize;
        if (!page) page = self.page;
        var storage = self.handlingStorage(page, pageSize);
        self.storage.set('last-operation', 'get');
        self.emit('getStart');
        Service.get(page, pageSize).then(function (data) {
          self.emit('getSuccess', data.data);
          self.data = data.data.values;
          self.pageSize = data.data.pageSize;
          self.storage.set('pageSize', data.data.pageSize);
          self.count = data.data.count;
          self.data.map(function (record) {
            return self.records.push(record.id);
          });
        }, function (err) {
          self.emit('getError', err);
        });
        return self;
      },
      getId: function getId() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        self.emit('getIdStart');
        Service.getById(id).then(function (data) {
          self.emit('getIdSuccess', data.data);
          self.data = data.data;
          if (self.pageSize) delete self.pageSize;
          if (self.count) delete self.count;
        }, function (err) {
          self.emit('getIdError', err);
        });
        return self;
      },
      getNew: function getNew() {
        self.emit('getNewStart');
        Service.getNew().then(function (data) {
          self.emit('getNewSuccess', data.data);
          self.data = data.data;
          if (self.pageSize) delete self.pageSize;
          if (self.count) delete self.count;
        }, function (err) {
          self.emit('getNewError', err);
        });
        return self;
      },
      put: function put(value) {
        self.emit('putStart');
        Service.update(value).then(function (data) {
          self.emit('putSuccess', data);
        }, function (err) {
          self.emit('putError', err);
        });
        return self;
      },
      post: function post(value) {
        self.emit('postStart');
        Service.save(value).then(function (data) {
          self.emit('postSuccess', data);
        }, function (err) {
          self.emit('postError', err);
        });
        return self;
      },
      delete: function _delete(array) {
        self.emit('deleteStart');
        Service.deleteCollection(array).then(function (data) {
          self.emit('deleteSuccess', data);
        }, function (err) {
          self.emit('deleteError', err);
        });
        return self;
      },
      sort: function sort(field, way, pageSize) {
        if (!pageSize) pageSize = self.pageSize;
        var storage = self.handlingStorage(undefined, pageSize, field, way);
        var page = storage.page;
        self.storage.set('last-operation', 'sort');
        self.emit('sortStart');
        Service.sort(field, way, pageSize, page).then(function (data) {
          self.emit('sortSuccess', data.data);
          self.data = data.data.values;
          self.pageSize = data.data.pageSize;
          self.count = data.data.count;
          self.storage.set('pageSize', data.data.pageSize);
        }, function (err) {
          self.emit('sortError', err);
        });
        return self;
      },
      search: function search(field, param, pageSize, page) {
        if (!pageSize) pageSize = self.pageSize;
        if (!page) page = self.page;
        var storage = self.handlingStorage(page, pageSize, field, undefined, param);
        self.storage.set('last-operation', 'search');
        self.emit('searchStart');
        Service.getSearch(field, param, pageSize, page).then(function (data) {
          self.emit('searchSuccess', data.data);
          self.data = data.data.values;
          self.pageSize = data.data.pageSize;
          self.count = data.data.count;
          self.storage.set('pageSize', data.data.pageSize);
        }, function (err) {
          self.emit('searchError', err);
        });
        return self;
      },
      advancedSearch: function advancedSearch(param, pageSize, page) {
        if (!pageSize) pageSize = self.pageSize;
        if (!page) page = self.page;
        var storage = self.handlingStorage(page, pageSize, undefined, undefined, JSON.stringify(param));
        self.storage.set('last-operation', 'advancedSearch');
        self.emit('advancedSearchStart');
        Service.getAdvancedSearch(param, pageSize, page).then(function (data) {
          self.emit('advancedSearchSuccess', data.data);
          self.data = data.data.values;
          self.pageSize = data.data.pageSize;
          self.count = data.data.count;
          self.storage.set('pageSize', data.data.pageSize);
        }, function (err) {
          self.emit('advancedSearchError', err);
        });
        return self;
      },
      searchWithGQuery: function searchWithGQuery(gQuery, page, pageSize) {
        if (!pageSize) pageSize = self.pageSize;
        if (!page) page = self.page;
        self.lastGQuery = gQuery;
        self.emit('searchWithGQueryStart');
        Service.searchWithGQuery(gQuery, page, pageSize).then(function (data) {
          self.emit('searchWithGQuerySuccess', data.data);
          self.data = data.data.values;
          self.pageSize = data.data.pageSize;
          self.count = data.data.count;
        }, function (err) {
          self.emit('searchWithGQueryError', err);
        });
        return self;
      },
      redoSearch: function redoSearch() {
        self.emit('redoSearchStart');
        Service.redoSearch().then(function (data) {
          self.emit('redoSearchSuccess', data.data);
          self.data = data.data.values;
          self.pageSize = data.data.pageSize;
          self.count = data.data.count;
        }, function (err) {
          self.emit('redoSearchError', err);
        });
        return self;
      },
      postQuery: function postQuery(query, name) {
        self.emit('postQueryStart');
        Service.saveQuery({ query: query, name: name }).then(function (data) {
          self.emit('postQuerySuccess');
        }, function (err) {
          self.emit('postQueryError', err);
        });
        return self;
      },
      getQuery: function getQuery(page) {
        if (!page) page = self.page;
        self.emit('getQueryStart');
        return Service.getQuery(page).then(function (data) {
          self.emit('getQuerySuccess', data.data);
          return data.data.values;
        }, function (err) {
          self.emit('getQueryError', err);
        });
      },
      postImage: function postImage(attribute, model) {
        self.emit('postImageStart');
        return Service.saveImage(attribute, model).then(function (data) {
          self.emit('postImageSuccess');
          return data;
        }, function (err) {
          self.emit('postImageError', err);
        });
      },
      deleteImage: function deleteImage(attribute, model) {
        self.emit('deleteImageStart');
        Service.deleteImage(attribute, model).then(function (data) {
          self.emit('deleteImageSuccess');
        }, function (err) {
          self.emit('deleteImageError', err);
        });
        return self;
      },
      reset: function reset() {
        self.emit('resetStart');
        Service.resetDefaultState();
        return self;
      },
      getAvailableTags: function getAvailableTags() {
        self.emit('getAvailableTagsStart');
        return Service.getAvailableTags();
      },
      getSelectedTags: function getSelectedTags(id) {
        self.emit('getSelectedTagsStart');
        return Service.getSelectedTags(id);
      },
      postTags: function postTags(id, values) {
        self.emit('postTagStart', values);
        Service.postTags(id, values).then(function (data) {
          self.emit('postTagSuccess', values);
        }, function (err) {
          self.emit('postTagError', values);
        });
      },
      getDocumentationURL: function getDocumentationURL() {
        self.emit('getDocumentationURLStart');
        return Service.getDocumentationURL();
      }
    };
  }

  GumgaController.prototype.callbacks = {};

  GumgaController.prototype.and = this;

  GumgaController.prototype.emit = function (ev, data) {
    if (this.callbacks[ev]) {
      this.callbacks[ev].forEach(function (cb) {
        cb(data);
      });
    }
    return this;
  };

  GumgaController.prototype.on = function (ev, cb) {
    if (!this.callbacks[ev]) {
      this.callbacks[ev] = [];
    }
    this.callbacks[ev].push(cb);
    return this;
  };

  GumgaController.prototype.execute = function () {
    var nameOfTheFunction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (nameOfTheFunction.constructor !== String) throw 'O primeiro parâmetro deve ser uma string!';
    if (this.methods[nameOfTheFunction]) {
      var _methods;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      (_methods = this.methods)[nameOfTheFunction].apply(_methods, args);
      return this;
    }
    throw 'O nome do método está errado! Por favor coloque um método que está no GumgaController';
  };

  // -------------------------------------------------------- Componente

  GumgaCtrl.$inject = [];

  function GumgaCtrl() {

    function createRestMethods(container, service, identifierOrConfiguration) {
      var pageModel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'page';

      var idConstructor = identifierOrConfiguration.constructor;
      if (!container) throw 'É necessário passar um objeto no primeiro parâmetro';
      if (!service) throw 'É necessário passar um objeto no segundo parâmetro';
      if (idConstructor !== Object && idConstructor !== String) throw 'É necessário passar um objeto ou uma string no terceiro parâmetro';
      var options = this._createOptions(identifierOrConfiguration);
      if (!!options.noScope) return new GumgaController(service, identifierOrConfiguration, container, pageModel);
      container[options.identifier] = new GumgaController(service, identifierOrConfiguration, container, pageModel);
      return;
    }

    function _createOptions() {
      var identifier = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (identifier.constructor === String) {
        return {
          identifier: identifier,
          noScope: false
        };
      }
      var object = angular.extend({}, identifier);
      object.noScope = !!object.noScope;
      if (!object.identifier) {
        throw 'Você precisa passar um identificador para o objeto de configuração do createRestMethods!';
      }
      return object;
    }

    return {
      createRestMethods: createRestMethods,
      _createOptions: _createOptions
    };
  }

  angular.module('gumga.controller', []).factory('gumgaController', GumgaCtrl);
})();

/***/ })
/******/ ]);