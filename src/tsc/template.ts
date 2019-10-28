import { http } from "src/common/AJAXHelper";
import { str } from "src/common/Common";
import { $dom } from "src/common/DOMHelpers";
import { EditorStrings } from "src/EditorStrings";
import { helpers } from "src/helpers";
import { createTemplate } from "src/templates/Template";
import { bre } from "src/Types/bre";
import { Selectors } from "src/ui/Selectors";

const grouppedTemplates: bre.core.ITemplateGroup[] = [];
let allTemplates: bre.core.ITemplate[] = [];

export const getTemplate = (
  templateName: string
): bre.core.ITemplate | null => {
  const template = allTemplates.find(x =>
    str.equalsInvariant(x.name, templateName)
  );

  return template || null;
};

export const loadTemplatesAsync = async (
  url: string,
  $editor: HTMLElement,
  onError: (message: string, code?: number) => any
) => {
  try {
    const data = await http.get(url);

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

const parseTemplates = (
  $el: HTMLElement,
  onError: (message: string, code?: number) => any
) => {
  const templates: bre.core.ITemplate[] = [];

  const $templates = $el.querySelectorAll<HTMLElement>(
    Selectors.selectorTemplate
  );

  $templates.forEach($template => {
    const template = createTemplate($template);
    if (template.loaded) {
      templates.push(template);
    } else {
      // TODO move to createTemplate method and use .map.filter
      onError(EditorStrings.errorTemplateParsing(template.name));
    }
  });

  return templates;
};
