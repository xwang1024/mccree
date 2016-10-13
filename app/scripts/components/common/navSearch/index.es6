'use strict';

const SelectTabs   = require('components/common/navSearch/selectTabs');
const Query        = require('components/common/query');
const LocalStorage = require('components/common/localstorage');
const htmlEncode   = require('components/common/util').htmlEncode;
const TagService   = require('components/service/tag');

class NavSearch {
  constructor() {
    var vm = this;

    // 搜索框左侧下拉
    this.selectTabs = new SelectTabs({
      container: $(".js-index-searchType").eq(0),
      options: ['全部','课件', '笔记', '习题', '试卷', '其他']
    });
    
    $('#js-nav-search-input').bind('input propertychange click', function() {
      var key = $(this).val();
      $('#js-nav-search-result').hide();
      $('#js-nav-search-hot').show();
      vm.getNavSearchHistory();
      $('#js-nav-search-history').show();
      $('#js-nav-search-dropdown').show();
      $(document).mouseup(function(e) {
        var _con = $("#js-nav-search-dropdown"); // 设置目标区域
        if (!_con.is(e.target) && _con.has(e.target).length === 0) { // Mark 1
          _con.hide();
          $('#js-nav-search-hot').hide();
        }
      });
    });

    $('#js-nav-search-input').bind('keypress', function(event) {
      if (event.keyCode == 13) {
        vm._search();
      }
    });

    $('#js-search-icon').click(function() {
      vm._search();
    });

    // 显示搜索下拉框
    $('#js-nav-search-input').focus(function() {
      $('#js-nav-search-input').attr("placeholder", "使用空格分隔多个搜索关键词");
      vm.getNavSearchHistory();
      $('#js-nav-search-hot').show();
      $('#js-nav-search-dropdown').show();
    });
    $('#js-nav-search-input').blur(function() {
      $('#js-nav-search-input').attr("placeholder", "搜索优质资料、文章、学霸秘籍...");
    });

    $('#js-nav-search-dropdown').mouseleave(function() {
      $('#js-nav-search-hot').hide();
      $(this).hide();
    });

    TagService.getSearchHottestKeys((tags) => {
      var hotHtml = '<p class="nav-search-subtitle">热门搜索：</p>';
      tags.forEach((tag) => {
        hotHtml += `<a class="hot-search" href="/search?key=${tag.name}">${tag.name}</a>`;
      })
      $('#js-nav-search-hot').html(hotHtml);
    });
  }
  /**
   * 内部方法，搜索结果
   * @author xwang1024@126.com
   */
  _search() {
    var vm = this;
    var key = $('#js-nav-search-input').val();
    var type = vm.selectTabs.getValue();
    if (!key) return;
    // 保存搜索记录
    vm.addSearchHistory(key);
    vm.showSearchHistory();
    // 跳转
    var query = new Query(true);
    var search = query.set('type', type).set('key', key).toString();
    // window.location.href = `/search${search}`;
  }
  getNavSearchHistory() {
    var searchHistory = LocalStorage.get('searchHistory');
    var html = '<p class="nav-search-subtitle">搜索历史：</p>';
    if(searchHistory) {
      console.log(searchHistory)
      Object.keys(searchHistory).sort((a, b) => {
        if(searchHistory[a].getTime || searchHistory[b].getTime) return 0;
        return searchHistory[b].getTime() - searchHistory[b].getTime(); // 搜索时间倒序
      }).slice(0, 4).forEach((key) => {
        html += `<a class="search-dropdown-line" href="/search?key=${encodeURIComponent(key)}&type=${$(".js-index-searchType").eq(0).attr('type')}">
                   <img class="nav-search-icon" src="/img/time.svg" />
                   ${htmlEncode(key)}
                 </a>`;
      });
    }
    $('#js-nav-search-history').html(html);
  }
  addSearchHistory(key) {
    var vm = this;
    if(!key) return;
    var searchHistory = LocalStorage.get('searchHistory') || {};
    searchHistory[key] = new Date();
    console.log(searchHistory);
    LocalStorage.set('searchHistory', searchHistory);
  }
  showSearchHistory() {
    var vm = this;
    var searchHistory = LocalStorage.get('searchHistory');
    var html = "";
    if(searchHistory) {
      Object.keys(searchHistory).sort((a, b) => {
        if(searchHistory[a].getTime || searchHistory[b].getTime) return 0;
        return searchHistory[b].getTime() - searchHistory[b].getTime(); // 搜索时间倒序
      }).slice(0, 16).forEach((key) => {
        html += `<a class="search-dropdown-line" href="/search?key=${encodeURIComponent(key)}&type=${$(".js-index-searchType").eq(0).attr('type')}">
                   ${htmlEncode(key)}
                 </a>`;
      });
    }
    $('#js-search-history').html(html);
  }
}

module.exports = NavSearch;