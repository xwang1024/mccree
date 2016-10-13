'use strict';

const Loading        = require('components/common/loading')
const LocalStorage   = require('components/common/localstorage');
const NavSearch      = require('components/common/navSearch/main');
const TaskService    = require('components/service/task');
const PreferService  = require('components/service/prefer');
const UserService    = require('components/service/user');

module.exports = (function main() {
  // 导航栏Popup
  var printOpen = false;
  navbarPopup();
  
})();

function navbarPopup() {
  var messageOpen = false;
  var userOpen = false;

  $("#js-print-icon").bind("click",
  function() {
    if (printOpen == false) {
      if (messageOpen == true) {
        messageOpen = false;
        $("#js-message-icon").removeClass("active");
        $("#js-message-popup").hide();
      }
      if (userOpen == true) {
        userOpen = false;
        $("#js-navbar-user-icon").removeClass("active");
        $("#js-user-popup").hide();
      }
      printOpen = true;
      $("#js-print-icon").addClass("active");
      $("#js-print-popup").fadeIn(200);
    }
  });

  $("#js-message-icon").bind("click",
  function() {
    if (messageOpen == false) {
      if (printOpen == true) {
        printOpen = false;
        $("#js-print-icon").removeClass("active");
        $("#js-print-popup").hide();
      }
      if (userOpen == true) {
        userOpen = false;
        $("#js-navbar-user-icon").removeClass("active");
        $("#js-user-popup").hide();
      }
      messageOpen = true;
      $("#js-message-icon").addClass("active");
      $("#js-message-popup").fadeIn(200);
    }
  });

  $("#js-navbar-user-icon,.js-user-name ").bind("click",
  function() {
    if (userOpen == false) {
      if (printOpen == true) {
        printOpen = false;
        $("#js-print-icon").removeClass("active");
        $("#js-print-popup").hide();
      }
      if (messageOpen == true) {
        messageOpen = false;
        $("#js-message-icon").removeClass("active");
        $("#js-message-popup").hide();
      }
      userOpen = true;
      $("#js-navbar-user-icon").addClass("active");
      $("#js-user-popup").fadeIn(200);
    }
  });

  $("#js-print-popup").bind("mouseleave",
  function() {
    printOpen = false;
    $("#js-print-icon").removeClass("active");
    $("#js-print-popup").fadeOut();
  });

  $("#js-message-popup").bind("mouseleave",
  function() {
    messageOpen = false;
    $("#js-message-icon").removeClass("active");
    $("#js-message-popup").fadeOut();
  });

  $("#js-user-popup").bind("mouseleave",
  function() {
    userOpen = false;
    $("#js-navbar-user-icon").removeClass("active");
    $("#js-user-popup").fadeOut();
  });
}