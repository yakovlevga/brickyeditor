namespace BrickyEditor {
    export namespace Fields {
        export class BaseField {
            public name: string;
            public data: any;
            public type: string;
            protected block: Block;            
            protected $field: JQuery;            

            constructor(block: Block, $field: JQuery, data: any) {                
                this.block = block;
                this.$field = $field;
                this.name = TemplateService.getFieldValue($field, "name");
                this.type = TemplateService.getFieldValue($field, "type");
                this.data = data || {};
                this.bind();
            }

            public static getField(block: Block, $el: JQuery, data?: Fields.BaseField) : BaseField {
                let type = TemplateService.getFieldValue($el, "type");
                switch(type) {
                    case 'html':
                        return new HtmlField(block, $el, data);
                    case 'image':
                        return new ImageField(block, $el, data);
                    case 'embed':
                        return new EmbedField(block, $el, data);
                    default:
                        throw `${type} field not found`;
                }
            }

            protected bind() {}

            protected selectBlock() {
                this.block.editor.selectedBlock = this.block;
            }

            public getData() : any {
                return {
                    type: this.type,
                    name: this.name,
                    data: this.data
                };
            }
        }
    }
}