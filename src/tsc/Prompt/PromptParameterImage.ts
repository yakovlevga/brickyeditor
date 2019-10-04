import {
  PromptParameter,
  PromptParameterOption,
  PromptParameterImageResult,
  PromptParameterImageResultFile,
} from "src/Prompt/Prompt";
import { $dom } from "src/common/DOMHelpers";

export class PromptParameterImage extends PromptParameter {
  public options: Array<PromptParameterOption>;
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
    var field = this;
    var img =
      this.value && this.value.fileContent ? this.value.fileContent : "";
    var $editor = $dom.el(`
                <div class='bre-image-input'>
                    <label for="${this.key}">
                        ${this.placeholder}
                    </label>                        
                    <img src="${img}"/>                    
                    <input type="file" id="${this.key}" class="bre-input" placeholder="${this.placeholder}">
                </div>
                <small class='bre-image-input-filename'></small>`);

    var $file = $editor.querySelector<HTMLInputElement>("input");
    var $filePreview = $editor.querySelector<HTMLImageElement>("img");
    var $fileName = $editor.querySelector<HTMLElement>(
      ".bre-image-input-filename"
    );

    var value = this.value as PromptParameterImageResult;
    field.updatePreview($filePreview, $fileName, this.value);

    $file.onchange = () => {
      if ($file.files && $file.files[0]) {
        var reader = new FileReader();

        reader.onload = function(ev) {
          let target: any = ev.target;
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
    if (!value) return;

    $filePreview.src = value.fileContent;
    $filePreview.classList.add("bre-loaded");
    $fileName.innerText = value.fileInfo.name;
  }
}
