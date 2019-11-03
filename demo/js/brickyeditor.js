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

    var $dom = (function () {
        function $dom() {
        }
        $dom.offset = function (el) {
            var rect = el.getBoundingClientRect();
            var $body = document.body;
            return {
                top: rect.top + $body.scrollTop,
                left: rect.left + $body.scrollLeft,
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
                el.parentNode.insertBefore(elToInsert, el);
            }
            else {
                elToInsert.forEach(function ($el) { return _this.before(el, $el); });
            }
        };
        $dom.after = function (el, elToInsert) {
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
        startsWith: function (s1, s2) { return s1.indexOf(s2) === 0; },
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

    var createElement = function (html) {
        var temp = document.createElement("div");
        temp.innerHTML = html;
        var result = temp.children[0];
        temp.innerHTML = "";
        return result;
    };
    var px = function (value) { return value + "px"; };
    var toggleVisibility = function (el, visible) {
        if (visible !== undefined) {
            el.style.display = visible ? "initial" : "none";
            return;
        }
        el.style.display = el.style.display !== "none" ? "none" : "initial";
    };
    var modalTemplate = "\n<div>\n  <div class=\"bre-modal\" style=\"display: block;\">\n    <div class=\"bre-modal-placeholder\">\n    </div>\n  </div>\n</div>";
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
    var helpers = {
        px: px,
        createElement: createElement,
        parseElementData: parseElementData,
        showModal: showModal,
        toggleVisibility: toggleVisibility,
        readFileAsync: readFileAsync,
    };
    //# sourceMappingURL=helpers.js.map

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
        Selectors.selectorHtmlToolsCommand = Selectors.attr(Selectors.htmlToolsCommand);
        Selectors.selectorHtmlToolsCommandRange = Selectors.attr(Selectors.htmlToolsCommandRange);
        return Selectors;
    }());
    //# sourceMappingURL=Selectors.js.map

    var createContainerField = function (props, data) {
        var $element = props.$element, preview = props.preview;
        var container = createContainer($element, !preview);
        var field = {
            type: "container",
            name: data.name,
            $field: $element,
            data: data,
            container: container,
            getElement: function () {
                var html = getContainerHtml(container);
                return helpers.createElement(html);
            },
        };
        $element.classList.add(Selectors.selectorFieldContainer);
        if (!preview) {
            $element.addEventListener("click", function (ev) {
                ev.stopPropagation();
                return false;
            });
        }
        return field;
    };
    //# sourceMappingURL=container.js.map

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

    var textFieldEditor = function (_a) {
        var key = _a.key, p = _a.p, data = _a.data;
        var html = "<input type='text' name='" + key + "' placeholder='" + p.placeholder + "' value='" + (p.value || "") + "' />";
        var input = helpers.createElement(html);
        input.onchange = function () {
            data[key] = input.value;
        };
        return input;
    };
    var fileFieldEditor = function (_a) {
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
    var selectFieldEditor = function (_a) {
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
    var parameterEditors = {
        text: textFieldEditor,
        file: fileFieldEditor,
        select: selectFieldEditor,
    };
    var promptAsync = function (params) {
        return new Promise(function (resolve) {
            var result = {};
            var editors = Object.keys(params).map(function (key) {
                var p = params[key];
                var editor = parameterEditors[p.type || "text"]({
                    key: key,
                    p: p,
                    data: result,
                });
                return editor;
            });
            helpers.showModal({
                content: editors,
                onOk: function () { return resolve(result); },
                onCancel: function () { return resolve(null); },
            });
        });
    };
    var getLinkPromptParams = function (link) { return ({
        title: {
            title: locales.prompt.link.title.title,
            placeholder: locales.prompt.link.title.placeholder,
            value: link ? link.getAttribute("title") : "",
        },
        href: {
            title: locales.prompt.link.href.title,
            placeholder: locales.prompt.link.href.placeholder,
            value: link ? link.getAttribute("href") : "",
        },
        target: {
            type: "select",
            title: locales.prompt.link.target.title,
            value: link ? link.getAttribute("target") : "",
            options: [
                { title: "", value: "" },
                { title: locales.prompt.link.target.blank, value: "_blank" },
                { title: locales.prompt.link.target.parent, value: "_parent" },
                { title: locales.prompt.link.target.self, value: "_self" },
                { title: locales.prompt.link.target.top, value: "_top" },
            ],
        },
    }); };
    //# sourceMappingURL=prompt.js.map

    var providerScriptsLoaded = {};
    var getPromptParams = function (_a) {
        var url = _a.url;
        return ({
            url: {
                value: url || "http://instagr.am/p/BO9VX2Vj4fF/",
                title: locales.prompt.embed.url.title,
                placeholder: locales.prompt.embed.url.placeholder,
            },
        });
    };
    var createEmbedField = function (props, data) {
        var $element = props.$element, preview = props.preview;
        var field = {
            type: "embed",
            name: data.name,
            $field: $element,
            data: data,
            getElement: function () {
                var $copy = getFieldElement($element);
                return $copy;
            },
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
        updateEmbedMedia(data.url, false);
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
                                updateEmbedMedia(url, true);
                            }
                        }
                        return [2];
                }
            });
        }); };
        if (!preview) {
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

    var promptLinkParamsAsync = function (selection) { return __awaiter(void 0, void 0, void 0, function () {
        var currentLink, promptParams;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (selection.anchorNode !== null &&
                        selection.anchorNode.parentNode !== null &&
                        str.equalsInvariant(selection.anchorNode.parentNode.nodeName, "a")) {
                        currentLink = selection.anchorNode.parentNode;
                    }
                    promptParams = getLinkPromptParams(currentLink);
                    return [4, promptAsync(promptParams)];
                case 1: return [2, _a.sent()];
            }
        });
    }); };
    var renderButtonElement = function (_a) {
        var icon = _a.icon, command = _a.command, range = _a.range, aValueArgument = _a.aValueArgument;
        var $btn = helpers.createElement("<button type=\"button\" class=\"bre-btn\"><i class=\"fa fa-" + icon + "\"></i></button>");
        $btn.onclick = function () { return __awaiter(void 0, void 0, void 0, function () {
            var selection, selectionRange, link, valueArgument;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selection = window.getSelection();
                        if (selection === null) {
                            return [2];
                        }
                        selectionRange = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
                        if (range && !selectionRange) {
                            return [2];
                        }
                        if (!(command === "CreateLink")) return [3, 2];
                        return [4, promptLinkParamsAsync(selection)];
                    case 1:
                        link = _a.sent();
                        if (link === null) {
                            return [2];
                        }
                        if (link.href) {
                            document.execCommand(command, false, link.href);
                            if (selection.anchorNode !== null &&
                                selection.anchorNode.parentElement !== null) {
                                if (link.target) {
                                    selection.anchorNode.parentElement.setAttribute("target", link.target);
                                }
                                if (link.title) {
                                    selection.anchorNode.parentElement.setAttribute("title", link.title);
                                }
                            }
                        }
                        return [3, 3];
                    case 2:
                        valueArgument = void 0;
                        if (typeof aValueArgument === "string") {
                            valueArgument = aValueArgument.replace("%%SELECTION%%", selection.toString());
                        }
                        try {
                            document.execCommand(command, false, valueArgument);
                        }
                        catch (_b) {
                            wrapSelectionToContainer(selection);
                            document.execCommand(command, false, valueArgument);
                        }
                        _a.label = 3;
                    case 3: return [2, false];
                }
            });
        }); };
        return $btn;
    };
    var renderControl = function (buttons) {
        var $panel = helpers.createElement('<div class="bre-html-tools-panel"></div>');
        buttons.map(renderButtonElement).forEach(function ($btn) { return $panel.appendChild($btn); });
        var $controlRoot = helpers.createElement('<div class="bre-html-tools bre-btn-group"></div>');
        $controlRoot.appendChild($panel);
        helpers.toggleVisibility($controlRoot, false);
        return $controlRoot;
    };
    var wrapSelectionToContainer = function (selection) {
        if (selection.anchorNode === null) {
            return;
        }
        var $container = selection.anchorNode.parentElement;
        if ($container !== null) {
            var $wrapper = helpers.createElement("<div class=\"bre-temp-container\" contenteditable=\"true\">" + $container.innerHTML + "</div>");
            $container.innerHTML = "";
            $container.removeAttribute(Selectors.attrContentEditable);
            $container.appendChild($wrapper);
            var range = document.createRange();
            range.selectNodeContents($wrapper);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };
    var control;
    var initHtmlTools = function (_a) {
        var htmlToolsButtons = _a.htmlToolsButtons;
        control = renderControl(htmlToolsButtons);
        document.body.appendChild(control);
    };
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

    var createHtmlField = function (props, data) {
        var $element = props.$element, preview = props.preview;
        if (data.html) {
            $element.innerHTML = data.html;
        }
        var field = {
            type: "html",
            name: data.name,
            $field: $element,
            data: data,
            getElement: function () {
                var $copy = getFieldElement($element);
                $copy.removeAttribute(Selectors.attrContentEditable);
                return $copy;
            },
        };
        var updateHtmlProp = function () {
            var value = $element.innerHTML.trim();
            if ($element.innerHTML !== value) {
                field.$field.innerHTML = value;
                updateFieldProperty(field, "html", value, true);
            }
        };
        if (!preview) {
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
            $element.addEventListener("click", function (ev) {
                toggleFieldSelection(field, true);
            });
        }
        return field;
    };
    //# sourceMappingURL=html.js.map

    var getPromptParams$1 = function (_a) {
        var src = _a.src, file = _a.file, alt = _a.alt;
        return ({
            src: {
                value: src,
                title: locales.prompt.image.link.title,
                placeholder: locales.prompt.image.link.placeholder,
            },
            file: {
                type: "file",
                value: file,
                title: locales.prompt.image.upload.title,
                placeholder: locales.prompt.image.upload.placeholder,
            },
            alt: {
                value: alt,
                title: locales.prompt.image.alt.title,
                placeholder: locales.prompt.image.alt.placeholder,
            },
        });
    };
    var createImageField = function (props, data) {
        var $element = props.$element, preview = props.preview;
        var isImageElement = $element.tagName.toLowerCase() === "img";
        var updateImageElement = function (d) {
            if (isImageElement) {
                var image = $element;
                image.src = d.src || "";
                image.alt = d.alt || "";
            }
            else {
                $element.style.backgroundImage = "url(" + d.src + ")";
            }
            $element.title = d.alt || "";
        };
        if (data.src) {
            updateImageElement(data);
        }
        var field = {
            type: "image",
            name: data.name,
            $field: $element,
            data: data,
            getElement: function () {
                var $copy = getFieldElement($element);
                var link = field.data.link;
                if (link !== undefined && link.href.length) {
                    var $link = helpers.createElement("<a href='" + link.href + "' title='" + link.title + "' target='" + link.target + "'></a>");
                    $link.appendChild($copy);
                    return $link;
                }
                return $copy;
            },
        };
        if (!preview) {
            $element.addEventListener("click", function () { return __awaiter(void 0, void 0, void 0, function () {
                var params, promptResponse, updatedData, fileContent;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            params = getPromptParams$1(field.data);
                            return [4, promptAsync(params)];
                        case 1:
                            promptResponse = _a.sent();
                            if (promptResponse === null) {
                                return [2];
                            }
                            updatedData = __assign(__assign({}, field.data), { alt: promptResponse.alt });
                            if (!(promptResponse.file !== undefined)) return [3, 5];
                            if (!props.onUpload) return [3, 2];
                            props.onUpload(promptResponse.file, function (src) {
                                updatedData = __assign(__assign({}, updatedData), { src: src, file: undefined });
                            });
                            return [3, 4];
                        case 2: return [4, helpers.readFileAsync(promptResponse.file)];
                        case 3:
                            fileContent = _a.sent();
                            updatedData = __assign(__assign({}, updatedData), { src: fileContent, file: undefined });
                            _a.label = 4;
                        case 4: return [3, 6];
                        case 5:
                            if (promptResponse.src) {
                                updatedData = __assign(__assign({}, updatedData), { src: promptResponse.src, file: undefined });
                            }
                            _a.label = 6;
                        case 6:
                            field.data = updatedData;
                            updateImageElement(updatedData);
                            if (field.onUpdate) {
                                field.onUpdate(field);
                            }
                            return [2];
                    }
                });
            }); });
        }
        return field;
    };
    //# sourceMappingURL=image.js.map

    var _fields = {
        html: function (props, data) {
            return createHtmlField(props, data);
        },
        container: function (props, data) {
            return createContainerField(props, data);
        },
        image: function (props, data) {
            return createImageField(props, data);
        },
        embed: function (props, data) {
            return createEmbedField(props, data);
        },
    };
    var createField = function (props) {
        var $element = props.$element, fields = props.fields;
        var fieldData = helpers.parseElementData($element, "breField");
        if (fieldData === null ||
            fieldData.name === undefined ||
            fieldData.type === undefined) {
            throw new Error("There is no data defined in a field: " + $element.innerHTML);
        }
        var name = fieldData.name, type = fieldData.type;
        if (fields !== undefined) {
            var addFieldData = fields.find(function (f) { return str.equalsInvariant(f.name, name); });
            if (addFieldData) {
                fieldData = __assign(__assign({}, fieldData), addFieldData);
            }
        }
        if (_fields[type] !== undefined) {
            var createFieldFunc = _fields[type];
            return createFieldFunc(props, fieldData);
        }
        else {
            throw new Error(type + " field not found");
        }
    };
    var updateFieldProperty = function (field, prop, value, fireUpdate) {
        var _a;
        if (fireUpdate === void 0) { fireUpdate = true; }
        var oldValue = field.data[prop];
        if (oldValue === value) {
            return;
        }
        field.data = __assign(__assign({}, field.data), (_a = {}, _a[prop] = value, _a));
        if (fireUpdate && field.onUpdate) {
            field.onUpdate(field);
        }
    };
    var toggleFieldSelection = function (field, selected) {
        if (selected === true) {
            field.$field.classList.add(Selectors.selectorFieldSelected);
            if (field.onSelect !== undefined) {
                field.onSelect(field);
            }
        }
        else {
            field.$field.classList.remove(Selectors.selectorFieldSelected);
            if (field.onDeselect !== undefined) {
                field.onDeselect(field);
            }
        }
    };
    var getFieldElement = function ($field) {
        var $el = $field.cloneNode(true);
        $el.attributes.removeNamedItem(Selectors.attrField);
        return $el;
    };
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
                        templates: ungrouppedTemplates,
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
            bindFields($preview, true);
        }
        return {
            name: name,
            $html: $template,
            $preview: $preview,
        };
    };
    //# sourceMappingURL=template.js.map

    var findFields = function ($html) {
        var nodes = $html.querySelectorAll(Selectors.selectorField);
        var $fields = nodes.length > 0 ? Array.prototype.slice.call(nodes) : [];
        if ($html.attributes.getNamedItem(Selectors.attrField) !== null) {
            $fields = __spreadArrays($fields, [$html]);
        }
        return $fields;
    };
    var bindFields = function ($element, preview, fields) {
        if (fields === void 0) { fields = []; }
        var $fields = findFields($element);
        $fields.forEach(function ($field) {
            return createField({
                $element: $field,
                fields: fields,
                preview: preview,
            });
        });
    };
    var createBlockFromData = function (blockData) {
        var template = blockData.template, fields = blockData.fields;
        var blockTemplate = getTemplate(template);
        return createBlockFromTemplate(blockTemplate, fields);
    };
    var createBlockFromTemplate = function (blockTemplate, fields) {
        if (fields === void 0) { fields = []; }
        var $element = blockTemplate.$html.cloneNode(true);
        bindFields($element, false, fields);
        return {
            $element: $element,
            data: {
                template: blockTemplate.name,
                fields: fields,
            },
            selectedField: null,
        };
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
        return helpers.createElement('<i data-bre-placeholder="true">Click here to select this container...</i>');
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
        return block;
    };
    var createContainer = function ($element, usePlaceholder) {
        var $placeholder = usePlaceholder ? getDefaultPlaceholder() : null;
        var container = {
            $element: $element,
            $placeholder: $placeholder,
            blocks: [],
            selectedBlock: null,
        };
        toggleContainersPlaceholder(container);
        return container;
    };

    var defaultButtons = [
        { icon: "bold", command: "Bold", range: true },
        { icon: "italic", command: "Italic", range: true },
        { icon: "link", command: "CreateLink", range: true },
        {
            icon: "list-ul",
            command: "insertUnorderedList",
            range: true,
        },
        {
            icon: "list-ol",
            command: "insertOrderedList",
            range: true,
        },
        { icon: "undo", command: "Undo", range: false },
        { icon: "repeat", command: "Redo", range: false },
    ];
    var defaultOptions = {
        templatesUrl: "templates/bootstrap4.html",
        compactTools: false,
        compactToolsWidth: 768,
        ignoreHtml: true,
        onError: function (data) {
            console.log(data.message);
        },
        htmlToolsButtons: defaultButtons,
    };
    //# sourceMappingURL=defaults.js.map

    //# sourceMappingURL=shared.js.map

    var UI = (function () {
        function UI(editor) {
            this.editor = editor;
            this.editor = editor;
            initHtmlTools(editor.options);
            this.setTools();
        }
        UI.initBtnDeck = function ($btnsDeck) {
            var $btns = $dom.select($btnsDeck, ".bre-btn");
            var $firstBtn = $btns[0];
            $firstBtn.addEventListener("click", function (ev) {
                UI.toggleBtnDeck($btnsDeck);
                ev.stopPropagation();
                return false;
            });
        };
        UI.toggleBtnDeck = function ($btnsDeck, isOn) {
            var $btns = $dom.select($btnsDeck, ".bre-btn");
            if (!$btns || $btns.length === 0) {
                return;
            }
            var $firstBtn = $btns[0];
            var size = 32;
            var gap = size / 6;
            isOn = isOn || $btnsDeck.dataset.isOn || false;
            if (isOn) {
                $btnsDeck.style.height = "0";
                $btnsDeck.style.width = "0";
                $btns.forEach(function ($btn, idx) {
                    if (idx === 0) {
                        return;
                    }
                    $btn.style.opacity = "0";
                    $btn.style.top = "0";
                    $btn.style.left = "0";
                });
            }
            else {
                $btns.forEach(function ($btn, idx) {
                    if (idx === 0) {
                        return;
                    }
                    $btn.style.opacity = "1";
                    $btn.style.left = (idx + 1) * (size + gap) + "px";
                });
                $btnsDeck.style.height = size + "px";
                $btnsDeck.style.width = (size + gap) * $btns.length - gap + "px";
            }
            $dom.toggleClass($firstBtn, "bre-btn-active", !isOn);
            $btnsDeck.dataset.isOn = String(!isOn);
        };
        UI.prototype.toggleToolsLoader = function (toggle) {
            helpers.toggleVisibility(this.$toolsLoader, toggle);
        };
        UI.prototype.setTemplates = function (templateGroups) {
            var _this = this;
            var editor = this.editor;
            templateGroups.forEach(function (group) {
                if (group.templates.length === 0) {
                    return;
                }
                var $header = helpers.createElement("<div class='" + Selectors.classTemplateGroup + "'>" + group.name + "</div>");
                _this.$toolsTemplates.appendChild($header);
                var $group = helpers.createElement("<div></div>");
                group.templates.forEach(function (template) {
                    var $preview = template.$preview;
                    $preview.setAttribute("title", template.name);
                    $preview.onclick = function (ev) {
                        editor.addBlock(template);
                        ev.stopPropagation();
                        return false;
                    };
                    $group.appendChild($preview);
                });
                $header.addEventListener("click", function () {
                    $dom.toggle($group);
                });
                _this.$toolsTemplates.appendChild($group);
            });
        };
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
            this.$tools = helpers.createElement('<div class="bre bre-tools" data-bricky-tools></div>');
            this.$toolsTemplates = helpers.createElement('<div class="bre-tools-templates"></div>');
            this.$toolsLoader = helpers.createElement('<div class="bre-tools-loader"><b>Loading...</b></div>');
            this.$toolsHideBtn = helpers.createElement('<button type="button" class="bre-tools-toggle"><div>►</div></button>');
            this.$tools.appendChild(this.$toolsHideBtn);
            this.$tools.appendChild(this.$toolsLoader);
            this.$tools.appendChild(this.$toolsTemplates);
            this.$toolsHideBtn.onclick = this.toggleTools;
            this.editor.$editor.appendChild(this.$tools);
            if (this.isCompactTools) {
                $dom.addClass(this.$tools, "bre-tools-templates-compact");
                this.toggleTools();
            }
        };
        UI.prototype.toggleTools = function () {
            $dom.toggleClass(this.$tools, "bre-tools-collapsed", !$dom.hasClass(this.$toolsHideBtn, "bre-tools-toggle-collapsed"));
            $dom.toggleClass(this.$toolsHideBtn, "bre-tools-toggle-collapsed");
        };
        return UI;
    }());
    //# sourceMappingURL=UI.js.map

    var setupBlockEvents = function (editor, container, block) {
        block.$element.addEventListener("click", function () {
            return selectBlock(editor, container, block);
        });
    };
    var selectBlock = function (editor, container, block) {
        editor.selectedContainer = container;
        container.selectedBlock = block;
        if (editor.$blockTools === undefined) {
            var createElement = helpers.createElement, px = helpers.px;
            var width = 40;
            var style = {
                position: "absolute",
                width: px(width),
                minHeight: px(width),
                backgroundColor: "red",
                zIndex: "1000",
                transform: "translateX(-" + px(width) + ")",
                transition: "all 2s",
            };
            editor.$blockTools = createElement("<div>\n        <button>del</button>\n      </div>");
            Object.assign(editor.$blockTools.style, style);
        }
        else {
            helpers.toggleVisibility(editor.$blockTools, true);
        }
        block.$element.insertAdjacentElement("beforebegin", editor.$blockTools);
    };
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
            this.$editor = $editor;
            this.$editor.classList.add(Selectors.classEditor);
            this.options = __assign(__assign({}, defaultOptions), options);
            this.container = createContainer($editor, false);
            Editor.UI = new UI(this);
            this.tryBindFormSubmit();
        }
        Editor.prototype.initAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var editor, templates, blocks;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            editor = this;
                            Editor.UI.toggleToolsLoader(true);
                            return [4, loadTemplatesAsync(editor.options.templatesUrl, editor.$editor, editor.onError)];
                        case 1:
                            templates = _a.sent();
                            Editor.UI.toggleToolsLoader(false);
                            Editor.UI.setTemplates(templates);
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
                var blocks = blocksData.map(function (blockData) {
                    return addBlockToContainer(_this.container, {
                        blockData: blockData,
                    });
                });
                blocks.forEach(function (block) {
                    setupBlockEvents(_this, _this.container, block);
                });
                if (blocks.length > 0) {
                    var lastBlock = blocks[blocks.length - 1];
                    selectBlock(this, this.container, lastBlock);
                }
            }
        };
        Editor.prototype.addBlock = function (blockTemplate) {
            var container = this.container;
            var block = addBlockToContainer(container, {
                blockTemplate: blockTemplate,
            });
            setupBlockEvents(this, container, block);
            selectBlock(this, container, block);
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
            $dom.trigger(this.$editor, "bre." + event, data);
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
    exports.selectBlock = selectBlock;

    return exports;

}({}));
