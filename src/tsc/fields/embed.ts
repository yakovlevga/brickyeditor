import { $dom } from "src/common/DOMHelpers";
import {
  getEmbedAsync,
  NoembedResponse,
  postProcessEmbed,
  preProcessEmbedUrl,
} from "src/embed";
import { FieldFactory, getFieldElement } from "src/fields/field";
import { helpers } from "src/helpers";
import { loadScriptAsync } from "src/httpTransport";
import { locales } from "src/locales";
import { promptAsync } from "src/prompt";
import { bre } from "src/types/bre";

// const getSettings = (field: BaseField) => {
//   (field as EmbedField).showEmbedLoaderAsync(field);
// }

export type EmbedFieldData = bre.core.field.FieldData & {
  type: "embed";
  url?: string;
  embed?: NoembedResponse;
};

type EmbedFieldFactory = FieldFactory<EmbedFieldData>;

type EmbedPromptParams = {
  url: bre.prompt.PromptParameter;
};

const providerScriptsLoaded: {
  [TKey: string]: boolean;
} = {};

const getPromptParams: (props: EmbedFieldData) => EmbedPromptParams = ({
  url,
}) => ({
  url: {
    value: url || "http://instagr.am/p/BO9VX2Vj4fF/",
    title: locales.prompt.embed.url.title,
    placeholder: locales.prompt.embed.url.placeholder,
  },
});

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

export const createEmbedField: EmbedFieldFactory = (props, data) => {
  const { $element } = props;

  const field: bre.core.field.Field<EmbedFieldData> = {
    type: "embed",
    name: data.name,
    $field: $element,
    data,
    getElement: () => {
      const $copy = getFieldElement($element);
      return $copy;
    },
  };

  const updateEmbedMedia = async (url?: string, fireUpdate?: boolean) => {
    if (url === undefined) {
      return;
    }

    const embed = await getEmbedAsync(preProcessEmbedUrl(url));

    field.data = {
      ...field.data,
      url,
      embed,
    };

    const $embed = helpers.createElement(`<div>${embed.html}</div>`);

    const $script = $embed.querySelector("script");
    if ($script !== null) {
      $script.remove();
    }

    $element.innerHTML = "";
    $element.removeAttribute("class");
    $element.removeAttribute("style");
    $element.appendChild($embed);

    if ($script !== null) {
      if (providerScriptsLoaded[$script.src] === undefined) {
        await loadScriptAsync($script.src);
        providerScriptsLoaded[embed.provider_name] = true;
      }

      // need some time for DOM update
      setTimeout(() => postProcessEmbed(embed.provider_name), 100);
    }

    // field.select();

    if (fireUpdate) {
      // TODO:
    }
  };

  updateEmbedMedia(data.url, false);

  const promptEmbedMediaUrl = async () => {
    const params = getPromptParams(field.data);
    const updated = await promptAsync<EmbedPromptParams>(params);

    if (updated !== null) {
      const url = updated.url;
      if (url !== undefined) {
        updateEmbedMedia(url, true);
      }
    }
  };

  $element.addEventListener("click", async () => {
    promptEmbedMediaUrl();
  });

  return field;
};

// export class EmbedField extends BaseField<EmbedFieldData> {
//   // get settings(): (field: BaseField): void => {
//   //   return (field: EmbedField) => {
//   //     this.showEmbedLoaderAsync(field);
//   //   };
//   // }

//   public getSettingsEl() {
//     return renderEmbedFieldSettingsUI(this.$field);
//   }

// }
