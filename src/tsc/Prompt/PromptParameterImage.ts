import { $dom } from "src/common/DOMHelpers";
import {
  PromptParameter,
  PromptParameterImageResult,
  PromptParameterImageResultFile,
  PromptParameterOption,
} from "src/Prompt/Prompt";

export class PromptParameterImage extends PromptParameter {
  public options: PromptParameterOption[];
  private _value: PromptParameterImageResult;

  constructor(
    key: string,
    title: string,
    value?: PromptParameterImageResult,
    placeholder?: string
  ) {
    super(key, title, value, placeholder);

    if (value) {
      this._value = value;
    }
  }

  public parseValue() {
    this.value = this._value;
    this.$control = null;
    delete this._$control;
    this._value = null;
    delete this._value;
  }

  protected getEditor() {
    const field = this;
    const img =
      this.value && this.value.fileContent ? this.value.fileContent : "";
    const $editor = $dom.el(`
                <div class='bre-image-input'>
                    <label for="${this.key}">
                        ${this.placeholder}
                    </label>                        
                    <img src="${img}"/>                    
                    <input type="file" id="${this.key}" class="bre-input" placeholder="${this.placeholder}">
                </div>
                <small class='bre-image-input-filename'></small>`);

    const $file = $editor.querySelector<HTMLInputElement>("input");
    const $filePreview = $editor.querySelector<HTMLImageElement>("img");
    const $fileName = $editor.querySelector<HTMLElement>(
      ".bre-image-input-filename"
    );

    const value = this.value as PromptParameterImageResult;
    field.updatePreview($filePreview, $fileName, this.value);

    $file.onchange = () => {
      if ($file.files && $file.files[0]) {
        const reader = new FileReader();

        reader.onload = ev => {
          const target: any = ev.target;
          field._value = new PromptParameterImageResult();
          field._value.fileContent = target.result;
          field._value.fileInfo = new PromptParameterImageResultFile(
            $file.files[0]
          );

          field.updatePreview($filePreview, $fileName, field._value);
        };

        reader.readAsDataURL($file.files[0]);
      }
    };

    return $editor;
  }

  private updatePreview(
    $filePreview: HTMLImageElement,
    $fileName: HTMLElement,
    value: PromptParameterImageResult
  ) {
    if (!value) {
      return;
    }

    $filePreview.src = value.fileContent;
    $filePreview.classList.add("bre-loaded");
    $fileName.innerText = value.fileInfo.name;
  }
}
