import { Block } from "src/block/Block";
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

export const createTemplate = ($template: HTMLElement): bre.core.ITemplate => {
  const $html = $template;
  const name = $template.dataset.name;

  let loaded = true;
  let $preview = $template.querySelector<HTMLElement>(
    Selectors.selectorTemplatePreview
  );

  if ($preview) {
    $template.removeChild($preview);
  } else {
    const block = new Block(name, $html.innerHTML, true);
    const blockHtml = block.getHtml(true);
    if (blockHtml === null) {
      loaded = false;
    } else {
      $preview = helpers.createElement(blockHtml);
    }
  }

  return {
    name,
    $html,
    $preview,
    loaded,
  };
};
