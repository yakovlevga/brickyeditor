import { bre } from "src/Types/bre";

export class TemplateGroup {
  constructor(public name: string, public templates: bre.core.ITemplate[]) {}
}
