namespace BrickyEditor {
    export namespace Prompt {
        export class PromptParameter {
            public key: string;
            public title: string;
            public placeholder: string;
            public value: any;

            protected _$control: HTMLElement;
            protected $input: HTMLInputElement;

            constructor(key: string, title: string, value: any, placeholder?: string) {
                this.key = key;
                this.title = title;
                this.placeholder = placeholder || '';
                this.value = value;
            }

            public parseValue() {
                if(this.$input) {
                    this.value = this.$input.value;
                }
                this.$control = null
                delete this._$control;
            }

            public get $control(): HTMLElement {
                if (!this._$control) {
                    this._$control = $dom.el(
                        `<div class=${this.key ? "bre-prompt-field" : "bre-prompt-subtitle"}>
                            <label class="bre-label" for="${this.key}">${this.title ? this.title : 'Select file...'}</label>
                        </div>`);

                    this.$input = this.key ? this.getEditor() as HTMLInputElement : null;
                    if(this.$input != null) {
                        this._$control.appendChild(this.$input);
                    }
                }

                return this._$control;
            }

            protected getEditor() : HTMLElement {
                var $input = document.createElement('input');
                $input.id = this.key;
                $input.className = 'bre-input' 
                $input.setAttribute('type', 'text');
                $input.setAttribute('placeholder', this.placeholder);
                $input.value = this.value || '';
                return $input;
            }

            public set $control(value: HTMLElement) {
                this._$control = value;
            }
        }
    }
}