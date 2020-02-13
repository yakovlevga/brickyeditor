import { bre } from "@/types/bre";
import { helpers } from "@/helpers";
import { emitter } from "@/emitter";

const getTemplateUI = (template: bre.template.Template) => {
  const $template = helpers.div("bre-templates-group-item");

  const { $preview } = template;
  $preview.setAttribute("title", template.name);
  $template.append($preview);

  return $template;
};

const getTemplateGroupUI = (
  group: bre.template.TemplateGroup,
  fireFunc: bre.event.FireFunc<bre.template.TemplatesEventMap>
) => {
  const $group = helpers.div("bre-templates-group");
  const $name = helpers.div("bre-templates-group-name", group.name || "");

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
  const { fire: fireEvent, on, off } = emitter<
    bre.template.TemplatesEventMap
  >();

  const $element = helpers.div("bre-templates-root");
  const $loader = helpers.div("bre-templates-loader", "...LOADING...");
  const $templates = helpers.div("bre-templates-list");

  $element.append($loader, $templates);

  const setTemplates = (templatesGroupped: bre.template.TemplateGroup[]) => {
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
