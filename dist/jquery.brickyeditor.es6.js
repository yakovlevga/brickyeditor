var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    class Common {
        static getSelectedText() {
            let text = "";
            let doc = document;
            if (window.getSelection) {
                text = window.getSelection().toString();
            }
            else if (doc.selection && doc.selection.type != "Control") {
                text = doc.selection.createRange().text;
            }
            return text;
        }
        static propsEach(obj, func) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var value = obj[key];
                    func(key, value);
                }
            }
        }
        static propsFilterKeys(obj, filter, payload) {
            let result = [];
            Common.propsEach(obj, (key, value) => {
                if (filter(key, value)) {
                    result.push(key);
                }
            });
            if (payload) {
                result.push(payload);
            }
            return result;
        }
    }
    BrickyEditor.Common = Common;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    class Editor {
        constructor($editor, options) {
            this.blocks = [];
            this.compactTools = null;
            BrickyEditor.Fields.BaseField.registerCommonFields();
            this.$editor = $editor;
            this.$editor.addClass('bre-editor');
            this.options = new BrickyEditor.EditorOptions(options);
            Editor.UI = new BrickyEditor.UI(this);
        }
        get selectedBlockIndex() {
            if (this.selectedBlock) {
                return this.blocks.indexOf(this.selectedBlock);
            }
            return -1;
        }
        initAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                Editor.UI.toggleToolsLoader(true);
                const templates = yield BrickyEditor.Services.TemplateService.loadTemplatesAsync(this);
                Editor.UI.toggleToolsLoader(false);
                Editor.UI.setTemplates(templates);
                const blocks = yield this.tryLoadInitialBlocksAsync();
                this.loadBlocks(blocks);
                this.isLoaded = true;
                this.trigger(BrickyEditor.Events.onLoad, this);
            });
        }
        tryLoadInitialBlocksAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                const url = this.options.blocksUrl;
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    if (url) {
                        try {
                            const blocks = yield $.get(url);
                            resolve(blocks);
                        }
                        catch (error) {
                            console.log('Blocks file not found.');
                            reject(error);
                        }
                    }
                    else if (this.options.blocks) {
                        resolve(this.options.blocks);
                    }
                    else {
                        resolve(null);
                    }
                }));
            });
        }
        tryBindFormSubmit() {
            const editor = this;
            const $form = this.options.formSelector ? $(this.options.formSelector) : null;
            const $input = this.options.inputSelector ? $(this.options.inputSelector) : null;
            if (!$form || !$input || $form.length == 0 || $input.length == 0)
                return;
            $form.on('submit', () => {
                $input.val(JSON.stringify(editor.getData()));
                return true;
            });
        }
        bindFormSubmit() {
            const editor = this;
            const $form = this.options.formSelector ? $(this.options.formSelector) : null;
            const $input = this.options.inputSelector ? $(this.options.inputSelector) : null;
            if (!$form || !$input || $form.length == 0 || $input.length == 0)
                return;
            $form.on('submit', () => {
                $input.val(JSON.stringify(editor.getData()));
                return true;
            });
        }
        getData() {
            var blocksData = [];
            this.blocks.forEach(block => {
                blocksData.push(block.getData(this.options.ignoreHtml));
            });
            return blocksData;
        }
        getHtml() {
            var blocksData = [];
            this.blocks.forEach(block => {
                blocksData.push(block.getHtml(true));
            });
            return blocksData.join('\n');
        }
        loadBlocks(blocks) {
            if (blocks && blocks.length) {
                blocks.forEach(block => {
                    let template = BrickyEditor.Services.TemplateService.getTemplate(block.template);
                    if (template) {
                        this.addBlock(template, block.fields, null, false);
                    }
                    else {
                        console.log(`Template ${block.template} not found.`);
                    }
                });
            }
        }
        addBlock(template, data, idx, select = true) {
            const onUpdate = (block, property, oldValue, newValue) => {
                this.trigger(BrickyEditor.Events.onBlockUpdate, {
                    block: block,
                    property: property,
                    oldValue: oldValue,
                    newValue: newValue
                });
            };
            let block = new BrickyEditor.Block(template, false, data, block => this.deleteBlock(block), block => this.selectBlock(block), block => this.deselectBlock(block), block => this.copyBlock(block), (block, offset) => this.moveBlock(block, offset), onUpdate);
            this.insertBlock(block, idx);
            if (select) {
                block.select();
                block.scrollTo();
            }
        }
        insertBlock(block, idx) {
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
            if (this.isLoaded) {
                this.trigger(BrickyEditor.Events.onBlockAdd, { block: block, idx: idx });
                this.trigger(BrickyEditor.Events.onChange, { blocks: this.getData(), html: this.getHtml() });
            }
        }
        deleteBlock(block) {
            const idx = this.blocks.indexOf(block);
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
            this.trigger(BrickyEditor.Events.onBlockDelete, { block: block, idx: idx });
            this.trigger(BrickyEditor.Events.onChange, { blocks: this.getData(), html: this.getHtml() });
        }
        moveBlock(block, offset) {
            const idx = this.blocks.indexOf(block);
            const new_idx = idx + offset;
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
            this.trigger(BrickyEditor.Events.onBlockMove, { block: block, from: idx, to: new_idx });
            this.trigger(BrickyEditor.Events.onChange, { blocks: this.getData(), html: this.getHtml() });
            block.scrollTo();
        }
        copyBlock(block) {
            const idx = this.blocks.indexOf(block) + 1;
            const copy = this.addBlock(block.template, block.getData().fields, idx, true);
        }
        selectBlock(block) {
            if (this.selectedBlock === block)
                return;
            if (this.selectedBlock) {
                this.selectedBlock.deselect();
            }
            this.selectedBlock = block;
            this.trigger(BrickyEditor.Events.onBlockSelect, { block: block });
        }
        deselectBlock(block) {
            this.selectedBlock = null;
            this.trigger(BrickyEditor.Events.onBlockDeselect, { block: block });
        }
        trigger(event, data) {
            const editor = this;
            const $editor = this.$editor;
            $editor.trigger('bre.' + event, data);
            BrickyEditor.Common.propsEach(editor.options, (key, value) => {
                if (key.breEqualsInvariant(event) && value) {
                    value(data);
                }
            });
        }
    }
    BrickyEditor.Editor = Editor;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    class EditorOptions {
        constructor(options) {
            this.templatesUrl = "templates/bootstrap4.html";
            this.compactTools = null;
            this.compactToolsWidth = 768;
            this.ignoreHtml = null;
            this.htmlToolsButtons = null;
            this.templatesUrl = options.templatesUrl || this.templatesUrl;
            this.onLoad = options.onLoad || options.onload;
            this.onChange = options.onChange;
            this.onBlockAdd = options.onBlockAdd;
            this.onBlockDelete = options.onBlockDelete;
            this.onBlockMove = options.onBlockMove;
            this.onBlockSelect = options.onBlockSelect;
            this.onBlockDeselect = options.onBlockDeselect;
            this.onBlockUpdate = options.onBlockUpdate;
            this.blocksUrl = options.blocksUrl || null;
            this.blocks = options.blocks || null;
            this.compactTools = options.compactTools;
            this.ignoreHtml = options.ignoreHtml || false;
            this.htmlToolsButtons = options.htmlToolsButtons || null;
            this.formSelector = options.formSelector || null;
            this.inputSelector = options.inputSelector || null;
        }
    }
    BrickyEditor.EditorOptions = EditorOptions;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    class Events {
    }
    Events.onLoad = 'onLoad';
    Events.onChange = 'onChange';
    Events.onBlockAdd = 'onBlockAdd';
    Events.onBlockDelete = 'onBlockDelete';
    Events.onBlockMove = 'onBlockMove';
    Events.onBlockSelect = 'onBlockSelect';
    Events.onBlockDeselect = 'onBlockDeselect';
    Events.onBlockUpdate = 'onBlockUpdate';
    BrickyEditor.Events = Events;
})(BrickyEditor || (BrickyEditor = {}));
(function ($) {
    $.fn.brickyeditor = function (options) {
        let editor = new BrickyEditor.Editor($(this), options);
        editor.initAsync();
        return editor;
    };
}(jQuery));
var BrickyEditor;
(function (BrickyEditor) {
    class Template {
        constructor(el) {
            const previewSelector = '.bre-template-preview';
            let $template = $(el);
            let data = $template.data();
            this.name = data.name;
            this.category = data.cactegory || [];
            this.$html = $template.contents().not(previewSelector);
            this.$preview = $(previewSelector, $template).contents();
            if (!this.$preview.length) {
                let block = new BrickyEditor.Block(this, true);
                let blockEl = block.getHtml(true);
                this.$preview = $(blockEl);
            }
        }
        getPreview() {
            let $template = $(`<div class='bre-template'></div>`);
            $template.append(this.$preview);
            return $template;
        }
    }
    BrickyEditor.Template = Template;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    class Block {
        constructor(template, preview, data, onDelete, onSelect, onDeselect, onCopy, onMove, onUpdate) {
            this.template = template;
            this.onDelete = onDelete;
            this.onSelect = onSelect;
            this.onDeselect = onDeselect;
            this.onCopy = onCopy;
            this.onMove = onMove;
            this.onUpdate = onUpdate;
            this.fields = [];
            this.template = template;
            const block = this;
            const $block = template.$html.clone();
            block.bindFields($block, data);
            const actions = this.getActions();
            this.ui = new BrickyEditor.BlockUI($block, preview, actions, () => this.select());
        }
        bindFields($block, data) {
            const block = this;
            const $fields = $block
                .find(BrickyEditor.Selectors.selectorField)
                .addBack(BrickyEditor.Selectors.selectorField);
            $fields.each((idx, elem) => {
                const onUpdate = (property, oldValue, newValue) => {
                    if (this.onUpdate) {
                        this.onUpdate(block, property, oldValue, newValue);
                    }
                };
                let $field = $(elem);
                let field = BrickyEditor.Fields.BaseField.createField($field, data, () => block.select(), onUpdate);
                this.fields.push(field);
            });
        }
        getActions() {
            const block = this;
            let actions = [
                new BrickyEditor.BlockUIAction('ellipsis-h'),
                new BrickyEditor.BlockUIAction('trash-o', () => block.delete()),
                new BrickyEditor.BlockUIAction('copy', () => block.clone()),
                new BrickyEditor.BlockUIAction('angle-up', () => block.move(-1)),
                new BrickyEditor.BlockUIAction('angle-down', () => block.move(1))
            ];
            return actions;
        }
        delete() {
            this.ui.delete();
            this.onDelete(this);
        }
        move(offset) {
            this.onMove(this, offset);
        }
        clone() {
            this.onCopy(this);
        }
        select() {
            this.ui.toggleSelection(true);
            this.onSelect(this);
        }
        deselect() {
            this.ui.toggleSelection(false);
            this.onDeselect(this);
        }
        scrollTo() {
            var top = this.ui.$editor.offset().top - 100;
            top = top > 0 ? top : 0;
            $('html, body').animate({
                scrollTop: top
            }, 'fast');
        }
        getData(ignoreHtml) {
            let fieldsData = [];
            this.fields.forEach(field => {
                fieldsData.push(field.data);
            });
            let data = { template: this.template.name, fields: fieldsData };
            if (!ignoreHtml) {
                data['html'] = this.getHtml(true);
            }
            return data;
        }
        getHtml(trim, skipAttrRemoving = false) {
            let $html = this.ui.$block.clone(false, false)
                .wrap('<div></div>')
                .parent();
            $('.bre-temp-container', $html).each((idx, el) => {
                let $el = $(el);
                $el.replaceWith($el.children());
            });
            ['contenteditable', 'data-bre-field'].forEach((attr) => {
                $(`[${attr}]`, $html).each((idx, el) => {
                    el.removeAttribute(attr);
                });
            });
            return trim ? $html.html().breTotalTrim() : $html.html();
        }
    }
    BrickyEditor.Block = Block;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    class BlockAction {
        constructor(icon, action, title) {
            this.icon = icon;
            this.action = action;
            this.title = title;
        }
    }
    BrickyEditor.BlockAction = BlockAction;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    class BlockUI {
        constructor($block, preview, actions, onSelect) {
            this.$block = $block;
            this.onSelect = onSelect;
            if (!preview) {
                this.buildEditorUI(actions);
            }
        }
        delete() {
            this.$editor.remove();
        }
        toggleSelection(isOn) {
            this.$editor.toggleClass("bre-selected", isOn);
        }
        buildEditorUI(actions) {
            this.$tools = $('<div class="bre-block-tools bre-btn-deck"></div>');
            actions.forEach(action => {
                var $btn = this.buildButton(action);
                this.$tools.append($btn);
            });
            BrickyEditor.UI.initBtnDeck(this.$tools);
            this.$editor = $('<div class="bre-block-wrapper"></div>');
            this.$editor.append(this.$tools);
            this.$editor.append(this.$block);
            this.$editor.hover(() => { this.$editor.addClass('bre-active'); }, () => { this.$editor.removeClass('bre-active'); });
            this.$block.on('click', () => this.onSelect());
        }
        buildButton(action) {
            let $el = $(`<button type="button" class="bre-btn"><i class="fa fa-${action.icon}"></i></button>`);
            if (action.action) {
                $el.on('click', () => action.action());
            }
            return $el;
        }
    }
    BrickyEditor.BlockUI = BlockUI;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    class BlockUIAction {
        constructor(icon, action, title) {
            this.icon = icon;
            this.action = action;
            this.title = title;
        }
    }
    BrickyEditor.BlockUIAction = BlockUIAction;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    let Prompt;
    (function (Prompt) {
        class PromptParameter {
            constructor(key, title, value, placeholder) {
                this.key = key;
                this.title = title;
                this.placeholder = placeholder || '';
                this.value = value;
            }
            parseValue() {
                this.value = this.$input.val();
                this.$control = null;
                delete this._$control;
            }
            get $control() {
                if (!this._$control) {
                    this._$control =
                        $(`<div class="bre-prompt-field">
                            <label class="bre-label" for="${this.key}">${this.title ? this.title : 'Select file...'}</label>
                        </div>`);
                    this.$input = this.getEditor();
                    this._$control.append(this.$input);
                }
                return this._$control;
            }
            getEditor() {
                var value = this.value || '';
                return $(`<input type="text" id="${this.key}" class="bre-input" placeholder="${this.placeholder}" value="${this.value ? this.value : ''}">`);
            }
            set $control(value) {
                this._$control = value;
            }
        }
        Prompt.PromptParameter = PromptParameter;
    })(Prompt = BrickyEditor.Prompt || (BrickyEditor.Prompt = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    let Prompt;
    (function (Prompt) {
        class PromptParameterImage extends Prompt.PromptParameter {
            constructor(key, title, value, placeholder) {
                super(key, title, value, placeholder);
                if (value) {
                    this._value = value;
                }
            }
            parseValue() {
                this.value = this._value;
                this.$control = null;
                delete this._$control;
                this._value = null;
                delete this._value;
            }
            getEditor() {
                var field = this;
                var img = this.value && this.value.fileContent ? this.value.fileContent : "";
                var $editor = $(`
                <div class='bre-image-input'>
                    <label for="${this.key}">
                        Select file...
                    </label>                        
                    <img src="${img}"/>                    
                    <input type="file" id="${this.key}" class="bre-input" placeholder="${this.placeholder}">
                </div>
                <small class='bre-image-input-filename'></small>`);
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
                            let target = ev.target;
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
            }
        }
        Prompt.PromptParameterImage = PromptParameterImage;
    })(Prompt = BrickyEditor.Prompt || (BrickyEditor.Prompt = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    let Prompt;
    (function (Prompt) {
        class PromptParameterImageResult {
        }
        Prompt.PromptParameterImageResult = PromptParameterImageResult;
        class PromptParameterImageResultFile {
            constructor(file) {
                this.name = file.name;
                this.size = file.size;
                this.type = file.type;
                this.lastModified = file.lastModified;
                this.lastModifiedDate = file.lastModifiedDate;
            }
        }
        Prompt.PromptParameterImageResultFile = PromptParameterImageResultFile;
    })(Prompt = BrickyEditor.Prompt || (BrickyEditor.Prompt = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    let Prompt;
    (function (Prompt) {
        class PromptParameterList {
            constructor(params) {
                this.params = params;
            }
            getValue(key) {
                let param = this.params.find(p => {
                    return p.key === key;
                });
                return param ? param.value : null;
            }
        }
        Prompt.PromptParameterList = PromptParameterList;
    })(Prompt = BrickyEditor.Prompt || (BrickyEditor.Prompt = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    let Prompt;
    (function (Prompt) {
        class PromptParameterOption {
            constructor(title, value, selected = false) {
                this.title = title;
                this.value = value;
                this.selected = selected;
            }
        }
        Prompt.PromptParameterOption = PromptParameterOption;
    })(Prompt = BrickyEditor.Prompt || (BrickyEditor.Prompt = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    let Prompt;
    (function (Prompt) {
        class PromptParameterOptions extends Prompt.PromptParameter {
            constructor(key, title, options, value, placeholder) {
                super(key, title, value, placeholder);
                this.options = [];
                options.forEach(kv => {
                    this.options.push(new Prompt.PromptParameterOption(kv[0], kv[1], kv[1] == value));
                });
            }
            getEditor() {
                var options = this.options.map(opt => {
                    return `<option value="${opt.value}" ${opt.selected ? "selected" : ""}>${opt.title ? opt.title : opt.value}</option>`;
                });
                return $(`<select type="text" id="${this.key}" class="brickyeditor-input" placeholder="${this.placeholder}">${options}</select>`);
            }
        }
        Prompt.PromptParameterOptions = PromptParameterOptions;
    })(Prompt = BrickyEditor.Prompt || (BrickyEditor.Prompt = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    let Fields;
    (function (Fields) {
        class BaseField {
            constructor($field, data, onSelect, onUpdate) {
                this.$field = $field;
                this.data = data;
                this.onSelect = onSelect;
                this.onUpdate = onUpdate;
                this.bind();
            }
            static get type() {
                var name = this.name;
                name = name.replace('Field', '');
                name = name.substring(0, 1).toLowerCase() + name.substring(1);
                return name;
            }
            getSettingsEl() {
                return null;
            }
            static registerCommonFields() {
                Fields.HtmlField.registerField();
                Fields.ImageField.registerField();
                Fields.EmbedField.registerField();
            }
            ;
            static registerField() {
                if (this._fields.hasOwnProperty(this.type)) {
                    delete this._fields[this.type];
                }
                this._fields[this.type] = this;
            }
            static createField($field, data, onSelect, onUpdate) {
                let fieldData = $field.data().breField;
                if (!fieldData) {
                    throw `There is no any data in field ${$field.html()}`;
                }
                if (typeof fieldData === 'string') {
                    fieldData = JSON.parse(fieldData.replace(/'/g, '"'));
                }
                if (!fieldData.name) {
                    throw `There is no name in data of field ${$field.html()}`;
                }
                if (data) {
                    let addFieldData = {};
                    for (var idx = 0; idx < data.length; idx++) {
                        let field = data[idx];
                        if (field.name.toLowerCase() === fieldData.name.toLowerCase()) {
                            addFieldData = field;
                            break;
                        }
                    }
                    if (addFieldData) {
                        fieldData = $.extend(fieldData, addFieldData);
                    }
                }
                let type = fieldData.type;
                if (type != null) {
                    if (this._fields.hasOwnProperty(type)) {
                        const field = this._fields[type];
                        return new field($field, fieldData, onSelect, onUpdate);
                    }
                    else {
                        throw `${type} field not found`;
                    }
                }
                else {
                    throw `Field type not defined in data-bre-field attribute`;
                }
            }
            bind() { }
            selectBlock() {
                this.onSelect();
            }
            updateProperty(prop, value, fireUpdate = true) {
                const oldValue = this.data[prop];
                if (oldValue === value)
                    return;
                this.data[prop] = value;
                if (fireUpdate) {
                    this.onUpdate(prop, oldValue, value);
                }
            }
        }
        BaseField._fields = {};
        Fields.BaseField = BaseField;
    })(Fields = BrickyEditor.Fields || (BrickyEditor.Fields = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    let Fields;
    (function (Fields) {
        class EmbedField extends Fields.BaseField {
            getSettingsEl() {
                let $el = $('<div style="position: absolute;width: 100%; height: 100px;;text-align: center;font-weight: bold;vertical-align: middle;background: #333;opacity: 0.2;">Change embed element link</div>');
                this.$field.before($el);
                return $el;
            }
            get settings() {
                return (field) => {
                    const url = prompt('Link to embed media', 'http://instagr.am/p/BO9VX2Vj4fF/');
                    field.setUrl(url);
                    field.loadMedia(true);
                };
            }
            bind() {
                let field = this;
                let $field = this.$field;
                $field.on('click', () => __awaiter(this, void 0, void 0, function* () {
                    const url = prompt('Link to embed media', 'http://instagr.am/p/BO9VX2Vj4fF/');
                    field.setUrl(url);
                    yield field.loadMedia(true);
                }));
                field.loadMedia(false);
            }
            loadMedia(fireUpdate) {
                return __awaiter(this, void 0, void 0, function* () {
                    let field = this;
                    if (!field.data || !field.data.url)
                        return;
                    const json = yield BrickyEditor.Services.EmbedService.getEmbedAsync(field.data.url);
                    field.setEmbed(json, fireUpdate);
                    const $embed = $(json.html);
                    const $script = $embed.filter('script');
                    if ($script.length > 0) {
                        $script.remove();
                        var scriptSrc = $script.attr('src');
                        if (scriptSrc.breStartsWith('//')) {
                            scriptSrc = "https:" + scriptSrc;
                            $.getScript(scriptSrc)
                                .done(script => {
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
            }
            setEmbed(value, fireUpdate = true) {
                this.updateProperty('embed', value, fireUpdate);
            }
            setUrl(value) {
                this.updateProperty('url', value);
            }
        }
        Fields.EmbedField = EmbedField;
    })(Fields = BrickyEditor.Fields || (BrickyEditor.Fields = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    let Fields;
    (function (Fields) {
        class HtmlField extends Fields.BaseField {
            bind() {
                let field = this;
                let $field = this.$field;
                if (!$field.is('[contenteditable]')) {
                    $field.attr('contenteditable', 'true');
                }
                var html = this.data.html || this.$field.html();
                this.setHtml(html, false);
                $field.html(this.data.html);
                BrickyEditor.SelectionUtils.bindTextSelection($field, (rect) => {
                    BrickyEditor.Editor.UI.htmlTools.show(rect);
                });
                $field
                    .on('blur keyup paste input', () => {
                    this.setHtml($field.html());
                })
                    .on('paste', (e) => {
                    e.preventDefault();
                    let ev = e.originalEvent;
                    let text = ev.clipboardData.getData('text/plain');
                    document.execCommand("insertHTML", false, text);
                })
                    .on('click', (ev) => {
                    field.selectBlock();
                    ev.stopPropagation();
                    return false;
                });
            }
            setHtml(value, fireUpdate = true) {
                value = value.trim();
                if (this.$field.html() !== value) {
                    this.$field.html(value);
                }
                this.updateProperty('html', value, fireUpdate);
            }
        }
        Fields.HtmlField = HtmlField;
    })(Fields = BrickyEditor.Fields || (BrickyEditor.Fields = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    let Fields;
    (function (Fields) {
        class ImageField extends Fields.BaseField {
            bind() {
                let field = this;
                let $field = this.$field;
                let data = this.data;
                this.setSrc(this.data.src, false);
                $field.on('click', () => __awaiter(this, void 0, void 0, function* () {
                    const fields = yield BrickyEditor.Editor.UI.modal.promptAsync(field.getPromptParams());
                    const file = fields.getValue('file');
                    const src = fields.getValue('src');
                    if (file) {
                        field.setFile(file);
                        field.setSrc(null);
                    }
                    else if (src) {
                        field.setSrc(src);
                        field.setFile(null);
                    }
                    let alt = fields.getValue('alt');
                    field.setAlt(alt);
                    field.selectBlock();
                }));
            }
            getPromptParams() {
                return [
                    new BrickyEditor.Prompt.PromptParameter('src', 'Image Link', this.data.url, 'image url'),
                    new BrickyEditor.Prompt.PromptParameterImage('file', 'or Upload file', this.data.file, 'select file'),
                    new BrickyEditor.Prompt.PromptParameter('alt', 'Alt', this.data.alt, 'alt attribute value '),
                ];
            }
            setSrc(src, fireUpdate = true) {
                if (src) {
                    if (this.isImg) {
                        this.$field.attr('src', src);
                    }
                    else {
                        this.$field.css('background-image', `url(${src}`);
                    }
                }
                this.updateProperty('src', src, fireUpdate);
            }
            setAlt(alt) {
                this.$field.attr(this.isImg ? 'alt' : 'title', alt);
                this.updateProperty('alt', alt);
            }
            setFile(file) {
                if (file) {
                    if (this.isImg) {
                        this.$field.attr('src', file.fileContent);
                    }
                    else {
                        this.$field.css('background-image', `url(${file.fileContent})`);
                    }
                }
                this.updateProperty('file', file);
            }
            get isImg() {
                return this._isImg = this._isImg || this.$field.prop('tagName').toLowerCase() === 'img';
            }
        }
        Fields.ImageField = ImageField;
    })(Fields = BrickyEditor.Fields || (BrickyEditor.Fields = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    let Services;
    (function (Services) {
        class EmbedService {
            constructor() {
            }
            static getEmbedAsync(embedUrl) {
                const url = `https://noembed.com/embed?url=${embedUrl}`;
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    const params = { url: url, type: "get", dataType: "jsonp" };
                    try {
                        const data = yield $.ajax(params);
                        resolve(data);
                    }
                    catch (err) {
                        reject(err);
                    }
                }));
            }
            static processEmbed(provider) {
                switch (provider) {
                    case EmbedService.Instagram:
                        if (instgrm) {
                            instgrm.Embeds.process();
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        EmbedService.Instagram = 'Instagram';
        Services.EmbedService = EmbedService;
    })(Services = BrickyEditor.Services || (BrickyEditor.Services = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    let Services;
    (function (Services) {
        class TemplateService {
            static loadTemplatesAsync(editor) {
                return __awaiter(this, void 0, void 0, function* () {
                    this.templates = [];
                    const templates = this.templates;
                    const url = editor.options.templatesUrl;
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const data = yield $.get(url);
                            const $style = $(data).filter('style');
                            if ($style && $style.length > 0) {
                                editor.$editor.prepend($style);
                            }
                            const $templates = $(data).filter('.bre-template');
                            $templates.each((idx, t) => {
                                let template = new BrickyEditor.Template(t);
                                this.templates.push(template);
                            });
                            resolve(this.templates);
                        }
                        catch (err) {
                            console.log('Templates file not found.');
                            reject(err);
                        }
                    }));
                });
            }
            static getTemplate(templateName) {
                for (var i = 0; i < this.templates.length; i++) {
                    var template = this.templates[i];
                    if (template.name.toLowerCase() === templateName.toLowerCase()) {
                        return template;
                    }
                }
                return null;
            }
        }
        Services.TemplateService = TemplateService;
    })(Services = BrickyEditor.Services || (BrickyEditor.Services = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    class HtmlTools {
        constructor(editor) {
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
        setControl() {
            let $panel = $('<div class="bre-html-tools-panel"></div>');
            this.buttons.forEach(b => {
                let $btn = this.getButtonElement(b.icon, b.command, b.range, b.aValueArgument);
                $panel.append($btn);
            });
            this.$control = $('<div class="bre-html-tools bre-btn-group"></div>');
            this.$control.append($panel).hide();
            this.editor.$editor.append(this.$control);
        }
        getButtonElement(icon, command, rangeCommand = true, aValueArgument = null) {
            let $btn = $(`<button type="button" class="bre-btn"><i class="fa fa-${icon}"></i></button>`);
            $btn.on('click', () => __awaiter(this, void 0, void 0, function* () {
                let selection = window.getSelection();
                let selectionRange = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
                if (rangeCommand && !selectionRange)
                    return;
                if (command == 'CreateLink') {
                    const params = this.getLinkPromptParams(selection);
                    const fields = yield BrickyEditor.Editor.UI.modal.promptAsync(params);
                    const href = fields.getValue('href');
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
                }
                else {
                    if (typeof (aValueArgument) === 'string') {
                        var valueArgument = aValueArgument.replace('%%SELECTION%%', selection.toString());
                    }
                    try {
                        document.execCommand(command, false, valueArgument);
                    }
                    catch (_a) {
                        this.wrapSelectionToContainer(selection);
                        document.execCommand(command, false, valueArgument);
                    }
                }
                return false;
            }));
            return $btn;
        }
        wrapSelectionToContainer(selection) {
            let $wrapper = $('<div class="bre-temp-container" contenteditable="true"></div>');
            let $container = $(selection.anchorNode.parentElement);
            $wrapper.html($container.html());
            $container
                .empty()
                .append($wrapper)
                .removeAttr("contenteditable");
            const range = document.createRange();
            range.selectNodeContents($wrapper[0]);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        show(rect) {
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
        }
        getLinkPromptParams(selection) {
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
        }
    }
    BrickyEditor.HtmlTools = HtmlTools;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    class Modal {
        constructor($control, $closeBtn, $form, $btns, $okBtn, $cancelBtn) {
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
        hideModal() {
            this.restoreSelection();
            this.$control.fadeOut();
        }
        showModal($html, showBtns = true) {
            this.saveSelection();
            this.$btns.toggle(showBtns);
            if ($html) {
                this.$form.append($html);
                if (!$html.is(':visible')) {
                    $html.show();
                }
            }
            this.$control.fadeIn();
        }
        promptAsync(fields) {
            const modal = this;
            return new Promise((resolve, reject) => {
                modal.$form.children().not(this.$btns).remove();
                fields.forEach(field => {
                    this.$btns.before(field.$control);
                });
                modal.$okBtn.on('click', () => {
                    fields.forEach(field => field.parseValue());
                    modal.hideModal();
                    const list = new BrickyEditor.Prompt.PromptParameterList(fields);
                    resolve(list);
                });
                modal.$cancelBtn.on('click', () => {
                    modal.hideModal();
                    reject(fields);
                });
                modal.showModal();
            });
        }
        saveSelection() {
            let selection = window.getSelection();
            this.selectionRanges = [];
            for (var idx = 0; idx < selection.rangeCount; idx++) {
                this.selectionRanges.push(selection.getRangeAt(idx));
            }
        }
        restoreSelection() {
            if (!this.selectionRanges || this.selectionRanges.length == 0)
                return;
            let selection = window.getSelection();
            selection.removeAllRanges();
            this.selectionRanges.forEach(range => selection.addRange(range));
        }
    }
    BrickyEditor.Modal = Modal;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    class SelectionHelper {
        static getSelectedText() {
            let sel = window.getSelection();
            return sel.getRangeAt(0).toString();
        }
        static replaceSelectedText(replacement) {
            var sel, range;
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(document.createTextNode(replacement));
                }
            }
        }
    }
    BrickyEditor.SelectionHelper = SelectionHelper;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    class SelectionUtils {
        static bindTextSelection($el, handler) {
            if (!$el.is('[contenteditable]')) {
                return;
            }
            $el.on('mouseup', () => {
                setTimeout(() => {
                    let rect = this.getSelectionRect();
                    handler(rect);
                }, 0);
            });
            $el.on('keyup', (ev) => {
                let rect = this.getSelectionRect();
                handler(rect);
            });
        }
        static getSelectionRect() {
            let selection = window.getSelection();
            let range = selection.getRangeAt(0);
            if (range) {
                let rect = range.getBoundingClientRect();
                if (rect) {
                    return rect;
                }
            }
            return null;
        }
    }
    BrickyEditor.SelectionUtils = SelectionUtils;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    class Selectors {
        static attr(attr) {
            return `[${attr}]`;
        }
    }
    Selectors.field = 'data-bre-field';
    Selectors.selectorField = `[${Selectors.field}]`;
    Selectors.classMobile = 'brickyeditor-tools-mobile';
    Selectors.htmlToolsCommand = 'data-bre-doc-command';
    Selectors.htmlToolsCommandRange = 'data-bre-doc-command-range';
    Selectors.selectorHtmlToolsCommand = Selectors.attr(Selectors.htmlToolsCommand);
    Selectors.selectorHtmlToolsCommandRange = Selectors.attr(Selectors.htmlToolsCommandRange);
    BrickyEditor.Selectors = Selectors;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    class UI {
        constructor(editor) {
            this.editor = editor;
            this.editor = editor;
            this.setTools();
            this.setModal();
            this.htmlTools = new BrickyEditor.HtmlTools(this.editor);
        }
        get isCompactTools() {
            var compactTools = this.editor.options.compactTools;
            if (compactTools == null) {
                return window.innerWidth < this.editor.options.compactToolsWidth;
            }
            else {
                return compactTools.valueOf();
            }
        }
        setTools() {
            this.$tools = $('<div class="bre bre-tools" data-bricky-tools></div>');
            this.$toolsTemplates = $('<div class="bre-tools-templates"></div>');
            this.$toolsLoader = $('<div class="bre-tools-loader"><b>Loading...</b></div>');
            this.$toolsHideBtn = $('<button type="button" class="bre-tools-toggle"><div>►</div></button>');
            this.$tools.append([this.$toolsHideBtn, this.$toolsLoader, this.$toolsTemplates]);
            this.$toolsHideBtn.on('click', () => this.toggleTools());
            this.editor.$editor.append(this.$tools);
            if (this.isCompactTools) {
                this.$tools.addClass("bre-tools-templates-compact");
                this.toggleTools();
            }
        }
        toggleTools() {
            this.$tools.toggleClass('bre-tools-collapsed', !this.$toolsHideBtn.hasClass("bre-tools-toggle-collapsed"));
            this.$toolsHideBtn.toggleClass("bre-tools-toggle-collapsed");
        }
        setModal() {
            let $modal = $('<div class="bre bre-modal"><div class="bre-modal-placeholder"></div></div>');
            let $modalCloseBtn = $('<div class="bre-modal-close"><a href="#">close ✖</a></div>');
            let $modalContent = $('<div class="bre-modal-content"></div>');
            let $modalForm = $('<form></form>');
            let $modalBtns = $('<div class="bre-btns"></div>');
            let $modalOk = $('<button type="button" class="bre-btn bre-btn-primary">Ok</button>');
            let $modalCancel = $('<button type="button" class="bre-btn">Cancel</button>');
            $modalBtns.append($modalOk);
            $modalBtns.append($modalCancel);
            $modalForm.append($modalBtns);
            $modalContent.append($modalForm);
            let $placeholder = $('.bre-modal-placeholder', $modal);
            $placeholder.append($modalCloseBtn);
            $placeholder.append($modalContent);
            this.modal = new BrickyEditor.Modal($modal, $modalCloseBtn, $modalForm, $modalBtns, $modalOk, $modalCancel);
            this.editor.$editor.append($modal);
        }
        toggleToolsLoader(toggle) {
            this.$toolsLoader.toggle(toggle);
        }
        setTemplates(templates) {
            let editor = this.editor;
            templates.forEach(template => {
                let $preview = template.getPreview();
                $preview.on('click', () => {
                    editor.addBlock(template);
                });
                this.$toolsTemplates.append($preview);
            });
        }
        static initBtnDeck($btnsDeck) {
            var $btns = $('.bre-btn', $btnsDeck);
            var $firstBtn = $btns.eq(0);
            $firstBtn.on('click', function () {
                UI.toggleBtnDeck($btnsDeck);
            });
        }
        static toggleBtnDeck($btnsDeck, isOn) {
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
                $btns.not(':first').each((idx, btn) => {
                    $(btn).css({ 'opacity': 1, 'left': (idx + 1) * (size + gap) });
                });
                $btnsDeck.css({ 'height': size, 'width': (size + gap) * $btns.length - gap });
            }
            $firstBtn.toggleClass('bre-btn-active', !isOn);
            $btnsDeck.data('isOn', !isOn);
        }
    }
    BrickyEditor.UI = UI;
})(BrickyEditor || (BrickyEditor = {}));
