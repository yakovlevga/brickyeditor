import {
  FieldFactory,
  getFieldElement,
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
  html: string;
};
type HtmlFieldData = bre.core.field.FieldData<HtmlFieldType, HtmlFieldPayload>;
type HtmlField = bre.ui.Field<HtmlFieldData>;

const maxLength = 30;
function previewText(value: string) {
  return value.length > 100 ? value.substr(0, maxLength) + "..." : value;
}

export const html: FieldFactory = ({ $element, preview, data }) => {
  if (!isValidFieldType<HtmlFieldData>(data, "html")) {
    return null;
  }

  let field: HtmlField = {
    $element,
    data
  };

  if (data.html) {
    $element.innerHTML = data.html;
  }

  if (!preview) {
    const { fire: fireEvent, on, off } = emmiter<FieldEventMap>();
    field.on = on;
    field.off = off;

    field.cleanup = () => {
      const $copy = getFieldElement($element);
      $copy.removeAttribute(Selectors.attrContentEditable);
      return $copy;
    };

    const updateHtmlProp = () => {
      const html = $element.innerHTML.trim();
      if ($element.innerHTML !== html) {
        const updatedData = {
          html
        };
        //field.$field.innerHTML = value;
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
      // Prevents the event from bubbling up the DOM tree
      toggleFieldSelection(field, true, fireEvent);
      // ev.stopPropagation();
      return false;
    });

    // $element.addEventListener("blur", () => {
    //   toggleFieldSelection(field, false, fireEvent);
    // });
  }

  return field;
};
