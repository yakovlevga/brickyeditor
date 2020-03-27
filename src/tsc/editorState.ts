import { bre } from "./types/bre";
import { toggleBlockSelection } from "./block/Block";

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
    prevSelectedField.parentBlock.selectedField = null;
    // prevSelectedField.fire('blur');
  }

  state.selectedField = selectedField;
  selectedField.parentBlock.selectedField = selectedField;
  selectBlock(selectedField.parentBlock);
};

export const selectBlock = (selectedBlock: bre.block.Block) => {
  const state = selectedBlock.state;

  if (state.selectedBlocks[0] === selectedBlock) {
    return;
  }

  const prevSelectedBlocks = state.selectedBlocks;
  const selectedBlocks = getParentBlocks(selectedBlock);

  state.selectedBlocks = selectedBlocks;

  if (prevSelectedBlocks.length > 0) {
    prevSelectedBlocks.forEach((block, idx) => {
      if (selectedBlocks.indexOf(block) === -1) {
        toggleBlockSelection(block, false, idx === 0);
      }
    });
  }

  selectedBlocks.forEach((block, idx) => {
    if (!block.selected) {
      toggleBlockSelection(block, true, idx === 0);
    }
  });

  selectContainer(selectedBlock.parentContainer);
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
