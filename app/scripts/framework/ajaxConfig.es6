'use strict';

const meboxToaster = require('components/common/meboxToaster');
const meboxInfo    = require('components/common/meboxInfo');

module.exports = (function() {
  $(document).ajaxError(function(event, status, request) {
    if(request.url === "/Home/User/login") return;
    meboxToaster({
      message: [{
        type: 2,
        content: meboxInfo.server.commonError,
      }],
      append: true,
    });
  });
})();