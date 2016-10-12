/**
新的Toaster
options:
    message: 对象数组
        time: 每条toast的显示时间 默认2s
        type: 1成功绿色 2失败红色 3警告深黄 默认1
        content: 内容 必须
    append: true 追加 or false 重新 默认false
*/
var toasterSetTimeoutId;
var toasterMessages = [];
module.exports = function meboxToaster(options) {
  var message = options.message;
  var append = options.append || false;

  if (append === false) {
    $("#toaster-container").empty();
    if (toasterSetTimeoutId !== undefined) clearTimeout(toasterSetTimeoutId);
    toasterMessages = message;
  } else {
    toasterMessages = toasterMessages.concat(message);
  }
  var toaster;
  var newToast = function(i) {
    var time = toasterMessages[i].time || 2000;
    var type = toasterMessages[i].type || 1;
    if (type === 1) {
      toaster = $('<div class="toaster"><p class="toaster-content success">' + '<i class="icon fa fa-check-circle-o"></i>' + toasterMessages[i].content + '</p></div>');
    } else if (type === 2) {
      toaster = $('<div class="toaster"><p class="toaster-content error">' + '<i class="icon fa fa-close"></i>' + toasterMessages[i].content + '</p></div>');
    } else {
      toaster = $('<div class="toaster"><p class="toaster-content warning">' + '<i class="icon fa fa-exclamation"></i>' + toasterMessages[i].content + '</p></div>');
    }
    $("#toaster-container").append(toaster);
    toaster.slideDown();
    toaster.width(toaster.children().eq(0).width() + 4); 
    (function(_i) {
      toasterSetTimeoutId = setTimeout(function() {
        if (toasterMessages.length === 1) {
          toaster.slideUp(function() {
            toaster.remove();
          });
        } else {
          toaster.hide();
          toaster.remove();
        }
        if (i < toasterMessages.length - 1) {
          newToast(_i + 1);
        } else {
          toasterMessages = [];
        }
      },
      time);
    })(i);
  };
  if ($("#toaster-container").html() == "") {
    newToast(0);
  }
}