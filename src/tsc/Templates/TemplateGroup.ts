import { Template } from "src/Template";

    export class TemplateGroup {
        constructor(
            public name: string, 
            public templates: Template[]) {
        }
    }