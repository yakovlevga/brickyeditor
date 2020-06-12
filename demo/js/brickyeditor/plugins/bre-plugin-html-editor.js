var brePluginHtmlEditor = (function (exports) {
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

    var el = function (_a) {
        var _b = _a.tag, tag = _b === void 0 ? 'div' : _b, className = _a.className, innerHTML = _a.innerHTML, props = _a.props;
        var result = document.createElement(tag);
        if (className !== undefined) {
            if (Array.isArray(className)) {
                className.forEach(function (x) { return result.classList.add(x); });
            }
            else {
                result.className = className;
            }
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
            innerHTML: innerHTML,
        });
    };
    var createElement = function (html, className) {
        var temp = document.createElement('div');
        temp.innerHTML = html;
        var result = temp.children[0];
        temp.innerHTML = '';
        if (className !== undefined) {
            result.className = className;
        }
        return result;
    };
    var hiddenClassName = 'bre-hidden';
    var toggleVisibility = function (el, visible) {
        if (visible === undefined) {
            visible = el.classList.contains(hiddenClassName);
        }
        toggleClassName(el, hiddenClassName, !visible);
    };
    var toggleClassName = function (el, className, force) { return el.classList.toggle(className, force); };
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
    var convertNodeListToArray = function (nl) {
        return Array.prototype.slice.call(nl);
    };
    var msg = function (key, params) {
        var locale = window.BrickyEditor.i18n.messages[window.BrickyEditor.i18n.locale];
        var str = locale[key];
        if (str === undefined) {
            return '';
        }
        if (params !== undefined) {
            Object.keys(params).forEach(function (p) {
                str.replace(/`{${p}}`/g, params[p]);
            });
        }
        return str;
    };
    var getSelectionRanges = function () {
        var selection = window.getSelection();
        if (selection === null || selection.rangeCount === 0) {
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
    var helpers = {
        createElement: createElement,
        div: div,
        el: el,
        parseElementData: parseElementData,
        toggleVisibility: toggleVisibility,
        toggleClassName: toggleClassName,
        readFileAsync: readFileAsync,
        objectToArray: objectToArray,
        filterNotNull: filterNotNull,
        convertNodeListToArray: convertNodeListToArray,
        msg: msg,
        getSelectionRanges: getSelectionRanges,
        restoreSelection: restoreSelection,
    };

    var renderLabel = function ($root, $input, _a) {
        var title = _a.title;
        if (title !== undefined) {
            var $label = helpers.el({
                tag: 'label',
                className: 'bre-label',
                innerHTML: title,
                props: {
                    onclick: function () { return $input.focus(); },
                },
            });
            $root.append($label);
        }
    };
    var renderInput = function (props) {
        var type = props.type, placeholder = props.placeholder;
        var $root = helpers.div('bre-field-editor-prop');
        var $input = helpers.el({
            tag: 'input',
            className: 'bre-input',
            props: {
                type: type,
                placeholder: placeholder || '',
            },
        });
        if (props.type === 'text') {
            var updateValue = function () {
                props.onUpdate($input.value);
            };
            $input.value = props.value || '';
            $input.onchange = updateValue;
            $input.onkeyup = updateValue;
            $input.onpaste = updateValue;
        }
        else if ((props.type = 'file')) {
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
        var $root = helpers.div('bre-field-editor-prop');
        var $select = helpers.el({
            tag: 'select',
            className: 'bre-input',
            props: {
                placeholder: placeholder || '',
            },
        });
        $select.onchange = function () { return onUpdate($select.value); };
        $select.innerHTML = options
            .map(function (x) {
            return "<option value=\"" + x.value + "\" " + (x.value === value ? 'selected' : '') + ">" + (x.label || x.value) + "</option>";
        })
            .join('\n');
        renderLabel($root, $select, props);
        $root.append($select);
        return $root;
    };

    var linkEditor = function (initialData) {
        var data = initialData ? __assign({}, initialData) : {};
        var $element = helpers.div("bre-field-editor-root");
        var $href = renderInput({
            title: helpers.msg("link.url.title"),
            placeholder: helpers.msg("link.url.placeholder"),
            value: data.href,
            type: "text",
            onUpdate: function (v) { return (data.href = v); },
        });
        var $title = renderInput({
            title: helpers.msg("link.title.title"),
            placeholder: helpers.msg("link.title.placeholder"),
            value: data.title,
            type: "text",
            onUpdate: function (v) { return (data.title = v); },
        });
        var $target = renderSelect({
            title: helpers.msg("link.target.title"),
            value: data.target,
            options: [
                { value: "" },
                { value: "_blank" },
                { value: "_self" },
                { value: "_parent" },
                { value: "_top" },
            ],
            onUpdate: function (v) { return (data.target = v); },
        });
        $element.append($href, $title, $target);
        return {
            $element: $element,
            data: data,
        };
    };

    var promptLinkParamsAsync = function (modal, initialData) {
        return new Promise(function (resolve) {
            var _a = linkEditor(initialData), $editor = _a.$element, updatedData = _a.data;
            modal($editor, function () {
                resolve(updatedData);
            }, function () {
                resolve(null);
            });
        });
    };
    var renderButtonElement = function (modal, helpers, _a) {
        var icon = _a.icon, command = _a.command, range = _a.range;
        var $btn = helpers.div(['bre-block-editor-button', 'bre-icon', 'bre-icon-light'], icon);
        $btn.onclick = function () { return __awaiter(void 0, void 0, void 0, function () {
            var selection, selectionRange;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selection = window.getSelection();
                        selectionRange = selection !== null && selection.rangeCount > 0
                            ? selection.getRangeAt(0)
                            : null;
                        console.log({ selection: selection });
                        if (range && !selectionRange) {
                            return [2];
                        }
                        if (!(command === 'CreateLink' && selection !== null)) return [3, 2];
                        return [4, createLinkCmd(selection, modal)];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        document.execCommand(command);
                        _a.label = 3;
                    case 3: return [2];
                }
            });
        }); };
        return $btn;
    };
    var getSeletedLink = function (selection) {
        if (selection.anchorNode !== null &&
            selection.anchorNode.parentNode !== null &&
            selection.anchorNode.parentNode.nodeName.toLowerCase() === 'a') {
            return selection.anchorNode.parentNode;
        }
        return null;
    };
    var renderControl = function (modal, helpers, buttons) {
        var $root = helpers.div('bre-block-editor');
        buttons
            .map(function (btn) { return renderButtonElement(modal, helpers, btn); })
            .forEach(function ($btn) { return $root.appendChild($btn); });
        helpers.toggleVisibility($root, false);
        return $root;
    };
    var initHtmlTools = function (modal, helpers, buttons) {
        if (buttons === undefined || buttons.length === 0) {
            return null;
        }
        var $control = renderControl(modal, helpers, buttons);
        document.body.appendChild($control);
        return $control;
    };
    var toggleHtmlTools = function ($control, rect, helpers) {
        if (rect !== null && rect.width > 1) {
            var top = rect.top + rect.height;
            var left = rect.left;
            $control.style.top = top + "px";
            $control.style.left = left + "px";
            helpers.toggleVisibility($control, true);
        }
        else {
            helpers.toggleVisibility($control, false);
        }
    };
    var bindTextSelection = function ($el, handler) {
        if (!$el.contentEditable) {
            return;
        }
        $el.addEventListener('mouseup', function () {
            setTimeout(function () {
                var rect = getSelectionRect();
                handler(rect);
            }, 0);
        });
        $el.addEventListener('keyup', function () {
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
    function createLinkCmd(selection, modal) {
        return __awaiter(this, void 0, void 0, function () {
            var selectedLink, currentLink, updatedLink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectedLink = getSeletedLink(selection);
                        currentLink = selectedLink !== null
                            ? {
                                href: selectedLink.href,
                                title: selectedLink.title,
                                target: selectedLink.target,
                            }
                            : {};
                        return [4, promptLinkParamsAsync(modal, currentLink)];
                    case 1:
                        updatedLink = _a.sent();
                        if (updatedLink !== null && updatedLink.href) {
                            document.execCommand('CreateLink', false, updatedLink.href);
                            if (selection.anchorNode !== null &&
                                selection.anchorNode.parentElement !== null) {
                                if (updatedLink.target) {
                                    selection.anchorNode.parentElement.setAttribute('target', updatedLink.target);
                                }
                                if (updatedLink.title) {
                                    selection.anchorNode.parentElement.setAttribute('title', updatedLink.title);
                                }
                            }
                        }
                        return [2];
                }
            });
        });
    }

    var iconBold = "\n<svg viewBox=\"0 0 24 24\">\n  <path d=\"M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6zM6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z\"/>\n</svg>";

    var iconItalic = "\n<svg viewBox=\"0 0 24 24\">\n  <path d=\"M19 4h-9M14 20H5M15 4L9 20\"/>\n</svg>";

    var iconLink = "\n<svg viewBox=\"0 0 24 24\">\n  <path d=\"M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71\"/>\n  <path d=\"M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71\"/>\n</svg>";

    var iconList = "\n<svg viewBox=\"0 0 24 24\">\n  <path d=\"M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01\"/>\n</svg>";

    var iconUndo = "\n<svg viewBox=\"0 0 24 24\">\n  <path d=\"M19 12H5M12 19l-7-7 7-7\"/>\n</svg>";

    var iconRepeat = "\n<svg viewBox=\"0 0 24 24\">\n  <path d=\"M5 12h14M12 5l7 7-7 7\"/>\n</svg>";

    var defaultOptions = {
        buttons: [
            { icon: iconBold, command: 'Bold', range: true },
            { icon: iconItalic, command: 'Italic', range: true },
            { icon: iconLink, command: 'CreateLink', range: true },
            {
                icon: iconList,
                command: 'insertUnorderedList',
                range: true,
            },
            {
                icon: iconList,
                command: 'insertOrderedList',
                range: true,
            },
            { icon: iconUndo, command: 'Undo', range: false },
            { icon: iconRepeat, command: 'Redo', range: false },
        ],
    };
    var plugin = {
        init: function (editor, options) {
            var $control = initHtmlTools(editor.shared.modal, editor.shared.helpers, defaultOptions.buttons);
            if ($control === null) {
                return;
            }
            var onSelect = function (rect) {
                toggleHtmlTools($control, rect, editor.shared.helpers);
            };
            editor.on('fieldCreate', function (_a) {
                var field = _a.sender;
                if (field.data.type === 'html') {
                    bindTextSelection(field.$element, onSelect);
                }
            });
        },
    };

    exports.plugin = plugin;

    return exports;

}({}));
