'use strict';

const meboxToaster = require('components/common/meboxToaster');
const meboxInfo    = require('components/common/meboxToaster');

module.exports = (function() {
  $(document).ajaxError(function() {
    meboxToaster({
      message: [{
        type: 2,
        content: meboxInfo.server.commonError,
      }],
      append: true,
    });
  });
})();