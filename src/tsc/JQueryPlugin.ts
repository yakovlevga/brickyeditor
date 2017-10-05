/// <reference path="Editor.ts" />

(function($) {
    $.fn.brickyeditor = function(options) {
        let editor = new BrickyEditor.Editor($(this), options);
        return editor;
    };
}(jQuery));