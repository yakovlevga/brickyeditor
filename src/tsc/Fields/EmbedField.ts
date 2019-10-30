import { str } from "src/common/Common";
import { $dom } from "src/common/DOMHelpers";
import { getEmbedAsync, postProcessEmbed } from "src/embed";
import { BaseField } from "src/fields/BaseField";
import { helpers } from "src/helpers";
import { loadScript } from "src/httpTransport";
import { locales } from "src/locales";
import { promptAsync } from "src/prompt";
import { bre } from "src/Types/bre";

// const getSettings = (field: BaseField) => {
//   (field as EmbedField).showEmbedLoaderAsync(field);
// }

type EmbedFieldData = {
  name: "embed";
  url: string;
  embed: any;
};

type EmbedPromptParams = {
  url: bre.prompt.PromptParameter;
};

const getPromptParams: (props: EmbedFieldData) => EmbedPromptParams = ({
  url,
}) => ({
  url: {
    value: url || "http://instagr.am/p/BO9VX2Vj4fF/",
    title: locales.prompt.embed.url.title,
    placeholder: locales.prompt.embed.url.placeholder,
  },
});

const promptEmbedMediaUrl = async (field: EmbedField) => {
  const params = getPromptParams(field.data);
  const updated = await promptAsync<EmbedPromptParams>(params);

  if (updated !== null) {
    const url = updated.url;
    if (url !== undefined) {
      field.setUrl(url);
      await field.loadMedia(true);
    }
  }
};

const renderEmbedFieldSettingsUI = ($field: HTMLElement) => {
  // TODO: holy sht, thats really terrible!
  const $el = helpers.createElement(
    `<div style="
      position: absolute;
      width: 100%; 
      height: 100px;
      text-align: center;
      font-weight: bold;
      vertical-align: middle;
      background: #333;
      opacity: 0.2;">
      Change embed element link
    </div>`
  );
  $dom.before($field, $el);
  return $el;
};

export class EmbedField extends BaseField<EmbedFieldData> {
  // get settings(): (field: BaseField): void => {
  //   return (field: EmbedField) => {
  //     this.showEmbedLoaderAsync(field);
  //   };
  // }

  public getSettingsEl() {
    // TODO: renderEmbedFieldSettingsUI
    return null;
  }

  public bind() {
    const field = this;
    const $field = this.$field;

    $field.addEventListener("click", async () => {
      promptEmbedMediaUrl(field);
    });

    field.loadMedia(false);
  }

  public async loadMedia(fireUpdate: boolean) {
    const field = this;
    if (!field.data || !field.data.url) {
      return;
    }

    const json = await getEmbedAsync(field.data.url);

    field.setEmbed(json, fireUpdate);
    const $embed = $dom.el(json.html);
    const $script = $dom.first($embed, "script") as HTMLScriptElement;
    if ($script) {
      $script.remove();
      let scriptSrc = $script.src;
      if (str.startsWith(scriptSrc, "//")) {
        scriptSrc = "https:" + scriptSrc;
        await loadScript(scriptSrc);
        postProcessEmbed(json.provider_name);
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
}
