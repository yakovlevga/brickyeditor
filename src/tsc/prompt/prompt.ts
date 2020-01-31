import { helpers } from "src/helpers";
import { locales } from "src/locales";
import { bre } from "src/types/bre";

import { text } from "src/prompt/text";
import { file } from "src/prompt/file";
import { select } from "src/prompt/select";

export type FieldEditor = (props: {
  key: string;
  p: bre.prompt.PromptParameter;
  data: { [TKey: string]: any };
}) => HTMLElement;

const parameterEditors: Record<bre.prompt.PromptParameterType, FieldEditor> = {
  text,
  file,
  select
};

type PromptResult<TParams> = Partial<Record<keyof TParams, any>> | null;

export const promptAsync = <TParams extends bre.prompt.PromptParams>(
  params: TParams
) =>
  new Promise<PromptResult<TParams>>(resolve => {
    const result: PromptResult<TParams> = {};

    const editors = Object.keys(params).map(key => {
      const p = params[key];
      const editor = parameterEditors[p.type || "text"]({
        key,
        p,
        data: result
      });

      return editor;
    });

    helpers.showModal({
      content: editors,
      onOk: () => resolve(result),
      onCancel: () => resolve(null)
    });
  });

export type LinkPromptParams = {
  href: bre.prompt.PromptParameter;
  title: bre.prompt.PromptParameter;
  target: bre.prompt.PromptParameter;
};

export const getLinkPromptParams = (
  link?: HTMLLinkElement
): LinkPromptParams => ({
  title: {
    title: locales.prompt.link.title.title,
    placeholder: locales.prompt.link.title.placeholder,
    value: link ? link.getAttribute("title") : ""
  },
  href: {
    title: locales.prompt.link.href.title,
    placeholder: locales.prompt.link.href.placeholder,
    value: link ? link.getAttribute("href") : ""
  },
  target: {
    type: "select",
    title: locales.prompt.link.target.title,
    value: link ? link.getAttribute("target") : "",
    options: [
      { title: "", value: "" },
      { title: locales.prompt.link.target.blank, value: "_blank" },
      { title: locales.prompt.link.target.parent, value: "_parent" },
      { title: locales.prompt.link.target.self, value: "_self" },
      { title: locales.prompt.link.target.top, value: "_top" }
    ]
  }
});
