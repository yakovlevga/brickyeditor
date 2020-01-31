import { FieldEditor } from "src/prompt/prompt";
import { helpers } from "src/helpers";

export const file: FieldEditor = ({ key, p, data }) => {
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

  const updatePreview = async () => {
    if (file === undefined || file === null) {
      fileName.innerText = "";
      filePreview.src = "//:0";
    } else {
      fileName.innerText = file.name;
      const fileContent = await helpers.readFileAsync(file);
      filePreview.src = fileContent;
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
