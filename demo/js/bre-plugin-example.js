var brePluginExample = (function (exports) {
  'use strict';

  var init = function (editor) {
      editor.on("blockAdd", function (ev) { });
  };

  exports.init = init;

  return exports;

}({}));
