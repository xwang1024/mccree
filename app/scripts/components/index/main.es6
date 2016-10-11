'use strict';

const SelectTabs = require('components/common/selectTabs');

module.exports = (function main() {
  var selectTabs = new SelectTabs({
    container: $(".js-index-searchType").eq(0),
    options: ['全部','课件', '笔记', '习题', '试卷', '其他']
  });
  
  $('.guesslike-button').click(() => {
    $('.guess-line-left').toggle();
    $('.guess-line-right').toggle();
    $('.guess-switch-like').toggle();
    $('.guess-switch-course').toggle();
  });
})();