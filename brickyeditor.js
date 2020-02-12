"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
define("httpTransport", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRequest = function (url) {
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
    exports.loadScriptAsync = function (url) {
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
    exports.jsonp = function (url) {
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
});
define("embed", ["require", "exports", "httpTransport"], function (require, exports, httpTransport_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.preProcessEmbedUrl = function (url) {
        return url.replace("https://www.instagram.com", "http://instagr.am");
    };
    exports.postProcessEmbed = function (provider) {
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
    exports.getEmbedAsync = function (embedUrl) {
        var url = "https://noembed.com/embed?url=" + embedUrl;
        return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
            var data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, httpTransport_1.jsonp(url)];
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
});
define("emmiter", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.emmiter = function () {
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
});
define("ui/Selectors", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.Selectors = Selectors;
});
define("fields/field", ["require", "exports", "ui/Selectors"], function (require, exports, Selectors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isValidFieldType = function (data, type) { return data.type === type; };
    exports.updateFieldData = function (field, changes, fireEvent) {
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
    exports.toggleFieldSelection = function (field, selected, fireEvent) {
        var classList = field.$element.classList;
        if (selected) {
            field.selected = selected;
            classList.add(Selectors_1.Selectors.selectorFieldSelected);
        }
        else {
            classList.remove(Selectors_1.Selectors.selectorFieldSelected);
        }
        if (fireEvent !== undefined) {
            fireEvent(selected ? "focus" : "blur", { field: field });
        }
    };
    exports.getCleanFieldElement = function ($field) {
        var $el = $field.cloneNode(true);
        $el.attributes.removeNamedItem(Selectors_1.Selectors.attrField);
        return $el;
    };
});
define("common/DOMHelpers", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var $dom = (function () {
        function $dom() {
        }
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
        $dom.matches = function (el, selector) {
            var matches = el.matches ||
                el.matchesSelector ||
                el.msMatchesSelector ||
                el.mozMatchesSelector ||
                el.webkitMatchesSelector ||
                el.oMatchesSelector;
            return matches.call(el, selector);
        };
        return $dom;
    }());
    exports.$dom = $dom;
});
define("EditorStrings", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.EditorStrings = EditorStrings;
});
define("helpers", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.strEqualsInvariant = function (s1, s2) {
        if (!s1 || !s2) {
            return s1 === s2;
        }
        return s1.toLowerCase() === s2.toLowerCase();
    };
    exports.helpers = {
        createElement: createElement,
        div: div,
        el: el,
        parseElementData: parseElementData,
        toggleVisibility: toggleVisibility,
        readFileAsync: readFileAsync,
        objectToArray: objectToArray,
        filterNotNull: filterNotNull
    };
});
define("fields/inputs", ["require", "exports", "helpers"], function (require, exports, helpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var renderLabel = function ($root, $input, _a) {
        var title = _a.title;
        if (title !== undefined) {
            var $label = helpers_1.helpers.el({
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
    exports.renderInput = function (props) {
        var type = props.type, placeholder = props.placeholder;
        var $root = helpers_1.helpers.div("bre-field-editor-prop");
        var $input = helpers_1.helpers.el({
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
                            return [4, helpers_1.helpers.readFileAsync(file)];
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
    exports.renderSelect = function (props) {
        var placeholder = props.placeholder, value = props.value, options = props.options, onUpdate = props.onUpdate;
        var $root = helpers_1.helpers.div("bre-field-editor-prop");
        var $select = helpers_1.helpers.el({
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
});
define("locales", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.locales = {
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
});
define("fields/linkEditor", ["require", "exports", "helpers", "fields/inputs", "locales"], function (require, exports, helpers_2, inputs_1, locales_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.linkEditor = function (initialData) {
        var data = initialData ? __assign({}, initialData) : {};
        var $element = helpers_2.helpers.div("bre-field-editor-root");
        var $href = inputs_1.renderInput(__assign(__assign({}, locales_1.locales.prompt.link.href), { value: data.href, type: "text", onUpdate: function (v) { return (data.href = v); } }));
        var $title = inputs_1.renderInput(__assign(__assign({}, locales_1.locales.prompt.link.title), { value: data.title, type: "text", onUpdate: function (v) { return (data.title = v); } }));
        var $target = inputs_1.renderSelect(__assign(__assign({}, locales_1.locales.prompt.link.target), { value: data.target, options: [
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
});
define("ui/selection", ["require", "exports", "common/DOMHelpers"], function (require, exports, DOMHelpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSelectionRanges = function () {
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
    exports.restoreSelection = function (selectionRanges) {
        if (selectionRanges === null || selectionRanges.length === 0) {
            return;
        }
        var selection = window.getSelection();
        if (selection !== null) {
            selection.removeAllRanges();
            selectionRanges.forEach(function (range) { return selection.addRange(range); });
        }
    };
    exports.bindTextSelection = function ($el, handler) {
        if (!DOMHelpers_1.$dom.matches($el, "[contenteditable]")) {
            return;
        }
        $el.addEventListener("mouseup", function () {
            setTimeout(function () {
                var rect = getSelectionRect();
                handler(rect);
            }, 0);
        });
        $el.addEventListener("keyup", function () {
            var rect = getSelectionRect();
            handler(rect);
        });
    };
    var getSelectionRect = function () {
        var selection = window.getSelection();
        if (selection === null) {
            return null;
        }
        var range = selection.getRangeAt(0);
        return range.getBoundingClientRect();
    };
});
define("modal", ["require", "exports", "ui/selection", "helpers"], function (require, exports, selection_1, helpers_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialog = function ($content, ok, cancel) {
        var selection = selection_1.getSelectionRanges();
        var root = helpers_3.helpers.div("bre-modal");
        var close = function () {
            root.remove();
            selection_1.restoreSelection(selection);
        };
        var $ok = helpers_3.helpers.el({
            tag: "button",
            props: {
                type: "button",
                onclick: function () {
                    if (ok) {
                        ok();
                    }
                    close();
                },
                innerHTML: "Ok"
            }
        });
        var $cancel = helpers_3.helpers.el({
            tag: "button",
            props: {
                type: "button",
                onclick: function () {
                    if (cancel) {
                        cancel();
                    }
                    close();
                },
                innerHTML: "Cancel"
            }
        });
        var $placeholder = helpers_3.helpers.div("bre-modal-placeholder");
        $placeholder.append($content, $ok, $cancel);
        root.append($placeholder);
        document.body.appendChild(root);
    };
});
define("ui/htmlTools", ["require", "exports", "helpers", "ui/Selectors", "fields/linkEditor", "modal"], function (require, exports, helpers_4, Selectors_2, linkEditor_1, modal_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var promptLinkParamsAsync = function (initialData) {
        return new Promise(function (resolve) {
            var _a = linkEditor_1.linkEditor(initialData), $editor = _a.$element, updatedData = _a.data;
            modal_1.dialog($editor, function () {
                resolve(updatedData);
            }, function () {
                resolve(null);
            });
        });
    };
    var renderButtonElement = function (_a) {
        var icon = _a.icon, command = _a.command, range = _a.range, aValueArgument = _a.aValueArgument;
        var $btn = helpers_4.helpers.createElement("<button type=\"button\" class=\"bre-btn\"><i class=\"fa fa-" + icon + "\"></i></button>");
        $btn.onclick = function () { return __awaiter(void 0, void 0, void 0, function () {
            var selection, selectionRange, selectedLink, currentLink, updatedLink, valueArgument;
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
                        selectedLink = getSeletedLink(selection);
                        currentLink = selectedLink !== null
                            ? {
                                href: selectedLink.href,
                                title: selectedLink.title,
                                target: selectedLink.target
                            }
                            : {};
                        return [4, promptLinkParamsAsync(currentLink)];
                    case 1:
                        updatedLink = _a.sent();
                        if (updatedLink !== null && updatedLink.href) {
                            document.execCommand(command, false, updatedLink.href);
                            if (selection.anchorNode !== null &&
                                selection.anchorNode.parentElement !== null) {
                                if (updatedLink.target) {
                                    selection.anchorNode.parentElement.setAttribute("target", updatedLink.target);
                                }
                                if (updatedLink.title) {
                                    selection.anchorNode.parentElement.setAttribute("title", updatedLink.title);
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
    var getSeletedLink = function (selection) {
        if (selection.anchorNode !== null &&
            selection.anchorNode.parentNode !== null &&
            helpers_4.strEqualsInvariant(selection.anchorNode.parentNode.nodeName, "a")) {
            return selection.anchorNode.parentNode;
        }
        return null;
    };
    var renderControl = function (buttons) {
        var $panel = helpers_4.helpers.createElement('<div class="bre-html-tools-panel"></div>');
        buttons.map(renderButtonElement).forEach(function ($btn) { return $panel.appendChild($btn); });
        var $controlRoot = helpers_4.helpers.createElement('<div class="bre-html-tools bre-btn-group"></div>');
        $controlRoot.appendChild($panel);
        helpers_4.helpers.toggleVisibility($controlRoot, false);
        return $controlRoot;
    };
    var wrapSelectionToContainer = function (selection) {
        if (selection.anchorNode === null) {
            return;
        }
        var $container = selection.anchorNode.parentElement;
        if ($container !== null) {
            var $wrapper = helpers_4.helpers.createElement("<div class=\"bre-temp-container\" contenteditable=\"true\">" + $container.innerHTML + "</div>");
            $container.innerHTML = "";
            $container.removeAttribute(Selectors_2.Selectors.attrContentEditable);
            $container.appendChild($wrapper);
            var range = document.createRange();
            range.selectNodeContents($wrapper);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };
    var control;
    exports.initHtmlTools = function (_a) {
        var htmlToolsButtons = _a.htmlToolsButtons;
        control = renderControl(htmlToolsButtons);
        document.body.appendChild(control);
    };
    exports.toggleHtmlTools = function (rect) {
        if (rect !== null && rect.width > 1) {
            var top_1 = rect.top + rect.height;
            var left = rect.left;
            control.style.top = top_1 + "px";
            control.style.left = left + "px";
            helpers_4.helpers.toggleVisibility(control, true);
        }
        else {
            helpers_4.helpers.toggleVisibility(control, false);
        }
    };
});
define("fields/html", ["require", "exports", "fields/field", "ui/htmlTools", "ui/selection", "ui/Selectors", "emmiter"], function (require, exports, field_1, htmlTools_1, selection_2, Selectors_3, emmiter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MaxPreviewLength = 50;
    exports.html = function (_a) {
        var $element = _a.$element, preview = _a.preview, data = _a.data;
        if (!field_1.isValidFieldType(data, "html")) {
            return null;
        }
        if (preview) {
            $element.innerHTML =
                $element.innerHTML.length > MaxPreviewLength
                    ? $element.innerHTML.substr(0, MaxPreviewLength) + "..."
                    : $element.innerHTML;
            return {
                $element: $element
            };
        }
        bind($element, data);
        var _b = emmiter_1.emmiter(), fireEvent = _b.fire, on = _b.on, off = _b.off;
        var field = {
            $element: $element,
            data: data,
            on: on,
            off: off,
            bind: bind,
            html: getHtml
        };
        var updateHtmlProp = function () {
            var html = $element.innerHTML.trim();
            if ($element.innerHTML !== html) {
                var updatedData = {
                    html: html
                };
                field_1.updateFieldData(field, updatedData, fireEvent);
            }
        };
        $element.setAttribute(Selectors_3.Selectors.attrContentEditable, "true");
        selection_2.bindTextSelection($element, function (rect) {
            htmlTools_1.toggleHtmlTools(rect);
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
            field_1.toggleFieldSelection(field, true, fireEvent);
            return false;
        });
        return field;
    };
    var bind = function ($element, _a) {
        var html = _a.html;
        if (html !== undefined) {
            $element.innerHTML = html;
        }
    };
    var getHtml = function (field) {
        var $copy = field_1.getCleanFieldElement(field.$element);
        $copy.removeAttribute(Selectors_3.Selectors.attrContentEditable);
        return $copy;
    };
});
define("fields/editors", ["require", "exports", "modal"], function (require, exports, modal_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.propmtFieldEditorAsync = function (_a) {
        var editor = _a.editor, data = _a.data;
        return new Promise(function (resolve) {
            if (editor === undefined) {
                resolve(null);
                return;
            }
            var _a = editor(data), $editor = _a.$element, updatedData = _a.data;
            modal_2.dialog($editor, function () {
                resolve(updatedData);
            }, function () {
                resolve(null);
            });
        });
    };
});
define("fields/embed", ["require", "exports", "embed", "fields/field", "helpers", "httpTransport", "locales", "emmiter", "fields/editors", "fields/inputs"], function (require, exports, embed_1, field_2, helpers_5, httpTransport_2, locales_2, emmiter_2, editors_1, inputs_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var providerScriptsLoaded = {};
    exports.embed = function (_a) {
        var $element = _a.$element, preview = _a.preview, data = _a.data;
        if (!field_2.isValidFieldType(data, "embed")) {
            return null;
        }
        if (preview) {
            return { $element: $element };
        }
        bind($element, data);
        var _b = emmiter_2.emmiter(), fire = _b.fire, on = _b.on, off = _b.off;
        var field = {
            $element: $element,
            data: data,
            on: on,
            off: off,
            bind: bind,
            html: html,
            editor: editor
        };
        $element.addEventListener("click", function () { return __awaiter(void 0, void 0, void 0, function () {
            var updatedData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        field_2.toggleFieldSelection(field, true);
                        return [4, editors_1.propmtFieldEditorAsync(field)];
                    case 1:
                        updatedData = _a.sent();
                        if (updatedData !== null) {
                            bind(field.$element, updatedData);
                            field_2.updateFieldData(field, updatedData, fire);
                        }
                        return [2];
                }
            });
        }); });
        return field;
    };
    var html = function (field) { return field_2.getCleanFieldElement(field.$element); };
    var editor = function (initialData) {
        var data = __assign({}, initialData);
        var $element = helpers_5.helpers.div("bre-field-editor-root");
        var $preview = helpers_5.helpers.div("bre-field-editor-preview");
        bind($preview, data);
        var $url = inputs_2.renderInput(__assign(__assign({}, locales_2.locales.prompt.embed.url), { value: data.url || "", type: "text", onUpdate: function (v) {
                if (data.url != v) {
                    data.url = v;
                    bind($preview, data);
                }
            } }));
        $element.append($preview, $url);
        return {
            $element: $element,
            data: data
        };
    };
    var bind = function ($element, _a) {
        var url = _a.url;
        return __awaiter(void 0, void 0, void 0, function () {
            var embed, $embed, $script;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (url === undefined) {
                            return [2];
                        }
                        return [4, embed_1.getEmbedAsync(embed_1.preProcessEmbedUrl(url))];
                    case 1:
                        embed = _b.sent();
                        $embed = helpers_5.helpers.createElement(embed.html);
                        $script = $embed.querySelector("script");
                        if ($script !== null) {
                            $script.remove();
                        }
                        $element.innerHTML = "";
                        $element.appendChild($embed);
                        if (!($script !== null)) return [3, 4];
                        if (!(providerScriptsLoaded[$script.src] === undefined)) return [3, 3];
                        return [4, httpTransport_2.loadScriptAsync($script.src)];
                    case 2:
                        _b.sent();
                        providerScriptsLoaded[embed.provider_name] = true;
                        _b.label = 3;
                    case 3:
                        setTimeout(function () { return embed_1.postProcessEmbed(embed.provider_name); }, 100);
                        _b.label = 4;
                    case 4: return [2];
                }
            });
        });
    };
});
define("fields/container", ["require", "exports", "BlocksContainer", "fields/field", "helpers", "ui/Selectors", "emmiter"], function (require, exports, BlocksContainer_1, field_3, helpers_6, Selectors_4, emmiter_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.container = function (_a) {
        var $element = _a.$element, preview = _a.preview, data = _a.data;
        if (!field_3.isValidFieldType(data, "container")) {
            return null;
        }
        if (preview) {
            return { $element: $element };
        }
        var container = BlocksContainer_1.createContainer($element, !preview);
        var _b = emmiter_3.emmiter(), fireEvent = _b.fire, on = _b.on, off = _b.off;
        var field = {
            $element: $element,
            data: data,
            on: on,
            off: off,
            html: html,
            bind: bind,
            container: container
        };
        $element.classList.add(Selectors_4.Selectors.selectorFieldContainer);
        $element.addEventListener("click", function (ev) {
            field_3.toggleFieldSelection(field, true, fireEvent);
            ev.stopPropagation();
            return false;
        });
        var updateBlocks = function () {
            var blocks = BlocksContainer_1.getContainerData(container);
            var html = BlocksContainer_1.getContainerHtml(container);
            var updatedData = __assign(__assign({}, field.data), { blocks: blocks,
                html: html });
        };
        return field;
    };
    var html = function (field) {
        var container = field.container;
        var html = BlocksContainer_1.getContainerHtml(container);
        return helpers_6.helpers.createElement(html);
    };
    var bind = function () { };
});
define("fields/image", ["require", "exports", "fields/field", "helpers", "emmiter", "fields/inputs", "locales", "fields/linkEditor", "fields/editors"], function (require, exports, field_4, helpers_7, emmiter_4, inputs_3, locales_3, linkEditor_2, editors_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.image = function (_a) {
        var $element = _a.$element, preview = _a.preview, data = _a.data;
        if (!field_4.isValidFieldType(data, "image")) {
            return null;
        }
        bind($element, data);
        if (preview) {
            return {
                $element: $element
            };
        }
        var _b = emmiter_4.emmiter(), fireEvent = _b.fire, on = _b.on, off = _b.off;
        var field = {
            $element: $element,
            data: data,
            on: on,
            off: off,
            bind: bind,
            html: html,
            editor: editor
        };
        $element.addEventListener("click", function () { return __awaiter(void 0, void 0, void 0, function () {
            var updatedData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        field_4.toggleFieldSelection(field, true);
                        return [4, editors_2.propmtFieldEditorAsync(field)];
                    case 1:
                        updatedData = _a.sent();
                        if (updatedData !== null) {
                            bind(field.$element, updatedData);
                            field_4.updateFieldData(field, updatedData, fireEvent);
                        }
                        return [2];
                }
            });
        }); });
        return field;
    };
    var bind = function ($element, data) {
        var src = getSrcOrFile(data);
        var alt = data.alt || "";
        var isImageElement = $element.tagName.toLowerCase() === "img";
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
    var editor = function (initialData) {
        var data = __assign({}, initialData);
        var $element = helpers_7.helpers.div("bre-field-editor-root");
        var $previewImg = helpers_7.helpers.el({
            tag: "img",
            className: "bre-field-editor-preview-img",
            props: {
                src: getSrcOrFile(data)
            }
        });
        var $preview = helpers_7.helpers.div("bre-field-editor-preview");
        $preview.appendChild($previewImg);
        var $src = inputs_3.renderInput(__assign(__assign({}, locales_3.locales.prompt.image.link), { value: data.src, type: "text", onUpdate: function (src) {
                $previewImg.src = src;
                data.src = src;
                data.file = undefined;
            } }));
        var $file = inputs_3.renderInput(__assign(__assign({}, locales_3.locales.prompt.image.upload), { type: "file", value: data.file ? data.file.fileContent : "", onUpdate: function (f, fileContent) { return __awaiter(void 0, void 0, void 0, function () {
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
        var $alt = inputs_3.renderInput(__assign(__assign({}, locales_3.locales.prompt.image.alt), { value: data.alt, type: "text", onUpdate: function (v) { return (data.alt = $previewImg.alt = v); } }));
        var _a = linkEditor_2.linkEditor(initialData.link), $link = _a.$element, linkData = _a.data;
        data.link = linkData;
        $element.append($preview, $src, $file, $alt, $link);
        return {
            $element: $element,
            data: data
        };
    };
    var html = function (field) {
        var $element = field.$element, data = field.data;
        var link = data.link;
        var $result = field_4.getCleanFieldElement($element);
        if (link !== undefined && link.href !== undefined && link.href.length) {
            var $link = helpers_7.helpers.el({
                tag: "a",
                props: link
            });
            $link.appendChild($result);
            return $link;
        }
        return $result;
    };
    var getSrcOrFile = function (data) {
        return data.src || (data.file !== undefined ? data.file.fileContent : "");
    };
});
define("fields/fields", ["require", "exports", "fields/html", "fields/embed", "fields/container", "fields/image", "helpers", "ui/Selectors"], function (require, exports, html_1, embed_2, container_1, image_2, helpers_8, Selectors_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var fields = {
        html: html_1.html,
        image: image_2.image,
        embed: embed_2.embed,
        container: container_1.container
    };
    var getFieldFunc = function (type) { return fields[type]; };
    exports.registerField = function () {
    };
    exports.createField = function (_a) {
        var $element = _a.$element, preview = _a.preview, initialData = _a.data;
        var data = helpers_8.helpers.parseElementData($element, "breField");
        if (data === null) {
            return null;
        }
        if (initialData !== undefined) {
            data = __assign(__assign({}, data), initialData);
        }
        var field = getFieldFunc(data.type);
        if (field === undefined) {
            throw new Error(data.type + " field not found");
        }
        return field({
            $element: $element,
            preview: preview,
            data: data
        });
    };
    exports.bindFields = function ($element, block) {
        var $fieldElement = findFieldElements($element);
        var fields = $fieldElement.map(function ($fieldElement) {
            return bindField($fieldElement, block);
        });
        return helpers_8.helpers.filterNotNull(fields);
    };
    function bindField($element, block) {
        var data = helpers_8.helpers.parseElementData($element, "breField");
        if (data === null) {
            return null;
        }
        if (block === undefined) {
            return exports.createField({
                $element: $element,
                preview: true,
                data: data
            });
        }
        data = getFieldDataByName(block, data.name) || data;
        var field = exports.createField({
            $element: $element,
            preview: false,
            data: data
        });
        return field;
    }
    function getFieldDataByName(block, name) {
        if (!block.data || !block.data.fields) {
            return null;
        }
        var field = block.data.fields.find(function (f) { return helpers_8.strEqualsInvariant(f.name, name); });
        if (field === undefined) {
            return null;
        }
        return field;
    }
    function findFieldElements($html) {
        var nodes = $html.querySelectorAll(Selectors_5.Selectors.selectorField);
        var $fields = nodes.length > 0 ? Array.prototype.slice.call(nodes) : [];
        if ($html.attributes.getNamedItem(Selectors_5.Selectors.attrField) !== null) {
            $fields = __spreadArrays($fields, [$html]);
        }
        return $fields;
    }
});
define("template", ["require", "exports", "common/DOMHelpers", "EditorStrings", "helpers", "httpTransport", "ui/Selectors", "fields/fields"], function (require, exports, DOMHelpers_2, EditorStrings_1, helpers_9, httpTransport_3, Selectors_6, fields_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var allTemplates = [];
    exports.getTemplate = function (templateName) {
        var template = allTemplates.find(function (x) {
            return helpers_9.strEqualsInvariant(x.name, templateName);
        });
        if (template === undefined) {
            throw new Error("Template is not registred: " + templateName);
        }
        return template;
    };
    exports.loadTemplatesAsync = function (url, $editor) { return __awaiter(void 0, void 0, void 0, function () {
        var grouppedTemplates, data, $data, $style, $groups, ungrouppedTemplates, ungrouppedTemplatesGroupName, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    grouppedTemplates = [];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, httpTransport_3.getRequest(url)];
                case 2:
                    data = _a.sent();
                    $data = helpers_9.helpers.createElement("<div>" + data + "</div>");
                    $style = $data.querySelector("style");
                    if ($style !== null) {
                        DOMHelpers_2.$dom.before($editor, $style);
                    }
                    $groups = $data.querySelectorAll(Selectors_6.Selectors.selectorTemplateGroup);
                    $groups.forEach(function ($group) {
                        var name = $group.getAttribute("title");
                        var templates = parseTemplates($group);
                        grouppedTemplates.push({ name: name, templates: templates });
                        $group.remove();
                        allTemplates = __spreadArrays(allTemplates, templates);
                    });
                    ungrouppedTemplates = parseTemplates($data);
                    ungrouppedTemplatesGroupName = grouppedTemplates.length > 0
                        ? EditorStrings_1.EditorStrings.defaultTemplatesGroupName
                        : "";
                    grouppedTemplates.push({
                        name: ungrouppedTemplatesGroupName,
                        templates: ungrouppedTemplates
                    });
                    allTemplates = __spreadArrays(allTemplates, ungrouppedTemplates);
                    return [2, grouppedTemplates];
                case 3:
                    err_2 = _a.sent();
                    return [3, 4];
                case 4: return [2];
            }
        });
    }); };
    var parseTemplates = function ($el) {
        var templates = [];
        var $templates = $el.querySelectorAll(Selectors_6.Selectors.selectorTemplate);
        $templates.forEach(function ($template) {
            var template = createTemplate($template);
            if (template !== null) {
                templates.push(template);
            }
        });
        return templates;
    };
    exports.getTemplatePreview = function (template) {
        var $template = helpers_9.helpers.createElement("<div class='" + Selectors_6.Selectors.classTemplate + "'></div>");
        $template.appendChild(template.$preview);
        return $template;
    };
    var createTemplate = function ($template) {
        var name = $template.dataset.name || "";
        var $preview = $template.querySelector(Selectors_6.Selectors.selectorTemplatePreview);
        if ($preview !== null) {
            $template.removeChild($preview);
        }
        else {
            $preview = $template.cloneNode(true);
            fields_1.bindFields($preview);
        }
        return {
            name: name,
            $html: $template,
            $preview: $preview
        };
    };
});
define("block/blockEditor", ["require", "exports", "helpers"], function (require, exports, helpers_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    var control;
    function createEditor() {
        var $element = helpers_10.helpers.div("bre-block-editor");
        var btns = defaultButtons.map(function (btn) {
            var action = btn.action, icon = btn.icon, name = btn.name;
            var $btn = helpers_10.helpers.div("bre-block-editor-button", icon);
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
    exports.showBlockEditor = function (block) {
        if (control === undefined) {
            control = createEditor();
        }
        control.btns.forEach(function (_a) {
            var $btn = _a.$btn, action = _a.action;
            $btn.onclick = function () { return action(block.fire); };
        });
        block.$element.insertAdjacentElement("beforebegin", control.$element);
    };
    exports.hideBlockEditor = function () {
        if (control !== undefined) {
            control.$element.remove();
        }
    };
});
define("block/Block", ["require", "exports", "fields/field", "template", "ui/Selectors", "block/blockEditor", "emmiter", "fields/fields"], function (require, exports, field_5, template_1, Selectors_7, blockEditor_1, emmiter_5, fields_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.selectField = function (block, field) {
        block.selectedField = field;
    };
    exports.toggleBlockSelection = function (container, block, selected) {
        if (!selected && block.selectedField !== null) {
            field_5.toggleFieldSelection(block.selectedField, false);
        }
        var classList = block.$element.classList;
        if (selected) {
            classList.add(Selectors_7.Selectors.selectorBlockSelected);
        }
        else {
            classList.remove(Selectors_7.Selectors.selectorBlockSelected);
        }
        if (selected) {
            blockEditor_1.showBlockEditor(block);
        }
        else {
            blockEditor_1.hideBlockEditor();
        }
    };
    exports.createBlockFromData = function (blockData) {
        var blockTemplate = template_1.getTemplate(blockData.template);
        return exports.createBlockFromTemplate(blockTemplate, blockData);
    };
    exports.createBlockFromTemplate = function (blockTemplate, data) {
        if (data === void 0) { data = {
            template: blockTemplate.name,
            fields: []
        }; }
        var $element = blockTemplate.$html.cloneNode(true);
        var ee = emmiter_5.emmiter();
        var block = __assign(__assign({}, ee), { $element: $element,
            data: data, selectedField: null });
        block.fields = fields_2.bindFields($element, block);
        block.fields.forEach(function (field) {
            if (field.on !== undefined) {
                field.on("focus", function (f) {
                    if (f !== undefined) {
                        exports.selectField(block, f.field);
                    }
                });
            }
        });
        return block;
    };
});
define("BlocksContainer", ["require", "exports", "block/Block", "helpers", "common/DOMHelpers", "block/blockEditor"], function (require, exports, Block_1, helpers_11, DOMHelpers_3, blockEditor_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getContainerData = function (container) {
        return container.blocks.map(function (block) { return block.data; });
    };
    exports.getContainerHtml = function (container, ignoreHtml) {
        var html = container.blocks.map(function (block) { return block.getHtml(true); }).join("\n");
        var root = container.$element.cloneNode(false);
        root.innerHTML = html;
        return root.outerHTML;
    };
    exports.getActiveContainer = function (container) {
        if (container.selectedBlock === null ||
            container.selectedBlock.selectedField === null) {
            return container;
        }
        var selectedField = container.selectedBlock.selectedField;
        if (selectedField.type === "container") {
            var containerField = selectedField;
            return exports.getActiveContainer(containerField.container);
        }
        return container;
    };
    var getDefaultPlaceholder = function () {
        return helpers_11.helpers.createElement("<div style=\"min-height: 100px; display: flex; align-items: center; justify-content: center; font-weight: 700; cursor: pointer;\">\n      <div data-bre-placeholder=\"true\">Click here to select this container</div>\n    </div>");
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
    exports.addBlockToContainer = function (container, options) {
        var blocks = container.blocks, selectedBlock = container.selectedBlock;
        var block = options.blockData !== undefined
            ? Block_1.createBlockFromData(options.blockData)
            : Block_1.createBlockFromTemplate(options.blockTemplate);
        var idx = options.idx;
        if (idx === undefined) {
            idx =
                selectedBlock !== null
                    ? blocks.indexOf(selectedBlock) + 1
                    : blocks.length;
        }
        container.blocks = __spreadArrays(blocks.slice(0, idx), [block], blocks.slice(idx));
        block.on("delete", function () {
            exports.deleteBlock(container, block);
        });
        block.on("clone", function () {
            exports.copyBlock(container, block);
        });
        block.on("move", function (ev) {
            exports.moveBlock(container, block, ev !== undefined ? ev.offset : 0);
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
            Block_1.toggleBlockSelection(container, container.selectedBlock, false);
        }
        container.selectedBlock = block;
        Block_1.toggleBlockSelection(container, container.selectedBlock, true);
    }
    exports.createContainer = function ($element, usePlaceholder) {
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
    exports.deleteBlock = function (container, block) {
        if (container.selectedBlock === block) {
            Block_1.toggleBlockSelection(container, block, false);
        }
        container.blocks = container.blocks.filter(function (b) { return b !== block; });
        block.$element.remove();
        block = null;
    };
    exports.copyBlock = function (container, block) {
        var idx = container.blocks.indexOf(block) + 1;
        exports.addBlockToContainer(container, {
            idx: idx,
            blockData: block.data
        });
    };
    exports.moveBlock = function (container, block, offset) {
        var idx = container.blocks.indexOf(block);
        var new_idx = idx + offset;
        if (new_idx >= container.blocks.length || new_idx < 0) {
            return;
        }
        var $anchorBlock = container.blocks[new_idx].$element;
        if ($anchorBlock) {
            if (offset > 0) {
                DOMHelpers_3.$dom.after($anchorBlock, block.$element);
            }
            else if (offset < 0) {
                DOMHelpers_3.$dom.before($anchorBlock, block.$element);
            }
        }
        blockEditor_2.showBlockEditor(block);
        container.blocks.splice(idx, 1);
        container.blocks.splice(new_idx, 0, block);
    };
});
define("defaults", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var defaultButtons = [
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
    exports.defaultOptions = {
        templatesUrl: "templates/bootstrap4.html",
        compactTools: false,
        compactToolsWidth: 768,
        ignoreHtml: true,
        htmlToolsButtons: defaultButtons
    };
});
define("ui/templateSelector", ["require", "exports", "helpers", "emmiter"], function (require, exports, helpers_12, emmiter_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var getTemplateUI = function (template) {
        var $template = helpers_12.helpers.div("bre-templates-group-item");
        var $preview = template.$preview;
        $preview.setAttribute("title", template.name);
        $template.append($preview);
        return $template;
    };
    var getTemplateGroupUI = function (group, fireFunc) {
        var $group = helpers_12.helpers.div("bre-templates-group");
        var $name = helpers_12.helpers.div("bre-templates-group-name", group.name || "");
        $name.onclick = function () {
            for (var i = 1; i < $group.children.length; i++) {
                helpers_12.helpers.toggleVisibility($group.children[i]);
            }
        };
        $group.append($name);
        group.templates.forEach(function (template) {
            var $template = getTemplateUI(template);
            $group.append($template);
            $template.onclick = function () {
                fireFunc("select", {
                    template: template
                });
            };
        });
        return $group;
    };
    exports.getTemplateSelector = function () {
        var _a = emmiter_6.emmiter(), fireEvent = _a.fire, on = _a.on, off = _a.off;
        var $element = helpers_12.helpers.div("bre-templates-root");
        var $loader = helpers_12.helpers.div("bre-templates-loader", "...LOADING...");
        var $templates = helpers_12.helpers.div("bre-templates-list");
        $element.append($loader, $templates);
        var setTemplates = function (templatesGroupped) {
            helpers_12.helpers.toggleVisibility($loader, false);
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
});
define("Editor", ["require", "exports", "BlocksContainer", "defaults", "httpTransport", "template", "ui/Selectors", "ui/templateSelector", "ui/htmlTools"], function (require, exports, BlocksContainer_2, defaults_1, httpTransport_4, template_2, Selectors_8, templateSelector_1, htmlTools_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Editor = (function () {
        function Editor($editor, options) {
            exports.editor($editor, options);
        }
        return Editor;
    }());
    exports.Editor = Editor;
    exports.editor = function ($element, options) {
        if (options === void 0) { options = defaults_1.defaultOptions; }
        return new Promise(function (resolve) { return __awaiter(void 0, void 0, void 0, function () {
            var optionsWithDefaults, container, getData, getHtml, editor, templates, templatesUI, blocks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        optionsWithDefaults = __assign(__assign({}, defaults_1.defaultOptions), options);
                        container = BlocksContainer_2.createContainer($element, false);
                        getData = function () { return BlocksContainer_2.getContainerData(container); };
                        getHtml = function () {
                            return BlocksContainer_2.getContainerHtml(container, optionsWithDefaults.ignoreHtml);
                        };
                        editor = {
                            $element: $element,
                            container: container,
                            selectedContainer: container,
                            getData: getData,
                            getHtml: getHtml
                        };
                        $element.classList.add(Selectors_8.Selectors.classEditor);
                        htmlTools_2.initHtmlTools(optionsWithDefaults);
                        return [4, template_2.loadTemplatesAsync(optionsWithDefaults.templatesUrl, editor.$element)];
                    case 1:
                        templates = _a.sent();
                        templatesUI = templateSelector_1.getTemplateSelector();
                        if (templates !== undefined) {
                            templatesUI.setTemplates(templates);
                            templatesUI.on("select", function (t) {
                                BlocksContainer_2.addBlockToContainer(container, {
                                    blockTemplate: t.template
                                });
                            });
                            $element.append(templatesUI.$element);
                        }
                        return [4, loadInitialBlocks(optionsWithDefaults)];
                    case 2:
                        blocks = _a.sent();
                        if (blocks !== null) {
                            blocks.map(function (blockData) {
                                return BlocksContainer_2.addBlockToContainer(container, {
                                    blockData: blockData
                                });
                            });
                        }
                        resolve(editor);
                        return [2];
                }
            });
        }); });
    };
    var loadInitialBlocks = function (_a) {
        var blocks = _a.blocks, blocksUrl = _a.blocksUrl;
        return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
            var url, blocks_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = blocksUrl;
                        if (!(url !== undefined)) return [3, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, httpTransport_4.getRequest(url)];
                    case 2:
                        blocks_1 = _a.sent();
                        resolve(blocks_1);
                        return [3, 4];
                    case 3:
                        error_1 = _a.sent();
                        reject(error_1);
                        return [3, 4];
                    case 4: return [2];
                    case 5:
                        if (blocks !== undefined) {
                            resolve(blocks);
                            return [2];
                        }
                        resolve(null);
                        return [2];
                }
            });
        }); });
    };
});
