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
var BrickyEditor;
(function (BrickyEditor) {
    var Block = (function () {
        function Block(editor, container, templateName, data) {
            this.fields = [];
            var block = this;
            this.editor = editor;
            this.container = container;
            this.template = templateName;
            var template = BrickyEditor.Services.TemplateService.getTemplate(templateName);
            this.$block = $(template.html);
            var $editor = this.getBlockTools(this.$block);
            this.$editor = $editor;
            $editor.hover(function () {
                $editor.addClass('active');
            }, function () {
                $editor.removeClass('active');
            });
            this.bindBlockFields(data);
        }
        Block.prototype.getBlockTools = function ($block) {
            var block = this;
            var $tools = $("<div class='brickyeditor-block-wrapper'>\n                    <div  class='brickyeditor-block-tools'>\n                        <a class='fa fa-trash-o' data-brickyeditor-block-action='" + BlockAction.Delete + "'></a>\n                        <a class='fa fa-copy' data-brickyeditor-block-action='" + BlockAction.Copy + "'></a>\n                        <a class='fa fa-angle-up' data-brickyeditor-block-action='" + BlockAction.Up + "'></a>\n                        <a class='fa fa-angle-down' data-brickyeditor-block-action='" + BlockAction.Down + "'></a>\n                    </div>\n                </div>");
            $('[data-brickyeditor-block-action]', $tools).on('click', function () {
                var action = $(this).attr('data-brickyeditor-block-action');
                block.action(parseInt(action));
            });
            $tools.append($block);
            return $tools;
        };
        Block.prototype.action = function (action) {
            switch (action) {
                case BlockAction.Delete:
                    this.container.deleteBlock(this);
                    break;
                case BlockAction.Up:
                    this.container.moveBlock(this, -1);
                    break;
                case BlockAction.Down:
                    this.container.moveBlock(this, +1);
                    break;
                case BlockAction.Copy:
                    this.container.copyBlock(this);
                    break;
                default:
                    break;
            }
        };
        Block.prototype.bindBlockFields = function (data) {
            var block = this;
            this.$block
                .find(BrickyEditor.Constants.selectorField)
                .addBack(BrickyEditor.Constants.selectorField)
                .each(function () {
                var $field = $(this);
                var fieldName = BrickyEditor.Services.TemplateService.getFieldValue($field, "name");
                var fieldData;
                if (data) {
                    data.forEach(function (fd) {
                        if (fd.name === fieldName) {
                            fieldData = fd.data;
                        }
                    });
                }
                var field = BrickyEditor.Fields.BaseField.getField(block, $field, fieldData);
                if (field) {
                    block.fields.push(field);
                }
            });
        };
        Block.prototype.getData = function () {
            var fieldsData = [];
            this.fields.forEach(function (field) {
                fieldsData.push(field.getData());
            });
            return {
                template: this.template,
                html: this.getHtml(true),
                fields: fieldsData
            };
        };
        Block.prototype.getHtml = function (trim, skipAttrRemoving) {
            if (skipAttrRemoving === void 0) { skipAttrRemoving = false; }
            var $html = this.$block.clone();
            $html
                .find(BrickyEditor.Constants.selectorField)
                .addBack(BrickyEditor.Constants.selectorField)
                .each(function (idx, el) {
                if (skipAttrRemoving)
                    return;
                var attrsToRemove = BrickyEditor.Common.propsFilterKeys(el.attributes, function (k, v) {
                    return v.name.breStartsWith(BrickyEditor.Constants.field);
                }).map(function (attr) {
                    return el.attributes[attr].name;
                });
                attrsToRemove.push('contenteditable');
                attrsToRemove.forEach(function (attr) {
                    el.removeAttribute(attr);
                });
            });
            var html = $html[0].outerHTML;
            return trim ? html.breTotalTrim() : html;
        };
        Block.prototype.selectBlock = function (field, container) {
            if (this.container.selectedBlock) {
                this.container.selectedBlock.deselectBlock();
            }
            this.container.selectedBlock = this;
            this.container.select(container);
        };
        Block.prototype.deselectBlock = function () {
            this.container.deselect(this.container.selectedContainer);
        };
        return Block;
    }());
    BrickyEditor.Block = Block;
    var BlockAction;
    (function (BlockAction) {
        BlockAction[BlockAction["Delete"] = 0] = "Delete";
        BlockAction[BlockAction["Settings"] = 1] = "Settings";
        BlockAction[BlockAction["Copy"] = 2] = "Copy";
        BlockAction[BlockAction["Up"] = 3] = "Up";
        BlockAction[BlockAction["Down"] = 4] = "Down";
    })(BlockAction || (BlockAction = {}));
    ;
})(BrickyEditor || (BrickyEditor = {}));
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
    var Constants = (function () {
        function Constants() {
        }
        return Constants;
    }());
    Constants.templatesFolder = 'templates/bootstrap4';
    Constants.field = 'data-bricky-field';
    Constants.templateModalKey = "modal";
    Constants.templateToolsKey = "tools";
    Constants.templateHtmlToolsKey = "htmlTools";
    Constants.selectorModalContent = ".brickyeditor-modal-content";
    Constants.selectorModalClose = ".brickyeditor-modal-close";
    Constants.selectorTemplates = '.templates';
    Constants.selectorTemplate = '.template';
    Constants.selectorCancel = '.brickyeditor-cancel';
    Constants.selectorSave = '.brickyeditor-save';
    Constants.selectorLoader = '#brickyeditorLoader';
    Constants.selectorFilter = '#brickyeditorFilter';
    Constants.selectorField = "[" + Constants.field + "]";
    Constants.selectorHtmlToolsCommand = '[data-brickyeditor-doc-command]';
    Constants.selectorHtmlToolsCommandRange = '[data-brickyeditor-doc-command-range]';
    Constants.selectorBlockWrapper = '.brickyeditor-block-wrapper';
    Constants.classMobile = "brickyeditor-tools-mobile";
    Constants.dummyText = "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue.";
    BrickyEditor.Constants = Constants;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Container = (function () {
        function Container($el, editor) {
            this.blocks = [];
            this.$el = $el;
            if (editor) {
                this.editor;
            }
            else if (this instanceof BrickyEditor.Editor) {
                this.editor = this;
            }
        }
        Object.defineProperty(Container.prototype, "selectedContainer", {
            get: function () {
                return this._selectedContainer;
            },
            set: function (v) {
                if (this._selectedContainer && this._selectedContainer != v) {
                    this._selectedContainer.$el.removeClass("selected");
                }
                this._selectedContainer = v;
                if (this._selectedContainer) {
                    this._selectedContainer.$el.addClass("selected");
                }
            },
            enumerable: true,
            configurable: true
        });
        Container.prototype.select = function (container) {
            var _this = this;
            this.selectedContainer = container;
            if (this.selectedContainer) {
                this.selectedContainer.$el.on('contextmenu', function () {
                    _this.deselect(container);
                    return false;
                });
            }
        };
        Container.prototype.deselect = function (container) {
            if (container) {
                container.$el.off('contextmenu');
                container.editor.selectedContainer = null;
            }
        };
        Container.prototype.getData = function () {
            var blocksData = [];
            this.blocks.forEach(function (block) {
                blocksData.push(block.getData());
            });
            return blocksData;
        };
        Container.prototype.getHtml = function () {
            var blocksData = [];
            this.blocks.forEach(function (block) {
                blocksData.push(block.getHtml(true));
            });
            return blocksData.join('\n');
        };
        Container.prototype.loadBlocks = function (blocks) {
            var _this = this;
            if (blocks && blocks.length) {
                blocks.forEach(function (block) {
                    _this.addBlock(block.template, block.fields);
                });
            }
        };
        Container.prototype.addBlock = function (template, data, idx) {
            var container = this;
            if (this.selectedBlock && this.selectedContainer) {
                container = this.selectedContainer;
            }
            var block = new BrickyEditor.Block(this.editor, container, template, data);
            if (idx == null && container.selectedBlock != null) {
                idx = container.blocks.indexOf(container.selectedBlock) + 1;
            }
            if (idx != null) {
                container.blocks[idx - 1].$editor.after(block.$editor);
                container.blocks.splice(idx, 0, block);
                container.selectedBlock = block;
            }
            else {
                container.$el.append(block.$editor);
                container.blocks.push(block);
            }
            container.selectedBlock = block;
            $('html, body').animate({
                scrollTop: block.$editor.offset().top
            }, 'fast');
        };
        Container.prototype.deleteBlock = function (block) {
            var idx = this.blocks.indexOf(block);
            this.blocks.splice(idx, 1);
            block.$editor.remove();
            block = null;
            this.selectedBlock = null;
        };
        Container.prototype.moveBlock = function (block, offset) {
            var idx = this.blocks.indexOf(block);
            var new_idx = idx + offset;
            if (new_idx < this.blocks.length && new_idx >= 0) {
                var $anchorBlock = this.blocks[new_idx].$editor;
                if (offset > 0) {
                    $anchorBlock.after(block.$editor);
                }
                else if (offset < 0) {
                    $anchorBlock.before(block.$editor);
                }
                this.blocks.splice(idx, 1);
                this.blocks.splice(new_idx, 0, block);
            }
        };
        Container.prototype.copyBlock = function (block) {
            block.selectBlock();
            var idx = this.blocks.indexOf(block) + 1;
            this.addBlock(block.template, block.getData().fields, idx);
        };
        return Container;
    }());
    BrickyEditor.Container = Container;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Editor = (function (_super) {
        __extends(Editor, _super);
        function Editor($el, options) {
            var _this = _super.call(this, $el) || this;
            _this.compactTools = null;
            var editor = _this;
            _this.options = new BrickyEditor.EditorOptions(options);
            editor
                .loadTemplatesAsync()
                .done(function () {
                editor.loadBlocks(editor.options.blocks);
                if (editor.options.onload) {
                    editor.options.onload(editor);
                }
            });
            return _this;
        }
        Object.defineProperty(Editor.prototype, "isMobile", {
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
                        this.$tools.addClass(BrickyEditor.Constants.classMobile);
                    }
                    else {
                        this.$tools.removeClass(BrickyEditor.Constants.classMobile);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Editor.prototype.loadTemplatesAsync = function () {
            var result = $.Deferred();
            var editor = this;
            var tasks = [];
            tasks.push(BrickyEditor.Services.TemplateService
                .loadTemplatesAsync(editor.options.templatesFolder)
                .done(function () { })
                .fail(function (err) {
                console.log("Templates loading error");
                result.reject();
            }));
            tasks.push(BrickyEditor.Services.TemplateService
                .loadTemplateAsync(editor.options.templatesBaseFolder, BrickyEditor.Constants.templateModalKey)
                .done(function (html) {
                var modal = new BrickyEditor.Modal(html);
                editor.modal = modal;
                editor.$el.append(modal.$control);
            })
                .fail(function (err) {
                console.log("Modal loading error");
                result.reject();
            }));
            BrickyEditor.Services.TemplateService
                .loadTemplateAsync(editor.options.templatesBaseFolder, BrickyEditor.Constants.templateToolsKey)
                .done(function (html) {
                editor.$tools = $(html);
                var toolsBtn = "<button class='brickyeditor-tools-show-btn'><i class='fa fa-cog'></i></button>";
                editor.$toolsBtn = $(toolsBtn);
                editor.$toolsBtn.on('click', function () {
                    editor.modal.showModal(editor.$tools.clone(true));
                });
            })
                .fail(function (err) {
                console.log("Tools loading error");
                result.reject();
            });
            BrickyEditor.Services.TemplateService
                .loadTemplateAsync(editor.options.templatesBaseFolder, BrickyEditor.Constants.templateHtmlToolsKey)
                .done(function (html) {
                var htmlTools = new BrickyEditor.HtmlTools(html, editor);
                editor.htmlTools = htmlTools;
                editor.$el.append(htmlTools.$control);
            })
                .fail(function (err) {
                console.log("Html Tools loading error");
                result.reject();
            });
            $.when
                .apply($, tasks)
                .then(function () {
                editor.addTools();
                $(window).resize(function () { return editor.checkIsCompactTools(editor); });
                result.resolve();
            });
            return result;
        };
        Editor.prototype.addTools = function () {
            var editor = this;
            var categories = new Array();
            var $templates = $(BrickyEditor.Constants.selectorTemplates, editor.$tools);
            $templates.hide();
            editor.$el.append(editor.$tools);
            editor.$el.append(editor.$toolsBtn);
            editor.checkIsCompactTools(editor);
            for (var templateName in BrickyEditor.Services.TemplateService.templates) {
                var block = new BrickyEditor.Block(null, null, templateName);
                var template = BrickyEditor.Services.TemplateService.templates[templateName];
                var $template = $("<div class='template m-1 p-1' data-bricky-template=\"" + templateName + "\">" + block.getHtml(true) + "</div>");
                $templates.append($template);
                if (template.category) {
                    template.category.forEach(function (category) {
                        var exists = categories.some(function (c) {
                            return c.breEqualsInvariant(category);
                        });
                        if (!exists) {
                            categories.push(category);
                        }
                    });
                }
            }
            $(BrickyEditor.Constants.selectorTemplate, $templates)
                .on('click', function () {
                var template = $(this).data().brickyTemplate;
                editor.addBlock(template);
            });
            $(BrickyEditor.Constants.selectorLoader, editor.$tools)
                .fadeOut('slow', function () {
                $templates.fadeIn('fast');
            });
            var $hideBtn = $('[data-brickyeditor-hide-tools]', editor.$tools);
            $hideBtn.on('click', function () {
                if ($hideBtn.attr("data-brickyeditor-hide-tools")) {
                    if (editor.isMobile) {
                        editor.$tools.hide();
                        editor.$toolsBtn.show();
                    }
                    else {
                        editor.$tools.animate({ right: '-204px' }, 'fast');
                        $hideBtn.removeAttr("data-brickyeditor-hide-tools");
                        $hideBtn.toggleClass("fa-arrow-left").toggleClass("fa-arrow-right");
                    }
                }
                else {
                    if (editor.isMobile) {
                    }
                    else {
                        editor.$tools.animate({ right: '0px' }, 'fast');
                        $hideBtn.attr("data-brickyeditor-hide-tools", "true");
                        $hideBtn.toggleClass("fa-arrow-left").toggleClass("fa-arrow-right");
                    }
                }
            });
        };
        Editor.prototype.checkIsCompactTools = function (editor) {
            if (editor.compactTools == null) {
                var offset = (window.innerWidth - editor.$el.width()) / 2 - editor.$tools.width();
                editor.isMobile = offset <= 0;
            }
            else {
                editor.isMobile = editor.compactTools;
            }
        };
        return Editor;
    }(BrickyEditor.Container));
    BrickyEditor.Editor = Editor;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var EditorOptions = (function () {
        function EditorOptions(options) {
            this.templatesBaseFolder = "templates";
            this.templatesFolder = "templates/bootstrap4";
            this.compactTools = null;
            this.templatesBaseFolder = options.templatesBaseFolder || this.templatesBaseFolder;
            this.templatesFolder = options.templatesFolder || this.templatesFolder;
            this.onload = options.onload;
            this.blocks = options.blocks;
            this.compactTools = options.compactTools;
        }
        return EditorOptions;
    }());
    BrickyEditor.EditorOptions = EditorOptions;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var HtmlTools = (function () {
        function HtmlTools(html, editor) {
            var tools = this;
            tools.$control = $(html);
            $(BrickyEditor.Constants.selectorHtmlToolsCommand, this.$control)
                .on("click", function () {
                var $command = $(this);
                var selection = window.getSelection();
                var range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
                if ($command.is(BrickyEditor.Constants.selectorHtmlToolsCommandRange) && !range)
                    return;
                var command = $command.data().brickyeditorDocCommand;
                if (command == 'CreateLink') {
                    editor.modal.promptAsync(tools.getLinkPromptParams(selection))
                        .done(function (fields) {
                        selection = window.getSelection();
                        selection.addRange(range);
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
                    })
                        .fail(function () {
                        selection = window.getSelection();
                        selection.addRange(range);
                    });
                }
                else {
                    document.execCommand(command);
                }
                return false;
            });
        }
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
(function ($) {
    $.fn.brickyeditor = function (options) {
        var editor = new BrickyEditor.Editor($(this), options);
        return editor;
    };
}(jQuery));
(function ($) {
    $.fn.showLinkLocation = function () {
        this.filter("a").append(function () {
            return " (" + this.href + ")";
        });
        return this;
    };
}(jQuery));
var BrickyEditor;
(function (BrickyEditor) {
    var Modal = (function () {
        function Modal(html) {
            var modal = this;
            this.$control = $(html);
            this.$content = $(BrickyEditor.Constants.selectorModalContent, this.$control);
            $(BrickyEditor.Constants.selectorModalClose, this.$control)
                .on('click', function () {
                modal.hideModal();
            });
        }
        Modal.prototype.hideModal = function () {
            var $content = this.$content;
            this.$control.fadeOut(function () {
                $content.html('');
            });
        };
        Modal.prototype.showModal = function ($html) {
            this.$content.append($html);
            if (!$html.is(':visible')) {
                $html.show();
            }
            this.$control.fadeIn();
        };
        Modal.prototype.promptAsync = function (fields) {
            var result = $.Deferred();
            var modal = this;
            var $form = $('<form></form>');
            fields.forEach(function (field) {
                $form.append(field.$control);
            });
            var $ok = $('<button type="button" class="btn btn-ok m-r-1">Ok</button>');
            $ok.on('click', function () {
                fields.forEach(function (field) { return field.parseValue(); });
                modal.hideModal();
                result.resolve(new BrickyEditor.Prompt.PromptParameterList(fields));
            });
            var $cancel = $('<button type="button" class="btn btn-cancel">Cancel</button>');
            $cancel.on('click', function () {
                modal.hideModal();
                result.reject(fields);
            });
            $form.append($ok);
            $form.append($cancel);
            modal.showModal($form);
            return result;
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
    var Template = (function () {
        function Template(data) {
            this.title = data.title;
            this.file = data.file;
            this.category = data.cactegory || [];
        }
        return Template;
    }());
    BrickyEditor.Template = Template;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Fields;
    (function (Fields) {
        var BaseField = (function () {
            function BaseField(block, $field, data) {
                this.block = block;
                this.$field = $field;
                this.name = BrickyEditor.Services.TemplateService.getFieldValue($field, "name");
                this.type = BrickyEditor.Services.TemplateService.getFieldValue($field, "type");
                this.data = data || {};
                this.bind();
            }
            Object.defineProperty(BaseField.prototype, "data", {
                get: function () {
                    return this._data;
                },
                set: function (v) {
                    this._data = v;
                },
                enumerable: true,
                configurable: true
            });
            BaseField.getField = function (block, $el, data) {
                var type = BrickyEditor.Services.TemplateService.getFieldValue($el, "type");
                var fieldClass = this.fields[type];
                if (fieldClass) {
                    return fieldClass(block, $el, data);
                }
                else {
                    throw type + " field not found";
                }
            };
            BaseField.prototype.bind = function () { };
            BaseField.prototype.selectBlock = function (container) {
                this.block.container.selectedBlock.selectBlock(this, container);
            };
            BaseField.prototype.getData = function () {
                return {
                    type: this.type,
                    name: this.name,
                    data: this.data
                };
            };
            return BaseField;
        }());
        BaseField.fields = {
            'html': function (block, $el, data) { return new Fields.HtmlField(block, $el, data); },
            'image': function (block, $el, data) { return new Fields.ImageField(block, $el, data); },
            'embed': function (block, $el, data) { return new Fields.EmbedField(block, $el, data); },
            'container': function (block, $el, data) { return new Fields.ContainerField(block, $el, data); }
        };
        Fields.BaseField = BaseField;
    })(Fields = BrickyEditor.Fields || (BrickyEditor.Fields = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Fields;
    (function (Fields) {
        var ContainerField = (function (_super) {
            __extends(ContainerField, _super);
            function ContainerField(block, $field, data) {
                var _this = _super.call(this, block, $field, data) || this;
                debugger;
                _this.container = new BrickyEditor.Container($field, _this.block.editor);
                return _this;
            }
            Object.defineProperty(ContainerField.prototype, "data", {
                get: function () {
                    return this.container ? this.container.getData() : {};
                },
                set: function (v) {
                    this._data = v;
                },
                enumerable: true,
                configurable: true
            });
            ContainerField.prototype.bind = function () {
                var field = this;
                var $field = this.$field;
                var data = this.data;
                $field.on('click', function () {
                    field.selectBlock(field.container);
                });
            };
            ContainerField.prototype.select = function () {
                this.$field.addClass('selected');
            };
            ContainerField.prototype.deselect = function () {
                this.$field.removeClass('selected');
            };
            return ContainerField;
        }(Fields.BaseField));
        Fields.ContainerField = ContainerField;
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
            EmbedField.prototype.bind = function () {
                var field = this;
                var $field = this.$field;
                var data = this.data;
                $field.on('click', function () {
                    var url = prompt('Link to embed', 'http://instagr.am/p/fA9uwTtkSN/');
                    BrickyEditor.Services.EmbedService
                        .getEmbedAsync(url)
                        .done(function (json) {
                        field.data.url = url;
                        field.data.embed = json;
                        var $embed = $(json.html);
                        var $script = $embed.filter('script');
                        if ($script.length > 0) {
                            $script.remove();
                            var scriptSrc = $script.attr('src');
                            if (scriptSrc.breStartsWith('//')) {
                                scriptSrc = "http:" + scriptSrc;
                                $.getScript(scriptSrc)
                                    .done(function (script) {
                                    if (scriptSrc.breContains('instgram') && instgrm) {
                                        instgrm.Embeds.process();
                                    }
                                })
                                    .fail(function (err) { });
                            }
                        }
                        $field.replaceWith($embed);
                        field.selectBlock();
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
                var data = this.data;
                if (!$field.is('[contenteditable]')) {
                    $field.attr('contenteditable', 'true');
                }
                this.data.html =
                    this.data.html ||
                        BrickyEditor.Services.TemplateService.getFieldValue($field, 'html') ||
                        BrickyEditor.Constants.dummyText;
                $field.html(this.data.html);
                $field.on('focus', function () {
                    _this.selectBlock();
                });
                $field.on('blur keyup paste input', function () {
                    data.html = $(this).html().trim();
                });
                $field.on('paste', function (e) {
                    var ev = e.originalEvent;
                    var text = ev.clipboardData.getData('text/html');
                    if (text) {
                        var $temp = $("<div></div>");
                        var $text = $(text);
                        $text.removeAttr("style");
                        $temp.append($text);
                        ev.clipboardData.setData('text/html', $temp.html());
                    }
                });
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
                if (!this.data.src) {
                    this.data.src = BrickyEditor.Services.TemplateService.getFieldValue($field, 'src');
                }
                $field.attr("src", this.data.src);
                $field.on('click', function () {
                    field.block.editor.modal.promptAsync(field.getPromptParams())
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
                    this.$field.attr("src", this.data.src);
                }
            };
            ImageField.prototype.setAlt = function (alt) {
                this.data.alt = alt;
                this.$field.attr("alt", this.data.alt);
            };
            ImageField.prototype.setFile = function (file) {
                this.data.file = file;
                if (file) {
                    this.$field.attr("src", this.data.file.fileContent);
                }
            };
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
                            $("<div class=\"brickyeditor-prompt-field\">\n                        <label for=\"" + this.key + "\">" + (this.title ? this.title : '') + "</label>\n                        </div>");
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
                return $("<input type=\"text\" id=\"" + this.key + "\" class=\"brickyeditor-input\" placeholder=\"" + this.placeholder + "\" value=\"" + (this.value ? this.value : '') + "\">");
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
                var $editor = $("\n                <div class='brickyeditor-image-input'>\n                    <label for=\"" + this.key + "\">\n                        <img src=\"" + img + "\"/>\n                    </label>                        \n                    <input type=\"file\" id=\"" + this.key + "\" class=\"brickyeditor-input\" placeholder=\"" + this.placeholder + "\">\n                </div>\n                <small class='brickyeditor-image-input-filename'></small>");
                var $file = $('input', $editor);
                var $filePreview = $('img', $editor);
                var $fileName = $('.brickyeditor-image-input-filename', $editor);
                var value = this.value;
                if (value) {
                    $filePreview.attr("src", value.fileContent);
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
                            $filePreview.attr("src", field._value.fileContent);
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
            TemplateService.loadTemplateAsync = function (folder, template) {
                TemplateService.templates = [];
                var task = $.Deferred();
                $.get(TemplateService.getTemplateUrl(folder, template))
                    .done(function (html) {
                    task.resolve(html);
                })
                    .fail(function (err) {
                    task.reject(err);
                });
                return task;
            };
            TemplateService.loadTemplateConfigAsync = function (folder) {
                var task = $.Deferred();
                $.getJSON(TemplateService.getTemplatesConfigUrl(folder))
                    .done(function (json) {
                    task.resolve(json);
                })
                    .fail(function (e) {
                    console.log(e);
                    task.reject(e);
                });
                return task;
            };
            TemplateService.filteredTemplates = function (filter) {
                TemplateService.templates.map(function (el) {
                    el.category.filter(function (c) {
                        c.toLowerCase() === filter.toLowerCase();
                    });
                });
            };
            TemplateService.loadTemplatesAsync = function (folder) {
                var result = $.Deferred();
                TemplateService.loadTemplateConfigAsync(folder)
                    .done(function (result) {
                    result.forEach(function (t) {
                        TemplateService.templates.push(new BrickyEditor.Template(t));
                    });
                })
                    .fail(function (e) {
                    console.log(e);
                })
                    .then(function () {
                    var tasks = [];
                    TemplateService.templates.forEach(function (t) {
                        var task = TemplateService
                            .loadTemplateAsync(folder, t.file)
                            .done(function (html) {
                            t.html = html;
                            TemplateService.templates[t.file] = t;
                        })
                            .fail(function (err) {
                            console.log(err);
                        });
                        tasks.push(task);
                    });
                    $.when.apply($, tasks).then(function () {
                        result.resolve();
                    });
                });
                return result;
            };
            TemplateService.getTemplateUrl = function (folder, template) {
                return folder + "/" + template + ".html";
            };
            TemplateService.getTemplatesConfigUrl = function (folder) {
                return folder + "/templates.json";
            };
            TemplateService.getTemplate = function (name) {
                return TemplateService.templates[name];
            };
            TemplateService.removeTemplate = function (name) {
                delete TemplateService.templates[name];
            };
            TemplateService.getFieldValue = function ($el, prop) {
                return $el.attr("data-bricky-field-" + prop);
            };
            return TemplateService;
        }());
        Services.TemplateService = TemplateService;
    })(Services = BrickyEditor.Services || (BrickyEditor.Services = {}));
})(BrickyEditor || (BrickyEditor = {}));
