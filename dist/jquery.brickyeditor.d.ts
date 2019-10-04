/// <reference path="Types/jquery.d.ts" />
/// <reference path="Types/common.d.ts" />
interface String {
  breTotalTrim(): string;
  breEqualsInvariant(other: string): boolean;
  breStartsWith(part: string): boolean;
  breContains(part: string): boolean;
}
interface Array<T> {
  find(predicate: (search: T) => boolean): T;
}
declare class Action {
  public type: string;
  public payload: any;
  constructor(type: string, payload: any);
}
interface IHtmlToolsButton {
  icon: string;
  command: string;
  range: boolean;
  aValueArgument: string;
}
declare namespace BrickyEditor {
  class Common {
    public static getSelectedText(): string;
    public static propsEach(obj: any, func: (key: string, value) => any): void;
    public static propsFilterKeys(
      obj: any,
      filter: (key: string, value) => boolean,
      payload?: any
    ): any[];
  }
}
declare namespace BrickyEditor {
  class Editor {
    public static UI: UI;
    public $editor: JQuery;
    public options: EditorOptions;
    public blocks: Block[];
    public selectedBlock: Block;
    public readonly selectedBlockIndex: number;
    private compactTools?;
    constructor($editor: JQuery, options: EditorOptions);
    public initAsync(): Promise<void>;
    public tryBindFormSubmit(): void;
    public getData(): any;
    public getHtml(): string;
    public loadBlocks(blocks: any[]): void;
    public addBlock(
      template: Template,
      data?: Fields.BaseField[],
      idx?: number,
      select?: boolean
    ): void;
    private tryLoadInitialBlocksAsync();
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
    public templatesUrl: string;
    public onload: any;
    public blocksUrl: string;
    public blocks: Block[];
    public compactTools?: boolean;
    public compactToolsWidth: number;
    public ignoreHtml?: boolean;
    public htmlToolsButtons?: IHtmlToolsButton[];
    public formSelector: string;
    public inputSelector: string;
    constructor(options: EditorOptions);
  }
}
declare namespace BrickyEditor {
  class Template {
    public name: string;
    public category: string[];
    public $html: JQuery;
    public $preview: JQuery;
    constructor(el: Element);
    public getPreview(): JQuery;
  }
}
declare namespace BrickyEditor {
  class Block {
    public template: Template;
    public dispatcher: (action: Action) => void;
    public preview: boolean;
    public fields: Fields.BaseField[];
    public ui: BlockUI;
    constructor(
      template: Template,
      dispatcher: (action: Action) => void,
      preview: boolean,
      data?: Fields.BaseField[]
    );
    public delete(): void;
    public move(offset: number): void;
    public copy(): void;
    public select(): void;
    public deselect(): void;
    public scrollTo(): void;
    public getData(ignoreHtml?: boolean): any;
    public getHtml(trim: boolean, skipAttrRemoving?: boolean): string;
  }
}
declare namespace BrickyEditor {
  class BlockAction {
    public icon: string;
    public action: (block) => any;
    public title: string;
    constructor(icon?: string, action?: (block) => any, title?: string);
  }
}
declare namespace BrickyEditor {
  class BlockActions {
    public static DELETE: string;
    public static COPY: string;
    public static MOVE: string;
    public static SELECT: string;
    public static DESELECT: string;
    public static INSERT: string;
    public static delete: (block: Block) => Action;
    public static copy: (block: Block) => Action;
    public static select: (block: Block) => Action;
    public static deselect: (block: Block) => Action;
    public static move: (block: Block, offset: number) => Action;
    public static insert: (block: Block, idx: number) => Action;
  }
}
declare namespace BrickyEditor {
  class BlockUI {
    private static actions;
    public $block: JQuery;
    public preview: boolean;
    public $tools: JQuery;
    public $editor: JQuery;
    private block;
    constructor(
      block: Block,
      $block: JQuery,
      preview: boolean,
      data?: Fields.BaseField[]
    );
    public delete(): void;
    private buildEditorUI();
    private buildButton(action);
    private bindFields(data?);
  }
}
declare namespace BrickyEditor {
  namespace Fields {
    abstract class BaseField {
      public static readonly type: string;
      public static registerCommonFields(): void;
      public static createField(block: any, $el: JQuery, data: any): BaseField;
      private static _fields;
      private static registerField();
      public name: string;
      public data: any;
      protected block: Block;
      protected $field: JQuery;
      protected settings: (field: BaseField) => void;
      constructor(block: Block, $field: JQuery, data: any);
      protected getSettingsEl(): JQuery;
      protected bind(): void;
      protected selectBlock(): void;
    }
  }
}
declare namespace BrickyEditor {
  namespace Fields {
    class EmbedField extends BaseField {
      public readonly settings: (field: BaseField) => void;
      public getSettingsEl(): JQuery;
      public bind(): void;
      public loadMedia(): Promise<void>;
    }
  }
}
declare namespace BrickyEditor {
  namespace Fields {
    class HtmlField extends BaseField {
      public bind(): void;
      public setHtml(html: string): void;
    }
  }
}
declare namespace BrickyEditor {
  namespace Fields {
    class ImageField extends BaseField {
      public _isImg: boolean;
      private readonly isImg;
      public bind(): void;
      public setSrc(src: any): void;
      public setAlt(alt: any): void;
      public setFile(file: any): void;
      private getPromptParams();
    }
  }
}
declare namespace BrickyEditor {
  namespace Prompt {
    class PromptParameter {
      public key: string;
      public title: string;
      public placeholder: string;
      public value: any;
      public $control: JQuery;
      protected _$control: JQuery;
      protected $input: JQuery;
      constructor(key: string, title: string, value: any, placeholder?: string);
      public parseValue(): void;
      protected getEditor(): JQuery;
    }
  }
}
declare namespace BrickyEditor {
  namespace Prompt {
    class PromptParameterImage extends PromptParameter {
      public options: PromptParameterOption[];
      private _value;
      constructor(
        key: string,
        title: string,
        value?: PromptParameterImageResult,
        placeholder?: string
      );
      public parseValue(): void;
      protected getEditor(): JQuery;
    }
  }
}
declare namespace BrickyEditor {
  namespace Prompt {
    class PromptParameterImageResult {
      public fileContent: string;
      public fileInfo: PromptParameterImageResultFile;
    }
    class PromptParameterImageResultFile {
      public lastModified: number;
      public lastModifiedDate: any;
      public name: string;
      public size: number;
      public type: string;
      constructor(file: File);
    }
  }
}
declare namespace BrickyEditor {
  namespace Prompt {
    class PromptParameterList {
      public params: PromptParameter[];
      constructor(params: PromptParameter[]);
      public getValue(key: string): any;
    }
  }
}
declare namespace BrickyEditor {
  namespace Prompt {
    class PromptParameterOption {
      public title: string;
      public value: any;
      public selected: boolean;
      constructor(title: string, value: any, selected?: boolean);
    }
  }
}
declare namespace BrickyEditor {
  namespace Prompt {
    class PromptParameterOptions extends PromptParameter {
      public options: PromptParameterOption[];
      constructor(
        key: string,
        title: string,
        options: any[][],
        value?: any,
        placeholder?: string
      );
      protected getEditor(): JQuery;
    }
  }
}
declare namespace BrickyEditor {
  namespace Services {
    class EmbedService {
      public static Instagram: string;
      public static getEmbedAsync(embedUrl: string): Promise<any>;
      public static processEmbed(provider: string): void;
      constructor();
    }
  }
}
declare namespace BrickyEditor {
  namespace Services {
    class TemplateService {
      public static templates: Template[];
      public static loadTemplatesAsync(editor: Editor): Promise<Template[]>;
      public static getTemplate(templateName: string): Template;
    }
  }
}
declare namespace BrickyEditor {
  class HtmlTools {
    private editor;
    private $control;
    private buttons;
    constructor(editor: Editor);
    public show(rect: ClientRect): void;
    private setControl();
    private getButtonElement(icon, command, rangeCommand?, aValueArgument?);
    private getLinkPromptParams(selection);
  }
}
declare namespace BrickyEditor {
  class Modal {
    public closeFunction: any;
    private $control;
    private $closeBtn;
    private $form;
    private $btns;
    private $okBtn;
    private $cancelBtn;
    private selectionRanges;
    constructor(
      $control: JQuery,
      $closeBtn: JQuery,
      $form: JQuery,
      $btns: JQuery,
      $okBtn: JQuery,
      $cancelBtn: JQuery
    );
    public hideModal(): void;
    public showModal($html?: JQuery, showBtns?: boolean): void;
    public promptAsync(
      fields: Prompt.PromptParameter[]
    ): Promise<Prompt.PromptParameterList>;
    public saveSelection(): void;
    public restoreSelection(): void;
  }
}
declare namespace BrickyEditor {
  class SelectionHelper {
    public static getSelectedText(): string;
    public static replaceSelectedText(replacement: any): void;
  }
}
declare namespace BrickyEditor {
  class SelectionUtils {
    public static bindTextSelection(
      $el: JQuery,
      handler: (rect: ClientRect) => any
    ): void;
    private static getSelectionRect();
  }
}
declare namespace BrickyEditor {
  class Selectors {
    public static field: string;
    public static selectorField: string;
    public static classMobile: string;
    public static htmlToolsCommand: string;
    public static htmlToolsCommandRange: string;
    public static selectorHtmlToolsCommand: string;
    public static selectorHtmlToolsCommandRange: string;
    private static attr(attr);
  }
}
declare namespace BrickyEditor {
  class UI {
    public static initBtnDeck($btnsDeck: JQuery): void;
    public static toggleBtnDeck($btnsDeck: JQuery, isOn?: boolean): void;
    public editor: Editor;
    public modal: Modal;
    public htmlTools: HtmlTools;
    private $tools;
    private $toolsBtn;
    private $toolsTemplates;
    private $toolsHideBtn;
    private $toolsLoader;
    private readonly isCompactTools;
    constructor(editor: Editor);
    public toggleToolsLoader(toggle: any): void;
    public setTemplates(templates: Template[]): void;
    private setTools();
    private toggleTools();
    private setModal();
  }
}
