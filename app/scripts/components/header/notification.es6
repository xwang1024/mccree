'use strict';

const Loading         = require('components/common/loading')
const LocalStorage    = require('components/common/localstorage');
const NavSearch       = require('components/common/navSearch/main');
const AnnounceService = require('components/service/announce');
const CommentService  = require('components/service/comment');

module.exports = (function main() {
  var anum = 0;
  var cnum = 0;
  var pnum = 0;
  var isReceiveA = false;
  var isReceiveC = false;
  var isReceiveP = false;

  AnnounceService.getUnReadAnnounceNum((num) => {
    isReceiveA = true;
    if(num) {
      anum = Number(num);
    }
    bellMessage(anum, "ANNOUNCE");
    checkTotal();
  });

  CommentService.getUnreadCommentNum((num) => {
    isReceiveC = true;
    if(num) {
      cnum = Number(num);
    }
    bellMessage(cnum, "COMMENT");
    checkTotal();
  });

  CommentService.getUnReadPraiseNum((num) => {
    isReceiveP = true;
    if(num) {
      pnum = Number(num);
    }
    bellMessage(pnum, "PRIASE");
    checkTotal();
  });

  function checkTotal() {
    if (isReceiveA && isReceiveC && isReceiveP) {
      bellMessage(anum + cnum + pnum, "TOTAL");
      isReceiveA = false;
      isReceiveC = false;
      isReceiveP = false;
      anum = 0;
      cnum = 0;
      pnum = 0;
    }
  }

  function bellMessage(num, type) {
    switch (type) {
    case "ANNOUNCE":
      changeMessageIcon(num, "#js-message-announce", "fa fa-bell-o fa-fw message-sicon", "message-sicon-new icon-announce");
      break;
    case "COMMENT":
      changeMessageIcon(num, "#js-message-comment", "fa fa-comment-o fa-fw message-sicon", "message-sicon-new icon-comment");
      break;
    case "PRIASE":
      changeMessageIcon(num, "#js-message-praise", "fa fa-thumbs-o-up fa-fw message-sicon", "message-sicon-new icon-praise");
      break;
    case "TOTAL":
      changeMessageIcon(num, "#js-message-icon", "fa fa-bell message-icon", "message-icon-new");
      break;
    default:
    }
  }

  function changeMessageIcon(num, selector, className, classNameNew) {
    if (num > 0) {
      $(selector).attr('class', classNameNew);
    } else {
      $(selector).attr('class', className);
    }
  }
})();





