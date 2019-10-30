import { Block } from "src/block/Block";
import { $dom } from "src/common/DOMHelpers";
import { BaseField } from "src/fields/Fields";
import { helpers } from "src/helpers";
import { bre } from "src/types/bre";

export const getContainerData = (
  container: bre.core.IBlocksContainer,
  ignoreHtml?: boolean
) => container.blocks.map(block => block.getData(ignoreHtml));

export const getContainerHtml = (container: bre.core.IBlocksContainer) => {
  const html = container.blocks.map(block => block.getHtml(true)).join("\n");
  const root: HTMLElement = container.$element.cloneNode(false) as HTMLElement;
  root.innerHTML = html;
  return root.outerHTML;
};

// TODO: add custom placeholder and localization
const getDefaultPlaceholder = () =>
  helpers.createElement(
    '<i data-bre-placeholder="true">Click here to select this container...</i>'
  );

const toggleContainerPlaceholderIfNeed = (
  container: bre.core.IBlocksContainer
) => {
  if (container.usePlaceholder !== true) {
    return;
  }

  if (container.$placeholder !== undefined) {
    container.$placeholder.remove();
    container.$placeholder = undefined;
    return;
  }

  if (container.blocks.length === 0) {
    const $placeholder = getDefaultPlaceholder();
    container.$placeholder = $placeholder;
    container.$element.appendChild($placeholder);
  }
};

export class BlocksContainer implements bre.core.IBlocksContainer {
  public $element: HTMLElement;
  public $placeholder?: HTMLElement;
  public usePlaceholder: boolean;
  public blocks: Block[] = [];
  public selectedBlock?: Block;
  public isContainer: boolean = true;

  constructor(
    $element: HTMLElement,
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
    private onUpload: bre.FileUploadHandler,
    usePlaceholder: boolean = false
  ) {
    this.$element = $element;
    this.usePlaceholder = usePlaceholder;

    toggleContainerPlaceholderIfNeed(this);
  }

  public addBlock(
    name: string,
    html: string,
    data?: BaseField[],
    idx?: number,
    select: boolean = true
  ) {
    const block = new Block(name, html, false, data, {
      onDelete: this.deleteBlock,
      onSelect: this.selectBlock,
      onDeselect: this.deselectBlock,
      onCopy: this.copyBlock,
      onMove: (b, offset) => this.moveBlock(b, offset),
      onUpdate: this.onUpdateBlock,
      onUpload: this.onUpload,
    });

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
    if (idx === 0) {
      // todo: move to block ui
      this.$element.appendChild(block.ui.$editor);
    } else {
      // todo: move to block ui
      $dom.after(this.blocks[idx - 1].ui.$editor, block.ui.$editor);
    }

    this.onAddBlock(block, idx);
    block.select(undefined);

    toggleContainerPlaceholderIfNeed(this);
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

    toggleContainerPlaceholderIfNeed(this);
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
    // const copy = this.addBlock(
    this.addBlock(block.name, block.html, block.getData().fields, idx, true);
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
}
