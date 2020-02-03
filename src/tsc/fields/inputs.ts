import { helpers } from "src/helpers";
import { EditorsStyles } from "src/fields/editors.scss";

type InputParams = {
  value: string | undefined;
  onUpdate: (value: string) => void;
  label?: string;
  placeholder?: string;
};

type InputParamsWithType = InputParams & { type: HTMLInputElement["type"] };

const renderInput = ({
  value,
  onUpdate,
  type,
  label,
  placeholder
}: InputParamsWithType) => {
  const $element = helpers.div<EditorsStyles>("bre-field-editor-prop");

  const update = () => {
    onUpdate($input.value);
  };

  const $input = helpers.el<HTMLInputElement, EditorsStyles>({
    tag: "input",
    className: "bre-field-editor-input",
    props: {
      type,
      value: value || "",
      placeholder: placeholder || "",
      onchange: update,
      onkeyup: update,
      onpaste: update
    }
  });

  if (label !== undefined) {
    const $label = helpers.el<HTMLLabelElement, EditorsStyles>({
      tag: "label",
      className: "bre-field-editor-label",
      innerHTML: label,
      props: {
        onclick: () => $input.focus()
      }
    });

    $element.append($label);
  }

  $element.append($input);
  return $element;
};

export const inputTextLine = (params: InputParams) =>
  renderInput({ ...params, type: "text" });

export const inputFile = (params: InputParams) =>
  renderInput({ ...params, type: "file" });
