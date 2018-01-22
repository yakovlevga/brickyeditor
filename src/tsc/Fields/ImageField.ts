namespace BrickyEditor {
    export namespace Fields {
        export class ImageField extends BaseField {

            private $link: JQuery;

            bind() {
                let field = this;
                let $field = this.$field;
                let data = this.data;

                this.setSrc(this.data.src, false);
                $field.on('click', async () => {
                    const fields = await Editor.UI.modal.promptAsync(field.getPromptParams());
                    if (fields != null) {
                        const file = fields.getValue('file');
                        const src = fields.getValue('src');
                        if (file) {
                            if(field.onUpload) {
                                field.onUpload(file, url => {
                                    field.setSrc(url);
                                    field.setFile(null);
                                });
                            }
                            else {
                                field.setFile(file);
                                field.setSrc(null);
                            }
                        }
                        else if (src) {
                            field.setSrc(src);
                            field.setFile(null);
                        }

                        const alt = fields.getValue('alt');
                        field.setAlt(alt);

                        const link = HtmlLinkParams.getLinkFromParams(fields);
                        this.setLink(link);
                    }
                    field.select();
                });
            }

            private getPromptParams(): Array<Prompt.PromptParameter> {
                var params = [
                    new Prompt.PromptParameter('src', EditorStrings.imageFieldLinkTitle, this.data.url, EditorStrings.imageFieldLinkPlaceholder),
                    new Prompt.PromptParameterImage('file', EditorStrings.imageFieldUploadTitle, this.data.file, EditorStrings.imageFieldUploadButton),
                    new Prompt.PromptParameter('alt', EditorStrings.imageFieldAltTitle, this.data.alt, EditorStrings.imageFieldAltPlaceholder),
                    new Prompt.PromptParameter(null, EditorStrings.imageFieldUrlSubtitle, null, null),
                ];

                const link: HtmlLinkParams = this.data.link ? this.data.link : new HtmlLinkParams();
                const linkParams = link.getLinkPromptParams();
                return params.concat(linkParams);
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

            setLink(url: HtmlLinkParams) {

                if (url && url.href) {
                    if (!this.$link) {
                        this.$link = $(`<a href='${url.href}' title='${url.title}' target='${url.target}'></a>`);
                        this.$link.on('click', ev => {
                            ev.stopPropagation();
                            return false;
                        });
                        this.$field.wrap(this.$link);
                    }
                    else {
                        this.$link.attr(url.href);
                    }
                }
                else if (this.$link) {
                    this.$field.unwrap();
                    this.$link = null;
                    delete this.$link;
                }

                this.updateProperty('link', url);
            }

            _isImg: Boolean;
            private get isImg(): Boolean {
                return this._isImg = this._isImg || this.$field.prop('tagName').toLowerCase() === 'img';
            }

            public getEl(): JQuery {
                let $el = super.getEl();
                const {link} = this.data;
                if(link && link.href){
                    const $link = $(`<a href='${link.href}' title='${link.title}' target='${link.target}'></a>`);
                    $link.append($el);
                    return $link;
                }
                return $el;
            }
        }
    }
}