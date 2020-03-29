import { bre } from "@/types/bre";
import { helpers } from "@/helpers";
import { addBlockToContainer } from "@/blocksContainer";

const getTemplateUI = (template: bre.template.Template, zoom: boolean) => {
  const $template = helpers.div("bre-templates-group-item");
  const { $preview } = template;
  $preview.setAttribute("title", template.name);

  if (zoom) {
    helpers.toggleClassName($preview, "bre-template-zoom", true);
  }

  $template.append($preview);

  return $template;
};

const getTemplateGroupUI = (
  editor: bre.Editor,
  group: bre.template.TemplateGroup
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
    const $template = getTemplateUI(
      template,
      editor.options.templateSelector.zoom
    );

    $group.append($template);

    $template.onclick = ev => {
      ev.stopPropagation();
      addBlockWithTemplate(editor, template);
    };
  });

  return $group;
};

export const getTemplateSelector = (editor: bre.Editor) => {
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

      const $group = getTemplateGroupUI(editor, group);
      $templates.append($group);
    });
  };

  return {
    $element,
    setTemplates
  };
};

const addBlockWithTemplate = (
  editor: bre.Editor,
  blockTemplate: bre.template.Template
) => {
  const state = editor.state;
  const selectedContainer = state.selectedContainers[0];
  const selectedBlock =
    state.selectedBlocks.length > 0 ? state.selectedBlocks[0] : null;

  const idx =
    selectedBlock !== null
      ? selectedContainer.blocks.indexOf(selectedBlock) + 1
      : selectedContainer.blocks.length;

  if (selectedContainer !== null) {
    addBlockToContainer(
      selectedContainer,
      {
        blockTemplate,
        idx
      },
      true
    );
  }
};
