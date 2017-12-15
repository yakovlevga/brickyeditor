namespace BrickyEditor {
    export namespace Fields {
        export class ImageField extends BaseField {

            bind() {
                let field = this;
                let $field = this.$field;
                let data = this.data;

                this.setSrc(this.data.src, false);
                $field.on('click', async () => {
                    const fields = await Editor.UI.modal.promptAsync(field.getPromptParams());
                    if(fields != null) {
                        const file = fields.getValue('file');
                        const src = fields.getValue('src');
                        if (file) {
                            field.setFile(file);
                            field.setSrc(null);
                        }
                        else if (src) {
                            field.setSrc(src);
                            field.setFile(null);
                        }

                        let alt = fields.getValue('alt');
                        field.setAlt(alt);
                    }
                    field.select();
                });
            }

            private getPromptParams(): Array<Prompt.PromptParameter> {
                return [
                    new Prompt.PromptParameter('src', 'Image Link', this.data.url, 'image url'),
                    new Prompt.PromptParameterImage('file', 'or Upload file', this.data.file, 'select file'),
                    new Prompt.PromptParameter('alt', 'Alt', this.data.alt, 'alt attribute value '),
                ];
            }

            setSrc(src: string, fireUpdate: boolean = true) {
                if (src) {
                    if (this.isImg) {
                        this.$field.attr('src', src);
                    }
                    else {
                        this.$field.css('background-image', `url(${src}`);
                    }
                }
                this.updateProperty('src', src, fireUpdate);
            }

            setAlt(alt) {
                this.$field.attr(this.isImg ? 'alt' : 'title', alt);
                this.updateProperty('alt', alt);
            }

            setFile(file) {
                if (file) {
                    if (this.isImg) {
                        this.$field.attr('src', file.fileContent);
                    }
                    else {
                        this.$field.css('background-image', `url(${file.fileContent})`);
                    }
                }
                this.updateProperty('file', file);
            }

            _isImg: Boolean;
            private get isImg(): Boolean {
                return this._isImg = this._isImg || this.$field.prop('tagName').toLowerCase() === 'img';
            }
        }
    }
}