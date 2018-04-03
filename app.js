angular.module('myApp', ['gumga.layout', 'gumga.chips', 'mobiageGrid', 'gumga.list', 'ui.bootstrap', 'gumga.manytoone'])
    .controller('MainCtrl', function ($scope) {

        $scope.config = {
            facilitator: false,
            bars: false,
            floatRightButton: true,
            qtdColor: true
        };

        $scope.listColors = [
            { id: 1, name: "Amarelo" },
            { id: 2, name: "Preto" },
            { id: 3, name: "Verde" },
            { id: 4, name: "Azul" },
            { id: 5, name: "Cinza" }
        ];

        $scope.listSizes = [
            { id: 1, name: "P" },
            { id: 2, name: "M" },
            { id: 3, name: "G" },
            { id: 4, name: "GG" },
            { id: 5, name: "GGX" }
        ];

        $scope.produtos = [
            { reference: '000001', nome: 'Produto 1', id: 1 },
            { reference: '000002', nome: 'Produto 2', id: 2 },
            { reference: '000003', nome: 'Produto 3', id: 3 },
            { reference: '000004', nome: 'Produto 4', id: 4 }
        ];

        $scope.produto = $scope.produtos[1];

        $scope.deselectCallback = function (value) {
            // console.log(value);
        };

        // Este método precisa ser assíncrono
        $scope.getSearch = function (param) {
            return $q(function (resolve) {
                var arr = $scope.produtos.filter(function (produto) {
                    return produto.nome.indexOf(param) != -1;
                });
                resolve(arr);
            })
        };


        $scope.tableConfig = {
            columns: 'referencia, descricao, tamanho, cor, qtd, buttons', //columnas disponiveis
            //itemsPerPage: [5, 10], // itens por página
            checkbox: false, // Mostrar checkbox
            disabledRow: function (row) {
                return row.id == 3 // desabilita linhas
            },
            conditionalClass: function (row) {
                return {
                    "inativo": row.id == 3 //APLICA CLASSES NA LINHA.
                }
            },
            materialTheme: true, //usar tema de material design
            // activeLineColor: 'red', // cor da linha selecionada
            // hoverLineColor: 'red', // cor da linha ao passar o mouse.
            ordination: true, // possibilitar ordenar colunas
            resizable: true, // possibilitar aumentar ou diminuir tamanho das colunas.
            fixed: { // fixar colunas
                head: true, // fixar cabeçalho
                left: 2 // fixar as primeiras duas colunas da esquerda.
                // right: 1 - fixar a primeira coluna da direita,
                // foot: true - fixar rodapé,
                // top: 2 - fixar as primeiras 2 colunas e linhas do topo.
            },
            columnsConfig: [
                {
                    name: 'referencia',
                    title: 'Referência',
                    content: '{{$value.ref}}'
                },
                {
                    name: 'descricao',
                    title: 'Descrição',
                    content: '{{$value.description}}'
                },
                {
                    name: 'tamanho',
                    title: 'Tamanho',
                    content: '{{$value.size}}'
                },
                {
                    name: 'cor',
                    title: 'Cor',
                    content: '{{$value.color.name}}'
                },
                {
                    name: 'qtd',
                    editable: true,
                    title: 'Qtd',
                    content: '{{$value.color.qtdColor}}'
                },
                {
                    name: 'buttons',
                    title: ' ',
                    content: '<i class="fa fa-times" aria-hidden="true" ng-click="$parent.$parent.removeItem($index)" style="cursor:pointer;color: #ff0000;font-size: 18px;"></i>'
                }
            ]
        };

        $scope.listItens = [];

        $scope.removeItem = (index) => {
            $scope.records.splice(index, 1);
        }

        $scope.addAuxList = (item) => {
            $scope.count = $scope.listItens.length === 0 ? $scope.listItens.length : $scope.count + 1;
            $scope.listItens[$scope.count] = item;
        };


        $scope.submitList = (item, values) => {
            const contains = (array, item) => array.filter(data => angular.equals(data, item)).length > 0;

            const addItem = item => {
                if (!contains($scope.records, item)) {
                    $scope.records.push(item);
                }
            };

            values.map(size => {
                return size.colors.map(color => {
                    return {
                        color: color,
                        ref: item.reference,
                        description: item.nome,
                        size: size.name
                    }
                });
            }).forEach(size => size.forEach(addItem));

        };

        $scope.teste = () => {
            console.log($scope.values);
        }


    })
    .config(['$gmdThemeProvider', function ($gmdThemeProvider) {

    }]);