import {
  FieldFactory,
  getFieldElement,
  isValidFieldType,
  updateFieldData,
  toggleFieldSelection
} from "src/fields/field";
import { helpers } from "src/helpers";
import { bre } from "src/types/bre";
import { emmiter, FieldEventMap } from "src/emmiter";
import { renderInput } from "src/fields/inputs";
import { locales } from "src/locales";
import { EditorsStyles } from "src/fields/editors.scss";
import { linkEditor } from "src/fields/linkEditor";

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

  const isImageElement = $element.tagName.toLowerCase() === "img";

  const updateImageElement = (data: ImageFieldData) => {
    const src = getSrcOrFile(data);
    const alt = data.alt || "";

    if (isImageElement) {
      const image = $element as HTMLImageElement;
      image.src = src;
      image.alt = alt;
    } else {
      $element.style.backgroundImage = `url(${src})`;
    }

    $element.title = alt;
  };

  // set initial image
  if (data.src || data.file) {
    updateImageElement(data);
  }

  let field: ImageField = {
    $element,
    data
  };

  if (!preview) {
    const { fire: fireEvent, on, off } = emmiter<FieldEventMap>();
    field.on = on;
    field.off = off;

    field.cleanup = () => {
      const $elementCopy = getFieldElement($element);
      const { link } = field.data;

      if (link !== undefined && link.href !== undefined && link.href.length) {
        const $link = helpers.el<HTMLLinkElement>({
          tag: "a",
          props: link
        });
        $link.appendChild($elementCopy);

        return $link;
      }

      return $elementCopy;
    };

    $element.addEventListener("click", async () => {
      fireEvent("focus", { field });

      if (await propmtEditorAsync(field)) {
        updateImageElement(field.data);
        updateFieldData(field, field.data, fireEvent);
        toggleFieldSelection(field, true);
      }
    });
  }

  return field;
};

const propmtEditorAsync = (f: ImageField) =>
  new Promise<boolean>(resolve => {
    const imageEditor = editor(f.data);

    helpers.showModal({
      content: [imageEditor.$element],

      onOk: () => {
        f.data = imageEditor.data;
        resolve(true);
      },

      onCancel: resolve
    });
  });

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

  const { $element: $linkEl, data: linkData } = linkEditor(initialData.link);
  $element.append($preview, $src, $file, $alt, $linkEl);
  data.link = linkData;

  return {
    $element,
    data
  };
};

const getSrcOrFile = (data: ImageFieldPayload) =>
  data.src || (data.file !== undefined ? data.file.fileContent : "");
