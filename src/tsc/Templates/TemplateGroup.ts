import { Template } from "./Template";

    export class TemplateGroup {
        constructor(
            public name: string, 
            public templates: Template[]) {
        }
    }