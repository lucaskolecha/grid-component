angular.module('myApp', ['gumga.layout', 'gumga.chips', 'mobiageGrid'])
    .controller('MainCtrl', function ($scope) {

        $scope.listColors = [
            {id: 1, name: "Amarelo"},
            {id: 2, name: "Preto"},
            {id: 3, name: "Verde"},
            {id: 4, name: "Azul"},
            {id: 5, name: "Cinza"}
        ];

        $scope.listSizes = [
            {id: 1, name: "P"},
            {id: 2, name: "M"},
            {id: 3, name: "G"},
            {id: 4, name: "GG"},
            {id: 5, name: "GGX"}
        ];

        $scope.values = [{"id":1,"name":"P","colors":[{"id":1,"name":"Amarelo","bars":[{"id":null,"value":"0000000000 - Amarelo","cost":null,"sale":null,"margin":null}]},{"id":2,"name":"Preto","bars":[{"id":null,"value":"0000000000 - Preto","cost":null,"sale":null,"margin":null}]},{"id":3,"name":"Verde","bars":[{"id":null,"value":"0000000000 - Verde","cost":null,"sale":null,"margin":null}]}]},{"id":2,"name":"M","colors":[]},{"id":3,"name":"G","colors":[]}];


    })
    .config(['$gmdThemeProvider', function ($gmdThemeProvider) {

    }]);