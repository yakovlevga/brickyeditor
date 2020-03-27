import {
  createBlockFromData,
  createBlockFromTemplate,
  toggleBlockSelection,
  getBlockHtml,
  getParentBlocks
} from "@/block/Block";
import { helpers } from "@/helpers";
import { bre } from "@/types/bre";
import { isContainerField, ContainerField } from "@/fields/container";
import { emitter } from "@/emitter";

export const getContainerData = (container: bre.BlocksContainer) =>
  container.blocks.map(block => block.data);

export const getContainerHtml = (container: bre.BlocksContainer) => {
  // TODO: fix it
  const html = container.blocks
    .map(block => getBlockHtml(block, true))
    .join("\n");
  const root: HTMLElement = container.$element.cloneNode(false) as HTMLElement;
  root.innerHTML = html;
  return root.outerHTML;
};

// TODO: add custom placeholder and localization
const defaultPlaceholder = helpers.div(
  "bre-container-placeholder",
  "Click here to select this container"
);

const toggleContainersPlaceholder = (container: bre.BlocksContainer) => {
  if (container.$placeholder === null) {
    return;
  }

  if (container.$element.childElementCount === 0) {
    container.$element.appendChild(container.$placeholder);
  } else {
    container.$placeholder.remove();
  }
};

type AddBlockToContainerOptions = { idx?: number } & (
  | {
      blockTemplate?: undefined;
      blockData: bre.block.BlockData;
    }
  | { blockTemplate: bre.template.Template; blockData?: undefined }
);

export const addBlockToContainer = (
  container: bre.BlocksContainer,
  options: AddBlockToContainerOptions,
  select: boolean
) => {
  const { blocks, selectedBlock } = container;

  const block =
    options.blockData !== undefined
      ? createBlockFromData(container, options.blockData)
      : createBlockFromTemplate(
          container,
          options.blockTemplate.name,
          options.blockTemplate.$template
        );

  let { idx } = options;
  if (idx === undefined) {
    idx =
      selectedBlock !== null
        ? blocks.indexOf(selectedBlock) + 1
        : blocks.length;
  }

  container.blocks = [...blocks.slice(0, idx), block, ...blocks.slice(idx)];

  // Events
  block.on("delete", () => {
    deleteBlock(container, block);
  });

  block.on("clone", () => {
    copyBlock(container, block);
  });

  block.on("move", ev => {
    moveBlock(container, block, ev !== undefined ? ev.offset : 0);
  });

  block.on("select", () => {
    selectBlock(block);
  });

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

  if (select) {
    selectBlock(block);
  }

  return block;
};

export const createRootContainer = (editor: bre.Editor) =>
  createContainer(editor.$element, editor.state, null, editor);
export const createFieldContainer = (field: ContainerField) =>
  createContainer(field.$element, field.parentBlock.state, field, null);

const createContainer = (
  $element: HTMLElement,
  state: bre.EditorState,
  parentContainerField: ContainerField | null,
  parentEditor: bre.Editor | null
): bre.BlocksContainer => {
  const $placeholder = defaultPlaceholder.cloneNode(true) as HTMLElement;

  const eventEmitter = emitter<bre.BlocksContainerEventMap>();
  const container: bre.BlocksContainer = {
    state,
    $element,
    $placeholder,
    blocks: [],
    selectedBlock: null,
    parentContainerField,
    parentEditor,
    ...eventEmitter
  };

  toggleContainersPlaceholder(container);

  $element.onclick = ev => {
    ev.stopPropagation();
    selectContainer(container);
  };

  return container;
};

function deleteBlock(container: bre.BlocksContainer, block: bre.block.Block) {
  if (container.selectedBlock === block) {
    toggleBlockSelection(block, false);
  }

  container.blocks = container.blocks.filter(b => b !== block);
  block.$element.remove();
  (block as any) = null;
}

function copyBlock(container: bre.BlocksContainer, block: bre.block.Block) {
  const idx = container.blocks.indexOf(block) + 1;
  addBlockToContainer(
    container,
    {
      idx,
      blockData: block.data
    },
    true
  );
}

function moveBlock(
  container: bre.BlocksContainer,
  block: bre.block.Block,
  offset: number
) {
  const idx = container.blocks.indexOf(block);
  const new_idx = idx + offset;

  if (new_idx >= container.blocks.length || new_idx < 0) {
    return;
  }

  const $anchorBlock = container.blocks[new_idx].$element;
  if ($anchorBlock) {
    if (offset > 0) {
      helpers.insertAfter($anchorBlock, block.$element);
    } else if (offset < 0) {
      helpers.insertBefore($anchorBlock, block.$element);
    }
  }

  selectBlock(block);
  // showBlockEditor(block);

  container.blocks.splice(idx, 1);
  container.blocks.splice(new_idx, 0, block);

  // this.onMoveBlock(block, idx, new_idx);

  // Scroll to block
  // block.scrollTo();
}

// TODO: container is a block.parentContainer now
export const selectBlock = (block: bre.block.Block) => {
  const container = block.parentContainer;
  if (container.selectedBlock === block) {
    return;
  }

  const parentBlocks = getParentBlocks(block);
  if (
    container.selectedBlock !== null &&
    parentBlocks.indexOf(container.selectedBlock) === -1
  ) {
    toggleBlockSelection(container.selectedBlock, false);
  }

  container.selectedBlock = block;
  toggleBlockSelection(container.selectedBlock, true);
  // selectContainer(container);
};

export const deselectBlock = (block: bre.block.Block) => {
  const container = block.parentContainer;
  toggleBlockSelection(block, false);
  container.selectedBlock = null;
};

// function selectContainer(container: bre.BlocksContainer) {
//   const current = getActiveContainer(container);
//   if (container === current) {
//     return;
//   }

//   if (current !== null) {
//     helpers.toggleClassName(current.$element, "bre-container-selected", false);

//     if (current.selectedBlock !== null) {
//       deselectBlock(current.selectedBlock);
//     }
//   }

//   helpers.toggleClassName(container.$element, "bre-container-selected", true);
// }
