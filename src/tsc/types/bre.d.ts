import { NoembedResponse } from "src/embed";
import { OnOffFunc } from "src/emmiter";

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
    blocks: bre.core.block.BlockData[];
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

  namespace ui {
    type FieldBase = {
      $element: HTMLElement;
      // clean up html element from editors data attributes, etc.
      cleanup?: () => HTMLElement;
      selected?: boolean;
      on?: OnOffFunc;
      off?: OnOffFunc;
    };

    type Field<TFieldData extends core.field.FieldData> = FieldBase & {
      data: TFieldData;
    };
  }

  namespace prompt {
    type PromptParameterType = "text" | "file" | "select";

    type PromptParameter<TValue = any> = {
      type?: PromptParameterType;
      value?: TValue;
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

  namespace core {
    interface IBlocksContainer {
      $element: HTMLElement;
      $placeholder: HTMLElement | null;
      blocks: block.Block[];
      selectedBlock: block.Block | null;
      // usePlaceholder: boolean;
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
      type BlockEvent = (block: Block) => void;

      type MoveEvent = (block: Block, offset: number) => void;

      type UpdateEvent = (
        block: Block,
        property: string,
        oldValue: any,
        newValue: any
      ) => void;

      type BlockEvents = {
        onDelete?: BlockEvent;
        onSelect?: BlockEvent;
        onDeselect?: BlockEvent;
        onCopy?: BlockEvent;
        onMove?: MoveEvent;
        onUpdate?: UpdateEvent;
        onUpload?: FileUploadHandler;
      };

      type BlockData = {
        template: string;
        fields: ui.FieldBase[];
      };

      type Block = {
        $element: HTMLElement;
        data: BlockData;
        fields?: ui.FieldBase[];
        selectedField: ui.FieldBase | null;
      };
    }

    namespace field {
      type FieldType = "html" | "container" | "embed" | "image";

      // type BaseField = {
      //   $field: HTMLElement;
      //   getElement: () => HTMLElement;
      //   onSelect: (f: Field) => void;
      //   onUpdate?: (f: Field) => void;
      //   onDeselect?: (f: Field) => void;
      // };

      type FieldData<TType extends FieldType = any, TData = {}> = {
        type: TType;
        name: string;
      } & TData;

      // type ContainerFieldData = FieldData<
      //   "container",
      //   { blocks: bre.core.block.BlockData[] }
      // >;

      // type EmbedFieldData = FieldData<
      //   "embed",
      //   {
      //     url?: string;
      //     embed?: NoembedResponse;
      //   }
      // >;

      // type ImageFieldData = FieldData<
      //   "image",
      //   {
      //     src?: string;
      //     alt?: string;
      //     file?: File;
      //     link?: Pick<HTMLLinkElement, "href" | "title" | "target">;
      //   }
      // >;
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

    // type DataField = {
    //   name: string;
    //   value: any;
    // };
    //  & {
    //   [TKey: string]: any;
    // };

    // namespace field {
    //   interface IBaseField<TData extends bre.Data> {
    //     data: TData;
    //   }
    // }
  }
}
