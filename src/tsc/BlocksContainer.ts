import { Block } from "src/block/Block";
import { $dom } from "src/common/DOMHelpers";
import { BaseField } from "src/Fields/Fields";
import { Template } from "src/templates/Template";
import { bre } from "src/Types/bre";

const getData = (container: bre.core.IBlocksContainer, ignoreHtml?: boolean) =>
  container.blocks.map(block => block.getData(ignoreHtml));

const getHtml = (container: bre.core.IBlocksContainer) => {
  const html = container.blocks.map(block => block.getHtml(true)).join("\n");
  const root: HTMLElement = container.$element.cloneNode(false) as HTMLElement;
  root.innerHTML = html;
  return root.outerHTML;
};

export class BlocksContainer implements bre.core.IBlocksContainer {
  public $element: HTMLElement;
  public blocks: Block[] = [];
  public selectedBlock: Block;
  public isContainer: boolean = true;
  public $placeholder: HTMLElement;

  constructor(
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
    private usePlaceholder: boolean = false
  ) {
    this.togglePlaceholderIfNeed();
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
    if (idx === 0) {
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

export const blocksContainer = { getData, getHtml };

// type BlocksContainerProps = {
//   $element: HTMLElement;
//   $placeholder?: HTMLElement;
// };

// const insertBlock = (
//   container: IBlocksContainer,
//   block: Block,
//   idx?: number
// ) => {
//   const { blocks, selectedBlock } = container;

//   if (idx === undefined) {
//     idx = container.selectedBlock
//       ? blocks.indexOf(selectedBlock) + 1
//       : blocks.length;
//   }

//   // todo: insert block ()
//   // todo: select block
//   return [...blocks].splice(idx, 0, block);

//   // if (idx === 0) {
//   //   // todo: move to block ui
//   //   $element.appendChild(block.ui.$editor);
//   // } else {
//   //   // todo: move to block ui
//   //   $dom.after(this.blocks[idx - 1].ui.$editor, block.ui.$editor);
//   // }

//   // this.onAddBlock(block, idx);
//   // block.select(null);

//   // this.togglePlaceholderIfNeed();
// };

// const blocksContainer = ({
//   $element,
//   $placeholder,
// }: BlocksContainerProps): IBlocksContainer => {
//   const blocks: Block[] = [];
//   let selectedBlock: Block | null = null;

//   // return {
//   //   getData,
//   //   getHtml
//   // }
// };
