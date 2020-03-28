import { EditorStrings } from "@/EditorStrings";
import { helpers, strEqualsInvariant } from "@/helpers";
import { getRequest } from "@/httpTransport";
import { bre } from "@/types/bre";
import { bindTemplateFields } from "@/fields/fields";
import {
  TEMPLATE_GROUP_SELECTOR,
  TEMPLATE_PREVIEW_SELECTOR
} from "./constants";

let allTemplates: bre.template.Template[] = [];

export const getTemplate = (templateName: string): bre.template.Template => {
  const template = allTemplates.find(x =>
    strEqualsInvariant(x.name, templateName)
  );

  if (template === undefined) {
    throw new Error(`Template is not registred: ${templateName}`);
  }

  return template;
};

export const loadTemplatesAsync = async (url: string, $editor: HTMLElement) => {
  const grouppedTemplates: bre.template.TemplateGroup[] = [];

  try {
    const data = await getRequest(url);

    // set custom templates style
    // TODO: check if we could remove wrapping div
    const $data = helpers.createElement(`<div>${data}</div>`);

    const $style = $data.querySelector("style");
    if ($style !== null && $editor.parentElement !== null) {
      $editor.parentElement?.insertBefore($style, $editor);
    }

    const $groups = $data.querySelectorAll<HTMLElement>(
      TEMPLATE_GROUP_SELECTOR
    );

    $groups.forEach($group => {
      const name = $group.getAttribute("title");
      const templates = parseTemplates($group);
      grouppedTemplates.push({ name, templates });
      $group.remove();

      // add to dictionary
      allTemplates = [...allTemplates, ...templates];
    });

    // the rest ungroupped templates
    const ungrouppedTemplates = parseTemplates($data);
    const ungrouppedTemplatesGroupName =
      grouppedTemplates.length > 0
        ? EditorStrings.defaultTemplatesGroupName
        : "";

    grouppedTemplates.push({
      name: ungrouppedTemplatesGroupName,
      templates: ungrouppedTemplates
    });

    // add to dictionary
    allTemplates = [...allTemplates, ...ungrouppedTemplates];

    return grouppedTemplates;
  } catch (err) {
    // onError(EditorStrings.errorTemplatesFileNotFound(url));
    throw err;
  }
};

const templateClassName: BreStyles = "bre-template";
const templateSelector = `.${templateClassName}`;

const parseTemplates = ($el: HTMLElement): bre.template.Template[] => {
  const $templates = $el.querySelectorAll<HTMLElement>(templateSelector);
  const templates = helpers
    .convertNodeListToArray($templates)
    .map(createTemplate);
  return helpers.filterNotNull(templates);
};

export const getTemplatePreview = (template: bre.template.Template) => {
  const $template = helpers.div("bre-template");
  $template.appendChild(template.$preview);
  return $template;
};

const createTemplate = (
  $template: HTMLElement
): bre.template.Template | null => {
  const name = $template.dataset.name || "";

  let $preview = $template.querySelector<HTMLElement>(
    TEMPLATE_PREVIEW_SELECTOR
  );

  if ($preview !== null) {
    $preview.remove();
  } else {
    $preview = $template.cloneNode(true) as HTMLElement;
    bindTemplateFields($preview);
  }

  return {
    name,
    $template,
    $preview
  };
};
