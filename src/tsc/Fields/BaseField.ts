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

            public $field: JQuery;
            public name: string;
            public data: any;
            private onSelect: () => void;
            private onUpdate: (property, oldValue, newValue) => void;

            protected settings: (field: BaseField) => void;
            protected getSettingsEl(): JQuery {
                return null;
            }

            constructor($field: JQuery, data: any, onSelect: () => void, onUpdate: (property, oldValue, newValue) => void) {
                this.$field = $field;
                this.data = data;
                this.onSelect = onSelect;
                this.onUpdate = onUpdate;
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
                if (this._fields.hasOwnProperty(this.type)) {
                    delete this._fields[this.type];
                }

                // add field class to registered fields
                this._fields[this.type] = this;
            }

            public static createField(
                $field: JQuery, 
                data: any, 
                onSelect: () => void, 
                onUpdate: (property, oldValue, newValue) => void): BaseField {

                let fieldData = $field.data().breField;
                if (!fieldData) {
                    throw `There is no any data in field ${$field.html()}`;
                }

                // sometimes we 'accedently' put our data into single quotes, so let's try to correct it!
                if (typeof fieldData === 'string') {
                    fieldData = JSON.parse(fieldData.replace(/'/g, '"'));
                }

                if (!fieldData.name) {
                    throw `There is no name in data of field ${$field.html()}`;
                }

                // if data passed
                if (data) {
                    let addFieldData = {};
                    for (var idx = 0; idx < data.length; idx++) {
                        let field = data[idx];
                        if (field.name.toLowerCase() === fieldData.name.toLowerCase()) {
                            // get current field data
                            addFieldData = field;
                            break;
                        }
                    }

                    // if there is some additional data, pass it to data object
                    if (addFieldData) {
                        fieldData = $.extend(fieldData, addFieldData);
                    }
                }

                let type = fieldData.type;
                if (type != null) {
                    // find field constructor in registered fields
                    if (this._fields.hasOwnProperty(type)) {
                        const field = this._fields[type];
                        return new field($field, fieldData, onSelect, onUpdate);
                    }
                    else {
                        throw `${type} field not found`;
                    }
                }
                else {
                    throw `Field type not defined in data-bre-field attribute`;
                }
            }

            protected bind() { }

            protected selectBlock() {
                this.onSelect();
            }

            protected updateProperty(prop: string, value: any, fireUpdate:boolean = true) {                
                const oldValue = this.data[prop];                
                if(oldValue === value)
                    return;

                this.data[prop] = value;
                
                if(fireUpdate) {
                    this.onUpdate(prop, oldValue, value);
                }
            }
        }
    }
}