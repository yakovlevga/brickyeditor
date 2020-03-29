import {
  createBlockFromData,
  createBlockFromTemplate,
  getBlockHtml
} from "@/block/Block";
import { helpers } from "@/helpers";
import { bre } from "@/types/bre";
import { ContainerField } from "@/fields/container";
import { selectBlock, resetState, selectField } from "@/editorState";
import { iconContainer } from "@/icons/iconContainer";

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

const defaultContainerPlaceholder = helpers.div(
  ["bre-container-placeholder", "bre-icon", "bre-icon-32"],
  iconContainer
);

export const getContainerPlaceholder = () =>
  defaultContainerPlaceholder.cloneNode(true) as HTMLElement;

const toggleContainersPlaceholder = (container: bre.BlocksContainer) => {
  if (container.$placeholder === null) {
    container.$placeholder = getContainerPlaceholder();
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
  // block.on("delete", () => {
  //   deleteBlock(container, block);
  // });

  // block.on("clone", () => {
  //   copyBlock(container, block);
  // });

  // block.on("move", ev => {
  //   moveBlock(container, block, ev !== undefined ? ev.offset : 0);
  // });

  // block.on("select", () => {
  //   selectBlock(block);
  // });

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
  const container: bre.BlocksContainer = {
    state,
    $element,
    blocks: [],
    $placeholder: null,
    selectedBlock: null,
    parentContainerField,
    parentEditor
  };

  toggleContainersPlaceholder(container);

  return container;
};

export const deleteBlock = (block: bre.block.Block) => {
  const container = block.parentContainer;
  const blockIdx = container.blocks.indexOf(block);

  container.blocks = container.blocks.filter(b => b !== block);
  block.$element.remove();

  if (container.blocks.length === 0) {
    toggleContainersPlaceholder(container);
    if (container.parentContainerField !== null) {
      selectField(container.parentContainerField);
    } else {
      resetState(container.state);
    }
  } else if (container.blocks.length > blockIdx) {
    selectBlock(container.blocks[blockIdx]);
  } else {
    selectBlock(container.blocks[blockIdx - 1]);
  }

  // TODO: destroy to unsubcrive all events?
  (block as any) = null;
};

export const copyBlock = (block: bre.block.Block) => {
  const container = block.parentContainer;
  const idx = container.blocks.indexOf(block) + 1;
  addBlockToContainer(
    container,
    {
      idx,
      blockData: block.data
    },
    true
  );
};

export const moveBlock = (block: bre.block.Block, offset: number) => {
  const { $element, parentContainer } = block;

  if ($element.parentElement === null) {
    return;
  }

  const idx = parentContainer.blocks.indexOf(block);
  const new_idx = idx + offset;

  if (new_idx >= parentContainer.blocks.length || new_idx < 0) {
    return;
  }

  const $referenceElement = parentContainer.blocks[new_idx].$element;
  if ($referenceElement) {
    if (offset > 0) {
      $element.parentElement.insertBefore($referenceElement, $element);
    } else if (offset < 0) {
      $element.parentElement.insertBefore($element, $referenceElement);
    }
  }

  // showBlockEditor(block);

  parentContainer.blocks.splice(idx, 1);
  parentContainer.blocks.splice(new_idx, 0, block);

  // this.onMoveBlock(block, idx, new_idx);

  // Scroll to block
  // block.scrollTo();
  //debugger;
  // selectBlock(block);
};

// export const deselectBlock = (block: bre.block.Block) => {
//   const container = block.parentContainer;
//   toggleBlockSelection(block, false);
//   container.selectedBlock = null;
// };

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
