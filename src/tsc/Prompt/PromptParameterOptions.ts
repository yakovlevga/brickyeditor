namespace BrickyEditor {
    export namespace Prompt {
        export class PromptParameterOptions extends PromptParameter {
            public options: Array<PromptParameterOption>;

            constructor(key: string, title: string, options: Array<Array<any>>, value?: any, placeholder? : string) {
                super(key, title, value, placeholder);

                this.options = [];
                options.forEach(kv => {
                    this.options.push(new PromptParameterOption(kv[0], kv[1], kv[1] == value));
                });      
            }

            protected getEditor() {
                var options = this.options.map(opt => {
                    return `<option value="${opt.value}" ${opt.selected ? "selected" : ""}>${opt.title ? opt.title : opt.value}</option>`;
                });
                return $(`<select type="text" id="${this.key}" class="brickyeditor-input" placeholder="${this.placeholder}">${options}</select>`);
            }
        }
    }
}