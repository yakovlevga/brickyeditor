declare module "tsc/common/DOMHelpers" {
    export class $dom {
        static el(html: string): HTMLElement;
        static ons(el: HTMLElement, events: string, listener: (this: HTMLElement, ev: any) => any): void;
        static on(el: HTMLElement, event: string, listener: (this: HTMLElement, ev: any) => any): any;
        static offset(el: HTMLElement): {
            top: number;
            left: number;
        };
        static wrap(el: HTMLElement, toEl: HTMLElement): void;
        static unwrap(el: HTMLElement): void;
        static hide(el: HTMLElement): void;
        static show(el: HTMLElement): void;
        static isHidden(el: HTMLElement): boolean;
        static toggle(el: HTMLElement, force?: boolean): void;
        static before(el: HTMLElement, elToInsert: HTMLElement | HTMLElement[]): void;
        static after(el: HTMLElement, elToInsert: HTMLElement): void;
        static hasClass(el: HTMLElement, className: string): boolean;
        static addClass(el: HTMLElement, className: string): void;
        static removeClass(el: HTMLElement, className: string): void;
        static toggleClass(el: HTMLElement, className: string, force?: boolean): void;
        static windowScrollTop(): number;
        static replaceWith(from: HTMLElement, to: HTMLElement): void;
        static select(el: HTMLElement, selector: string, addBack?: boolean): HTMLElement[];
        static find(selector: string): HTMLElement;
        static first(el: HTMLElement, selector: string): HTMLElement;
        static clone(el: Element): HTMLElement;
        static trigger(el: Element, ev: string, data: any): void;
        static matches(el: Element, selector: string): any;
        static data<T>(el: HTMLElement, prop: string): T;
    }
}
declare module "tsc/ui/Selectors" {
    export class Selectors {
        static attrContentEditable: string;
        static selectorContentEditable: string;
        static attrField: string;
        static selectorField: string;
        static classEditor: string;
        static classTemplate: string;
        static selectorTemplate: string;
        static classTemplateGroup: string;
        static selectorTemplateGroup: string;
        static selectorTemplatePreview: string;
        static classMobile: string;
        static htmlToolsCommand: string;
        static htmlToolsCommandRange: string;
        static selectorFieldSelected: string;
        static selectorFieldContainer: string;
        static selectorHtmlToolsCommand: string;
        static selectorHtmlToolsCommandRange: string;
        private static attr;
    }
}
declare module "tsc/block/BlockUIAction" {
    export class BlockUIAction {
        icon: string;
        action?: () => void;
        title?: string;
        constructor(icon: string, action?: () => void, title?: string);
    }
}
declare module "tsc/templates/TemplateGroup" {
    import { Template } from "tsc/Templates/Template";
    export class TemplateGroup {
        name: string;
        templates: Template[];
        constructor(name: string, templates: Template[]);
    }
}
declare module "tsc/EditorStrings" {
    export class EditorStrings {
        static errorBlocksFileNotFound: (url: string) => string;
        static errorTemplatesFileNotFound: (url: string) => string;
        static errorBlockTemplateNotFound: (templateName: string) => string;
        static errorTemplateParsing: (name: string) => string;
        static embedFieldLinkTitle: string;
        static embedFieldLinkPlaceholder: string;
        static imageFieldLinkTitle: string;
        static imageFieldLinkPlaceholder: string;
        static imageFieldUploadTitle: string;
        static imageFieldUploadButton: string;
        static imageFieldAltTitle: string;
        static imageFieldAltPlaceholder: string;
        static imageFieldUrlSubtitle: string;
        static htmlEditorLinkUrlTitle: string;
        static htmlEditorLinkUrlPlaceholder: string;
        static htmlEditorLinkTitleTitle: string;
        static htmlEditorLinkTitlePlaceholder: string;
        static htmlEditorLinkTargetTitle: string;
        static htmlEditorLinkTargetBlank: string;
        static htmlEditorLinkTargetSelf: string;
        static htmlEditorLinkTargetParent: string;
        static htmlEditorLinkTargetTop: string;
        static buttonClose: string;
        static buttonOk: string;
        static buttonCancel: string;
        static defaultTemplatesGroupName: string;
    }
}
declare module "tsc/common/Common" {
    export const str: {
        totalTrim: (s: string) => string;
        equalsInvariant: (s1: string, s2: string) => boolean;
        startsWith: (s1: string, s2: string) => boolean;
    };
    export class Common {
        static extend(out: any, ...extensions: any[]): any;
        static getSelectedText(): string;
        static propsEach(obj: any, func: (key: string, value: any) => any): void;
        static propsFilterKeys(obj: any, filter: (key: string, value: any) => boolean, payload?: any): any[];
    }
}
declare module "tsc/fields/BaseField" {
    export abstract class BaseField<TData extends bre.Data> {
        static readonly type: string;
        static commonFieldsRegistered: boolean;
        static registerCommonFields(): void;
        static createField<TData extends bre.Data>($field: HTMLElement, data: TData, onSelect: (field: BaseField<TData>) => void, onUpdate: (property: any, oldValue: any, newValue: any) => void, onUpload?: (file: any, callback: (url: string) => void) => void): BaseField<TData>;
        private static _fields;
        private static registerField;
        $field: HTMLElement;
        name: string;
        data: TData;
        protected onUpload: (file: any, callback: (url: string) => void) => void;
        protected settings: (field: BaseField<TData>) => void;
        private onSelect;
        private onUpdate;
        constructor($field: HTMLElement, data: any, onSelect: (field: BaseField<TData>) => void, onUpdate: (property: any, oldValue: any, newValue: any) => void, onUpload?: (file: any, callback: (url: string) => void) => void);
        deselect(): void;
        getEl(): HTMLElement;
        protected getSettingsEl(): HTMLElement;
        protected bind(): void;
        protected select(): void;
        protected updateProperty(prop: keyof TData, value: any, fireUpdate?: boolean): void;
    }
}
declare module "tsc/fields/ContainerField" {
    import { BlocksContainer } from "tsc/BlocksContainer";
    import { BaseField } from "tsc/fields/BaseField";
    export class ContainerField extends BaseField {
        container: BlocksContainer;
        private $placeholder;
        bind(): void;
        updateBlocks(): void;
        deselect(): void;
        getEl(): HTMLElement;
    }
}
declare module "tsc/common/AJAXHelper" {
    export class $ajax {
        static get(url: string): Promise<any>;
        static getScript(url: string): any;
        static jsonp(url: string): any;
    }
}
declare module "tsc/prompt/PromptParameter" {
    export class PromptParameter {
        key: string;
        title: string;
        placeholder: string;
        value: any;
        protected _$control: HTMLElement;
        protected $input: HTMLInputElement;
        constructor(key: string, title: string, value: any, placeholder?: string);
        parseValue(): void;
        $control: HTMLElement;
        protected getEditor(): HTMLElement;
    }
}
declare module "tsc/prompt/PromptParameterImage" {
    import { PromptParameter, PromptParameterImageResult, PromptParameterOption } from "tsc/Prompt/Prompt";
    export class PromptParameterImage extends PromptParameter {
        options: PromptParameterOption[];
        private _value;
        constructor(key: string, title: string, value?: PromptParameterImageResult, placeholder?: string);
        parseValue(): void;
        protected getEditor(): HTMLElement;
        private updatePreview;
    }
}
declare module "tsc/prompt/PromptParameterImageResult" {
    export class PromptParameterImageResult {
        fileContent: string;
        fileInfo: PromptParameterImageResultFile;
    }
    export class PromptParameterImageResultFile {
        lastModified: number;
        lastModifiedDate: any;
        name: string;
        size: number;
        type: string;
        constructor(file: File);
    }
}
declare module "tsc/prompt/PromptParameterList" {
    import { PromptParameter } from "tsc/Prompt/Prompt";
    export class PromptParameterList {
        params: PromptParameter[];
        constructor(params: PromptParameter[]);
        getValue(key: string): any;
    }
}
declare module "tsc/prompt/PromptParameterOption" {
    export class PromptParameterOption {
        title: string;
        value: any;
        selected: boolean;
        constructor(title: string, value: any, selected?: boolean);
    }
}
declare module "tsc/prompt/PromptParameterOptions" {
    import { PromptParameter, PromptParameterOption } from "tsc/Prompt/Prompt";
    export class PromptParameterOptions extends PromptParameter {
        options: Array<PromptParameterOption>;
        constructor(key: string, title: string, options: Array<Array<any>>, value?: any, placeholder?: string);
        protected getEditor(): HTMLElement;
    }
}
declare module "tsc/Prompt/Prompt" {
    export * from "tsc/prompt/PromptParameter";
    export * from "tsc/prompt/PromptParameterImage";
    export * from "tsc/prompt/PromptParameterImageResult";
    export * from "tsc/prompt/PromptParameterList";
    export * from "tsc/prompt/PromptParameterOption";
    export * from "tsc/prompt/PromptParameterOptions";
}
declare module "tsc/services/EmbedService" {
    export class EmbedService {
        static Instagram: string;
        constructor();
        static getEmbedAsync(embedUrl: string): Promise<any>;
        static processEmbed(provider: string): void;
    }
}
declare module "tsc/services/TemplateService" {
    import { Template } from "tsc/Templates/Template";
    import { TemplateGroup } from "tsc/templates/TemplateGroup";
    export class TemplateService {
        static templates: TemplateGroup[];
        static loadTemplatesAsync(url: string, $editor: HTMLElement, onError: (message: string, code?: number) => any): Promise<TemplateGroup[]>;
        static getTemplate(templateName: string): Template;
        private static getTemplates;
    }
}
declare module "tsc/Services/Services" {
    export * from "tsc/services/EmbedService";
    export * from "tsc/services/TemplateService";
}
declare module "tsc/fields/EmbedField" {
    import { BaseField } from "tsc/fields/BaseField";
    export class EmbedField extends BaseField {
        getSettingsEl(): HTMLElement;
        readonly settings: (field: BaseField) => void;
        bind(): void;
        private showEmbedLoaderAsync;
        private getPromptParams;
        loadMedia(fireUpdate: boolean): Promise<void>;
        setEmbed(value: any, fireUpdate?: boolean): void;
        setUrl(value: string): void;
    }
}
declare module "tsc/ui/SelectionUtils" {
    export class SelectionUtils {
        static bindTextSelection($el: HTMLElement, handler: (rect: ClientRect) => any): void;
        private static getSelectionRect;
    }
}
declare module "tsc/fields/HtmlField" {
    import { BaseField } from "tsc/fields/BaseField";
    export class HtmlField extends BaseField {
        bind(): void;
        setHtml(value: string, fireUpdate?: boolean): void;
        getEl(): HTMLElement;
    }
}
declare module "tsc/HtmlLinkParams" {
    import { PromptParameter, PromptParameterList } from "tsc/Prompt/Prompt";
    export class HtmlLinkParams {
        href: string;
        title: string;
        target: string;
        static getLinkFromParams(fields: PromptParameterList): HtmlLinkParams;
        constructor(href?: string, title?: string, target?: string);
        getLinkPromptParams(): PromptParameter[];
    }
}
declare module "tsc/locales" {
    export const locales: {
        errorBlocksFileNotFound: (url: string) => string;
        errorTemplatesFileNotFound: (url: string) => string;
        errorBlockTemplateNotFound: (templateName: string) => string;
        errorTemplateParsing: (name: string) => string;
        embedFieldLinkTitle: string;
        embedFieldLinkPlaceholder: string;
        prompt: {
            image: {
                link: {
                    title: string;
                    placeholder: string;
                };
                alt: {
                    title: string;
                    placeholder: string;
                };
                upload: {
                    title: string;
                    placeholder: string;
                    button: string;
                };
                url: {
                    subtitle: string;
                };
            };
        };
        htmlEditorLinkUrlTitle: string;
        htmlEditorLinkUrlPlaceholder: string;
        htmlEditorLinkTitleTitle: string;
        htmlEditorLinkTitlePlaceholder: string;
        htmlEditorLinkTargetTitle: string;
        htmlEditorLinkTargetBlank: string;
        htmlEditorLinkTargetSelf: string;
        htmlEditorLinkTargetParent: string;
        htmlEditorLinkTargetTop: string;
        buttonClose: string;
        buttonOk: string;
        buttonCancel: string;
        defaultTemplatesGroupName: string;
    };
}
declare module "tsc/helpers" {
    export const helpers: {
        createElement: <TElement extends HTMLElement>(html: string) => TElement;
        showModal: (props: {
            content: HTMLElement[];
            onOk?: () => void;
            onCancel?: () => void;
        }) => void;
    };
}
declare module "tsc/prompt" {
    export const prompt: <TParams extends bre.prompt.PromptParameters>(params: TParams) => Promise<{ [TKey in keyof TParams]?: string; }>;
}
declare module "tsc/fields/ImageField" {
    import { BaseField } from "tsc/fields/BaseField";
    import { HtmlLinkParams } from "tsc/HtmlLinkParams";
    type ImageFieldData = {
        src: string;
        alt: string;
        file: File;
        link: Pick<HTMLLinkElement, "href" | "title" | "target">;
    };
    export class ImageField extends BaseField<ImageFieldData> {
        private readonly isImg;
        _isImg: boolean;
        private $link;
        bind(): void;
        setSrc(src: string, fireUpdate?: boolean): void;
        setAlt(alt: string): void;
        setFile(file: File): void;
        setLink(url: HtmlLinkParams): void;
        getEl(): HTMLElement;
    }
}
declare module "tsc/fields/Fields" {
    export * from "tsc/fields/BaseField";
    export * from "tsc/fields/ContainerField";
    export * from "tsc/fields/EmbedField";
    export * from "tsc/fields/HtmlField";
    export * from "tsc/fields/ImageField";
}
declare module "tsc/BlocksContainer" {
    import { Block } from "tsc/block/Block";
    import { BaseField } from "tsc/fields/Fields";
    import { Template } from "tsc/Templates/Template";
    export class BlocksContainer {
        private $element;
        private onAddBlock;
        private onDeleteBlock;
        private onSelectBlock;
        private onDeselectBlock;
        private onMoveBlock;
        private onUpdateBlock;
        private onUpload;
        private usePlaceholder;
        blocks: Block[];
        selectedBlock: Block;
        isContainer: boolean;
        $placeholder: HTMLElement;
        constructor($element: HTMLElement, onAddBlock: (block: Block, idx: number) => any, onDeleteBlock: (block: Block, idx: number) => any, onSelectBlock: (block: Block) => any, onDeselectBlock: (block: Block) => any, onMoveBlock: (block: Block, from: number, to: number) => any, onUpdateBlock: (block: Block, property: string, oldValue: any, newValue: any) => any, onUpload: (file: any, callback: (url: string) => void) => void, usePlaceholder?: boolean);
        getData(ignoreHtml?: boolean): any;
        getHtml(): string;
        addBlock(template: Template, data?: BaseField[], idx?: number, select?: boolean): void;
        private insertBlock;
        private deleteBlock;
        private moveBlock;
        private copyBlock;
        private selectBlock;
        private deselectBlock;
        private togglePlaceholderIfNeed;
    }
}
declare module "tsc/EditorOptions" {
    import { Block } from "tsc/block/Block";
    export class EditorOptions {
        templatesUrl: string;
        onload: any;
        onLoad: any;
        onChange: any;
        onBlockAdd: any;
        onBlockDelete: any;
        onBlockMove: any;
        onBlockSelect: any;
        onBlockDeselect: any;
        onBlockUpdate: any;
        onUpload: (file: any, callback: (url: string) => void) => void;
        blocksUrl: string;
        blocks: Block[];
        compactTools?: boolean;
        compactToolsWidth: number;
        ignoreHtml?: boolean;
        htmlToolsButtons?: bre.IHtmlToolsButton[];
        formSelector: string;
        inputSelector: string;
        constructor(options: EditorOptions);
        onError: any;
    }
}
declare module "tsc/Events" {
    export class Events {
        static onLoad: string;
        static onChange: string;
        static onBlockAdd: string;
        static onBlockDelete: string;
        static onBlockMove: string;
        static onBlockSelect: string;
        static onBlockDeselect: string;
        static onBlockUpdate: string;
    }
}
declare module "tsc/Editor" {
    import { EditorOptions } from "tsc/EditorOptions";
    import { Template } from "tsc/Templates/Template";
    import { UI } from "tsc/ui/UI";
    export class Editor {
        static UI: UI;
        $editor: HTMLElement;
        options: EditorOptions;
        private isLoaded;
        private container;
        constructor($editor: HTMLElement, options: EditorOptions);
        initAsync(): Promise<void>;
        tryBindFormSubmit(): void;
        getData(): any;
        getHtml(): string;
        loadBlocks(blocks: any[]): void;
        addBlock(template: Template): void;
        private onError;
        private createContainer;
        private tryLoadInitialBlocksAsync;
        private getContainer;
        private trigger;
    }
}
declare module "tsc/ui/HtmlTools" {
    import { Editor } from "tsc/Editor";
    export class HtmlTools {
        private editor;
        private $control;
        constructor(editor: Editor);
        private buttons;
        private setControl;
        private getButtonElement;
        private wrapSelectionToContainer;
        show(rect: ClientRect): void;
        private getLinkPromptParamsInternal;
    }
}
declare module "tsc/ui/Modal" {
    import { PromptParameter, PromptParameterList } from "tsc/Prompt/Prompt";
    export class Modal {
        private $control;
        private $closeBtn;
        private $form;
        private $btns;
        private $okBtn;
        private $cancelBtn;
        closeFunction: any;
        private selectionRanges;
        constructor($control: HTMLElement, $closeBtn: HTMLElement, $form: HTMLElement, $btns: HTMLElement, $okBtn: HTMLElement, $cancelBtn: HTMLElement);
        hideModal(): void;
        showModal($html?: HTMLElement, showBtns?: boolean): void;
        promptAsync(fields: PromptParameter[]): Promise<PromptParameterList>;
        saveSelection(): void;
        restoreSelection(): void;
    }
}
declare module "tsc/ui/UI" {
    import { TemplateGroup } from "tsc/templates/TemplateGroup";
    import { HtmlTools } from "tsc/ui/HtmlTools";
    import { Editor } from "tsc/Editor";
    import { Modal } from "tsc/ui/Modal";
    export class UI {
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
        private setTools;
        private toggleTools;
        private setModal;
        toggleToolsLoader(toggle: boolean): void;
        setTemplates(templateGroups: TemplateGroup[]): void;
        static initBtnDeck($btnsDeck: HTMLElement): void;
        static toggleBtnDeck($btnsDeck: HTMLElement, isOn?: boolean): void;
    }
}
declare module "tsc/block/BlockUI" {
    import { BlockUIAction } from "tsc/block/BlockUIAction";
    export class BlockUI {
        $editor: HTMLElement;
        $tools: HTMLElement;
        $block: HTMLElement;
        private onSelect;
        constructor($block: HTMLElement, preview: boolean, actions: BlockUIAction[], onSelect?: () => void);
        delete(): void;
        toggleSelection(isOn: boolean): void;
        private buildEditorUI;
        private buildButton;
    }
}
declare module "tsc/block/Block" {
    import { BlockUI } from "tsc/block/BlockUI";
    import { BaseField } from "tsc/fields/Fields";
    import { Template } from "tsc/Templates/Template";
    export class Block {
        template: Template;
        private onDelete?;
        private onSelect?;
        private onDeselect?;
        private onCopy?;
        private onMove?;
        private onUpdate?;
        private onUpload?;
        fields: BaseField[];
        ui: BlockUI;
        selectedField: BaseField;
        constructor(template: Template, preview: boolean, data?: BaseField[], onDelete?: (block: Block) => void, onSelect?: (block: Block) => void, onDeselect?: (block: Block) => void, onCopy?: (block: Block) => void, onMove?: (block: Block, offset: number) => void, onUpdate?: (block: Block, property: string, oldValue: any, newValue: any) => void, onUpload?: (file: any, callback: (url: string) => void) => void);
        isContainer(): boolean;
        delete(): void;
        move(offset: number): void;
        clone(): void;
        select(field?: BaseField): void;
        deselect(): void;
        scrollTo(): void;
        getData(ignoreHtml?: boolean): bre.IBlockData;
        getHtml(trim: boolean): string;
        private bindFields;
        private getActions;
    }
}
declare module "tsc/Templates/Template" {
    export class Template {
        name: string;
        loaded: boolean;
        $html: HTMLElement;
        $preview: HTMLElement;
        constructor($template: HTMLElement);
        getPreview(): HTMLElement;
    }
}
declare module "test/tmplates.spec" {
    import 'mocha';
}
declare module "tsc/Block/BlockAction" {
    export class BlockAction {
        icon?: string;
        action?: (block: any) => any;
        title?: string;
        constructor(icon?: string, action?: (block: any) => any, title?: string);
    }
}
declare module "tsc/UI/SelectionHelper" {
    export class SelectionHelper {
        static getSelectedText(): string;
        static replaceSelectedText(replacement: any): void;
    }
}
