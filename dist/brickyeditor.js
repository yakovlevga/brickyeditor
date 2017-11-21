var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
            this.blocks = [];
            this.compactTools = null;
            BrickyEditor.Fields.BaseField.registerCommonFields();
            this.$editor = $editor;
            this.$editor.addClass('bre-editor');
            this.options = new BrickyEditor.EditorOptions(options);
            Editor.UI = new BrickyEditor.UI(this);
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
        Editor.prototype.initAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var templates, blocks;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Editor.UI.toggleToolsLoader(true);
                            return [4, BrickyEditor.Services.TemplateService.loadTemplatesAsync(this)];
                        case 1:
                            templates = _a.sent();
                            Editor.UI.toggleToolsLoader(false);
                            Editor.UI.setTemplates(templates);
                            return [4, this.tryLoadInitialBlocksAsync()];
                        case 2:
                            blocks = _a.sent();
                            this.loadBlocks(blocks);
                            if (this.options.onload) {
                                this.options.onload(this);
                            }
                            this.tryBindFormSubmit();
                            return [2];
                    }
                });
            });
        };
        Editor.prototype.tryLoadInitialBlocksAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var url;
                return __generator(this, function (_a) {
                    url = this.options.blocksUrl;
                    return [2, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            var blocks, error_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!url) return [3, 5];
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4, $.get(url)];
                                    case 2:
                                        blocks = _a.sent();
                                        resolve(blocks);
                                        return [3, 4];
                                    case 3:
                                        error_1 = _a.sent();
                                        console.log('Blocks file not found.');
                                        reject(error_1);
                                        return [3, 4];
                                    case 4: return [3, 6];
                                    case 5:
                                        if (this.options.blocks) {
                                            resolve(this.options.blocks);
                                        }
                                        else {
                                            resolve(null);
                                        }
                                        _a.label = 6;
                                    case 6: return [2];
                                }
                            });
                        }); })];
                });
            });
        };
        Editor.prototype.tryBindFormSubmit = function () {
            var editor = this;
            var $form = this.options.formSelector ? $(this.options.formSelector) : null;
            var $input = this.options.inputSelector ? $(this.options.inputSelector) : null;
            if (!$form || !$input || $form.length == 0 || $input.length == 0)
                return;
            $form.on('submit', function () {
                $input.val(JSON.stringify(editor.getData()));
                return true;
            });
        };
        Editor.prototype.getData = function () {
            var _this = this;
            var blocksData = [];
            this.blocks.forEach(function (block) {
                blocksData.push(block.getData(_this.options.ignoreHtml));
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
        Editor.prototype.addBlock = function (template, data, idx, select) {
            var _this = this;
            if (select === void 0) { select = true; }
            var block = new BrickyEditor.Block(template, false, data, function (block) { return _this.deleteBlock(block); }, function (block) { return _this.selectBlock(block); }, function (block) { return _this.deselectBlock(block); }, function (block) { return _this.copyBlock(block); }, function (block, offset) { return _this.moveBlock(block, offset); });
            this.insertBlock(block, idx);
            if (select) {
                block.select();
                block.scrollTo();
            }
        };
        Editor.prototype.insertBlock = function (block, idx) {
            idx = idx || this.blocks.length;
            if (this.selectedBlock) {
                idx = this.selectedBlockIndex + 1;
            }
            this.blocks.splice(idx, 0, block);
            if (idx == 0) {
                this.$editor.append(block.ui.$editor);
            }
            else {
                this.blocks[idx - 1].ui.$editor.after(block.ui.$editor);
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
            this.compactToolsWidth = 768;
            this.ignoreHtml = null;
            this.htmlToolsButtons = null;
            this.templatesUrl = options.templatesUrl || this.templatesUrl;
            this.onload = options.onload;
            this.blocksUrl = options.blocksUrl || null;
            this.blocks = options.blocks || null;
            this.compactTools = options.compactTools;
            this.ignoreHtml = options.ignoreHtml || false;
            this.htmlToolsButtons = options.htmlToolsButtons || null;
            this.formSelector = options.formSelector || null;
            this.inputSelector = options.inputSelector || null;
        }
        return EditorOptions;
    }());
    BrickyEditor.EditorOptions = EditorOptions;
})(BrickyEditor || (BrickyEditor = {}));
(function ($) {
    $.fn.brickyeditor = function (options) {
        var editor = new BrickyEditor.Editor($(this), options);
        editor.initAsync();
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
                var block = new BrickyEditor.Block(this, true);
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
        function Block(template, preview, data, onDelete, onSelect, onDeselect, onCopy, onMove) {
            var _this = this;
            this.template = template;
            this.onDelete = onDelete;
            this.onSelect = onSelect;
            this.onDeselect = onDeselect;
            this.onCopy = onCopy;
            this.onMove = onMove;
            this.fields = [];
            this.template = template;
            var block = this;
            var $block = template.$html.clone();
            block.bindFields($block, data);
            var actions = this.getActions();
            this.ui = new BrickyEditor.BlockUI($block, preview, actions, function () { return _this.select(); });
        }
        Block.prototype.bindFields = function ($block, data) {
            var _this = this;
            var block = this;
            var $fields = $block
                .find(BrickyEditor.Selectors.selectorField)
                .addBack(BrickyEditor.Selectors.selectorField);
            $fields.each(function (idx, elem) {
                var $field = $(elem);
                var field = BrickyEditor.Fields.BaseField.createField($field, data, function () { return block.select(); });
                _this.fields.push(field);
            });
        };
        Block.prototype.getActions = function () {
            var block = this;
            var actions = [
                new BrickyEditor.BlockUIAction('ellipsis-h'),
                new BrickyEditor.BlockUIAction('trash-o', function () { return block.delete(); }),
                new BrickyEditor.BlockUIAction('copy', function () { return block.clone(); }),
                new BrickyEditor.BlockUIAction('angle-up', function () { return block.move(-1); }),
                new BrickyEditor.BlockUIAction('angle-down', function () { return block.move(1); })
            ];
            return actions;
        };
        Block.prototype.delete = function () {
            this.ui.delete();
            this.onDelete(this);
        };
        Block.prototype.move = function (offset) {
            this.onMove(this, offset);
        };
        Block.prototype.clone = function () {
            this.onCopy(this);
        };
        Block.prototype.select = function () {
            this.ui.toggleSelection(true);
            this.onSelect(this);
        };
        Block.prototype.deselect = function () {
            this.ui.toggleSelection(false);
            this.onDeselect(this);
        };
        Block.prototype.scrollTo = function () {
            var top = this.ui.$editor.offset().top - 100;
            top = top > 0 ? top : 0;
            $('html, body').animate({
                scrollTop: top
            }, 'fast');
        };
        Block.prototype.getData = function (ignoreHtml) {
            var fieldsData = [];
            this.fields.forEach(function (field) {
                fieldsData.push(field.data);
            });
            var data = { template: this.template.name, fields: fieldsData };
            if (!ignoreHtml) {
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
        return Block;
    }());
    BrickyEditor.Block = Block;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var BlockUI = (function () {
        function BlockUI($block, preview, actions, onSelect) {
            this.$block = $block;
            this.onSelect = onSelect;
            if (!preview) {
                this.buildEditorUI(actions);
            }
        }
        BlockUI.prototype.delete = function () {
            this.$editor.remove();
        };
        BlockUI.prototype.toggleSelection = function (isOn) {
            this.$editor.toggleClass("bre-selected", isOn);
        };
        BlockUI.prototype.buildEditorUI = function (actions) {
            var _this = this;
            this.$tools = $('<div class="bre-block-tools bre-btn-deck"></div>');
            actions.forEach(function (action) {
                var $btn = _this.buildButton(action);
                _this.$tools.append($btn);
            });
            BrickyEditor.UI.initBtnDeck(this.$tools);
            this.$editor = $('<div class="bre-block-wrapper"></div>');
            this.$editor.append(this.$tools);
            this.$editor.append(this.$block);
            this.$editor.hover(function () { _this.$editor.addClass('bre-active'); }, function () { _this.$editor.removeClass('bre-active'); });
            this.$block.on('click', function () { return _this.onSelect(); });
        };
        BlockUI.prototype.buildButton = function (action) {
            var $el = $("<button type=\"button\" class=\"bre-btn\"><i class=\"fa fa-" + action.icon + "\"></i></button>");
            if (action.action) {
                $el.on('click', function () { return action.action(); });
            }
            return $el;
        };
        return BlockUI;
    }());
    BrickyEditor.BlockUI = BlockUI;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var BlockUIAction = (function () {
        function BlockUIAction(icon, action, title) {
            this.icon = icon;
            this.action = action;
            this.title = title;
        }
        return BlockUIAction;
    }());
    BrickyEditor.BlockUIAction = BlockUIAction;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Fields;
    (function (Fields) {
        var BaseField = (function () {
            function BaseField($field, data, onSelect) {
                this.$field = $field;
                this.data = data;
                this.onSelect = onSelect;
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
            BaseField.createField = function ($field, data, onSelect) {
                var fieldData = $field.data().breField;
                if (!fieldData) {
                    throw "There is no any data in field " + $field.html();
                }
                if (typeof fieldData === 'string') {
                    fieldData = JSON.parse(fieldData.replace(/'/g, '"'));
                }
                if (!fieldData.name) {
                    throw "There is no name in data of field " + $field.html();
                }
                if (data) {
                    var addFieldData = {};
                    for (var idx = 0; idx < data.length; idx++) {
                        var field = data[idx];
                        if (field.name.toLowerCase() === fieldData.name.toLowerCase()) {
                            addFieldData = field;
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
                        return new field($field, fieldData, onSelect);
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
                this.onSelect();
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
                return __awaiter(this, void 0, void 0, function () {
                    var field, json, $embed, $script, scriptSrc;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                field = this;
                                if (!field.data || !field.data.url)
                                    return [2];
                                return [4, BrickyEditor.Services.EmbedService.getEmbedAsync(field.data.url)];
                            case 1:
                                json = _a.sent();
                                field.data.embed = json;
                                $embed = $(json.html);
                                $script = $embed.filter('script');
                                if ($script.length > 0) {
                                    $script.remove();
                                    scriptSrc = $script.attr('src');
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
                                return [2];
                        }
                    });
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
                var html = this.data.html || this.$field.html();
                this.setHtml(html);
                $field.html(this.data.html);
                BrickyEditor.SelectionUtils.bindTextSelection($field, function (rect) {
                    BrickyEditor.Editor.UI.htmlTools.show(rect);
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
                var _this = this;
                var field = this;
                var $field = this.$field;
                var data = this.data;
                this.setSrc(this.data.src);
                $field.on('click', function () { return __awaiter(_this, void 0, void 0, function () {
                    var fields, file, src, alt;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, BrickyEditor.Editor.UI.modal.promptAsync(field.getPromptParams())];
                            case 1:
                                fields = _a.sent();
                                file = fields.getValue('file');
                                src = fields.getValue('src');
                                if (file) {
                                    field.setFile(file);
                                    field.setSrc(null);
                                }
                                else if (src) {
                                    field.setSrc(src);
                                    field.setFile(null);
                                }
                                alt = fields.getValue('alt');
                                field.setAlt(alt);
                                field.selectBlock();
                                return [2];
                        }
                    });
                }); });
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
    var Services;
    (function (Services) {
        var EmbedService = (function () {
            function EmbedService() {
            }
            EmbedService.getEmbedAsync = function (embedUrl) {
                var _this = this;
                var url = "https://noembed.com/embed?url=" + embedUrl;
                return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var params, data, err_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                params = { url: url, type: "get", dataType: "jsonp" };
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4, $.ajax(params)];
                            case 2:
                                data = _a.sent();
                                resolve(data);
                                return [3, 4];
                            case 3:
                                err_1 = _a.sent();
                                reject(err_1);
                                return [3, 4];
                            case 4: return [2];
                        }
                    });
                }); });
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
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    var templates, url;
                    return __generator(this, function (_a) {
                        this.templates = [];
                        templates = this.templates;
                        url = editor.options.templatesUrl;
                        return [2, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                var data, $style, $templates, err_2;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4, $.get(url)];
                                        case 1:
                                            data = _a.sent();
                                            $style = $(data).filter('style');
                                            if ($style && $style.length > 0) {
                                                editor.$editor.prepend($style);
                                            }
                                            $templates = $(data).filter('.bre-template');
                                            $templates.each(function (idx, t) {
                                                var template = new BrickyEditor.Template(t);
                                                templates.push(template);
                                            });
                                            resolve(this.templates);
                                            return [3, 3];
                                        case 2:
                                            err_2 = _a.sent();
                                            console.log('Templates file not found.');
                                            reject(err_2);
                                            return [3, 3];
                                        case 3: return [2];
                                    }
                                });
                            }); })];
                    });
                });
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
    var HtmlTools = (function () {
        function HtmlTools(editor) {
            this.editor = editor;
            this.buttons = [
                { icon: 'bold', command: 'Bold', range: true, aValueArgument: null },
                { icon: 'italic', command: 'Italic', range: true, aValueArgument: null },
                { icon: 'link', command: 'CreateLink', range: true, aValueArgument: null },
                { icon: 'list-ul', command: 'insertUnorderedList', range: true, aValueArgument: null },
                { icon: 'list-ol', command: 'insertOrderedList', range: true, aValueArgument: null },
                { icon: 'undo', command: 'Undo', range: false, aValueArgument: null },
                { icon: 'repeat', command: 'Redo', range: false, aValueArgument: null },
            ];
            if (editor.options.htmlToolsButtons) {
                this.buttons = editor.options.htmlToolsButtons;
            }
            this.setControl();
        }
        HtmlTools.prototype.setControl = function () {
            var _this = this;
            var $panel = $('<div class="bre-html-tools-panel"></div>');
            this.buttons.forEach(function (b) {
                var $btn = _this.getButtonElement(b.icon, b.command, b.range, b.aValueArgument);
                $panel.append($btn);
            });
            this.$control = $('<div class="bre-html-tools bre-btn-group"></div>');
            this.$control.append($panel).hide();
            this.editor.$editor.append(this.$control);
        };
        HtmlTools.prototype.getButtonElement = function (icon, command, rangeCommand, aValueArgument) {
            var _this = this;
            if (rangeCommand === void 0) { rangeCommand = true; }
            if (aValueArgument === void 0) { aValueArgument = null; }
            var $btn = $("<button type=\"button\" class=\"bre-btn\"><i class=\"fa fa-" + icon + "\"></i></button>");
            $btn.on('click', function () { return __awaiter(_this, void 0, void 0, function () {
                var selection, selectionRange, params, fields, href, target, title, valueArgument;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            selection = window.getSelection();
                            selectionRange = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
                            if (rangeCommand && !selectionRange)
                                return [2];
                            if (!(command == 'CreateLink')) return [3, 2];
                            params = this.getLinkPromptParams(selection);
                            return [4, BrickyEditor.Editor.UI.modal.promptAsync(params)];
                        case 1:
                            fields = _a.sent();
                            href = fields.getValue('href');
                            if (href) {
                                document.execCommand(command, false, href);
                                target = fields.getValue('target');
                                if (target) {
                                    selection.anchorNode.parentElement.setAttribute('target', target);
                                }
                                title = fields.getValue('title');
                                if (title) {
                                    selection.anchorNode.parentElement.setAttribute('title', title);
                                }
                            }
                            return [3, 3];
                        case 2:
                            if (typeof (aValueArgument) === 'string') {
                                valueArgument = aValueArgument.replace('%%SELECTION%%', selection.toString());
                            }
                            document.execCommand(command, false, valueArgument);
                            _a.label = 3;
                        case 3: return [2, false];
                    }
                });
            }); });
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
            var modal = this;
            return new Promise(function (resolve, reject) {
                modal.$form.children().not(_this.$btns).remove();
                fields.forEach(function (field) {
                    _this.$btns.before(field.$control);
                });
                modal.$okBtn.on('click', function () {
                    fields.forEach(function (field) { return field.parseValue(); });
                    modal.hideModal();
                    var list = new BrickyEditor.Prompt.PromptParameterList(fields);
                    resolve(list);
                });
                modal.$cancelBtn.on('click', function () {
                    modal.hideModal();
                    reject(fields);
                });
                modal.showModal();
            });
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
            this.editor = editor;
            this.setTools();
            this.setModal();
            this.htmlTools = new BrickyEditor.HtmlTools(this.editor);
        }
        Object.defineProperty(UI.prototype, "isCompactTools", {
            get: function () {
                var compactTools = this.editor.options.compactTools;
                if (compactTools == null) {
                    return window.innerWidth < this.editor.options.compactToolsWidth;
                }
                else {
                    return compactTools.valueOf();
                }
            },
            enumerable: true,
            configurable: true
        });
        UI.prototype.setTools = function () {
            var _this = this;
            this.$tools = $('<div class="bre bre-tools" data-bricky-tools></div>');
            this.$toolsTemplates = $('<div class="bre-tools-templates"></div>');
            this.$toolsLoader = $('<div class="bre-tools-loader"><b>Loading...</b></div>');
            this.$toolsHideBtn = $('<button type="button" class="bre-tools-toggle"><div>►</div></button>');
            this.$tools.append([this.$toolsHideBtn, this.$toolsLoader, this.$toolsTemplates]);
            this.$toolsHideBtn.on('click', function () { return _this.toggleTools(); });
            this.editor.$editor.append(this.$tools);
            if (this.isCompactTools) {
                this.$tools.addClass("bre-tools-templates-compact");
                this.toggleTools();
            }
        };
        UI.prototype.toggleTools = function () {
            this.$tools.toggleClass('bre-tools-collapsed', !this.$toolsHideBtn.hasClass("bre-tools-toggle-collapsed"));
            this.$toolsHideBtn.toggleClass("bre-tools-toggle-collapsed");
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
