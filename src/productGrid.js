import './productGrid.css';

let Component = {
    template: require('./productGrid.html'),
    controller: function () {

        let ctrl = this;

        ctrl.ngModel = [];
        ctrl.cost = ctrl.cost || null;
        ctrl.sale = ctrl.sale || null;
        ctrl.margin = ctrl.margin || null;

        ctrl.addList = size => ctrl.ngModel = size.map(sz => {
            ctrl.blockInput = false;
            return {
                id: sz.id,
                label: sz.name,
                colors: []
            }
        });

        ctrl.calculateMargin = () => {
            return ((((ctrl.sale * 100) / ctrl.cost) - 100) / 100) * 100;
        };

        ctrl.addBarCode = (indexSize, indexColor) => {

            let margin = ctrl.calculateMargin();

            ctrl.ngModel[indexSize].colors[indexColor].bars.push({
                id: null,
                value: '0000000000 - new',
                cost: ctrl.cost,
                sale: ctrl.sale,
                margin: margin
            });
        };

        ctrl.removeBarCode = (indexSize, indexColor, bar) => {
            var index = ctrl.ngModel[indexSize].colors[indexColor].bars.indexOf(bar);
            ctrl.ngModel[indexSize].colors[indexColor].bars.splice(index, 1);
        }

        ctrl.generateBars = (value, index) => {

            let margin = ctrl.calculateMargin();

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
                if (ctrl.ngModel[index].colors[i].name == value.name)
                    ctrl.ngModel[index].colors.splice(i, 1);
            }
        };

        ctrl.removeList = function (value) {
            for (var i = 0; i <= ctrl.ngModel.length - 1; i++) {
                if (ctrl.ngModel[i].id == value.id)
                    ctrl.ngModel.splice(i, 1);
            }
            if (ctrl.ngModel.length == 0) {
                ctrl.blockInput = true;
            }
        };

        ctrl.copyColors = (index) => {
            let arrayColor = angular.copy(ctrl.ngModel[index-1].colors);

            ctrl.ngModel[index].colors = arrayColor;
        }
    },
    bindings: {
        ngModel: '=',
        colors: '=',
        sizes: "="
    }
}

export default Component;