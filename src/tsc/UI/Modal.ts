namespace BrickyEditor {
    export class Modal {

        public closeFunction: any;
        private selectionRanges: any[];

        constructor(
            private $control: JQuery,
            private $closeBtn: JQuery,
            private $form: JQuery,
            private $btns: JQuery,
            private $okBtn: JQuery,
            private $cancelBtn: JQuery) {

            var modal = this;

            $closeBtn.on('click', function () {
                modal.hideModal();
            });
        }

        public hideModal() {
            this.restoreSelection();
            this.$control.fadeOut();
        }

        public showModal($html?: JQuery, showBtns: boolean = true) {
            this.saveSelection();
            this.$btns.toggle(showBtns);

            if ($html) {
                this.$form.append($html);
                if (!$html.is(':visible')) {
                    $html.show();
                }
            }

            this.$control.fadeIn();
        }

        public promptAsync(fields: Array<Prompt.PromptParameter>): Promise<Prompt.PromptParameterList> {
            const modal = this;

            return new Promise<Prompt.PromptParameterList>((resolve, reject) => {
                //  clear form
                modal.$form.children().not(this.$btns).remove();

                // add fields
                fields.forEach(field => {
                    this.$btns.before(field.$control);
                });

                modal.$okBtn.on('click', () => {
                    fields.forEach(field => field.parseValue());
                    modal.hideModal();
                    const list = new Prompt.PromptParameterList(fields);
                    resolve(list);
                });

                modal.$cancelBtn.on('click', () => {
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
}