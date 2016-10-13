'use strict';
/**
* mebox-select-tabs
* @author Vboar
*/
class SelectTabs {
  constructor(option) {
    var container = option.container;
    var width = option.width;
    var optionsText = option.options;
    var defaultType = option.default || 0;
    var initCallback = option.initCallback;
    var optionCallback = option.optionCallback;
    var showText = $('<span class="show-text"></span>');
    var optionsUL = $('<ul class="options"></ul>');
    container.append(showText).append(optionsUL);
    container.attr("isopen", 0);
    optionsUL.hide();

    if (width !== undefined) {
      container.width(width);
      optionsUL.width(width);
    }

    container.attr("type", defaultType);
    showText.text(optionsText[defaultType]);

    for (var i = 0; i < optionsText.length; i++) {
      var item = $('<li class="option" type="' + i + '">' + optionsText[i] + '</li>');
      optionsUL.append(item);

      if (i == defaultType) {
        item.hide();
      }
    }

    container.on("click", function() {
      if (container.attr("isopen") == 0) {
        container.attr("isopen", 1);
        container.css("border-bottom-left-radius", 0);
        optionsUL.show();
      } else {
        container.attr("isopen", 0);
        container.css("border-bottom-left-radius", 3);
        optionsUL.hide();
      }
    });
    container.on("mouseleave", function() {
      if (container.attr("isopen") == 1) {
        container.attr("isopen", 0);
        container.css("border-bottom-left-radius", 3);
        optionsUL.fadeOut();
      }
    });
    optionsUL.on("click", ".option", function(event) {
      container.attr("isopen", 0);
      showText.text($(this).text());
      var showOption = optionsUL.children('.option').eq(Number(container.attr("type")));
      var lastSecondOption = optionsUL.children('.option').eq(optionsText.length - 2);
      showOption.show();
      console.log(12);
      console.log($(this).attr('type'));
      if ($(this).attr("type") == optionsText.length - 1) {
        lastSecondOption.css("border-bottom-left-radius", 3);
        lastSecondOption.css("border-bottom-right-radius", 3);
      }
      if (container.attr("type") == optionsText.length - 1) {
        lastSecondOption.css("border-bottom-left-radius", 0);
        lastSecondOption.css("border-bottom-right-radius", 0);
      }
      $(this).hide();
      container.attr("type", $(this).attr("type"));
      container.css("border-bottom-left-radius", 3);
      optionsUL.hide();
      event.stopPropagation();
      if (optionCallback !== undefined) {
        optionCallback();
      }
    });

    if (initCallback !== undefined) {
      initCallback();
    }
  }

  getValue() {
    var type = $(".js-index-searchType").eq(0).attr('type') || 0;
    return type;
  }
}

module.exports = SelectTabs;