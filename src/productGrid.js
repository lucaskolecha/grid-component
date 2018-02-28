import './productGrid.css';

let Component = {
    template: require('./productGrid.html'),
    bindings: {
        ngModel: '=',
        colors: '=',
        sizes: "="
    },
    controller: function () {

        let ctrl = this;

        ctrl.selecionados = ctrl.ngModel;

        ctrl.cost = ctrl.cost || null;
        ctrl.sale = ctrl.sale || null;
        ctrl.margin = ctrl.margin || null;

        ctrl.addList = size => ctrl.generate = size.map(sz => {

            ctrl.blockInput = false;
            return {
                id: sz.id,
                name: sz.name,
                colors: []
            }
        });

        if (ctrl.selecionados) {
            ctrl.addList(ctrl.selecionados);

            ctrl.generate = ctrl.selecionados;

            console.log(ctrl.generate);
        }

        ctrl.calculateMargin = () => {
            return ((((ctrl.sale * 100) / ctrl.cost) - 100) / 100) * 100;
        };

        ctrl.addBarCode = (indexSize, indexColor) => {

            let margin = ctrl.calculateMargin();

            ctrl.generate[indexSize].colors[indexColor].bars.push({
                id: null,
                value: '0000000000 - new',
                cost: ctrl.cost,
                sale: ctrl.sale,
                margin: margin
            });
        };

        ctrl.removeBarCode = (indexSize, indexColor, bar) => {
            var index = ctrl.generate[indexSize].colors[indexColor].bars.indexOf(bar);
            ctrl.generate[indexSize].colors[indexColor].bars.splice(index, 1);
        }

        ctrl.generateBars = (value, index) => {
            let margin = ctrl.calculateMargin();
            ctrl.generate[index].colors.forEach((color) => {
                if(color.name == value.name) {
                    color.bars = [{
                        id: null,
                        value: '0000000000 - ' + value.name,
                        cost: ctrl.cost,
                        sale: ctrl.sale,
                        margin: margin
                    }]
                }
            });
        };

        ctrl.removeListColor = function (value, index) {
            for (var i = 0; i <= ctrl.generate[index].colors.length - 1; i++) {
                if (ctrl.generate[index].colors[i].name == value.name)
                    ctrl.generate[index].colors.splice(i, 1);
            }
        };

        ctrl.removeList = function (value) {
            for (var i = 0; i <= ctrl.generate.length - 1; i++) {
                if (ctrl.generate[i].id == value.id)
                    ctrl.generate.splice(i, 1);
            }
            if (ctrl.generate.length == 0) {
                ctrl.blockInput = true;
            }
        };

        ctrl.copyColors = (index) => {
            let arrayColor = angular.copy(ctrl.generate[index-1].colors);

            ctrl.generate[index].colors = arrayColor;
        }

       ctrl.ngModel =  ctrl.generate;
    }
}

export default Component;