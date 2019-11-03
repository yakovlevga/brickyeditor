import { createBlockFromData, createBlockFromTemplate } from "src/block/Block";
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

export const getActiveContainer = (
  container: bre.core.IBlocksContainer
): bre.core.IBlocksContainer => {
  if (
    container.selectedBlock === null ||
    container.selectedBlock.selectedField === null
  ) {
    return container;
  }

  const { selectedField } = container.selectedBlock;
  if (selectedField.type === "container") {
    const containerField = selectedField as bre.core.field.ContainerField;
    return getActiveContainer(containerField.container);
  }

  return container;
};

// TODO: add custom placeholder and localization
const getDefaultPlaceholder = () =>
  helpers.createElement(
    '<i data-bre-placeholder="true">Click here to select this container...</i>'
  );

const toggleContainersPlaceholder = (container: bre.core.IBlocksContainer) => {
  if (container.$placeholder === null) {
    return;
  }

  if (container.$element.childElementCount === 0) {
    container.$element.appendChild(container.$placeholder);
  } else {
    container.$element.removeChild(container.$placeholder);
  }
};

type AddBlockToContainerOptions = { idx?: number } & (
  | {
      blockTemplate?: undefined;
      blockData: bre.core.block.BlockData;
    }
  | { blockTemplate: bre.core.ITemplate; blockData?: undefined });

export const addBlockToContainer = (
  container: bre.core.IBlocksContainer,
  options: AddBlockToContainerOptions
) => {
  const { blocks, selectedBlock } = container;

  const block =
    options.blockData !== undefined
      ? createBlockFromData(options.blockData)
      : createBlockFromTemplate(options.blockTemplate);

  let { idx } = options;
  if (idx === undefined) {
    idx =
      selectedBlock !== null
        ? blocks.indexOf(selectedBlock) + 1
        : blocks.length;
  }

  container.blocks = [...blocks.slice(0, idx), block, ...blocks.slice(idx)];

  // UI
  toggleContainersPlaceholder(container);

  const { $element: $container } = container;
  const { $element: $block } = block;

  if (idx === 0) {
    $container.append($block);
  } else {
    const $prevBlock = blocks[idx - 1].$element;
    $prevBlock.after($block);
  }

  return block;

  // TODO: select block
  // if (select) {
  //   block.select();
  //   block.scrollTo();
  // }
};

// TODO: check this later
// export const getSelectedBlockInContainer = (
//   container: bre.core.IBlocksContainer
// ) => container.blocks.find(b => !!b.selectedField);

export const createContainer = (
  $element: HTMLElement,
  usePlaceholder: boolean
): bre.core.IBlocksContainer => {
  const $placeholder = usePlaceholder ? getDefaultPlaceholder() : null;

  const container: bre.core.IBlocksContainer = {
    $element,
    $placeholder,
    blocks: [],
    selectedBlock: null,
  };

  toggleContainersPlaceholder(container);

  return container;
};

// export class BlocksContainer {
//   // public $element: HTMLElement;
//   // public $placeholder?: HTMLElement;
//   // public usePlaceholder: boolean;
//   public blocks: Block[] = [];
//   public selectedBlock?: Block;
//   public isContainer: boolean = true;

//   // constructor(
//   //   $element: HTMLElement,
//   //   private onAddBlock: (block: Block, idx: number) => any,
//   //   private onDeleteBlock: (block: Block, idx: number) => any,
//   //   private onSelectBlock: (block: Block) => any,
//   //   private onDeselectBlock: (block: Block) => any,
//   //   private onMoveBlock: (block: Block, from: number, to: number) => any,
//   //   private onUpdateBlock: (
//   //     block: Block,
//   //     property: string,
//   //     oldValue: any,
//   //     newValue: any
//   //   ) => any,
//   //   private onUpload?: bre.FileUploadHandler,
//   //   usePlaceholder: boolean = false
//   // ) {
//   //   this.$element = $element;
//   //   this.usePlaceholder = usePlaceholder;

//   //   toggleContainerPlaceholderIfNeed(this);
//   // }

//   public addBlock(
//     name: string,
//     html: string,
//     data?: bre.core.field.Field[],
//     idx?: number,
//     select: boolean = true
//   ) {
//     const block = new Block(name, html, false, data, {
//       onDelete: this.deleteBlock,
//       onSelect: this.selectBlock,
//       onDeselect: this.deselectBlock,
//       onCopy: this.copyBlock,
//       onMove: (b, offset) => this.moveBlock(b, offset),
//       onUpdate: this.onUpdateBlock,
//       onUpload: this.onUpload,
//     });

//     this.insertBlock(block, idx);

//     if (select) {
//       block.select();
//       block.scrollTo();
//     }
//   }

//   public insertBlock(block: Block, idx?: number) {
//     idx = idx || this.blocks.length;
//     if (this.selectedBlock) {
//       idx = this.blocks.indexOf(this.selectedBlock) + 1;
//     }

//     this.blocks.splice(idx, 0, block);
//     if (idx === 0) {
//       // todo: move to block ui
//       this.$element.appendChild(block.ui.$editor!);
//     } else {
//       // todo: move to block ui
//       $dom.after(this.blocks[idx - 1].ui.$editor!, block.ui.$editor!);
//     }

//     this.onAddBlock(block, idx);
//     block.select(undefined);

//     toggleContainersPlaceholder(this);
//   }

//   private deleteBlock(block: Block) {
//     const idx = this.blocks.indexOf(block);
//     this.blocks.splice(idx, 1);
//     (block as any) = null;

//     if (idx < this.blocks.length) {
//       this.blocks[idx].select();
//     } else if (this.blocks.length > 0) {
//       this.blocks[idx - 1].select();
//     } else {
//       this.selectedBlock = undefined;
//     }

//     // Trigger event
//     this.onDeleteBlock(block, idx);

//     toggleContainersPlaceholder(this);
//   }

//   private moveBlock(block: Block, offset: number) {
//     const idx = this.blocks.indexOf(block);
//     const new_idx = idx + offset;

//     if (new_idx >= this.blocks.length || new_idx < 0) {
//       return;
//     }

//     const $anchorBlock = this.blocks[new_idx].ui.$editor;
//     if ($anchorBlock) {
//       if (offset > 0) {
//         $dom.after($anchorBlock, block.ui.$editor!);
//       } else if (offset < 0) {
//         $dom.before($anchorBlock, block.ui.$editor!);
//       }
//     }

//     this.blocks.splice(idx, 1);
//     this.blocks.splice(new_idx, 0, block);

//     this.onMoveBlock(block, idx, new_idx);

//     // Scroll to block
//     block.scrollTo();
//   }

//   private copyBlock(block: Block) {
//     const idx = this.blocks.indexOf(block) + 1;
//     // const copy = this.addBlock(
//     this.addBlock(
//       block.template,
//       block.html,
//       block.getData().fields,
//       idx,
//       true
//     );
//   }

//   private selectBlock(block: Block) {
//     if (this.selectedBlock === block) {
//       return;
//     }

//     if (this.selectedBlock) {
//       this.selectedBlock.deselect();
//     }

//     this.selectedBlock = block;
//     this.onSelectBlock(block);
//   }

//   private deselectBlock(block: Block) {
//     this.selectedBlock = undefined;
//     this.onDeselectBlock(block);
//   }
// }
