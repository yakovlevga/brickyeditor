import { Block } from "src/block/Block";
import { $dom } from "src/common/DOMHelpers";
import { BaseField } from "src/fields/Fields";
import { Template } from "src/templates/Template";

export class BlocksContainer {
  public blocks: Block[] = [];
  public selectedBlock: Block;
  public isContainer: boolean = true;
  public $placeholder: HTMLElement;

  constructor(
    private $element: HTMLElement,
    private onAddBlock: (block: Block, idx: number) => any,
    private onDeleteBlock: (block: Block, idx: number) => any,
    private onSelectBlock: (block: Block) => any,
    private onDeselectBlock: (block: Block) => any,
    private onMoveBlock: (block: Block, from: number, to: number) => any,
    private onUpdateBlock: (
      block: Block,
      property: string,
      oldValue: any,
      newValue: any
    ) => any,
    private onUpload: (file: any, callback: (url: string) => void) => void,
    private usePlaceholder: boolean = false
  ) {
    this.togglePlaceholderIfNeed();
  }

  public getData(ignoreHtml?: boolean): any {
    const blocksData = [];
    this.blocks.forEach(block => {
      blocksData.push(block.getData(ignoreHtml));
    });
    return blocksData;
  }

  public getHtml(): string {
    const blocksHtml = [];
    this.blocks.forEach(block => {
      blocksHtml.push(block.getHtml(true));
    });

    const $el = $dom.clone(this.$element);
    $el.innerHTML = blocksHtml.join("\n");
    return $el.outerHTML;

    // const html = $('<div></div>').appendChild($el).html();
    // return html;
  }

  public addBlock(
    template: Template,
    data?: BaseField[],
    idx?: number,
    select: boolean = true
  ) {
    const block = new Block(
      template,
      false,
      data,
      block => this.deleteBlock(block),
      block => this.selectBlock(block),
      block => this.deselectBlock(block),
      block => this.copyBlock(block),
      (block, offset) => this.moveBlock(block, offset),
      this.onUpdateBlock,
      this.onUpload
    );

    this.insertBlock(block, idx);

    if (select) {
      block.select();
      block.scrollTo();
    }
  }

  private insertBlock(block: Block, idx?: number) {
    idx = idx || this.blocks.length;
    if (this.selectedBlock) {
      idx = this.blocks.indexOf(this.selectedBlock) + 1;
    }

    this.blocks.splice(idx, 0, block);
    if (idx == 0) {
      // todo: move to block ui
      this.$element.appendChild(block.ui.$editor);
    } else {
      // todo: move to block ui
      $dom.after(this.blocks[idx - 1].ui.$editor, block.ui.$editor);
    }

    this.onAddBlock(block, idx);
    block.select(null);

    this.togglePlaceholderIfNeed();
  }

  private deleteBlock(block: Block) {
    const idx = this.blocks.indexOf(block);
    this.blocks.splice(idx, 1);
    block = null;

    if (idx < this.blocks.length) {
      this.blocks[idx].select();
    } else if (this.blocks.length > 0) {
      this.blocks[idx - 1].select();
    } else {
      this.selectedBlock = null;
    }

    // Trigger event
    this.onDeleteBlock(block, idx);

    this.togglePlaceholderIfNeed();
  }

  private moveBlock(block: Block, offset: number) {
    const idx = this.blocks.indexOf(block);
    const new_idx = idx + offset;

    if (new_idx >= this.blocks.length || new_idx < 0) {
      return;
    }

    const $anchorBlock = this.blocks[new_idx].ui.$editor;
    if (offset > 0) {
      $dom.after($anchorBlock, block.ui.$editor);
    } else if (offset < 0) {
      $dom.before($anchorBlock, block.ui.$editor);
    }

    this.blocks.splice(idx, 1);
    this.blocks.splice(new_idx, 0, block);

    this.onMoveBlock(block, idx, new_idx);

    // Scroll to block
    block.scrollTo();
  }

  private copyBlock(block: Block) {
    const idx = this.blocks.indexOf(block) + 1;
    const copy = this.addBlock(
      block.template,
      block.getData().fields,
      idx,
      true
    );
  }

  private selectBlock(block: Block) {
    if (this.selectedBlock === block) {
      return;
    }

    if (this.selectedBlock) {
      this.selectedBlock.deselect();
    }

    this.selectedBlock = block;
    this.onSelectBlock(block);
  }

  private deselectBlock(block: Block) {
    this.selectedBlock = null;
    this.onDeselectBlock(block);
  }

  private togglePlaceholderIfNeed() {
    if (!this.usePlaceholder) {
      return;
    }

    if (this.blocks.length === 0) {
      if (!this.$placeholder) {
        this.$placeholder = $dom.el(
          '<i data-bre-placeholder="true">Click here to select this container...</i>'
        );
        this.$element.appendChild(this.$placeholder);
      }
    } else if (this.$placeholder) {
      this.$placeholder.remove();
      this.$placeholder = null;
    }
  }
}
