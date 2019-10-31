import { BlockUIAction } from "src/block/BlockUIAction";
import { helpers } from "src/helpers";
import { bre } from "src/types/bre";
import { UI } from "src/ui/UI";

const renderButton = (action: BlockUIAction): HTMLElement => {
  const $el = helpers.createElement(
    `<button type="button" class="bre-btn"><i class="fa fa-${action.icon}"></i></button>`
  );

  if (action.action) {
    $el.onclick = ev => {
      action.action!();
      ev.stopPropagation();
      return false;
    };
  }

  return $el;
};

/**
 * Generate block editor wrapper with block tools.
 */
const buildEditorUI = ($block: HTMLElement, actions: BlockUIAction[]) => {
  const $tools = helpers.createElement(
    '<div class="bre-block-tools bre-btn-deck"></div>'
  );

  actions.forEach(action => {
    const $btn = renderButton(action);
    $tools.appendChild($btn);
  });

  // UI.initBtnDeck($tools);

  const $editor = helpers.createElement(
    '<div class="bre-block-wrapper"></div>'
  );
  $editor.appendChild($tools);
  $editor.appendChild($block);

  $editor.addEventListener("mouseover", () => {
    $editor.classList.add("bre-active");
  });

  $editor.addEventListener("mouseout", () => {
    $editor.classList.remove("bre-active");
  });

  return $editor;
};

// TODO: events
export const getBlockUI = ($html: HTMLElement, actions: BlockUIAction[]) => {
  const $editor = buildEditorUI($html, []);
  // TODO: Block events binding
  // $editor.on("click", )
  return $editor;
};

export class BlockUI {
  public $editor?: HTMLElement; // block editor
  public $tools?: HTMLElement; // block tools
  public $block: HTMLElement; // block

  private onSelect?: () => void;

  constructor(
    $block: HTMLElement,
    preview: boolean,
    actions: BlockUIAction[],
    onSelect?: () => void
  ) {
    this.$block = $block;
    this.onSelect = onSelect;

    // When we call constructor for templates previews, we pass null editor.
    if (!preview) {
      this.buildEditorUI(actions);
    }
  }

  public delete() {
    if (this.$editor) {
      this.$editor.remove();
    }
  }

  public toggleSelection(isOn: boolean) {
    if (this.$editor) {
      this.$editor.classList.toggle("bre-selected", isOn);
    }
  }

  /**
   * Generate block editor wrapper with block tools.
   */
  private buildEditorUI(actions: BlockUIAction[]) {
    this.$tools = helpers.createElement(
      '<div class="bre-block-tools bre-btn-deck"></div>'
    );
    actions.forEach(action => {
      const $btn = renderButton(action);
      this.$tools!.appendChild($btn);
    });
    UI.initBtnDeck(this.$tools);

    this.$editor = helpers.createElement(
      '<div class="bre-block-wrapper"></div>'
    );
    this.$editor.appendChild(this.$tools);
    this.$editor.appendChild(this.$block);

    this.$editor.addEventListener("mouseover", () => {
      this.$editor!.classList.add("bre-active");
    });

    this.$editor.addEventListener("mouseout", () => {
      this.$editor!.classList.remove("bre-active");
    });

    this.$editor.addEventListener("click", () => {
      if (this.onSelect) {
        this.onSelect();
      }
    });
  }
}
