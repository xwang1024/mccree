'use strict';

module.exports = (function() {
  var urlPrefix = "/Home";
  var jin_taskId;
  var start = true;
  var school = {};
  var department = {};
  var course = {};

  var myDate = new Date();
  var year = myDate.getFullYear();
  for (var i = 0,
  jinyear = []; i < 10; i++) {
    jinyear.push({
      "id": year - i,
      "text": year - i + "年"
    });
  }

  function select21() {
    console.log(123)
    $('.jin-school-select').select2({
      language: "zh-CN",
    });
    $('.jin-department-select').select2({
      language: "zh-CN",
    });
    $('.js-class-select').select2({
      data: jinyear
    });
    getAllSchools1();
  }
  /**
   * Created by Administrator on 2016/8/16.
   */
  function getAllSchools1() {
    $.ajax({
      type: 'get',
      url: urlPrefix + "/School/getAllSchools",
      dataType: 'json',
      success: function(data) {
        var result = new Array();
        var schools = data['result'];
        for (i in schools) {
          result.push({
            id: schools[i]['id'],
            text: schools[i]['name']
          });
        }
        $('.jin-school-select').select2("destroy");
        $('.jin-school-select').select2({
          language: "zh-CN",
          data: result,
        });

        if (start) {
          var options = $('.jin-school-select option');
          for (var i = 0; i < options.length; i++) {
            if (options.eq(i).val() == school.id) {
              options.eq(i).prop("selected", true);
              break;
            }
          }
          $('.jin-school-select').trigger('change');
          $('.jin-school-select').on('change',
          function() {
            var sid = $('.jin-school-select').select2('data')[0].id;
            getDepartmentsBySchool1(sid);
          });
        }
        if ($('.jin-school-select').select2('data')[0] != null) {
          var sid = $('.jin-school-select').select2('data')[0].id;
          getDepartmentsBySchool1(sid);
        } else {
          start = false;
          $(".jin-department-select").select2("destroy");
          $(".jin-department-select").html("");
          $('.jin-department-select').select2({
            data: [],
            language: "zh-CN",
          });
        }
        var sidd = $('.jin-school-select').select2('data')[0].id;
        getDepartmentsBySchool1(sidd);
      },
      error: function() {
        serverErrorToaster();
      },
    });
  }

  function getDepartmentsBySchool1(sid) {
    $.ajax({
      type: "get",
      url: urlPrefix + "/Department/getDepartmentsBySchoolId?schoolId=" + sid,
      dataType: "json",
      async: true,
      success: function(data) {
        var result = new Array();
        var departments = data['result'];
        for (i in departments) {
          result.push({
            id: departments[i]['id'],
            text: departments[i]['name']
          });
        }
        $(".jin-department-select").select2("destroy");
        $(".jin-department-select").html("");
        $('.jin-department-select').select2({
          language: "zh-CN",
          data: result,
        });
      },
      error: function() {
        serverErrorToaster();
      },
    });
  }
  $(".jin-close").click(function() {
    $(".jin-mask-yourInfo").css("display", "none")
  });
  $(".jin-btn-cancel").click(function() {
    var schoolId = $('.jin-school-select').select2("data")[0].id;
    var departmentId = $('.jin-department-select').select2("data")[0].id;
    var classname = $('.js-class-select').select2("data")[0].id;
    var education = $(" .radio-box input[type='radio']:checked").val();
    /**/
    $.ajax({
      method: "post",
      url: urlPrefix + "/User/supplyStudentInfo",
      data: {
        schoolId: schoolId,
        departmentId: departmentId,
        degree: education,
        grade: classname
      },
      success: function(data) {
        if (data['result'] == 1) {
          $(".jin-mask-yourInfo").css("display", "none");
          jinCanDown = true;
        }
      }
    })
  });
  $(".jin-btn-cancel1").click(function() {
    var schoolId = $('.jin-school-select').select2("data")[0].id;
    var departmentId = $('.jin-department-select').select2("data")[0].id;
    var classname = $('.js-class-select').select2("data")[0].id;
    var education = $(" .radio-box input[type='radio']:checked").val();
    /**/
    $.ajax({
      method: "post",
      url: urlPrefix + "/User/supplyStudentInfo",
      data: {
        schoolId: schoolId,
        departmentId: departmentId,
        degree: education,
        grade: classname
      },
      success: function(data) {
        if (data['result'] == 1) {
          //$(".moneyTask-container-font").css("display","block") ;
          //window.location.href=
          window.location.reload();
          jinCanDown = true;
        }
      }
    })
  });

  $(".jin-change").click(function() {
    $.ajax({
      method: "get",
      url: urlPrefix + "/task/refreshMyTask?id=" + jin_taskId,
      success: function(data) {
        var courses = data["result"].courses;
        $(".jin-mask-taskBox .jin-list-unstyle").html("");
        for (var i = 0; i < courses.length; i++) {
          $(".jin-mask-taskBox .jin-list-unstyle").append("<li>" + courses[i].name + "</li>")
        }
      }
    })
  });
    $(".jin-cancel").click(function() {
    $(".jin-mask-taskBox").css("display", "none");
  });
    $(".jin-task-close").click(function() {
    $(".jin-mask-taskBox").css("display", "none");
  });
  $(".jin-accept").click(function() {
    window.location.href = "/resource/uploadText";
  });
  select21();
})();