import { bre } from '@/types/bre';
import { helpers } from '@/helpers';
import { iconDelete } from '@/icons/iconDelete';
import { iconCopy } from '@/icons/iconCopy';
import { iconUp } from '@/icons/iconUp';
import { iconDown } from '@/icons/iconDown';
import { deleteBlock, copyBlock, moveBlock } from '@/blocksContainer';

const defaultButtons: bre.block.BlockEditorButton[] = [
  {
    name: 'delete',
    icon: iconDelete,
    onClickHandler: block => deleteBlock(block),
  },
  {
    name: 'clone',
    icon: iconCopy,
    onClickHandler: block => copyBlock(block),
  },
  {
    name: 'up',
    icon: iconUp,
    onClickHandler: block => moveBlock(block, -1),
    getIsDisabledForBlock: block =>
      block.parentContainer.blocks.indexOf(block) === 0,
  },
  {
    name: 'down',
    icon: iconDown,
    onClickHandler: block => moveBlock(block, 1),
    getIsDisabledForBlock: block =>
      block.parentContainer.blocks.indexOf(block) ===
      block.parentContainer.blocks.length - 1,
  },
];

const createEditor = (): bre.block.BlockEditor => {
  const $element = helpers.div('bre-block-editor');

  const buttons = defaultButtons.map(button => {
    const $btn = helpers.div(
      ['bre-block-editor-button', 'bre-icon', 'bre-icon-light'],
      button.icon
    );
    $btn.title = name;
    $element.append($btn);

    return {
      $element: $btn,
      button,
    };
  });

  return {
    $element,
    buttons,
  };
};

const getBlockEditor = (block: bre.block.Block) => {
  if (block.editor === undefined) {
    block.editor = createEditor();

    block.editor.buttons.forEach(({ $element: $btn, button }) => {
      $btn.onclick = ev => {
        ev.stopPropagation();

        if (
          button.getIsDisabledForBlock !== undefined &&
          button.getIsDisabledForBlock(block)
        ) {
          return;
        }

        button.onClickHandler(block);
        updateEditorButtonsState(block);
      };
    });

    block.$element.prepend(block.editor.$element);
  }

  updateEditorButtonsState(block);
  return block.editor;
};

const updateEditorButtonsState = (block: bre.block.Block) => {
  if (block.editor === undefined) {
    return;
  }

  block.editor.buttons
    .filter(({ button }) => Boolean(button.getIsDisabledForBlock))
    .forEach(({ $element: $btn, button }) => {
      const isDisabled = button.getIsDisabledForBlock!(block);
      helpers.toggleClassName(
        $btn,
        'bre-block-editor-button-disabled',
        isDisabled
      );
    });
};

export const showBlockEditor = (block: bre.block.Block, active: boolean) => {
  const editor = getBlockEditor(block);

  helpers.toggleVisibility(editor.$element, true);
  helpers.toggleClassName(
    editor.$element,
    'bre-block-editor-vertical',
    !active
  );

  return editor;
};

export const hideBlockEditor = (block: bre.block.Block) => {
  const { editor } = block;

  if (editor !== undefined) {
    helpers.toggleVisibility(editor.$element, false);
    helpers.toggleClassName(
      editor.$element,
      'bre-block-editor-vertical',
      false
    );
  }
};
