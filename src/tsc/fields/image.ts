import {
  getCleanFieldElement,
  isValidFieldType,
  updateFieldData,
  toggleFieldSelection
} from "@/fields/field";
import { helpers } from "@/helpers";
import { bre } from "@/types/bre";
import { emmiter, FieldEventMap } from "@/emmiter";
import { renderInput } from "@/fields/inputs";
import { locales } from "@/locales";
import { EditorsStyles } from "@/fields/editors.scss";
import { linkEditor } from "@/fields/linkEditor";
import { propmtFieldEditorAsync } from "@/fields/editors";
import { FieldFactory } from "@/fields/fields";

type ImageFieldPayload = {
  src?: string;
  alt?: string;
  file?: bre.core.FileContent;
  link?: bre.core.field.LinkData;
};
type ImageFieldData = bre.core.field.FieldData<"image", ImageFieldPayload>;
type ImageField = bre.ui.Field<ImageFieldData>;

export const image: FieldFactory = ({ $element, preview, data }) => {
  if (!isValidFieldType<ImageFieldData>(data, "image")) {
    return null;
  }

  bind($element, data);

  if (preview) {
    return {
      $element
    };
  }

  const { fire: fireEvent, on, off } = emmiter<FieldEventMap>();

  let field: ImageField = {
    $element,
    data,
    on,
    off,
    bind,
    html,
    editor
  };

  $element.addEventListener("click", async () => {
    toggleFieldSelection(field, true);

    const updatedData = await propmtFieldEditorAsync(field);
    if (updatedData !== null) {
      bind(field.$element, updatedData);
      updateFieldData(field, updatedData, fireEvent);
    }
  });

  return field;
};

const bind = ($element: HTMLElement, data: ImageFieldData) => {
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
};

const editor = (initialData: Readonly<ImageFieldData>) => {
  const data: ImageFieldData = {
    ...initialData
  };

  const $element = helpers.div<EditorsStyles>("bre-field-editor-root");

  const $previewImg = helpers.el<HTMLImageElement, EditorsStyles>({
    tag: "img",
    className: "bre-field-editor-preview-img",
    props: {
      src: getSrcOrFile(data)
    }
  });

  const $preview = helpers.div<EditorsStyles>("bre-field-editor-preview");
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
};

const html = (field: ImageField) => {
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
};

const getSrcOrFile = (data: ImageFieldPayload) =>
  data.src || (data.file !== undefined ? data.file.fileContent : "");
