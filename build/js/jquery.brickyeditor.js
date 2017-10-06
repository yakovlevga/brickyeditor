var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
String.prototype.breContains = function (part) {
    return this.indexOf(part) >= 0;
};
String.prototype.breStartsWith = function (part) {
    return this.indexOf(part) == 0;
};
String.prototype.breTotalTrim = function () {
    return this ? this.replace(/\s\s+/g, ' ').trim() : '';
};
String.prototype.breEqualsInvariant = function (other) {
    return this.toLowerCase() === other.toLowerCase();
};
if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;
        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}
var BrickyEditor;
(function (BrickyEditor) {
    var Common = (function () {
        function Common() {
        }
        Common.getSelectedText = function () {
            var text = "";
            var doc = document;
            if (window.getSelection) {
                text = window.getSelection().toString();
            }
            else if (doc.selection && doc.selection.type != "Control") {
                text = doc.selection.createRange().text;
            }
            return text;
        };
        Common.propsEach = function (obj, func) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var value = obj[key];
                    func(key, value);
                }
            }
        };
        Common.propsFilterKeys = function (obj, filter, payload) {
            var result = [];
            Common.propsEach(obj, function (key, value) {
                if (filter(key, value)) {
                    result.push(key);
                }
            });
            if (payload) {
                result.push(payload);
            }
            return result;
        };
        return Common;
    }());
    BrickyEditor.Common = Common;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Editor = (function () {
        function Editor($editor, options) {
            var _this = this;
            this.$editor = $editor;
            this.options = options;
            this.blocks = [];
            this.compactTools = null;
            $editor.addClass('bre-editor');
            BrickyEditor.Fields.BaseField.registerCommonFields();
            this.options = new BrickyEditor.EditorOptions(options);
            this.ui = new BrickyEditor.UI(this);
            this.ui.toggleToolsLoader(true);
            BrickyEditor.Services
                .TemplateService
                .loadTemplatesAsync(this)
                .done(function (templates) {
                _this.ui.toggleToolsLoader(false);
                _this.ui.setTemplates(templates);
                if (_this.options.blocks && _this.options.blocks.length) {
                    _this.loadBlocks(_this.options.blocks);
                }
                if (_this.options.onload) {
                    _this.options.onload(_this);
                }
            });
        }
        Object.defineProperty(Editor.prototype, "selectedBlockIndex", {
            get: function () {
                if (this.selectedBlock) {
                    return this.blocks.indexOf(this.selectedBlock);
                }
                return -1;
            },
            enumerable: true,
            configurable: true
        });
        Editor.prototype.getData = function () {
            var blocksData = [];
            this.blocks.forEach(function (block) {
                blocksData.push(block.getData());
            });
            return blocksData;
        };
        Editor.prototype.getHtml = function () {
            var blocksData = [];
            this.blocks.forEach(function (block) {
                blocksData.push(block.getHtml(true));
            });
            return blocksData.join('\n');
        };
        Editor.prototype.loadBlocks = function (blocks) {
            var _this = this;
            if (blocks && blocks.length) {
                blocks.forEach(function (block) {
                    var template = BrickyEditor.Services.TemplateService.getTemplate(block.template);
                    if (template) {
                        _this.addBlock(template, block.fields, null, false);
                    }
                    else {
                        console.log("Template " + block.template + " not found.");
                    }
                });
            }
        };
        Editor.prototype.selectBlock = function (block) {
            if (this.selectedBlock === block)
                return;
            if (this.selectedBlock) {
                this.selectedBlock.deselect();
            }
            this.selectedBlock = block;
        };
        Editor.prototype.deselectBlock = function (block) {
            this.selectedBlock = null;
        };
        Editor.prototype.addBlock = function (template, data, idx, select) {
            if (select === void 0) { select = true; }
            var block = new BrickyEditor.Block(this, template, data);
            block.insert(idx);
            if (select) {
                block.select();
                block.scrollTo();
            }
        };
        Editor.prototype.deleteBlock = function (block) {
            var idx = this.blocks.indexOf(block);
            this.blocks.splice(idx, 1);
            block = null;
            if (idx < this.blocks.length) {
                this.blocks[idx].select();
            }
            else if (this.blocks.length > 0) {
                this.blocks[idx - 1].select();
            }
            else {
                this.selectedBlock = null;
            }
        };
        Editor.prototype.moveBlock = function (block, offset) {
            var idx = this.blocks.indexOf(block);
            var new_idx = idx + offset;
            if (new_idx >= this.blocks.length || new_idx < 0)
                return;
            var $anchorBlock = this.blocks[new_idx].ui.$editor;
            if (offset > 0) {
                $anchorBlock.after(block.ui.$editor);
            }
            else if (offset < 0) {
                $anchorBlock.before(block.ui.$editor);
            }
            this.blocks.splice(idx, 1);
            this.blocks.splice(new_idx, 0, block);
            block.scrollTo();
        };
        Editor.prototype.copyBlock = function (block) {
            var idx = this.blocks.indexOf(block) + 1;
            var copy = this.addBlock(block.template, block.getData().fields, idx, true);
        };
        return Editor;
    }());
    BrickyEditor.Editor = Editor;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var EditorOptions = (function () {
        function EditorOptions(options) {
            this.templatesUrl = "templates/bootstrap4.html";
            this.compactTools = null;
            this.ignoreHtml = null;
            this.templatesUrl = options.templatesUrl || this.templatesUrl;
            this.onload = options.onload;
            this.blocks = options.blocks;
            this.compactTools = options.compactTools;
            this.ignoreHtml = options.ignoreHtml || false;
        }
        return EditorOptions;
    }());
    BrickyEditor.EditorOptions = EditorOptions;
})(BrickyEditor || (BrickyEditor = {}));
(function ($) {
    $.fn.brickyeditor = function (options) {
        var editor = new BrickyEditor.Editor($(this), options);
        return editor;
    };
}(jQuery));
var BrickyEditor;
(function (BrickyEditor) {
    var Template = (function () {
        function Template(el) {
            var previewSelector = '.bre-template-preview';
            var $template = $(el);
            var data = $template.data();
            this.name = data.name;
            this.category = data.cactegory || [];
            this.$html = $template.contents().not(previewSelector);
            this.$preview = $(previewSelector, $template).contents();
            if (!this.$preview.length) {
                var block = new BrickyEditor.Block(null, this);
                var blockEl = block.getHtml(true);
                this.$preview = $(blockEl);
            }
        }
        Template.prototype.getPreview = function () {
            var $template = $("<div class='bre-template'></div>");
            $template.append(this.$preview);
            return $template;
        };
        return Template;
    }());
    BrickyEditor.Template = Template;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Block = (function () {
        function Block(editor, template, data) {
            this.editor = editor;
            this.template = template;
            this.fields = [];
            var $block = template.$html.clone();
            this.ui = new BrickyEditor.BlockUI(this, $block, data);
        }
        Block.prototype.delete = function () {
            this.ui.delete();
            this.editor.deleteBlock(this);
        };
        Block.prototype.move = function (offset) {
            this.editor.moveBlock(this, offset);
        };
        Block.prototype.copy = function () {
            this.editor.copyBlock(this);
        };
        Block.prototype.insert = function (idx) {
            var editor = this.editor;
            idx = idx || editor.blocks.length;
            if (editor.selectedBlock) {
                idx = editor.selectedBlockIndex + 1;
            }
            editor.blocks.splice(idx, 0, this);
            if (idx == 0) {
                editor.$editor.append(this.ui.$editor);
            }
            else {
                editor.blocks[idx - 1].ui.$editor.after(this.ui.$editor);
            }
        };
        Block.prototype.getData = function () {
            var fieldsData = [];
            this.fields.forEach(function (field) {
                fieldsData.push(field.data);
            });
            var data = { template: this.template.name, fields: fieldsData };
            if (!this.editor.options.ignoreHtml) {
                data['html'] = this.getHtml(true);
            }
            return data;
        };
        Block.prototype.getHtml = function (trim, skipAttrRemoving) {
            if (skipAttrRemoving === void 0) { skipAttrRemoving = false; }
            var $html = this.ui.$block.clone(false, false)
                .wrap('<div></div>')
                .parent();
            ['contenteditable', 'data-bre-field'].forEach(function (attr) {
                $("[" + attr + "]", $html).each(function (idx, el) {
                    el.removeAttribute(attr);
                });
            });
            return trim ? $html.html().breTotalTrim() : $html.html();
        };
        Block.prototype.select = function () {
            this.ui.$editor.addClass("bre-selected");
            this.editor.selectBlock(this);
        };
        Block.prototype.deselect = function () {
            this.ui.$editor.removeClass("bre-selected");
            BrickyEditor.UI.toggleBtnDeck(this.ui.$tools, true);
            this.editor.deselectBlock(this);
        };
        Block.prototype.scrollTo = function () {
            var top = this.ui.$editor.offset().top - 100;
            top = top > 0 ? top : 0;
            $('html, body').animate({
                scrollTop: top
            }, 'fast');
        };
        return Block;
    }());
    BrickyEditor.Block = Block;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var BlockAction = (function () {
        function BlockAction(icon, action, title) {
            this.icon = icon;
            this.action = action;
            this.title = title;
        }
        return BlockAction;
    }());
    BrickyEditor.BlockAction = BlockAction;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var BlockUI = (function () {
        function BlockUI(block, $block, data) {
            this.block = block;
            this.$block = $block;
            if (this.block.editor) {
                this.buildEditorUI();
            }
            this.bindFields(data);
        }
        BlockUI.prototype.delete = function () {
            this.$editor.remove();
        };
        BlockUI.prototype.buildEditorUI = function () {
            var _this = this;
            this.$tools = $('<div class="bre-block-tools bre-btn-deck"></div>');
            BlockUI.actions.forEach(function (action) {
                var $btn = _this.buildButton(action);
                _this.$tools.append($btn);
            });
            BrickyEditor.UI.initBtnDeck(this.$tools);
            this.$editor = $('<div class="bre-block-wrapper"></div>');
            this.$editor.append(this.$tools);
            this.$editor.append(this.$block);
            this.$editor.hover(function () { _this.$editor.addClass('bre-active'); }, function () { _this.$editor.removeClass('bre-active'); });
            this.$block.on('click', function () { return _this.block.select(); });
        };
        BlockUI.prototype.buildButton = function (action) {
            var _this = this;
            var $el = $("<button class=\"bre-btn\"><i class=\"fa fa-" + action.icon + "\"></i></button>");
            if (action.action) {
                $el.on('click', function () { return action.action(_this.block); });
            }
            return $el;
        };
        BlockUI.prototype.bindFields = function (data) {
            var _this = this;
            this.$block
                .find(BrickyEditor.Selectors.selectorField)
                .addBack(BrickyEditor.Selectors.selectorField)
                .each(function (idx, elem) {
                var $field = $(elem);
                var field = BrickyEditor.Fields.BaseField.createField(_this.block, $field, data);
                _this.block.fields.push(field);
            });
        };
        BlockUI.actions = [
            { 'icon': 'ellipsis-h' },
            { 'icon': 'trash-o', 'action': function (block) { return block.delete(); } },
            { 'icon': 'copy', 'action': function (block) { return block.copy(); } },
            { 'icon': 'angle-up', 'action': function (block) { return block.move(-1); } },
            { 'icon': 'angle-down', 'action': function (block) { return block.move(+1); } }
        ];
        return BlockUI;
    }());
    BrickyEditor.BlockUI = BlockUI;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Fields;
    (function (Fields) {
        var BaseField = (function () {
            function BaseField(block, $field, data) {
                this.$field = $field;
                this.block = block;
                this.data = data;
                this.bind();
            }
            Object.defineProperty(BaseField, "type", {
                get: function () {
                    var name = this.name;
                    name = name.replace('Field', '');
                    name = name.substring(0, 1).toLowerCase() + name.substring(1);
                    return name;
                },
                enumerable: true,
                configurable: true
            });
            BaseField.prototype.getSettingsEl = function () {
                return null;
            };
            BaseField.registerCommonFields = function () {
                Fields.HtmlField.registerField();
                Fields.ImageField.registerField();
                Fields.EmbedField.registerField();
            };
            ;
            BaseField.registerField = function () {
                if (this._fields.hasOwnProperty(this.type)) {
                    delete this._fields[this.type];
                }
                this._fields[this.type] = this;
            };
            BaseField.createField = function (block, $el, data) {
                var fieldData = $el.data().breField;
                if (!fieldData) {
                    throw "There is no any data in field " + $el.html() + " of block " + block.name;
                }
                if (typeof fieldData === 'string') {
                    fieldData = JSON.parse(fieldData.replace(/'/g, '"'));
                }
                if (!fieldData.name) {
                    throw "There is no name in data of field " + $el.html() + " of block " + block.name;
                }
                if (data) {
                    var addFieldData = {};
                    for (var idx = 0; idx < data.length; idx++) {
                        var field_1 = data[idx];
                        if (field_1.name.toLowerCase() === fieldData.name.toLowerCase()) {
                            addFieldData = field_1;
                            break;
                        }
                    }
                    if (addFieldData) {
                        fieldData = $.extend(fieldData, addFieldData);
                    }
                }
                var type = fieldData.type;
                if (type != null) {
                    if (this._fields.hasOwnProperty(type)) {
                        var field = this._fields[type];
                        return new field(block, $el, fieldData);
                    }
                    else {
                        throw type + " field not found";
                    }
                }
                else {
                    throw "Field type not defined in data-bre-field attribute";
                }
            };
            BaseField.prototype.bind = function () { };
            BaseField.prototype.selectBlock = function () {
                this.block.select();
            };
            BaseField._fields = {};
            return BaseField;
        }());
        Fields.BaseField = BaseField;
    })(Fields = BrickyEditor.Fields || (BrickyEditor.Fields = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Fields;
    (function (Fields) {
        var EmbedField = (function (_super) {
            __extends(EmbedField, _super);
            function EmbedField() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            EmbedField.prototype.getSettingsEl = function () {
                var $el = $('<div style="position: absolute;width: 100%; height: 100px;;text-align: center;font-weight: bold;vertical-align: middle;background: #333;opacity: 0.2;">Change embed element link</div>');
                this.$field.before($el);
                return $el;
            };
            Object.defineProperty(EmbedField.prototype, "settings", {
                get: function () {
                    return function (field) {
                        field.data.url = prompt('Link to embed media', 'http://instagr.am/p/BO9VX2Vj4fF/');
                        field.loadMedia();
                    };
                },
                enumerable: true,
                configurable: true
            });
            EmbedField.prototype.bind = function () {
                var field = this;
                var $field = this.$field;
                $field.on('click', function () {
                    field.data.url = prompt('Link to embed media', 'http://instagr.am/p/BO9VX2Vj4fF/');
                    field.loadMedia();
                });
                field.loadMedia();
            };
            EmbedField.prototype.loadMedia = function () {
                var field = this;
                if (!field.data || !field.data.url)
                    return;
                BrickyEditor.Services.EmbedService
                    .getEmbedAsync(field.data.url)
                    .done(function (json) {
                    field.data.embed = json;
                    var $embed = $(json.html);
                    var $script = $embed.filter('script');
                    if ($script.length > 0) {
                        $script.remove();
                        var scriptSrc = $script.attr('src');
                        if (scriptSrc.breStartsWith('//')) {
                            scriptSrc = "https:" + scriptSrc;
                            $.getScript(scriptSrc)
                                .done(function (script) {
                                BrickyEditor.Services.EmbedService.processEmbed(json.provider_name);
                            })
                                .fail(function (err) { });
                        }
                    }
                    field.$field.empty();
                    field.$field.removeAttr('class');
                    field.$field.removeAttr('style');
                    field.$field.append($embed);
                    field.selectBlock();
                });
            };
            return EmbedField;
        }(Fields.BaseField));
        Fields.EmbedField = EmbedField;
    })(Fields = BrickyEditor.Fields || (BrickyEditor.Fields = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Fields;
    (function (Fields) {
        var HtmlField = (function (_super) {
            __extends(HtmlField, _super);
            function HtmlField() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            HtmlField.prototype.bind = function () {
                var _this = this;
                var field = this;
                var $field = this.$field;
                if (!$field.is('[contenteditable]')) {
                    $field.attr('contenteditable', 'true');
                }
                var html = this.data.html || this.$field.html() || this.block.template.name;
                this.setHtml(html);
                $field.html(this.data.html);
                BrickyEditor.SelectionUtils.bindTextSelection($field, function (rect) {
                    _this.block.editor.ui.htmlTools.show(rect);
                });
                $field
                    .on('blur keyup paste input', function () {
                    _this.setHtml($field.html());
                })
                    .on('paste', function (e) {
                    e.preventDefault();
                    var ev = e.originalEvent;
                    var text = ev.clipboardData.getData('text/plain');
                    document.execCommand("insertHTML", false, text);
                })
                    .on('click', function (ev) {
                    field.selectBlock();
                    ev.stopPropagation();
                    return false;
                });
            };
            HtmlField.prototype.setHtml = function (html) {
                this.data.html = html.trim();
                if (this.$field.html() !== html) {
                    this.$field.html(html);
                }
            };
            return HtmlField;
        }(Fields.BaseField));
        Fields.HtmlField = HtmlField;
    })(Fields = BrickyEditor.Fields || (BrickyEditor.Fields = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Fields;
    (function (Fields) {
        var ImageField = (function (_super) {
            __extends(ImageField, _super);
            function ImageField() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ImageField.prototype.bind = function () {
                var field = this;
                var $field = this.$field;
                var data = this.data;
                var editor = field.block.editor;
                this.setSrc(this.data.src);
                $field.on('click', function () {
                    editor.ui.modal.promptAsync(field.getPromptParams())
                        .done(function (fields) {
                        var file = fields.getValue('file');
                        var src = fields.getValue('src');
                        if (file) {
                            field.setFile(file);
                            field.setSrc(null);
                        }
                        else if (src) {
                            field.setSrc(src);
                            field.setFile(null);
                        }
                        var alt = fields.getValue('alt');
                        field.setAlt(alt);
                    });
                    field.selectBlock();
                });
            };
            ImageField.prototype.getPromptParams = function () {
                return [
                    new BrickyEditor.Prompt.PromptParameter('src', 'Image Link', this.data.url, 'image url'),
                    new BrickyEditor.Prompt.PromptParameterImage('file', 'or Upload file', this.data.file, 'select file'),
                    new BrickyEditor.Prompt.PromptParameter('alt', 'Alt', this.data.alt, 'alt attribute value '),
                ];
            };
            ImageField.prototype.setSrc = function (src) {
                this.data.src = src;
                if (src) {
                    if (this.isImg) {
                        this.$field.attr('src', this.data.src);
                    }
                    else {
                        this.$field.css('background-image', "url(" + this.data.src);
                    }
                }
            };
            ImageField.prototype.setAlt = function (alt) {
                this.data.alt = alt;
                this.$field.attr(this.isImg ? 'alt' : 'title', this.data.alt);
            };
            ImageField.prototype.setFile = function (file) {
                this.data.file = file;
                if (file) {
                    if (this.isImg) {
                        this.$field.attr('src', this.data.file.fileContent);
                    }
                    else {
                        this.$field.css('background-image', "url(" + this.data.file.fileContent + ")");
                    }
                }
            };
            Object.defineProperty(ImageField.prototype, "isImg", {
                get: function () {
                    return this._isImg = this._isImg || this.$field.prop('tagName').toLowerCase() === 'img';
                },
                enumerable: true,
                configurable: true
            });
            return ImageField;
        }(Fields.BaseField));
        Fields.ImageField = ImageField;
    })(Fields = BrickyEditor.Fields || (BrickyEditor.Fields = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Services;
    (function (Services) {
        var EmbedService = (function () {
            function EmbedService() {
            }
            EmbedService.getEmbedAsync = function (url) {
                var task = $.Deferred();
                var url = "https://noembed.com/embed?url=" + url;
                $.ajax({
                    url: url,
                    type: "get",
                    dataType: "jsonp"
                })
                    .done(function (json) {
                    task.resolve(json);
                })
                    .fail(function (err) {
                    task.reject(err);
                });
                return task;
            };
            EmbedService.processEmbed = function (provider) {
                switch (provider) {
                    case EmbedService.Instagram:
                        if (instgrm) {
                            instgrm.Embeds.process();
                        }
                        break;
                    default:
                        break;
                }
            };
            EmbedService.Instagram = 'Instagram';
            return EmbedService;
        }());
        Services.EmbedService = EmbedService;
    })(Services = BrickyEditor.Services || (BrickyEditor.Services = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Services;
    (function (Services) {
        var TemplateService = (function () {
            function TemplateService() {
            }
            TemplateService.loadTemplatesAsync = function (editor) {
                var _this = this;
                var result = $.Deferred();
                $.get(editor.options.templatesUrl)
                    .done(function (data) {
                    _this.templates = [];
                    var $style = $(data).filter('style');
                    if ($style && $style.length > 0) {
                        editor.$editor.prepend($style);
                    }
                    var $templates = $(data).filter('.bre-template');
                    $templates.each(function (idx, t) {
                        var template = new BrickyEditor.Template(t);
                        _this.templates.push(template);
                    });
                    result.resolve(_this.templates);
                })
                    .fail(function (err) {
                    console.log('Templates file not found.');
                    result.fail(err);
                });
                return result;
            };
            TemplateService.getTemplate = function (templateName) {
                for (var i = 0; i < this.templates.length; i++) {
                    var template = this.templates[i];
                    if (template.name.toLowerCase() === templateName.toLowerCase()) {
                        return template;
                    }
                }
                return null;
            };
            return TemplateService;
        }());
        Services.TemplateService = TemplateService;
    })(Services = BrickyEditor.Services || (BrickyEditor.Services = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Prompt;
    (function (Prompt) {
        var PromptParameter = (function () {
            function PromptParameter(key, title, value, placeholder) {
                this.key = key;
                this.title = title;
                this.placeholder = placeholder || '';
                this.value = value;
            }
            PromptParameter.prototype.parseValue = function () {
                this.value = this.$input.val();
                this.$control = null;
                delete this._$control;
            };
            Object.defineProperty(PromptParameter.prototype, "$control", {
                get: function () {
                    if (!this._$control) {
                        this._$control =
                            $("<div class=\"bre-prompt-field\">\n                            <label class=\"bre-label\" for=\"" + this.key + "\">" + (this.title ? this.title : 'Select file...') + "</label>\n                        </div>");
                        this.$input = this.getEditor();
                        this._$control.append(this.$input);
                    }
                    return this._$control;
                },
                set: function (value) {
                    this._$control = value;
                },
                enumerable: true,
                configurable: true
            });
            PromptParameter.prototype.getEditor = function () {
                var value = this.value || '';
                return $("<input type=\"text\" id=\"" + this.key + "\" class=\"bre-input\" placeholder=\"" + this.placeholder + "\" value=\"" + (this.value ? this.value : '') + "\">");
            };
            return PromptParameter;
        }());
        Prompt.PromptParameter = PromptParameter;
    })(Prompt = BrickyEditor.Prompt || (BrickyEditor.Prompt = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Prompt;
    (function (Prompt) {
        var PromptParameterImage = (function (_super) {
            __extends(PromptParameterImage, _super);
            function PromptParameterImage(key, title, value, placeholder) {
                var _this = _super.call(this, key, title, value, placeholder) || this;
                if (value) {
                    _this._value = value;
                }
                return _this;
            }
            PromptParameterImage.prototype.parseValue = function () {
                this.value = this._value;
                this.$control = null;
                delete this._$control;
                this._value = null;
                delete this._value;
            };
            PromptParameterImage.prototype.getEditor = function () {
                var field = this;
                var img = this.value && this.value.fileContent ? this.value.fileContent : "";
                var $editor = $("\n                <div class='bre-image-input'>\n                    <label for=\"" + this.key + "\">\n                        Select file...\n                    </label>                        \n                    <img src=\"" + img + "\"/>                    \n                    <input type=\"file\" id=\"" + this.key + "\" class=\"bre-input\" placeholder=\"" + this.placeholder + "\">\n                </div>\n                <small class='bre-image-input-filename'></small>");
                var $file = $('input', $editor);
                var $filePreview = $('img', $editor);
                var $fileName = $('.bre-image-input-filename', $editor);
                var value = this.value;
                if (value) {
                    $filePreview.attr('src', value.fileContent);
                    $filePreview.addClass('bre-loaded');
                    $fileName.text(value.fileInfo.name);
                }
                $file.change(function () {
                    var fileInput = this;
                    if (fileInput.files && fileInput.files[0]) {
                        var reader = new FileReader();
                        reader.onload = function (ev) {
                            var target = ev.target;
                            field._value = new Prompt.PromptParameterImageResult();
                            field._value.fileContent = target.result;
                            field._value.fileInfo = new Prompt.PromptParameterImageResultFile(fileInput.files[0]);
                            $filePreview.attr('src', field._value.fileContent);
                            $filePreview.addClass('bre-loaded');
                            $fileName.text(field._value.fileInfo.name);
                        };
                        reader.readAsDataURL(fileInput.files[0]);
                    }
                });
                return $editor;
            };
            return PromptParameterImage;
        }(Prompt.PromptParameter));
        Prompt.PromptParameterImage = PromptParameterImage;
    })(Prompt = BrickyEditor.Prompt || (BrickyEditor.Prompt = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Prompt;
    (function (Prompt) {
        var PromptParameterImageResult = (function () {
            function PromptParameterImageResult() {
            }
            return PromptParameterImageResult;
        }());
        Prompt.PromptParameterImageResult = PromptParameterImageResult;
        var PromptParameterImageResultFile = (function () {
            function PromptParameterImageResultFile(file) {
                this.name = file.name;
                this.size = file.size;
                this.type = file.type;
                this.lastModified = file.lastModified;
                this.lastModifiedDate = file.lastModifiedDate;
            }
            return PromptParameterImageResultFile;
        }());
        Prompt.PromptParameterImageResultFile = PromptParameterImageResultFile;
    })(Prompt = BrickyEditor.Prompt || (BrickyEditor.Prompt = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Prompt;
    (function (Prompt) {
        var PromptParameterList = (function () {
            function PromptParameterList(params) {
                this.params = params;
            }
            PromptParameterList.prototype.getValue = function (key) {
                var param = this.params.find(function (p) {
                    return p.key === key;
                });
                return param ? param.value : null;
            };
            return PromptParameterList;
        }());
        Prompt.PromptParameterList = PromptParameterList;
    })(Prompt = BrickyEditor.Prompt || (BrickyEditor.Prompt = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Prompt;
    (function (Prompt) {
        var PromptParameterOption = (function () {
            function PromptParameterOption(title, value, selected) {
                if (selected === void 0) { selected = false; }
                this.title = title;
                this.value = value;
                this.selected = selected;
            }
            return PromptParameterOption;
        }());
        Prompt.PromptParameterOption = PromptParameterOption;
    })(Prompt = BrickyEditor.Prompt || (BrickyEditor.Prompt = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Prompt;
    (function (Prompt) {
        var PromptParameterOptions = (function (_super) {
            __extends(PromptParameterOptions, _super);
            function PromptParameterOptions(key, title, options, value, placeholder) {
                var _this = _super.call(this, key, title, value, placeholder) || this;
                _this.options = [];
                options.forEach(function (kv) {
                    _this.options.push(new Prompt.PromptParameterOption(kv[0], kv[1], kv[1] == value));
                });
                return _this;
            }
            PromptParameterOptions.prototype.getEditor = function () {
                var options = this.options.map(function (opt) {
                    return "<option value=\"" + opt.value + "\" " + (opt.selected ? "selected" : "") + ">" + (opt.title ? opt.title : opt.value) + "</option>";
                });
                return $("<select type=\"text\" id=\"" + this.key + "\" class=\"brickyeditor-input\" placeholder=\"" + this.placeholder + "\">" + options + "</select>");
            };
            return PromptParameterOptions;
        }(Prompt.PromptParameter));
        Prompt.PromptParameterOptions = PromptParameterOptions;
    })(Prompt = BrickyEditor.Prompt || (BrickyEditor.Prompt = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var HtmlTools = (function () {
        function HtmlTools(editor) {
            this.editor = editor;
            this.buttons = [
                { icon: 'bold', command: 'Bold', range: true },
                { icon: 'italic', command: 'Italic', range: true },
                { icon: 'link', command: 'CreateLink', range: true },
                { icon: 'list-ul', command: 'insertUnorderedList', range: true },
                { icon: 'list-ol', command: 'insertOrderedList', range: true },
                { icon: 'undo', command: 'Undo', range: false },
                { icon: 'repeat', command: 'Redo', range: false },
            ];
            this.setControl();
        }
        HtmlTools.prototype.setControl = function () {
            var _this = this;
            var $panel = $('<div class="bre-html-tools-panel"></div>');
            this.buttons.forEach(function (b) {
                var $btn = _this.getButtonElement(b.icon, b.command, b.range);
                $panel.append($btn);
            });
            this.$control = $('<div class="bre-html-tools bre-btn-group"></div>');
            this.$control.append($panel).hide();
            this.editor.$editor.append(this.$control);
        };
        HtmlTools.prototype.getButtonElement = function (icon, command, rangeCommand) {
            var _this = this;
            if (rangeCommand === void 0) { rangeCommand = true; }
            var $btn = $("<button class=\"bre-btn\"><i class=\"fa fa-" + icon + "\"></i></button>");
            $btn.on('click', function () {
                var selection = window.getSelection();
                var selectionRange = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
                if (rangeCommand && !selectionRange)
                    return;
                if (command == 'CreateLink') {
                    _this.editor.ui.modal.promptAsync(_this.getLinkPromptParams(selection))
                        .done(function (fields) {
                        var href = fields.getValue('href');
                        if (href) {
                            document.execCommand(command, false, href);
                            var target = fields.getValue('target');
                            if (target) {
                                selection.anchorNode.parentElement.setAttribute('target', target);
                            }
                            var title = fields.getValue('title');
                            if (title) {
                                selection.anchorNode.parentElement.setAttribute('title', title);
                            }
                        }
                    });
                }
                else {
                    document.execCommand(command);
                }
                return false;
            });
            return $btn;
        };
        HtmlTools.prototype.show = function (rect) {
            if (rect && rect.width > 1) {
                var editorOffset = this.editor.$editor.offset();
                var editorWidth = this.editor.$editor.width();
                var top = rect.top - editorOffset.top + $(window).scrollTop() + rect.height;
                var controlWidth = this.$control.width();
                var left = rect.left - editorOffset.left + rect.width / 2 - controlWidth / 2;
                if (left < 0) {
                    left = 0;
                }
                else if (left + controlWidth > editorWidth) {
                    left = editorWidth - controlWidth;
                }
                this.$control.css({ top: top + 'px', left: left + 'px' });
                this.$control.show();
            }
            else {
                this.$control.hide();
            }
        };
        HtmlTools.prototype.getLinkPromptParams = function (selection) {
            var href = '', title = '', target = '';
            if (selection.anchorNode && selection.anchorNode.parentNode.nodeName.breEqualsInvariant('a')) {
                var a = $(selection.anchorNode.parentNode);
                href = a.attr('href');
                title = a.attr('title');
                target = a.attr('target');
            }
            return [
                new BrickyEditor.Prompt.PromptParameter('href', 'Url', href, 'Url'),
                new BrickyEditor.Prompt.PromptParameter('title', 'Title', title, 'Title'),
                new BrickyEditor.Prompt.PromptParameterOptions('target', 'Target', [
                    ['', ''],
                    ['Blank', '_blank'],
                    ['Self', '_self'],
                    ['Parent', '_parent'],
                    ['Top', '_top'],
                ], target)
            ];
        };
        return HtmlTools;
    }());
    BrickyEditor.HtmlTools = HtmlTools;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Modal = (function () {
        function Modal($control, $closeBtn, $form, $btns, $okBtn, $cancelBtn) {
            this.$control = $control;
            this.$closeBtn = $closeBtn;
            this.$form = $form;
            this.$btns = $btns;
            this.$okBtn = $okBtn;
            this.$cancelBtn = $cancelBtn;
            var modal = this;
            $closeBtn.on('click', function () {
                modal.hideModal();
            });
        }
        Modal.prototype.hideModal = function () {
            this.restoreSelection();
            this.$control.fadeOut();
        };
        Modal.prototype.showModal = function ($html, showBtns) {
            if (showBtns === void 0) { showBtns = true; }
            this.saveSelection();
            this.$btns.toggle(showBtns);
            if ($html) {
                this.$form.append($html);
                if (!$html.is(':visible')) {
                    $html.show();
                }
            }
            this.$control.fadeIn();
        };
        Modal.prototype.promptAsync = function (fields) {
            var _this = this;
            var result = $.Deferred();
            var modal = this;
            this.$form.children().not(this.$btns).remove();
            fields.forEach(function (field) {
                _this.$btns.before(field.$control);
            });
            this.$okBtn.on('click', function () {
                fields.forEach(function (field) { return field.parseValue(); });
                modal.hideModal();
                result.resolve(new BrickyEditor.Prompt.PromptParameterList(fields));
            });
            this.$cancelBtn.on('click', function () {
                modal.hideModal();
                result.reject(fields);
            });
            modal.showModal();
            return result;
        };
        Modal.prototype.saveSelection = function () {
            var selection = window.getSelection();
            this.selectionRanges = [];
            for (var idx = 0; idx < selection.rangeCount; idx++) {
                this.selectionRanges.push(selection.getRangeAt(idx));
            }
        };
        Modal.prototype.restoreSelection = function () {
            if (!this.selectionRanges || this.selectionRanges.length == 0)
                return;
            var selection = window.getSelection();
            selection.removeAllRanges();
            this.selectionRanges.forEach(function (range) { return selection.addRange(range); });
        };
        return Modal;
    }());
    BrickyEditor.Modal = Modal;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var SelectionHelper = (function () {
        function SelectionHelper() {
        }
        SelectionHelper.getSelectedText = function () {
            var sel = window.getSelection();
            return sel.getRangeAt(0).toString();
        };
        SelectionHelper.replaceSelectedText = function (replacement) {
            var sel, range;
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(document.createTextNode(replacement));
                }
            }
        };
        return SelectionHelper;
    }());
    BrickyEditor.SelectionHelper = SelectionHelper;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var SelectionUtils = (function () {
        function SelectionUtils() {
        }
        SelectionUtils.bindTextSelection = function ($el, handler) {
            var _this = this;
            if (!$el.is('[contenteditable]')) {
                return;
            }
            $el.on('mouseup', function () {
                setTimeout(function () {
                    var rect = _this.getSelectionRect();
                    handler(rect);
                }, 0);
            });
            $el.on('keyup', function (ev) {
                var rect = _this.getSelectionRect();
                handler(rect);
            });
        };
        SelectionUtils.getSelectionRect = function () {
            var selection = window.getSelection();
            var range = selection.getRangeAt(0);
            if (range) {
                var rect = range.getBoundingClientRect();
                if (rect) {
                    return rect;
                }
            }
            return null;
        };
        return SelectionUtils;
    }());
    BrickyEditor.SelectionUtils = SelectionUtils;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Selectors = (function () {
        function Selectors() {
        }
        Selectors.attr = function (attr) {
            return "[" + attr + "]";
        };
        Selectors.field = 'data-bre-field';
        Selectors.selectorField = "[" + Selectors.field + "]";
        Selectors.classMobile = 'brickyeditor-tools-mobile';
        Selectors.htmlToolsCommand = 'data-bre-doc-command';
        Selectors.htmlToolsCommandRange = 'data-bre-doc-command-range';
        Selectors.selectorHtmlToolsCommand = Selectors.attr(Selectors.htmlToolsCommand);
        Selectors.selectorHtmlToolsCommandRange = Selectors.attr(Selectors.htmlToolsCommandRange);
        return Selectors;
    }());
    BrickyEditor.Selectors = Selectors;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var UI = (function () {
        function UI(editor) {
            this.editor = editor;
            this.setTools();
            this.setModal();
            this.htmlTools = new BrickyEditor.HtmlTools(this.editor);
        }
        Object.defineProperty(UI.prototype, "isMobile", {
            get: function () {
                return this._isMobile;
            },
            set: function (value) {
                if (this._isMobile == value)
                    return;
                this._isMobile = value;
                if (this.$tools != null) {
                    this.$tools.toggle(!value);
                    this.$toolsBtn.toggle(value);
                    if (value) {
                        this.$tools.addClass(BrickyEditor.Selectors.classMobile);
                    }
                    else {
                        this.$tools.removeClass(BrickyEditor.Selectors.classMobile);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        UI.prototype.checkIsCompactTools = function (editor) {
            if (this.compactTools == null) {
                var offset = (window.innerWidth - editor.$editor.width()) / 2 - this.$tools.width();
                this.isMobile = offset <= 0;
            }
            else {
                this.isMobile = this.compactTools;
            }
        };
        UI.prototype.setTools = function () {
            var _this = this;
            this.$toolsTemplates = $('<div class="bre-tools-templates"></div>');
            this.$toolsLoader = $('<div class="bre-tools-loader"><b>Loading...</b></div>');
            this.$toolsHideBtn = $('<button class="bre-tools-toggle"><div>></div></button>');
            this.$tools = $('<div class="bre bre-tools" data-bricky-tools></div>');
            this.$tools.append([this.$toolsHideBtn, this.$toolsLoader, this.$toolsTemplates]);
            this.$toolsHideBtn.on('click', function () {
                _this.$tools.toggleClass('bre-tools-collapsed', !_this.$toolsHideBtn.hasClass("bre-tools-toggle-collapsed"));
                _this.$toolsHideBtn.toggleClass("bre-tools-toggle-collapsed");
            });
            this.editor.$editor.append(this.$tools);
        };
        UI.prototype.setModal = function () {
            var $modal = $('<div class="bre bre-modal"><div class="bre-modal-placeholder"></div></div>');
            var $modalCloseBtn = $('<div class="bre-modal-close"><a href="#">close ✖</a></div>');
            var $modalContent = $('<div class="bre-modal-content"></div>');
            var $modalForm = $('<form></form>');
            var $modalBtns = $('<div class="bre-btns"></div>');
            var $modalOk = $('<button type="button" class="bre-btn bre-btn-primary">Ok</button>');
            var $modalCancel = $('<button type="button" class="bre-btn">Cancel</button>');
            $modalBtns.append($modalOk);
            $modalBtns.append($modalCancel);
            $modalForm.append($modalBtns);
            $modalContent.append($modalForm);
            var $placeholder = $('.bre-modal-placeholder', $modal);
            $placeholder.append($modalCloseBtn);
            $placeholder.append($modalContent);
            this.modal = new BrickyEditor.Modal($modal, $modalCloseBtn, $modalForm, $modalBtns, $modalOk, $modalCancel);
            this.editor.$editor.append($modal);
        };
        UI.prototype.toggleToolsLoader = function (toggle) {
            this.$toolsLoader.toggle(toggle);
        };
        UI.prototype.setTemplates = function (templates) {
            var _this = this;
            var editor = this.editor;
            templates.forEach(function (template) {
                var $preview = template.getPreview();
                $preview.on('click', function () {
                    editor.addBlock(template);
                });
                _this.$toolsTemplates.append($preview);
            });
        };
        UI.initBtnDeck = function ($btnsDeck) {
            var $btns = $('.bre-btn', $btnsDeck);
            var $firstBtn = $btns.eq(0);
            $firstBtn.on('click', function () {
                UI.toggleBtnDeck($btnsDeck);
            });
        };
        UI.toggleBtnDeck = function ($btnsDeck, isOn) {
            var $btns = $('.bre-btn', $btnsDeck);
            if (!$btns || $btns.length == 0)
                return;
            var $firstBtn = $btns.eq(0);
            var size = 32;
            var gap = size / 6;
            isOn = isOn || $btnsDeck.data().isOn || false;
            if (isOn) {
                $btnsDeck.css({ 'height': 0, 'width': 0 });
                $btns.not(':first').css({ 'opacity': 0, 'top': 0, 'left': 0 });
            }
            else {
                $btns.not(':first').each(function (idx, btn) {
                    $(btn).css({ 'opacity': 1, 'left': (idx + 1) * (size + gap) });
                });
                $btnsDeck.css({ 'height': size, 'width': (size + gap) * $btns.length - gap });
            }
            $firstBtn.toggleClass('bre-btn-active', !isOn);
            $btnsDeck.data('isOn', !isOn);
        };
        return UI;
    }());
    BrickyEditor.UI = UI;
})(BrickyEditor || (BrickyEditor = {}));
