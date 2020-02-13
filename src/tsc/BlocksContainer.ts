import {
  createBlockFromData,
  createBlockFromTemplate,
  toggleBlockSelection
} from "@/block/Block";
import { helpers } from "@/helpers";
import { bre } from "@/types/bre";
import { showBlockEditor } from "@/block/blockEditor";
import { ContainerField } from "@/fields/container";

export const getContainerData = (container: bre.BlocksContainer) =>
  container.blocks.map(block => block.data);

export const getContainerHtml = (container: bre.BlocksContainer) => {
  // TODO: fix it
  const html = container.blocks.map(block => block.getHtml(true)).join("\n");
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
  if (selectedField.data.type === "container") {
    const containerField = selectedField as ContainerField;
    return getActiveContainer(containerField.container);
  }

  return container;
};

// TODO: add custom placeholder and localization
const getDefaultPlaceholder = () =>
  helpers.createElement(
    `<div style="min-height: 100px; display: flex; align-items: center; justify-content: center; font-weight: 700; cursor: pointer;">
      <div data-bre-placeholder="true">Click here to select this container</div>
    </div>`
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
  options: AddBlockToContainerOptions
) => {
  const { blocks, selectedBlock } = container;

  const block =
    options.blockData !== undefined
      ? createBlockFromData(options.blockData)
      : createBlockFromTemplate(
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

  $block.addEventListener("click", () => {
    selectBlock(container, block);
  });

  // TODO: select block on add
  selectBlock(container, block);

  return block;

  // TODO: select block
  // if (select) {
  //   block.select();
  //   block.scrollTo();
  // }
};

function selectBlock(container: bre.BlocksContainer, block: bre.block.Block) {
  if (container.selectedBlock !== null) {
    toggleBlockSelection(container.selectedBlock, false);
  }

  container.selectedBlock = block;
  toggleBlockSelection(container.selectedBlock, true);
}

// TODO: check this later
// export const getSelectedBlockInContainer = (
//   container: bre.BlocksContainer
// ) => container.blocks.find(b => !!b.selectedField);

export const createContainer = (
  $element: HTMLElement,
  usePlaceholder: boolean
): bre.BlocksContainer => {
  const $placeholder = usePlaceholder ? getDefaultPlaceholder() : null;

  const container: bre.BlocksContainer = {
    $element,
    $placeholder,
    blocks: [],
    selectedBlock: null
  };

  toggleContainersPlaceholder(container);

  return container;
};

export const deleteBlock = (
  container: bre.BlocksContainer,
  block: bre.block.Block
) => {
  if (container.selectedBlock === block) {
    toggleBlockSelection(block, false);
  }

  container.blocks = container.blocks.filter(b => b !== block);
  block.$element.remove();
  (block as any) = null;
};

export const copyBlock = (
  container: bre.BlocksContainer,
  block: bre.block.Block
) => {
  const idx = container.blocks.indexOf(block) + 1;
  addBlockToContainer(container, {
    idx,
    blockData: block.data
  });
};

export const moveBlock = (
  container: bre.BlocksContainer,
  block: bre.block.Block,
  offset: number
) => {
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
};
