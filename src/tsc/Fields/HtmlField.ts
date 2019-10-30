import { $dom } from "src/common/DOMHelpers";
import { BaseField } from "src/fields/BaseField";
import { helpers } from "src/helpers";
import { toggleHtmlTools } from "src/UI/htmlTools";
import { SelectionUtils } from "src/ui/SelectionUtils";
import { Selectors } from "src/ui/Selectors";

export class HtmlField extends BaseField {
  public bind() {
    const field = this;
    const $field = this.$field;

    if (!$dom.matches($field, Selectors.selectorContentEditable)) {
      $field.setAttribute(Selectors.attrContentEditable, "true");
    }

    const html = this.data.html || this.$field.innerHTML;
    this.setHtml(html, false);
    $field.innerHTML = this.data.html;

    SelectionUtils.bindTextSelection($field, rect => {
      toggleHtmlTools(rect);
    });

    helpers.addEventListeners($field, "blur keyup paste input", () => {
      this.setHtml($field.innerHTML);
    });

    $field.addEventListener("paste", ev => {
      ev.preventDefault();
      // const ev = e.originalEvent as any;
      debugger;
      if (ev.clipboardData) {
        const text = ev.clipboardData.getData("text/plain");
        document.execCommand("insertHTML", false, text);
      }
    });

    $field.addEventListener("click", ev => {
      // Prevents the event from bubbling up the DOM tree
      field.select();
      ev.stopPropagation();
      return false;
    });

    // $field
    //     .on('blur keyup paste input', () => {
    //         this.setHtml($field.html());
    //     })
    //     .on('paste', (e) => {
    //         e.preventDefault();
    //         let ev = e.originalEvent as any;
    //         let text = ev.clipboardData.getData('text/plain');
    //         document.execCommand("insertHTML", false, text);
    //     })
    //     .on('click', (ev) => {
    //         // Prevents the event from bubbling up the DOM tree
    //         field.select();
    //         ev.stopPropagation();
    //         return false;
    //     });
  }

  public setHtml(value: string, fireUpdate: boolean = true) {
    value = value.trim();
    if (this.$field.innerHTML !== value) {
      this.$field.innerHTML = value;
    }
    this.updateProperty("html", value, fireUpdate);
  }

  public getEl(): HTMLElement {
    const $el = super.getEl();
    $el.removeAttribute(Selectors.attrContentEditable);
    return $el;
  }
}
