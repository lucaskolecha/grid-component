angular.module('app', ['gumga.chips'])
  .controller('Ctrl', function ($http) {
    var ctrl = this;

    ctrl.options = [
      { nome: 'Mateus', idade: 20 },
      { nome: 'Willian', idade: 25 },
      { nome: 'Felipe', idade: 25 },
      { nome: 'Munif', idade: 50 }
    ];

    ctrl.getOptions = function (viewValue) {
      return $http.get('https://jsonplaceholder.typicode.com/users?q=' + viewValue)
        .then(function (resp) {
          ctrl.optionsEx2 = resp.data;
        })
    }

    ctrl.addItem = function (value) {
      return { nome: value };
    }

  })