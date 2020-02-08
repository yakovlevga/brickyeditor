import { bre } from "src/types/bre";
import { helpers } from "src/helpers";
import { EditorsStyles } from "src/fields/editors.scss";
import { renderInput, renderSelect } from "src/fields/inputs";
import { locales } from "src/locales";

export const linkEditor = (initialData?: Readonly<bre.core.field.LinkData>) => {
  const data = initialData ? { ...initialData } : {};

  const $element = helpers.div<EditorsStyles>("bre-field-editor-root");

  const $href = renderInput({
    ...locales.prompt.link.href,
    value: data.href,
    type: "text",
    onUpdate: v => (data.href = v)
  });

  const $title = renderInput({
    ...locales.prompt.link.title,
    value: data.title,
    type: "text",
    onUpdate: v => (data.title = v)
  });

  const $target = renderSelect({
    ...locales.prompt.link.target,
    value: data.target,
    options: [
      { value: "" },
      { value: "_blank" },
      { value: "_self" },
      { value: "_parent" },
      { value: "_top" }
    ],
    onUpdate: v => (data.target = v)
  });

  $element.append($href, $title, $target);

  return {
    $element,
    data
  };
};
