import { helpers } from "src/helpers";
import { locales } from "src/locales";
import { bre } from "src/types/bre";

type FieldEditor = (props: {
  key: string;
  p: bre.prompt.PromptParameter;
  data: { [TKey: string]: any };
}) => HTMLElement;

const textFieldEditor: FieldEditor = ({ key, p, data }) => {
  const html = `<input type='text' name='${key}' placeholder='${
    p.placeholder
  }' value='${p.value || ""}' />`;
  const input = helpers.createElement<HTMLInputElement>(html);
  input.onchange = () => {
    data[key] = input.value;
  };
  return input;
};

const fileFieldEditor: FieldEditor = ({ key, p, data }) => {
  let file: File | null = data[key];

  const filePreview = helpers.createElement<HTMLImageElement>(
    `<img src="${p.value}"/>`
  );
  const fileInput = helpers.createElement<HTMLInputElement>(
    `<input type="file" id="bre-modal-modal-${key}" class="bre-input" placeholder="${p.placeholder}">`
  );
  const fileName = helpers.createElement(
    `<span class='bre-image-input-filename'></span>`
  );

  const updatePreview = () => {
    if (file === undefined || file === null) {
      fileName.innerText = "";
      filePreview.src = "//:0";
    } else {
      fileName.innerText = file.name;
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target !== null && ev.target.result !== null) {
          filePreview.src = ev.target.result.toString();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  fileInput.onchange = () => {
    file = fileInput.files && fileInput.files[0];
    updatePreview();
    data[key] = file;
  };

  updatePreview();

  const editor = helpers.createElement(`<div class='bre-image-input'>
    <label for="bre-modal-modal-${key}">
      ${p.placeholder}
    </label>
  </div>`);

  editor.append(filePreview, fileInput, fileName);
  return editor;
};

const selectFieldEditor: FieldEditor = ({ key, p, data }) => {
  if (p.options === undefined) {
    throw new Error("Empty options");
  }

  const options = p.options
    .map(
      o =>
        `<option value="${o.title}" ${o.value === p.value ? "selected" : ""}>${
          o.title
        }</option>`
    )
    .join("\n");
  const html = `<select name='${key}' placeholder='${p.placeholder}'>${options}</select>`;
  const select = helpers.createElement<HTMLSelectElement>(html);
  select.onchange = () => {
    data[key] = select.value;
  };
  return select;
};

const parameterEditors: {
  [TKey in bre.prompt.PromptParameterType]: FieldEditor;
} = {
  text: textFieldEditor,
  file: fileFieldEditor,
  select: selectFieldEditor,
};

export const promptAsync = <TParams extends bre.prompt.PromptParameters>(
  params: TParams
): Promise<
  | {
      [TKey in keyof TParams]?: string;
    }
  | null
> =>
  new Promise<
    | {
        [TKey in keyof TParams]?: any;
      }
    | null
  >(resolve => {
    const result: {
      [TKey in keyof TParams]?: any;
    } = {};

    const editors = Object.keys(params).map(key => {
      const p = params[key];
      const editor = parameterEditors[p.type || "text"]({
        key,
        p,
        data: result,
      });

      return editor;
    });

    helpers.showModal({
      content: editors,
      onOk: () => resolve(result),
      onCancel: () => resolve(null),
    });
  });

export type LinkPromptParams = {
  href: bre.prompt.PromptParameter;
  title: bre.prompt.PromptParameter;
  target: bre.prompt.PromptParameter;
};

export const getLinkPromptParams = (
  link?: HTMLLinkElement
): LinkPromptParams => ({
  title: {
    title: locales.prompt.link.title.title,
    placeholder: locales.prompt.link.title.placeholder,
    value: link ? link.getAttribute("title") : "",
  },
  href: {
    title: locales.prompt.link.href.title,
    placeholder: locales.prompt.link.href.placeholder,
    value: link ? link.getAttribute("href") : "",
  },
  target: {
    type: "select",
    title: locales.prompt.link.target.title,
    value: link ? link.getAttribute("target") : "",
    options: [
      { title: "", value: "" },
      { title: locales.prompt.link.target.blank, value: "_blank" },
      { title: locales.prompt.link.target.parent, value: "_parent" },
      { title: locales.prompt.link.target.self, value: "_self" },
      { title: locales.prompt.link.target.top, value: "_top" },
    ],
  },
});
