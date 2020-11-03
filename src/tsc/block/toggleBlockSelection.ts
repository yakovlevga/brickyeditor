import { showBlockEditor, hideBlockEditor } from '@/block/blockEditor';
import { bre } from '@/types/bre';
import { helpers } from '@/helpers';

export const toggleBlockSelection = (
  block: bre.block.Block,
  selected: boolean,
  active: boolean = false
) => {
  block.selected = selected;
  helpers.toggleClassName(block.$element, 'bre-block-selected', selected);

  if (selected) {
    showBlockEditor(block, active);
  } else {
    hideBlockEditor(block);
  }
};
