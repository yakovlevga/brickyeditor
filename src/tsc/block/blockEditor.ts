import { bre } from "src/types/bre";

import { BlockEditorStyles } from "./blockEditor.scss";
import { FireFunc, BlockEventMap } from "src/emmiter";
import { helpers } from "src/helpers";

type BlockEditorButton = {
  name: string;
  icon: string;
  action: (ff: FireFunc<BlockEventMap>) => void;
};

const defaultButtons: BlockEditorButton[] = [
  {
    name: "delete",
    icon: "<span>D</span>",
    action: ff => ff("delete")
  },
  {
    name: "clone",
    icon: "<span>C</span>",
    action: ff => ff("clone")
  },
  {
    name: "up",
    icon: "<span>▲</span>",
    action: ff => ff("move", { offset: -1 })
  },
  {
    name: "down",
    icon: "<span>▼</span>",
    action: ff => ff("move", { offset: 1 })
  }
];

type BlockEditor = {
  $element: HTMLDivElement;
  btns: {
    $btn: HTMLDivElement;
    action: BlockEditorButton["action"];
  }[];
};

let control: BlockEditor;

function createEditor() {
  const $element = helpers.div<BlockEditorStyles>("bre-block-editor");

  const btns = defaultButtons.map(btn => {
    const { action, icon, name } = btn;
    const $btn = helpers.div<BlockEditorStyles>(
      "bre-block-editor-button",
      icon
    );
    $btn.title = name;
    $element.append($btn);

    return {
      $btn,
      action
    };
  });

  return {
    $element,
    btns
  };
}

export const showBlockEditor = (block: bre.core.block.Block) => {
  if (control === undefined) {
    control = createEditor();
  }

  // control.$element.style.top = top + "px";
  // control.$element.style.left = left + "px";

  console.log({
    top: control.$element.style.top,
    left: control.$element.style.left
  });

  control.btns.forEach(({ $btn, action }) => {
    $btn.onclick = () => action(block.fire);
  });

  block.$element.insertAdjacentElement("beforebegin", control.$element);
};

export const hideBlockEditor = () => {
  if (control !== undefined) {
    control.$element.remove();
  }
};
