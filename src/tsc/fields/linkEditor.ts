import { bre } from "@/types/bre";
import { helpers } from "@/helpers";
import { renderInput, renderSelect } from "@/fields/inputs";
import { locales } from "@/locales";

export const linkEditor = (initialData?: Readonly<bre.core.field.LinkData>) => {
  const data = initialData ? { ...initialData } : {};

  const $element = helpers.div("bre-field-editor-root");

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
