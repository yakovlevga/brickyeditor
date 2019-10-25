import { BlocksContainer } from "src/BlocksContainer";
import { $ajax } from "src/common/AJAXHelper";
import { Common, str } from "src/common/Common";
import { $dom } from "src/common/DOMHelpers";
import { defaultOptions } from "src/defaults";
import { EditorStrings } from "src/EditorStrings";
import { BaseField, ContainerField } from "src/fields/Fields";
import { TemplateService } from "src/Services/Services";
import { Template } from "src/templates/Template";
import { bre } from "src/Types/bre";
import { Selectors } from "src/ui/Selectors";
import { UI } from "src/ui/UI";
import { Block } from "tsc/block/Block";

export class Editor {
  public static UI: UI;

  public $editor: HTMLElement;
  public options: bre.Options;
  private isLoaded: boolean;
  private container: BlocksContainer;

  constructor($editor: HTMLElement, options: bre.Options) {
    BaseField.registerCommonFields();

    this.$editor = $editor;
    this.$editor.classList.add(Selectors.classEditor);
    this.options = { ...options, ...defaultOptions };
    this.container = this.createContainer();

    Editor.UI = new UI(this);

    this.tryBindFormSubmit();
  }

  public async initAsync() {
    const editor = this;

    /// Load templates
    Editor.UI.toggleToolsLoader(true);

    const templates = await TemplateService.loadTemplatesAsync(
      editor.options.templatesUrl,
      editor.$editor,
      editor.onError
    );

    Editor.UI.toggleToolsLoader(false);
    Editor.UI.setTemplates(templates);

    // Load initial blocks
    const blocks = await this.tryLoadInitialBlocksAsync();
    this.loadBlocks(blocks);

    // Trigger jQuery event
    this.isLoaded = true;
    this.trigger("onLoad", this);
  }

  public tryBindFormSubmit() {
    const editor = this;
    const $form = this.options.formSelector
      ? $dom.find(this.options.formSelector)
      : null;
    const $input = this.options.inputSelector
      ? $dom.find(this.options.inputSelector)
      : null;

    if (!$form || !$input || !($input instanceof HTMLInputElement)) {
      return;
    }

    $dom.on($form, "submit", () => {
      ($input as HTMLInputElement).value = JSON.stringify(editor.getData());
      return true;
    });
  }

  public getData(): any {
    return this.container.getData(this.options.ignoreHtml);
  }

  public getHtml(): string {
    return this.container.getHtml();
  }

  /// BLOCKS
  public loadBlocks(blocks: any[]) {
    if (blocks && blocks.length) {
      blocks.forEach(block => {
        const template = TemplateService.getTemplate(block.template);
        if (template) {
          this.container.addBlock(template, block.fields, null, false);
        } else {
          const message = EditorStrings.errorBlockTemplateNotFound(
            block.template
          );
          this.onError(message);
        }
      });
    }
  }

  public addBlock(template: Template) {
    const container = this.getContainer(this.container);
    container.addBlock(template, null, null, true);
  }

  private onError = (message: string, code: number = 0) =>
    this.options.onError({ message, code });

  private createContainer(): BlocksContainer {
    const onAdd = (block: Block, idx: number) => {
      if (this.isLoaded) {
        this.trigger("onBlockAdd", { block, idx });
        this.trigger("onChange", {
          blocks: this.getData(),
          html: this.getHtml(),
        });
      }
    };

    const onDelete = (block: Block, idx: number) => {
      this.trigger(Events.onBlockDelete, { block, idx });
      this.trigger(Events.onChange, {
        blocks: this.getData(),
        html: this.getHtml(),
      });
    };

    const onUpdate = (
      block: Block,
      property: string,
      oldValue: any,
      newValue: any
    ) => {
      this.trigger("onBlockUpdate", {
        block,
        property,
        oldValue,
        newValue,
      });
      this.trigger("onChange", {
        blocks: this.getData(),
        html: this.getHtml(),
      });
    };

    return new BlocksContainer(
      this.$editor,
      onAdd,
      onDelete,
      (block: Block) => {
        this.trigger("onBlockSelect", { block });
      },
      (block: Block) => {
        this.trigger("onBlockDeselect", { block });
      },
      (block: Block, from: number, to: number) => {
        this.trigger("onBlockMove", { block, from, to });
        this.trigger("onChange", {
          blocks: this.getData(),
          html: this.getHtml(),
        });
      },
      onUpdate,
      this.options.onUpload
    );
  }

  // load initial blocks
  private async tryLoadInitialBlocksAsync(): Promise<Block[] | null> {
    const url = this.options.blocksUrl;
    const editor = this;
    return new Promise<Block[] | null>(async (resolve, reject) => {
      if (url !== undefined) {
        try {
          const blocks = await $ajax.get(url);
          resolve(blocks);
        } catch (error) {
          editor.onError(EditorStrings.errorBlocksFileNotFound(url));
          reject(error);
        }
      } else if (this.options.blocks !== undefined) {
        resolve(this.options.blocks);
      } else {
        resolve(null);
      }
    });
  }

  private getContainer(container: BlocksContainer) {
    if (container.selectedBlock && container.selectedBlock.isContainer()) {
      const field = container.selectedBlock.selectedField as ContainerField;
      if (field) {
        return this.getContainer(field.container);
      }
    }
    return container;
  }

  private trigger(event: bre.Event, data: any) {
    const editor = this;
    $dom.trigger(this.$editor, "bre." + event, data);
    Common.propsEach(editor.options, (key, value) => {
      if (str.equalsInvariant(key, event) && value) {
        value(data);
      }
    });
  }
}
