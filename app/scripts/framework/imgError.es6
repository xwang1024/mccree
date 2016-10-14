'use strict';
module.exports = (function() {
  var map = {
    user: '/img/user_default.png',
    resourceType: '/img/typeIcon/OTHERS.svg'
  }
  $('img[data-replace-type]').on('error', function() {
    var type = $(this).data('replaceType');
    var src = map[type] ||　map['resourceType'];
    $(this).attr('src', src);
  });
})();
