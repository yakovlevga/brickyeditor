import { PromptParameter } from "src/prompt/Prompt";

export class PromptParameterList {
  public params: PromptParameter[];

  constructor(params: PromptParameter[]) {
    this.params = params;
  }

  public getValue(key: string): any {
    const param = this.params.find(p => {
      return p.key === key;
    });
    return param ? param.value : null;
  }
}
