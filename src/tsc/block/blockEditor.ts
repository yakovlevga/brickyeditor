import { bre } from "@/types/bre";
import { helpers } from "@/helpers";
import { iconDelete } from "@/icons/iconDelete";
import { iconCopy } from "@/icons/iconCopy";
import { iconUp } from "@/icons/iconUp";
import { iconDown } from "@/icons/iconDown";
import { deleteBlock, copyBlock, moveBlock } from "@/blocksContainer";

const defaultButtons: bre.block.BlockEditorButton[] = [
  {
    name: "delete",
    icon: iconDelete,
    action: block => deleteBlock(block)
  },
  {
    name: "clone",
    icon: iconCopy,
    action: block => copyBlock(block)
  },
  {
    name: "up",
    icon: iconUp,
    action: block => moveBlock(block, -1),
    disabled: block => block.parentContainer.blocks.indexOf(block) === 0
  },
  {
    name: "down",
    icon: iconDown,
    action: block => moveBlock(block, 1),
    disabled: block =>
      block.parentContainer.blocks.indexOf(block) ===
      block.parentContainer.blocks.length - 1
  }
];

const createEditor = (): bre.block.BlockEditor => {
  const $element = helpers.div("bre-block-editor");

  const buttons = defaultButtons.map(button => {
    const $btn = helpers.div(
      ["bre-block-editor-button", "bre-icon", "bre-icon-light"],
      button.icon
    );
    $btn.title = name;
    $element.append($btn);

    return {
      $element: $btn,
      button
    };
  });

  return {
    $element,
    buttons
  };
};

const setupBlockEditor = (block: bre.block.Block) => {
  if (block.blockEditor === undefined) {
    block.blockEditor = createEditor();

    block.blockEditor.buttons.forEach(({ $element: $btn, button }) => {
      $btn.onclick = ev => {
        ev.stopPropagation();

        if (button.disabled !== undefined && button.disabled(block)) {
          return;
        }

        button.action(block);
        checkButtonsState(block);
      };
    });

    block.$element.prepend(block.blockEditor.$element);
  }

  checkButtonsState(block);
  return block.blockEditor;
};

const checkButtonsState = (block: bre.block.Block) => {
  if (block.blockEditor) {
    block.blockEditor.buttons.forEach(({ $element: $btn, button }) => {
      if (button.disabled !== undefined) {
        const disabled = button.disabled(block);
        helpers.toggleClassName(
          $btn,
          "bre-block-editor-button-disabled",
          disabled
        );
      }
    });
  }
};

export const showBlockEditor = (block: bre.block.Block, active: boolean) => {
  const editor = setupBlockEditor(block);
  helpers.toggleVisibility(editor.$element, true);
  helpers.toggleClassName(
    editor.$element,
    "bre-block-editor-vertical",
    !active
  );
  return editor;
};

export const hideBlockEditor = (block: bre.block.Block) => {
  const { blockEditor: editor } = block;
  if (editor !== undefined) {
    helpers.toggleVisibility(editor.$element, false);
    helpers.toggleClassName(
      editor.$element,
      "bre-block-editor-vertical",
      false
    );
  }
};
