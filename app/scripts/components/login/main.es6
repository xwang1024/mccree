'use strict';

const meboxToaster   = require('components/common/meboxToaster');
const meboxInfo      = require('components/common/meboxInfo');
const LocalStorage   = require('components/common/localstorage');
const Query         = require('components/common/query');
const UserService    = require('components/service/user');

module.exports = (function main() {
  var nonce = "";
  var realm = "";
  var opaque = "";
  // 登录提交
  $('#login-form').on('submit', function (e) {
    e.preventDefault();
    var rname = /[\u4E00-\u9FA5]/;
    if (rname.test($("#phone_number").val())) {
      meboxToaster({
        message: [{
          type: 2,
          content: meboxInfo.auth.phoneCanNotBeChinese,
        }],
      });
      $("#phone_number").val("");
      $("#password").val("");
      return false;
    }
    
    // 记住手机号
    if ($("input[name=remember]")[0].checked) {
      LocalStorage.set('isStorePhone', 'yes');
      LocalStorage.set('phone_number', $("#phone_number").val());
    } else {
      LocalStorage.set('isStorePhone', 'no');
      LocalStorage.del('phone_number');
    }
    var h1 = hex_md5($("#phone_number").val() + ":" + realm + ":" + hex_md5($("#password").val()));
    var h2 = hex_md5("POST:/index.php/Home/User/login");
    var response = hex_md5(h1 + ":" + nonce + ":" + h2);
    var Authorization = 'Digest username="' + $("#phone_number").val() + '", realm="' + realm + '", nonce="' + nonce + '", uri="/index.php/Home/User/login", response="' + response + '", opaque="' + opaque + '"';
    if ($("#phone_number").val() != "" && $("#password").val() != "") {
      UserService.login(Authorization, function(data) {
          if (data["result"] == 0) {
            meboxToaster({
              message: [{
                type: 2,
                content: meboxInfo.auth.phoneOrPasswdError,
              }],
            });
          } else {
            meboxToaster({
              message: [{
                type: 1,
                content: meboxInfo.auth.loginSuccess,
              }],
            });
            LocalStorage.set('uid', data["id"]);
            LocalStorage.set('name', data["name"]);
            LocalStorage.set('nickname', data["nickname"]);
            LocalStorage.set('icon', data["icon"]);

            setTimeout(function() {
              var query = new Query();
              var returnUrl = query.get('returnUrl');
              if(returnUrl) {
                window.location.href = returnUrl;
              } else if (new Date().getTime() - LocalStorage.get('time') < 100000) {
                window.location.href = LocalStorage.get('history');
              } else {
                window.location.href = "/";
              }
            }, 1000);
          }
        }, function(XMLHttpRequest, textStatus, errorThrown) {
          if (XMLHttpRequest.status == "401") {
            meboxToaster({
              message: [{
                type: 2,
                content: meboxInfo.auth.phoneOrPasswdError,
              }],
            });
          } else {
            serverErrorToaster();
          }
        }
      );
    } else {
      meboxToaster({
        message: [{
          type: 2,
          content: meboxInfo.auth.phoneOrPasswdCanNotBeEmpty,
        }],
      });
    }
    return false;
  });

  // qq登录按钮
  $('#qq-login-btn').click(function() {
    if (url === undefined || url == "") window.location.href = "/qqLogin";
    else window.location.href = "/qqLogin?bind=" + url;
  });

  // 初始化登录
  UserService.preLogin(function(nonce, realm, opaque) {
    nonce = nonce;
    realm = realm;
    opaque = opaque;
  }, function() {
    serverErrorToaster();
  });
  
  // 填充记住的内容
  var getIsStorePhone = LocalStorage.get("isStorePhone");
  if ("yes" == getIsStorePhone) {
    var userName = LocalStorage.get("phone_number");
    if (userName != null && userName != "") {
      $("#phone_number").val(userName);
      $("input[name=remember]").prop("checked", true);
    }
  }

  // 通用错误弹窗
  function serverErrorToaster() {
    meboxToaster({
      message: [{
        type: 2,
        content: meboxInfo.server.commonError,
      }],
      append: true,
    });
  }
})();