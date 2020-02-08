var BrickyEditor = (function (exports) {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
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
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    var str = {
        totalTrim: function (s) {
            return s !== undefined ? s.replace(/\s\s+/g, " ").trim() : "";
        },
        equalsInvariant: function (s1, s2) {
            if (!s1 || !s2) {
                return s1 === s2;
            }
            return s1.toLowerCase() === s2.toLowerCase();
        },
        startsWith: function (s1, s2) { return s1.indexOf(s2) === 0; }
    };
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
        return Common;
    }());
    //# sourceMappingURL=Common.js.map

    var $dom = (function () {
        function $dom() {
        }
        $dom.offset = function (el) {
            var rect = el.getBoundingClientRect();
            var $body = document.body;
            return {
                top: rect.top + $body.scrollTop,
                left: rect.left + $body.scrollLeft
            };
        };
        $dom.unwrap = function (el) {
            if (!el.parentElement) {
                return;
            }
            var parentsParent = el.parentElement.parentElement;
            if (parentsParent) {
                parentsParent.replaceChild(el, el.parentElement);
            }
            else {
                el.parentElement.innerHTML = el.innerHTML;
            }
        };
        $dom.hide = function (el) {
            el.style.display = "none";
        };
        $dom.show = function (el) {
            el.style.display = "block";
        };
        $dom.isHidden = function (el) {
            var style = window.getComputedStyle(el);
            return style.display === "none";
        };
        $dom.toggle = function (el, force) {
            var show = force ? force.valueOf() : this.isHidden(el);
            if (show) {
                this.show(el);
            }
            else {
                this.hide(el);
            }
        };
        $dom.before = function (el, elToInsert) {
            var _this = this;
            if (elToInsert instanceof HTMLElement) {
                if (el.parentNode !== null) {
                    el.parentNode.insertBefore(elToInsert, el);
                }
            }
            else {
                elToInsert.forEach(function ($el) { return _this.before(el, $el); });
            }
        };
        $dom.after = function (el, elToInsert) {
            if (el.parentNode === null) {
                return;
            }
            if (el.nextSibling) {
                el.parentNode.insertBefore(elToInsert, el);
            }
            else {
                el.parentNode.appendChild(elToInsert);
            }
        };
        $dom.hasClass = function (el, className) {
            if (el.classList) {
                return el.classList.contains(className);
            }
            else {
                return new RegExp("(^| )" + className + "( |$)", "gi").test(el.className);
            }
        };
        $dom.addClass = function (el, className) {
            if (this.hasClass(el, className)) {
                return;
            }
            if (el.classList) {
                el.classList.add(className);
            }
            else {
                el.className += " " + className;
            }
        };
        $dom.removeClass = function (el, className) {
            if (el.classList) {
                el.classList.remove(className);
            }
            else {
                el.className = el.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
            }
        };
        $dom.toggleClass = function (el, className, force) {
            if (force) {
                if (force.valueOf()) {
                    this.addClass(el, className);
                }
                else {
                    this.removeClass(el, className);
                }
                return;
            }
            if (el.classList) {
                el.classList.toggle(className);
            }
            else {
                var classes = el.className.split(" ");
                var existingIndex = -1;
                for (var i = classes.length; i--;) {
                    if (classes[i] === className) {
                        existingIndex = i;
                    }
                }
                if (existingIndex >= 0) {
                    classes.splice(existingIndex, 1);
                }
                else {
                    classes.push(className);
                }
                el.className = classes.join(" ");
            }
        };
        $dom.windowScrollTop = function () {
            return window.pageYOffset !== undefined
                ? window.pageYOffset
                : (document.documentElement ||
                    document.body.parentNode ||
                    document.body).scrollTop;
        };
        $dom.replaceWith = function (from, to) {
            var parent = from.parentElement;
            if (parent) {
                parent.replaceChild(to, from);
            }
        };
        $dom.select = function (el, selector, addBack) {
            if (addBack === void 0) { addBack = false; }
            var elements = el.querySelectorAll(selector);
            var result = Array.prototype.slice.call(elements);
            if (addBack && addBack.valueOf() && $dom.matches(el, selector)) {
                result.push(el);
            }
            return result;
        };
        $dom.find = function (selector) {
            return document.querySelector(selector);
        };
        $dom.first = function (el, selector) {
            return el.querySelector(selector);
        };
        $dom.clone = function (el) {
            return el.cloneNode(true);
        };
        $dom.trigger = function (el, ev, data) {
            if (window.CustomEvent) {
                var event = new CustomEvent(ev, { detail: data });
            }
            else {
                var event = document.createEvent("CustomEvent");
                event.initCustomEvent(ev, true, true, data);
            }
            el.dispatchEvent(event);
        };
        $dom.matches = function (el, selector) {
            var matches = el.matches ||
                el.matchesSelector ||
                el.msMatchesSelector ||
                el.mozMatchesSelector ||
                el.webkitMatchesSelector ||
                el.oMatchesSelector;
            return matches.call(el, selector);
        };
        $dom.data = function (el, prop) {
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
        };
        return $dom;
    }());
    //# sourceMappingURL=DOMHelpers.js.map

    var getSelectionRanges = function () {
        var selection = window.getSelection();
        if (selection === null) {
            return null;
        }
        var selectionRanges = [];
        for (var idx = 0; idx < selection.rangeCount; idx++) {
            selectionRanges.push(selection.getRangeAt(idx));
        }
        return selectionRanges;
    };
    var restoreSelection = function (selectionRanges) {
        if (selectionRanges === null || selectionRanges.length === 0) {
            return;
        }
        var selection = window.getSelection();
        if (selection !== null) {
            selection.removeAllRanges();
            selectionRanges.forEach(function (range) { return selection.addRange(range); });
        }
    };
    var SelectionUtils = (function () {
        function SelectionUtils() {
        }
        SelectionUtils.bindTextSelection = function ($el, handler) {
            var _this = this;
            if (!$dom.matches($el, "[contenteditable]")) {
                return;
            }
            $el.addEventListener("mouseup", function () {
                setTimeout(function () {
                    var rect = _this.getSelectionRect();
                    handler(rect);
                }, 0);
            });
            $el.addEventListener("keyup", function () {
                var rect = _this.getSelectionRect();
                handler(rect);
            });
        };
        SelectionUtils.getSelectionRect = function () {
            var selection = window.getSelection();
            if (selection === null) {
                return null;
            }
            var range = selection.getRangeAt(0);
            return range.getBoundingClientRect();
        };
        return SelectionUtils;
    }());
    //# sourceMappingURL=SelectionUtils.js.map

    var el = function (_a) {
        var _b = _a.tag, tag = _b === void 0 ? "div" : _b, className = _a.className, innerHTML = _a.innerHTML, props = _a.props;
        var result = document.createElement(tag);
        if (className !== undefined && className.length > 0) {
            result.className = className;
        }
        if (innerHTML !== undefined) {
            result.innerHTML = innerHTML;
        }
        if (props !== undefined) {
            Object.assign(result, props);
        }
        return result;
    };
    var div = function (className, innerHTML) {
        return el({
            className: className,
            innerHTML: innerHTML
        });
    };
    var createElement = function (html, className) {
        var temp = document.createElement("div");
        temp.innerHTML = html;
        var result = temp.children[0];
        temp.innerHTML = "";
        if (className !== undefined) {
            result.className = className;
        }
        return result;
    };
    var toggleVisibility = function (el, visible) {
        if (visible !== undefined) {
            el.style.display = visible ? "initial" : "none";
            return;
        }
        el.style.display = el.style.display !== "none" ? "none" : "initial";
    };
    var modalTemplate = "\n<div>\n  <div class=\"bre-modal\">\n    <div class=\"bre-modal-placeholder\">\n    </div>\n  </div>\n</div>";
    var showModal = function (props) {
        var selection = getSelectionRanges();
        var element = createElement(modalTemplate);
        var placeholder = element.getElementsByClassName("bre-modal-placeholder")[0];
        var closeModal = function () {
            element.remove();
            element = null;
            restoreSelection(selection);
        };
        var content = props.content, onOk = props.onOk, onCancel = props.onCancel;
        content.forEach(function (el) { return placeholder.appendChild(el); });
        if (onOk !== undefined) {
            var buttonOk = createElement("<button type=\"button\">Save</button>");
            buttonOk.addEventListener("click", function () {
                onOk();
                closeModal();
            });
            placeholder.appendChild(buttonOk);
        }
        var buttonCancel = createElement("<button type=\"button\">Cancel</button>");
        buttonCancel.addEventListener("click", function () {
            if (onCancel) {
                onCancel();
            }
            closeModal();
        });
        placeholder.appendChild(buttonCancel);
        document.body.appendChild(element);
    };
    var parseElementData = function (el, prop) {
        var json = el.dataset[prop];
        if (json === undefined) {
            return null;
        }
        var data = null;
        try {
            data = JSON.parse(json);
        }
        catch (e) {
            if (e instanceof SyntaxError) {
                json = json.replace(/'/g, '"');
                try {
                    data = JSON.parse(json);
                    if (data.name === undefined || data.type === undefined) {
                        return null;
                    }
                }
                catch (_a) {
                    return null;
                }
            }
        }
        return data;
    };
    var readFileAsync = function (file) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    var reader = new FileReader();
                    reader.onload = function (ev) {
                        if (ev.target !== null && ev.target.result !== null) {
                            var result = ev.target.result.toString();
                            resolve(result);
                        }
                    };
                    try {
                        reader.readAsDataURL(file);
                    }
                    catch (ex) {
                        reject(ex);
                    }
                })];
        });
    }); };
    var objectToArray = function (o) { return Object.keys(o).map(function (x) { return x[o]; }); };
    var filterNotNull = function (value) {
        return value.filter(function (x) { return x !== null; });
    };
    var helpers = {
        createElement: createElement,
        div: div,
        el: el,
        parseElementData: parseElementData,
        showModal: showModal,
        toggleVisibility: toggleVisibility,
        readFileAsync: readFileAsync,
        objectToArray: objectToArray,
        filterNotNull: filterNotNull
    };
    //# sourceMappingURL=helpers.js.map

    var locales = {
        errorBlocksFileNotFound: function (url) {
            return "Blocks file not found. Requested file: " + url + ".";
        },
        errorTemplatesFileNotFound: function (url) {
            return "Templates file not found. Requested file: " + url + ".";
        },
        errorBlockTemplateNotFound: function (templateName) {
            return "Template \"" + templateName + "\" not found.";
        },
        errorTemplateParsing: function (name) {
            return "Template parsing error: " + name + ".";
        },
        embedFieldLinkTitle: "Link to embed media",
        embedFieldLinkPlaceholder: "Link to instagram, youtube and etc.",
        prompt: {
            image: {
                link: {
                    title: "Image link",
                    placeholder: "http://url-to-image.png",
                },
                alt: {
                    title: "Image alt",
                    placeholder: "Image 'alt' attribute value",
                },
                upload: {
                    title: "or Upload a file",
                    placeholder: "select file",
                    button: "Select file",
                },
                url: {
                    subtitle: "Link to open on image click",
                },
            },
            embed: {
                url: {
                    title: "URL to media",
                    placeholder: "Paste link to youtube, instagram, etc.",
                },
            },
            link: {
                href: {
                    title: "Url",
                    placeholder: "https://put-your-link.here",
                },
                title: {
                    title: "Title",
                    placeholder: "Title attribute for link",
                },
                target: {
                    title: "Target",
                    blank: "Blank",
                    self: "Self",
                    parent: "Parent",
                    top: "Top",
                },
            },
        },
        htmlEditorLinkUrlTitle: "Url",
        htmlEditorLinkUrlPlaceholder: "http://put-your-link.here",
        htmlEditorLinkTitleTitle: "Title",
        htmlEditorLinkTitlePlaceholder: "Title attribute for link",
        htmlEditorLinkTargetTitle: "Target",
        htmlEditorLinkTargetBlank: "Blank",
        htmlEditorLinkTargetSelf: "Self",
        htmlEditorLinkTargetParent: "Parent",
        htmlEditorLinkTargetTop: "Top",
        buttonClose: "close",
        buttonOk: "Ok",
        buttonCancel: "Cancel",
        defaultTemplatesGroupName: "Other templates",
    };
    //# sourceMappingURL=locales.js.map

    var text = function (_a) {
        var key = _a.key, p = _a.p, data = _a.data;
        var html = "<input type='text' name='" + key + "' placeholder='" + p.placeholder + "' value='" + (p.value || "") + "' />";
        var input = helpers.createElement(html);
        input.onchange = function () {
            data[key] = input.value;
        };
        return input;
    };
    //# sourceMappingURL=text.js.map

    var file = function (_a) {
        var key = _a.key, p = _a.p, data = _a.data;
        var file = data[key];
        var filePreview = helpers.createElement("<img src=\"" + p.value + "\"/>");
        var fileInput = helpers.createElement("<input type=\"file\" id=\"bre-modal-modal-" + key + "\" class=\"bre-input\" placeholder=\"" + p.placeholder + "\">");
        var fileName = helpers.createElement("<span class='bre-image-input-filename'></span>");
        var updatePreview = function () { return __awaiter(void 0, void 0, void 0, function () {
            var fileContent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(file === undefined || file === null)) return [3, 1];
                        fileName.innerText = "";
                        filePreview.src = "//:0";
                        return [3, 3];
                    case 1:
                        fileName.innerText = file.name;
                        return [4, helpers.readFileAsync(file)];
                    case 2:
                        fileContent = _a.sent();
                        filePreview.src = fileContent;
                        _a.label = 3;
                    case 3: return [2];
                }
            });
        }); };
        fileInput.onchange = function () {
            file = fileInput.files && fileInput.files[0];
            updatePreview();
            data[key] = file;
        };
        updatePreview();
        var editor = helpers.createElement("<div class='bre-image-input'>\n    <label for=\"bre-modal-modal-" + key + "\">\n      " + p.placeholder + "\n    </label>\n  </div>");
        editor.append(filePreview, fileInput, fileName);
        return editor;
    };
    //# sourceMappingURL=file.js.map

    var select = function (_a) {
        var key = _a.key, p = _a.p, data = _a.data;
        if (p.options === undefined) {
            throw new Error("Empty options");
        }
        var options = p.options
            .map(function (o) {
            return "<option value=\"" + o.title + "\" " + (o.value === p.value ? "selected" : "") + ">" + o.title + "</option>";
        })
            .join("\n");
        var html = "<select name='" + key + "' placeholder='" + p.placeholder + "'>" + options + "</select>";
        var select = helpers.createElement(html);
        select.onchange = function () {
            data[key] = select.value;
        };
        return select;
    };
    //# sourceMappingURL=select.js.map

    var parameterEditors = {
        text: text,
        file: file,
        select: select
    };
    var promptAsync = function (params) {
        return new Promise(function (resolve) {
            var result = {};
            var editors = Object.keys(params).map(function (key) {
                var p = params[key];
                var editor = parameterEditors[p.type || "text"]({
                    key: key,
                    p: p,
                    data: result
                });
                return editor;
            });
            helpers.showModal({
                content: editors,
                onOk: function () { return resolve(result); },
                onCancel: function () { return resolve(null); }
            });
        });
    };
    //# sourceMappingURL=prompt.js.map

    var Selectors = (function () {
        function Selectors() {
        }
        Selectors.attr = function (attr) {
            return "[" + attr + "]";
        };
        Selectors.attrContentEditable = "contenteditable";
        Selectors.selectorContentEditable = "contenteditable";
        Selectors.attrField = "data-bre-field";
        Selectors.selectorField = "[" + Selectors.attrField + "]";
        Selectors.classEditor = "bre-editor";
        Selectors.classTemplate = "bre-template";
        Selectors.selectorTemplate = "." + Selectors.classTemplate;
        Selectors.classTemplateGroup = "bre-template-group";
        Selectors.selectorTemplateGroup = "." + Selectors.classTemplateGroup;
        Selectors.selectorTemplatePreview = ".bre-template-preview";
        Selectors.classMobile = "brickyeditor-tools-mobile";
        Selectors.htmlToolsCommand = "data-bre-doc-command";
        Selectors.htmlToolsCommandRange = "data-bre-doc-command-range";
        Selectors.selectorFieldSelected = "bre-field-selected";
        Selectors.selectorFieldContainer = "bre-field-container";
        Selectors.selectorBlockSelected = "bre-block-selected";
        Selectors.selectorHtmlToolsCommand = Selectors.attr(Selectors.htmlToolsCommand);
        Selectors.selectorHtmlToolsCommandRange = Selectors.attr(Selectors.htmlToolsCommandRange);
        return Selectors;
    }());
    //# sourceMappingURL=Selectors.js.map

    var control;
    var toggleHtmlTools = function (rect) {
        if (rect !== null && rect.width > 1) {
            var top = rect.top + rect.height;
            var left = rect.left;
            control.style.top = top + "px";
            control.style.left = left + "px";
            helpers.toggleVisibility(control, true);
        }
        else {
            helpers.toggleVisibility(control, false);
        }
    };
    //# sourceMappingURL=htmlTools.js.map

    var emmiter = function () {
        var listeners = {};
        var on = function (type, listener) {
            if (listeners[type] === undefined) {
                listeners[type] = [];
            }
            var listenersOfType = listeners[type];
            if (listenersOfType.indexOf(listener) !== -1) {
                return;
            }
            listenersOfType.push(listener);
        };
        var off = function (type, listener) {
            var listenersOfType = listeners[type];
            if (listenersOfType === undefined) {
                return;
            }
            else {
                var idx = listenersOfType.indexOf(listener);
                if (idx > -1) {
                    listenersOfType.splice(idx, 1);
                }
            }
        };
        var fire = function (type, ev) {
            var listenersOfType = listeners[type];
            if (listenersOfType === undefined) {
                return;
            }
            else {
                listenersOfType.forEach(function (listener) { return listener(ev); });
            }
        };
        return { fire: fire, on: on, off: off };
    };
    //# sourceMappingURL=emmiter.js.map

    var html = function (_a) {
        var $element = _a.$element, preview = _a.preview, data = _a.data;
        if (!isValidFieldType(data, "html")) {
            return null;
        }
        var field = {
            $element: $element,
            data: data
        };
        if (data.html) {
            $element.innerHTML = data.html;
        }
        if (!preview) {
            var _b = emmiter(), fireEvent_1 = _b.fire, on = _b.on, off = _b.off;
            field.on = on;
            field.off = off;
            field.cleanup = function () {
                var $copy = getFieldElement($element);
                $copy.removeAttribute(Selectors.attrContentEditable);
                return $copy;
            };
            var updateHtmlProp = function () {
                var html = $element.innerHTML.trim();
                if ($element.innerHTML !== html) {
                    var updatedData = {
                        html: html
                    };
                    updateFieldData(field, updatedData, fireEvent_1);
                }
            };
            $element.setAttribute(Selectors.attrContentEditable, "true");
            SelectionUtils.bindTextSelection($element, function (rect) {
                toggleHtmlTools(rect);
            });
            $element.addEventListener("blur", updateHtmlProp);
            $element.addEventListener("keyup", updateHtmlProp);
            $element.addEventListener("paste", updateHtmlProp);
            $element.addEventListener("input", updateHtmlProp);
            $element.addEventListener("paste", function (ev) {
                ev.preventDefault();
                if (ev.clipboardData) {
                    var text = ev.clipboardData.getData("text/plain");
                    document.execCommand("insertHTML", false, text);
                }
            });
            $element.addEventListener("click", function () {
                toggleFieldSelection(field, true, fireEvent_1);
                return false;
            });
        }
        return field;
    };
    //# sourceMappingURL=html.js.map

    var getRequest = function (url) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.open("GET", url, true);
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
    };
    var loadScriptAsync = function (url) {
        return new Promise(function (resolve, reject) {
            var script = document.createElement("script");
            var done = false;
            var scriptDocLoadedHandler = function () {
                var readyState = script.readyState;
                if (done === false &&
                    (readyState === undefined ||
                        readyState === "loaded" ||
                        readyState === "complete")) {
                    done = true;
                    resolve();
                }
                else {
                    reject();
                }
            };
            script.onload = scriptDocLoadedHandler;
            if (script.onreadystatechange !== undefined) {
                script.onreadystatechange = scriptDocLoadedHandler;
            }
            script.src = url.indexOf("//") === 0 ? "https:" + url : url;
            document.head.appendChild(script);
        });
    };
    var jsonp = function (url) {
        return new Promise(function (resolve, reject) {
            var id = "_" + Math.round(10000 * Math.random());
            var callbackName = "jsonp_callback_" + id;
            window[callbackName] = function (data) {
                delete window[callbackName];
                var element = document.getElementById(id);
                if (element !== null) {
                    element.remove();
                }
                resolve(data);
            };
            var src = url + "&callback=" + callbackName;
            var script = document.createElement("script");
            script.src = src;
            script.id = id;
            script.addEventListener("error", reject);
            (document.getElementsByTagName("head")[0] ||
                document.body ||
                document.documentElement).appendChild(script);
        });
    };
    //# sourceMappingURL=httpTransport.js.map

    var preProcessEmbedUrl = function (url) {
        return url.replace("https://www.instagram.com", "http://instagr.am");
    };
    var postProcessEmbed = function (provider) {
        switch (provider) {
            case "Instagram":
                var instgrm = window.instgrm;
                if (instgrm !== undefined) {
                    instgrm.Embeds.process();
                }
                break;
            default:
                break;
        }
    };
    var getEmbedAsync = function (embedUrl) {
        var url = "https://noembed.com/embed?url=" + embedUrl;
        return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
            var data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, jsonp(url)];
                    case 1:
                        data = _a.sent();
                        resolve(data);
                        return [3, 3];
                    case 2:
                        err_1 = _a.sent();
                        reject(err_1);
                        return [3, 3];
                    case 3: return [2];
                }
            });
        }); });
    };
    //# sourceMappingURL=embed.js.map

    var providerScriptsLoaded = {};
    var getPromptParams = function (_a) {
        var url = _a.url;
        return ({
            url: {
                value: url || "http://instagr.am/p/BO9VX2Vj4fF/",
                title: locales.prompt.embed.url.title,
                placeholder: locales.prompt.embed.url.placeholder
            }
        });
    };
    var embed = function (_a) {
        var $element = _a.$element, preview = _a.preview, data = _a.data;
        if (!isValidFieldType(data, "embed")) {
            return null;
        }
        var field = {
            $element: $element,
            data: data
        };
        var updateEmbedMedia = function (url, fireUpdate) { return __awaiter(void 0, void 0, void 0, function () {
            var embed, $embed, $script;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (url === undefined) {
                            return [2];
                        }
                        return [4, getEmbedAsync(preProcessEmbedUrl(url))];
                    case 1:
                        embed = _a.sent();
                        field.data = __assign(__assign({}, field.data), { url: url,
                            embed: embed });
                        $embed = helpers.createElement("<div>" + embed.html + "</div>");
                        $script = $embed.querySelector("script");
                        if ($script !== null) {
                            $script.remove();
                        }
                        $element.innerHTML = "";
                        $element.removeAttribute("class");
                        $element.removeAttribute("style");
                        $element.appendChild($embed);
                        if (!($script !== null)) return [3, 4];
                        if (!(providerScriptsLoaded[$script.src] === undefined)) return [3, 3];
                        return [4, loadScriptAsync($script.src)];
                    case 2:
                        _a.sent();
                        providerScriptsLoaded[embed.provider_name] = true;
                        _a.label = 3;
                    case 3:
                        setTimeout(function () { return postProcessEmbed(embed.provider_name); }, 100);
                        _a.label = 4;
                    case 4:
                        return [2];
                }
            });
        }); };
        updateEmbedMedia(data.url);
        var promptEmbedMediaUrl = function () { return __awaiter(void 0, void 0, void 0, function () {
            var params, updated, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = getPromptParams(field.data);
                        return [4, promptAsync(params)];
                    case 1:
                        updated = _a.sent();
                        if (updated !== null) {
                            url = updated.url;
                            if (url !== undefined) {
                                updateEmbedMedia(url);
                            }
                        }
                        return [2];
                }
            });
        }); };
        if (!preview) {
            var _b = emmiter(), fireEvent = _b.fire, on = _b.on, off = _b.off;
            field.on = on;
            field.off = off;
            field.cleanup = function () {
                var $copy = getFieldElement($element);
                return $copy;
            };
            $element.addEventListener("click", function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    promptEmbedMediaUrl();
                    return [2];
                });
            }); });
        }
        return field;
    };
    //# sourceMappingURL=embed.js.map

    var container = function (_a) {
        var $element = _a.$element, preview = _a.preview, data = _a.data;
        if (!isValidFieldType(data, "container")) {
            return null;
        }
        var container = createContainer($element, !preview);
        var field = {
            $element: $element,
            data: data,
            container: container
        };
        $element.classList.add(Selectors.selectorFieldContainer);
        if (!preview) {
            var _b = emmiter(), fireEvent_1 = _b.fire, on = _b.on, off = _b.off;
            field.on = on;
            field.off = off;
            field.cleanup = function () {
                var html = getContainerHtml(container);
                return helpers.createElement(html);
            };
            $element.addEventListener("click", function (ev) {
                toggleFieldSelection(field, true, fireEvent_1);
                ev.stopPropagation();
                return false;
            });
        }
        return field;
    };
    //# sourceMappingURL=container.js.map

    var renderLabel = function ($root, $input, _a) {
        var title = _a.title;
        if (title !== undefined) {
            var $label = helpers.el({
                tag: "label",
                className: "bre-field-editor-label",
                innerHTML: title,
                props: {
                    onclick: function () { return $input.focus(); }
                }
            });
            $root.append($label);
        }
    };
    var renderInput = function (props) {
        var type = props.type, placeholder = props.placeholder;
        var $root = helpers.div("bre-field-editor-prop");
        var $input = helpers.el({
            tag: "input",
            className: "bre-field-editor-input",
            props: {
                type: type,
                placeholder: placeholder || ""
            }
        });
        if (props.type === "text") {
            var updateValue = function () {
                props.onUpdate($input.value);
            };
            $input.value = props.value || "";
            $input.onchange = updateValue;
            $input.onkeyup = updateValue;
            $input.onpaste = updateValue;
        }
        else if ((props.type = "file")) {
            $input.onchange = function () { return __awaiter(void 0, void 0, void 0, function () {
                var files, file, content;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            files = $input.files;
                            file = files === null ? null : files[0];
                            if (!(file !== null)) return [3, 2];
                            return [4, helpers.readFileAsync(file)];
                        case 1:
                            content = _a.sent();
                            props.onUpdate(file, content);
                            _a.label = 2;
                        case 2: return [2];
                    }
                });
            }); };
        }
        renderLabel($root, $input, props);
        $root.append($input);
        return $root;
    };
    var renderSelect = function (props) {
        var placeholder = props.placeholder, value = props.value, options = props.options, onUpdate = props.onUpdate;
        var $root = helpers.div("bre-field-editor-prop");
        var $select = helpers.el({
            tag: "select",
            className: "bre-field-editor-input",
            props: {
                placeholder: placeholder || ""
            }
        });
        $select.onchange = function () { return onUpdate($select.value); };
        $select.innerHTML = options
            .map(function (x) {
            return "<option value=\"" + x.value + "\" " + (x.value === value ? "selected" : "") + ">" + (x.label || x.value) + "</option>";
        })
            .join("\n");
        renderLabel($root, $select, props);
        $root.append($select);
        return $root;
    };
    //# sourceMappingURL=inputs.js.map

    var linkEditor = function (initialData) {
        var data = initialData ? __assign({}, initialData) : {};
        var $element = helpers.div("bre-field-editor-root");
        var $href = renderInput(__assign(__assign({}, locales.prompt.link.href), { value: data.href, type: "text", onUpdate: function (v) { return (data.href = v); } }));
        var $title = renderInput(__assign(__assign({}, locales.prompt.link.title), { value: data.title, type: "text", onUpdate: function (v) { return (data.title = v); } }));
        var $target = renderSelect(__assign(__assign({}, locales.prompt.link.target), { value: data.target, options: [
                { value: "" },
                { value: "_blank" },
                { value: "_self" },
                { value: "_parent" },
                { value: "_top" }
            ], onUpdate: function (v) { return (data.target = v); } }));
        $element.append($href, $title, $target);
        return {
            $element: $element,
            data: data
        };
    };
    //# sourceMappingURL=linkEditor.js.map

    var image = function (_a) {
        var $element = _a.$element, preview = _a.preview, data = _a.data;
        if (!isValidFieldType(data, "image")) {
            return null;
        }
        var isImageElement = $element.tagName.toLowerCase() === "img";
        var updateImageElement = function (data) {
            var src = getSrcOrFile(data);
            var alt = data.alt || "";
            if (isImageElement) {
                var image_1 = $element;
                image_1.src = src;
                image_1.alt = alt;
            }
            else {
                $element.style.backgroundImage = "url(" + src + ")";
            }
            $element.title = alt;
        };
        if (data.src || data.file) {
            updateImageElement(data);
        }
        var field = {
            $element: $element,
            data: data
        };
        if (!preview) {
            var _b = emmiter(), fireEvent_1 = _b.fire, on = _b.on, off = _b.off;
            field.on = on;
            field.off = off;
            field.cleanup = function () {
                var $elementCopy = getFieldElement($element);
                var link = field.data.link;
                if (link !== undefined && link.href !== undefined && link.href.length) {
                    var $link = helpers.el({
                        tag: "a",
                        props: link
                    });
                    $link.appendChild($elementCopy);
                    return $link;
                }
                return $elementCopy;
            };
            $element.addEventListener("click", function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fireEvent_1("focus", { field: field });
                            return [4, propmtEditorAsync(field)];
                        case 1:
                            if (_a.sent()) {
                                updateImageElement(field.data);
                                updateFieldData(field, field.data, fireEvent_1);
                                toggleFieldSelection(field, true);
                            }
                            return [2];
                    }
                });
            }); });
        }
        return field;
    };
    var propmtEditorAsync = function (f) {
        return new Promise(function (resolve) {
            var imageEditor = editor(f.data);
            helpers.showModal({
                content: [imageEditor.$element],
                onOk: function () {
                    f.data = imageEditor.data;
                    resolve(true);
                },
                onCancel: resolve
            });
        });
    };
    var editor = function (initialData) {
        var data = __assign({}, initialData);
        var $element = helpers.div("bre-field-editor-root");
        var $previewImg = helpers.el({
            tag: "img",
            className: "bre-field-editor-preview-img",
            props: {
                src: getSrcOrFile(data)
            }
        });
        var $preview = helpers.div("bre-field-editor-preview");
        $preview.appendChild($previewImg);
        var $src = renderInput(__assign(__assign({}, locales.prompt.image.link), { value: data.src, type: "text", onUpdate: function (src) {
                $previewImg.src = src;
                data.src = src;
                data.file = undefined;
            } }));
        var $file = renderInput(__assign(__assign({}, locales.prompt.image.upload), { type: "file", value: data.file ? data.file.fileContent : "", onUpdate: function (f, fileContent) { return __awaiter(void 0, void 0, void 0, function () {
                var fileInfo;
                return __generator(this, function (_a) {
                    $previewImg.src = fileContent;
                    fileInfo = {
                        name: f.name,
                        size: f.size,
                        type: f.type,
                        lastModified: f.lastModified
                    };
                    data.src = undefined;
                    data.file = {
                        fileContent: fileContent,
                        fileInfo: fileInfo
                    };
                    return [2];
                });
            }); } }));
        var $alt = renderInput(__assign(__assign({}, locales.prompt.image.alt), { value: data.alt, type: "text", onUpdate: function (v) { return (data.alt = $previewImg.alt = v); } }));
        var _a = linkEditor(initialData.link), $linkEl = _a.$element, linkData = _a.data;
        $element.append($preview, $src, $file, $alt, $linkEl);
        data.link = linkData;
        return {
            $element: $element,
            data: data
        };
    };
    var getSrcOrFile = function (data) {
        return data.src || (data.file !== undefined ? data.file.fileContent : "");
    };

    var Fields = {
        html: html,
        image: image,
        embed: embed,
        container: container
    };
    var isValidFieldType = function (data, type) { return data.type === type; };
    var createField = function (_a) {
        var $element = _a.$element, preview = _a.preview, initialData = _a.data;
        var data = helpers.parseElementData($element, "breField");
        if (data === null) {
            return null;
        }
        var type = data.type;
        if (initialData !== undefined) {
            data = __assign(__assign({}, data), initialData);
        }
        var createFieldFunc = Fields[type];
        if (createFieldFunc === undefined) {
            throw new Error(type + " field not found");
        }
        return createFieldFunc({
            $element: $element,
            preview: preview,
            data: data
        });
    };
    var updateFieldData = function (field, changes, fireEvent) {
        var data = field.data;
        var props = Object.keys(changes);
        var hasChanges = props.some(function (p) { return data[p] !== changes[p]; });
        if (hasChanges) {
            field.data = __assign(__assign({}, data), { changes: changes });
            if (fireEvent !== undefined) {
                fireEvent("change", { field: field });
            }
        }
    };
    var toggleFieldSelection = function (field, selected, fireEvent) {
        var classList = field.$element.classList;
        if (selected) {
            field.selected = selected;
            classList.add(Selectors.selectorFieldSelected);
        }
        else {
            classList.remove(Selectors.selectorFieldSelected);
        }
        if (fireEvent !== undefined) {
            fireEvent(selected ? "focus" : "blur", { field: field });
        }
    };
    var getFieldElement = function ($field) {
        var $el = $field.cloneNode(true);
        $el.attributes.removeNamedItem(Selectors.attrField);
        return $el;
    };
    function bindField($element, block) {
        var data = helpers.parseElementData($element, "breField");
        if (data === null) {
            return null;
        }
        if (block === undefined) {
            return createField({
                $element: $element,
                preview: true,
                data: data
            });
        }
        data = getFieldDataByName(block, data.name) || data;
        var field = createField({
            $element: $element,
            preview: false,
            data: data
        });
        if (field !== null && field.on !== undefined) {
            field.on("focus", function (ev) {
                if (ev !== undefined) {
                    selectField(block, ev.field);
                }
            });
        }
        return field;
    }
    var bindFields = function ($element, block) {
        var $fieldElement = findFieldElements($element);
        var fields = $fieldElement.map(function ($fieldElement) {
            return bindField($fieldElement, block);
        });
        return helpers.filterNotNull(fields);
    };
    function getFieldDataByName(block, name) {
        if (!block.data || !block.data.fields) {
            return null;
        }
        var field = block.data.fields.find(function (f) { return str.equalsInvariant(f.name, name); });
        if (field === undefined) {
            return null;
        }
        return field;
    }
    function findFieldElements($html) {
        var nodes = $html.querySelectorAll(Selectors.selectorField);
        var $fields = nodes.length > 0 ? Array.prototype.slice.call(nodes) : [];
        if ($html.attributes.getNamedItem(Selectors.attrField) !== null) {
            $fields = __spreadArrays($fields, [$html]);
        }
        return $fields;
    }
    //# sourceMappingURL=field.js.map

    var EditorStrings = (function () {
        function EditorStrings() {
        }
        EditorStrings.embedFieldLinkTitle = "Link to embed media";
        EditorStrings.embedFieldLinkPlaceholder = "Link to instagram, youtube and etc.";
        EditorStrings.imageFieldLinkTitle = "Image link";
        EditorStrings.imageFieldLinkPlaceholder = "http://url-to-image.png";
        EditorStrings.imageFieldUploadTitle = "or Upload a file";
        EditorStrings.imageFieldUploadButton = "Select file";
        EditorStrings.imageFieldAltTitle = "Alt";
        EditorStrings.imageFieldAltPlaceholder = "Image 'alt' attribute value";
        EditorStrings.imageFieldUrlSubtitle = "Link to open on image click";
        EditorStrings.htmlEditorLinkUrlTitle = "Url";
        EditorStrings.htmlEditorLinkUrlPlaceholder = "http://put-your-link.here";
        EditorStrings.htmlEditorLinkTitleTitle = "Title";
        EditorStrings.htmlEditorLinkTitlePlaceholder = "Title attribute for link";
        EditorStrings.htmlEditorLinkTargetTitle = "Target";
        EditorStrings.htmlEditorLinkTargetBlank = "Blank";
        EditorStrings.htmlEditorLinkTargetSelf = "Self";
        EditorStrings.htmlEditorLinkTargetParent = "Parent";
        EditorStrings.htmlEditorLinkTargetTop = "Top";
        EditorStrings.buttonClose = "close";
        EditorStrings.buttonOk = "Ok";
        EditorStrings.buttonCancel = "Cancel";
        EditorStrings.defaultTemplatesGroupName = "Other templates";
        EditorStrings.errorBlocksFileNotFound = function (url) {
            return "Blocks file not found. Requested file: " + url + ".";
        };
        EditorStrings.errorTemplatesFileNotFound = function (url) {
            return "Templates file not found. Requested file: " + url + ".";
        };
        EditorStrings.errorBlockTemplateNotFound = function (templateName) {
            return "Template \"" + templateName + "\" not found.";
        };
        EditorStrings.errorTemplateParsing = function (name) {
            return "Template parsing error: " + name + ".";
        };
        return EditorStrings;
    }());
    //# sourceMappingURL=EditorStrings.js.map

    var allTemplates = [];
    var getTemplate = function (templateName) {
        var template = allTemplates.find(function (x) {
            return str.equalsInvariant(x.name, templateName);
        });
        if (template === undefined) {
            throw new Error("Template is not registred: " + templateName);
        }
        return template;
    };
    var loadTemplatesAsync = function (url, $editor, onError) { return __awaiter(void 0, void 0, void 0, function () {
        var grouppedTemplates, data, $data, $style, $groups, ungrouppedTemplates, ungrouppedTemplatesGroupName, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    grouppedTemplates = [];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, getRequest(url)];
                case 2:
                    data = _a.sent();
                    $data = helpers.createElement("<div>" + data + "</div>");
                    $style = $data.querySelector("style");
                    if ($style !== null) {
                        $dom.before($editor, $style);
                    }
                    $groups = $data.querySelectorAll(Selectors.selectorTemplateGroup);
                    $groups.forEach(function ($group) {
                        var name = $group.getAttribute("title");
                        var templates = parseTemplates($group);
                        grouppedTemplates.push({ name: name, templates: templates });
                        $group.remove();
                        allTemplates = __spreadArrays(allTemplates, templates);
                    });
                    ungrouppedTemplates = parseTemplates($data);
                    ungrouppedTemplatesGroupName = grouppedTemplates.length > 0
                        ? EditorStrings.defaultTemplatesGroupName
                        : "";
                    grouppedTemplates.push({
                        name: ungrouppedTemplatesGroupName,
                        templates: ungrouppedTemplates
                    });
                    allTemplates = __spreadArrays(allTemplates, ungrouppedTemplates);
                    return [2, grouppedTemplates];
                case 3:
                    err_1 = _a.sent();
                    onError(EditorStrings.errorTemplatesFileNotFound(url));
                    throw err_1;
                case 4: return [2];
            }
        });
    }); };
    var parseTemplates = function ($el) {
        var templates = [];
        var $templates = $el.querySelectorAll(Selectors.selectorTemplate);
        $templates.forEach(function ($template) {
            var template = createTemplate($template);
            if (template !== null) {
                templates.push(template);
            }
        });
        return templates;
    };
    var createTemplate = function ($template) {
        var name = $template.dataset.name || "";
        var $preview = $template.querySelector(Selectors.selectorTemplatePreview);
        if ($preview !== null) {
            $template.removeChild($preview);
        }
        else {
            $preview = $template.cloneNode(true);
            bindFields($preview);
        }
        return {
            name: name,
            $html: $template,
            $preview: $preview
        };
    };
    //# sourceMappingURL=template.js.map

    var defaultButtons = [
        {
            name: "delete",
            icon: "<span>D</span>",
            action: function (ff) { return ff("delete"); }
        },
        {
            name: "clone",
            icon: "<span>C</span>",
            action: function (ff) { return ff("clone"); }
        },
        {
            name: "up",
            icon: "<span>▲</span>",
            action: function (ff) { return ff("move", { offset: -1 }); }
        },
        {
            name: "down",
            icon: "<span>▼</span>",
            action: function (ff) { return ff("move", { offset: 1 }); }
        }
    ];
    var control$1;
    function createEditor() {
        var $element = helpers.div("bre-block-editor");
        var btns = defaultButtons.map(function (btn) {
            var action = btn.action, icon = btn.icon, name = btn.name;
            var $btn = helpers.div("bre-block-editor-button", icon);
            $btn.title = name;
            $element.append($btn);
            return {
                $btn: $btn,
                action: action
            };
        });
        return {
            $element: $element,
            btns: btns
        };
    }
    var showBlockEditor = function (block) {
        if (control$1 === undefined) {
            control$1 = createEditor();
        }
        console.log({
            top: control$1.$element.style.top,
            left: control$1.$element.style.left
        });
        control$1.btns.forEach(function (_a) {
            var $btn = _a.$btn, action = _a.action;
            $btn.onclick = function () { return action(block.fire); };
        });
        block.$element.insertAdjacentElement("beforebegin", control$1.$element);
    };
    var hideBlockEditor = function () {
        if (control$1 !== undefined) {
            control$1.$element.remove();
        }
    };
    //# sourceMappingURL=blockEditor.js.map

    var selectField = function (block, field) {
        block.selectedField = field;
    };
    var toggleBlockSelection = function (container, block, selected) {
        if (!selected && block.selectedField !== null) {
            toggleFieldSelection(block.selectedField, false);
        }
        var classList = block.$element.classList;
        if (selected) {
            classList.add(Selectors.selectorBlockSelected);
        }
        else {
            classList.remove(Selectors.selectorBlockSelected);
        }
        if (selected) {
            showBlockEditor(block);
        }
        else {
            hideBlockEditor();
        }
    };
    var createBlockFromData = function (blockData) {
        var blockTemplate = getTemplate(blockData.template);
        return createBlockFromTemplate(blockTemplate, blockData);
    };
    var createBlockFromTemplate = function (blockTemplate, data) {
        if (data === void 0) { data = {
            template: blockTemplate.name,
            fields: []
        }; }
        var $element = blockTemplate.$html.cloneNode(true);
        var ee = emmiter();
        var block = __assign(__assign({}, ee), { $element: $element,
            data: data, selectedField: null });
        block.fields = bindFields($element, block);
        block.fields.forEach(function (field) {
            if (field.on !== undefined) {
                field.on("focus", function (f) {
                    if (f !== undefined) {
                        selectField(block, f.field);
                    }
                });
            }
        });
        return block;
    };
    //# sourceMappingURL=Block.js.map

    var getContainerData = function (container, ignoreHtml) { return container.blocks.map(function (block) { return block.getData(ignoreHtml); }); };
    var getContainerHtml = function (container) {
        var html = container.blocks.map(function (block) { return block.getHtml(true); }).join("\n");
        var root = container.$element.cloneNode(false);
        root.innerHTML = html;
        return root.outerHTML;
    };
    var getDefaultPlaceholder = function () {
        return helpers.createElement("<div style=\"min-height: 100px; display: flex; align-items: center; justify-content: center; font-weight: 700; cursor: pointer;\">\n      <div data-bre-placeholder=\"true\">Click here to select this container</div>\n    </div>");
    };
    var toggleContainersPlaceholder = function (container) {
        if (container.$placeholder === null) {
            return;
        }
        if (container.$element.childElementCount === 0) {
            container.$element.appendChild(container.$placeholder);
        }
        else {
            container.$element.removeChild(container.$placeholder);
        }
    };
    var addBlockToContainer = function (container, options) {
        var blocks = container.blocks, selectedBlock = container.selectedBlock;
        var block = options.blockData !== undefined
            ? createBlockFromData(options.blockData)
            : createBlockFromTemplate(options.blockTemplate);
        var idx = options.idx;
        if (idx === undefined) {
            idx =
                selectedBlock !== null
                    ? blocks.indexOf(selectedBlock) + 1
                    : blocks.length;
        }
        container.blocks = __spreadArrays(blocks.slice(0, idx), [block], blocks.slice(idx));
        block.on("delete", function () {
            deleteBlock(container, block);
        });
        block.on("clone", function () {
            copyBlock(container, block);
        });
        block.on("move", function (ev) {
            moveBlock(container, block, ev !== undefined ? ev.offset : 0);
        });
        toggleContainersPlaceholder(container);
        var $container = container.$element;
        var $block = block.$element;
        if (idx === 0) {
            $container.append($block);
        }
        else {
            var $prevBlock = blocks[idx - 1].$element;
            $prevBlock.after($block);
        }
        $block.addEventListener("click", function () {
            selectBlock(container, block);
        });
        selectBlock(container, block);
        return block;
    };
    function selectBlock(container, block) {
        if (container.selectedBlock !== null) {
            toggleBlockSelection(container, container.selectedBlock, false);
        }
        container.selectedBlock = block;
        toggleBlockSelection(container, container.selectedBlock, true);
    }
    var createContainer = function ($element, usePlaceholder) {
        var $placeholder = usePlaceholder ? getDefaultPlaceholder() : null;
        var container = {
            $element: $element,
            $placeholder: $placeholder,
            blocks: [],
            selectedBlock: null
        };
        toggleContainersPlaceholder(container);
        return container;
    };
    var deleteBlock = function (container, block) {
        if (container.selectedBlock === block) {
            toggleBlockSelection(container, block, false);
        }
        container.blocks = container.blocks.filter(function (b) { return b !== block; });
        block.$element.remove();
        block = null;
    };
    var copyBlock = function (container, block) {
        var idx = container.blocks.indexOf(block) + 1;
        addBlockToContainer(container, {
            idx: idx,
            blockData: block.data
        });
    };
    var moveBlock = function (container, block, offset) {
        var idx = container.blocks.indexOf(block);
        var new_idx = idx + offset;
        if (new_idx >= container.blocks.length || new_idx < 0) {
            return;
        }
        var $anchorBlock = container.blocks[new_idx].$element;
        if ($anchorBlock) {
            if (offset > 0) {
                $dom.after($anchorBlock, block.$element);
            }
            else if (offset < 0) {
                $dom.before($anchorBlock, block.$element);
            }
        }
        showBlockEditor(block);
        container.blocks.splice(idx, 1);
        container.blocks.splice(new_idx, 0, block);
    };
    //# sourceMappingURL=BlocksContainer.js.map

    var defaultButtons$1 = [
        { icon: "bold", command: "Bold", range: true },
        { icon: "italic", command: "Italic", range: true },
        { icon: "link", command: "CreateLink", range: true },
        {
            icon: "list-ul",
            command: "insertUnorderedList",
            range: true
        },
        {
            icon: "list-ol",
            command: "insertOrderedList",
            range: true
        },
        { icon: "undo", command: "Undo", range: false },
        { icon: "repeat", command: "Redo", range: false }
    ];
    var defaultOptions = {
        templatesUrl: "templates/bootstrap4.html",
        compactTools: false,
        compactToolsWidth: 768,
        ignoreHtml: true,
        onError: function (data) {
            console.log(data.message);
        },
        htmlToolsButtons: defaultButtons$1
    };
    //# sourceMappingURL=defaults.js.map

    var getTemplateUI = function (template) {
        var $template = helpers.div("bre-templates-group-item");
        var $preview = template.$preview;
        $preview.setAttribute("title", template.name);
        $template.append($preview);
        return $template;
    };
    var getTemplateGroupUI = function (group, fireFunc) {
        var $group = helpers.div("bre-templates-group");
        var $name = helpers.div("bre-templates-group-name", group.name);
        $name.onclick = function () {
            for (var i = 1; i < $group.children.length; i++) {
                helpers.toggleVisibility($group.children[i]);
            }
        };
        $group.append($name);
        group.templates.forEach(function (template) {
            var $template = getTemplateUI(template);
            $group.append($template);
            $template.onclick = function () {
                fireFunc("templateClick", {
                    template: template
                });
            };
        });
        return $group;
    };
    var getTemplateSelector = function () {
        var _a = emmiter(), fireEvent = _a.fire, on = _a.on, off = _a.off;
        var $element = helpers.div("bre-templates-root");
        var $loader = helpers.div("bre-templates-loader", "...LOADING...");
        var $templates = helpers.div("bre-templates-list");
        $element.append($loader, $templates);
        var setTemplates = function (templatesGroupped) {
            helpers.toggleVisibility($loader, false);
            templatesGroupped.forEach(function (group) {
                if (group.templates.length === 0) {
                    return;
                }
                var $group = getTemplateGroupUI(group, fireEvent);
                $templates.append($group);
            });
        };
        return {
            $element: $element,
            setTemplates: setTemplates,
            on: on,
            off: off
        };
    };
    //# sourceMappingURL=templateSelector.js.map

    var Editor = (function () {
        function Editor($editor, options) {
            var _this = this;
            this.isLoaded = false;
            this.getData = function () {
                return getContainerData(_this.container, _this.options.ignoreHtml);
            };
            this.getHtml = function () { return getContainerHtml(_this.container); };
            this.onError = function (message, code) {
                if (code === void 0) { code = 0; }
                return _this.options.onError({ message: message, code: code });
            };
            this.$element = $editor;
            this.$element.classList.add(Selectors.classEditor);
            this.options = __assign(__assign({}, defaultOptions), options);
            this.container = createContainer($editor, false);
            this.selectedContainer = this.container;
            this.tryBindFormSubmit();
        }
        Editor.prototype.initAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var editor, templates, templatesUI, blocks;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            editor = this;
                            return [4, loadTemplatesAsync(editor.options.templatesUrl, editor.$element, editor.onError)];
                        case 1:
                            templates = _a.sent();
                            templatesUI = getTemplateSelector();
                            templatesUI.setTemplates(templates);
                            templatesUI.on("templateClick", function (_a) {
                                var template = _a.template;
                                addBlockToContainer(_this.getCurrentContainer(), {
                                    blockTemplate: template
                                });
                            });
                            this.$element.append(templatesUI.$element);
                            return [4, this.tryLoadInitialBlocksAsync()];
                        case 2:
                            blocks = _a.sent();
                            if (blocks !== null) {
                                this.loadBlocks(blocks);
                            }
                            this.isLoaded = true;
                            this.trigger("onLoad", this);
                            return [2];
                    }
                });
            });
        };
        Editor.prototype.tryBindFormSubmit = function () {
            var editor = this;
            var $form = this.options.formSelector
                ? $dom.find(this.options.formSelector)
                : null;
            var $input = this.options.inputSelector
                ? $dom.find(this.options.inputSelector)
                : null;
            if (!$form || !$input || !($input instanceof HTMLInputElement)) {
                return;
            }
            $form.addEventListener("submit", function () {
                $input.value = JSON.stringify(editor.getData());
                return true;
            });
        };
        Editor.prototype.loadBlocks = function (blocksData) {
            var _this = this;
            if (blocksData) {
                blocksData.map(function (blockData) {
                    return addBlockToContainer(_this.getCurrentContainer(), {
                        blockData: blockData
                    });
                });
            }
        };
        Editor.prototype.getCurrentContainer = function () {
            return this.container;
        };
        Editor.prototype.tryLoadInitialBlocksAsync = function () {
            return __awaiter(this, void 0, Promise, function () {
                var url, editor;
                var _this = this;
                return __generator(this, function (_a) {
                    url = this.options.blocksUrl;
                    editor = this;
                    return [2, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            var blocks, error_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(url !== undefined)) return [3, 5];
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4, getRequest(url)];
                                    case 2:
                                        blocks = _a.sent();
                                        resolve(blocks);
                                        return [3, 4];
                                    case 3:
                                        error_1 = _a.sent();
                                        editor.onError(EditorStrings.errorBlocksFileNotFound(url));
                                        reject(error_1);
                                        return [3, 4];
                                    case 4: return [3, 6];
                                    case 5:
                                        if (this.options.blocks !== undefined) {
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
        Editor.prototype.trigger = function (event, data) {
            var editor = this;
            $dom.trigger(this.$element, "bre." + event, data);
            Common.propsEach(editor.options, function (key, value) {
                if (str.equalsInvariant(key, event) && value) {
                    value(data);
                }
            });
        };
        return Editor;
    }());
    //# sourceMappingURL=Editor.js.map

    exports.Editor = Editor;

    return exports;

}({}));
