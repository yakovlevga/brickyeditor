import { getCleanFieldElement, updateFieldData } from '@/fields/field';
import { bre } from '@/types/bre';
import { selectField } from '@/editorState';

type HtmlFieldType = 'html';
type HtmlFieldPayload = {
  html?: string;
};
type HtmlFieldData = bre.field.FieldData<HtmlFieldType, HtmlFieldPayload>;
type HtmlField = bre.field.Field<HtmlFieldData>;

const MaxPreviewLength = 50;
const getTextPreview = ($element: HTMLElement) =>
  $element.innerHTML.length > MaxPreviewLength
    ? $element.innerHTML.substr(0, MaxPreviewLength) + '...'
    : $element.innerHTML;

export const html: bre.field.FieldDescriptor<HtmlFieldData> = {
  makeField: ($element, initialData, parentBlock) => {
    bind($element, initialData);

    let field: HtmlField = {
      parentBlock,
      $element,
      data: initialData,
    };

    const updateHtmlProp = () => {
      const html = $element.innerHTML.trim();
      updateFieldData(field, { html });
    };

    $element.setAttribute('contenteditable', 'true');
    $element.addEventListener('input', updateHtmlProp);
    $element.addEventListener('paste', (ev: ClipboardEvent) => {
      ev.preventDefault();
      if (ev.clipboardData) {
        const text = ev.clipboardData.getData('text/plain');
        document.execCommand('insertHTML', false, text);
        updateHtmlProp();
      }
    });

    $element.addEventListener('click', ev => {
      ev.stopPropagation();
      selectField(field);
    });

    return field;
  },
  setupPreview: $element => {
    $element.innerHTML = getTextPreview($element);
    return $element;
  },
  getHtml,
};

function bind($element: HTMLElement, { html }: HtmlFieldData) {
  if (html !== undefined) {
    $element.innerHTML = html;
  }
}

function getHtml(field: HtmlField) {
  const $copy = getCleanFieldElement(field.$element);
  $copy.removeAttribute('contenteditable');
  return $copy;
}
