import { NoembedResponse } from "@/embed";

// This types is for mock cases
declare type Mutable<T> = { -readonly [P in keyof T]: T[P] };

declare namespace bre {
  type FileUploadHandler = (file: any, callback: (url: string) => void) => void;

  type EditorOptions = {
    /** Url to predifined templates */
    templatesUrl: string;

    onUpload?: FileUploadHandler;

    /** Url to fetch initial blocks, overrides initial blocks property */
    blocksUrl?: string;
    /** Inital block data */
    blocks?: bre.block.BlockData[];

    /** Show blocks selector in compact mode */
    compactTools?: boolean;
    /** Max screen width to show tools in compact mode */
    compactToolsWidth?: number;
    /** Ignore blocks html field, if you need only json */
    ignoreHtml?: boolean;
    /** Custom Html editor buttons */
    htmlToolsButtons?: bre.HtmlToolsButton[];
    /** Form selector to bind form submit event */
    formSelector?: string;
    /** Input selector to put json to on form submit */
    inputSelector?: string;
  };

  type BlocksContainer = {
    $element: HTMLElement;
    $placeholder: HTMLElement | null;
    blocks: block.Block[];
    selectedBlock: block.Block | null;
    // usePlaceholder: boolean;
    // data: () => any;
    // html: () => string;
    // add: (block: Block) => void;
  };

  type Editor = {
    $element: HTMLElement;
    container: BlocksContainer;
    selectedContainer: BlocksContainer;
  };

  namespace event {
    type EventMaps =
      | field.FieldEventMap
      | template.TemplatesEventMap
      | block.BlockEventMap;

    type OnOffFunc<TEventMap extends EventMaps> = <K extends keyof TEventMap>(
      type: K,
      listener: (ev?: TEventMap[K]) => void
    ) => void;

    type FireFunc<TEventMap extends EventMaps> = <K extends keyof TEventMap>(
      type: K,
      ev?: TEventMap[K]
    ) => void;

    type Emitter<TEventMap extends EventMaps> = {
      on: OnOffFunc<TEventMap>;
      off: OnOffFunc<TEventMap>;
      fire: FireFunc<TEventMap>;
    };
  }

  type ElementContainer = {
    $element: HTMLElement;
  };

  namespace field {
    type FieldEvent = {
      field: bre.field.FieldBase;
    };

    type FieldEventMap = {
      change: FieldEvent;
      focus: FieldEvent;
      blur: FieldEvent;
    };

    type FieldBase = event.Emitter<FieldEventMap> & {
      $element: HTMLElement;
      selected?: boolean;
      data: field.FieldData;
    };

    type Field<TFieldData extends field.FieldData> = FieldBase & {
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
  }

  namespace template {
    type Template = {
      $template: HTMLElement;
      $preview: HTMLElement;
      name: string;
    };

    type TemplateGroup = {
      name: string | null;
      templates: bre.template.Template[];
    };

    type TemplatesEventMap = {
      select: {
        template: bre.template.Template;
      };
    };

    type Templates = event.Emitter<TemplatesEventMap> & {
      $element: HTMLElement;
      setTemplates: (groups: bre.template.TemplateGroup[]) => void;
    };
  }

  namespace block {
    type BlockEvent<T = {}> = T;
    type BlockEventMap = {
      delete: BlockEvent;
      clone: BlockEvent;
      move: BlockEvent<{
        offset: number;
      }>;
    };

    // type MoveEvent = (block: Block, offset: number) => void;

    // type UpdateEvent = (
    //   block: Block,
    //   property: string,
    //   oldValue: any,
    //   newValue: any
    // ) => void;

    // type BlockEvents = {
    //   onDelete?: BlockEvent;
    //   onSelect?: BlockEvent;
    //   onDeselect?: BlockEvent;
    //   onCopy?: BlockEvent;
    //   onMove?: MoveEvent;
    //   onUpdate?: UpdateEvent;
    //   onUpload?: FileUploadHandler;
    // };

    type BlockData = {
      template: string;
      fields: field.FieldData[];
    };

    type Block = event.Emitter<BlockEventMap> & {
      $element: HTMLElement;
      data: BlockData;
      fields?: field.FieldBase[];
      selectedField: field.FieldBase | null;
    };
  }

  type HtmlToolsButtonCommands =
    | "Bold"
    | "Italic"
    | "CreateLink"
    | "insertOrderedList"
    | "insertUnorderedList"
    | "Undo"
    | "Redo";

  type HtmlToolsButton = {
    icon: string;
    command: HtmlToolsButtonCommands;
    range: boolean;
    aValueArgument?: string;
  };

  type LinkData = Partial<Pick<HTMLLinkElement, "href" | "title" | "target">>;

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
  }

  // TODO: or Exclude 'slice'?
  type FileInfo = Pick<File, "name" | "size" | "type" | "lastModified">;

  type FileContent = {
    fileContent: string;
    fileInfo: bre.FileInfo;
  };
}
