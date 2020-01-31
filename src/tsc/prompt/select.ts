import { FieldEditor } from "src/prompt/prompt";
import { helpers } from "src/helpers";

export const select: FieldEditor = ({ key, p, data }) => {
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
