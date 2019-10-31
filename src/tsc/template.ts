import { Block } from "src/block/Block";
import { str } from "src/common/Common";
import { $dom } from "src/common/DOMHelpers";
import { EditorStrings } from "src/EditorStrings";
import { helpers } from "src/helpers";
import { getRequest } from "src/httpTransport";
import { bre } from "src/types/bre";
import { Selectors } from "src/ui/Selectors";

type onErrorHandler = (message: string, code?: number) => any;

let allTemplates: bre.core.ITemplate[] = [];

export const getTemplate = (templateName: string): bre.core.ITemplate => {
  const template = allTemplates.find(x =>
    str.equalsInvariant(x.name, templateName)
  );

  if (template === undefined) {
    throw new Error(`Template is not registred: ${templateName}`);
  }

  return template;
};

export const loadTemplatesAsync = async (
  url: string,
  $editor: HTMLElement,
  onError: onErrorHandler
) => {
  const grouppedTemplates: bre.core.ITemplateGroup[] = [];

  try {
    const data = await getRequest(url);

    // set custom templates style
    // TODO: check if we could remove wrapping div
    const $data = helpers.createElement(`<div>${data}</div>`);

    const $style = $data.querySelector("style");
    if ($style !== null) {
      $dom.before($editor, $style);
    }

    const $groups = $data.querySelectorAll<HTMLElement>(
      Selectors.selectorTemplateGroup
    );

    $groups.forEach($group => {
      const name = $group.getAttribute("title");
      const templates = parseTemplates($group, onError);
      grouppedTemplates.push({ name, templates });
      $group.remove();

      // add to dictionary
      allTemplates = [...allTemplates, ...templates];
    });

    // the rest ungroupped templates
    const ungrouppedTemplates = parseTemplates($data, onError);
    const ungrouppedTemplatesGroupName =
      grouppedTemplates.length > 0
        ? EditorStrings.defaultTemplatesGroupName
        : "";

    grouppedTemplates.push({
      name: ungrouppedTemplatesGroupName,
      templates: ungrouppedTemplates,
    });

    // add to dictionary
    allTemplates = [...allTemplates, ...ungrouppedTemplates];

    return grouppedTemplates;
  } catch (err) {
    onError(EditorStrings.errorTemplatesFileNotFound(url));
    throw err;
  }
};

const parseTemplates = ($el: HTMLElement, onError: onErrorHandler) => {
  const templates: bre.core.ITemplate[] = [];

  const $templates = $el.querySelectorAll<HTMLElement>(
    Selectors.selectorTemplate
  );

  $templates.forEach($template => {
    const template = createTemplate($template, onError);
    if (template !== null) {
      templates.push(template);
    }
  });

  return templates;
};

export const getTemplatePreview = (template: bre.core.ITemplate) => {
  const $template = helpers.createElement(
    `<div class='${Selectors.classTemplate}'></div>`
  );
  $template.appendChild(template.$preview);
  return $template;
};

const createTemplate = (
  $template: HTMLElement,
  onError: onErrorHandler
): bre.core.ITemplate | null => {
  const $html = $template;
  const name = $template.dataset.name || "";

  let $preview = $template.querySelector<HTMLElement>(
    Selectors.selectorTemplatePreview
  );

  if ($preview !== null) {
    $template.removeChild($preview);
  } else {
    const block = new Block(name, $html.innerHTML, true);
    const blockHtml = block.getHtml(true);

    if (blockHtml === null) {
      onError(EditorStrings.errorTemplateParsing(name));
      return null;
    }

    $preview = helpers.createElement(blockHtml);
  }

  return {
    name,
    $html,
    $preview,
  };
};
