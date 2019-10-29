import { $dom } from "src/common/DOMHelpers";
import { BaseField } from "src/fields/BaseField";
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

    $dom.ons($field, "blur keyup paste input", () => {
      this.setHtml($field.innerHTML);
    });

    $dom.on($field, "paste", e => {
      e.preventDefault();
      const ev = e.originalEvent as any;
      const text = ev.clipboardData.getData("text/plain");
      document.execCommand("insertHTML", false, text);
    });

    $dom.on($field, "click", ev => {
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
