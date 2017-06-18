/// <reference path="Editor.ts" />

(function($) {
    $.fn.brickyeditor = function(options) {
        let editor = new BrickyEditor.Editor($(this), options);
        return editor;
    };
}(jQuery));

(function( $ ) {
 
    $.fn.showLinkLocation = function() {
 
        this.filter( "a" ).append(function() {
            return " (" + this.href + ")";
        });
 
        return this;
 
    };
 
}( jQuery ));