import { NoembedResponse } from "src/embed";
import {
  OnOffFunc,
  FieldEventMap,
  TemplatesEventMap,
  Emitter,
  BlockEventMap
} from "src/emmiter";

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

  type Options = {
    /** Url to predifined templates */
    templatesUrl: string;

    onUpload?: FileUploadHandler;

    /** Url to fetch initial blocks, overrides initial blocks property */
    blocksUrl?: string;
    /** Inital block data */
    blocks?: bre.core.block.BlockData[];

    /** Show blocks selector in compact mode */
    compactTools?: boolean;
    /** Max screen width to show tools in compact mode */
    compactToolsWidth?: number;
    /** Ignore blocks html field, if you need only json */
    ignoreHtml?: boolean;
    /** Custom Html editor buttons */
    htmlToolsButtons?: bre.core.IHtmlToolsButton[];
    /** Form selector to bind form submit event */
    formSelector?: string;
    /** Input selector to put json to on form submit */
    inputSelector?: string;
  };

  namespace ui {
    type FieldBase = {
      $element: HTMLElement;
      selected?: boolean;
      on?: OnOffFunc<FieldEventMap>;
      off?: OnOffFunc<FieldEventMap>;
    };

    type Field<TFieldData extends core.field.FieldData> = FieldBase & {
      data: TFieldData;
      bind: ($element: HTMLElement, data: TFieldData) => void;
      // clean up html element from editors data attributes, etc.
      html: (field: Field<TFieldData>) => HTMLElement;
      editor?: (
        initialData: Readonly<TFieldData>
      ) => {
        $element: HTMLElement;
        data: TFieldData;
      };
    };

    type Templates = {
      $element: HTMLElement;

      setTemplates: (templatesGroupped: bre.core.ITemplateGroup[]) => void;

      on?: OnOffFunc<TemplatesEventMap>;
      off?: OnOffFunc<TemplatesEventMap>;
    };
  }

  namespace prompt {
    type PromptParameterType = "text" | "src" | "file" | "select";

    type PromptParameter<TValue = any> = {
      type: PromptParameterType;
      value?: TValue;
      title: string;
      placeholder?: string;
      options?: {
        title: string;
        value: string;
      }[];
      preview?: (p?: PromptParameter<TValue>) => string;
    };

    type PromptParams = Record<string, PromptParameter>;

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

    interface Editor {
      $element: HTMLElement;
      container: IBlocksContainer;
      selectedContainer: IBlocksContainer;
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
        fields: core.field.FieldData[];
      };

      type Block = {
        $element: HTMLElement;
        data: BlockData;
        fields?: ui.FieldBase[];
        selectedField: ui.FieldBase | null;
      } & Emitter<BlockEventMap>;
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

      type LinkData = Partial<
        Pick<HTMLLinkElement, "href" | "title" | "target">
      >;

      type FieldData<TType extends FieldType = any, TData = {}> = {
        type: TType;
        name: string;
      } & TData;
    }

    // TODO: or Exclude 'slice'?
    type FileInfo = Pick<File, "name" | "size" | "type" | "lastModified">;

    type FileContent = {
      fileContent: string;
      fileInfo: bre.core.FileInfo;
    };

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
