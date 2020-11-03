import { helpers } from '@/helpers';
import { bre } from '@/types/bre';
import { selectBlock, resetState, selectField } from '@/state/editorState';
import { iconContainer } from '@/icons/iconContainer';
import { getTemplate } from '@/template';
import { createBlockFromTemplate } from '@/block/createBlockFromTemplate';

export const getContainerData = (container: bre.BlocksContainer) =>
  container.blocks.map(block => block.data);

const defaultContainerPlaceholder = helpers.div(
  [
    'bre-field-placeholder',
    'bre-container-placeholder',
    'bre-icon',
    'bre-icon-32',
  ],
  iconContainer
);

export const getContainerPlaceholder = (preview: boolean) => {
  const $placeholder = defaultContainerPlaceholder.cloneNode(
    true
  ) as HTMLElement;

  if (preview) {
    helpers.toggleClassName($placeholder, 'bre-container-placeholder', false);
  }

  return $placeholder;
};

const toggleContainersPlaceholder = (container: bre.BlocksContainer) => {
  if (container.$placeholder === null) {
    container.$placeholder = getContainerPlaceholder(false);
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
  { idx, blockData, blockTemplate }: AddBlockToContainerOptions,
  select: boolean
) => {
  const { blocks, selectedBlock } = container;

  const template =
    blockData !== undefined ? getTemplate(blockData.template) : blockTemplate;

  if (template === undefined) {
    throw new Error(`Template is undefined`);
  }

  const { name, $template } = template;
  const block = createBlockFromTemplate(container, name, $template);

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

  if (select) {
    selectBlock(block);
  }

  container.editor.fire('blockAdd', { sender: block });

  return block;
};

export const createRootContainer = (editor: bre.Editor) =>
  createContainer(editor);
export const createFieldContainer = (
  field: bre.field.container.ContainerField
) => createContainer(field.parentBlock.parentContainer.editor, field);

const createContainer = (
  editor: bre.Editor,
  parentContainerField: bre.field.container.ContainerField | null = null
): bre.BlocksContainer => {
  const $element =
    parentContainerField !== null
      ? parentContainerField.$element
      : editor.$element;
  const container: bre.BlocksContainer = {
    editor,
    $element,
    blocks: [],
    $placeholder: null,
    selectedBlock: null,
    parentContainerField,
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
      resetState(container.editor.state);
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
      blockData: block.data,
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
