/// <reference path="types/jquery.d.ts" />

(function ($) {
    $.fn.brickyeditor = function (options) {
        let editor = new BrickyEditor.Editor($(this)[0], options);       
        editor.initAsync();
        return editor;
    };
}(jQuery));