import { bre } from "@/types/bre";
import { helpers } from "@/helpers";
import { renderInput, renderSelect } from "@/fields/inputs";

export const linkEditor = (initialData?: Readonly<bre.LinkData>) => {
  const data = initialData ? { ...initialData } : {};

  const $element = helpers.div("bre-field-editor-root");

  const $href = renderInput({
    title: helpers.msg("link.url.title"),
    placeholder: helpers.msg("link.url.placeholder"),
    value: data.href,
    type: "text",
    onUpdate: (v) => (data.href = v),
  });

  const $title = renderInput({
    title: helpers.msg("link.title.title"),
    placeholder: helpers.msg("link.title.placeholder"),
    value: data.title,
    type: "text",
    onUpdate: (v) => (data.title = v),
  });

  const $target = renderSelect({
    title: helpers.msg("link.target.title"),
    value: data.target,
    options: [
      { value: "" },
      { value: "_blank" },
      { value: "_self" },
      { value: "_parent" },
      { value: "_top" },
    ],
    onUpdate: (v) => (data.target = v),
  });

  $element.append($href, $title, $target);

  return {
    $element,
    data,
  };
};
