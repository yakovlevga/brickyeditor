export class PromptParameterOption {
    public title: string;
    public value: any;
    public selected: boolean;

    constructor(title: string, value: any, selected: boolean = false) {
        this.title = title;
        this.value = value;
        this.selected = selected;
    }
}