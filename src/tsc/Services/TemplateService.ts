import { $ajax } from "src/common/AJAXHelper";
import { str } from "src/common/Common";
import { $dom } from "src/common/DOMHelpers";
import { EditorStrings } from "src/EditorStrings";
import { createTemplate } from "src/templates/Template";
import { bre } from "src/Types/bre";
import { Selectors } from "src/ui/Selectors";

export class TemplateService {
  public static templates: bre.core.ITemplateGroup[] = [];

  public static async loadTemplatesAsync(
    url: string,
    $editor: HTMLElement,
    onError: (message: string, code?: number) => any
  ): Promise<bre.core.ITemplateGroup[]> {
    return new Promise<bre.core.ITemplateGroup[]>(async (resolve, reject) => {
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
          const name = $group.getAttribute("title");
          const groupTemplates = this.getTemplates($group, onError);
          this.templates.push({ name, templates: groupTemplates });
          $group.remove();
        });

        // the rest ungroupped templates
        const ungrouppedTemplates = this.getTemplates($data, onError);
        const defaultGroupName =
          this.templates.length > 0
            ? EditorStrings.defaultTemplatesGroupName
            : "";

        this.templates.push({
          name: defaultGroupName,
          templates: ungrouppedTemplates,
        });

        resolve(this.templates);
      } catch (err) {
        onError(EditorStrings.errorTemplatesFileNotFound(url));
        reject(err);
      }
    });
  }

  public static getTemplate(templateName: string): bre.core.ITemplate {
    this.templates.forEach(group => {
      const result = group.templates.find(template =>
        str.equalsInvariant(template.name, templateName)
      );

      if (result !== undefined) {
        return result;
      }
    });

    // for (let gi = 0; gi < this.templates.length; gi++) {
    //   const group = this.templates[gi];
    //   for (let ti = 0; ti < group.templates.length; ti++) {
    //     const template = group.templates[ti];
    //     if (str.equalsInvariant(template.name, templateName)) {
    //       return template;
    //     }
    //   }
    // }

    return null;
  }

  private static getTemplates(
    $el: HTMLElement,
    onError: (message: string, code?: number) => any
  ): bre.core.ITemplate[] {
    const templates: bre.core.ITemplate[] = [];

    const $templates = $dom.select($el, Selectors.selectorTemplate);
    $templates.forEach($template => {
      const template = createTemplate($template);
      if (template.loaded) {
        templates.push(template);
      } else {
        onError(EditorStrings.errorTemplateParsing(template.name));
      }
    });

    return templates;
  }
}
