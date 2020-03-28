import { bre } from "@/types/bre";
import { helpers } from "@/helpers";
import { iconDelete } from "@/icons/iconDelete";
import { iconCopy } from "@/icons/iconCopy";
import { iconUp } from "@/icons/iconUp";
import { iconDown } from "@/icons/iconDown";

const defaultButtons: bre.block.BlockEditorButton[] = [
  {
    name: "delete",
    icon: iconDelete,
    action: ff => ff("delete")
  },
  {
    name: "clone",
    icon: iconCopy,
    action: ff => ff("clone")
  },
  {
    name: "up",
    icon: iconUp,
    action: ff => ff("move", { offset: -1 }),
    visibility: block => block.parentContainer.blocks.indexOf(block) !== 0
  },
  {
    name: "down",
    icon: iconDown,
    action: ff => ff("move", { offset: 1 }),
    visibility: block =>
      block.parentContainer.blocks.indexOf(block) !==
      block.parentContainer.blocks.length - 1
  }
];

const createEditor = (): bre.block.BlockEditor => {
  const $element = helpers.div("bre-block-editor");

  const buttons = defaultButtons.map(button => {
    const $btn = helpers.div("bre-block-editor-button", button.icon);
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
      $btn.onclick = () => button.action(block.fire);
    });

    block.$element.prepend(block.blockEditor.$element);
  }

  block.blockEditor.buttons.forEach(({ $element: $btn, button }) => {
    if (button.visibility !== undefined) {
      const visible = button.visibility(block);
      helpers.toggleVisibility($btn, visible);
    }
  });

  return block.blockEditor;
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
