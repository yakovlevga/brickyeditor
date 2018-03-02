var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var BrickyEditor;
(function (BrickyEditor) {
    class BlocksContainer {
        constructor($element, onAddBlock, onDeleteBlock, onSelectBlock, onDeselectBlock, onMoveBlock, onUpdateBlock, onUpload, usePlaceholder = false) {
            this.$element = $element;
            this.onAddBlock = onAddBlock;
            this.onDeleteBlock = onDeleteBlock;
            this.onSelectBlock = onSelectBlock;
            this.onDeselectBlock = onDeselectBlock;
            this.onMoveBlock = onMoveBlock;
            this.onUpdateBlock = onUpdateBlock;
            this.onUpload = onUpload;
            this.usePlaceholder = usePlaceholder;
            this.blocks = [];
            this.isContainer = true;
            this.togglePlaceholderIfNeed();
        }
        getData(ignoreHtml) {
            var blocksData = [];
            this.blocks.forEach(block => {
                blocksData.push(block.getData(ignoreHtml));
            });
            return blocksData;
        }
        getHtml() {
            var blocksHtml = [];
            this.blocks.forEach(block => {
                blocksHtml.push(block.getHtml(true));
            });
            let $el = BrickyEditor.$dom.clone(this.$element);
            $el.innerHTML = blocksHtml.join('\n');
            return $el.outerHTML;
        }
        addBlock(template, data, idx, select = true) {
            let block = new BrickyEditor.Block(template, false, data, block => this.deleteBlock(block), block => this.selectBlock(block), block => this.deselectBlock(block), block => this.copyBlock(block), (block, offset) => this.moveBlock(block, offset), this.onUpdateBlock, this.onUpload);
            this.insertBlock(block, idx);
            if (select) {
                block.select();
                block.scrollTo();
            }
        }
        insertBlock(block, idx) {
            idx = idx || this.blocks.length;
            if (this.selectedBlock) {
                idx = this.blocks.indexOf(this.selectedBlock) + 1;
            }
            this.blocks.splice(idx, 0, block);
            if (idx == 0) {
                this.$element.appendChild(block.ui.$editor);
            }
            else {
                BrickyEditor.$dom.after(this.blocks[idx - 1].ui.$editor, block.ui.$editor);
            }
            this.onAddBlock(block, idx);
            block.select(null);
            this.togglePlaceholderIfNeed();
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
            this.onDeleteBlock(block, idx);
            this.togglePlaceholderIfNeed();
        }
        moveBlock(block, offset) {
            const idx = this.blocks.indexOf(block);
            const new_idx = idx + offset;
            if (new_idx >= this.blocks.length || new_idx < 0)
                return;
            var $anchorBlock = this.blocks[new_idx].ui.$editor;
            if (offset > 0) {
                BrickyEditor.$dom.after($anchorBlock, block.ui.$editor);
            }
            else if (offset < 0) {
                BrickyEditor.$dom.before($anchorBlock, block.ui.$editor);
            }
            this.blocks.splice(idx, 1);
            this.blocks.splice(new_idx, 0, block);
            this.onMoveBlock(block, idx, new_idx);
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
            this.onSelectBlock(block);
        }
        deselectBlock(block) {
            this.selectedBlock = null;
            this.onDeselectBlock(block);
        }
        togglePlaceholderIfNeed() {
            if (!this.usePlaceholder) {
                return;
            }
            if (this.blocks.length === 0) {
                if (!this.$placeholder) {
                    this.$placeholder = BrickyEditor.$dom.el('<i data-bre-placeholder="true">Click here to select this container...</i>');
                    this.$element.appendChild(this.$placeholder);
                }
            }
            else if (this.$placeholder) {
                this.$placeholder.remove();
                this.$placeholder = null;
            }
        }
    }
    BrickyEditor.BlocksContainer = BlocksContainer;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    class Editor {
        constructor($editor, options) {
            this.onError = (message, code = 0) => this.options.onError({ message: message, code: code });
            BrickyEditor.Fields.BaseField.registerCommonFields();
            this.$editor = $editor;
            this.$editor.classList.add(BrickyEditor.Selectors.classEditor);
            this.options = new BrickyEditor.EditorOptions(options);
            this.container = this.createContainer();
            Editor.UI = new BrickyEditor.UI(this);
            this.tryBindFormSubmit();
        }
        createContainer() {
            const onAdd = (block, idx) => {
                if (this.isLoaded) {
                    this.trigger(BrickyEditor.Events.onBlockAdd, { block: block, idx: idx });
                    this.trigger(BrickyEditor.Events.onChange, { blocks: this.getData(), html: this.getHtml() });
                }
            };
            const onDelete = (block, idx) => {
                this.trigger(BrickyEditor.Events.onBlockDelete, { block: block, idx: idx });
                this.trigger(BrickyEditor.Events.onChange, { blocks: this.getData(), html: this.getHtml() });
            };
            const onUpdate = (block, property, oldValue, newValue) => {
                this.trigger(BrickyEditor.Events.onBlockUpdate, {
                    block: block,
                    property: property,
                    oldValue: oldValue,
                    newValue: newValue
                });
                this.trigger(BrickyEditor.Events.onChange, { blocks: this.getData(), html: this.getHtml() });
            };
            return new BrickyEditor.BlocksContainer(this.$editor, onAdd, onDelete, (block) => { this.trigger(BrickyEditor.Events.onBlockSelect, { block: block }); }, (block) => { this.trigger(BrickyEditor.Events.onBlockDeselect, { block: block }); }, (block, from, to) => {
                this.trigger(BrickyEditor.Events.onBlockMove, { block: block, from: from, to: to });
                this.trigger(BrickyEditor.Events.onChange, { blocks: this.getData(), html: this.getHtml() });
            }, onUpdate, this.options.onUpload);
        }
        initAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                const editor = this;
                Editor.UI.toggleToolsLoader(true);
                const templates = yield BrickyEditor.Services.TemplateService.loadTemplatesAsync(editor.options.templatesUrl, editor.$editor, editor.onError);
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
                const editor = this;
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    if (url) {
                        try {
                            const blocks = yield BrickyEditor.$ajax.get(url);
                            resolve(blocks);
                        }
                        catch (error) {
                            editor.onError(BrickyEditor.EditorStrings.errorBlocksFileNotFound(url));
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
            const $form = this.options.formSelector ? BrickyEditor.$dom.find(this.options.formSelector) : null;
            const $input = this.options.inputSelector ? BrickyEditor.$dom.find(this.options.inputSelector) : null;
            if (!$form || !$input || !($input instanceof HTMLInputElement)) {
                return;
            }
            BrickyEditor.$dom.on($form, 'submit', () => {
                $input.value = JSON.stringify(editor.getData());
                return true;
            });
        }
        getData() {
            return this.container.getData(this.options.ignoreHtml);
        }
        getHtml() {
            return this.container.getHtml();
        }
        loadBlocks(blocks) {
            if (blocks && blocks.length) {
                blocks.forEach(block => {
                    let template = BrickyEditor.Services.TemplateService.getTemplate(block.template);
                    if (template) {
                        this.container.addBlock(template, block.fields, null, false);
                    }
                    else {
                        const message = BrickyEditor.EditorStrings.errorBlockTemplateNotFound(block.template);
                        this.onError(message);
                    }
                });
            }
        }
        addBlock(template) {
            const container = this.getContainer(this.container);
            container.addBlock(template, null, null, true);
        }
        getContainer(container) {
            if (container.selectedBlock && container.selectedBlock.isContainer()) {
                const field = container.selectedBlock.selectedField;
                if (field) {
                    return this.getContainer(field.container);
                }
            }
            return container;
        }
        trigger(event, data) {
            const editor = this;
            BrickyEditor.$dom.trigger(this.$editor, 'bre.' + event, data);
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
            this.onError = (data) => {
                console.log(data.message);
            };
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
            this.onError = options.onError || this.onError;
            this.onUpload = options.onUpload || null;
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
    class EditorStrings {
    }
    EditorStrings.errorBlocksFileNotFound = function (url) { return `Blocks file not found. Requested file: ${url}.`; };
    EditorStrings.errorTemplatesFileNotFound = function (url) { return `Templates file not found. Requested file: ${url}.`; };
    EditorStrings.errorBlockTemplateNotFound = function (templateName) { return `Template "${templateName}" not found.`; };
    EditorStrings.errorTemplateParsing = function (name) { return `Template parsing error: ${name}.`; };
    EditorStrings.embedFieldLinkTitle = 'Link to embed media';
    EditorStrings.embedFieldLinkPlaceholder = 'Link to instagram, youtube and etc.';
    EditorStrings.imageFieldLinkTitle = 'Image link';
    EditorStrings.imageFieldLinkPlaceholder = 'http://url-to-image.png';
    EditorStrings.imageFieldUploadTitle = 'or Upload a file';
    EditorStrings.imageFieldUploadButton = 'Select file';
    EditorStrings.imageFieldAltTitle = 'Alt';
    EditorStrings.imageFieldAltPlaceholder = 'Image \'alt\' attribute value';
    EditorStrings.imageFieldUrlSubtitle = 'Link to open on image click';
    EditorStrings.htmlEditorLinkUrlTitle = 'Url';
    EditorStrings.htmlEditorLinkUrlPlaceholder = 'http://put-your-link.here';
    EditorStrings.htmlEditorLinkTitleTitle = 'Title';
    EditorStrings.htmlEditorLinkTitlePlaceholder = 'Title attribute for link';
    EditorStrings.htmlEditorLinkTargetTitle = 'Target';
    EditorStrings.htmlEditorLinkTargetBlank = 'Blank';
    EditorStrings.htmlEditorLinkTargetSelf = 'Self';
    EditorStrings.htmlEditorLinkTargetParent = 'Parent';
    EditorStrings.htmlEditorLinkTargetTop = 'Top';
    EditorStrings.buttonClose = 'close';
    EditorStrings.buttonOk = 'Ok';
    EditorStrings.buttonCancel = 'Cancel';
    EditorStrings.defaultTemplatesGroupName = 'Other templates';
    BrickyEditor.EditorStrings = EditorStrings;
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
var BrickyEditor;
(function (BrickyEditor) {
    class HtmlLinkParams {
        constructor(href = '', title = '', target = '') {
            this.href = href;
            this.title = title;
            this.target = target;
        }
        getLinkPromptParams() {
            return [
                new BrickyEditor.Prompt.PromptParameter('href', BrickyEditor.EditorStrings.htmlEditorLinkUrlTitle, this.href, BrickyEditor.EditorStrings.htmlEditorLinkUrlPlaceholder),
                new BrickyEditor.Prompt.PromptParameter('title', BrickyEditor.EditorStrings.htmlEditorLinkTitleTitle, this.title, BrickyEditor.EditorStrings.htmlEditorLinkTitlePlaceholder),
                new BrickyEditor.Prompt.PromptParameterOptions('target', BrickyEditor.EditorStrings.htmlEditorLinkTargetTitle, [
                    ['', ''],
                    [BrickyEditor.EditorStrings.htmlEditorLinkTargetBlank, '_blank'],
                    [BrickyEditor.EditorStrings.htmlEditorLinkTargetSelf, '_self'],
                    [BrickyEditor.EditorStrings.htmlEditorLinkTargetParent, '_parent'],
                    [BrickyEditor.EditorStrings.htmlEditorLinkTargetTop, '_top'],
                ], this.target)
            ];
        }
        static getLinkFromParams(fields) {
            const href = fields.getValue('href');
            const title = fields.getValue('title');
            const target = fields.getValue('target');
            return new HtmlLinkParams(href, title, target);
        }
    }
    BrickyEditor.HtmlLinkParams = HtmlLinkParams;
})(BrickyEditor || (BrickyEditor = {}));
(function ($) {
    $.fn.brickyeditor = function (options) {
        let editor = new BrickyEditor.Editor($(this)[0], options);
        editor.initAsync();
        return editor;
    };
}(jQuery));
var BrickyEditor;
(function (BrickyEditor) {
    class $ajax {
        static get(url) {
            return new Promise((resolve, reject) => {
                var request = new XMLHttpRequest();
                request.open('GET', url, true);
                request.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        if (this.status >= 200 && this.status < 400) {
                            var data = null;
                            try {
                                data = JSON.parse(this.responseText);
                            }
                            catch (_a) {
                                data = this.responseText;
                            }
                            try {
                                resolve(data);
                            }
                            catch (ex) {
                                reject(ex);
                            }
                        }
                        else {
                            reject();
                        }
                    }
                };
                request.send();
                request = null;
            });
        }
        static getScript(url) {
            return new Promise((resolve, reject) => {
                var script = document.createElement("script");
                var done = false;
                var loaded = function () {
                    if (!done && (!this.readyState ||
                        this.readyState == "loaded" || this.readyState == "complete")) {
                        done = true;
                        resolve();
                    }
                    else {
                        reject();
                    }
                };
                script.onload = loaded;
                script.onreadystatechange = loaded;
                script.src = url;
                var head = document.getElementsByTagName("head")[0];
                head.appendChild(script);
            });
        }
        static jsonp(url) {
            return new Promise(function (resolve, reject) {
                var id = '_' + Math.round(10000 * Math.random());
                var callbackName = 'jsonp_callback_' + id;
                window[callbackName] = function (data) {
                    delete window[callbackName];
                    var ele = document.getElementById(id);
                    ele.parentNode.removeChild(ele);
                    resolve(data);
                };
                var src = url + '&callback=' + callbackName;
                var script = document.createElement('script');
                script.src = src;
                script.id = id;
                script.addEventListener('error', reject);
                (document.getElementsByTagName('head')[0] || document.body || document.documentElement).appendChild(script);
            });
        }
    }
    BrickyEditor.$ajax = $ajax;
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
    class Common {
        static extend(out, ...extensions) {
            out = out || {};
            for (var i = 1; i < extensions.length; i++) {
                if (!extensions[i])
                    continue;
                for (var key in extensions[i]) {
                    if (extensions[i].hasOwnProperty(key))
                        out[key] = extensions[i][key];
                }
            }
            return out;
        }
        ;
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
    class $dom {
        static el(html) {
            let div = document.createElement('div');
            div.innerHTML = html;
            const el = div.firstElementChild;
            div.innerHTML = null;
            return el;
        }
        static ons(el, events, listener) {
            events.split(' ').forEach(ev => {
                this.on(el, ev, listener);
            });
        }
        static on(el, event, listener) {
            if (el.attachEvent)
                return el.attachEvent(`on${event}`, listener);
            else {
                return el.addEventListener(event, listener, false);
            }
        }
        static offset(el) {
            const rect = el.getBoundingClientRect();
            const $body = document.body;
            return {
                top: rect.top + $body.scrollTop,
                left: rect.left + $body.scrollLeft
            };
        }
        static wrap(el, toEl) {
            el.parentElement.insertBefore(toEl, el);
            toEl.appendChild(el);
        }
        static unwrap(el) {
            if (!el.parentElement)
                return;
            var parentsParent = el.parentElement.parentElement;
            if (parentsParent) {
                parentsParent.replaceChild(el, el.parentElement);
            }
            else {
                el.parentElement.innerHTML = el.innerHTML;
            }
        }
        static hide(el) {
            el.style.display = 'none';
        }
        static show(el) {
            el.style.display = '';
        }
        static isHidden(el) {
            var style = window.getComputedStyle(el);
            return (style.display === 'none');
        }
        static toggle(el, force) {
            el.style.display = (force && force.valueOf()) || el.style.display !== 'none' ? 'none' : '';
        }
        static before(el, elToInsert) {
            if (elToInsert instanceof HTMLElement) {
                el.parentNode.insertBefore(elToInsert, el);
            }
            else {
                elToInsert.forEach($el => this.before(el, $el));
            }
        }
        static after(el, elToInsert) {
            if (el.nextSibling)
                el.parentNode.insertBefore(elToInsert, el);
            else
                el.parentNode.appendChild(elToInsert);
        }
        static hasClass(el, className) {
            if (el.classList)
                el.classList.contains(className);
            else
                new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }
        static addClass(el, className) {
            if (this.hasClass(el, className))
                return;
            if (el.classList)
                el.classList.add(className);
            else
                el.className += ' ' + className;
        }
        static removeClass(el, className) {
            if (el.classList)
                el.classList.remove(className);
            else
                el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
        static toggleClass(el, className, force) {
            if (force) {
                if (force.valueOf())
                    this.addClass(el, className);
                else
                    this.removeClass(el, className);
                return;
            }
            if (el.classList) {
                el.classList.toggle(className);
            }
            else {
                var classes = el.className.split(' ');
                var existingIndex = -1;
                for (var i = classes.length; i--;) {
                    if (classes[i] === className)
                        existingIndex = i;
                }
                if (existingIndex >= 0)
                    classes.splice(existingIndex, 1);
                else
                    classes.push(className);
                el.className = classes.join(' ');
            }
        }
        static windowScrollTop() {
            return window.pageYOffset !== undefined ?
                window.pageYOffset :
                (document.documentElement || document.body.parentNode || document.body).scrollTop;
        }
        static replaceWith(from, to) {
            const parent = from.parentElement;
            if (parent)
                parent.replaceChild(to, from);
        }
        static select(el, selector, addBack = false) {
            const elements = el.querySelectorAll(selector);
            var result = Array.prototype.slice.call(elements);
            if (addBack && addBack.valueOf() && $dom.matches(el, selector)) {
                result.push(el);
            }
            return result;
        }
        static find(selector) {
            return document.querySelector(selector);
        }
        static first(el, selector) {
            return el.querySelector(selector);
        }
        static clone(el) {
            return el.cloneNode(true);
        }
        static trigger(el, ev, data) {
            if (window.CustomEvent) {
                var event = new CustomEvent(ev, { detail: data });
            }
            else {
                var event = document.createEvent('CustomEvent');
                event.initCustomEvent(ev, true, true, data);
            }
            el.dispatchEvent(event);
        }
        static matches(el, selector) {
            const matches = el.matches ||
                el['matchesSelector'] ||
                el.msMatchesSelector ||
                el['mozMatchesSelector'] ||
                el.webkitMatchesSelector ||
                el['oMatchesSelector'];
            return matches.call(el, selector);
        }
        static data(el, prop) {
            var json = el.dataset[prop];
            var data = null;
            try {
                data = JSON.parse(json);
            }
            catch (e) {
                if (e instanceof SyntaxError) {
                    json = json.replace(/'/g, '"');
                    try {
                        data = JSON.parse(json);
                    }
                    catch (_a) { }
                }
            }
            return data;
        }
    }
    BrickyEditor.$dom = $dom;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    class Block {
        constructor(template, preview, data, onDelete, onSelect, onDeselect, onCopy, onMove, onUpdate, onUpload) {
            this.template = template;
            this.onDelete = onDelete;
            this.onSelect = onSelect;
            this.onDeselect = onDeselect;
            this.onCopy = onCopy;
            this.onMove = onMove;
            this.onUpdate = onUpdate;
            this.onUpload = onUpload;
            this.fields = [];
            const $block = BrickyEditor.$dom.el(template.$html.innerHTML);
            this.bindFields($block, data);
            const actions = this.getActions();
            this.ui = new BrickyEditor.BlockUI($block, preview, actions, () => this.select());
        }
        isContainer() {
            if (!this.selectedField)
                return false;
            return this.selectedField instanceof BrickyEditor.Fields.ContainerField;
        }
        bindFields($block, data) {
            const block = this;
            const $fields = BrickyEditor.$dom.select($block, BrickyEditor.Selectors.selectorField, true);
            $fields.forEach($elem => {
                const onUpdate = (property, oldValue, newValue) => {
                    if (block.onUpdate) {
                        block.onUpdate(block, property, oldValue, newValue);
                    }
                };
                const onSelect = (field) => {
                    block.select(field);
                };
                let field = BrickyEditor.Fields.BaseField.createField($elem, data, onSelect, onUpdate, block.onUpload);
                block.fields.push(field);
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
        select(field) {
            if (field === this.selectedField)
                return;
            if (field === null) {
                field = this.fields[0];
            }
            if (this.selectedField) {
                this.selectedField.deselect();
            }
            this.selectedField = field;
            this.ui.toggleSelection(true);
            this.onSelect(this);
        }
        deselect() {
            this.selectedField = null;
            this.fields.forEach(f => {
                f.deselect();
            });
            this.ui.toggleSelection(false);
            this.onDeselect(this);
        }
        scrollTo() {
            var top = BrickyEditor.$dom.offset(this.ui.$editor).top - 100;
            top = top > 0 ? top : 0;
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
        getHtml(trim) {
            const $html = BrickyEditor.$dom.el(this.template.$html.innerHTML);
            let fieldsHtml = {};
            this.fields.forEach(field => {
                const name = field.name || field.data.name;
                fieldsHtml[name] = field.getEl();
            });
            BrickyEditor.$dom.select($html, BrickyEditor.Selectors.selectorField, true)
                .forEach($elem => {
                let fieldData = BrickyEditor.$dom.data($elem, 'breField');
                const name = fieldData.name;
                const $field = fieldsHtml[name];
                BrickyEditor.$dom.replaceWith($elem, $field);
            });
            const html = $html.outerHTML;
            if (!html) {
                return null;
            }
            return trim ? html.breTotalTrim() : html;
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
            this.$editor.classList.toggle("bre-selected", isOn);
        }
        buildEditorUI(actions) {
            this.$tools = BrickyEditor.$dom.el('<div class="bre-block-tools bre-btn-deck"></div>');
            actions.forEach(action => {
                var $btn = this.buildButton(action);
                this.$tools.appendChild($btn);
            });
            BrickyEditor.UI.initBtnDeck(this.$tools);
            this.$editor = BrickyEditor.$dom.el('<div class="bre-block-wrapper"></div>');
            this.$editor.appendChild(this.$tools);
            this.$editor.appendChild(this.$block);
            BrickyEditor.$dom.on(this.$editor, 'mouseover', () => {
                this.$editor.classList.add('bre-active');
            });
            BrickyEditor.$dom.on(this.$editor, 'mouseout', () => {
                this.$editor.classList.remove('bre-active');
            });
            BrickyEditor.$dom.on(this.$editor, 'click', () => {
                this.onSelect();
            });
        }
        buildButton(action) {
            let $el = BrickyEditor.$dom.el(`<button type="button" class="bre-btn"><i class="fa fa-${action.icon}"></i></button>`);
            if (action.action) {
                $el.onclick = function (ev) {
                    action.action();
                    ev.stopPropagation();
                    return false;
                };
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
    let Fields;
    (function (Fields) {
        class BaseField {
            constructor($field, data, onSelect, onUpdate, onUpload) {
                this.$field = $field;
                this.data = data;
                this.onSelect = onSelect;
                this.onUpdate = onUpdate;
                this.onUpload = onUpload;
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
                Fields.ContainerField.registerField();
            }
            ;
            static registerField() {
                if (this._fields.hasOwnProperty(this.type)) {
                    delete this._fields[this.type];
                }
                this._fields[this.type] = this;
            }
            static createField($field, data, onSelect, onUpdate, onUpload) {
                let fieldData = BrickyEditor.$dom.data($field, 'breField');
                if (!fieldData || !fieldData.name) {
                    throw `There is no data or data doesn't contains 'name' in field ${$field.innerHTML}`;
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
                        fieldData = BrickyEditor.Common.extend(fieldData, addFieldData);
                    }
                }
                let type = fieldData.type;
                if (type != null) {
                    if (this._fields.hasOwnProperty(type)) {
                        const field = this._fields[type];
                        return new field($field, fieldData, onSelect, onUpdate, onUpload);
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
            select() {
                this.$field.classList.add(BrickyEditor.Selectors.selectorFieldSelected);
                this.onSelect(this);
            }
            deselect() {
                this.$field.classList.remove(BrickyEditor.Selectors.selectorFieldSelected);
            }
            getEl() {
                let $el = this.$field.cloneNode(true);
                $el.attributes.removeNamedItem(BrickyEditor.Selectors.attrField);
                return $el;
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
        class ContainerField extends Fields.BaseField {
            bind() {
                let field = this;
                let $field = this.$field;
                this.container = new BrickyEditor.BlocksContainer($field, (block) => {
                    field.updateBlocks();
                }, (block) => { field.updateBlocks(); }, (block) => { this.select(); }, (block) => { }, (block) => { field.updateBlocks(); }, (block) => { field.updateBlocks(); }, field.onUpload, true);
                BrickyEditor.$dom.addClass($field, BrickyEditor.Selectors.selectorFieldContainer);
                BrickyEditor.$dom.on($field, 'click', (ev) => {
                    field.select();
                    ev.stopPropagation();
                    return false;
                });
            }
            updateBlocks() {
                this.updateProperty('blocks', this.container.getData(true), true);
                this.updateProperty('html', this.container.getHtml(), true);
            }
            deselect() {
                this.container.blocks.forEach(b => b.deselect());
                this.$field.classList.remove(BrickyEditor.Selectors.selectorFieldSelected);
            }
            getEl() {
                const html = this.container.getHtml();
                return BrickyEditor.$dom.el(html);
            }
        }
        Fields.ContainerField = ContainerField;
    })(Fields = BrickyEditor.Fields || (BrickyEditor.Fields = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    let Fields;
    (function (Fields) {
        class EmbedField extends Fields.BaseField {
            getSettingsEl() {
                let $el = BrickyEditor.$dom.el('<div style="position: absolute;width: 100%; height: 100px;;text-align: center;font-weight: bold;vertical-align: middle;background: #333;opacity: 0.2;">Change embed element link</div>');
                BrickyEditor.$dom.before(this.$field, $el);
                return $el;
            }
            get settings() {
                return (field) => {
                    this.showEmbedLoaderAsync(field);
                };
            }
            bind() {
                let field = this;
                let $field = this.$field;
                BrickyEditor.$dom.on($field, 'click', () => __awaiter(this, void 0, void 0, function* () {
                    this.showEmbedLoaderAsync(field);
                }));
                field.loadMedia(false);
            }
            showEmbedLoaderAsync(field) {
                return __awaiter(this, void 0, void 0, function* () {
                    const fields = yield BrickyEditor.Editor.UI.modal.promptAsync(field.getPromptParams());
                    if (fields != null) {
                        const url = fields.getValue('url');
                        if (url) {
                            field.setUrl(url);
                            yield field.loadMedia(true);
                        }
                    }
                });
            }
            getPromptParams() {
                return [
                    new BrickyEditor.Prompt.PromptParameter('url', BrickyEditor.EditorStrings.embedFieldLinkTitle, this.data.url || 'http://instagr.am/p/BO9VX2Vj4fF/', BrickyEditor.EditorStrings.embedFieldLinkPlaceholder)
                ];
            }
            loadMedia(fireUpdate) {
                return __awaiter(this, void 0, void 0, function* () {
                    let field = this;
                    if (!field.data || !field.data.url)
                        return;
                    const json = yield BrickyEditor.Services.EmbedService.getEmbedAsync(field.data.url);
                    field.setEmbed(json, fireUpdate);
                    const $embed = BrickyEditor.$dom.el(json.html);
                    const $script = BrickyEditor.$dom.first($embed, 'script');
                    if ($script) {
                        $script.remove();
                        var scriptSrc = $script.src;
                        if (scriptSrc.breStartsWith('//')) {
                            scriptSrc = "https:" + scriptSrc;
                            BrickyEditor.$ajax.getScript(scriptSrc)
                                .then(() => {
                                BrickyEditor.Services.EmbedService.processEmbed(json.provider_name);
                            });
                        }
                    }
                    field.$field.innerHTML = '';
                    field.$field.removeAttribute('class');
                    field.$field.removeAttribute('style');
                    field.$field.appendChild($embed);
                    field.select();
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
                if (!BrickyEditor.$dom.matches($field, BrickyEditor.Selectors.selectorContentEditable)) {
                    $field.setAttribute(BrickyEditor.Selectors.attrContentEditable, 'true');
                }
                var html = this.data.html || this.$field.innerHTML;
                this.setHtml(html, false);
                $field.innerHTML = this.data.html;
                BrickyEditor.SelectionUtils.bindTextSelection($field, (rect) => {
                    BrickyEditor.Editor.UI.htmlTools.show(rect);
                });
                BrickyEditor.$dom.ons($field, 'blur keyup paste input', ev => {
                    this.setHtml($field.innerHTML);
                });
                BrickyEditor.$dom.on($field, 'paste', e => {
                    e.preventDefault();
                    let ev = e.originalEvent;
                    let text = ev.clipboardData.getData('text/plain');
                    document.execCommand("insertHTML", false, text);
                });
                BrickyEditor.$dom.on($field, 'click', ev => {
                    field.select();
                    ev.stopPropagation();
                    return false;
                });
            }
            setHtml(value, fireUpdate = true) {
                value = value.trim();
                if (this.$field.innerHTML !== value) {
                    this.$field.innerHTML = value;
                }
                this.updateProperty('html', value, fireUpdate);
            }
            getEl() {
                let $el = super.getEl();
                $el.removeAttribute(BrickyEditor.Selectors.attrContentEditable);
                return $el;
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
                let data = this.data;
                this.setSrc(this.data.src, false);
                BrickyEditor.$dom.on(this.$field, 'click', () => __awaiter(this, void 0, void 0, function* () {
                    debugger;
                    const fields = yield BrickyEditor.Editor.UI.modal.promptAsync(field.getPromptParams());
                    if (fields != null) {
                        const file = fields.getValue('file');
                        const src = fields.getValue('src');
                        if (file) {
                            if (field.onUpload) {
                                field.onUpload(file, url => {
                                    field.setSrc(url);
                                    field.setFile(null);
                                });
                            }
                            else {
                                field.setFile(file);
                                field.setSrc(null);
                            }
                        }
                        else if (src) {
                            field.setSrc(src);
                            field.setFile(null);
                        }
                        const alt = fields.getValue('alt');
                        field.setAlt(alt);
                        const link = BrickyEditor.HtmlLinkParams.getLinkFromParams(fields);
                        this.setLink(link);
                    }
                    field.select();
                }));
            }
            getPromptParams() {
                var params = [
                    new BrickyEditor.Prompt.PromptParameter('src', BrickyEditor.EditorStrings.imageFieldLinkTitle, this.data.url, BrickyEditor.EditorStrings.imageFieldLinkPlaceholder),
                    new BrickyEditor.Prompt.PromptParameterImage('file', BrickyEditor.EditorStrings.imageFieldUploadTitle, this.data.file, BrickyEditor.EditorStrings.imageFieldUploadButton),
                    new BrickyEditor.Prompt.PromptParameter('alt', BrickyEditor.EditorStrings.imageFieldAltTitle, this.data.alt, BrickyEditor.EditorStrings.imageFieldAltPlaceholder),
                    new BrickyEditor.Prompt.PromptParameter(null, BrickyEditor.EditorStrings.imageFieldUrlSubtitle, null, null),
                ];
                const link = this.data.link ? this.data.link : new BrickyEditor.HtmlLinkParams();
                const linkParams = link.getLinkPromptParams();
                return params.concat(linkParams);
            }
            setSrc(src, fireUpdate = true) {
                if (src) {
                    if (this.isImg) {
                        this.$field.setAttribute('src', src);
                    }
                    else {
                        this.$field.style.backgroundImage = `url(${src}`;
                    }
                }
                this.updateProperty('src', src, fireUpdate);
            }
            setAlt(alt) {
                this.$field.setAttribute(this.isImg ? 'alt' : 'title', alt);
                this.updateProperty('alt', alt);
            }
            setFile(file) {
                if (file) {
                    if (this.isImg) {
                        this.$field.setAttribute('src', file.fileContent);
                    }
                    else {
                        this.$field.style.backgroundImage = `url(${file.fileContent})`;
                    }
                }
                this.updateProperty('file', file);
            }
            setLink(url) {
                if (url && url.href) {
                    if (!this.$link) {
                        this.$link = BrickyEditor.$dom.el(`<a href='${url.href}' title='${url.title}' target='${url.target}'></a>`);
                        BrickyEditor.$dom.on(this.$link, 'click', ev => {
                            ev.stopPropagation();
                            return false;
                        });
                        BrickyEditor.$dom.wrap(this.$field, this.$link);
                    }
                    else {
                        this.$link.href = url.href;
                    }
                }
                else if (this.$link) {
                    BrickyEditor.$dom.unwrap(this.$field);
                    this.$link = null;
                    delete this.$link;
                }
                this.updateProperty('link', url);
            }
            get isImg() {
                return this._isImg = this._isImg || this.$field.tagName.toLowerCase() === 'img';
            }
            getEl() {
                let $el = super.getEl();
                const { link } = this.data;
                if (link && link.href) {
                    const $link = BrickyEditor.$dom.el(`<a href='${link.href}' title='${link.title}' target='${link.target}'></a>`);
                    $link.appendChild($el);
                    return $link;
                }
                return $el;
            }
        }
        Fields.ImageField = ImageField;
    })(Fields = BrickyEditor.Fields || (BrickyEditor.Fields = {}));
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
                if (this.$input) {
                    this.value = this.$input.value;
                }
                this.$control = null;
                delete this._$control;
            }
            get $control() {
                if (!this._$control) {
                    this._$control = BrickyEditor.$dom.el(`<div class=${this.key ? "bre-prompt-field" : "bre-prompt-subtitle"}>
                            <label class="bre-label" for="${this.key}">${this.title ? this.title : 'Select file...'}</label>
                        </div>`);
                    this.$input = this.key ? this.getEditor() : null;
                    if (this.$input != null) {
                        this._$control.appendChild(this.$input);
                    }
                }
                return this._$control;
            }
            getEditor() {
                var $input = document.createElement('input');
                $input.id = this.key;
                $input.className = 'bre-input';
                $input.setAttribute('type', 'text');
                $input.setAttribute('placeholder', this.placeholder);
                $input.value = this.value || '';
                return $input;
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
                var $editor = BrickyEditor.$dom.el(`
                <div class='bre-image-input'>
                    <label for="${this.key}">
                        ${this.placeholder}
                    </label>                        
                    <img src="${img}"/>                    
                    <input type="file" id="${this.key}" class="bre-input" placeholder="${this.placeholder}">
                </div>
                <small class='bre-image-input-filename'></small>`);
                var $file = $editor.querySelector('input');
                var $filePreview = $editor.querySelector('img');
                var $fileName = $editor.querySelector('.bre-image-input-filename');
                var value = this.value;
                field.updatePreview($filePreview, $fileName, this.value);
                $file.onchange = () => {
                    if ($file.files && $file.files[0]) {
                        var reader = new FileReader();
                        reader.onload = function (ev) {
                            let target = ev.target;
                            field._value = new Prompt.PromptParameterImageResult();
                            field._value.fileContent = target.result;
                            field._value.fileInfo = new Prompt.PromptParameterImageResultFile($file.files[0]);
                            field.updatePreview($filePreview, $fileName, field._value);
                        };
                        reader.readAsDataURL($file.files[0]);
                    }
                };
                return $editor;
            }
            updatePreview($filePreview, $fileName, value) {
                if (!value)
                    return;
                $filePreview.src = value.fileContent;
                $filePreview.classList.add('bre-loaded');
                $fileName.innerText = value.fileInfo.name;
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
                return BrickyEditor.$dom.el(`<select type="text" id="${this.key}" class="brickyeditor-input" placeholder="${this.placeholder}">${options}</select>`);
            }
        }
        Prompt.PromptParameterOptions = PromptParameterOptions;
    })(Prompt = BrickyEditor.Prompt || (BrickyEditor.Prompt = {}));
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
                    try {
                        const data = yield BrickyEditor.$ajax.jsonp(url);
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
            static loadTemplatesAsync(url, $editor, onError) {
                return __awaiter(this, void 0, void 0, function* () {
                    this.templates = [];
                    const templates = this.templates;
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const data = yield BrickyEditor.$ajax.get(url);
                            const $data = BrickyEditor.$dom.el(`<div>${data}</div>`);
                            const $style = BrickyEditor.$dom.select($data, 'style', false);
                            if ($style.length > 0) {
                                BrickyEditor.$dom.before($editor, $style);
                            }
                            const $groups = BrickyEditor.$dom.select($data, BrickyEditor.Selectors.selectorTemplateGroup);
                            $groups.forEach($group => {
                                const title = $group.getAttribute('title');
                                let templates = this.getTemplates($group, onError);
                                this.templates.push(new BrickyEditor.TemplateGroup(title, templates));
                                $group.remove();
                            });
                            let templates = this.getTemplates($data, onError);
                            let defaultGroupName = this.templates.length > 0 ? BrickyEditor.EditorStrings.defaultTemplatesGroupName : '';
                            let group = new BrickyEditor.TemplateGroup(defaultGroupName, templates);
                            this.templates.push(group);
                            resolve(this.templates);
                        }
                        catch (err) {
                            onError(BrickyEditor.EditorStrings.errorTemplatesFileNotFound(url));
                            reject(err);
                        }
                    }));
                });
            }
            static getTemplates($el, onError) {
                let templates = [];
                const $templates = BrickyEditor.$dom.select($el, BrickyEditor.Selectors.selectorTemplate);
                $templates.forEach($template => {
                    let template = new BrickyEditor.Template($template);
                    if (template.loaded) {
                        templates.push(template);
                    }
                    else {
                        onError(BrickyEditor.EditorStrings.errorTemplateParsing(template.name));
                    }
                });
                return templates;
            }
            static getTemplate(templateName) {
                for (var gi = 0; gi < this.templates.length; gi++) {
                    const group = this.templates[gi];
                    for (var ti = 0; ti < group.templates.length; ti++) {
                        const template = group.templates[ti];
                        if (template.name.breEqualsInvariant(templateName)) {
                            return template;
                        }
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
    class Template {
        constructor($template) {
            this.loaded = true;
            this.name = $template.dataset.name;
            this.$preview = BrickyEditor.$dom.first($template, BrickyEditor.Selectors.selectorTemplatePreview);
            if (this.$preview) {
                $template.removeChild(this.$preview);
            }
            this.$html = $template;
            if (!this.$preview) {
                let block = new BrickyEditor.Block(this, true);
                let blockHtml = block.getHtml(true);
                if (blockHtml === null) {
                    this.loaded = false;
                }
                else {
                    this.$preview = BrickyEditor.$dom.el(blockHtml);
                }
            }
        }
        getPreview() {
            let $template = BrickyEditor.$dom.el(`<div class='${BrickyEditor.Selectors.classTemplate}'></div>`);
            $template.appendChild(this.$preview);
            return $template;
        }
    }
    BrickyEditor.Template = Template;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    class TemplateGroup {
        constructor(name, templates) {
            this.name = name;
            this.templates = templates;
        }
    }
    BrickyEditor.TemplateGroup = TemplateGroup;
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
            let $panel = BrickyEditor.$dom.el('<div class="bre-html-tools-panel"></div>');
            this.buttons.forEach(b => {
                let $btn = this.getButtonElement(b.icon, b.command, b.range, b.aValueArgument);
                $panel.appendChild($btn);
            });
            this.$control = BrickyEditor.$dom.el('<div class="bre-html-tools bre-btn-group"></div>');
            this.$control.appendChild($panel);
            BrickyEditor.$dom.hide(this.$control);
            this.editor.$editor.appendChild(this.$control);
        }
        getButtonElement(icon, command, rangeCommand = true, aValueArgument = null) {
            let $btn = BrickyEditor.$dom.el(`<button type="button" class="bre-btn"><i class="fa fa-${icon}"></i></button>`);
            $btn.onclick = () => __awaiter(this, void 0, void 0, function* () {
                let selection = window.getSelection();
                let selectionRange = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
                if (rangeCommand && !selectionRange)
                    return;
                if (command == 'CreateLink') {
                    const params = this.getLinkPromptParamsInternal(selection);
                    const fields = yield BrickyEditor.Editor.UI.modal.promptAsync(params);
                    const link = BrickyEditor.HtmlLinkParams.getLinkFromParams(fields);
                    if (link.href) {
                        document.execCommand(command, false, link.href);
                        if (link.target) {
                            selection.anchorNode.parentElement.setAttribute('target', link.target);
                        }
                        if (link.title) {
                            selection.anchorNode.parentElement.setAttribute('title', link.title);
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
            });
            return $btn;
        }
        wrapSelectionToContainer(selection) {
            let $container = selection.anchorNode.parentElement;
            const $wrapper = BrickyEditor.$dom.el(`<div class="bre-temp-container" contenteditable="true">${$container.innerHTML}</div>`);
            $container.innerHTML = '';
            $container.removeAttribute(BrickyEditor.Selectors.attrContentEditable);
            $container.appendChild($wrapper);
            const range = document.createRange();
            range.selectNodeContents($wrapper);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        show(rect) {
            if (rect && rect.width > 1) {
                const $editor = this.editor.$editor;
                const offset = BrickyEditor.$dom.offset($editor);
                var editorWidth = $editor.clientWidth;
                var top = rect.top - offset.top + BrickyEditor.$dom.windowScrollTop() + rect.height;
                var controlWidth = this.$control.clientWidth;
                var left = rect.left - offset.left + rect.width / 2 - controlWidth / 2;
                if (left < 0) {
                    left = 0;
                }
                else if (left + controlWidth > editorWidth) {
                    left = editorWidth - controlWidth;
                }
                this.$control.style.top = `${top}px`;
                this.$control.style.left = `${left}px`;
                BrickyEditor.$dom.show(this.$control);
            }
            else {
                BrickyEditor.$dom.hide(this.$control);
            }
        }
        getLinkPromptParamsInternal(selection) {
            var link;
            if (selection && selection.anchorNode && selection.anchorNode.parentNode.nodeName.breEqualsInvariant('a')) {
                var $a = selection.anchorNode.parentNode;
                link = new BrickyEditor.HtmlLinkParams($a.getAttribute('href'), $a.getAttribute('title'), $a.getAttribute('target'));
            }
            else {
                link = new BrickyEditor.HtmlLinkParams();
            }
            return link.getLinkPromptParams();
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
            const modal = this;
            BrickyEditor.$dom.on($closeBtn, 'click', function () {
                modal.hideModal();
            });
        }
        hideModal() {
            this.restoreSelection();
            BrickyEditor.$dom.hide(this.$control);
        }
        showModal($html, showBtns = true) {
            this.saveSelection();
            BrickyEditor.$dom.toggle(this.$btns, showBtns);
            if ($html) {
                this.$form.appendChild($html);
                if (BrickyEditor.$dom.isHidden($html)) {
                    BrickyEditor.$dom.show($html);
                }
            }
            BrickyEditor.$dom.show(this.$control);
        }
        promptAsync(fields) {
            const modal = this;
            return new Promise((resolve, reject) => {
                for (var i = 0; i < modal.$form.children.length; i++) {
                    var child = modal.$form.children[i];
                    if (child != this.$btns) {
                        modal.$form.removeChild(child);
                    }
                }
                fields.forEach(field => {
                    BrickyEditor.$dom.before(this.$btns, field.$control);
                });
                BrickyEditor.$dom.on(modal.$okBtn, 'click', () => {
                    fields.forEach(field => field.parseValue());
                    modal.hideModal();
                    const list = new BrickyEditor.Prompt.PromptParameterList(fields);
                    resolve(list);
                });
                BrickyEditor.$dom.on(modal.$cancelBtn, 'click', () => {
                    modal.hideModal();
                    resolve(null);
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
            if (!BrickyEditor.$dom.matches($el, '[contenteditable]')) {
                return;
            }
            BrickyEditor.$dom.on($el, 'mouseup', () => {
                setTimeout(() => {
                    let rect = this.getSelectionRect();
                    handler(rect);
                }, 0);
            });
            BrickyEditor.$dom.on($el, 'keyup', (ev) => {
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
    Selectors.attrContentEditable = 'contenteditable';
    Selectors.selectorContentEditable = 'contenteditable';
    Selectors.attrField = 'data-bre-field';
    Selectors.selectorField = `[${Selectors.attrField}]`;
    Selectors.classEditor = 'bre-editor';
    Selectors.classTemplate = 'bre-template';
    Selectors.selectorTemplate = `.${Selectors.classTemplate}`;
    Selectors.classTemplateGroup = 'bre-template-group';
    Selectors.selectorTemplateGroup = `.${Selectors.classTemplateGroup}`;
    Selectors.selectorTemplatePreview = '.bre-template-preview';
    Selectors.classMobile = 'brickyeditor-tools-mobile';
    Selectors.htmlToolsCommand = 'data-bre-doc-command';
    Selectors.htmlToolsCommandRange = 'data-bre-doc-command-range';
    Selectors.selectorFieldSelected = 'bre-field-selected';
    Selectors.selectorFieldContainer = 'bre-field-container';
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
            this.$tools = BrickyEditor.$dom.el('<div class="bre bre-tools" data-bricky-tools></div>');
            this.$toolsTemplates = BrickyEditor.$dom.el('<div class="bre-tools-templates"></div>');
            this.$toolsLoader = BrickyEditor.$dom.el('<div class="bre-tools-loader"><b>Loading...</b></div>');
            this.$toolsHideBtn = BrickyEditor.$dom.el('<button type="button" class="bre-tools-toggle"><div>►</div></button>');
            this.$tools.appendChild(this.$toolsHideBtn);
            this.$tools.appendChild(this.$toolsLoader);
            this.$tools.appendChild(this.$toolsTemplates);
            this.$toolsHideBtn.onclick = ev => this.toggleTools();
            this.editor.$editor.appendChild(this.$tools);
            if (this.isCompactTools) {
                BrickyEditor.$dom.addClass(this.$tools, 'bre-tools-templates-compact');
                this.toggleTools();
            }
        }
        toggleTools() {
            BrickyEditor.$dom.toggleClass(this.$tools, 'bre-tools-collapsed', !BrickyEditor.$dom.hasClass(this.$toolsHideBtn, 'bre-tools-toggle-collapsed'));
            BrickyEditor.$dom.toggleClass(this.$toolsHideBtn, 'bre-tools-toggle-collapsed');
        }
        setModal() {
            let $modal = BrickyEditor.$dom.el('<div class="bre bre-modal"><div class="bre-modal-placeholder"></div></div>');
            let $modalCloseBtn = BrickyEditor.$dom.el(`<div class="bre-modal-close"><a href="#">${BrickyEditor.EditorStrings.buttonClose} ✖</a></div>`);
            let $modalContent = BrickyEditor.$dom.el('<div class="bre-modal-content"></div>');
            let $modalForm = BrickyEditor.$dom.el('<form></form>');
            let $modalBtns = BrickyEditor.$dom.el('<div class="bre-btns"></div>');
            let $modalOk = BrickyEditor.$dom.el(`<button type="button" class="bre-btn bre-btn-primary">${BrickyEditor.EditorStrings.buttonOk}</button>`);
            let $modalCancel = BrickyEditor.$dom.el(`<button type="button" class="bre-btn">${BrickyEditor.EditorStrings.buttonCancel}</button>`);
            $modalBtns.appendChild($modalOk);
            $modalBtns.appendChild($modalCancel);
            $modalForm.appendChild($modalBtns);
            $modalContent.appendChild($modalForm);
            let $placeholder = BrickyEditor.$dom.first($modal, '.bre-modal-placeholder');
            $placeholder.appendChild($modalCloseBtn);
            $placeholder.appendChild($modalContent);
            this.modal = new BrickyEditor.Modal($modal, $modalCloseBtn, $modalForm, $modalBtns, $modalOk, $modalCancel);
            this.editor.$editor.appendChild($modal);
        }
        toggleToolsLoader(toggle) {
            BrickyEditor.$dom.toggle(this.$toolsLoader, toggle);
        }
        setTemplates(templateGroups) {
            let editor = this.editor;
            templateGroups.forEach(group => {
                if (group.templates.length === 0)
                    return;
                let $header = BrickyEditor.$dom.el(`<div class='${BrickyEditor.Selectors.classTemplateGroup}'>${group.name}</div>`);
                this.$toolsTemplates.appendChild($header);
                let $group = BrickyEditor.$dom.el('<div></div>');
                group.templates.forEach(template => {
                    let $preview = template.getPreview();
                    $preview.setAttribute('title', template.name);
                    $preview.onclick = (ev) => {
                        editor.addBlock(template);
                        ev.stopPropagation();
                        return false;
                    };
                    $group.appendChild($preview);
                });
                BrickyEditor.$dom.on($header, 'click', () => {
                    BrickyEditor.$dom.toggle($group);
                });
                this.$toolsTemplates.appendChild($group);
            });
            ;
        }
        static initBtnDeck($btnsDeck) {
            var $btns = BrickyEditor.$dom.select($btnsDeck, '.bre-btn');
            var $firstBtn = $btns[0];
            BrickyEditor.$dom.on($firstBtn, 'click', (ev) => {
                UI.toggleBtnDeck($btnsDeck);
                ev.stopPropagation();
                return false;
            });
        }
        static toggleBtnDeck($btnsDeck, isOn) {
            var $btns = BrickyEditor.$dom.select($btnsDeck, '.bre-btn');
            if (!$btns || $btns.length == 0)
                return;
            var $firstBtn = $btns[0];
            var size = 32;
            var gap = size / 6;
            isOn = isOn || $btnsDeck.dataset['isOn'] || false;
            if (isOn) {
                $btnsDeck.style.height = '0';
                $btnsDeck.style.width = '0';
                $btns.forEach(($btn, idx) => {
                    if (idx === 0)
                        return;
                    $btn.style.opacity = '0';
                    $btn.style.top = '0';
                    $btn.style.left = '0';
                });
            }
            else {
                $btns.forEach(($btn, idx) => {
                    if (idx === 0)
                        return;
                    $btn.style.opacity = '1';
                    $btn.style.left = `${(idx + 1) * (size + gap)}px`;
                });
                $btnsDeck.style.height = `${size}px`;
                $btnsDeck.style.width = `${(size + gap) * $btns.length - gap}px`;
            }
            BrickyEditor.$dom.toggleClass($firstBtn, 'bre-btn-active', !isOn);
            $btnsDeck.dataset['isOn'] = String(!isOn);
        }
    }
    BrickyEditor.UI = UI;
})(BrickyEditor || (BrickyEditor = {}));
