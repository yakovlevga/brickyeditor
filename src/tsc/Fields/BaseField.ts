namespace BrickyEditor {
    export namespace Fields {
        export class BaseField {
            public name: string;
            public type: string;
            protected block: Block;            
            protected $field: JQuery;            

            
            protected _data : any;
            public get data() : any {
                return this._data;
            }
            public set data(v : any) {
                this._data = v;
            }            

            private static fields = {
                'html': (block, $el, data) => { return new HtmlField(block, $el, data); },
                'image': (block, $el, data) => { return new ImageField(block, $el, data); },
                'embed': (block, $el, data) => { return new EmbedField(block, $el, data); },
                'container': (block, $el, data) => { return new ContainerField(block, $el, data); }
            };

            constructor(block: Block, $field: JQuery, data: any) {                
                this.block = block;
                this.$field = $field;
                this.name = Services.TemplateService.getFieldValue($field, "name");
                this.type = Services.TemplateService.getFieldValue($field, "type");
                this.data = data || {};
                this.bind();
            }

            public static getField(block: Block, $el: JQuery, data?: Fields.BaseField) : BaseField {
                let type = Services.TemplateService.getFieldValue($el, "type");
                let fieldClass = this.fields[type];
                if(fieldClass) {                    
                    return fieldClass(block, $el, data);                        
                }
                else {
                    throw `${type} field not found`;
                }
            }

            protected bind() {}

            protected selectBlock(container?: Container) {
                this.block.container.selectedBlock.selectBlock(this, container);
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