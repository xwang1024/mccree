'use strict';

var meboxInfo = {
  auth: {
    loginSuccess: "登录成功~",
    resetPasswordSuccess: "重置密码成功~",
    loginFirst: "请先登录",
    phoneCanNotBeChinese: "手机号不能为中文",
    phoneLengthError: "手机号位数不正确",
    phoneFormatError: "手机号格式不正确",
    phoneOrPasswdCanNotBeEmpty: "手机号或密码不能为空",
    phoneOrPasswdError: "手机号或密码错误",
    sendCodeFail: "发送验证码失败，请重试",
    phoneHasBeenUsed: "手机号已经被使用",
    nicknameError: "昵称不合法或已被占用",
    passwdLengthMax: "密码最长为32位",
    passwdLengthMin: "密码最短为6位",
    registerFail: "注册失败",
    nicknameOrPasswdCanNotBeEmpty: "昵称或密码不能为空",
    codeCanNotBeEmpty: "验证码不能为空",
    codeError: "验证码错误",
    selectBirthday: "请选择出生日期",
    modifyInfoFail: "修改失败，请重试",
  },
  setting: {
    modifyInfoSuccess: "修改成功~",
    bindSuccess: "绑定成功~",
    mobileHasBinded: "手机号已绑定,请重试",
    verifyFailed: "验证码错误,请重试",
    nicknameCanNotBeEmpty: "昵称不能为空",
    selectBirthday: "请选择出生日期",
    modifyInfoFail: "修改失败，请重试",
    nicknameError: "昵称不合法或已被占用",
  },
  server: {
    commonError: "服务器出了点问题，请刷新重试",
  },
  upload: {
    editSuccess: "修改成功，马上跳转...",
    uploadSuccess: "上传成功，马上跳转...",
    addSuccess: "添加成功，马上跳转...",
    applySuccess: "该资料的学校、院系、课程和标签信息已应用到其他资料",
    selectCollection: "请选择一个资料集",
    selectFile: "请选择一个或多个要上传的文件",
    fileNameCanNotBeEmpty: "文件名不能为空",
    selectSchool: "请选择该资料所属学校",
    selectDepartment: "请选择该资料所属院系",
    selectCourse: "请选择或输入该资料所属课程",
    pointError: "请输入正确的米粒数",
    fileSizeTooLarge: "单个文件的大小不应超过1GB",
    submitLoading: "正在发布...请不要关闭页面",
    fileUploadLoading: "文件正在上传中...请耐心等待",
    addLoading: "正在添加...请不要关闭页面",
    unsupportType: "：暂不支持的打印类型",
  },
  rCollection: {
    createSuccess: "创建资料集成功~",
    nameCanNotBeEmpty: "资料集名字不可为空",
  },
  aCollection: {
    createSuccess: "创建文章集成功~",
    createFail: "创建文章集失败",
    nameCanNotBeEmpty: "文章集名字不可为空",
  },
  feedback: {
    canNotBeEmpty: "反馈不能为空",
  },
  comment: {
    replySuccess: "回复成功~",
    replyFail: "回复失败",
    replyBeEmpty: "回复不能为空"
  },
  mark: {
    markSuccess: "评分成功~",
    markFail: "评分失败"
  },
  collect: {
    addSuccess: "收藏成功~",
    addFail: "收藏失败",
    deleteSuccess: "已取消收藏",
    deleteFail: "取消收藏失败"
  },
  editor: {
    imageFormat: "请上传jpg/png格式的图片",
    imageSize: "图片大小不能超过2MB",
    imageBeEmpty: "上传图片不能为空",
    titleBeEmpty: "文章标题不能为空",
    authorBeEmpty: "作者不能为空",
    originBeEmpty: "来源不能为空",
    recommendBeEmpty: "推荐语不能为空",
    contentBeEmpty: "内容不能为空",
    noRight: "未登录或权限不足"
  },
  report: {
    success: "举报成功~",
    selectType: "请选择举报类型",
    inputDesc: "请输入举报的具体描述",
    inputContact: "请输入您的联系方式",
    contentTooShort: "举报的具体描述少于15字",

  },
  print: {
    addResourceBeEmpty: "请选择要添加的文章或资料",
    addSuccess: "成功添加至待打印列表~",
    removeResourceBeEmpty: "请选择要移除的打印项",
    removeSuccess: "成功移除所选待打印项~",
  },
  coupon: {
    codeCanNotBeEmpty: "兑换码不能为空",
    redeemSuccess: "兑换成功~",
    codeNotExist: "兑换码不存在",
  },
  commonOperation: {
    deleteSuccess: "删除成功~",
    deleteFail: "删除失败",
    modifySuccess: "修改成功~",
    modifyFail: "修改失败",
    operationFail: "操作失败",
    removeSuccess: "移动成功~",
    removeFail: "移动失败",
    copySuccess: "复制成功~",
    copyFail: "复制失败",
  },
  pay: {
    genOrderFail: "生成订单失败,请重试!",
    addOrderBeEmpty: "请选择要结算的订单",
    orderFail: "订单失效",
    cannotEidt: "无法更改，请重试！",
    haveOrder: "您还有尚未支付的订单，不能再次充值",
    paySuccess: "支付成功!",
    cancelOrder: "订单已删除",
    cancelOrderFail: "订单取消失败,请重试!"
  },
  payback: {
    success: "退款成功!"
  },
  sign: {
    signSuccess: "签到成功！",
    signFail: "签到失败"
  },
  follow: {
    followFail: "关注失败",
    cancelFollowFail: "取消关注失败",
  }
};

module.exports = meboxInfo;