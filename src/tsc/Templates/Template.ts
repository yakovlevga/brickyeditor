import { Block } from "src/block/Block";
import { $dom } from "src/common/DOMHelpers";
import { helpers } from "src/helpers";
import { bre } from "src/Types/bre";
import { Selectors } from "src/ui/Selectors";

export const getTemplatePreview = (template: bre.core.ITemplate) => {
  const $template = helpers.createElement(
    `<div class='${Selectors.classTemplate}'></div>`
  );
  $template.appendChild(template.$preview);
  return $template;
};

export class Template {
  public name: string;
  public loaded: boolean = true;
  public $html: HTMLElement;
  public $preview: HTMLElement;

  constructor($template: HTMLElement) {
    this.name = $template.dataset.name;
    this.$preview = $dom.first($template, Selectors.selectorTemplatePreview);
    if (this.$preview) {
      $template.removeChild(this.$preview);
    }

    this.$html = $template;

    if (!this.$preview) {
      const block = new Block(this, true);
      const blockHtml = block.getHtml(true);
      if (blockHtml === null) {
        this.loaded = false;
      } else {
        this.$preview = $dom.el(blockHtml);
      }
    }
  }

  public getPreview(): HTMLElement {
    const $template = $dom.el(`<div class='${Selectors.classTemplate}'></div>`);
    $template.appendChild(this.$preview);
    return $template;
  }
}
