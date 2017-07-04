namespace BrickyEditor {
    export namespace Prompt {
        export class PromptParameterList {
            params: Array<PromptParameter>;

            constructor(params: Array<PromptParameter>) {
                this.params = params;
            }

            getValue(key: string) : any {
                let param = this.params.find(p => {
                    return p.key === key;
                });
                return param ? param.value : null
            }
        }
    }
}