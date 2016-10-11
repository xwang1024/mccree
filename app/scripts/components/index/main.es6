'use strict';

const SelectTabs = require('components/common/selectTabs');

module.exports = (function main() {
  var urlPrefix = '/Home'
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

  $('[name=moneyRefreshBtn]').click(function() {
    var moneyTaskId = $("[name=moneyTaskId]").val();
    if(!moneyTaskId) return;
    $.ajax({
      type: "get",
      url: urlPrefix + "/Task/refreshMyTask?id=" + moneyTaskId,
      success: function(data) {
        var courses = data["result"]["courses"];
        $('#moneyTask-courses-container').empty();
        var html = '';
        for (var i = 0; i < courses.length; i++) {
          html += '<label class="moneyTask-schoolgrade-rec"><span class="moneyTask-schoolgrade-font">' + courses[i]["name"] + '</a></label>';
        }
        $('#moneyTask-courses-container').append(html);
      },
      error: function() {
        serverErrorToaster();
      }
    });
  });

  function checkUnbindPhone() {
    var LocalStorage = require("components/common/localstorage");
    var flag = LocalStorage.get('checkUnbindPhone');
    var uid = $("[name=uid]").val();
    if(!uid || flag) return;

    LocalStorage.set('checkUnbindPhone', 1);
    $.ajax({
      type: "get",
      url: urlPrefix + "/User/getbinds",
      success: function(data) {
        var binds = data["result"];
        for (var i = 0; i < binds.length; i++) {
          if (binds[i]["type"] == 0) {
            return;
          }
        }
        var html = `<div class="unbind-phone-div" id="js-unbind-phone-div">
                      <div class="container">
                        <p class="message">
                          您的账号安全系数较低，请尽快
                          <a href="/bind" class="link">绑定手机号</a>
                          ，绑定完成即可获得<span class="point">100米粒</span>
                        </p>
                        <i class="fa fa-close"></i>
                      </div>
                    </div>`;
        $("#toaster-container").after(html);
        $("#js-unbind-phone-div").find(".fa-close").eq(0).bind("click",
        function() {
          $("#js-unbind-phone-div").hide();
        });
      },
      error: function() {
        serverErrorToaster();
      }
    });
  }
})();