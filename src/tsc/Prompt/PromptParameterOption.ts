namespace BrickyEditor {
    export namespace Prompt {
        export class PromptParameterOption {
            public title: string;
            public value: any;
            public selected: Boolean;

            constructor(title: string, value: any, selected: Boolean = false) {
                this.title = title;
                this.value = value;
                this.selected = selected;
            }
        }
    }
}