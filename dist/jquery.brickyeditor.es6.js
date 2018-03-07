
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define("Common/DOMHelpers", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
            el.style.display = 'block';
        }
        static isHidden(el) {
            var style = window.getComputedStyle(el);
            return (style.display === 'none');
        }
        static toggle(el, force) {
            const show = force ? force.valueOf() : this.isHidden(el);
            if (show)
                this.show(el);
            else
                this.hide(el);
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
    exports.$dom = $dom;
});
define("UI/Selectors", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.Selectors = Selectors;
});
define("Templates/Template", ["require", "exports", "Common/DOMHelpers", "UI/Selectors", "Block/Block"], function (require, exports, DOMHelpers_1, Selectors_1, Block_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Template {
        constructor($template) {
            this.loaded = true;
            this.name = $template.dataset.name;
            this.$preview = DOMHelpers_1.$dom.first($template, Selectors_1.Selectors.selectorTemplatePreview);
            if (this.$preview) {
                $template.removeChild(this.$preview);
            }
            this.$html = $template;
            if (!this.$preview) {
                let block = new Block_1.Block(this, true);
                let blockHtml = block.getHtml(true);
                if (blockHtml === null) {
                    this.loaded = false;
                }
                else {
                    this.$preview = DOMHelpers_1.$dom.el(blockHtml);
                }
            }
        }
        getPreview() {
            let $template = DOMHelpers_1.$dom.el(`<div class='${Selectors_1.Selectors.classTemplate}'></div>`);
            $template.appendChild(this.$preview);
            return $template;
        }
    }
    exports.Template = Template;
});
define("Block/BlockUIAction", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BlockUIAction {
        constructor(icon, action, title) {
            this.icon = icon;
            this.action = action;
            this.title = title;
        }
    }
    exports.BlockUIAction = BlockUIAction;
});
define("Common/Common", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.Common = Common;
});
define("Fields/BaseField", ["require", "exports", "Common/DOMHelpers", "Fields/Fields", "Common/Common", "UI/Selectors"], function (require, exports, DOMHelpers_2, Fields_1, Common_1, Selectors_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
            Fields_1.HtmlField.registerField();
            Fields_1.ImageField.registerField();
            Fields_1.EmbedField.registerField();
            Fields_1.ContainerField.registerField();
        }
        ;
        static registerField() {
            if (this._fields.hasOwnProperty(this.type)) {
                delete this._fields[this.type];
            }
            this._fields[this.type] = this;
        }
        static createField($field, data, onSelect, onUpdate, onUpload) {
            let fieldData = DOMHelpers_2.$dom.data($field, 'breField');
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
                    fieldData = Common_1.Common.extend(fieldData, addFieldData);
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
            this.$field.classList.add(Selectors_2.Selectors.selectorFieldSelected);
            this.onSelect(this);
        }
        deselect() {
            this.$field.classList.remove(Selectors_2.Selectors.selectorFieldSelected);
        }
        getEl() {
            let $el = this.$field.cloneNode(true);
            $el.attributes.removeNamedItem(Selectors_2.Selectors.attrField);
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
    exports.BaseField = BaseField;
});
define("Fields/ContainerField", ["require", "exports", "Common/DOMHelpers", "UI/Selectors", "BlocksContainer", "Fields/BaseField"], function (require, exports, DOMHelpers_3, Selectors_3, BlocksContainer_1, BaseField_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ContainerField extends BaseField_1.BaseField {
        bind() {
            let field = this;
            let $field = this.$field;
            this.container = new BlocksContainer_1.BlocksContainer($field, (block) => {
                field.updateBlocks();
            }, (block) => { field.updateBlocks(); }, (block) => { this.select(); }, (block) => { }, (block) => { field.updateBlocks(); }, (block) => { field.updateBlocks(); }, field.onUpload, true);
            DOMHelpers_3.$dom.addClass($field, Selectors_3.Selectors.selectorFieldContainer);
            DOMHelpers_3.$dom.on($field, 'click', (ev) => {
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
            this.$field.classList.remove(Selectors_3.Selectors.selectorFieldSelected);
        }
        getEl() {
            const html = this.container.getHtml();
            return DOMHelpers_3.$dom.el(html);
        }
    }
    exports.ContainerField = ContainerField;
});
define("Common/AJAXHelper", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.$ajax = $ajax;
});
define("EditorStrings", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.EditorStrings = EditorStrings;
});
define("Services/EmbedService", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EmbedService {
        constructor() {
        }
        static getEmbedAsync(embedUrl) {
            const url = `https://noembed.com/embed?url=${embedUrl}`;
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield $ajax.jsonp(url);
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
    exports.EmbedService = EmbedService;
});
define("Templates/TemplateGroup", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TemplateGroup {
        constructor(name, templates) {
            this.name = name;
            this.templates = templates;
        }
    }
    exports.TemplateGroup = TemplateGroup;
});
define("Services/TemplateService", ["require", "exports", "EditorStrings", "Templates/Template", "Common/DOMHelpers", "Common/AJAXHelper", "UI/Selectors", "Templates/TemplateGroup"], function (require, exports, EditorStrings_1, Template_1, DOMHelpers_4, AJAXHelper_1, Selectors_4, TemplateGroup_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TemplateService {
        static loadTemplatesAsync(url, $editor, onError) {
            return __awaiter(this, void 0, void 0, function* () {
                this.templates = [];
                const templates = this.templates;
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const data = yield AJAXHelper_1.$ajax.get(url);
                        const $data = DOMHelpers_4.$dom.el(`<div>${data}</div>`);
                        const $style = DOMHelpers_4.$dom.select($data, 'style', false);
                        if ($style.length > 0) {
                            DOMHelpers_4.$dom.before($editor, $style);
                        }
                        const $groups = DOMHelpers_4.$dom.select($data, Selectors_4.Selectors.selectorTemplateGroup);
                        $groups.forEach($group => {
                            const title = $group.getAttribute('title');
                            let templates = this.getTemplates($group, onError);
                            this.templates.push(new TemplateGroup_1.TemplateGroup(title, templates));
                            $group.remove();
                        });
                        let templates = this.getTemplates($data, onError);
                        let defaultGroupName = this.templates.length > 0 ? EditorStrings_1.EditorStrings.defaultTemplatesGroupName : '';
                        let group = new TemplateGroup_1.TemplateGroup(defaultGroupName, templates);
                        this.templates.push(group);
                        resolve(this.templates);
                    }
                    catch (err) {
                        onError(EditorStrings_1.EditorStrings.errorTemplatesFileNotFound(url));
                        reject(err);
                    }
                }));
            });
        }
        static getTemplates($el, onError) {
            let templates = [];
            const $templates = DOMHelpers_4.$dom.select($el, Selectors_4.Selectors.selectorTemplate);
            $templates.forEach($template => {
                let template = new Template_1.Template($template);
                if (template.loaded) {
                    templates.push(template);
                }
                else {
                    onError(EditorStrings_1.EditorStrings.errorTemplateParsing(template.name));
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
    exports.TemplateService = TemplateService;
});
define("Services/Services", ["require", "exports", "Services/EmbedService", "Services/TemplateService"], function (require, exports, EmbedService_1, TemplateService_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(EmbedService_1);
    __export(TemplateService_1);
});
define("Events", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.Events = Events;
});
define("Prompt/PromptParameter", ["require", "exports", "Common/DOMHelpers"], function (require, exports, DOMHelpers_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
                this._$control = DOMHelpers_5.$dom.el(`<div class=${this.key ? "bre-prompt-field" : "bre-prompt-subtitle"}>
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
    exports.PromptParameter = PromptParameter;
});
define("Prompt/PromptParameterImage", ["require", "exports", "Prompt/Prompt", "Common/DOMHelpers"], function (require, exports, Prompt_1, DOMHelpers_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PromptParameterImage extends Prompt_1.PromptParameter {
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
            var $editor = DOMHelpers_6.$dom.el(`
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
                        field._value = new Prompt_1.PromptParameterImageResult();
                        field._value.fileContent = target.result;
                        field._value.fileInfo = new Prompt_1.PromptParameterImageResultFile($file.files[0]);
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
    exports.PromptParameterImage = PromptParameterImage;
});
define("Prompt/PromptParameterImageResult", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PromptParameterImageResult {
    }
    exports.PromptParameterImageResult = PromptParameterImageResult;
    class PromptParameterImageResultFile {
        constructor(file) {
            this.name = file.name;
            this.size = file.size;
            this.type = file.type;
            this.lastModified = file.lastModified;
            this.lastModifiedDate = file.lastModifiedDate;
        }
    }
    exports.PromptParameterImageResultFile = PromptParameterImageResultFile;
});
define("Prompt/PromptParameterList", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.PromptParameterList = PromptParameterList;
});
define("Prompt/PromptParameterOption", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PromptParameterOption {
        constructor(title, value, selected = false) {
            this.title = title;
            this.value = value;
            this.selected = selected;
        }
    }
    exports.PromptParameterOption = PromptParameterOption;
});
define("Prompt/PromptParameterOptions", ["require", "exports", "Common/DOMHelpers", "Prompt/Prompt"], function (require, exports, DOMHelpers_7, Prompt_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PromptParameterOptions extends Prompt_2.PromptParameter {
        constructor(key, title, options, value, placeholder) {
            super(key, title, value, placeholder);
            this.options = [];
            options.forEach(kv => {
                this.options.push(new Prompt_2.PromptParameterOption(kv[0], kv[1], kv[1] == value));
            });
        }
        getEditor() {
            var options = this.options.map(opt => {
                return `<option value="${opt.value}" ${opt.selected ? "selected" : ""}>${opt.title ? opt.title : opt.value}</option>`;
            });
            return DOMHelpers_7.$dom.el(`<select type="text" id="${this.key}" class="brickyeditor-input" placeholder="${this.placeholder}">${options}</select>`);
        }
    }
    exports.PromptParameterOptions = PromptParameterOptions;
});
define("Prompt/Prompt", ["require", "exports", "Prompt/PromptParameter", "Prompt/PromptParameterImage", "Prompt/PromptParameterImageResult", "Prompt/PromptParameterList", "Prompt/PromptParameterOption", "Prompt/PromptParameterOptions"], function (require, exports, PromptParameter_1, PromptParameterImage_1, PromptParameterImageResult_1, PromptParameterList_1, PromptParameterOption_1, PromptParameterOptions_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(PromptParameter_1);
    __export(PromptParameterImage_1);
    __export(PromptParameterImageResult_1);
    __export(PromptParameterList_1);
    __export(PromptParameterOption_1);
    __export(PromptParameterOptions_1);
});
define("HtmlLinkParams", ["require", "exports", "Prompt/Prompt", "EditorStrings"], function (require, exports, Prompt_3, EditorStrings_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class HtmlLinkParams {
        constructor(href = '', title = '', target = '') {
            this.href = href;
            this.title = title;
            this.target = target;
        }
        getLinkPromptParams() {
            return [
                new Prompt_3.PromptParameter('href', EditorStrings_2.EditorStrings.htmlEditorLinkUrlTitle, this.href, EditorStrings_2.EditorStrings.htmlEditorLinkUrlPlaceholder),
                new Prompt_3.PromptParameter('title', EditorStrings_2.EditorStrings.htmlEditorLinkTitleTitle, this.title, EditorStrings_2.EditorStrings.htmlEditorLinkTitlePlaceholder),
                new Prompt_3.PromptParameterOptions('target', EditorStrings_2.EditorStrings.htmlEditorLinkTargetTitle, [
                    ['', ''],
                    [EditorStrings_2.EditorStrings.htmlEditorLinkTargetBlank, '_blank'],
                    [EditorStrings_2.EditorStrings.htmlEditorLinkTargetSelf, '_self'],
                    [EditorStrings_2.EditorStrings.htmlEditorLinkTargetParent, '_parent'],
                    [EditorStrings_2.EditorStrings.htmlEditorLinkTargetTop, '_top'],
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
    exports.HtmlLinkParams = HtmlLinkParams;
});
define("UI/HtmlTools", ["require", "exports", "Common/DOMHelpers", "Editor", "HtmlLinkParams", "UI/Selectors"], function (require, exports, DOMHelpers_8, Editor_1, HtmlLinkParams_1, Selectors_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
            let $panel = DOMHelpers_8.$dom.el('<div class="bre-html-tools-panel"></div>');
            this.buttons.forEach(b => {
                let $btn = this.getButtonElement(b.icon, b.command, b.range, b.aValueArgument);
                $panel.appendChild($btn);
            });
            this.$control = DOMHelpers_8.$dom.el('<div class="bre-html-tools bre-btn-group"></div>');
            this.$control.appendChild($panel);
            DOMHelpers_8.$dom.hide(this.$control);
            this.editor.$editor.appendChild(this.$control);
        }
        getButtonElement(icon, command, rangeCommand = true, aValueArgument = null) {
            let $btn = DOMHelpers_8.$dom.el(`<button type="button" class="bre-btn"><i class="fa fa-${icon}"></i></button>`);
            $btn.onclick = () => __awaiter(this, void 0, void 0, function* () {
                let selection = window.getSelection();
                let selectionRange = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
                if (rangeCommand && !selectionRange)
                    return;
                if (command == 'CreateLink') {
                    const params = this.getLinkPromptParamsInternal(selection);
                    const fields = yield Editor_1.Editor.UI.modal.promptAsync(params);
                    const link = HtmlLinkParams_1.HtmlLinkParams.getLinkFromParams(fields);
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
            const $wrapper = DOMHelpers_8.$dom.el(`<div class="bre-temp-container" contenteditable="true">${$container.innerHTML}</div>`);
            $container.innerHTML = '';
            $container.removeAttribute(Selectors_5.Selectors.attrContentEditable);
            $container.appendChild($wrapper);
            const range = document.createRange();
            range.selectNodeContents($wrapper);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        show(rect) {
            if (rect && rect.width > 1) {
                const $editor = this.editor.$editor;
                const offset = DOMHelpers_8.$dom.offset($editor);
                var editorWidth = $editor.clientWidth;
                var top = rect.top - offset.top + DOMHelpers_8.$dom.windowScrollTop() + rect.height;
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
                DOMHelpers_8.$dom.show(this.$control);
            }
            else {
                DOMHelpers_8.$dom.hide(this.$control);
            }
        }
        getLinkPromptParamsInternal(selection) {
            var link;
            if (selection && selection.anchorNode && selection.anchorNode.parentNode.nodeName.breEqualsInvariant('a')) {
                var $a = selection.anchorNode.parentNode;
                link = new HtmlLinkParams_1.HtmlLinkParams($a.getAttribute('href'), $a.getAttribute('title'), $a.getAttribute('target'));
            }
            else {
                link = new HtmlLinkParams_1.HtmlLinkParams();
            }
            return link.getLinkPromptParams();
        }
    }
    exports.HtmlTools = HtmlTools;
});
define("UI/Modal", ["require", "exports", "Common/DOMHelpers", "Prompt/Prompt"], function (require, exports, DOMHelpers_9, Prompt_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Modal {
        constructor($control, $closeBtn, $form, $btns, $okBtn, $cancelBtn) {
            this.$control = $control;
            this.$closeBtn = $closeBtn;
            this.$form = $form;
            this.$btns = $btns;
            this.$okBtn = $okBtn;
            this.$cancelBtn = $cancelBtn;
            const modal = this;
            DOMHelpers_9.$dom.on($closeBtn, 'click', function () {
                modal.hideModal();
            });
        }
        hideModal() {
            this.restoreSelection();
            DOMHelpers_9.$dom.hide(this.$control);
        }
        showModal($html, showBtns = true) {
            this.saveSelection();
            DOMHelpers_9.$dom.toggle(this.$btns, showBtns);
            if ($html) {
                this.$form.appendChild($html);
                if (DOMHelpers_9.$dom.isHidden($html)) {
                    DOMHelpers_9.$dom.show($html);
                }
            }
            DOMHelpers_9.$dom.show(this.$control);
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
                    DOMHelpers_9.$dom.before(this.$btns, field.$control);
                });
                DOMHelpers_9.$dom.on(modal.$okBtn, 'click', () => {
                    fields.forEach(field => field.parseValue());
                    modal.hideModal();
                    const list = new Prompt_4.PromptParameterList(fields);
                    resolve(list);
                });
                DOMHelpers_9.$dom.on(modal.$cancelBtn, 'click', () => {
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
    exports.Modal = Modal;
});
define("UI/UI", ["require", "exports", "Common/DOMHelpers", "UI/Selectors", "EditorStrings", "UI/HtmlTools", "UI/Modal"], function (require, exports, DOMHelpers_10, Selectors_6, EditorStrings_3, HtmlTools_1, Modal_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class UI {
        constructor(editor) {
            this.editor = editor;
            this.editor = editor;
            this.setTools();
            this.setModal();
            this.htmlTools = new HtmlTools_1.HtmlTools(this.editor);
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
            this.$tools = DOMHelpers_10.$dom.el('<div class="bre bre-tools" data-bricky-tools></div>');
            this.$toolsTemplates = DOMHelpers_10.$dom.el('<div class="bre-tools-templates"></div>');
            this.$toolsLoader = DOMHelpers_10.$dom.el('<div class="bre-tools-loader"><b>Loading...</b></div>');
            this.$toolsHideBtn = DOMHelpers_10.$dom.el('<button type="button" class="bre-tools-toggle"><div>►</div></button>');
            this.$tools.appendChild(this.$toolsHideBtn);
            this.$tools.appendChild(this.$toolsLoader);
            this.$tools.appendChild(this.$toolsTemplates);
            this.$toolsHideBtn.onclick = ev => this.toggleTools();
            this.editor.$editor.appendChild(this.$tools);
            if (this.isCompactTools) {
                DOMHelpers_10.$dom.addClass(this.$tools, 'bre-tools-templates-compact');
                this.toggleTools();
            }
        }
        toggleTools() {
            DOMHelpers_10.$dom.toggleClass(this.$tools, 'bre-tools-collapsed', !DOMHelpers_10.$dom.hasClass(this.$toolsHideBtn, 'bre-tools-toggle-collapsed'));
            DOMHelpers_10.$dom.toggleClass(this.$toolsHideBtn, 'bre-tools-toggle-collapsed');
        }
        setModal() {
            let $modal = DOMHelpers_10.$dom.el('<div class="bre bre-modal"><div class="bre-modal-placeholder"></div></div>');
            let $modalCloseBtn = DOMHelpers_10.$dom.el(`<div class="bre-modal-close"><a href="#">${EditorStrings_3.EditorStrings.buttonClose} ✖</a></div>`);
            let $modalContent = DOMHelpers_10.$dom.el('<div class="bre-modal-content"></div>');
            let $modalForm = DOMHelpers_10.$dom.el('<form></form>');
            let $modalBtns = DOMHelpers_10.$dom.el('<div class="bre-btns"></div>');
            let $modalOk = DOMHelpers_10.$dom.el(`<button type="button" class="bre-btn bre-btn-primary">${EditorStrings_3.EditorStrings.buttonOk}</button>`);
            let $modalCancel = DOMHelpers_10.$dom.el(`<button type="button" class="bre-btn">${EditorStrings_3.EditorStrings.buttonCancel}</button>`);
            $modalBtns.appendChild($modalOk);
            $modalBtns.appendChild($modalCancel);
            $modalForm.appendChild($modalBtns);
            $modalContent.appendChild($modalForm);
            let $placeholder = DOMHelpers_10.$dom.first($modal, '.bre-modal-placeholder');
            $placeholder.appendChild($modalCloseBtn);
            $placeholder.appendChild($modalContent);
            this.modal = new Modal_1.Modal($modal, $modalCloseBtn, $modalForm, $modalBtns, $modalOk, $modalCancel);
            this.editor.$editor.appendChild($modal);
        }
        toggleToolsLoader(toggle) {
            DOMHelpers_10.$dom.toggle(this.$toolsLoader, toggle);
        }
        setTemplates(templateGroups) {
            let editor = this.editor;
            templateGroups.forEach(group => {
                if (group.templates.length === 0)
                    return;
                let $header = DOMHelpers_10.$dom.el(`<div class='${Selectors_6.Selectors.classTemplateGroup}'>${group.name}</div>`);
                this.$toolsTemplates.appendChild($header);
                let $group = DOMHelpers_10.$dom.el('<div></div>');
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
                DOMHelpers_10.$dom.on($header, 'click', () => {
                    DOMHelpers_10.$dom.toggle($group);
                });
                this.$toolsTemplates.appendChild($group);
            });
            ;
        }
        static initBtnDeck($btnsDeck) {
            var $btns = DOMHelpers_10.$dom.select($btnsDeck, '.bre-btn');
            var $firstBtn = $btns[0];
            DOMHelpers_10.$dom.on($firstBtn, 'click', (ev) => {
                UI.toggleBtnDeck($btnsDeck);
                ev.stopPropagation();
                return false;
            });
        }
        static toggleBtnDeck($btnsDeck, isOn) {
            var $btns = DOMHelpers_10.$dom.select($btnsDeck, '.bre-btn');
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
            DOMHelpers_10.$dom.toggleClass($firstBtn, 'bre-btn-active', !isOn);
            $btnsDeck.dataset['isOn'] = String(!isOn);
        }
    }
    exports.UI = UI;
});
define("EditorOptions", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.EditorOptions = EditorOptions;
});
define("Editor", ["require", "exports", "Common/DOMHelpers", "Common/AJAXHelper", "BlocksContainer", "EditorStrings", "Services/Services", "Events", "Fields/Fields", "UI/Selectors", "UI/UI", "Common/Common", "EditorOptions"], function (require, exports, DOMHelpers_11, AJAXHelper_2, BlocksContainer_2, EditorStrings_4, Services_1, Events_1, Fields_2, Selectors_7, UI_1, Common_2, EditorOptions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Editor {
        constructor($editor, options) {
            this.onError = (message, code = 0) => this.options.onError({ message: message, code: code });
            Fields_2.BaseField.registerCommonFields();
            this.$editor = $editor;
            this.$editor.classList.add(Selectors_7.Selectors.classEditor);
            this.options = new EditorOptions_1.EditorOptions(options);
            this.container = this.createContainer();
            Editor.UI = new UI_1.UI(this);
            this.tryBindFormSubmit();
        }
        createContainer() {
            const onAdd = (block, idx) => {
                if (this.isLoaded) {
                    this.trigger(Events_1.Events.onBlockAdd, { block: block, idx: idx });
                    this.trigger(Events_1.Events.onChange, { blocks: this.getData(), html: this.getHtml() });
                }
            };
            const onDelete = (block, idx) => {
                this.trigger(Events_1.Events.onBlockDelete, { block: block, idx: idx });
                this.trigger(Events_1.Events.onChange, { blocks: this.getData(), html: this.getHtml() });
            };
            const onUpdate = (block, property, oldValue, newValue) => {
                this.trigger(Events_1.Events.onBlockUpdate, {
                    block: block,
                    property: property,
                    oldValue: oldValue,
                    newValue: newValue
                });
                this.trigger(Events_1.Events.onChange, { blocks: this.getData(), html: this.getHtml() });
            };
            return new BlocksContainer_2.BlocksContainer(this.$editor, onAdd, onDelete, (block) => { this.trigger(Events_1.Events.onBlockSelect, { block: block }); }, (block) => { this.trigger(Events_1.Events.onBlockDeselect, { block: block }); }, (block, from, to) => {
                this.trigger(Events_1.Events.onBlockMove, { block: block, from: from, to: to });
                this.trigger(Events_1.Events.onChange, { blocks: this.getData(), html: this.getHtml() });
            }, onUpdate, this.options.onUpload);
        }
        initAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                const editor = this;
                Editor.UI.toggleToolsLoader(true);
                const templates = yield Services_1.TemplateService.loadTemplatesAsync(editor.options.templatesUrl, editor.$editor, editor.onError);
                Editor.UI.toggleToolsLoader(false);
                Editor.UI.setTemplates(templates);
                const blocks = yield this.tryLoadInitialBlocksAsync();
                this.loadBlocks(blocks);
                this.isLoaded = true;
                this.trigger(Events_1.Events.onLoad, this);
            });
        }
        tryLoadInitialBlocksAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                const url = this.options.blocksUrl;
                const editor = this;
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    if (url) {
                        try {
                            const blocks = yield AJAXHelper_2.$ajax.get(url);
                            resolve(blocks);
                        }
                        catch (error) {
                            editor.onError(EditorStrings_4.EditorStrings.errorBlocksFileNotFound(url));
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
            const $form = this.options.formSelector ? DOMHelpers_11.$dom.find(this.options.formSelector) : null;
            const $input = this.options.inputSelector ? DOMHelpers_11.$dom.find(this.options.inputSelector) : null;
            if (!$form || !$input || !($input instanceof HTMLInputElement)) {
                return;
            }
            DOMHelpers_11.$dom.on($form, 'submit', () => {
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
                    let template = Services_1.TemplateService.getTemplate(block.template);
                    if (template) {
                        this.container.addBlock(template, block.fields, null, false);
                    }
                    else {
                        const message = EditorStrings_4.EditorStrings.errorBlockTemplateNotFound(block.template);
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
            DOMHelpers_11.$dom.trigger(this.$editor, 'bre.' + event, data);
            Common_2.Common.propsEach(editor.options, (key, value) => {
                if (key.breEqualsInvariant(event) && value) {
                    value(data);
                }
            });
        }
    }
    exports.Editor = Editor;
});
define("Fields/EmbedField", ["require", "exports", "Common/DOMHelpers", "Fields/BaseField", "Editor", "EditorStrings", "Common/AJAXHelper", "Prompt/Prompt", "Services/Services"], function (require, exports, DOMHelpers_12, BaseField_2, Editor_2, EditorStrings_5, AJAXHelper_3, Prompt_5, Services_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EmbedField extends BaseField_2.BaseField {
        getSettingsEl() {
            let $el = DOMHelpers_12.$dom.el('<div style="position: absolute;width: 100%; height: 100px;;text-align: center;font-weight: bold;vertical-align: middle;background: #333;opacity: 0.2;">Change embed element link</div>');
            DOMHelpers_12.$dom.before(this.$field, $el);
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
            DOMHelpers_12.$dom.on($field, 'click', () => __awaiter(this, void 0, void 0, function* () {
                this.showEmbedLoaderAsync(field);
            }));
            field.loadMedia(false);
        }
        showEmbedLoaderAsync(field) {
            return __awaiter(this, void 0, void 0, function* () {
                const fields = yield Editor_2.Editor.UI.modal.promptAsync(field.getPromptParams());
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
                new Prompt_5.PromptParameter('url', EditorStrings_5.EditorStrings.embedFieldLinkTitle, this.data.url || 'http://instagr.am/p/BO9VX2Vj4fF/', EditorStrings_5.EditorStrings.embedFieldLinkPlaceholder)
            ];
        }
        loadMedia(fireUpdate) {
            return __awaiter(this, void 0, void 0, function* () {
                let field = this;
                if (!field.data || !field.data.url)
                    return;
                const json = yield Services_2.EmbedService.getEmbedAsync(field.data.url);
                field.setEmbed(json, fireUpdate);
                const $embed = DOMHelpers_12.$dom.el(json.html);
                const $script = DOMHelpers_12.$dom.first($embed, 'script');
                if ($script) {
                    $script.remove();
                    var scriptSrc = $script.src;
                    if (scriptSrc.breStartsWith('//')) {
                        scriptSrc = "https:" + scriptSrc;
                        AJAXHelper_3.$ajax.getScript(scriptSrc)
                            .then(() => {
                            Services_2.EmbedService.processEmbed(json.provider_name);
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
    exports.EmbedField = EmbedField;
});
define("Fields/HtmlField", ["require", "exports", "Common/DOMHelpers", "UI/Selectors", "Fields/BaseField", "Editor"], function (require, exports, DOMHelpers_13, Selectors_8, BaseField_3, Editor_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class HtmlField extends BaseField_3.BaseField {
        bind() {
            let field = this;
            let $field = this.$field;
            if (!DOMHelpers_13.$dom.matches($field, Selectors_8.Selectors.selectorContentEditable)) {
                $field.setAttribute(Selectors_8.Selectors.attrContentEditable, 'true');
            }
            var html = this.data.html || this.$field.innerHTML;
            this.setHtml(html, false);
            $field.innerHTML = this.data.html;
            SelectionUtils.bindTextSelection($field, (rect) => {
                Editor_3.Editor.UI.htmlTools.show(rect);
            });
            DOMHelpers_13.$dom.ons($field, 'blur keyup paste input', ev => {
                this.setHtml($field.innerHTML);
            });
            DOMHelpers_13.$dom.on($field, 'paste', e => {
                e.preventDefault();
                let ev = e.originalEvent;
                let text = ev.clipboardData.getData('text/plain');
                document.execCommand("insertHTML", false, text);
            });
            DOMHelpers_13.$dom.on($field, 'click', ev => {
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
            $el.removeAttribute(Selectors_8.Selectors.attrContentEditable);
            return $el;
        }
    }
    exports.HtmlField = HtmlField;
});
define("Fields/ImageField", ["require", "exports", "Fields/BaseField", "Editor", "Common/DOMHelpers", "Prompt/Prompt", "HtmlLinkParams", "EditorStrings"], function (require, exports, BaseField_4, Editor_4, DOMHelpers_14, Prompt_6, HtmlLinkParams_2, EditorStrings_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ImageField extends BaseField_4.BaseField {
        bind() {
            let field = this;
            let data = this.data;
            this.setSrc(this.data.src, false);
            DOMHelpers_14.$dom.on(this.$field, 'click', () => __awaiter(this, void 0, void 0, function* () {
                const fields = yield Editor_4.Editor.UI.modal.promptAsync(field.getPromptParams());
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
                    const link = HtmlLinkParams_2.HtmlLinkParams.getLinkFromParams(fields);
                    this.setLink(link);
                }
                field.select();
            }));
        }
        getPromptParams() {
            var params = [
                new Prompt_6.PromptParameter('src', EditorStrings_6.EditorStrings.imageFieldLinkTitle, this.data.url, EditorStrings_6.EditorStrings.imageFieldLinkPlaceholder),
                new Prompt_6.PromptParameterImage('file', EditorStrings_6.EditorStrings.imageFieldUploadTitle, this.data.file, EditorStrings_6.EditorStrings.imageFieldUploadButton),
                new Prompt_6.PromptParameter('alt', EditorStrings_6.EditorStrings.imageFieldAltTitle, this.data.alt, EditorStrings_6.EditorStrings.imageFieldAltPlaceholder),
                new Prompt_6.PromptParameter(null, EditorStrings_6.EditorStrings.imageFieldUrlSubtitle, null, null),
            ];
            const link = this.data.link ? this.data.link : new HtmlLinkParams_2.HtmlLinkParams();
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
                    this.$link = DOMHelpers_14.$dom.el(`<a href='${url.href}' title='${url.title}' target='${url.target}'></a>`);
                    DOMHelpers_14.$dom.on(this.$link, 'click', ev => {
                        ev.stopPropagation();
                        return false;
                    });
                    DOMHelpers_14.$dom.wrap(this.$field, this.$link);
                }
                else {
                    this.$link.href = url.href;
                }
            }
            else if (this.$link) {
                DOMHelpers_14.$dom.unwrap(this.$field);
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
                const $link = DOMHelpers_14.$dom.el(`<a href='${link.href}' title='${link.title}' target='${link.target}'></a>`);
                $link.appendChild($el);
                return $link;
            }
            return $el;
        }
    }
    exports.ImageField = ImageField;
});
define("Fields/Fields", ["require", "exports", "Fields/BaseField", "Fields/ContainerField", "Fields/EmbedField", "Fields/HtmlField", "Fields/ImageField"], function (require, exports, BaseField_5, ContainerField_1, EmbedField_1, HtmlField_1, ImageField_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(BaseField_5);
    __export(ContainerField_1);
    __export(EmbedField_1);
    __export(HtmlField_1);
    __export(ImageField_1);
});
define("Block/BlockUI", ["require", "exports", "Common/DOMHelpers", "UI/UI"], function (require, exports, DOMHelpers_15, UI_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BlockUI {
        delete() {
            this.$editor.remove();
        }
        constructor($block, preview, actions, onSelect) {
            this.$block = $block;
            this.onSelect = onSelect;
            if (!preview) {
                this.buildEditorUI(actions);
            }
        }
        toggleSelection(isOn) {
            this.$editor.classList.toggle("bre-selected", isOn);
        }
        buildEditorUI(actions) {
            this.$tools = DOMHelpers_15.$dom.el('<div class="bre-block-tools bre-btn-deck"></div>');
            actions.forEach(action => {
                var $btn = this.buildButton(action);
                this.$tools.appendChild($btn);
            });
            UI_2.UI.initBtnDeck(this.$tools);
            this.$editor = DOMHelpers_15.$dom.el('<div class="bre-block-wrapper"></div>');
            this.$editor.appendChild(this.$tools);
            this.$editor.appendChild(this.$block);
            DOMHelpers_15.$dom.on(this.$editor, 'mouseover', () => {
                this.$editor.classList.add('bre-active');
            });
            DOMHelpers_15.$dom.on(this.$editor, 'mouseout', () => {
                this.$editor.classList.remove('bre-active');
            });
            DOMHelpers_15.$dom.on(this.$editor, 'click', () => {
                this.onSelect();
            });
        }
        buildButton(action) {
            let $el = DOMHelpers_15.$dom.el(`<button type="button" class="bre-btn"><i class="fa fa-${action.icon}"></i></button>`);
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
    exports.BlockUI = BlockUI;
});
define("Block/Block", ["require", "exports", "Common/DOMHelpers", "UI/Selectors", "Block/BlockUIAction", "Fields/Fields", "Block/BlockUI"], function (require, exports, DOMHelpers_16, Selectors_9, BlockUIAction_1, Fields_3, BlockUI_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
            const $block = DOMHelpers_16.$dom.el(template.$html.innerHTML);
            this.bindFields($block, data);
            const actions = this.getActions();
            this.ui = new BlockUI_1.BlockUI($block, preview, actions, () => this.select());
        }
        isContainer() {
            if (!this.selectedField)
                return false;
            return this.selectedField instanceof Fields_3.ContainerField;
        }
        bindFields($block, data) {
            const block = this;
            const $fields = DOMHelpers_16.$dom.select($block, Selectors_9.Selectors.selectorField, true);
            $fields.forEach($elem => {
                const onUpdate = (property, oldValue, newValue) => {
                    if (block.onUpdate) {
                        block.onUpdate(block, property, oldValue, newValue);
                    }
                };
                const onSelect = (field) => {
                    block.select(field);
                };
                let field = Fields_3.BaseField.createField($elem, data, onSelect, onUpdate, block.onUpload);
                block.fields.push(field);
            });
        }
        getActions() {
            const block = this;
            let actions = [
                new BlockUIAction_1.BlockUIAction('ellipsis-h'),
                new BlockUIAction_1.BlockUIAction('trash-o', () => block.delete()),
                new BlockUIAction_1.BlockUIAction('copy', () => block.clone()),
                new BlockUIAction_1.BlockUIAction('angle-up', () => block.move(-1)),
                new BlockUIAction_1.BlockUIAction('angle-down', () => block.move(1))
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
            var top = DOMHelpers_16.$dom.offset(this.ui.$editor).top - 100;
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
            const $html = DOMHelpers_16.$dom.el(this.template.$html.innerHTML);
            let fieldsHtml = {};
            this.fields.forEach(field => {
                const name = field.name || field.data.name;
                fieldsHtml[name] = field.getEl();
            });
            DOMHelpers_16.$dom.select($html, Selectors_9.Selectors.selectorField, true)
                .forEach($elem => {
                let fieldData = DOMHelpers_16.$dom.data($elem, 'breField');
                const name = fieldData.name;
                const $field = fieldsHtml[name];
                DOMHelpers_16.$dom.replaceWith($elem, $field);
            });
            const html = $html.outerHTML;
            if (!html) {
                return null;
            }
            return trim ? html.breTotalTrim() : html;
        }
    }
    exports.Block = Block;
});
define("BlocksContainer", ["require", "exports", "Block/Block", "Common/DOMHelpers"], function (require, exports, Block_2, DOMHelpers_17) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
            let $el = DOMHelpers_17.$dom.clone(this.$element);
            $el.innerHTML = blocksHtml.join('\n');
            return $el.outerHTML;
        }
        addBlock(template, data, idx, select = true) {
            let block = new Block_2.Block(template, false, data, block => this.deleteBlock(block), block => this.selectBlock(block), block => this.deselectBlock(block), block => this.copyBlock(block), (block, offset) => this.moveBlock(block, offset), this.onUpdateBlock, this.onUpload);
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
                DOMHelpers_17.$dom.after(this.blocks[idx - 1].ui.$editor, block.ui.$editor);
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
                DOMHelpers_17.$dom.after($anchorBlock, block.ui.$editor);
            }
            else if (offset < 0) {
                DOMHelpers_17.$dom.before($anchorBlock, block.ui.$editor);
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
                    this.$placeholder = DOMHelpers_17.$dom.el('<i data-bre-placeholder="true">Click here to select this container...</i>');
                    this.$element.appendChild(this.$placeholder);
                }
            }
            else if (this.$placeholder) {
                this.$placeholder.remove();
                this.$placeholder = null;
            }
        }
    }
    exports.BlocksContainer = BlocksContainer;
});
(function ($) {
    $.fn.brickyeditor = function (options) {
        let editor = new BrickyEditor.Editor($(this)[0], options);
        editor.initAsync();
        return editor;
    };
}(jQuery));
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
define("UI/SelectionHelper", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.SelectionHelper = SelectionHelper;
});
define("UI/SelectionUtils", ["require", "exports", "Common/DOMHelpers"], function (require, exports, DOMHelpers_18) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SelectionUtils {
        static bindTextSelection($el, handler) {
            if (!DOMHelpers_18.$dom.matches($el, '[contenteditable]')) {
                return;
            }
            DOMHelpers_18.$dom.on($el, 'mouseup', () => {
                setTimeout(() => {
                    let rect = this.getSelectionRect();
                    handler(rect);
                }, 0);
            });
            DOMHelpers_18.$dom.on($el, 'keyup', (ev) => {
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
    exports.SelectionUtils = SelectionUtils;
});
