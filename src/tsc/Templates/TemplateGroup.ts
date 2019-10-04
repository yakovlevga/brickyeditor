import { Template } from "src/templates/Template";

export class TemplateGroup {
  constructor(public name: string, public templates: Template[]) {}
}
