import { getCleanFieldElement, updateFieldData } from '@/fields/field';
import { helpers } from '@/helpers';
import { bre } from '@/types/bre';
import { renderInput } from '@/fields/inputs';
import { linkEditor } from '@/fields/linkEditor';
import { propmtFieldEditorAsync } from '@/fields/editors';
import { selectField } from '@/state/editorState';

type ImageFieldPayload = {
  src?: string;
  alt?: string;
  file?: bre.FileContent;
  link?: bre.LinkData;
};
type ImageFieldData = bre.field.FieldData<'image', ImageFieldPayload>;
type ImageField = bre.field.Field<ImageFieldData>;

export const image: bre.field.FieldDescriptor<ImageFieldData> = {
  makeField: ($element, initialData, parentBlock) => {
    bind($element, initialData);

    let field: ImageField = {
      $element,
      data: initialData,
      parentBlock: parentBlock,
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
  setupPreview: ($element, initialData) => {
    bind($element, initialData);
    return $element;
  },
  getHtml,
};

function bind($element: HTMLElement, data: ImageFieldData) {
  const src = getSrcOrFile(data);
  const alt = data.alt || '';

  const isImageElement = $element.tagName.toLowerCase() === 'img';
  if (isImageElement) {
    const image = $element as HTMLImageElement;
    image.src = src;
    image.alt = alt;
  } else {
    $element.style.backgroundImage = `url(${src})`;
  }

  $element.title = alt;
}

function editor(
  field: bre.field.FieldBase
): bre.field.FieldEditor<ImageFieldData> {
  const initialData: Readonly<ImageFieldData> = field.data;

  const data: ImageFieldData = {
    ...initialData,
  };

  const $element = helpers.div('bre-field-editor-root');

  const $previewImg = helpers.el<HTMLImageElement>({
    tag: 'img',
    className: 'bre-field-editor-preview-img',
    props: {
      src: getSrcOrFile(data),
    },
  });

  const $preview = helpers.div('bre-field-editor-preview');
  $preview.appendChild($previewImg);

  const $src = renderInput({
    title: helpers.msg('image.link.title'),
    placeholder: helpers.msg('image.link.placeholder'),
    value: data.src,
    type: 'text',
    onUpdate: src => {
      $previewImg.src = src;
      data.src = src;
      data.file = undefined;
    },
  });

  const $file = renderInput({
    title: helpers.msg('image.upload.title'),
    placeholder: helpers.msg('image.upload.title'),
    type: 'file',
    value: data.file ? data.file.fileContent : '',
    onUpdate: async (f, fileContent) => {
      $previewImg.src = fileContent;

      const fileInfo = {
        name: f.name,
        size: f.size,
        type: f.type,
        lastModified: f.lastModified,
      };

      // TODO: if we have upload link, than do upload it here
      // if(uploadLink !== undefined) {
      //  d.link =  link from upload request
      // }
      // otherwise store in content on field data
      data.src = undefined;
      data.file = {
        fileContent,
        fileInfo,
      };
    },
  });

  const $alt = renderInput({
    title: helpers.msg('image.alt.title'),
    placeholder: helpers.msg('image.alt.title'),
    value: data.alt,
    type: 'text',
    onUpdate: v => (data.alt = $previewImg.alt = v),
  });

  const { $element: $link, data: linkData } = linkEditor(initialData.link);
  data.link = linkData;

  $element.append($preview, $src, $file, $alt, $link);

  return {
    $element,
    data,
  };
}

function getHtml(field: ImageField) {
  const { $element, data } = field;
  const { link } = data;

  const $result = getCleanFieldElement($element);

  if (link !== undefined && link.href !== undefined && link.href.length) {
    const $link = helpers.el<HTMLLinkElement>({
      tag: 'a',
      props: link,
    });
    $link.appendChild($result);

    return $link;
  }

  return $result;
}

function getSrcOrFile(data: ImageFieldPayload) {
  return data.src || (data.file !== undefined ? data.file.fileContent : '');
}
