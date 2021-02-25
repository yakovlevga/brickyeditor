import { getCleanFieldElement, updateFieldData } from '@/fields/field';
import { helpers, reInjectScript } from '@/helpers';
import { bre } from '@/types/bre';
import { propmtFieldEditorAsync } from '@/fields/editors';
import { renderInput } from '@/fields/inputs';
import { selectField } from '@/state/editorState';
import { iconEmbed } from '@/icons/iconEmbed';
import { postProcessEmbed } from '@/noembed';

type HtmlCodeFieldType = 'htmlCode';
type HtmlCodeFieldPayload = {
  code?: string;
};
type HtmlCodeFieldData = bre.field.FieldData<
  HtmlCodeFieldType,
  HtmlCodeFieldPayload
>;
type HtmlCodeField = bre.field.Field<HtmlCodeFieldData>;

const getHtmlCodePlaceholder = () =>
  helpers.div(
    ['bre-field-placeholder', 'bre-icon', 'bre-icon-32'],
    `${iconEmbed}<span>html code</span>`
  );

export const htmlCode: bre.field.FieldDescriptor<HtmlCodeFieldData> = {
  makeField: ($element, data, parentBlock) => {
    bind($element, data);
    const field: HtmlCodeField = {
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
    $element.appendChild(getHtmlCodePlaceholder());
    return $element;
  },
  getHtml,
};

function getHtml(field: HtmlCodeField) {
  return getCleanFieldElement(field.$element);
}

function editor(
  field: bre.field.FieldBase
): bre.field.FieldEditor<HtmlCodeFieldData> {
  const data: HtmlCodeFieldData = {
    ...field.data,
  };

  const $element = helpers.div('bre-field-editor-root');
  const $preview = helpers.div('bre-field-editor-preview');

  bind($preview, data);

  const $url = renderInput(
    {
      title: helpers.msg('embed.link.title'),
      placeholder: helpers.msg('embed.link.placeholder'),
      value: data.code || '',
      type: 'text',
      onUpdate: v => {
        if (data.code != v) {
          data.code = v;
          bind($preview, data);
        }
      },
    },
    'textarea'
  );

  $element.append($preview, $url);

  return {
    $element,
    data,
  };
}

async function bind($element: HTMLElement, { code }: HtmlCodeFieldData) {
  if (code === undefined) {
    $element.appendChild(getHtmlCodePlaceholder());
    return;
  }

  const $node = helpers.div(undefined, code);
  const $scripts = $node.querySelectorAll('script');
  $scripts.forEach($s => $s.remove());
  $element.innerHTML = $node.innerHTML;

  setTimeout(() => {
    $scripts.forEach($s => reInjectScript($s));
    if (code.indexOf('instagram') !== -1) {
      postProcessEmbed('Instagram');
    }
  }, 100);

  // var po = document.createElement('script');
  // po.type = 'text/javascript';
  // po.async = true;
  // po.src = '1.js';
  // var s = document.getElementsByTagName('script')[0] as HTMLElement;
  // s.parentNode!.insertBefore(po, s);

  // $element.appendChild($fake);
  // const $htmlCode = helpers.div(undefined, htmlCode);
  // const $scripts = $htmlCode.querySelectorAll('script');
  // if ($scripts !== null) {
  //   $scripts.forEach(s => s.remove());
  // }

  // $element.innerHTML = $htmlCode.innerHTML;
  // setTimeout(() => {
  //   $scripts.forEach(s => $element.appendChild(s));
  // }, 100);
}
