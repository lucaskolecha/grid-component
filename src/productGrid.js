import './productGrid.css';

let Component = {
    template: require('./productGrid.html'),
    bindings: {
        ngModel: '=',
        colors: '=',
        sizes: "=",
        layout: "=?"
    },
    controller: function () {
        let ctrl = this;

        ctrl.$onInit = function () {

            const selected = ctrl.ngModel;

            ctrl.cost = ctrl.cost || null;
            ctrl.sale = ctrl.sale || null;
            ctrl.margin = ctrl.margin || null;

            ctrl.addList = size => {
                ctrl.generate = size.map(sz => {
                    ctrl.blockInput = false;
                    return {
                        id: sz.id,
                        name: sz.name,
                        colors: []
                    }
                });
                ctrl.ngModel = ctrl.generate;
            }

            if (selected) {
                ctrl.addList(selected);
                ctrl.generate = selected;

                ctrl.selecionados = ctrl.generate.map(item => {
                    return {
                        id: item.id,
                        name: item.name
                    }
                });

            }

            ctrl.removeListColor = function (value, index) {
                for (var i = 0; i <= ctrl.generate[index].colors.length - 1; i++) {
                    if (ctrl.generate[index].colors[i].name == value.name)
                        ctrl.generate[index].colors.splice(i, 1);
                }
            };

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
                if (ctrl.layout.bars) {
                    let margin = ctrl.calculateMargin();
                    ctrl.generate[index].colors.forEach((color) => {
                        if (color.name == value.name) {
                            color.bars = [{
                                id: null,
                                value: '0000000000',
                                cost: ctrl.cost,
                                sale: ctrl.sale,
                                margin: margin
                            }]
                        }
                    });
                }

            };

            ctrl.removeList = function (value) {
                console.log(ctrl.generate.length);
                for (var i = 0; i <= ctrl.generate.length - 1; i++) {
                    if (ctrl.generate[i].id == value.id)
                        ctrl.generate.splice(i, 1);
                }
                if (ctrl.generate.length == 0) {
                    ctrl.blockInput = true;
                }
            };

            ctrl.copyColors = (index) => {
                if (ctrl.layout.bars) {
                    let margin = ctrl.calculateMargin();
                    ctrl.generate[index].colors = ctrl.generate[index - 1].colors.map(t => {
                        return {
                            id: t.id,
                            name: t.name,
                            bars: [{
                                id: null,
                                value: '',
                                cost: ctrl.cost,
                                sale: ctrl.sale,
                                margin: margin
                            }]
                        }
                    });
                }else{
                    ctrl.generate[index].colors = ctrl.generate[index - 1].colors.map(t => {
                        return {
                            id: t.id,
                            name: t.name,
                            qtdColor: t.qtdColor
                        }
                    });
                }
            }

            ctrl.checkPrevious = (index) => {
                if (index > 0) {
                    return (!ctrl.generate[index - 1].colors.length > 0);
                } else {
                    return true;
                }


            }

            ctrl.ngModel = ctrl.generate;

        }


    }
}

export default Component;