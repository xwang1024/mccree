'use strict';

const Loading        = require('components/common/loading')
const LocalStorage   = require('components/common/localstorage');
const NavSearch      = require('components/common/navSearch/main');
const TaskService    = require('components/service/task');
const PreferService  = require('components/service/prefer');
const UserService    = require('components/service/user');

module.exports = (function main() {
  var navSearch = new NavSearch();
  
  // 猜您喜欢数据
  var guessLikeLoading = new Loading('.guess-switch-like', "");
  guessLikeLoading.start();
  PreferService.getPreferResources(15, (resources) => {
    guessLikeLoading.stop();
    var newElemArr = [];
    resources.forEach((item) => {
      newElemArr.push(`
        <div class="guesslike-course">
          <a class="guesslike-course" href="/resource/${item.id}">${item.name}</a>
          <div class="guesslike-course-line"></div>
        </div>
      `);
    });
    $('.guess-switch-like').html(newElemArr.slice(0, 7).join(''));
    $('.guess-switch-like .guesslike-switch-container-large').append(newElemArr.slice(7, 8).join(''));
  });

  // 猜您喜欢按钮
  $('.guesslike-button').click(() => {
    $('.guess-line-left').toggle();
    $('.guess-line-right').toggle();
    $('.guess-switch-like').toggle();
    $('.guess-switch-course').toggle();
  });

  // 悬赏刷新
  $('[name=moneyRefreshBtn]').click(function() {
    var moneyTaskId = $("[name=moneyTaskId]").val();
    if(!moneyTaskId) return;
    TaskService.getMyRefreshedTask(moneyTaskId, (taskInfo) => {
      $('#moneyTask-courses-container').empty();
      var html = '';
      taskInfo.courses.forEach((item) => {
        html += `<label class="moneyTask-schoolgrade-rec"><span class="moneyTask-schoolgrade-font">${item.name}</a></label>`;
      });
      $('#moneyTask-courses-container').append(html);
    });
  });

  // 绑定手机检查
  (function checkUnbindPhone() {
    var flag = LocalStorage.get('checkUnbindPhone');
    var uid = $("[name=uid]").val();
    if(!uid || flag) return;

    LocalStorage.set('checkUnbindPhone', 1);
    UserService.getBinds((binds) => {
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
    });

  })();
})();