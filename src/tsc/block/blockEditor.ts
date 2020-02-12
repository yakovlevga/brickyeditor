import { bre } from "@/types/bre";

import { BlockEditorStyles } from "./blockEditor.scss";
import { FireFunc, BlockEventMap } from "@/emmiter";
import { helpers } from "@/helpers";

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
