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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QueryObject = exports.QueryObject = function () {

    /** 
     * @param _service Objeto GumgaRest para podermos fazer chamadas a API.
     * @param _controller Objeto gumgaController para podermos salvar estados de buscas e atualizar dados do $scope.
    */
    function QueryObject(_service, _controller) {
        _classCallCheck(this, QueryObject);

        this.service = _service;
        this.controller = _controller;
        //LOAD DEFAULTS VALUES
        this.queryObject = {
            start: this.service.start,
            pageSize: this.service.pageSize
        };
    }

    /** 
     * @method page Responsável por especificar a página que você deseja.
     * @param _page página na qual será buscado os registros. DEFAULT: 1;
    */


    _createClass(QueryObject, [{
        key: "page",
        value: function page(_page) {
            if (!_page) _page = 1;
            this._page = _page;
            this.queryObject.start = (_page - 1) * this.queryObject.pageSize;
            this.controller.handlingStorage(this._page, this.queryObject.pageSize);
            this.controller.setPageInContainer(this._page);
            this.controller.page = _page;
            return this;
        }

        /** 
         * @method pageSize Responsável por especificar a quantidade de registros.
         * @param _pageSize quantidade de registros que será mostrado por página. DEFAULT 10;
        */

    }, {
        key: "pageSize",
        value: function pageSize(_pageSize) {
            if (!_pageSize) _pageSize = 10;
            this.queryObject.pageSize = _pageSize;
            //When you modify the size you have to recalculate the start
            if (this._page) this.page(this._page);
            this.controller.handlingStorage(this._page, this.queryObject.pageSize);
            return this;
        }

        /** 
         * @method aq   Adiciona um comando HQL na chamada, para que seja adicionado na cláusula WHERE.
         * @param _advancedValue HQL que será enviado para possibilitar filtrar dados com mais de uma condição.
        */

    }, {
        key: "aq",
        value: function aq(_advancedValue) {
            if (!_advancedValue) console.error("Ao chamar o método um aq é obrigatório informar seu hql.");
            this.queryObject.aq = _advancedValue;
            return this;
        }

        /** 
         * @method q      Adiciona uma busca simples a chamada, pesquise um valor em um ou vários atributos.
         * @param _fields Nomes dos atributos que será feita a busca separador por virgula. ex: nome,apelido.
         * @param _value  Valor que será filtrado com base as campos especificados no atributo _fields.
        */

    }, {
        key: "q",
        value: function q(_fields, _value) {
            var _this = this;

            if (!_fields) console.error("Ao chamar o método um q é obrigatório informar os atributos que serão utilizados na busca.");
            this.queryObject.searchFields = this.queryObject.searchFields || [];
            _fields.trim().split(',').forEach(function (_field) {
                return _this.queryObject.searchFields.push(_field.trim());
            });
            this.queryObject.q = _value;
            return this;
        }

        /** 
         * @method sort  Adiciona criterios de ordenação
         * @param _field Nome do atributo que será feito a ordenação
         * @param _dir   Direção da ordenação no campo especificado no atributo _field.
        */

    }, {
        key: "sort",
        value: function sort(_field, _dir) {
            if (!_field) {
                _field = this.controller.storage.get('field');
                _dir = this.controller.storage.get('way');
            }
            if (!_dir) {
                _dir = 'asc';
            }
            if (_field == null || _dir == null || _field == 'null' || _dir == 'null') {
                return this;
            }
            this.queryObject.sortField = (this.queryObject.sortField || '').concat(',').concat(_field);
            if (this.queryObject.sortField.substring(0, 1) == ',') this.queryObject.sortField = this.queryObject.sortField.substring(1, this.queryObject.sortField.length);
            this.queryObject.sortDir = (this.queryObject.sortDir || '').concat(',').concat(_dir);
            if (this.queryObject.sortDir.substring(0, 1) == ',') this.queryObject.sortDir = this.queryObject.sortDir.substring(1, this.queryObject.sortDir.length);

            return this;
        }

        /** 
         * @method gQuery Adiciona o metodo de pesquisa GQuery a sua chamada.
         * @param _gQuery Atributo responsável por filtrar os dados, a documentação do seu uso está em https://gumga.github.io/gumga-gquery-ng
        */

    }, {
        key: "gQuery",
        value: function gQuery(_gQuery) {
            this.queryObject.gQuery = _gQuery;
            return this;
        }

        /**
         * @method send Metodo responsavel por realizar a chamada para a API.
         */

    }, {
        key: "send",
        value: function send() {
            var _this2 = this;

            if (!this.service.sendQueryObject) {
                console.error("Precisamos que você atualize a versão do componente gumga-rest-ng, acesse: https://github.com/GUMGA/gumga-rest-ng/releases");
            }
            this.queryObject.searchCount = this.controller.page <= 1;
            return this.service.sendQueryObject(this.queryObject).then(function (resp) {
                _this2.controller.data = resp.data.values;
                _this2.controller.pageSize = resp.data.pageSize;
                if (resp.data.count > 0 && _this2.controller.page <= 1) {
                    _this2.controller.count = resp.data.count;
                }
                return resp;
            });
        }
    }]);

    return QueryObject;
}();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _queryObject = __webpack_require__(0);

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
        var _page = parseInt(self.storage.get('page') || self.page);
        self.container[pageModel] = _page;
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
        if (!self.count) {
          self.count = Number(self.storage.get('count'));
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
          case 'searchWithGQuery':
            try {
              self.methods.searchWithGQuery(JSON.parse(self.storage.get('gQuery')), self.storage.get('page'), self.storage.get('pageSize'));
            } catch (e) {
              self.methods.searchWithGQuery(undefined, self.storage.get('page'), self.storage.get('pageSize'));
            }
            break;
          case 'asyncSearchWithGQuery':
            try {
              self.methods.asyncSearchWithGQuery(JSON.parse(self.storage.get('gQuery')), self.storage.get('page'), self.storage.get('pageSize'));
            } catch (e) {
              self.methods.asyncSearchWithGQuery(undefined, self.storage.get('page'), self.storage.get('pageSize'));
            }
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
        if (self.count > 0) self.storage.set('count', self.count);
        self.emit('getStart');
        Service.get(page, pageSize).then(function (data) {
          self.emit('getSuccess', data.data);
          self.data = data.data.values;
          self.pageSize = data.data.pageSize;
          if (data.data.count > 0) self.storage.set('count', data.data.count);
          if (data.data.count > 0 && page <= 1) self.count = data.data.count;
          if (!data.data.count) data.data.count = Number(self.storage.get('count'));
          self.storage.set('pageSize', data.data.pageSize);
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
        if (self.count > 0) self.storage.set('count', self.count);
        self.emit('sortStart');
        Service.sort(field, way, pageSize, page).then(function (data) {
          self.emit('sortSuccess', data.data);
          self.data = data.data.values;
          self.pageSize = data.data.pageSize;
          if (data.data.count > 0) self.storage.set('count', data.data.count);
          if (data.data.count > 0 && page <= 1) self.count = data.data.count;
          if (!data.data.count) data.data.count = Number(self.storage.get('count'));
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
        if (self.count > 0) self.storage.set('count', self.count);
        self.emit('searchStart');
        Service.getSearch(field, param, pageSize, page).then(function (data) {
          self.emit('searchSuccess', data.data);
          self.data = data.data.values;
          self.pageSize = data.data.pageSize;
          if (data.data.count > 0) self.storage.set('count', data.data.count);
          if (data.data.count > 0 && page <= 1) self.count = data.data.count;
          if (!data.data.count) data.data.count = Number(self.storage.get('count'));
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
        if (self.count > 0) self.storage.set('count', self.count);
        self.emit('advancedSearchStart');
        Service.getAdvancedSearch(param, pageSize, page).then(function (data) {
          self.emit('advancedSearchSuccess', data.data);
          self.data = data.data.values;
          self.pageSize = data.data.pageSize;
          if (data.data.count > 0) self.storage.set('count', data.data.count);
          if (data.data.count > 0 && page <= 1) self.count = data.data.count;
          if (!data.data.count) data.data.count = Number(self.storage.get('count'));
          self.storage.set('pageSize', data.data.pageSize);
        }, function (err) {
          self.emit('advancedSearchError', err);
        });
        return self;
      },
      searchWithGQuery: function searchWithGQuery(gQuery, page, pageSize) {
        if (!pageSize) pageSize = self.pageSize;
        if (!page) page = self.page;
        self.storage.set('pageSize', pageSize);
        self.storage.set('page', page);
        if (self.count > 0) self.storage.set('count', self.count);
        if (gQuery) self.storage.set('gQuery', JSON.stringify(gQuery));
        self.storage.set('last-operation', 'searchWithGQuery');
        self.lastGQuery = gQuery;
        self.emit('searchWithGQueryStart');
        return Service.searchWithGQuery(gQuery, page, pageSize).then(function (data) {
          self.emit('searchWithGQuerySuccess', data.data);
          self.data = data.data.values;
          self.pageSize = data.data.pageSize;
          if (data.data.count > 0) self.storage.set('count', data.data.count);
          if (data.data.count > 0 && page <= 1) self.count = data.data.count;
          if (!data.data.count) data.data.count = Number(self.storage.get('count'));
        }, function (err) {
          self.emit('searchWithGQueryError', err);
        });
      },
      asyncSearchWithGQuery: function asyncSearchWithGQuery(gQuery, page, pageSize) {
        if (!pageSize) pageSize = self.pageSize;
        if (!page) page = self.page;
        self.lastGQuery = gQuery;
        if (self.count > 0) self.storage.set('count', self.count);
        self.storage.set('pageSize', pageSize);
        self.storage.set('page', page);
        if (gQuery) self.storage.set('gQuery', JSON.stringify(gQuery));
        self.storage.set('last-operation', 'asyncSearchWithGQuery');
        self.emit('asyncSearchWithGQuery');
        return Service.searchWithGQuery(gQuery, page, pageSize).then(function (data) {
          self.emit('asyncSearchWithGQuery', data.data);
          self.pageSize = data.data.pageSize;
          if (data.data.count > 0) self.storage.set('count', data.data.count);
          if (data.data.count > 0 && page <= 1) self.count = data.data.count;
          if (!data.data.count) data.data.count = Number(self.storage.get('count'));
          return data.data.values;
        }, function (err) {
          self.emit('asyncSearchWithGQuery', err);
        });
      },
      redoSearch: function redoSearch() {
        self.emit('redoSearchStart');
        Service.redoSearch().then(function (data) {
          self.emit('redoSearchSuccess', data.data);
          self.data = data.data.values;
          self.pageSize = data.data.pageSize;
          if (data.data.count > 0 && page <= 1) self.count = data.data.count;
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
      },
      createQuery: function createQuery() {
        return new _queryObject.QueryObject(Service, self);
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