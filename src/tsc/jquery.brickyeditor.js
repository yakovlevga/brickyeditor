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
        function Block(editor, templateName, data) {
            this.fields = [];
            var block = this;
            this.editor = editor;
            this.template = templateName;
            var template = BrickyEditor.TemplateService.getTemplate(templateName);
            var $editor = $(template.html);
            this.$editor = $editor;
            this.bindEditorFields(data);
        }
        Block.prototype.showControls = function ($blockEditor) {
        };
        Block.prototype.bindEditorFields = function (data) {
            var block = this;
            this.$editor
                .find(BrickyEditor.Constants.selectorField)
                .addBack(BrickyEditor.Constants.selectorField)
                .each(function () {
                var $field = $(this);
                var fieldName = BrickyEditor.TemplateService.getFieldValue($field, "name");
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
        Block.prototype.getHtml = function (trim) {
            var $html = this.$editor.clone();
            $html
                .find(BrickyEditor.Constants.selectorField)
                .addBack(BrickyEditor.Constants.selectorField)
                .each(function (idx, el) {
                var attrsToRemove = BrickyEditor.Common.propsFilterKeys(el.attributes, function (key, value) {
                    return BrickyEditor.Common.stringStartsWith(key, BrickyEditor.Constants.field);
                }, 'contenteditable');
                attrsToRemove.forEach(function (attr) {
                    el.removeAttribute(attr);
                });
            });
            var html = $html[0].outerHTML;
            return trim ? BrickyEditor.Common.totalTrim(html) : html;
        };
        return Block;
    }());
    BrickyEditor.Block = Block;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Common = (function () {
        function Common() {
        }
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
        Common.arrayFilter = function (array, filter, payload) {
            var result = [];
            Common.arrayEach(array, function (element) {
                if (filter(element)) {
                    result.push(element);
                }
            });
            if (payload) {
                result.push(payload);
            }
            return result;
        };
        Common.arrayFind = function (array, filter) {
            Common.arrayEach(array, function (element) {
                if (filter(element)) {
                    return element;
                }
            });
            return null;
        };
        Common.arrayFindByField = function (array, fieldName, fieldValue) {
            Common.arrayEach(array, function (element) {
                if (element.hasOwnProperty(fieldName) &&
                    element[fieldName] === fieldValue) {
                    return element;
                }
            });
            return null;
        };
        Common.arrayMap = function (array, map) {
            var result = [];
            Common.arrayEach(array, function (element) {
                result.push(map(element));
            });
            return result;
        };
        Common.arrayAny = function (array, filter) {
            var result = false;
            for (var i = 0; i < array.length; i++) {
                var element = array[i];
                if (filter(element)) {
                    result = true;
                    break;
                }
            }
            return result;
        };
        Common.arrayEach = function (array, func) {
            for (var i = 0; i < array.length; i++) {
                var element = array[i];
                func(element);
            }
        };
        Common.totalTrim = function (s) {
            return s ? s.replace(/\s\s+/g, ' ').trim() : "";
        };
        Common.stringEqualsInvariant = function (s1, s2) {
            return s1.toLowerCase() === s2.toLowerCase();
        };
        Common.stringStartsWith = function (s, part) {
            return s.indexOf(part) === 0;
        };
        Common.stringContains = function (s, part) {
            return s.indexOf(part) >= 0;
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
    Constants.selectorTemplates = '.templates';
    Constants.selectorCancel = ".brickyeditor-cancel";
    Constants.selectorSave = ".brickyeditor-save";
    Constants.selectorField = "[" + Constants.field + "]";
    Constants.dummyText = "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue.";
    BrickyEditor.Constants = Constants;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Editor = (function () {
        function Editor($el, onload, blocks) {
            this.blocks = [];
            this.options = new BrickyEditor.EditorOptions();
            var editor = this;
            this.$el = $el;
            this
                .loadTemplatesAsync()
                .done(function () {
                blocks.forEach(function (block) {
                    editor.addBlock(block.template, block.fields);
                });
                if (onload) {
                    onload(editor);
                }
            });
        }
        Editor.prototype.loadTemplatesAsync = function () {
            var result = $.Deferred();
            var editor = this;
            var tasks = [];
            tasks.push(BrickyEditor.TemplateService
                .loadTemplatesAsync(editor.options.templatesFolder)
                .done(function () { })
                .fail(function (err) {
                console.log("Templates loading error");
                result.reject();
            }));
            tasks.push(BrickyEditor.TemplateService
                .loadTemplateAsync(editor.options.templatesBaseFolder, BrickyEditor.Constants.templateModalKey)
                .done(function (html) {
                editor.addModal(html);
            })
                .fail(function (err) {
                console.log("Modal loading error");
                result.reject();
            }));
            BrickyEditor.TemplateService
                .loadTemplateAsync(editor.options.templatesBaseFolder, BrickyEditor.Constants.templateToolsKey)
                .done(function (html) {
                editor.$tools = $(html);
            })
                .fail(function (err) {
                console.log("Tools loading error");
                result.reject();
            });
            BrickyEditor.TemplateService
                .loadTemplateAsync(editor.options.templatesBaseFolder, BrickyEditor.Constants.templateHtmlToolsKey)
                .done(function (html) {
                editor.$htmlTools = $(html);
            })
                .fail(function (err) {
                console.log("Html Tools loading error");
                result.reject();
            });
            $.when
                .apply($, tasks)
                .then(function () {
                editor.addTools();
                result.resolve();
            });
            return result;
        };
        Editor.prototype.showModal = function ($content) {
            var modalContent = this.$modal.find(BrickyEditor.Constants.selectorModalContent);
            modalContent.append($content);
            this.$modal.fadeIn();
        };
        Editor.prototype.hideModal = function () {
            var modalContent = this.$modal.find(BrickyEditor.Constants.selectorModalContent);
            this.$modal.fadeOut(function () {
                modalContent.html("");
            });
        };
        Editor.prototype.addModal = function (html) {
            var editor = this;
            editor.$modal = $(html);
            editor.$el.append(editor.$modal);
            editor.$modal.find('.brickyeditor-modal-close a')
                .on('click', function () {
                editor.hideModal();
            });
        };
        Editor.prototype.promptAsync = function (fields) {
            var result = $.Deferred();
            var editor = this;
            var $form = $('<form></form>');
            BrickyEditor.Common.propsEach(fields, function (name, f) {
                f.placeholder = f.placeholder ? f.placeholder : "";
                f.value = f.value ? f.value : "";
                var fieldEditor;
                if (f.options) {
                    var fieldEditorOptions = BrickyEditor.Common.arrayMap(f.options, function (opt) {
                        return "<option value=\"" + opt.value + "\" " + (opt.selected ? "selected" : "") + ">" + (opt.name ? opt.name : opt.value) + "</option>";
                    });
                    fieldEditor = "<select type=\"text\" id=\"" + name + "\" class=\"brickyeditor-input\" placeholder=\"" + f.placeholder + "\">" + fieldEditorOptions + "</select>";
                }
                else {
                    fieldEditor = "<input type=\"text\" id=\"" + name + "\" class=\"brickyeditor-input\" placeholder=\"" + f.placeholder + "\" value=\"" + f.value + "\">";
                }
                var $field = $("\n                <div class=\"brickyeditor-prompt-field\">\n                    <label for=\"" + name + "\">" + f.title + "</label>\n                    " + fieldEditor + "\n                </div>");
                f.$field = $field;
                $form.append($field);
            });
            var $ok = $('<button type="button" class="brickyeditor-btn brickyeditor-btn-ok brickyeditor-mr">ok</button>');
            $ok.on('click', function () {
                BrickyEditor.Common.propsEach(fields, function (name, f) {
                    var $fieldInput = $('.brickyeditor-input', f.$field);
                    f.value = $fieldInput.is('select') ?
                        $fieldInput.find("option:selected").val() :
                        $fieldInput.val();
                    f.$field = null;
                    delete f.$field;
                });
                editor.hideModal();
                result.resolve(fields);
            });
            var $cancel = $('<button type="button" class="brickyeditor-btn brickyeditor-btn-cancel">cancel</button>');
            $cancel.on('click', function () {
                editor.hideModal();
                result.reject(fields);
            });
            $form.append($ok);
            $form.append($cancel);
            editor.showModal($form);
            return result;
        };
        Editor.prototype.addTools = function () {
            var editor = this;
            var categories = new Array();
            var $templates = $(BrickyEditor.Constants.selectorTemplates, editor.$tools);
            $templates.hide();
            editor.$el.append(editor.$tools);
            for (var templateName in BrickyEditor.TemplateService.templates) {
                var block = new BrickyEditor.Block(null, templateName);
                var template = BrickyEditor.TemplateService.templates[templateName];
                var $template = $("<div class='template m-r-1 m-b-1 m-l-1 p-1' data-bricky-template=\"" + templateName + "\">" + block.getHtml(true) + "</div>");
                $templates.append($template);
                BrickyEditor.Common.arrayEach(template.category, function (category) {
                    var exists = BrickyEditor.Common.arrayAny(categories, function (x) {
                        return BrickyEditor.Common.stringEqualsInvariant(x, category);
                    });
                    if (!exists) {
                        categories.push(category);
                    }
                });
            }
            $('.bricky-loader', editor.$tools)
                .fadeOut('fast', function () {
                $templates.fadeIn();
            });
            var $hideBtn = $('[data-brickyeditor-hide-tools]', editor.$tools);
            $hideBtn.on('click', function () {
                if ($hideBtn.attr("data-brickyeditor-hide-tools")) {
                    editor.$tools.animate({ right: '-204px' }, 'fast');
                    $hideBtn.removeAttr("data-brickyeditor-hide-tools");
                }
                else {
                    editor.$tools.animate({ right: '0px' }, 'fast');
                    $hideBtn.attr("data-brickyeditor-hide-tools", "true");
                }
                $hideBtn.toggleClass("fa-arrow-left").toggleClass("fa-arrow-right");
            });
            editor.$filter = $(".bricky-templates-filter", editor.$tools);
            editor.$filter.append('<div>all</div>');
            categories.forEach(function (category) {
                editor.$filter.append("<div>" + category + "</div>");
            });
            $templates
                .find('.bricky-template')
                .on('click', function () {
                var template = $(this).data().brickyTemplate;
                editor.addBlock(template);
            });
            var $commands = $("[data-brickyeditor-doc-command]", editor.$htmlTools);
            $commands.on("click", function () {
                var selection = window.getSelection();
                var range = selection.getRangeAt(0);
                var command = $(this).data().brickyeditorDocCommand;
                if (command == 'CreateLink') {
                    editor.promptAsync({
                        'href': { title: 'Url', placeholder: 'Url' },
                        'title': { title: 'Title' },
                        'target': { title: 'Target', options: [
                                { name: '', value: '' },
                                { name: 'Blank', value: '_blank' },
                                { name: 'Self', value: '_self' },
                                { name: 'Parent', value: '_parent' },
                                { name: 'Top', value: '_top' }
                            ] }
                    })
                        .done(function (settings) {
                        selection = window.getSelection();
                        selection.addRange(range);
                        document.execCommand(command, false, settings.href.value);
                        selection.anchorNode.parentElement.setAttribute('target', settings.target.value);
                        selection.anchorNode.parentElement.setAttribute('title', settings.title.value);
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
            editor.$el.append(editor.$htmlTools);
        };
        Editor.prototype.addBlock = function (template, data) {
            var block = new BrickyEditor.Block(this, template, data);
            var blockTools = "<div class='brickyeditor-block-tools'>\n                <div class='brickyeditor-icon brickyeditor-icon-x'></div>\n                <div class='brickyeditor-icon brickyeditor-icon-cog'></div>\n                <div class='brickyeditor-icon brickyeditor-icon-up'></div>\n                <div class='brickyeditor-icon brickyeditor-icon-down'></div>\n            </div>";
            this.$el.append(blockTools);
            this.$el.append(block.$editor);
            this.blocks.push(block);
        };
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
        return Editor;
    }());
    BrickyEditor.Editor = Editor;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var EditorOptions = (function () {
        function EditorOptions() {
            this.templatesBaseFolder = "templates";
            this.templatesFolder = "templates/bootstrap4";
        }
        return EditorOptions;
    }());
    BrickyEditor.EditorOptions = EditorOptions;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
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
    BrickyEditor.EmbedService = EmbedService;
})(BrickyEditor || (BrickyEditor = {}));
(function ($) {
    $.fn.brickyeditor = function (options) {
        var editor = new BrickyEditor.Editor($(this), options.onload, options.blocks);
        return editor;
    };
})(jQuery);
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
    var TemplateService = (function () {
        function TemplateService() {
        }
        TemplateService.loadTemplateAsync = function (folder, template) {
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
                .fail(function (err) {
                task.reject(err);
            });
            return task;
        };
        TemplateService.filteredTemplates = function (filter) {
            return BrickyEditor.Common.arrayMap(TemplateService.templates, function (el) {
                return BrickyEditor.Common.arrayAny(el.category, function (category) {
                    category.toLowerCase() === filter.toLowerCase();
                });
            });
        };
        TemplateService.loadTemplatesAsync = function (folder) {
            var result = $.Deferred();
            var templates;
            TemplateService.loadTemplateConfigAsync(folder)
                .done(function (result) {
                templates = result;
            })
                .then(function () {
                var tasks = [];
                templates.forEach(function (t) {
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
    TemplateService.templates = {};
    BrickyEditor.TemplateService = TemplateService;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Fields;
    (function (Fields) {
        var BaseField = (function () {
            function BaseField(block, $field, data) {
                this.block = block;
                this.$field = $field;
                this.name = BrickyEditor.TemplateService.getFieldValue($field, "name");
                this.type = BrickyEditor.TemplateService.getFieldValue($field, "type");
                this.data = data || {};
                this.bind();
            }
            BaseField.getField = function (block, $el, data) {
                var type = BrickyEditor.TemplateService.getFieldValue($el, "type");
                switch (type) {
                    case 'html':
                        return new Fields.HtmlField(block, $el, data);
                    case 'image':
                        return new Fields.ImageField(block, $el, data);
                    case 'embed':
                        return new Fields.EmbedField(block, $el, data);
                    default:
                        throw type + " field not found";
                }
            };
            BaseField.prototype.bind = function () { };
            BaseField.prototype.getData = function () {
                return {
                    type: this.type,
                    name: this.name,
                    data: this.data
                };
            };
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
            EmbedField.prototype.bind = function () {
                var field = this;
                var $field = this.$field;
                var data = this.data;
                $field.on('click', function () {
                    var url = prompt('Link to embed', 'http://instagr.am/p/fA9uwTtkSN/');
                    BrickyEditor.EmbedService
                        .getEmbedAsync(url)
                        .done(function (json) {
                        field.data.url = url;
                        field.data.embed = json;
                        var $embed = $(json.html);
                        var $script = $embed.filter('script');
                        if ($script.length > 0) {
                            $script.remove();
                            var scriptSrc = $script.attr('src');
                            if (BrickyEditor.Common.stringStartsWith(scriptSrc, '//')) {
                                scriptSrc = "http:" + scriptSrc;
                                $.getScript(scriptSrc)
                                    .done(function (script) {
                                    if (BrickyEditor.Common.stringContains(scriptSrc, 'instgram') && instgrm) {
                                        instgrm.Embeds.process();
                                    }
                                })
                                    .fail(function (err) { });
                            }
                        }
                        $field.replaceWith($embed);
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
                var $field = this.$field;
                var data = this.data;
                if (!$field.is('[contenteditable]')) {
                    $field.attr('contenteditable', 'true');
                }
                this.data.html =
                    this.data.html ||
                        BrickyEditor.TemplateService.getFieldValue($field, 'html') ||
                        BrickyEditor.Constants.dummyText;
                $field.html(this.data.html);
                this.$field.on('blur keyup paste input', function () {
                    data.html = $(this).html().trim();
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
                    this.data.src = BrickyEditor.TemplateService.getFieldValue($field, 'src');
                }
                $field.attr("src", this.data.src);
                $field.on('click', function () {
                    BrickyEditor.TemplateService
                        .loadTemplateAsync(field.block.editor.options.templatesFolder, "imageModal")
                        .done(function (html) {
                        var $form = $(html);
                        if (field.data.src) {
                            $form.find("#src").val(data.src);
                        }
                        if (field.data.alt) {
                            $form.find("#alt").val(data.alt);
                        }
                        $form
                            .find(BrickyEditor.Constants.selectorSave)
                            .on("click", function () {
                            field.setSrc($form.find("#src").val());
                            field.setAlt($form.find("#alt").val());
                            field.block.editor.hideModal();
                        });
                        $form
                            .find(BrickyEditor.Constants.selectorCancel)
                            .on("click", function () {
                            field.block.editor.hideModal();
                        });
                        field.block.editor.showModal($form);
                    })
                        .fail(function (err) {
                        console.log("ImageField modal editor loading error");
                    });
                });
            };
            ImageField.prototype.setSrc = function (src) {
                var field = this;
                field.data.src = src;
                field.$field.attr("src", field.data.src);
            };
            ImageField.prototype.setAlt = function (alt) {
                var field = this;
                field.data.alt = alt;
                field.$field.attr("alt", field.data.alt);
            };
            return ImageField;
        }(Fields.BaseField));
        Fields.ImageField = ImageField;
    })(Fields = BrickyEditor.Fields || (BrickyEditor.Fields = {}));
})(BrickyEditor || (BrickyEditor = {}));
