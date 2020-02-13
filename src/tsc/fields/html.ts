import {
  getCleanFieldElement,
  toggleFieldSelection,
  updateFieldData,
  isValidFieldType
} from "@/fields/field";
import { bre } from "@/types/bre";
import { toggleHtmlTools } from "@/ui/htmlTools";
import { bindTextSelection } from "@/ui/selection";
import { emitter } from "@/emitter";
import { FieldFactory } from "@/fields/fields";

type HtmlFieldType = "html";
type HtmlFieldPayload = {
  html?: string;
};
type HtmlFieldData = bre.field.FieldData<HtmlFieldType, HtmlFieldPayload>;
type HtmlField = bre.field.Field<HtmlFieldData>;

const MaxPreviewLength = 50;

export const html: FieldFactory = ({ $element, preview, data }) => {
  if (!isValidFieldType<HtmlFieldData>(data, "html")) {
    return null;
  }

  if (preview) {
    $element.innerHTML =
      $element.innerHTML.length > MaxPreviewLength
        ? $element.innerHTML.substr(0, MaxPreviewLength) + "..."
        : $element.innerHTML;

    return {
      $element
    };
  }

  bind($element, data);

  const eventEmiter = emitter<bre.field.FieldEventMap>();
  let field: HtmlField = {
    ...eventEmiter,
    $element,
    data,
    bind,
    html: getHtml
  };

  const updateHtmlProp = () => {
    const html = $element.innerHTML.trim();
    if ($element.innerHTML !== html) {
      const updatedData = {
        html
      };
      updateFieldData(field, updatedData);
    }
  };

  $element.setAttribute("contenteditable", "true");

  bindTextSelection($element, rect => {
    toggleHtmlTools(rect);
  });

  $element.addEventListener("blur", updateHtmlProp);
  $element.addEventListener("keyup", updateHtmlProp);
  $element.addEventListener("paste", updateHtmlProp);
  $element.addEventListener("input", updateHtmlProp);

  $element.addEventListener("paste", (ev: ClipboardEvent) => {
    ev.preventDefault();
    if (ev.clipboardData) {
      const text = ev.clipboardData.getData("text/plain");
      document.execCommand("insertHTML", false, text);
    }
  });

  $element.addEventListener("click", () => {
    toggleFieldSelection(field, true);
    return false;
  });

  return field;
};

const bind = ($element: HTMLElement, { html }: HtmlFieldData) => {
  if (html !== undefined) {
    $element.innerHTML = html;
  }
};

const getHtml = (field: HtmlField) => {
  const $copy = getCleanFieldElement(field.$element);
  $copy.removeAttribute("contenteditable");
  return $copy;
};
