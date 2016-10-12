'use strict';

module.exports = (function initGuide() {
  var urlPrefix = "/Home";

  function isInArea(e, t, b, l, r) {
    return e.clientX > l && e.clientX < r && e.clientY > t && e.clientY < b
  }
  function getMyGuideInfo() {
    $.ajax({
      type: "get",
      url: urlPrefix + "/User/getMyInfo",
      async: !0,
      success: function(e) {
        0 != e.result ? (storage.departmentName = e.result.department, storage.school = e.result.schoolId, storage.schoolName = e.result.school, storage.department = e.result.departmentId, selectSchool({
          params: {
            data: {
              id: storage.school,
              text: storage.schoolName
            }
          }
        })) : (guideNodata = !0, storage.school = 1, storage.schoolName = "南京大学", getAllGuideSchools());
      },
      error: function() {}
    })
  }
  function getAllGuideSchools() {
    $.ajax({
      type: "get",
      url: urlPrefix + "/School/getAllSchools",
      dataType: "json",
      async: !0,
      success: function(e) {
        var t = new Array,
        r = e.result;
        for (var s in r) t.push({
          id: r[s].id,
          text: r[s].name
        });
        bindSchoolData(t)
      },
      error: function() {}
    })
  }
  function bindSchoolData(e) {
    $(".js-guide-school-list").select2({
      language: "zh-CN",
      placeholder: "请输入学校名称",
      data: e
    }),
    $(".js-guide-school-list").on("select2:select",
    function(e) {
      firstDe = !1,
      selectSchool(e)
    }),
    $(".js-guide-school-list").on("select2:unselect",
    function(e) {
      firstDe = !1,
      selectSchool(e)
    }),
    void 0 !== storage.school ? selectSchool({
      params: {
        data: {
          id: storage.school,
          text: storage.schoolName
        }
      }
    }) : getMyGuideInfo(),
    $(".js-guide-course-list").select2({
      language: "zh-CN",
      placeholder: "请输入课程名称"
    }),
    isSelect2 = !0
  }
  function selectSchool(e) {
    guideNodata = !1;
    for (var t = $(".guide-school .select2-selection__rendered").find("li"), r = 0; r < t.length - 1; r++) t[r].remove();
    $(".guide-school .select2-search__field").val(e.params.data.text),
    storage.school = e.params.data.id,
    storage.schoolName = e.params.data.text,
    choseSchoolName = e.params.data.text,
    getGuideDepartmentsBySchool(e.params.data.id)
  }
  function getGuideDepartmentsBySchool(e) {
    $.ajax({
      type: "get",
      url: urlPrefix + "/Department/getDepartmentsBySchoolId?schoolId=" + e,
      dataType: "json",
      async: !0,
      success: function(e) {
        var t = new Array,
        r = e.result;
        for (var s in r) t.push({
          id: r[s].id,
          text: r[s].name
        });
        sortList(t),
        $("#department-list").scrollTo(0),
        choseDepartmentIndex = -1,
        updateDepartmentList(t)
      },
      error: function() {}
    })
  }
  function updateDepartmentList(e) {
    for (var t = $(".letters-list li a"), r = 0; r < t.length; r++) !
    function(e) {
      t.eq(e).attr("class", "select"),
      t.eq(e).on("click",
      function() {
        changLetterColor(t, e),
        $("#department-list").scrollTo($(t.eq(e).attr("target")), {
          duration: "slow",
          offsetTop: "0"
        })
      })
    } (r);
    var s = 0;
    $("#department-list").empty();
    var o = document.getElementById("department-list");
    for (r = 0; r < e.length; r++) {
      var a = makePy(e[r].text)[0].charAt(0),
      n = getIndexByLetter(a); !
      function(r, s, a) {
        var n = document.createElement("li"),
        i = document.createElement("span");
        i.innerHTML = e[r].text,
        n.appendChild(i);
        var c = makePy(e[r].text)[0].charAt(0),
        l = getIndexByLetter(c),
        u = document.createElement("span");
        u.innerHTML = c,
        u.setAttribute("class", "department-active-letter"),
        n.onmouseleave = function() {
          n.removeChild(u)
        },
        n.onmouseover = function() {
          n.insertBefore(u, i),
          changLetterColor(t, l),
          choseDepartment(r, e[r].id, c, l),
          $(".course-container").show()
        },
        (s < a || 0 == r) && n.setAttribute("id", "" + a),
        n.setAttribute("pid", "" + e[r].id),
        null != o && o.appendChild(n)
      } (r, s, n);
      var i = s;
      for (0 != r && i++; i < n; i++) t.eq(i).attr("class", "noselect");
      s < n && (t.eq(n).attr("target", "#" + n), s = n)
    }
    firstDe && !guideNodata && (dealDepartmentStorge(e, t), firstDe = !1)
  }
  function dealDepartmentStorge(e, t) {
    var r = $("#department-list  [pid=" + storage.department + "]");
    if (void 0 !== storage.department) changLetterColor(t, storage.departmentLetter),
    r.click(),
    $("#departmenfft-list").scrollTo(r, {
      duration: "slow",
      offsetTop: "0"
    });
    else {
      var s = storage.department;
      for (var o in e) if (s == e[o].id) {
        var a = makePy(e[o].text)[0].charAt(0),
        n = getIndexByLetter(a);
        storage.departmentLetter = n
      }
      changLetterColor(t, storage.departmentLetter),
      r.click(),
      $("#department-list").scrollTo(r, {
        duration: "slow",
        offsetTop: "0"
      })
    }
  }
  function changLetterColor(e, t) {
    for (var r = 0; r < e.length; r++) {
      var s = e.eq(r);
      "noselect" != s.attr("class") && s.attr("class", "select")
    }
    "noselect" != e.eq(t).attr("class") && e.eq(t).attr("class", "selected")
  }
  function choseDepartment(e, t, r, s) {
    var o = $(".department-list li");
    choseDepartmentIndex != -1 && (o.eq(choseDepartmentIndex).removeClass(),
    function(e) {
      o[e].onmouseleave = function() {
        o.eq(e).find('[class="department-active-letter"]').remove()
      }
    } (choseDepartmentIndex), o.eq(choseDepartmentIndex).find('[class="department-active-letter"]').remove()),
    o.eq(e).attr("class", "selected"),
    o.eq(e).prepend('<span class="department-active-letter">' + r + "</span>"),
    o[e].onmouseleave = function() {},
    choseDepartmentIndex = e,
    storage.department = t,
    storage.departmentLetter = s,
    getGuideCoursesByDepartment(t, name)
  }
  function getGuideCoursesByDepartment(e, t) {
    $.ajax({
      type: "get",
      url: urlPrefix + "/Course/getCoursesByDepartmentIdWithGrade?departmentId=" + e,
      dataType: "json",
      async: !0,
      success: function(r) {
        var s = new Array,
        o = new Array,
        a = new Array,
        n = new Array,
        i = new Array,
        c = r[1];
        for (var l in c) o.push({
          id: c[l].id,
          text: c[l].name
        }),
        s.push({
          id: c[l].id,
          text: c[l].name
        });
        var c = r[2];
        for (var l in c) a.push({
          id: c[l].id,
          text: c[l].name
        }),
        s.push({
          id: c[l].id,
          text: c[l].name
        });
        var c = r[3];
        for (var l in c) n.push({
          id: c[l].id,
          text: c[l].name
        }),
        s.push({
          id: c[l].id,
          text: c[l].name
        });
        var c = r[4];
        for (var l in c) i.push({
          id: c[l].id,
          text: c[l].name
        }),
        s.push({
          id: c[l].id,
          text: c[l].name
        });
        sortList(o),
        sortList(a),
        sortList(n),
        sortList(i),
        $("#course").empty();
        var u = "",
        d = 10,
        p = 0;
        p = o.length < d ? o.length: d,
        u += '<div class="course-page-grade-font">大一</div> <div class="course-page-grade-smallline"></div><div class="course-page-grade-longline"></div>';
        for (var l = 0; l < p; l++) u += '<li class="course-letters"><span class="jin-jump" inde="' + o[l].id + '">' + o[l].text + "</span></li>";
        p = a.length < d ? a.length: d,
        u += '<div class="course-page-grade-font">大二</div> <div class="course-page-grade-smallline"></div><div class="course-page-grade-longline"></div>';
        for (var l = 0; l < p; l++) u += '<li class="course-letters"><span class="course-letters jin-jump" inde="' + a[l].id + '">' + a[l].text + "</span></li>";
        p = n.length < d ? n.length: d,
        u += '<div class="course-page-grade-font">大三</div><div class="course-page-grade-smallline"></div><div class="course-page-grade-longline"></div>';
        for (var l = 0; l < p; l++) u += '<li class="course-letters"><span class="course-letters jin-jump" inde="' + n[l].id + '">' + n[l].text + "</span></li>";
        p = i.length < d ? i.length: d,
        u += '<div class="course-page-grade-font">大四</div> <div class="course-page-grade-smallline"></div><div class="course-page-grade-longline"></div>';
        for (var l = 0; l < p; l++) u += '<li class="course-letters"><span class="course-letters jin-jump" inde="' + i[l].id + '">' + i[l].text + "</span></li>";
        $("#course").append(u),
        $("#course").show(),
        updateCourseList(s, e)
      },
      error: function() {}
    })
  }
  function getHotCourseByDepartment(e, t) {
    $.ajax({
      type: "get",
      url: urlPrefix + "/Course/getHotCourses?departmentId=" + t,
      dataType: "json",
      async: !0,
      success: function(t) {
        if (1 == t.result) {
          var r = new Array,
          s = t.list;
          for (var o in s) r.push({
            id: s[o].id,
            text: s[o].name
          });
          addHotCourse(r),
          bindCourseList(e),
          updateCourseListByLetter()
        }
      },
      error: function() {}
    })
  }
  function addHotCourse(e) {
    $("#js-course-hot").empty();
    var school = $('.guide-school .select2-search__field').val();
    var department = $('.department-container li.selected span:last-child').html();
    for (var t = 0; t < e.length && t < 20; t++) $("#js-course-hot").append('<li><a target="_blank" href="/search?school=' + school + '&department=' + department + '&course=' + e[t].text + "&type=0&condition=0&ttype=2&tagid=" + e[t].id + '">' + e[t].text + "</a></li>");
    var r, s = $("#js-course-hot li"),
    o = 2,
    a = 0;
    for (t = 0; t < s.length; t++) 0 == t && (r = s.eq(t).offset().top, a = 1),
    s.eq(t).offset().top > r && a++,
    a > o && s[t].remove()
  }
  function updateCourseList(e, t) {
    bindCourseData(e),
    getHotCourseByDepartment(e, t)
  }
  function bindCourseData(e) {
    isSelect2 && ($(".course-in-container").empty(), $(".course-in-container").append('<select class="js-guide-course-list" multiple="multiple"></select>')),
    isSelect2 = !0,
    $(".js-guide-course-list").select2({
      language: "zh-CN",
      placeholder: "请输入课程名称",
      data: e
    });
    for (var t = $(".course-container .select2-selection__rendered").find("li"), r = 0; r < t.length - 1; r++) t[r].remove();
    $(".course-container .select2-search__field").val(""),
    $(".js-guide-course-list").on("select2:select",
    function(e) {
      selectCourse(e)
    }),
    $(".js-guide-course-list").on("select2:unselect",
    function(e) {
      selectCourse(e)
    })
  }
  function bindCourseList(e) {
    $("#course-nav").empty(),
    $("#course").listnav({
      noMatchText: "没有对应课程",
      showCounts: !1
    }),
    $("._").remove(),
    $(".all").html("全部")
  }
  function updateCourseListByLetter() {
    for (var e = $(".course-list li"), t = new Array, r = 0; r < e.length; r++) e.eq(r).is(":visible") && t.push(e[r]);
    coursePageIndex = new Array,
    coursePageIndex.push(0),
    currentPage = 0,
    showCourseList(t)
  }
  function showCourseList(e) {
    var t = coursePageIndex[currentPage];
    if (! (currentPage < 0 || void 0 === t)) {
      for (var r = 0; r < t; r++) $(e[r]).hide();
      $(".course-page-num").show();
      for (var s = $(".course-page-num").offset().top, o = !1, a = t; a < e.length; a++) $(e[a]).show();
      var n;
      for (a = t; a < e.length; a++) if ($(e[a]).offset().top > s) {
        o || (o = !0, void 0 === coursePageIndex[currentPage + 1] && coursePageIndex.push(a)),
        n = a;
        break
      }
      $(".course-page-num").html(currentPage + 1),
      o ? $("#js-page-icon-r").show() : $("#js-page-icon-r").hide(),
      currentPage > 0 ? $("#js-page-icon-l").show() : $("#js-page-icon-l").hide(),
      o || 0 != currentPage || $(".course-page-num").hide(),
      $("#js-page-icon-l").unbind("click").click(function() {
        currentPage--,
        showCourseList(e)
      }),
      $("#js-page-icon-r").unbind("click").click(function() {
        currentPage++,
        showCourseList(e)
      })
    }
  }
  function selectCourse(e) {
    for (var t = $(".course-container .select2-selection__rendered").find("li"), r = 0; r < t.length - 1; r++) t[r].remove();
    $(".course-container .select2-search__field").val(e.params.data.text),
    choseCourseName = e.params.data.text,
    window.open("/search?key=" + e.params.data.text + "&type=2")
  }
  function sortList(e) {
    e.sort(function(e, t) {
      var r = makePy(e.text)[0],
      s = makePy(t.text)[0];
      return r < s ? -1 : r > s ? 1 : 0
    })
  }
  function getLetterByIndex(e) {
    return e >= 0 && e <= 25 ? letters.charAt(e) : null
  }
  function getIndexByLetter(e) {
    return letters.indexOf(e)
  }
  var storage = window.sessionStorage;
  $(".guide-main").show();
  var choseSchoolName = "",
  choseDepartmentIndex = -1,
  choseCourseName = "";
  $(document).ready(function() {
    getAllGuideSchools()
  }),
  $(".course-container").mouseleave(function(e) {
    var temp = parseInt($(".guide").css("top") + ""),
    b = temp + parseFloat($(".course-container").height() - $(document).scrollTop());
    var t = $(".course-container").offset().top;
    if (null != $(".guide").offset()) {
      var l = $(".guide").offset().left,
      r = l + 250 + 505;
      isInArea(e, t, b, l, r) || ($(".course-container").hide(), $(".select2-results__options").hide())
    }
  });
  var guideNodata = !0,
  firstDe = !0,
  coursePageIndex = new Array,
  currentPage = 0,
  isSelect2 = !1;
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  $.fn.scrollTo = function(e, t, r) {
    "function" == typeof t && 2 == arguments.length && (r = t, t = e);
    var s = $.extend({
      scrollTarget: e,
      offsetTop: 50,
      duration: 500,
      easing: "swing"
    },
    t);
    return this.each(function() {
      // var e = $(this),
      // t = "number" == typeof s.scrollTarget ? s.scrollTarget: $(s.scrollTarget),
      // o = "number" == typeof t ? t: t.offset().top - e.offset().top + e.scrollTop() - parseInt(s.offsetTop);
      // e.animate({
      //   scrollTop: o
      // },
      // parseInt(s.duration), s.easing,
      // function() {
      //   "function" == typeof r && r.call(this)
      // })
    })
  },
  $(".course-list").on("click", ".jin-jump",
  function() {
    var e = $(this).attr("inde");
    $.ajax({
      type: "get",
      url: urlPrefix + "/Course/getCourseDetailById?id=" + e,
      dataType: "json",
      success: function(e) {
        var t = e.school,
        r = e.department,
        s = e.course;
        t = encodeURIComponent(t);
        r = encodeURIComponent(r);
        s = encodeURIComponent(s);
        window.location.href = "/search?school=" + t + "&department=" + r + "&course=" + s;
      }
    })
  });
})();