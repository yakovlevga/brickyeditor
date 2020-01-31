import { FieldEditor } from "src/prompt/prompt";
import { helpers } from "src/helpers";

export const text: FieldEditor = ({ key, p, data }) => {
  const html = `<input type='text' name='${key}' placeholder='${
    p.placeholder
  }' value='${p.value || ""}' />`;
  const input = helpers.createElement<HTMLInputElement>(html);
  input.onchange = () => {
    data[key] = input.value;
  };
  return input;
};
