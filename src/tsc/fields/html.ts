import {
  getCleanFieldElement,
  updateFieldData,
  isValidFieldType
} from "@/fields/field";
import { bre } from "@/types/bre";
import { toggleHtmlTools } from "@/ui/htmlTools";
import { bindTextSelection } from "@/ui/selection";
import { FieldFactory } from "@/fields/fields";
import { selectField } from "@/editorState";

type HtmlFieldType = "html";
type HtmlFieldPayload = {
  html?: string;
};
type HtmlFieldData = bre.field.FieldData<HtmlFieldType, HtmlFieldPayload>;
type HtmlField = bre.field.Field<HtmlFieldData>;

const MaxPreviewLength = 50;

export const html: FieldFactory = props => {
  const { $element, data } = props;

  if (!isValidFieldType<HtmlFieldData>(data, "html")) {
    return null;
  }

  if (props.preview) {
    $element.innerHTML =
      $element.innerHTML.length > MaxPreviewLength
        ? $element.innerHTML.substr(0, MaxPreviewLength) + "..."
        : $element.innerHTML;

    return {
      $element
    };
  }

  bind($element, data);

  let field: HtmlField = {
    parentBlock: props.parentBlock,
    $element,
    data,
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

  $element.addEventListener("click", ev => {
    ev.stopPropagation();
    selectField(field);
  });

  return field;
};

function bind($element: HTMLElement, { html }: HtmlFieldData) {
  if (html !== undefined) {
    $element.innerHTML = html;
  }
}

function getHtml(field: HtmlField) {
  const $copy = getCleanFieldElement(field.$element);
  $copy.removeAttribute("contenteditable");
  return $copy;
}
