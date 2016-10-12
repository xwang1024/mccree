'use strict';

module.exports = (function() {
  $('[data-js-comp]').each(function() {
    var componentName = $(this).data('jsComp');
    console.log(`[invoke] ${componentName}`);
    require(componentName);
  });
})();