import { $dom } from "../Common/DOMHelpers";
import { Selectors } from "../UI/Selectors";
import { BaseField } from "./BaseField";
import { Editor } from "../Editor";
import { SelectionUtils } from "../UI/SelectionUtils";

export class HtmlField extends BaseField {

    bind() {
        let field = this;
        let $field = this.$field;

        if (!$dom.matches($field, Selectors.selectorContentEditable)) {
            $field.setAttribute(Selectors.attrContentEditable, 'true');
        }

        var html = this.data.html || this.$field.innerHTML;
        this.setHtml(html, false);
        $field.innerHTML = this.data.html;

        SelectionUtils.bindTextSelection($field, (rect) => {
            Editor.UI.htmlTools.show(rect);
        });

        $dom.ons($field, 'blur keyup paste input', ev => {
            this.setHtml($field.innerHTML);
        });

        $dom.on($field, 'paste', e => {
            e.preventDefault();
            let ev = e.originalEvent as any;
            let text = ev.clipboardData.getData('text/plain');
            document.execCommand("insertHTML", false, text);
        });

        $dom.on($field, 'click', ev => {
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

    setHtml(value: string, fireUpdate: boolean = true) {
        value = value.trim();
        if (this.$field.innerHTML !== value) {
            this.$field.innerHTML = value;
        }
        this.updateProperty('html', value, fireUpdate);
    }

    public getEl(): HTMLElement {
        let $el = super.getEl();
        $el.removeAttribute(Selectors.attrContentEditable);
        return $el;
    }
}
