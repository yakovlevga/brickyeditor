/// <reference path="Types/jquery.d.ts" />
/// <reference path="Types/common.d.ts" />
interface String {
    breTotalTrim(): string;
    breEqualsInvariant(other: String): boolean;
    breStartsWith(part: String): boolean;
    breContains(part: String): boolean;
}
interface Array<T> {
    find(predicate: (search: T) => boolean): T;
}
declare class Action {
    type: string;
    payload: any;
    constructor(type: string, payload: any);
}
interface HtmlToolsButton {
    icon: string;
    command: string;
    range: boolean;
    aValueArgument: string;
}
declare namespace BrickyEditor {
    class Common {
        static getSelectedText(): string;
        static propsEach(obj: any, func: (key: string, value) => any): void;
        static propsFilterKeys(obj: any, filter: (key: string, value) => Boolean, payload?: any): any[];
    }
}
declare namespace BrickyEditor {
    class Editor {
        $editor: JQuery;
        static UI: UI;
        options: EditorOptions;
        blocks: Array<Block>;
        selectedBlock: Block;
        readonly selectedBlockIndex: number;
        private compactTools?;
        constructor($editor: JQuery, options: EditorOptions);
        initAsync(): Promise<void>;
        private tryLoadInitialBlocksAsync();
        tryBindFormSubmit(): void;
        getData(): any;
        getHtml(): string;
        loadBlocks(blocks: Array<any>): void;
        addBlock(template: Template, data?: Array<Fields.BaseField>, idx?: number, select?: boolean): void;
        private dispatchBlockAction(action);
        private insertBlock(block, idx?);
        private deleteBlock(block);
        private moveBlock(block, offset);
        private copyBlock(block);
        private selectBlock(block);
        private deselectBlock(block);
    }
}
declare namespace BrickyEditor {
    class EditorOptions {
        templatesUrl: string;
        onload: any;
        blocksUrl: string;
        blocks: Array<Block>;
        compactTools?: Boolean;
        compactToolsWidth: number;
        ignoreHtml?: Boolean;
        htmlToolsButtons?: Array<HtmlToolsButton>;
        formSelector: string;
        inputSelector: string;
        constructor(options: EditorOptions);
    }
}
declare namespace BrickyEditor {
    class Template {
        name: string;
        category: string[];
        $html: JQuery;
        $preview: JQuery;
        constructor(el: Element);
        getPreview(): JQuery;
    }
}
declare namespace BrickyEditor {
    class Block {
        template: Template;
        dispatcher: (action: Action) => void;
        preview: boolean;
        fields: Array<Fields.BaseField>;
        ui: BlockUI;
        constructor(template: Template, dispatcher: (action: Action) => void, preview: boolean, data?: Array<Fields.BaseField>);
        delete(): void;
        move(offset: number): void;
        copy(): void;
        select(): void;
        deselect(): void;
        scrollTo(): void;
        getData(ignoreHtml?: Boolean): any;
        getHtml(trim: Boolean, skipAttrRemoving?: Boolean): string;
    }
}
declare namespace BrickyEditor {
    class BlockAction {
        icon: string;
        action: (block) => any;
        title: string;
        constructor(icon?: string, action?: (block) => any, title?: string);
    }
}
declare namespace BrickyEditor {
    class BlockActions {
        static DELETE: string;
        static COPY: string;
        static MOVE: string;
        static SELECT: string;
        static DESELECT: string;
        static INSERT: string;
        static delete: (block: Block) => Action;
        static copy: (block: Block) => Action;
        static select: (block: Block) => Action;
        static deselect: (block: Block) => Action;
        static move: (block: Block, offset: number) => Action;
        static insert: (block: Block, idx: number) => Action;
    }
}
declare namespace BrickyEditor {
    class BlockUI {
        private block;
        $block: JQuery;
        preview: boolean;
        $tools: JQuery;
        $editor: JQuery;
        private static actions;
        constructor(block: Block, $block: JQuery, preview: boolean, data?: Array<Fields.BaseField>);
        delete(): void;
        private buildEditorUI();
        private buildButton(action);
        private bindFields(data?);
    }
}
declare namespace BrickyEditor {
    namespace Fields {
        abstract class BaseField {
            private static _fields;
            static readonly type: string;
            name: string;
            data: any;
            protected block: Block;
            protected $field: JQuery;
            protected settings: (field: BaseField) => void;
            protected getSettingsEl(): JQuery;
            constructor(block: Block, $field: JQuery, data: any);
            static registerCommonFields(): void;
            private static registerField();
            static createField(block: any, $el: JQuery, data: any): BaseField;
            protected bind(): void;
            protected selectBlock(): void;
        }
    }
}
declare namespace BrickyEditor {
    namespace Fields {
        class EmbedField extends BaseField {
            getSettingsEl(): JQuery;
            readonly settings: (field: BaseField) => void;
            bind(): void;
            loadMedia(): Promise<void>;
        }
    }
}
declare namespace BrickyEditor {
    namespace Fields {
        class HtmlField extends BaseField {
            bind(): void;
            setHtml(html: string): void;
        }
    }
}
declare namespace BrickyEditor {
    namespace Fields {
        class ImageField extends BaseField {
            bind(): void;
            private getPromptParams();
            setSrc(src: any): void;
            setAlt(alt: any): void;
            setFile(file: any): void;
            _isImg: Boolean;
            private readonly isImg;
        }
    }
}
declare namespace BrickyEditor {
    namespace Prompt {
        class PromptParameter {
            key: string;
            title: string;
            placeholder: string;
            value: any;
            protected _$control: JQuery;
            protected $input: JQuery;
            constructor(key: string, title: string, value: any, placeholder?: string);
            parseValue(): void;
            $control: JQuery;
            protected getEditor(): JQuery;
        }
    }
}
declare namespace BrickyEditor {
    namespace Prompt {
        class PromptParameterImage extends PromptParameter {
            options: Array<PromptParameterOption>;
            private _value;
            constructor(key: string, title: string, value?: PromptParameterImageResult, placeholder?: string);
            parseValue(): void;
            protected getEditor(): JQuery;
        }
    }
}
declare namespace BrickyEditor {
    namespace Prompt {
        class PromptParameterImageResult {
            fileContent: string;
            fileInfo: PromptParameterImageResultFile;
        }
        class PromptParameterImageResultFile {
            lastModified: number;
            lastModifiedDate: any;
            name: string;
            size: number;
            type: string;
            constructor(file: File);
        }
    }
}
declare namespace BrickyEditor {
    namespace Prompt {
        class PromptParameterList {
            params: Array<PromptParameter>;
            constructor(params: Array<PromptParameter>);
            getValue(key: string): any;
        }
    }
}
declare namespace BrickyEditor {
    namespace Prompt {
        class PromptParameterOption {
            title: string;
            value: any;
            selected: Boolean;
            constructor(title: string, value: any, selected?: Boolean);
        }
    }
}
declare namespace BrickyEditor {
    namespace Prompt {
        class PromptParameterOptions extends PromptParameter {
            options: Array<PromptParameterOption>;
            constructor(key: string, title: string, options: Array<Array<any>>, value?: any, placeholder?: string);
            protected getEditor(): JQuery;
        }
    }
}
declare namespace BrickyEditor {
    namespace Services {
        class EmbedService {
            static Instagram: string;
            constructor();
            static getEmbedAsync(embedUrl: string): Promise<any>;
            static processEmbed(provider: string): void;
        }
    }
}
declare namespace BrickyEditor {
    namespace Services {
        class TemplateService {
            static templates: Template[];
            static loadTemplatesAsync(editor: Editor): Promise<Template[]>;
            static getTemplate(templateName: string): Template;
        }
    }
}
declare namespace BrickyEditor {
    class HtmlTools {
        private editor;
        private $control;
        constructor(editor: Editor);
        private buttons;
        private setControl();
        private getButtonElement(icon, command, rangeCommand?, aValueArgument?);
        show(rect: ClientRect): void;
        private getLinkPromptParams(selection);
    }
}
declare namespace BrickyEditor {
    class Modal {
        private $control;
        private $closeBtn;
        private $form;
        private $btns;
        private $okBtn;
        private $cancelBtn;
        closeFunction: any;
        private selectionRanges;
        constructor($control: JQuery, $closeBtn: JQuery, $form: JQuery, $btns: JQuery, $okBtn: JQuery, $cancelBtn: JQuery);
        hideModal(): void;
        showModal($html?: JQuery, showBtns?: boolean): void;
        promptAsync(fields: Array<Prompt.PromptParameter>): Promise<Prompt.PromptParameterList>;
        saveSelection(): void;
        restoreSelection(): void;
    }
}
declare namespace BrickyEditor {
    class SelectionHelper {
        static getSelectedText(): string;
        static replaceSelectedText(replacement: any): void;
    }
}
declare namespace BrickyEditor {
    class SelectionUtils {
        static bindTextSelection($el: JQuery, handler: (rect: ClientRect) => any): void;
        private static getSelectionRect();
    }
}
declare namespace BrickyEditor {
    class Selectors {
        static field: string;
        static selectorField: string;
        static classMobile: string;
        static htmlToolsCommand: string;
        static htmlToolsCommandRange: string;
        static selectorHtmlToolsCommand: string;
        static selectorHtmlToolsCommandRange: string;
        private static attr(attr);
    }
}
declare namespace BrickyEditor {
    class UI {
        editor: Editor;
        private $tools;
        private $toolsBtn;
        private $toolsTemplates;
        private $toolsHideBtn;
        private $toolsLoader;
        modal: Modal;
        htmlTools: HtmlTools;
        private readonly isCompactTools;
        constructor(editor: Editor);
        private setTools();
        private toggleTools();
        private setModal();
        toggleToolsLoader(toggle: any): void;
        setTemplates(templates: Template[]): void;
        static initBtnDeck($btnsDeck: JQuery): void;
        static toggleBtnDeck($btnsDeck: JQuery, isOn?: Boolean): void;
    }
}
