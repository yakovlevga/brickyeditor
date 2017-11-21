(function ($) {
    $.fn.brickyeditor = function (options) {
        let editor = new BrickyEditor.Editor($(this), options);
        editor.initAsync();
        return editor;
    };
}(jQuery));