import { $dom } from "../Common/DOMHelpers";
import { PromptParameterList, PromptParameter } from "../Prompt/Prompt";

export class Modal {

    public closeFunction: any;
    private selectionRanges: any[];

    constructor(
        private $control: HTMLElement,
        private $closeBtn: HTMLElement,
        private $form: HTMLElement,
        private $btns: HTMLElement,
        private $okBtn: HTMLElement,
        private $cancelBtn: HTMLElement) {

        const modal = this;
        $dom.on($closeBtn, 'click', function () {
            modal.hideModal();
        });
    }

    public hideModal() {
        this.restoreSelection();
        $dom.hide(this.$control);
    }

    public showModal($html?: HTMLElement, showBtns: boolean = true) {
        this.saveSelection();
        $dom.toggle(this.$btns, showBtns);

        if ($html) {
            this.$form.appendChild($html);
            if ($dom.isHidden($html)) {
                $dom.show($html);
            }
        }
        $dom.show(this.$control);
    }

    public promptAsync(fields: Array<PromptParameter>): Promise<PromptParameterList> {
        const modal = this;

        return new Promise<PromptParameterList>((resolve, reject) => {
            //  clear form                
            for (var i = 0; i < modal.$form.children.length; i++) {
                var child = modal.$form.children[i];
                if (child != this.$btns) {
                    modal.$form.removeChild(child);
                }
            }

            // add fields
            fields.forEach(field => {
                $dom.before(this.$btns, field.$control);
            });

            $dom.on(modal.$okBtn, 'click', () => {
                fields.forEach(field => field.parseValue());
                modal.hideModal();
                const list = new PromptParameterList(fields);
                resolve(list);
            });

            $dom.on(modal.$cancelBtn, 'click', () => {
                modal.hideModal();
                resolve(null);
            });

            modal.showModal();
        });
    }

    saveSelection() {
        let selection = window.getSelection();
        this.selectionRanges = [];
        for (var idx = 0; idx < selection.rangeCount; idx++) {
            this.selectionRanges.push(selection.getRangeAt(idx));
        }
    }

    restoreSelection() {
        if (!this.selectionRanges || this.selectionRanges.length == 0)
            return;

        let selection = window.getSelection();
        selection.removeAllRanges();
        this.selectionRanges.forEach(range => selection.addRange(range));
    }
}