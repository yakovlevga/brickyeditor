import { bre } from "./types/bre";
import { toggleBlockSelection } from "./block/Block";
import { toggleFieldSelection } from "./fields/field";
import { isContainerField } from "./fields/container";

export const getInitialState = (): bre.EditorState => ({
  selectedField: null,
  selectedBlocks: [],
  selectedContainers: []
});

export const selectField = (selectedField: bre.field.FieldBase) => {
  const state = selectedField.parentBlock.state;

  if (state.selectedField === selectedField) {
    return;
  }

  const prevSelectedField = state.selectedField;
  if (prevSelectedField !== null) {
    toggleFieldSelection(prevSelectedField, false, true);
    // prevSelectedField.fire('blur');
  }

  if (isContainerField(selectedField)) {
    selectBlock(selectedField.parentBlock, false);
    selectContainer(selectedField.container);
  } else {
    selectBlock(selectedField.parentBlock);
  }

  state.selectedField = selectedField;
};

export const selectBlock = (
  selectedBlock: bre.block.Block,
  triggerSelectContainer: boolean = true
) => {
  const state = selectedBlock.state;

  if (state.selectedBlocks[0] === selectedBlock) {
    return;
  }

  state.selectedField = null;

  const prevSelectedBlocks = state.selectedBlocks;
  const selectedBlocks = getParentBlocks(selectedBlock);

  state.selectedBlocks = selectedBlocks;

  if (prevSelectedBlocks.length > 0) {
    prevSelectedBlocks.forEach(block => {
      toggleBlockSelection(block, false);
    });
  }

  selectedBlocks.forEach((block, idx) => {
    if (!block.selected) {
      toggleBlockSelection(block, true, idx === 0);
    }
  });

  if (triggerSelectContainer) {
    selectContainer(selectedBlock.parentContainer);
  }
};

const getParentBlocks = (
  block: bre.block.Block,
  blocks: bre.block.Block[] = []
): bre.block.Block[] => {
  blocks.push(block);

  const parentContainerField = block.parentContainer.parentContainerField;
  if (parentContainerField !== null) {
    return getParentBlocks(parentContainerField.parentBlock, blocks);
  }

  return blocks;
};

export const selectContainer = (selectedContainer: bre.BlocksContainer) => {
  const state = selectedContainer.state;

  const selectedContainers = getParentContainers(selectedContainer);
  state.selectedContainers = selectedContainers;
};

const getParentContainers = (
  container: bre.BlocksContainer
): bre.BlocksContainer[] => {
  if (container.parentContainerField !== null) {
    const blocks = getParentBlocks(container.parentContainerField.parentBlock);
    return [container, ...blocks.map(block => block.parentContainer)];
  }

  return [container];
};
