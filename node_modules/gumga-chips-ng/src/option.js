const TEMPLATE = `
  <li ng-transclude
      class="option-container"
      tabindex="1"
      data-ng-class="{'option-disabled' : $ctrl.ngDisabled || $ctrl.gumgaChipsCtrl.exceededMaxItems(), 'option-enabled' : !$ctrl.ngDisabled}"
      data-ng-if="!$ctrl.gumgaChipsCtrl.itemIsSelect($ctrl.ngValue)"
      data-ng-hide="$ctrl.gumgaChipsCtrl.filterOptions($ctrl.ngValue)"
      data-ng-disabled="$ctrl.ngDisabled"
      data-ng-click="$ctrl.addItem($event)">
  </li>
`;

const Option = {
  transclude: true,
  template: TEMPLATE,
  require: {
    gumgaChipsCtrl: '^gumgaChips'
  },
  bindings: {
    ngValue   : '=',
    ngDisabled: '=?'
  },
  controller: ['$scope','$attrs','$timeout','$element', function($scope,$attrs,$timeout,$element){
    let ctrl = this;

    ctrl.addItem = ($event) => {
      if(ctrl.ngDisabled){
        $event.stopPropagation();
        return;
      };
      ctrl.gumgaChipsCtrl.addItem(ctrl.ngValue, $event);
      ctrl.gumgaChipsCtrl.addFocusInput(true);
    }

  }]
}

Option.$inject = [];

export default Option;
