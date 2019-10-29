import { helpers } from "src/helpers";
import { bre } from "src/Types/bre";

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
  let file: File = data[key];

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
    if (file === undefined) {
      fileName.innerText = "";
      filePreview.src = null;
    } else {
      fileName.innerText = file.name;
      const reader = new FileReader();
      reader.onload = ev => {
        filePreview.src = ev.target.result.toString();
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

const parameterEditors: {
  [TKey in bre.prompt.PromptParameterType]: FieldEditor;
} = {
  text: textFieldEditor,
  file: fileFieldEditor,
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
