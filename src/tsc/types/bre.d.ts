import { Block } from "src/block/Block";

declare var instgrm: any;

declare namespace bre {
  type Event =
    | "onLoad"
    | "onChange"
    | "onBlockAdd"
    | "onBlockDelete"
    | "onBlockMove"
    | "onBlockSelect"
    | "onBlockDeselect"
    | "onBlockUpdate"
    | "onError";

  type Subscriptions = {
    [TKey in Event]: (params: any) => void;
  };

  type FileUploadHandler = (file: any, callback: (url: string) => void) => void;

  type Options = Subscriptions & {
    /** Url to predifined templates */
    templatesUrl: string;

    onUpload: FileUploadHandler;

    /** Url to fetch initial blocks, overrides initial blocks property */
    blocksUrl: string;
    /** Inital block data */
    blocks: Block[];
    /** Show blocks selector in compact mode */
    compactTools?: boolean;
    /** Max screen width to show tools in compact mode */
    compactToolsWidth: number;
    /** Ignore blocks html field, if you need only json */
    ignoreHtml: boolean;
    /** Custom Html editor buttons */
    htmlToolsButtons: bre.IHtmlToolsButton[];
    /** Form selector to bind form submit event */
    formSelector: string;
    /** Input selector to put json to on form submit */
    inputSelector: string;
  };

  namespace ui {}

  namespace core {
    interface IBlocksContainer {
      $element: HTMLElement;
      $placeholder?: HTMLElement;
      blocks: Block[];
      selectedBlock?: Block;
      usePlaceholder: boolean;
      // data: () => any;
      // html: () => string;
      // add: (block: Block) => void;
    }

    interface ITemplateGroup {
      name: string | null;
      templates: bre.core.ITemplate[];
    }

    interface ITemplate {
      $html: HTMLElement;
      $preview: HTMLElement;
      name: string;
    }

    namespace block {
      type Event = (block: Block) => void;
      type MoveEvent = (block: Block, offset: number) => void;
      type UpdateEvent = (
        block: Block,
        property: string,
        oldValue: any,
        newValue: any
      ) => void;

      type Events = {
        onDelete?: Event;
        onSelect?: Event;
        onDeselect?: Event;
        onCopy?: Event;
        onMove?: MoveEvent;
        onUpdate?: UpdateEvent;
        onUpload?: FileUploadHandler;
      };
    }

    namespace field {
      type FieldType = "container" | "html" | "image" | "embed";

      type Data = {
        name: string;
        type: FieldType;
      } & {
        [TKey: string]: any;
      };
    }
  }

  type HtmlToolsButtonCommands =
    | "Bold"
    | "Italic"
    | "CreateLink"
    | "insertOrderedList"
    | "insertUnorderedList"
    | "Undo"
    | "Redo";

  interface IHtmlToolsButton {
    icon: string;
    command: HtmlToolsButtonCommands;
    range: boolean;
    aValueArgument?: string;
  }

  interface IBlockData {
    template: string;
    fields: any[];
    html?: string;
  }

  // type DataField = {
  //   name: string;
  //   value: any;
  // };

  type Data = { name: string } & {
    [TKey: string]: any;
  };

  // namespace field {
  //   interface IBaseField<TData extends bre.Data> {
  //     data: TData;
  //   }
  // }

  namespace prompt {
    type PromptParameterType = "text" | "file" | "select";

    type PromptParameter<TValue = any> = {
      type?: PromptParameterType;
      value: TValue;
      title: string;
      placeholder?: string;
      options?: {
        title: string;
        value: string;
      }[];
    };

    type PromptParameters = {
      [TKey: string]: PromptParameter;
    };

    type PromptParameterWithControl = PromptParameter & {
      control: HTMLElement;
    };

    interface IPromptParameterImageResult {
      fileContent: string;
      fileInfo: IPromptParameterImageResultFile;
    }

    interface IPromptParameterImageResultFile {
      lastModified: number;
      lastModifiedDate: any;
      name: string;
      size: number;
      type: string;

      // constructor(file: File) {
      //   this.name = file.name;
      //   this.size = file.size;
      //   this.type = file.type;
      //   this.lastModified = (file as any).lastModified;
      //   this.lastModifiedDate = file.lastModifiedDate;
      // }
    }

    interface IPromptParameterOption {
      title: string;
      value: any;
      selected?: boolean;
    }
  }
}
