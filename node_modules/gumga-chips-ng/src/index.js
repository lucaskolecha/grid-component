//css
require('./chips.css');

//directives
import GumgaChips from  './chips';
import Option from  './option';
import Item from  './item';

if(!angular){
  throw "gumga-chips-ng require's AngularJS in window!!";
}

const module = angular.module('gumga.chips', [])
      .component('gumgaChips', GumgaChips)
      .component('gumgaChipsOption', Option)
      .component('gumgaChipsItem', Item)

export default module.name;
