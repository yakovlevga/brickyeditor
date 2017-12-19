BrickyEditor.Fields.TestField = (function (baseField) {
    __extends(TestField, baseField);
    function TestField() {
        return baseField !== null && baseField.apply(this, arguments) || this;
    }

    TestField.prototype.bind = function () {
        var _this = this;
        var $field = this.$field;
        if (!$field.is('[contenteditable]')) {
            $field.attr(Selectors.attrContentEditable, 'true');
        }
        var html = this.data.html || this.$field.html() || this.block.template.name;
        this.setHtml(html);
        $field.html(this.data.html);
        $field.on('blur keyup paste input', function () {
            _this.setHtml($field.html());
        });
        BrickyEditor.SelectionUtils.bindTextSelection($field, function (rect) {
            _this.block.editor.ui.htmlTools.show(rect);
        });
        $field.on('paste', function (e) {
            e.preventDefault();
            var ev = e.originalEvent;
            var text = ev.clipboardData.getData('text/plain');
            document.execCommand("insertHTML", false, text);
        });
    };

    TestField.prototype.setHtml = function (html) {
        this.data.html = html.trim();
        if (this.$field.html() !== html) {
            this.$field.html(html);
        }
    };

    return TestField;
})(BrickyEditor.Fields.BaseField);

BrickyEditor.Fields.TestField.registerField();