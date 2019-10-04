import { $ajax } from "src/common/AJAXHelper";
import { $dom } from "src/common/DOMHelpers";
import { Selectors } from "src/ui/Selectors";
import { EditorStrings } from "src/EditorStrings";
import { Template } from "src/templates/Template";
import { TemplateGroup } from "src/templates/TemplateGroup";
import { str } from "src/common/Common";

export class TemplateService {
  public static templates: TemplateGroup[];

  public static async loadTemplatesAsync(
    url: string,
    $editor: HTMLElement,
    onError: (message: string, code?: number) => any
  ): Promise<TemplateGroup[]> {
    this.templates = [];
    const templates = this.templates;

    return new Promise<TemplateGroup[]>(async (resolve, reject) => {
      try {
        const data = await $ajax.get(url);

        // set custom templates style
        const $data = $dom.el(`<div>${data}</div>`);

        const $style = $dom.select($data, "style", false);
        if ($style.length > 0) {
          $dom.before($editor, $style);
          // $editor.prepend($style);
        }

        const $groups = $dom.select($data, Selectors.selectorTemplateGroup);
        $groups.forEach($group => {
          const title = $group.getAttribute("title");
          const templates = this.getTemplates($group, onError);
          this.templates.push(new TemplateGroup(title, templates));
          $group.remove();
        });

        // the rest ungroupped templates
        const templates = this.getTemplates($data, onError);
        const defaultGroupName =
          this.templates.length > 0
            ? EditorStrings.defaultTemplatesGroupName
            : "";
        const group = new TemplateGroup(defaultGroupName, templates);
        this.templates.push(group);

        resolve(this.templates);
      } catch (err) {
        onError(EditorStrings.errorTemplatesFileNotFound(url));
        reject(err);
      }
    });
  }

  public static getTemplate(templateName: string): Template {
    for (let gi = 0; gi < this.templates.length; gi++) {
      const group = this.templates[gi];
      for (let ti = 0; ti < group.templates.length; ti++) {
        const template = group.templates[ti];
        if (str.equalsInvariant(template.name, templateName)) {
          return template;
        }
      }
    }

    return null;
  }

  private static getTemplates(
    $el: HTMLElement,
    onError: (message: string, code?: number) => any
  ): Template[] {
    const templates = [];

    const $templates = $dom.select($el, Selectors.selectorTemplate);
    $templates.forEach($template => {
      const template = new Template($template);
      if (template.loaded) {
        templates.push(template);
      } else {
        onError(EditorStrings.errorTemplateParsing(template.name));
      }
    });

    return templates;
  }
}
