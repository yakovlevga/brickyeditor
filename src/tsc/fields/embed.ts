import {
  getEmbedAsync,
  NoembedResponse,
  postProcessEmbed,
  preProcessEmbedUrl
} from "@/noembed";
import {
  getCleanFieldElement,
  isValidFieldType,
  updateFieldData
} from "@/fields/field";
import { helpers } from "@/helpers";
import { loadScriptAsync } from "@/httpTransport";
import { locales } from "@/locales";
import { bre } from "@/types/bre";
import { propmtFieldEditorAsync } from "@/fields/editors";
import { renderInput } from "@/fields/inputs";
import { FieldFactory } from "@/fields/fields";
import { selectField } from "@/editorState";
import { iconEmbed } from "@/icons/iconEmbed";

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

const getEmbedPlaceholder = () =>
  helpers.div(
    ["bre-field-placeholder", "bre-icon", "bre-icon-32"],
    `${iconEmbed}<span>embed</span>`
  );

export const embed: FieldFactory = props => {
  const { $element, data } = props;

  if (!isValidFieldType<EmbedFieldData>(data, "embed")) {
    return null;
  }

  // No need to update embed data for templates
  if (props.preview) {
    $element.appendChild(getEmbedPlaceholder());
    return { $element };
  }

  bind($element, data);

  // updateEmbedMedia(data.url, false);

  const field: EmbedField = {
    $element,
    data,
    html,
    editor,
    parentBlock: props.parentBlock
  };

  $element.addEventListener("click", async ev => {
    ev.stopPropagation();
    selectField(field);

    const updatedData = await propmtFieldEditorAsync(field);
    if (updatedData !== null) {
      bind(field.$element, updatedData);
      updateFieldData(field, updatedData);
    }
  });

  return field;
};

function html(field: EmbedField) {
  return getCleanFieldElement(field.$element);
}

function editor(initialData: Readonly<EmbedFieldData>) {
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
}

async function bind($element: HTMLElement, { url }: EmbedFieldData) {
  if (url === undefined) {
    $element.appendChild(getEmbedPlaceholder());
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

    // wait until DOM will be updated
    setTimeout(() => postProcessEmbed(embed.provider_name), 100);
  }
}
