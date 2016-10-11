'use strict';

class ComponentInvoker {
  constructor() {
    $('[data-js-comp]').each(function() {
      var componentName = $(this).data('jsComp');
      console.log(`[invoke] ${componentName}`);
      require(componentName);
    });
  }
}
new ComponentInvoker();
