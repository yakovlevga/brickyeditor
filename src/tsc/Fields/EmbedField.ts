import { $dom } from "src/common/DOMHelpers";
import { BaseField } from "src/fields/BaseField";
import { Editor } from "src/Editor";
import { EditorStrings } from "src/EditorStrings";
import { PromptParameter } from "src/Prompt/Prompt";
import { EmbedService } from "src/Services/Services";
import { str } from "src/common/Common";

export class EmbedField extends BaseField {
  get settings(): (field: BaseField) => void {
    return (field: EmbedField) => {
      this.showEmbedLoaderAsync(field);
    };
  }
  getSettingsEl(): HTMLElement {
    let $el = $dom.el(
      '<div style="position: absolute;width: 100%; height: 100px;;text-align: center;font-weight: bold;vertical-align: middle;background: #333;opacity: 0.2;">Change embed element link</div>'
    );
    $dom.before(this.$field, $el);
    return $el;
  }

  bind() {
    let field = this;
    let $field = this.$field;

    $dom.on($field, "click", async () => {
      this.showEmbedLoaderAsync(field);
    });

    field.loadMedia(false);
  }

  async loadMedia(fireUpdate: boolean) {
    let field = this;
    if (!field.data || !field.data.url) {
      return;
    }

    const json = await EmbedService.getEmbedAsync(field.data.url);

    field.setEmbed(json, fireUpdate);
    const $embed = $dom.el(json.html);
    const $script = $dom.first($embed, "script") as HTMLScriptElement;
    if ($script) {
      $script.remove();
      let scriptSrc = $script.src;
      if (str.startsWith(scriptSrc, "//")) {
        scriptSrc = "https:" + scriptSrc;
        loadScript(scriptSrc).then(() => {
          EmbedService.processEmbed(json.provider_name);
        });
      }
    }

    field.$field.innerHTML = "";
    field.$field.removeAttribute("class");
    field.$field.removeAttribute("style");
    field.$field.appendChild($embed);
    field.select();
  }

  public setEmbed(value: any, fireUpdate: boolean = true) {
    this.updateProperty("embed", value, fireUpdate);
  }

  public setUrl(value: string) {
    this.updateProperty("url", value);
  }

  private async showEmbedLoaderAsync(field) {
    const fields = await Editor.UI.modal.promptAsync(field.getPromptParams());
    if (fields != null) {
      const url = fields.getValue("url");
      if (url) {
        field.setUrl(url);
        await field.loadMedia(true);
      }
    }
  }

  private getPromptParams(): PromptParameter[] {
    return [
      new PromptParameter(
        "url",
        EditorStrings.embedFieldLinkTitle,
        this.data.url || "http://instagr.am/p/BO9VX2Vj4fF/",
        EditorStrings.embedFieldLinkPlaceholder
      ),
    ];
  }
}
