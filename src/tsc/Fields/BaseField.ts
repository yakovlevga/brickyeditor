namespace BrickyEditor {
    export namespace Fields {
        export abstract class BaseField {
            private static _fields: any = {};

            public static get type(): string {
                var name = (<any>this).name;
                name = name.replace('Field', '');
                name = name.substring(0, 1).toLowerCase() + name.substring(1);
                return name;
            }

            public name: string;
            public data: any;

            protected block: Block;            
            protected $field: JQuery;
            
            protected settings: (field: BaseField) => void;
            protected getSettingsEl(): JQuery {
                return null;
            }

            constructor(block: Block, $field: JQuery, data: any) {
                this.$field = $field;
                this.block = block;
                this.data = data;
                this.bind();
            }

            /**
             * Register Field Type
             */
            public static registerCommonFields() {
                HtmlField.registerField();
                ImageField.registerField();
                EmbedField.registerField();
            };

            private static registerField() {
                // check if already registered to avoid dublicates
                if(this._fields.hasOwnProperty(this.type)) {
                    delete this._fields[this.type];
                }
                
                // add field class to registered fields
                this._fields[this.type] = this;
            }

            public static createField(block, $el: JQuery, data) : BaseField {
                let fieldData = $el.data().breField;
                
                if (!fieldData) {
                    throw `There is no any data in field ${$el.html()} of block ${block.name}`;
                }

                // sometimes we 'accedently' put our data into single quotes, so let's try to correct it!
                if(typeof fieldData === 'string') {
                    fieldData = JSON.parse(fieldData.replace(/'/g, '"'));
                }

                if (!fieldData.name) {
                    throw `There is no name in data of field ${$el.html()} of block ${block.name}`;
                }

                // if data passed
                if(data) {                    
                    let addFieldData = {};
                    for (var idx = 0; idx < data.length; idx++) {
                        let field = data[idx];
                        if(field.name.toLowerCase() === fieldData.name.toLowerCase()) {
                            // get current field data
                            addFieldData = field;
                            break;
                        }
                    }

                    // if there is some additional data, pass it to data object
                    if(addFieldData) {
                        fieldData = $.extend(fieldData, addFieldData);
                    }
                }

                let type = fieldData.type;                
                if(type != null) {
                    // find field constructor in registered fields
                    if(this._fields.hasOwnProperty(type)){
                        var field = this._fields[type];
                        return new field(block, $el, fieldData);
                    }
                    else {
                        throw `${type} field not found`;
                    }
                }
                else {
                    throw `Field type not defined in data-bre-field attribute`;
                }
            }

            protected bind() {}

            protected selectBlock() {
                this.block.select();
            }
        }
    }
}