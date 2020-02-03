import { bre } from "src/types/bre";
import { locales } from "src/locales";

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
