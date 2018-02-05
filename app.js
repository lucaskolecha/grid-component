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

        $scope.listBars = [
            {id: 1, name: "00000000001"},
            {id: 2, name: "000000000001"},
            {id: 3, name: "00000000000001"},
            {id: 4, name: "000000000000001"},
            {id: 5, name: "0000000000000001"}
        ];


    })
    .config(['$gmdThemeProvider', function ($gmdThemeProvider) {

    }]);