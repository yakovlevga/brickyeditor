namespace BrickyEditor {
    export namespace Fields {
        export class ImageField extends BaseField {

            bind() {
                let field = this;
                let $field = this.$field;
                let data = this.data;

                this.setSrc(this.data.src);
                $field.on('click', async () => {
                    const fields = await Editor.UI.modal.promptAsync(field.getPromptParams());                    
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
                    field.selectBlock();
                });
            }

            private getPromptParams(): Array<Prompt.PromptParameter> {
                return [
                    new Prompt.PromptParameter('src', 'Image Link', this.data.url, 'image url'),
                    new Prompt.PromptParameterImage('file', 'or Upload file', this.data.file, 'select file'),
                    new Prompt.PromptParameter('alt', 'Alt', this.data.alt, 'alt attribute value '),
                ];
            }

            setSrc(src) {
                this.data.src = src;
                if (src) {
                    if (this.isImg) {
                        this.$field.attr('src', this.data.src);
                    }
                    else {
                        this.$field.css('background-image', `url(${this.data.src}`);
                    }
                }
            }

            setAlt(alt) {
                this.data.alt = alt;
                this.$field.attr(this.isImg ? 'alt' : 'title', this.data.alt);
            }

            setFile(file) {
                this.data.file = file;
                if (file) {
                    if (this.isImg) {
                        this.$field.attr('src', this.data.file.fileContent);
                    }
                    else {
                        this.$field.css('background-image', `url(${this.data.file.fileContent})`);
                    }
                }
            }

            _isImg: Boolean;
            private get isImg(): Boolean {
                return this._isImg = this._isImg || this.$field.prop('tagName').toLowerCase() === 'img';
            }
        }
    }
}