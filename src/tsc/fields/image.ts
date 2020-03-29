import {
  getCleanFieldElement,
  isValidFieldType,
  updateFieldData
} from "@/fields/field";
import { helpers } from "@/helpers";
import { bre } from "@/types/bre";
import { renderInput } from "@/fields/inputs";
import { locales } from "@/locales";
import { linkEditor } from "@/fields/linkEditor";
import { propmtFieldEditorAsync } from "@/fields/editors";
import { FieldFactory } from "@/fields/fields";
import { selectField } from "@/editorState";

type ImageFieldPayload = {
  src?: string;
  alt?: string;
  file?: bre.FileContent;
  link?: bre.LinkData;
};
type ImageFieldData = bre.field.FieldData<"image", ImageFieldPayload>;
type ImageField = bre.field.Field<ImageFieldData>;

export const image: FieldFactory = props => {
  const { $element, data } = props;

  if (!isValidFieldType<ImageFieldData>(data, "image")) {
    return null;
  }

  bind($element, data);

  if (props.preview) {
    return {
      $element
    };
  }

  let field: ImageField = {
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

function bind($element: HTMLElement, data: ImageFieldData) {
  const src = getSrcOrFile(data);
  const alt = data.alt || "";

  const isImageElement = $element.tagName.toLowerCase() === "img";
  if (isImageElement) {
    const image = $element as HTMLImageElement;
    image.src = src;
    image.alt = alt;
  } else {
    $element.style.backgroundImage = `url(${src})`;
  }

  $element.title = alt;
}

function editor(initialData: Readonly<ImageFieldData>) {
  const data: ImageFieldData = {
    ...initialData
  };

  const $element = helpers.div("bre-field-editor-root");

  const $previewImg = helpers.el<HTMLImageElement>({
    tag: "img",
    className: "bre-field-editor-preview-img",
    props: {
      src: getSrcOrFile(data)
    }
  });

  const $preview = helpers.div("bre-field-editor-preview");
  $preview.appendChild($previewImg);

  const $src = renderInput({
    ...locales.prompt.image.link,
    value: data.src,
    type: "text",
    onUpdate: src => {
      $previewImg.src = src;
      data.src = src;
      data.file = undefined;
    }
  });

  const $file = renderInput({
    ...locales.prompt.image.upload,
    type: "file",
    value: data.file ? data.file.fileContent : "",
    onUpdate: async (f, fileContent) => {
      $previewImg.src = fileContent;

      const fileInfo = {
        name: f.name,
        size: f.size,
        type: f.type,
        lastModified: f.lastModified
      };

      // TODO: if we have upload link, than do upload it here
      // if(uploadLink !== undefined) {
      //  d.link =  link from upload request
      // }
      // otherwise store in content on field data
      data.src = undefined;
      data.file = {
        fileContent,
        fileInfo
      };
    }
  });

  const $alt = renderInput({
    ...locales.prompt.image.alt,
    value: data.alt,
    type: "text",
    onUpdate: v => (data.alt = $previewImg.alt = v)
  });

  const { $element: $link, data: linkData } = linkEditor(initialData.link);
  data.link = linkData;

  $element.append($preview, $src, $file, $alt, $link);

  return {
    $element,
    data
  };
}

function html(field: ImageField) {
  const { $element, data } = field;
  const { link } = data;

  const $result = getCleanFieldElement($element);

  if (link !== undefined && link.href !== undefined && link.href.length) {
    const $link = helpers.el<HTMLLinkElement>({
      tag: "a",
      props: link
    });
    $link.appendChild($result);

    return $link;
  }

  return $result;
}

function getSrcOrFile(data: ImageFieldPayload) {
  return data.src || (data.file !== undefined ? data.file.fileContent : "");
}
