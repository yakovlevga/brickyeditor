import {
  getEmbedAsync,
  NoembedResponse,
  postProcessEmbed,
  preProcessEmbedUrl,
} from '@/noembed';
import { getCleanFieldElement, updateFieldData } from '@/fields/field';
import { helpers } from '@/helpers';
import { loadScriptAsync } from '@/httpTransport';
import { bre } from '@/types/bre';
import { propmtFieldEditorAsync } from '@/fields/editors';
import { renderInput } from '@/fields/inputs';
import { selectField } from '@/state/editorState';
import { iconEmbed } from '@/icons/iconEmbed';

const providerScriptsLoaded: {
  [TKey: string]: boolean;
} = {};

type EmbedFieldType = 'embed';
type EmbedFieldPayload = {
  url?: string;
  embed?: NoembedResponse;
};
type EmbedFieldData = bre.field.FieldData<EmbedFieldType, EmbedFieldPayload>;
type EmbedField = bre.field.Field<EmbedFieldData>;

const getEmbedPlaceholder = () =>
  helpers.div(
    ['bre-field-placeholder', 'bre-icon', 'bre-icon-32'],
    `${iconEmbed}<span>embed</span>`
  );

export const embed: bre.field.FieldDescriptor<EmbedFieldData> = {
  makeField: ($element, data, parentBlock) => {
    bind($element, data);
    const field: EmbedField = {
      $element,
      data,
      parentBlock,
    };

    $element.addEventListener('click', async ev => {
      ev.stopPropagation();
      selectField(field);
      const updatedData = await propmtFieldEditorAsync(field, editor);
      if (updatedData !== null) {
        bind(field.$element, updatedData);
        updateFieldData(field, updatedData);
      }
    });

    return field;
  },

  setupPreview: $element => {
    $element.appendChild(getEmbedPlaceholder());
    return $element;
  },
  getHtml,
};

function getHtml(field: EmbedField) {
  return getCleanFieldElement(field.$element);
}

function editor(
  field: bre.field.FieldBase
): bre.field.FieldEditor<EmbedFieldData> {
  const data: EmbedFieldData = {
    ...field.data,
  };

  const $element = helpers.div('bre-field-editor-root');
  const $preview = helpers.div('bre-field-editor-preview');

  bind($preview, data);

  const $url = renderInput({
    title: helpers.msg('embed.link.title'),
    placeholder: helpers.msg('embed.link.placeholder'),
    value: data.url || '',
    type: 'text',
    onUpdate: v => {
      if (data.url != v) {
        data.url = v;
        bind($preview, data);
      }
    },
  });

  $element.append($preview, $url);

  return {
    $element,
    data,
  };
}

async function bind($element: HTMLElement, { url }: EmbedFieldData) {
  if (url === undefined) {
    $element.appendChild(getEmbedPlaceholder());
    return;
  }

  const embed = await getEmbedAsync(preProcessEmbedUrl(url));
  const $embed = helpers.div(undefined, embed.html);
  const $script = $embed.querySelector('script');
  if ($script !== null) {
    $script.remove();
  }

  $element.innerHTML = $embed.innerHTML;

  if ($script !== null) {
    if (providerScriptsLoaded[$script.src] === undefined) {
      await loadScriptAsync($script.src);
      providerScriptsLoaded[embed.provider_name] = true;
    }

    // wait until DOM will be updated
    setTimeout(() => postProcessEmbed(embed.provider_name), 100);
  }
}
