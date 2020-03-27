import { bre } from "./types/bre";
import { selectBlock, deselectBlock } from "./blocksContainer";

export const getInitialState = (): bre.EditorState => ({
  selectedField: null,
  selectedBlocks: []
});

export const selectField = (selectedField: bre.field.FieldBase) => {
  const state = selectedField.parentBlock.state;

  if (state.selectedField === selectedField) {
    return;
  }

  const prevSelectedBlocks = state.selectedBlocks;
  const prevSelectedField = state.selectedField;

  const selectedBlocks = getParentBlocks(selectedField);

  state.selectedField = selectedField;
  state.selectedBlocks = selectedBlocks;

  if (prevSelectedBlocks !== null) {
    prevSelectedBlocks.forEach(x => {
      if (selectedBlocks.indexOf(x) === -1) {
        deselectBlock(x);
      }
    });
  }

  selectedBlocks.forEach(x => {
    if (!x.selected) {
      selectBlock(x);
    }
  });

  if (prevSelectedField !== null) {
    prevSelectedField.parentBlock.selectedField = null;
    // prevSelectedField.fire('blur');
    // prevSelectedField.parentBlock.fire('blur');
  }

  selectedField.parentBlock.fire("select");
  selectedField.parentBlock.selectedField = selectedField;
};

const getParentBlocks = (
  field: bre.field.FieldBase,
  blocks: bre.block.Block[] = []
): bre.block.Block[] => {
  const block = field.parentBlock;
  blocks.push(block);

  const parentContainerField = block.parentContainer.parentContainerField;
  if (parentContainerField !== null) {
    return getParentBlocks(parentContainerField, blocks);
  }

  return blocks;
};
