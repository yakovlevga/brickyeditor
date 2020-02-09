import {
  FieldFactory,
  getCleanFieldElement,
  toggleFieldSelection,
  updateFieldData,
  isValidFieldType
} from "src/fields/field";
import { bre } from "src/types/bre";
import { toggleHtmlTools } from "src/ui/htmlTools";
import { SelectionUtils } from "src/ui/SelectionUtils";
import { Selectors } from "src/ui/Selectors";
import { emmiter, FieldEventMap } from "src/emmiter";

type HtmlFieldType = "html";
type HtmlFieldPayload = {
  html?: string;
};
type HtmlFieldData = bre.core.field.FieldData<HtmlFieldType, HtmlFieldPayload>;
type HtmlField = bre.ui.Field<HtmlFieldData>;

export const html: FieldFactory = ({ $element, preview, data }) => {
  if (!isValidFieldType<HtmlFieldData>(data, "html")) {
    return null;
  }

  bind($element, data);

  if (!preview) {
    return {
      $element
    };
  }

  const { fire: fireEvent, on, off } = emmiter<FieldEventMap>();
  let field: HtmlField = {
    $element,
    data,
    on,
    off,
    bind,
    html: getHtml
  };

  const updateHtmlProp = () => {
    const html = $element.innerHTML.trim();
    if ($element.innerHTML !== html) {
      const updatedData = {
        html
      };
      updateFieldData(field, updatedData, fireEvent);
    }
  };

  $element.setAttribute(Selectors.attrContentEditable, "true");

  SelectionUtils.bindTextSelection($element, rect => {
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
    toggleFieldSelection(field, true, fireEvent);
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
  $copy.removeAttribute(Selectors.attrContentEditable);
  return $copy;
};
