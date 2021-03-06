namespace BrickyEditor {
    export namespace Prompt {
        export class PromptParameter {
            public key: string;
            public title: string;
            public placeholder: string;
            public value: any;

            protected _$control: JQuery;
            protected $input: JQuery;

            constructor(key: string, title: string, value: any, placeholder?: string) {
                this.key = key;
                this.title = title;
                this.placeholder = placeholder || '';
                this.value = value;
            }

            public parseValue() {
                if(this.$input) {
                    this.value = this.$input.val();
                }
                this.$control = null
                delete this._$control;
            }

            public get $control(): JQuery {
                if (!this._$control) {
                    this._$control =
                        $(`<div class=${this.key ? "bre-prompt-field" : "bre-prompt-subtitle"}>
                            <label class="bre-label" for="${this.key}">${this.title ? this.title : 'Select file...'}</label>
                        </div>`);
                    this.$input = this.key ? this.getEditor() : null;
                    if(this.$input != null) {
                        this._$control.append(this.$input);
                    }
                }

                return this._$control;
            }

            protected getEditor() {
                var value = this.value || '';
                return $(`<input type="text" id="${this.key}" class="bre-input" placeholder="${this.placeholder}" value="${this.value ? this.value : ''}">`);
            }

            public set $control(value: JQuery) {
                this._$control = value;
            }
        }
    }
}