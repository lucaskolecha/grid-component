import './productGrid.css';

let Component = {
    template: require('./productGrid.html'),
    controller: function () {

        let ctrl = this;

        ctrl.list = [];

        ctrl.addList = size => ctrl.list = size.map(sz => {
            ctrl.teste = false;

            return {
                id: sz.id,
                label: sz.name,
                colors : []
            }
        });

        ctrl.selectColor = (value) => {
            console.log(value);
        }

        ctrl.generateBars = (value, index) => {

            let margem = ((((ctrl.venda * 100) / ctrl.custo) - 100) / 100) * 100;

            ctrl.list[index].colors.push({
                id:value.id,
                name:value.name,
                bars:[{
                    value:'1231231231',
                    custo: ctrl.custo,
                    margem: margem,
                    venda: ctrl.venda

                }]
            });

        }


        ctrl.removeList = function (value) {
            for (var i = 0; i <= ctrl.list.length - 1; i++) {
                if (ctrl.list[i].id == value.id)
                    ctrl.list.splice(i, 1);
            }
            if (ctrl.list.length == 0) {
                ctrl.teste = true;
            }
        }

        ctrl.mytest = function () {
            console.log(ctrl.list);
        }


    },
    bindings: {
        colors: '=',
        sizes: "=",
        bars: "="
    }
}

export default Component;