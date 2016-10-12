'use strict';

class Loading {
  constructor(container, content, append) {
    this.container = container;
    this.$ctn = $(container);
    this.append = append;
    this.html = `
                  <div class="loading">
                    <img class="loading-gif" src="/img/loading.gif">
                    <span class="loading-text">${content || "正在努力加载中~"}</span>
                  </div>
                `;
  }

  start() {
    var vm = this;
    if(vm.$ctn.length === 0 ) return console.log(`[loading] can't find container: ${vm.container}`);
    if(vm.$ctn.children('.loading').length !== 0) return console.log(`[loading] duplicate loading in container: ${vm.container}`);
    (!vm.append) && (vm.$ctn.empty());
    vm.$ctn.append(vm.html);
  }

  stop() {
    vm.$ctn.children('.loading').remove();
  }
}

module.exports = Loading;