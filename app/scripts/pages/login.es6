'use strict';
class LoginView {
  constructor() {
    let vm = this;
    $('#login-form').submit((e) => {
      e.preventDefault();
      vm.encrypt();
    });
    vm.init();
  }

  init() {
    let vm = this;
    $.ajax({
      type: "post",
      url: "/Home/User/login",
      async: true,
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status == "401") {
          var auth = XMLHttpRequest.getResponseHeader("WWW-Authorization");
          vm.nonce = auth.getQuery("nonce");
          vm.realm = auth.getQuery("realm");
          vm.opaque = auth.getQuery("opaque");
        } else {
          serverErrorToaster();
        }
      }
    });
    /**
     * 将记住的密码填充
     * @type {Storage}
     */
    var storage = window.localStorage;
    var getIsStorePhone = storage["isStorePhone"];
    if ("yes" == getIsStorePhone) {
      var userName = storage["phone_number"];
      if (userName != null && userName != "") {
        $("#phone_number").val(userName);
        $("input[name=remember]").prop("checked", true);
      }
    }
  }

  encrypt() {
    let vm = this;
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
    /**
     * 判断是否记住手机号
     * @type {Storage}
     */
    var storage = window.localStorage;
    if ($("input[name=remember]")[0].checked) {
      storage["isStorePhone"] = "yes";
      storage["phone_number"] = $("#phone_number").val();
    } else {
      storage["isStorePhone"] = "no";
      storage.removeItem("phone_number");
    }
    
    var h1 = md5($("#phone_number").val() + ":" + vm.realm + ":" + md5($("#password").val()));
    var h2 = md5("POST:/index.php/Home/User/login");
    var response = md5(h1 + ":" + vm.nonce + ":" + h2);
    var Authorization = 'Digest username="' + $("#phone_number").val() + '", realm="' +
      vm.realm +
      '", nonce="' +
      vm.nonce +
      '", uri="/index.php/Home/User/login", response="' +
      response +
      '", opaque="' +
      vm.opaque +
      '"';
    if ($("#phone_number").val() != "" && $("#password").val() != "") {
      $.ajax({
        type: "post",
        url: "/Home/User/login",
        async: false,
        headers: {
          Authorization: Authorization
        },
        success: function(data) {
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
            storage["uid"] = data["id"];
            storage["name"] = data["name"];
            storage["nickname"] = data["nickname"];
            storage["icon"] = data["icon"];
            setTimeout(function() {
              if (new Date().getTime() - storage['time'] < 100000) {
                window.location.href = storage['history'];
              } else {
                window.location.href = "/";
              }
            }, 1000);
          }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
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
      });
    } else {
      meboxToaster({
        message: [{
          type: 2,
          content: meboxInfo.auth.phoneOrPasswdCanNotBeEmpty,
        }],
      });
    }
    return false;
  }
}

registerClass('LoginView', LoginView);
