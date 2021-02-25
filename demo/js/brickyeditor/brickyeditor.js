var BrickyEditor = (function (exports) {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
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

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
            if (tag === 'textarea') {
                var type = props.type, restProps = __rest(props, ["type"]);
                Object.assign(result, restProps);
            }
            else {
                Object.assign(result, props);
            }
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
    var strEqualsInvariant = function (s1, s2) {
        if (!s1 || !s2) {
            return s1 === s2;
        }
        return s1.toLowerCase() === s2.toLowerCase();
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
    var reInjectScript = function ($script) {
        if ($script.parentNode !== null) {
            $script.parentNode.removeChild($script);
        }
        var $reAppended = document.createElement('script');
        $reAppended.type = $script.type;
        $reAppended.async = true;
        $reAppended.src = $script.src;
        document.head.appendChild($reAppended);
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
        reInjectScript: reInjectScript,
    };

    var iconDelete = "\n<svg viewBox=\"0 0 24 24\">\n  <path d=\"M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6\"/>\n</svg>";

    var iconCopy = "\n<svg viewBox=\"0 0 24 24\">\n  <rect width=\"13\" height=\"13\" x=\"9\" y=\"9\" rx=\"2\" ry=\"2\"/>\n  <path d=\"M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1\"/>\n</svg>";

    var iconUp = "\n<svg viewBox=\"0 0 24 24\">\n  <path d=\"M18 15l-6-6-6 6\"/>\n</svg>";

    var iconDown = "\n<svg viewBox=\"0 0 24 24\">\n  <path d=\"M6 9l6 6 6-6\"/>\n</svg>";

    var defaultButtons = [
        {
            name: 'delete',
            icon: iconDelete,
            onClickHandler: function (block) { return deleteBlock(block); },
        },
        {
            name: 'clone',
            icon: iconCopy,
            onClickHandler: function (block) { return copyBlock(block); },
        },
        {
            name: 'up',
            icon: iconUp,
            onClickHandler: function (block) { return moveBlock(block, -1); },
            getIsDisabledForBlock: function (block) {
                return block.parentContainer.blocks.indexOf(block) === 0;
            },
        },
        {
            name: 'down',
            icon: iconDown,
            onClickHandler: function (block) { return moveBlock(block, 1); },
            getIsDisabledForBlock: function (block) {
                return block.parentContainer.blocks.indexOf(block) ===
                    block.parentContainer.blocks.length - 1;
            },
        },
    ];
    var createEditor = function () {
        var $element = helpers.div('bre-block-editor');
        var buttons = defaultButtons.map(function (button) {
            var $btn = helpers.div(['bre-block-editor-button', 'bre-icon', 'bre-icon-light'], button.icon);
            $btn.title = name;
            $element.append($btn);
            return {
                $element: $btn,
                button: button,
            };
        });
        return {
            $element: $element,
            buttons: buttons,
        };
    };
    var getBlockEditor = function (block) {
        if (block.editor === undefined) {
            block.editor = createEditor();
            block.editor.buttons.forEach(function (_a) {
                var $btn = _a.$element, button = _a.button;
                $btn.onclick = function (ev) {
                    ev.stopPropagation();
                    if (button.getIsDisabledForBlock !== undefined &&
                        button.getIsDisabledForBlock(block)) {
                        return;
                    }
                    button.onClickHandler(block);
                    updateEditorButtonsState(block);
                };
            });
            block.$element.prepend(block.editor.$element);
        }
        updateEditorButtonsState(block);
        return block.editor;
    };
    var updateEditorButtonsState = function (block) {
        if (block.editor === undefined) {
            return;
        }
        block.editor.buttons
            .filter(function (_a) {
            var button = _a.button;
            return Boolean(button.getIsDisabledForBlock);
        })
            .forEach(function (_a) {
            var $btn = _a.$element, button = _a.button;
            var isDisabled = button.getIsDisabledForBlock(block);
            helpers.toggleClassName($btn, 'bre-block-editor-button-disabled', isDisabled);
        });
    };
    var showBlockEditor = function (block, active) {
        var editor = getBlockEditor(block);
        helpers.toggleVisibility(editor.$element, true);
        helpers.toggleClassName(editor.$element, 'bre-block-editor-vertical', !active);
        return editor;
    };
    var hideBlockEditor = function (block) {
        var editor = block.editor;
        if (editor !== undefined) {
            helpers.toggleVisibility(editor.$element, false);
            helpers.toggleClassName(editor.$element, 'bre-block-editor-vertical', false);
        }
    };

    var toggleBlockSelection = function (block, selected, active) {
        if (active === void 0) { active = false; }
        block.selected = selected;
        helpers.toggleClassName(block.$element, 'bre-block-selected', selected);
        if (selected) {
            showBlockEditor(block, active);
        }
        else {
            hideBlockEditor(block);
        }
    };

    var toggleFieldSelection = function (field, selected) {
        helpers.toggleClassName(field.$element, 'bre-field-selected', selected);
        if (selected) {
            field.parentBlock.parentContainer.editor.fire('fieldSelect', {
                sender: field,
            });
        }
        else {
            field.parentBlock.parentContainer.editor.fire('fieldBlur', {
                sender: field,
            });
        }
    };

    var isContainerField = function (field) {
        return field.data.type === 'container';
    };

    var getInitialState = function () { return ({
        selectedField: null,
        selectedBlocks: [],
        selectedContainers: [],
    }); };
    var selectField = function (selectedField) {
        var state = selectedField.parentBlock.parentContainer.editor.state;
        if (state.selectedField === selectedField) {
            return;
        }
        var prevSelectedField = state.selectedField;
        if (prevSelectedField !== null) {
            toggleFieldSelection(prevSelectedField, false);
        }
        if (isContainerField(selectedField)) {
            selectBlock(selectedField.parentBlock, false);
            selectContainer(selectedField.container);
        }
        else {
            selectBlock(selectedField.parentBlock);
        }
        state.selectedField = selectedField;
        toggleFieldSelection(selectedField, true);
    };
    var selectBlock = function (selectedBlock, triggerSelectContainer) {
        if (triggerSelectContainer === void 0) { triggerSelectContainer = true; }
        var state = selectedBlock.parentContainer.editor.state;
        if (state.selectedBlocks[0] === selectedBlock) {
            return;
        }
        state.selectedField = null;
        var prevSelectedBlocks = state.selectedBlocks;
        var selectedBlocks = getParentBlocks(selectedBlock);
        state.selectedBlocks = selectedBlocks;
        if (prevSelectedBlocks.length > 0) {
            prevSelectedBlocks.forEach(function (block) {
                toggleBlockSelection(block, false);
            });
        }
        selectedBlocks.forEach(function (block, idx) {
            if (!block.selected) {
                toggleBlockSelection(block, true, idx === 0);
            }
        });
        if (triggerSelectContainer) {
            selectContainer(selectedBlock.parentContainer);
        }
    };
    var getParentBlocks = function (block, blocks) {
        if (blocks === void 0) { blocks = []; }
        blocks.push(block);
        var parentContainerField = block.parentContainer.parentContainerField;
        if (parentContainerField) {
            return getParentBlocks(parentContainerField.parentBlock, blocks);
        }
        return blocks;
    };
    var selectContainer = function (selectedContainer) {
        var state = selectedContainer.editor.state;
        var selectedContainers = getParentContainers(selectedContainer);
        state.selectedContainers = selectedContainers;
    };
    var getParentContainers = function (container) {
        if (container.parentContainerField !== null) {
            var blocks = getParentBlocks(container.parentContainerField.parentBlock);
            return __spreadArrays([container], blocks.map(function (block) { return block.parentContainer; }));
        }
        return [container];
    };
    var resetState = function (state) {
        if (state.selectedField !== null) {
            toggleFieldSelection(state.selectedField, false);
        }
        state.selectedBlocks.forEach(function (block) { return toggleBlockSelection(block, false); });
        state.selectedField = null;
        state.selectedBlocks = [];
        state.selectedContainers = [state.selectedContainers[0]];
    };

    var iconContainer = "\n<svg viewBox=\"0 0 24 24\">\n  <path d=\"M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z\"/>\n</svg>";

    var getRequest = function (url) {
        return new Promise(function (resolve, reject) {
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
    };
    var loadScriptAsync = function (url) {
        return new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            var done = false;
            var scriptDocLoadedHandler = function () {
                var readyState = script.readyState;
                if (done === false &&
                    (readyState === undefined ||
                        readyState === 'loaded' ||
                        readyState === 'complete')) {
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
            script.src = url.indexOf('//') === 0 ? "https:" + url : url;
            document.head.appendChild(script);
        });
    };
    var jsonp = function (url) {
        return new Promise(function (resolve, reject) {
            var id = String(Date.now());
            var callbackName = 'jsonp_callback_' + id;
            window[callbackName] = function (data) {
                delete window[callbackName];
                var element = document.getElementById(id);
                if (element !== null) {
                    element.remove();
                }
                resolve(data);
            };
            var src = url + '&callback=' + callbackName;
            var script = document.createElement('script');
            script.src = src;
            script.id = id;
            script.addEventListener('error', reject);
            (document.getElementsByTagName('head')[0] ||
                document.body ||
                document.documentElement).appendChild(script);
        });
    };

    var fieldFactories = {};
    var getFieldFactory = function (fieldType) {
        return fieldFactories[fieldType];
    };

    var FIELD_DATA_ATTR = "data-bre-field";
    var FIELD_SELECTOR = "[" + FIELD_DATA_ATTR + "]";
    var templateClassName = "bre-template";
    var TEMPLATE_SELECTOR = "." + templateClassName;
    var TEMPLATE_GROUP_SELECTOR = ".bre-template-group";
    var TEMPLATE_PREVIEW_SELECTOR = ".bre-template-preview";

    var findFieldElements = function ($html) {
        var nodes = $html.querySelectorAll(FIELD_SELECTOR);
        var $fields = nodes.length > 0 ? Array.prototype.slice.call(nodes) : [];
        if ($html.attributes.getNamedItem(FIELD_DATA_ATTR) !== null) {
            $fields = __spreadArrays($fields, [$html]);
        }
        return $fields;
    };

    var allTemplates = [];
    var getTemplate = function (templateName) {
        var template = allTemplates.find(function (x) {
            return strEqualsInvariant(x.name, templateName);
        });
        if (template === undefined) {
            throw new Error("Template is not registred: " + templateName);
        }
        return template;
    };
    var loadTemplatesAsync = function (url, $editor) { return __awaiter(void 0, void 0, void 0, function () {
        var grouppedTemplates, data, $data, $style, $groups, ungrouppedTemplates, ungrouppedTemplatesGroupName, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    grouppedTemplates = [];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4, getRequest(url)];
                case 2:
                    data = _b.sent();
                    $data = helpers.createElement("<div>" + data + "</div>");
                    $style = $data.querySelector('style');
                    if ($style !== null && $editor.parentElement !== null) {
                        (_a = $editor.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore($style, $editor);
                    }
                    $groups = $data.querySelectorAll(TEMPLATE_GROUP_SELECTOR);
                    $groups.forEach(function ($group) {
                        var name = $group.getAttribute('title');
                        var templates = parseTemplates($group);
                        grouppedTemplates.push({ name: name, templates: templates });
                        $group.remove();
                        allTemplates = __spreadArrays(allTemplates, templates);
                    });
                    ungrouppedTemplates = parseTemplates($data);
                    ungrouppedTemplatesGroupName = grouppedTemplates.length > 0
                        ? helpers.msg('templates.group.name.default')
                        : '';
                    grouppedTemplates.push({
                        name: ungrouppedTemplatesGroupName,
                        templates: ungrouppedTemplates,
                    });
                    allTemplates = __spreadArrays(allTemplates, ungrouppedTemplates);
                    return [2, grouppedTemplates];
                case 3:
                    err_1 = _b.sent();
                    throw err_1;
                case 4: return [2];
            }
        });
    }); };
    var parseTemplates = function ($el) {
        var $templates = $el.querySelectorAll(TEMPLATE_SELECTOR);
        var templates = helpers
            .convertNodeListToArray($templates)
            .map(createTemplate);
        return helpers.filterNotNull(templates);
    };
    var createTemplate = function ($template) {
        var name = $template.dataset.name || '';
        var $preview = $template.querySelector(TEMPLATE_PREVIEW_SELECTOR);
        if ($preview !== null) {
            $preview.remove();
        }
        else {
            $preview = $template.cloneNode(true);
            setupTemplateFields($preview);
        }
        return {
            name: name,
            $template: $template,
            $preview: $preview,
        };
    };
    var setupTemplateFields = function ($element) {
        var $fields = findFieldElements($element);
        var fields = $fields.map(function ($f) { return bindTemplateField($f); });
        return helpers.filterNotNull(fields);
    };
    function bindTemplateField($element) {
        var initialData = helpers.parseElementData($element, 'breField');
        if (initialData === null) {
            return null;
        }
        var fieldFactory = getFieldFactory(initialData.type);
        return fieldFactory.setupPreview($element, initialData);
    }

    var findFieldElements$1 = function ($html) {
        var nodes = $html.querySelectorAll(FIELD_SELECTOR);
        var $fields = nodes.length > 0 ? Array.prototype.slice.call(nodes) : [];
        if ($html.attributes.getNamedItem(FIELD_DATA_ATTR) !== null) {
            $fields = __spreadArrays($fields, [$html]);
        }
        return $fields;
    };
    var getBlockHtml = function (block, trim) {
        return '';
    };

    var setupBlockFields = function (block) {
        var $fields = findFieldElements$1(block.$element);
        var fields = $fields.map(function ($f) {
            var field = bindBlockField($f, block);
            if (field !== null) {
                field.parentBlock.parentContainer.editor.fire('fieldCreate', {
                    sender: field,
                });
            }
            return field;
        });
        return helpers.filterNotNull(fields);
    };
    function bindBlockField($element, parentBlock) {
        var initialData = helpers.parseElementData($element, 'breField');
        if (initialData === null) {
            return null;
        }
        var blockData = getFieldDataByName(parentBlock, initialData.name);
        var data = blockData !== null ? blockData : initialData;
        var fieldFactory = getFieldFactory(data.type);
        return fieldFactory.makeField($element, initialData, parentBlock);
    }
    function getFieldDataByName(block, name) {
        if (!block.data || !block.data.fields) {
            return null;
        }
        var field = block.data.fields.find(function (f) { return strEqualsInvariant(f.name, name); });
        if (field === undefined) {
            return null;
        }
        return field;
    }

    var createBlockFromTemplate = function (parentContainer, name, $template, data) {
        if (data === void 0) { data = {
            template: name,
            fields: [],
        }; }
        var $element = $template.cloneNode(true);
        helpers.toggleClassName($element, 'bre-template', false);
        helpers.toggleClassName($element, 'bre-template-zoom', false);
        helpers.toggleClassName($element, 'bre-block', true);
        var block = {
            parentContainer: parentContainer,
            $element: $element,
            data: data,
            selected: false,
        };
        $element.addEventListener('click', function () {
            toggleBlockSelection(block, true, true);
        });
        block.fields = setupBlockFields(block);
        return block;
    };

    var defaultContainerPlaceholder = helpers.div([
        'bre-field-placeholder',
        'bre-container-placeholder',
        'bre-icon',
        'bre-icon-32',
    ], iconContainer);
    var getContainerPlaceholder = function (preview) {
        var $placeholder = defaultContainerPlaceholder.cloneNode(true);
        if (preview) {
            helpers.toggleClassName($placeholder, 'bre-container-placeholder', false);
        }
        return $placeholder;
    };
    var toggleContainersPlaceholder = function (container) {
        if (container.$placeholder === null) {
            container.$placeholder = getContainerPlaceholder(false);
        }
        if (container.$element.childElementCount === 0) {
            container.$element.appendChild(container.$placeholder);
        }
        else {
            container.$placeholder.remove();
        }
    };
    var addBlockToContainer = function (container, _a, select) {
        var idx = _a.idx, blockData = _a.blockData, blockTemplate = _a.blockTemplate;
        var blocks = container.blocks, selectedBlock = container.selectedBlock;
        var template = blockData !== undefined ? getTemplate(blockData.template) : blockTemplate;
        if (template === undefined) {
            throw new Error("Template is undefined");
        }
        var name = template.name, $template = template.$template;
        var block = createBlockFromTemplate(container, name, $template);
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
        if (select) {
            selectBlock(block);
        }
        container.editor.fire('blockAdd', { sender: block });
        return block;
    };
    var createRootContainer = function (editor) {
        return createContainer(editor);
    };
    var createFieldContainer = function (field) { return createContainer(field.parentBlock.parentContainer.editor, field); };
    var createContainer = function (editor, parentContainerField) {
        if (parentContainerField === void 0) { parentContainerField = null; }
        var $element = parentContainerField !== null
            ? parentContainerField.$element
            : editor.$element;
        var container = {
            editor: editor,
            $element: $element,
            blocks: [],
            $placeholder: null,
            selectedBlock: null,
            parentContainerField: parentContainerField,
        };
        toggleContainersPlaceholder(container);
        return container;
    };
    var deleteBlock = function (block) {
        var container = block.parentContainer;
        var blockIdx = container.blocks.indexOf(block);
        container.blocks = container.blocks.filter(function (b) { return b !== block; });
        block.$element.remove();
        if (container.blocks.length === 0) {
            toggleContainersPlaceholder(container);
            if (container.parentContainerField !== null) {
                selectField(container.parentContainerField);
            }
            else {
                resetState(container.editor.state);
            }
        }
        else if (container.blocks.length > blockIdx) {
            selectBlock(container.blocks[blockIdx]);
        }
        else {
            selectBlock(container.blocks[blockIdx - 1]);
        }
        block = null;
    };
    var copyBlock = function (block) {
        var container = block.parentContainer;
        var idx = container.blocks.indexOf(block) + 1;
        addBlockToContainer(container, {
            idx: idx,
            blockData: block.data,
        }, true);
    };
    var moveBlock = function (block, offset) {
        var $element = block.$element, parentContainer = block.parentContainer;
        if ($element.parentElement === null) {
            return;
        }
        var idx = parentContainer.blocks.indexOf(block);
        var new_idx = idx + offset;
        if (new_idx >= parentContainer.blocks.length || new_idx < 0) {
            return;
        }
        var $referenceElement = parentContainer.blocks[new_idx].$element;
        if ($referenceElement) {
            if (offset > 0) {
                $element.parentElement.insertBefore($referenceElement, $element);
            }
            else if (offset < 0) {
                $element.parentElement.insertBefore($element, $referenceElement);
            }
        }
        parentContainer.blocks.splice(idx, 1);
        parentContainer.blocks.splice(new_idx, 0, block);
    };

    var defaultOptions = {
        locale: 'en',
        templatesUrl: 'templates/bootstrap4.html',
        compactTools: false,
        compactToolsWidth: 768,
        ignoreHtml: true,
        templateSelector: {
            zoom: true,
        },
    };

    var getTemplateUI = function (template, zoom) {
        var $template = helpers.div('bre-templates-group-item');
        var $preview = template.$preview;
        $preview.setAttribute('title', template.name);
        if (zoom) {
            helpers.toggleClassName($preview, 'bre-template-zoom', true);
        }
        $template.append($preview);
        return $template;
    };
    var getTemplateGroupUI = function (editor, group) {
        var $group = helpers.div('bre-templates-group');
        var $name = helpers.div('bre-templates-group-name', group.name || '');
        $name.onclick = function () {
            for (var i = 1; i < $group.children.length; i++) {
                helpers.toggleVisibility($group.children[i]);
            }
        };
        $group.append($name);
        group.templates.forEach(function (template) {
            var $template = getTemplateUI(template, editor.options.templateSelector.zoom);
            $group.append($template);
            $template.onclick = function (ev) {
                ev.stopPropagation();
                addBlockWithTemplate(editor, template);
            };
        });
        return $group;
    };
    var getTemplateSelector = function (editor) {
        var $element = helpers.div('bre-templates-root');
        var $loader = helpers.div('bre-templates-loader', '...LOADING...');
        var $templates = helpers.div('bre-templates-list');
        $element.append($loader, $templates);
        var setTemplates = function (templatesGroupped) {
            helpers.toggleVisibility($loader, false);
            templatesGroupped.forEach(function (group) {
                if (group.templates.length === 0) {
                    return;
                }
                var $group = getTemplateGroupUI(editor, group);
                $templates.append($group);
            });
        };
        return {
            $element: $element,
            setTemplates: setTemplates,
        };
    };
    var addBlockWithTemplate = function (editor, blockTemplate) {
        var state = editor.state;
        var selectedContainer = state.selectedContainers[0];
        var selectedBlock = state.selectedBlocks.length > 0 ? state.selectedBlocks[0] : null;
        var idx = selectedBlock !== null
            ? selectedContainer.blocks.indexOf(selectedBlock) + 1
            : selectedContainer.blocks.length;
        if (selectedContainer !== null) {
            addBlockToContainer(selectedContainer, {
                blockTemplate: blockTemplate,
                idx: idx,
            }, true);
        }
    };

    var emitter = function () {
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

    var fixBodyClassName = 'bre-modal-fix-body';
    var modal = function ($content, okHandler, cancelHandler) {
        document.body.classList.add(fixBodyClassName);
        var selection = helpers.getSelectionRanges();
        var $modal = helpers.div('bre-modal');
        var onLightboxClick = function () { return close(); };
        var $lightbox = helpers.div('bre-modal-lightbox');
        $lightbox.addEventListener('click', onLightboxClick);
        var onEscEvent = function (ev) {
            if (ev.key === 'Escape' || ev.key === 'Esc' || ev.keyCode === 27) {
                close();
            }
        };
        document.addEventListener('keydown', onEscEvent);
        var close = function () {
            document.body.classList.remove(fixBodyClassName);
            $modal.remove();
            helpers.restoreSelection(selection);
            document.removeEventListener('keydown', onEscEvent);
            $lightbox.removeEventListener('click', onLightboxClick);
        };
        var $ok = helpers.el({
            tag: 'button',
            className: 'bre-btn',
            innerHTML: helpers.msg('button.ok'),
            props: {
                type: 'button',
                onclick: function () {
                    if (okHandler) {
                        okHandler();
                    }
                    close();
                },
            },
        });
        var $cancel = helpers.el({
            tag: 'button',
            className: ['bre-btn', 'bre-btn-clear'],
            innerHTML: helpers.msg('button.cancel'),
            props: {
                type: 'button',
                onclick: function () {
                    if (cancelHandler) {
                        cancelHandler();
                    }
                    close();
                },
            },
        });
        var $btns = helpers.div('bre-btns');
        $btns.append($cancel, $ok);
        var $modalContent = helpers.div('bre-modal-content');
        $modalContent.append($content);
        var $modalRoot = helpers.div('bre-modal-root');
        $modalRoot.append($modalContent, $btns);
        $modal.append($lightbox, $modalRoot);
        document.body.appendChild($modal);
    };

    var defaultLanguage = 'en;';
    var defaultLocale = {
        'embed.link.title': 'Link to embed media',
        'embed.link.placeholder': 'Link to instagram, youtube and etc.',
        'image.link.title': 'Image link',
        'image.link.placeholder': 'http://url-to-image.png',
        'image.upload.title': 'or Upload a file',
        'image.upload.placeholder': 'select file',
        'image.upload.button': 'Select file',
        'image.alt.title': 'Alt',
        'image.alt.placeholder': "Image 'alt' attribute value",
        'image.url.subtitle': 'Link to open on image click',
        'link.url.title': 'Url',
        'link.url.placeholder': 'http://put-your-link.here',
        'link.title.title': 'Title',
        'link.title.placeholder': 'Title attribute for link',
        'link.target.title': 'Target',
        'button.close': 'close',
        'button.ok': 'Ok',
        'button.cancel': 'Cancel',
        'templates.group.name.default': 'Other templates',
        'error.blocksFileNotFound': 'Blocks file not found. Requested file: {url}.',
        'error.templatesFileNotFound': 'Templates file not found. Requested file: {url}.',
        'error.blockTemplateNotFound': "Template '{templateName}' not found.",
        'error.templateParsing': 'Template parsing error: {name}.',
    };

    var i18n = function () {
        window.BrickyEditor = window.BrickyEditor || {};
        window.BrickyEditor.i18n = window.BrickyEditor.i18n || {};
        window.BrickyEditor.i18n.messages = window.BrickyEditor.i18n.messages || {};
        window.BrickyEditor.i18n.default = defaultLanguage;
        window.BrickyEditor.i18n.messages[defaultLanguage] = defaultLocale;
    };
    var setLocale = function (locale) {
        if (locale === void 0) { locale = window.BrickyEditor.i18n.default; }
        if (window.BrickyEditor.i18n.messages[locale] !== undefined) {
            window.BrickyEditor.i18n.locale = locale;
        }
    };

    var updateFieldData = function (field, changes) {
        var data = field.data;
        var props = Object.keys(changes);
        var hasChanges = props.some(function (p) { return data[p] !== changes[p]; });
        if (hasChanges) {
            field.data = __assign(__assign({}, data), changes);
        }
    };
    var getCleanFieldElement = function ($field) {
        var $el = $field.cloneNode(true);
        $el.attributes.removeNamedItem(FIELD_DATA_ATTR);
        return $el;
    };

    var truncateClassName = 'bre-truncate';
    var html = {
        makeField: function ($element, initialData, parentBlock) {
            bind($element, initialData);
            var field = {
                parentBlock: parentBlock,
                $element: $element,
                data: initialData,
            };
            var updateHtmlProp = function () {
                var html = $element.innerHTML.trim();
                updateFieldData(field, { html: html });
            };
            $element.setAttribute('contenteditable', 'true');
            $element.addEventListener('input', updateHtmlProp);
            $element.addEventListener('paste', function (ev) {
                ev.preventDefault();
                if (ev.clipboardData) {
                    var text = ev.clipboardData.getData('text/plain');
                    document.execCommand('insertHTML', false, text);
                    updateHtmlProp();
                }
            });
            $element.addEventListener('click', function (ev) {
                ev.stopPropagation();
                selectField(field);
            });
            return field;
        },
        setupPreview: function ($element) {
            $element.classList.add(truncateClassName);
            return $element;
        },
        getHtml: getHtml,
    };
    function bind($element, _a) {
        var html = _a.html;
        if (html !== undefined) {
            $element.innerHTML = html;
        }
    }
    function getHtml(field) {
        var $copy = getCleanFieldElement(field.$element);
        $copy.removeAttribute('contenteditable');
        return $copy;
    }

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
    var renderInput = function (props, tag) {
        if (tag === void 0) { tag = 'input'; }
        var type = props.type, placeholder = props.placeholder;
        var $root = helpers.div('bre-field-editor-prop');
        var $input = helpers.el({
            tag: tag,
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

    var propmtFieldEditorAsync = function (field, editor) {
        return new Promise(function (resolve) {
            var _a = editor(field), $editor = _a.$element, updatedData = _a.data;
            modal($editor, function () {
                resolve(updatedData);
            }, function () {
                resolve(null);
            });
        });
    };

    var image = {
        makeField: function ($element, initialData, parentBlock) {
            bind$1($element, initialData);
            var field = {
                $element: $element,
                data: initialData,
                parentBlock: parentBlock,
            };
            $element.addEventListener('click', function (ev) { return __awaiter(void 0, void 0, void 0, function () {
                var updatedData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ev.stopPropagation();
                            selectField(field);
                            return [4, propmtFieldEditorAsync(field, editor)];
                        case 1:
                            updatedData = _a.sent();
                            if (updatedData !== null) {
                                bind$1(field.$element, updatedData);
                                updateFieldData(field, updatedData);
                            }
                            return [2];
                    }
                });
            }); });
            return field;
        },
        setupPreview: function ($element, initialData) {
            bind$1($element, initialData);
            return $element;
        },
        getHtml: getHtml$1,
    };
    function bind$1($element, data) {
        var src = getSrcOrFile(data);
        var alt = data.alt || '';
        var isImageElement = $element.tagName.toLowerCase() === 'img';
        if (isImageElement) {
            var image_1 = $element;
            image_1.src = src;
            image_1.alt = alt;
        }
        else {
            $element.style.backgroundImage = "url(" + src + ")";
        }
        $element.title = alt;
    }
    function editor(field) {
        var _this = this;
        var initialData = field.data;
        var data = __assign({}, initialData);
        var $element = helpers.div('bre-field-editor-root');
        var $previewImg = helpers.el({
            tag: 'img',
            className: 'bre-field-editor-preview-img',
            props: {
                src: getSrcOrFile(data),
            },
        });
        var $preview = helpers.div('bre-field-editor-preview');
        $preview.appendChild($previewImg);
        var $src = renderInput({
            title: helpers.msg('image.link.title'),
            placeholder: helpers.msg('image.link.placeholder'),
            value: data.src,
            type: 'text',
            onUpdate: function (src) {
                $previewImg.src = src;
                data.src = src;
                data.file = undefined;
            },
        });
        var $file = renderInput({
            title: helpers.msg('image.upload.title'),
            placeholder: helpers.msg('image.upload.title'),
            type: 'file',
            value: data.file ? data.file.fileContent : '',
            onUpdate: function (f, fileContent) { return __awaiter(_this, void 0, void 0, function () {
                var fileInfo;
                return __generator(this, function (_a) {
                    $previewImg.src = fileContent;
                    fileInfo = {
                        name: f.name,
                        size: f.size,
                        type: f.type,
                        lastModified: f.lastModified,
                    };
                    data.src = undefined;
                    data.file = {
                        fileContent: fileContent,
                        fileInfo: fileInfo,
                    };
                    return [2];
                });
            }); },
        });
        var $alt = renderInput({
            title: helpers.msg('image.alt.title'),
            placeholder: helpers.msg('image.alt.title'),
            value: data.alt,
            type: 'text',
            onUpdate: function (v) { return (data.alt = $previewImg.alt = v); },
        });
        var _a = linkEditor(initialData.link), $link = _a.$element, linkData = _a.data;
        data.link = linkData;
        $element.append($preview, $src, $file, $alt, $link);
        return {
            $element: $element,
            data: data,
        };
    }
    function getHtml$1(field) {
        var $element = field.$element, data = field.data;
        var link = data.link;
        var $result = getCleanFieldElement($element);
        if (link !== undefined && link.href !== undefined && link.href.length) {
            var $link = helpers.el({
                tag: 'a',
                props: link,
            });
            $link.appendChild($result);
            return $link;
        }
        return $result;
    }
    function getSrcOrFile(data) {
        return data.src || (data.file !== undefined ? data.file.fileContent : '');
    }

    var preProcessEmbedUrl = function (url) {
        return url.replace('https://www.instagram.com', 'http://instagr.am');
    };
    var postProcessEmbed = function (provider) {
        switch (provider) {
            case 'Instagram':
                var instgrm = window.instgrm;
                if (instgrm !== undefined) {
                    instgrm.Embeds.process();
                }
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

    var iconEmbed = "\n<svg viewBox=\"0 0 24 24\">\n  <rect width=\"20\" height=\"20\" x=\"2\" y=\"2\" rx=\"2.18\" ry=\"2.18\"/>\n  <path d=\"M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5\"/>\n</svg>";

    var providerScriptsLoaded = {};
    var getEmbedPlaceholder = function () {
        return helpers.div(['bre-field-placeholder', 'bre-icon', 'bre-icon-32'], iconEmbed + "<span>embed</span>");
    };
    var embed = {
        makeField: function ($element, data, parentBlock) {
            bind$2($element, data);
            var field = {
                $element: $element,
                data: data,
                parentBlock: parentBlock,
            };
            $element.addEventListener('click', function (ev) { return __awaiter(void 0, void 0, void 0, function () {
                var updatedData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ev.stopPropagation();
                            selectField(field);
                            return [4, propmtFieldEditorAsync(field, editor$1)];
                        case 1:
                            updatedData = _a.sent();
                            if (updatedData !== null) {
                                bind$2(field.$element, updatedData);
                                updateFieldData(field, updatedData);
                            }
                            return [2];
                    }
                });
            }); });
            return field;
        },
        setupPreview: function ($element) {
            $element.appendChild(getEmbedPlaceholder());
            return $element;
        },
        getHtml: getHtml$2,
    };
    function getHtml$2(field) {
        return getCleanFieldElement(field.$element);
    }
    function editor$1(field) {
        var data = __assign({}, field.data);
        var $element = helpers.div('bre-field-editor-root');
        var $preview = helpers.div('bre-field-editor-preview');
        bind$2($preview, data);
        var $url = renderInput({
            title: helpers.msg('embed.link.title'),
            placeholder: helpers.msg('embed.link.placeholder'),
            value: data.url || '',
            type: 'text',
            onUpdate: function (v) {
                if (data.url != v) {
                    data.url = v;
                    bind$2($preview, data);
                }
            },
        });
        $element.append($preview, $url);
        return {
            $element: $element,
            data: data,
        };
    }
    function bind$2($element, _a) {
        var url = _a.url;
        return __awaiter(this, void 0, void 0, function () {
            var embed, $embed, $script;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (url === undefined) {
                            $element.appendChild(getEmbedPlaceholder());
                            return [2];
                        }
                        return [4, getEmbedAsync(preProcessEmbedUrl(url))];
                    case 1:
                        embed = _b.sent();
                        $embed = helpers.div(undefined, embed.html);
                        $script = $embed.querySelector('script');
                        if ($script !== null) {
                            $script.remove();
                        }
                        $element.innerHTML = $embed.innerHTML;
                        if (!($script !== null)) return [3, 4];
                        if (!(providerScriptsLoaded[$script.src] === undefined)) return [3, 3];
                        return [4, loadScriptAsync($script.src)];
                    case 2:
                        _b.sent();
                        providerScriptsLoaded[embed.provider_name] = true;
                        _b.label = 3;
                    case 3:
                        setTimeout(function () { return postProcessEmbed(embed.provider_name); }, 100);
                        _b.label = 4;
                    case 4: return [2];
                }
            });
        });
    }

    var getContainerHtml = function (container) {
        var html = container.blocks
            .map(function (block) { return getBlockHtml(); })
            .join('\n');
        var root = container.$element.cloneNode(false);
        root.innerHTML = html;
        return root.outerHTML;
    };

    var container = {
        makeField: function ($element, initialData, parentBlock) {
            $element.addEventListener('click', function (ev) {
                ev.stopPropagation();
                selectField(field);
            });
            var field = {
                $element: $element,
                data: initialData,
                parentBlock: parentBlock,
            };
            var fieldContainer = createFieldContainer(field);
            field.container = fieldContainer;
            if (initialData.blocks && initialData.blocks.length > 0) {
                initialData.blocks.map(function (blockData) {
                    return addBlockToContainer(fieldContainer, {
                        blockData: blockData,
                    }, false);
                });
            }
            return field;
        },
        setupPreview: function ($element) {
            $element.append(getContainerPlaceholder(true));
            return $element;
        },
        getHtml: getHtml$3,
    };
    function getHtml$3(field) {
        var container = field.container;
        var html = getContainerHtml(container);
        return helpers.createElement(html);
    }

    var getHtmlCodePlaceholder = function () {
        return helpers.div(['bre-field-placeholder', 'bre-icon', 'bre-icon-32'], iconEmbed + "<span>html code</span>");
    };
    var htmlCode = {
        makeField: function ($element, data, parentBlock) {
            bind$3($element, data);
            var field = {
                $element: $element,
                data: data,
                parentBlock: parentBlock,
            };
            $element.addEventListener('click', function (ev) { return __awaiter(void 0, void 0, void 0, function () {
                var updatedData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ev.stopPropagation();
                            selectField(field);
                            return [4, propmtFieldEditorAsync(field, editor$2)];
                        case 1:
                            updatedData = _a.sent();
                            if (updatedData !== null) {
                                bind$3(field.$element, updatedData);
                                updateFieldData(field, updatedData);
                            }
                            return [2];
                    }
                });
            }); });
            return field;
        },
        setupPreview: function ($element) {
            $element.appendChild(getHtmlCodePlaceholder());
            return $element;
        },
        getHtml: getHtml$4,
    };
    function getHtml$4(field) {
        return getCleanFieldElement(field.$element);
    }
    function editor$2(field) {
        var data = __assign({}, field.data);
        var $element = helpers.div('bre-field-editor-root');
        var $preview = helpers.div('bre-field-editor-preview');
        bind$3($preview, data);
        var $url = renderInput({
            title: helpers.msg('embed.link.title'),
            placeholder: helpers.msg('embed.link.placeholder'),
            value: data.code || '',
            type: 'text',
            onUpdate: function (v) {
                if (data.code != v) {
                    data.code = v;
                    bind$3($preview, data);
                }
            },
        }, 'textarea');
        $element.append($preview, $url);
        return {
            $element: $element,
            data: data,
        };
    }
    function bind$3($element, _a) {
        var code = _a.code;
        return __awaiter(this, void 0, void 0, function () {
            var $node, $scripts;
            return __generator(this, function (_b) {
                if (code === undefined) {
                    $element.appendChild(getHtmlCodePlaceholder());
                    return [2];
                }
                $node = helpers.div(undefined, code);
                $scripts = $node.querySelectorAll('script');
                $scripts.forEach(function ($s) { return $s.remove(); });
                $element.innerHTML = $node.innerHTML;
                setTimeout(function () {
                    $scripts.forEach(function ($s) { return reInjectScript($s); });
                    if (code.indexOf('instagram') !== -1) {
                        postProcessEmbed('Instagram');
                    }
                }, 100);
                return [2];
            });
        });
    }

    var initBaseFields = function () {
        fieldFactories.html = html;
        fieldFactories.image = image;
        fieldFactories.embed = embed;
        fieldFactories.htmlCode = htmlCode;
        fieldFactories.container = container;
    };

    var Editor = (function () {
        function Editor($editor, options) {
            editor$3($editor, options);
        }
        return Editor;
    }());
    var editor$3 = function ($element, options) {
        return new Promise(function (resolve) { return __awaiter(void 0, void 0, void 0, function () {
            var optionsWithDefaults, eventEmitter, state, editor, rootContainer, templates, templatesUI, blocks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i18n();
                        initBaseFields();
                        optionsWithDefaults = __assign(__assign({}, defaultOptions), options);
                        setLocale(optionsWithDefaults.locale);
                        eventEmitter = emitter();
                        state = getInitialState();
                        editor = __assign(__assign({}, eventEmitter), { $element: $element, data: function () { return getBlocksData(); }, html: function () { return getBlocksHtml(); }, state: state, options: optionsWithDefaults, shared: {
                                modal: modal,
                                helpers: helpers,
                            } });
                        rootContainer = createRootContainer(editor);
                        editor.state.selectedContainers = [rootContainer];
                        if (optionsWithDefaults.plugins) {
                            optionsWithDefaults.plugins.map(function (_a) {
                                var plugin = _a.plugin;
                                return plugin.init(editor);
                            });
                        }
                        helpers.toggleClassName($element, 'bre-editor', true);
                        return [4, loadTemplatesAsync(optionsWithDefaults.templatesUrl, editor.$element)];
                    case 1:
                        templates = _a.sent();
                        templatesUI = getTemplateSelector(editor);
                        if (templates !== undefined) {
                            templatesUI.setTemplates(templates);
                            $element.append(templatesUI.$element);
                        }
                        return [4, loadInitialBlocks(optionsWithDefaults)];
                    case 2:
                        blocks = _a.sent();
                        if (blocks !== null) {
                            blocks.map(function (blockData) {
                                return addBlockToContainer(rootContainer, {
                                    blockData: blockData,
                                }, false);
                            });
                        }
                        resolve(editor);
                        return [2];
                }
            });
        }); });
    };
    var getBlocksData = function (state) {
        throw Error('not implemented');
    };
    var getBlocksHtml = function (state) {
        throw Error('not implemented');
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
                        return [4, getRequest(url)];
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

    exports.Editor = Editor;
    exports.editor = editor$3;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));
