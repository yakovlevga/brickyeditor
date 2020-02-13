import {
  getEmbedAsync,
  NoembedResponse,
  postProcessEmbed,
  preProcessEmbedUrl
} from "@/embed";
import {
  getCleanFieldElement,
  isValidFieldType,
  toggleFieldSelection,
  updateFieldData
} from "@/fields/field";
import { helpers } from "@/helpers";
import { loadScriptAsync } from "@/httpTransport";
import { locales } from "@/locales";
import { bre } from "@/types/bre";
import { emitter } from "@/emitter";
import { propmtFieldEditorAsync } from "@/fields/editors";
import { renderInput } from "@/fields/inputs";
import { FieldFactory } from "@/fields/fields";

const providerScriptsLoaded: {
  [TKey: string]: boolean;
} = {};

type EmbedFieldType = "embed";
type EmbedFieldPayload = {
  url?: string;
  embed?: NoembedResponse;
};
type EmbedFieldData = bre.field.FieldData<EmbedFieldType, EmbedFieldPayload>;
type EmbedField = bre.field.Field<EmbedFieldData>;

export const embed: FieldFactory = ({ $element, preview, data }) => {
  if (!isValidFieldType<EmbedFieldData>(data, "embed")) {
    return null;
  }

  // No need to update embed data for templates
  if (preview) {
    return { $element };
  }

  bind($element, data);

  // updateEmbedMedia(data.url, false);

  const eventEmitter = emitter<bre.field.FieldEventMap>();
  const field: EmbedField = {
    ...eventEmitter,
    $element,
    data,
    bind,
    html,
    editor
  };

  $element.addEventListener("click", async () => {
    toggleFieldSelection(field, true);

    const updatedData = await propmtFieldEditorAsync(field);
    if (updatedData !== null) {
      bind(field.$element, updatedData);
      updateFieldData(field, updatedData);
    }
  });

  return field;
};

const html = (field: EmbedField) => getCleanFieldElement(field.$element);

const editor = (initialData: Readonly<EmbedFieldData>) => {
  const data: EmbedFieldData = {
    ...initialData
  };

  const $element = helpers.div("bre-field-editor-root");
  const $preview = helpers.div("bre-field-editor-preview");

  bind($preview, data);

  const $url = renderInput({
    ...locales.prompt.embed.url,
    value: data.url || "",
    type: "text",
    onUpdate: v => {
      if (data.url != v) {
        data.url = v;
        bind($preview, data);
      }
    }
  });

  $element.append($preview, $url);

  return {
    $element,
    data
  };
};

const bind = async ($element: HTMLElement, { url }: EmbedFieldData) => {
  if (url === undefined) {
    return;
  }

  const embed = await getEmbedAsync(preProcessEmbedUrl(url));
  const $embed = helpers.createElement(embed.html);
  const $script = $embed.querySelector("script");
  if ($script !== null) {
    $script.remove();
  }

  $element.innerHTML = "";
  $element.appendChild($embed);

  if ($script !== null) {
    if (providerScriptsLoaded[$script.src] === undefined) {
      await loadScriptAsync($script.src);
      providerScriptsLoaded[embed.provider_name] = true;
    }

    // postpone untill for will be DOM updated
    setTimeout(() => postProcessEmbed(embed.provider_name), 100);
  }
};
