import { ContainerField } from "@/fields/container";
import { helpers } from "@/helpers";

// This types is for mock cases
declare type Mutable<T> = { -readonly [P in keyof T]: T[P] };

declare namespace bre {
  type FileUploadHandler = (file: any, callback: (url: string) => void) => void;

  type EditorPlugin = { init: (editor: bre.Editor) => void };

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
    /** Form selector to bind form submit event */
    formSelector?: string;
    /** Input selector to put json to on form submit */
    inputSelector?: string;

    templateSelector: {
      zoom: boolean;
    };

    plugins?: Array<{ plugin: EditorPlugin }>;
  };

  type EditorModal = (
    $content: HTMLElement,
    ok?: () => void,
    cancel?: () => void
  ) => void;

  type EditorHelpers = typeof helpers;

  type BlocksContainerEvent = {
    container: bre.BlocksContainer;
  };

  type BlocksContainerEventMap = {
    change: BlocksContainerEvent;
    select: BlocksContainerEvent;
  };

  type BlocksContainer = {
    editor: bre.Editor;
    $element: HTMLElement;
    $placeholder: HTMLElement | null;
    blocks: block.Block[];
    selectedBlock: block.Block | null;
    parentContainerField: ContainerField | null;
    // usePlaceholder: boolean;
    // data: () => any;
    // html: () => string;
    // add: (block: Block) => void;
  };

  type EditorState = {
    selectedField: bre.field.FieldBase | null;
    selectedBlocks: bre.block.Block[];
    selectedContainers: bre.BlocksContainer[];
  };

  type Editor = bre.event.Emitter<bre.event.EventMaps> & {
    $element: HTMLElement;
    data: () => bre.block.BlockData[];
    html: () => string;

    state: EditorState;
    options: EditorOptions;
    shared: {
      modal: EditorModal;
      helpers: EditorHelpers;
    };
  };

  namespace event {
    type BaseEvent<TSender> = {
      sender: TSender;
    };

    type EventMaps = BlocksContainerEventMap &
      field.FieldEventMap &
      // template.TemplatesEventMap &
      block.BlockEventMap;

    type OnOffFunc<TEventMap extends EventMaps> = <K extends keyof TEventMap>(
      type: K,
      listener: (ev: TEventMap[K]) => void
    ) => void;

    type FireFunc<TEventMap extends EventMaps> = <K extends keyof TEventMap>(
      type: K,
      ev: TEventMap[K]
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
    type FieldEvent = bre.event.BaseEvent<bre.field.FieldBase>;

    type FieldEventMap = {
      fieldChange: FieldEvent;
      fieldSelect: FieldEvent;
      fieldBlur: FieldEvent;
      fieldCreate: FieldEvent;
    };

    type FieldBase = {
      parentBlock: bre.block.Block;
      $element: HTMLElement;
      data: field.FieldData;
    };

    type Field<TFieldData extends field.FieldData> = FieldBase & {
      data: TFieldData;
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

    // type TemplatesEventMap = {
    //   select: {
    //     template: bre.template.Template;
    //   };
    // };

    // type Templates = event.Emitter<TemplatesEventMap> & {
    //   $element: HTMLElement;
    //   setTemplates: (groups: bre.template.TemplateGroup[]) => void;
    // };
  }

  namespace block {
    type BlockEvent<T = {}> = event.BaseEvent<bre.block.Block> & T;
    type BlockEventMap = {
      blockAdd: BlockEvent;
      blockDelete: BlockEvent;
      blockClone: BlockEvent;
      blockSelect: BlockEvent;
      blockMove: BlockEvent<{
        offset: number;
      }>;
    };

    type BlockData = {
      template: string;
      fields: field.FieldData[];
    };

    type Block = {
      $element: HTMLElement;
      data: BlockData;
      fields?: field.FieldBase[];
      blockEditor?: BlockEditor;
      parentContainer: BlocksContainer;
      selected: boolean;
    };

    type BlockEditorButton = {
      name: string;
      icon: string;
      action: (block: bre.block.Block) => void;
      disabled?: (block: bre.block.Block) => boolean;
    };

    type BlockEditor = {
      $element: HTMLDivElement;
      buttons: {
        $element: HTMLDivElement;
        button: BlockEditorButton;
      }[];
    };
  }

  type LinkData = Partial<Pick<HTMLLinkElement, "href" | "title" | "target">>;

  namespace field {
    type FieldType = "html" | "container" | "embed" | "image";

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
