'use strict';
(function(window, document, $){
  if (typeof $ === 'undefined') { throw new Error('This application\'s JavaScript requires jQuery'); }
  $(function(){
    var className = $('[js-comp]').attr('js-comp');
    if(className) return new DyClass(className);
  });
})(window, document, window.jQuery);