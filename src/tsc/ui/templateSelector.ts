import { bre } from "src/types/bre";
import { helpers } from "src/helpers";

import { TemplateSelectorStyles } from "./templateSelector.scss";
import { TemplatesEventMap, emmiter, FireFunc } from "src/emmiter";

const getTemplateUI = (template: bre.core.ITemplate) => {
  const $template = helpers.div<TemplateSelectorStyles>(
    "bre-templates-group-item"
  );

  const { $preview } = template;
  $preview.setAttribute("title", template.name);
  $template.append($preview);

  return $template;
};

const getTemplateGroupUI = (
  group: bre.core.ITemplateGroup,
  fireFunc: FireFunc<TemplatesEventMap>
) => {
  const $group = helpers.div<TemplateSelectorStyles>("bre-templates-group");
  const $name = helpers.div<TemplateSelectorStyles>(
    "bre-templates-group-name",
    group.name || ""
  );

  $name.onclick = () => {
    for (let i = 1; i < $group.children.length; i++) {
      helpers.toggleVisibility($group.children[i] as HTMLElement);
    }
  };
  $group.append($name);

  group.templates.forEach(template => {
    const $template = getTemplateUI(template);
    $group.append($template);

    $template.onclick = () => {
      fireFunc("select", {
        template
      });
    };
  });

  return $group;
};

export const getTemplateSelector = () => {
  const { fire: fireEvent, on, off } = emmiter<TemplatesEventMap>();

  const $element = helpers.div<TemplateSelectorStyles>("bre-templates-root");
  const $loader = helpers.div<TemplateSelectorStyles>(
    "bre-templates-loader",
    "...LOADING..."
  );
  const $templates = helpers.div<TemplateSelectorStyles>("bre-templates-list");

  $element.append($loader, $templates);

  const setTemplates = (templatesGroupped: bre.core.ITemplateGroup[]) => {
    helpers.toggleVisibility($loader, false);

    templatesGroupped.forEach(group => {
      if (group.templates.length === 0) {
        return;
      }

      const $group = getTemplateGroupUI(group, fireEvent);
      $templates.append($group);
    });
  };

  return {
    $element,
    setTemplates,
    on,
    off
  };
};
