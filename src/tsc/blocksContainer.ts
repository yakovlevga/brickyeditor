import {
  createBlockFromData,
  createBlockFromTemplate,
  toggleBlockSelection,
  getBlockHtml
} from "@/block/Block";
import { helpers } from "@/helpers";
import { bre } from "@/types/bre";
import { showBlockEditor } from "@/block/blockEditor";
import { ContainerField, isContainerField } from "@/fields/container";
import { emitter } from "@/emitter";
import { state } from "@/state";

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

export const getActiveContainer = (
  container: bre.BlocksContainer
): bre.BlocksContainer => {
  if (
    container.selectedBlock === null ||
    container.selectedBlock.selectedField === null
  ) {
    return container;
  }

  const { selectedField } = container.selectedBlock;
  if (isContainerField(selectedField)) {
    return getActiveContainer(selectedField.container);
  }

  return container;
};

export const getSelectedBlocksChain = (
  container: bre.BlocksContainer,
  chain: bre.block.Block[] = []
): bre.block.Block[] => {
  const { selectedBlock } = container;
  if (selectedBlock === null || selectedBlock.selectedField === null) {
    return chain;
  }

  const { selectedField } = selectedBlock;
  if (isContainerField(selectedField)) {
    return getSelectedBlocksChain(selectedField.container, [
      ...chain,
      selectedBlock
    ]);
  }

  return chain;
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
    selectBlock(container, block);
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
    selectBlock(container, block);
  }

  return block;
};

export const createContainer = (
  $element: HTMLElement,
  usePlaceholder: boolean
): bre.BlocksContainer => {
  const $placeholder = usePlaceholder
    ? (defaultPlaceholder.cloneNode(true) as HTMLElement)
    : null;

  const eventEmitter = emitter<bre.BlocksContainerEventMap>();
  const container: bre.BlocksContainer = {
    ...eventEmitter,
    $element,
    $placeholder,
    blocks: [],
    selectedBlock: null,
    parentContainerField: null
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

  showBlockEditor(block);

  container.blocks.splice(idx, 1);
  container.blocks.splice(new_idx, 0, block);

  // this.onMoveBlock(block, idx, new_idx);

  // Scroll to block
  // block.scrollTo();
}

function selectBlock(container: bre.BlocksContainer, block: bre.block.Block) {
  if (container.selectedBlock === block) {
    return;
  }

  if (container.selectedBlock !== null) {
    toggleBlockSelection(container.selectedBlock, false);
  }

  container.selectedBlock = block;
  toggleBlockSelection(container.selectedBlock, true);
  selectContainer(container);
}

function deselectBlock(container: bre.BlocksContainer) {
  if (container.selectedBlock !== null) {
    toggleBlockSelection(container.selectedBlock, false);
    container.selectedBlock = null;
  }
}

const selectedClassName: BreStyles = "bre-container-selected";
function selectContainer(container: bre.BlocksContainer) {
  const current = state.getSelectedContainer();
  if (container === current) {
    return;
  }

  if (current !== null) {
    current.$element.classList.remove(selectedClassName);
    deselectBlock(current);
  }

  state.setSelectedContainer(container);
  container.$element.classList.add(selectedClassName);
}
